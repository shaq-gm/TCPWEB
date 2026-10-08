import sharp from 'sharp';
import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
await copyFile(`${root}/assets/originals/logo.svg`, `${root}/dist/assets/logo.svg`);
await copyFile(`${root}/assets/originals/mobile-overlay.png`, `${root}/dist/assets/mobile-overlay.png`);
const overlay = await sharp(`${root}/assets/originals/mobile-overlay.png`)
  .webp({lossless:true, effort:6}).toFile(`${root}/dist/assets/mobile-overlay.webp`);
console.log(`mobile-overlay.webp: ${overlay.size} bytes`);
for (const width of [640, 941]) {
  for (const format of ['avif','webp','jpg']) {
    let pipeline = sharp(`${root}/assets/originals/coffee.png`).resize({width, withoutEnlargement:true});
    if (format === 'avif') pipeline = pipeline.avif({quality:60,effort:6});
    if (format === 'webp') pipeline = pipeline.webp({quality:85,effort:6});
    if (format === 'jpg') pipeline = pipeline.jpeg({quality:85,mozjpeg:true});
    const output = await pipeline.toFile(`${root}/dist/assets/coffee-${width}.${format}`);
    console.log(`coffee-${width}.${format}: ${output.size} bytes`);
  }
}
