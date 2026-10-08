import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
import { handleSubscribe, createLocalLimiter } from '../server/subscribe.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
if (existsSync(resolve(project, '.env'))) process.loadEnvFile(resolve(project, '.env'));
const root = resolve(project, 'dist');
const port = Number(process.env.PORT || 3000);
const env = { ...process.env, LOCAL_PREVIEW: 'true', SUBSCRIBE_RATE_LIMITER: createLocalLimiter() };
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.avif':'image/avif', '.webp':'image/webp', '.jpg':'image/jpeg' };
http.createServer(async (incoming, outgoing) => {
  try {
    const url = new URL(incoming.url, `http://localhost:${port}`);
    if (url.pathname === '/api/subscribe') {
      const chunks = []; let length = 0;
      for await (const chunk of incoming) {
        length += chunk.length;
        if (length > 2048) { outgoing.writeHead(413); outgoing.end(); return; }
        chunks.push(chunk);
      }
      const headers = new Headers(incoming.headers);
      headers.delete('x-vercel-forwarded-for');
      headers.delete('x-forwarded-for');
      headers.set('x-local-client-ip', incoming.socket.remoteAddress || 'local');
      const request = new Request(url, { method: incoming.method, headers, ...(incoming.method !== 'GET' && incoming.method !== 'HEAD' ? { body: Buffer.concat(chunks) } : {}) });
      const response = await handleSubscribe(request, env);
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(await response.text()); return;
    }
    if (!['GET','HEAD'].includes(incoming.method)) { outgoing.writeHead(405); outgoing.end(); return; }
    const file = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(root + sep) || !(await stat(file)).isFile()) throw new Error('not found');
    const bytes = await readFile(file);
    outgoing.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    outgoing.end(incoming.method === 'HEAD' ? undefined : bytes);
  } catch { outgoing.writeHead(404); outgoing.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://localhost:${port}`));
