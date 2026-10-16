import { readFile, writeFile, mkdir, copyFile, readdir } from "node:fs/promises";
import { build } from "esbuild";
await mkdir("dist", { recursive: true });
await mkdir("dist/assets", { recursive: true });
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
for (const page of ["index", "events", "partnerships"]) {
  let html = await readFile(`src/${page}.html`, "utf8");
  for (const part of ["header", "footer"])
    html = html.replace(
      `<!-- shared:${part} -->`,
      await readFile(`src/components/${part}.html`, "utf8"),
    );
  // Events and Tickets now resolve to the listing on both pages.
  html = html.replace(/\sdata-planned="(?:Events|Tickets|Partnerships)"/g, "");
  if (page !== "index") {
    html = html.replace('/assets/logo-white.svg', '/assets/logo-black.svg');
    await mkdir(`dist/${page}`, { recursive: true });
  }
  await writeFile(page === "index" ? "dist/index.html" : `dist/${page}/index.html`, html);
}
await copyFile("src/styles.css", "dist/styles.css");
await copyFile("src/partnerships.css", "dist/partnerships.css");
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
