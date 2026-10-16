"""Prepare article thumbnails once; normal builds use the saved local WebPs."""
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image, ImageOps
import json

root = Path(__file__).resolve().parents[1]
metadata = json.loads((root/'reports/press-sources/metadata.json').read_text(encoding='utf-8'))
entries = json.loads((root/'src/press.json').read_text(encoding='utf-8'))
sources = {r['id']: r.get('meta',{}).get('og:image') for r in metadata}
sources.update({
    'now-toronto':'https://nowtoronto.com/wp-content/uploads/2024/12/Coffee-Party.webp',
    'torontotoday':'https://www.vmcdn.ca/f/files/torontotoday/images/events/the-coffee-party/01-25-2025-thecoffeepartylibertyvillage-af-01.JPG;w=960;h=640;bgcolor=000000',
})
out = root/'assets/press'; out.mkdir(parents=True, exist_ok=True)
def prepare(entry):
    url = sources[entry['id']]
    try:
        with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=40) as response:
            data = response.read()
        im = ImageOps.exif_transpose(Image.open(BytesIO(data))).convert('RGB')
        im.thumbnail((960,960))
        im.save(out/(entry['id']+'.webp'),'WEBP',quality=82)
        return {'id':entry['id'],'url':url,'size':list(im.size),'bytes':(out/(entry['id']+'.webp')).stat().st_size}
    except Exception as error: return {'id':entry['id'],'url':url,'error':str(error)}
with ThreadPoolExecutor(max_workers=8) as executor: results=list(executor.map(prepare,entries))
(root/'reports/press-sources/image-downloads.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
for row in results: print(json.dumps(row,ensure_ascii=False))
