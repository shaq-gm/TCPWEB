import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { build } from "esbuild";
await mkdir("dist", { recursive: true });
let html = await readFile("src/index.html", "utf8");
for (const part of ["header", "footer"])
  html = html.replace(
    `<!-- shared:${part} -->`,
    await readFile(`src/components/${part}.html`, "utf8"),
  );
await writeFile("dist/index.html", html);
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
