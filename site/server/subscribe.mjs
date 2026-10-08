const MAX_BODY = 2048;
const UUID = /^pub_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const testStates = new Set(['accepted', 'confirmation_required', 'already_subscribed', 'validating', 'error', 'rate_limited']);
const reply = (status, code = 200, extra = {}) => Response.json({ status, ...extra }, {
  status: code, headers: { 'Cache-Control': 'no-store', ...(code === 429 ? { 'Retry-After': '60' } : {}) }
});

// Local preview only. Production uses an atomic, shared Redis counter.
export function createLocalLimiter() {
  const counters = new Map();
  return { async limit({ key }) {
    const now = Date.now();
    for (const [k, v] of counters) if (v.expires <= now) counters.delete(k);
    const counter = counters.get(key) || { count: 0, expires: now + 60000 };
    counter.count++; counters.set(key, counter);
    return { success: counter.count <= 5 };
  } };
}

export async function redisLimit(key, env, fetcher = fetch) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${env.BEEHIIV_API_KEY}:${key}`));
  const hash = [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2, '0')).join('');
  const script = "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],60) end; return n";
  const result = await fetcher(env.UPSTASH_REDIS_REST_URL, {
    method: 'POST', headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', script, '1', `coffee:signup:${hash}`]), signal: AbortSignal.timeout(2000)
  });
  if (!result.ok) throw new Error('limiter unavailable');
  const body = await result.json();
  if (body.error || !Number.isInteger(body.result)) throw new Error('invalid limiter response');
  return { success: body.result <= 5 };
}

function subscriptionState(data, existing = false) {
  if (!data || typeof data.id !== 'string') return reply('error', 502);
  switch (data.status) {
    case 'active': return reply(existing ? 'already_subscribed' : 'accepted');
    case 'pending': return reply('confirmation_required');
    case 'validating': return reply('validating');
    case 'invalid': return reply('invalid_email', 422);
    // An inactive subscriber must not be silently reactivated.
    default: return reply('error', 409);
  }
}

export async function handleSubscribe(request, env = {}, options = {}) {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return reply('error', 403);
  if (request.headers.get('sec-fetch-site') === 'cross-site') return reply('error', 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply('error', 415);
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return reply('error', 413);
  let body;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply('invalid_email', 400);
    const chunks = []; let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY) { await reader.cancel(); return reply('error', 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return reply('error', 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply('error', 400);
  if (body.website) return reply('ignored', 202);
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.split('@')[0].length > 64) return reply('invalid_email', 422);

  const local = env.LOCAL_PREVIEW === 'true' && !env.VERCEL;
  const mocked = local && testStates.has(env.TEST_SIGNUP_STATUS);
  if (!mocked && (!env.BEEHIIV_API_KEY || !UUID.test(env.BEEHIIV_PUBLICATION_ID || ''))) return reply('unavailable', 503);
  if (!local && (!env.UPSTASH_REDIS_REST_URL?.startsWith('https://') || !env.UPSTASH_REDIS_REST_TOKEN)) return reply('unavailable', 503);
  try {
    const key = request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || request.headers.get('x-local-client-ip') || 'unknown';
    const limit = local ? await env.SUBSCRIBE_RATE_LIMITER.limit({ key }) : await redisLimit(key, env, options.rateFetch);
    if (!limit.success) return reply('rate_limited', 429, mocked ? { test: true } : {});
  } catch { return reply('unavailable', 503); }
  if (mocked) return reply(env.TEST_SIGNUP_STATUS, env.TEST_SIGNUP_STATUS === 'rate_limited' ? 429 : env.TEST_SIGNUP_STATUS === 'error' ? 502 : 200, { test: true });

  const fetcher = options.fetcher || fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 8000);
  const base = `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`;
  const headers = { Authorization: `Bearer ${env.BEEHIIV_API_KEY}`, 'Content-Type': 'application/json' };
  try {
    const result = await fetcher(base, {
      method: 'POST', headers, signal: controller.signal,
      body: JSON.stringify({ email, reactivate_existing: false, send_welcome_email: false, double_opt_override: 'not_set', skip_newsletter_list_auto_subscribe: true })
    });
    if (result.status === 429) return reply('rate_limited', 429);
    // Only an explicit conflict triggers a lookup. A generic rejection is not proof of membership.
    if (result.status === 409) {
      const lookup = await fetcher(`${base}/by_email/${encodeURIComponent(email)}`, { headers, signal: controller.signal });
      if (lookup.status === 429) return reply('rate_limited', 429);
      if (!lookup.ok) return reply('error', 502);
      return subscriptionState((await lookup.json()).data, true);
    }
    if (!result.ok) return reply('error', 502);
    return subscriptionState((await result.json()).data);
  } catch { return reply('error', 502); }
  finally { clearTimeout(timer); }
}
