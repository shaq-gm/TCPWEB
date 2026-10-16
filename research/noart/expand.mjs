import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('./',import.meta.url);
await mkdir(new URL('pages/',root),{recursive:true});
const manifest=JSON.parse(await readFile(new URL('source-manifest.json',root),'utf8'));
const slater=await readFile(new URL('sources/22-20350.js',root),'utf8');
const moduleUrls=[...slater.matchAll(/import\("([^"]+)"\)/g)].map(m=>m[1]);
const routes=['/events','/products','/label','/gallery','/about','/tickets','/foundation','/contact','/jobs','/delivery-returns','/terms-conditions','/events/no-art-lisbon','/products/yellow-canvas-tee','/sitemap.xml','/robots.txt'];
const results=await Promise.all([...moduleUrls,...routes.map(p=>'https://www.noartmusic.com'+p)].map(async(url)=>{
 try {const res=await fetch(url);const body=await res.text(); const u=new URL(url);const filename=u.hostname==='assets.slater.app'?`sources/slater-${u.pathname.split('/').pop()}`:`pages/${u.pathname.slice(1).replaceAll('/','--')||'index'}.${u.pathname.endsWith('.xml')?'xml':u.pathname.endsWith('.txt')?'txt':'html'}`; await writeFile(new URL(filename,root),body);return {url,status:res.status,bytes:Buffer.byteLength(body),filename};} catch(e){return {url,error:String(e)}}
}));
manifest.expanded=results;
await writeFile(new URL('source-manifest.json',root),JSON.stringify(manifest,null,2));
for(const p of results.filter(r=>r.filename?.endsWith('.html'))){const html=await readFile(new URL(p.filename,root),'utf8'); await writeFile(new URL(p.filename.replace('.html','.inline.js'),root),[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m=>!m[1].includes('src=')).map(m=>m[2]).join('\n\n'));}
console.log(JSON.stringify(results,null,2));
const css=await readFile(new URL('sources/00-noartmusic.webflow.shared.e5882faae.css',root),'utf8');
console.log('FONT FACES',css.match(/@font-face\{[^}]+\}/g));
console.log('TOKENS',css.match(/:root\{[^}]+\}/g));
