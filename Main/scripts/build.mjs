import { readFile, writeFile, mkdir, copyFile, readdir } from "node:fs/promises";
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";
await mkdir("dist", { recursive: true });
await mkdir("dist/assets", { recursive: true });
const press = JSON.parse(await readFile("src/press.json", "utf8"));
await mkdir("dist/assets/press", { recursive: true });
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const pressDateValue = (item) => {
  const value = Date.parse(item.sortDate || item.date);
  if (Number.isNaN(value)) throw new Error(`Unparseable press date: ${item.id} (${item.sortDate || item.date})`);
  return value;
};
const pressSorted = [...press].sort((a, b) => pressDateValue(b) - pressDateValue(a));
const pressIds = new Set();
const pressCards = [];
for (const item of pressSorted) {
  if (!/^[a-z0-9-]+$/.test(item.id) || pressIds.has(item.id) || new URL(item.url).protocol !== "https:") throw new Error(`Invalid press entry: ${item.id}`);
  pressIds.add(item.id);
  await copyFile(`assets/press/${item.id}.webp`, `dist/assets/press/${item.id}.webp`);
  const action = item.action || "Read the article";
  pressCards.push(`<article class="showcase-card showcase-press-card" data-press-id="${item.id}">
    <a class="press-image-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(`${item.outlet}: ${item.title}`)}">
      <div class="showcase-media press-media"><img class="showcase-photo" src="${escapeHtml(item.image)}" width="${item.imageWidth}" height="${item.imageHeight}" alt="${escapeHtml(item.imageAlt)}" loading="lazy" decoding="async" /></div>
    </a>
    <p class="press-image-credit">Image: ${escapeHtml(item.imageCredit)}</p>
    <span class="eyebrow">${escapeHtml(item.outlet)}</span>
    <p class="press-meta">${escapeHtml([item.kind, item.date].filter(Boolean).join(" · "))}</p>
    <h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p>
    <a class="text-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(`${action}: ${item.outlet}, ${item.title}`)}">${escapeHtml(action)} <span aria-hidden="true">↗</span></a>
  </article>`);
}
// Keep the supplied transparent PNG intact; ship a smaller alpha WebP.
execFileSync(ffmpeg, ["-y", "-i", "../Assests/cup.png", "-vf", "scale=900:900", "-c:v", "libwebp", "-quality", "85", "-compression_level", "6", "dist/assets/partner-cup.webp"], { stdio: "pipe", windowsHide: true });
for (const [source, destination] of [
  ["can1.webp", "can1.webp"],
  ["can2.webp", "can2.webp"],
]) await copyFile(`../Assests/${source}`, `dist/assets/${destination}`);
await mkdir("dist/assets/store-logos", { recursive: true });
for (const file of await readdir("../Assests/STORE-logos")) {
  if (/\.png$/i.test(file))
    await copyFile(`../Assests/STORE-logos/${file}`, `dist/assets/store-logos/${file}`);
}
await mkdir("dist/assets/brand-logos", { recursive: true });
for (const file of await readdir("../Assests/brand-logos")) {
  if (/\.png$/i.test(file))
    await copyFile(`../Assests/brand-logos/${file}`, `dist/assets/brand-logos/${file}`);
}
for (const page of ["index", "events", "partnerships", "community", "our-story"]) {
  let html = await readFile(`src/${page}.html`, "utf8");
  html = html.replace("<!-- press:cards -->", pressCards.join("\n"));
  for (const part of ["header", "footer", "community-signup"])
    html = html.replace(
      `<!-- shared:${part} -->`,
      await readFile(`src/components/${part}.html`, "utf8"),
    );
  // Activate built routes in shared navigation and contextual links.
  html = html.replace(/\sdata-planned="(?:Events|Tickets|Partnerships|Community|Our Story)"/g, "");
  if (page === "our-story") html = html.replaceAll('href="/our-story"', 'href="/our-story" aria-current="page"');
  if (page === "community") html = html.replaceAll('href="/community"', 'href="/community" aria-current="page"');
  if (page !== "index") {
    if (!["partnerships", "community"].includes(page)) html = html.replace('/assets/logo-white.svg', '/assets/logo-black.svg');
    await mkdir(`dist/${page}`, { recursive: true });
  }
  await writeFile(page === "index" ? "dist/index.html" : `dist/${page}/index.html`, html);
}
await copyFile("src/styles.css", "dist/styles.css");
await copyFile("src/partnerships.css", "dist/partnerships.css");
await copyFile("src/community.css", "dist/community.css");
await copyFile("src/about.css", "dist/about.css");
await build({
  entryPoints: ["src/app.js"],
  bundle: true,
  minify: true,
  format: "esm",
  target: ["es2022"],
  outfile: "dist/app.js",
  legalComments: "eof",
});
console.log("Built Main/dist with shared header/footer.");
