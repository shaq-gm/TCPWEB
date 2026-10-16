import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".ttf": "font/ttf",
  ".txt": "text/plain",
};
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const route = url.pathname.match(/^\/(events|partnerships|community|our-story)\/?$/);
    const pathname = route ? `/${route[1]}/index.html` : url.pathname;
    const path = resolve(
      root,
      `.${decodeURIComponent(pathname === "/" ? "/index.html" : pathname)}`,
    );
    if (!path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    const info = await stat(path);
    if (!info.isFile()) throw new Error("Not a file");
    const headers = {
      "Content-Type": types[extname(path)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "Accept-Ranges": "bytes",
    };
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]),
        end = range[2]
          ? Math.min(Number(range[2]), info.size - 1)
          : info.size - 1;
      if (start > end || start >= info.size) {
        res.writeHead(416, { "Content-Range": `bytes */${info.size}` }).end();
        return;
      }
      res.writeHead(206, {
        ...headers,
        "Content-Range": `bytes ${start}-${end}/${info.size}`,
        "Content-Length": end - start + 1,
      });
      if (req.method === "HEAD") res.end();
      else createReadStream(path, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { ...headers, "Content-Length": info.size });
      if (req.method === "HEAD") res.end();
      else createReadStream(path).pipe(res);
    }
  } catch {
    res
      .writeHead(404, { "Content-Type": "text/plain" })
      .end("This page is part of a later stage. Return to the homepage.");
  }
});
const port = Number(process.env.PORT || 3100);
server.listen(port, "127.0.0.1", () =>
  console.log(`Coffee Party preview: http://127.0.0.1:${port}`),
);
