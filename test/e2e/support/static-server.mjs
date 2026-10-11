#!/usr/bin/env node
// Serves a static folder for the Playwright "storybook" project (task 1.1; ADR-011).
//
//   node test/e2e/support/static-server.mjs <dir> <port>
//
// `npm run build-storybook` writes storybook-static/; component tasks in waves 2 and 3 test
// behaviour on their stories (iframe.html?id=<story-id>) before any page exists. When the folder
// is missing the server still starts, answers a plain page at "/" and 404 elsewhere, so a run that
// has no story specs is not blocked by an unbuilt Storybook.

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const [dirArg = "storybook-static", portArg = "6007"] = process.argv.slice(2);
const root = resolve(dirArg);
const port = Number(portArg);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  if (!existsSync(root)) {
    res.writeHead(path === "/" ? 200 : 404, { "content-type": "text/plain; charset=utf-8" });
    res.end(path === "/" ? `No ${dirArg}/ yet: run npm run build-storybook.` : "Not found");
    return;
  }
  let file = normalize(join(root, path));
  if (!file.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`[static-server] ${dirArg} on http://localhost:${port}${existsSync(root) ? "" : " (folder missing)"}`);
});
