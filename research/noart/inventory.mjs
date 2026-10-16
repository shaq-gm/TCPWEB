import{readFile,writeFile,readdir}from'node:fs/promises';
const root=new URL('./',import.meta.url);const docs=[['/',await readFile(new URL('home.html',root),'utf8')]];
for(const f of await readdir(new URL('pages/',root)))if(f.endsWith('.html'))docs.push(['/'+f.replace('.html','').replaceAll('--','/'),await readFile(new URL('pages/'+f,root),'utf8')]);
const assets=new Map(),extra=new Set(),pages=[];
for(const[path,html]of docs){
 const tags=[...html.matchAll(/<(img|video|audio|source|iframe|link|script)\b([^>]*)>/gi)].map(m=>({tag:m[1],attrs:m[2]}));
 for(const {tag,attrs}of tags){for(const m of attrs.matchAll(/(?:src|href|data-src|poster)=["'](https?:\/\/[^"']+)/g)){const url=m[1].replaceAll('&amp;','&'); if(!assets.has(url))assets.set(url,{url,tag,pages:[]});assets.get(url).pages.push(path);if(tag==='link'&&/stylesheet/.test(attrs)&&url.includes('website-files'))extra.add(url);}}
 const attrNames=[...new Set([...html.matchAll(/\s((?:data-|sf-|fs-)[\w-]+)=/g)].map(m=>m[1]))];
 pages.push({path,title:html.match(/<title>([^<]+)/)?.[1],pageId:html.match(/data-wf-page="([^"]+)/)?.[1],bytes:Buffer.byteLength(html),headings:[...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(m=>({tag:m[1],text:m[2].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()})),iframes:tags.filter(t=>t.tag==='iframe'),attributeNames:attrNames,scripts:tags.filter(t=>t.tag==='script').map(t=>t.attrs.match(/src="([^"]+)/)?.[1]).filter(Boolean),links:[...new Set([...html.matchAll(/<a\b[^>]*href="([^"]+)/g)].map(m=>m[1]))]});
}
const manifest=JSON.parse(await readFile(new URL('source-manifest.json',root),'utf8'));const known=new Set(manifest.results.map(r=>r.url));
const results=await Promise.all([...extra].filter(u=>!known.has(u)).map(async(url,i)=>{const r=await fetch(url);const body=await r.text();const filename='sources/page-'+i+'-'+new URL(url).pathname.split('/').pop();await writeFile(new URL(filename,root),body);return{url,status:r.status,bytes:body.length,filename}}));
manifest.pageStyles=results;await writeFile(new URL('source-manifest.json',root),JSON.stringify(manifest,null,2));
await writeFile(new URL('asset-inventory.json',root),JSON.stringify([...assets.values()].map(a=>({...a,pages:[...new Set(a.pages)]})),null,2));
await writeFile(new URL('page-inventory.json',root),JSON.stringify(pages,null,2));
const home=docs[0][1];console.log('HOME FONT FACES', [...home.matchAll(/@font-face\s*\{[^}]+\}/g)].map(m=>m[0]));
console.log('EXTRA CSS',results);
console.log('PAGES',pages.map(({path,title,headings,iframes,attributeNames})=>({path,title,headings,iframes,attributeNames:attributeNames.filter(n=>/gallery|filter|swiper|audio|sf-|fs-|popup|form/.test(n))})));
console.log('FONT ASSETS', [...assets.values()].filter(a=>/woff|\.ttf|\.otf/.test(a.url)));
