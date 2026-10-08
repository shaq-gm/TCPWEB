import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
const chromePath = process.env.CHROME_PATH || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
const chrome = await launch({chromePath, chromeFlags:['--headless', '--no-first-run']});
try {
  const result = await lighthouse('http://localhost:3000', {port:chrome.port, output:['html','json'], onlyCategories:['performance','accessibility','best-practices','seo'], logLevel:'error'}, {
    extends:'lighthouse:default', settings:{formFactor:'mobile', screenEmulation:{mobile:true,width:390,height:844,deviceScaleFactor:3,disabled:false}, throttlingMethod:'simulate'}
  });
  await mkdir('reports',{recursive:true});
  await writeFile('reports/lighthouse.html',result.report[0]);
  await writeFile('reports/lighthouse.json',result.report[1]);
  const lhr = result.lhr;
  const summary = {
    date:'2026-10-08', lighthouseVersion:lhr.lighthouseVersion, userAgent:lhr.userAgent,
    conditions:lhr.configSettings,
    scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,v.score*100])),
    LCP:lhr.audits['largest-contentful-paint'].numericValue,
    CLS:lhr.audits['cumulative-layout-shift'].numericValue,
    totalTransfer:lhr.audits['total-byte-weight'].numericValue,
    resources:lhr.audits['network-requests'].details.items.map(v=>({url:v.url,transferSize:v.transferSize,resourceSize:v.resourceSize}))
  };
  await writeFile('reports/performance.json',JSON.stringify(summary,null,2));
  console.log(JSON.stringify(summary,null,2));
} finally { await chrome.kill(); }
