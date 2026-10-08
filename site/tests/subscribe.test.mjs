import test from 'node:test';
import assert from 'node:assert/strict';
import { handleSubscribe, createLocalLimiter, redisLimit } from '../server/subscribe.mjs';

const configuration = () => ({ LOCAL_PREVIEW: 'true', BEEHIIV_API_KEY: 'test-secret', BEEHIIV_PUBLICATION_ID: 'pub_00000000-0000-0000-0000-000000000000', SUBSCRIBE_RATE_LIMITER: createLocalLimiter() });
const request = (body = { email: 'tester@example.com', website: '' }, headers = {}) => new Request('http://localhost:3000/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', ...headers }, body: JSON.stringify(body) });
const subscription = status => Response.json({ data: { id: 'sub_test', status } });
for (const [upstream, state, code] of [['active','accepted',200],['pending','confirmation_required',200],['validating','validating',200],['invalid','invalid_email',422],['inactive','error',409],['paused','error',409],['needs_attention','error',409]]) {
  test(`maps ${upstream} without claiming unconfirmed membership`, async () => {
    const response = await handleSubscribe(request(), configuration(), { fetcher: async () => subscription(upstream) });
    assert.equal(response.status, code); assert.equal((await response.json()).status, state);
  });
}
test('passes secure, explicit subscription options to the intended publication', async () => {
  await handleSubscribe(request(), configuration(), { fetcher: async (url, init) => {
    assert.match(url, /publications\/pub_00000000-0000-0000-0000-000000000000\/subscriptions$/);
    assert.equal(init.headers.Authorization, 'Bearer test-secret');
    assert.deepEqual(JSON.parse(init.body), { email:'tester@example.com', reactivate_existing:false, send_welcome_email:false, double_opt_override:'not_set', skip_newsletter_list_auto_subscribe:true });
    return subscription('active');
  } });
});
test('rejects invalid emails and honeypots without calling Beehiiv', async () => {
  let calls = 0; const fetcher = async () => { calls++; return subscription('active'); };
  for (const email of ['', 'bad', 'x@y', 'x @test.com', 'a'.repeat(255) + '@test.com']) {
    assert.equal((await handleSubscribe(request({ email }), configuration(), { fetcher })).status, 422);
  }
  assert.equal((await handleSubscribe(request({ email:'tester@example.com', website:'bot' }), configuration(), { fetcher })).status, 202);
  assert.equal(calls, 0);
});
test('enforces origin, method, content type and streamed body size', async () => {
  assert.equal((await handleSubscribe(request(undefined, {Origin:'https://evil.example'}), configuration())).status, 403);
  assert.equal((await handleSubscribe(new Request('http://localhost/api/subscribe'), configuration())).status, 405);
  assert.equal((await handleSubscribe(request(undefined, {'Content-Type':'text/plain'}), configuration())).status, 415);
  assert.equal((await handleSubscribe(request({email:'tester@example.com', extra:'x'.repeat(2500)}), configuration())).status, 413);
});
test('missing credentials never report a successful signup', async () => {
  const r = await handleSubscribe(request(), {LOCAL_PREVIEW:'true'});
  assert.equal(r.status, 503); assert.equal((await r.json()).status, 'unavailable');
});
test('local test success is explicitly marked; production ignores test settings', async () => {
  const env = { ...configuration(), BEEHIIV_API_KEY: '', TEST_SIGNUP_STATUS:'accepted' };
  assert.deepEqual(await (await handleSubscribe(request(), env)).json(), {status:'accepted', test:true});
  assert.equal((await handleSubscribe(request(), {...env, VERCEL:'1'})).status, 503);
});
test('limits repeated attempts and requests a retry after 60 seconds', async () => {
  const env = configuration();
  for (let i = 0; i < 5; i++) assert.equal((await handleSubscribe(request(), env, {fetcher: async () => subscription('active')})).status, 200);
  const r = await handleSubscribe(request(), env);
  assert.equal(r.status, 429); assert.equal(r.headers.get('Retry-After'), '60');
});
test('sanitizes upstream rejection, invalid payload, and network failure', async () => {
  for (const fetcher of [async()=>new Response('test-secret', {status:401}), async()=>Response.json({data:{}}), async()=>{throw Error('test-secret');}]) {
    const r = await handleSubscribe(request(), configuration(), {fetcher});
    assert.equal(r.status, 502); assert.equal(await r.text(), '{"status":"error"}');
  }
});
test('passes through upstream rate limiting', async () => {
  assert.equal((await handleSubscribe(request(), configuration(), {fetcher:async()=>new Response('',{status:429})})).status, 429);
});
test('aborts an upstream timeout and permits retry', async () => {
  const r = await handleSubscribe(request(), configuration(), { timeoutMs:10, fetcher:async (_url, {signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('timeout')))) });
  assert.equal(r.status, 502);
});
test('existing active subscriber conflict is checked without reactivation', async () => {
  let count = 0;
  const r = await handleSubscribe(request(), configuration(), {fetcher:async(url, init)=>{
    count++; if (count===1) return new Response('',{status:409});
    assert.match(url, /by_email\/tester%40example.com$/); assert.equal(init.method, undefined); return subscription('active');
  }});
  assert.equal((await r.json()).status, 'already_subscribed'); assert.equal(count,2);
});
test('Redis uses an atomic expiry and hashed identifier, and fails closed', async () => {
  const env = {...configuration(), LOCAL_PREVIEW:'false', UPSTASH_REDIS_REST_URL:'https://redis.example', UPSTASH_REDIS_REST_TOKEN:'redis-test'};
  const fetcher = async(url, init)=>{
    const payload=JSON.parse(init.body);
    assert.equal(url, env.UPSTASH_REDIS_REST_URL); assert.equal(payload[0],'EVAL');
    assert.match(payload[1], /EXPIRE/); assert.doesNotMatch(payload[3], /127\.0\.0\.1|test-secret/);
    return Response.json({result:6});
  };
  assert.equal((await redisLimit('127.0.0.1', env, fetcher)).success,false);
  const r = await handleSubscribe(request(), env, {rateFetch:async()=>new Response('',{status:503})});
  assert.equal(r.status,503);
});
