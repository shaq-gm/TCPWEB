import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('./', import.meta.url);
await mkdir(new URL('sources/', root), {recursive:true});
const html = await readFile(new URL('home.html',root),'utf8');
const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].map((m,i)=>({i,attrs:m[1],src:m[1].match(/\bsrc=["']([^"']+)/i)?.[1],text:m[2]}));
const styles=[...html.matchAll(/<link\b[^>]*>/gi)].map(m=>m[0]).filter(t=>/stylesheet/i.test(t)).map(t=>t.match(/href=["']([^"']+)/i)?.[1]).filter(Boolean);
await writeFile(new URL('inline-home.js',root),scripts.filter(s=>!s.src).map(s=>`// INLINE SCRIPT ${s.i} ${s.attrs}\n${s.text}`).join('\n\n'));
await writeFile(new URL('inline-home.css',root),[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1]).join('\n\n'));
const links=[...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m=>({href:m[1],label:m[2].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}));
await writeFile(new URL('links.json',root),JSON.stringify(links,null,2));
const urls=[...new Set([...styles,...scripts.map(s=>s.src).filter(Boolean),'https://assets.slater.app/slater/20350.js?v=1.0'])];
const results=await Promise.all(urls.map(async(url,i)=>{
 try {const res=await fetch(url); const body=await res.text(); const filename=`sources/${String(i).padStart(2,'0')}-${new URL(url).pathname.split('/').pop().replace(/[^a-z\d._-]/gi,'_')}`; await writeFile(new URL(filename,root),body);return {url,status:res.status,bytes:Buffer.byteLength(body),sha256:createHash('sha256').update(body).digest('hex'),filename,headers:Object.fromEntries(res.headers)};}
 catch(e){return {url,error:String(e)}}
}));
await writeFile(new URL('source-manifest.json',root),JSON.stringify({capturedAt:new Date().toISOString(),scripts:scripts.map(({text,...s})=>s),styles,results},null,2));
console.log(JSON.stringify(results.map(({url,status,bytes,filename,error})=>({url,status,bytes,filename,error})),null,2));
console.log('Internal links:',[...new Set(links.map(l=>l.href).filter(h=>h.startsWith('/')))].join('\n'));
