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
for (const page of ["index", "events"]) {
  let html = await readFile(`src/${page}.html`, "utf8");
  for (const part of ["header", "footer"])
    html = html.replace(
      `<!-- shared:${part} -->`,
      await readFile(`src/components/${part}.html`, "utf8"),
    );
  // Events and Tickets now resolve to the listing on both pages.
  html = html.replace(/\sdata-planned="(?:Events|Tickets)"/g, "");
  if (page === "events") {
    html = html.replace('/assets/logo-white.svg', '/assets/logo-black.svg');
    await mkdir("dist/events", { recursive: true });
  }
  await writeFile(page === "index" ? "dist/index.html" : "dist/events/index.html", html);
}
await copyFile("src/styles.css", "dist/styles.css");
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
