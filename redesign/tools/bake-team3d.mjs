#!/usr/bin/env node
/* Bake the team page's 3D table offline (run again whenever a founder photo, landmarks.json or the scene changes):
 *  1. assets/img/team/<key>-body.webp: each founder's cut-out carried on below the chest as their body (the per-pixel
 *     work team3d-scene.js would otherwise do on every visitor's phone).
 *  2. assets/img/team/table-wide*.webp and table-tall*.webp: stills of the opening wide shot (landscape and portrait),
 *     shown as the poster until the 3D has loaded (tools/optimize.mjs puts the <picture> in the page).
 * It serves this folder on a free port, opens /team in headless Chrome (DevTools protocol over Node's WebSocket) with
 * ?t3bake&t3capture, and saves what the scene hands back. Needs Node ≥ 22, Google Chrome (CHROME=… to override) and cwebp.
 *   node tools/bake-team3d.mjs */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import os from "node:os";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets/img/team");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4", ".m4a": "audio/mp4" };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "bake-team3d-"));
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check",
  "--enable-unsafe-swiftshader", "--hide-scrollbars", "--mute-audio", "about:blank"], { stdio: "ignore" });
const portFile = path.join(profile, "DevToolsActivePort");
for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await new Promise((r) => setTimeout(r, 100));
const port = fs.readFileSync(portFile, "utf8").split("\n")[0];
const target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const waiting = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } });
const send = (method, params = {}) => new Promise((resolve, reject) => { const i = ++id; waiting.set(i, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result))); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const saveData = (url, file) => { fs.writeFileSync(file, Buffer.from(url.split(",")[1], "base64")); console.log(`  ${path.relative(ROOT, file)} ${(fs.statSync(file).size / 1024).toFixed(1)} KB`); };
const cwebp = (src, w, out, q = 76) => { execFileSync("cwebp", ["-quiet", "-m", "6", "-q", String(q), ...(w ? ["-resize", String(w), "0"] : []), src, "-o", out]); console.log(`  ${path.relative(ROOT, out)} ${(fs.statSync(out).size / 1024).toFixed(1)} KB`); };

async function shot(width, height, dpr, bake) {
  // The stage is 100svh minus the 5.25rem CTA bar, so the window is 84px taller than the picture.
  await send("Emulation.setDeviceMetricsOverride", { width, height: height + 84, deviceScaleFactor: dpr, mobile: false });
  await send("Page.navigate", { url: `${base}/team/?t3capture${bake ? "&t3bake" : ""}` });
  for (let i = 0; i < 300; i++) { await sleep(200); if (await evaluate("!!window.__t3capture && document.querySelector('[data-t3]').classList.contains('is-ready')")) break; }
  await evaluate("window.dispatchEvent(new Event('scroll'))");
  await sleep(1500); // a few frames of the idle motion
  return evaluate(`({ img: window.__t3capture(), bake: window.__t3bake || null, size: [document.querySelector('.t3__canvas').width, document.querySelector('.t3__canvas').height] })`);
}

try {
  await send("Page.enable"); await send("Runtime.enable");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "bake-team3d-img-"));
  console.log("bake-team3d: bodies and the landscape still");
  const wide = await shot(1920, 1080, 1, true);
  if (!wide.bake) throw new Error("the scene did not return the baked bodies");
  for (const [k, url] of Object.entries(wide.bake)) saveData(url, path.join(OUT, `${k}-body.webp`));
  saveData(wide.img, path.join(tmp, "wide.webp"));
  cwebp(path.join(tmp, "wide.webp"), 0, path.join(OUT, "table-wide.webp"), 72);
  cwebp(path.join(tmp, "wide.webp"), 1280, path.join(OUT, "table-wide-1280.webp"), 74);
  console.log("bake-team3d: the portrait still");
  const tall = await shot(720, 1404, 1.5, false); // a phone's stage is about 0.51 wide for 1 tall
  saveData(tall.img, path.join(tmp, "tall.webp"));
  cwebp(path.join(tmp, "tall.webp"), 1080, path.join(OUT, "table-tall-1080.webp"), 70);
  cwebp(path.join(tmp, "tall.webp"), 720, path.join(OUT, "table-tall.webp"), 72);
  console.log("bake-team3d: done");
} finally {
  ws.close(); chrome.kill(); server.close();
  setTimeout(() => fs.rmSync(profile, { recursive: true, force: true }), 500);
}
