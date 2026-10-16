"""One-time source inspection; raw evidence stays in ignored reports/."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen
import json

class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(); self.values = {}; self.images = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'meta':
            key = d.get('property', d.get('name', ''))
            if key: self.values[key] = d.get('content', '')
        if tag == 'img': self.images.append({k:d[k] for k in ('src','alt') if k in d})

root = Path(__file__).resolve().parents[1]
report = root/'reports'/'press-sources'; report.mkdir(parents=True, exist_ok=True)
entries = json.loads((root/'src'/'press.json').read_text(encoding='utf-8'))
def inspect(entry):
    record = {'id':entry['id'], 'url':entry['url']}
    try:
        request = Request(entry['url'], headers={'User-Agent':'Mozilla/5.0'})
        with urlopen(request, timeout=35) as response:
            body = response.read().decode('utf-8', errors='replace')
            record.update(status=response.status, finalUrl=response.url)
        (report/(entry['id']+'.html')).write_text(body, encoding='utf-8')
        parser = Metadata(); parser.feed(body)
        record.update(meta=parser.values, images=parser.images[:12])
    except Exception as error: record['error'] = str(error)
    return record
with ThreadPoolExecutor(max_workers=8) as executor:
    results = list(executor.map(inspect, entries))
(report/'metadata.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
for r in results:
    print(json.dumps({'id':r['id'], 'status':r.get('status',r.get('error')), 'title':r.get('meta',{}).get('og:title'), 'image':r.get('meta',{}).get('og:image')},ensure_ascii=False))
