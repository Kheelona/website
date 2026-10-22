#!/usr/bin/env node
/* Kheelona redesign: the deploy build's optimise step. Reads the built site (index.html, <route>/index.html and
 * assets/) and writes a complete static site to dist/. Sources are never modified.
 *
 *   node tools/optimize.mjs            (normally run by tools/build-site.sh, after build-pages.py)
 *   CSS_MODE=link node tools/optimize.mjs   link the per-page stylesheet instead of inlining it
 *
 * What it does, per page:
 *  - CSS: site.css + pages.css + the page's own CSS → one minified stylesheet. It is inlined into the page by default
 *    (15–17 KB brotli: cheaper than a render-blocking request on a phone), and is also written to dist as a hashed file.
 *  - JS: GSAP + ScrollTrigger + Lenis → one shared vendor file; main.js + pages.js + the page's JS → one app file;
 *    module scripts (the team 3D scene) are bundled with esbuild (code-split, tree-shaken three.js chunk).
 *  - Images: responsive variants (srcset) where the page would otherwise download far more pixels than it shows,
 *    PNG → WebP, SVGO for SVGs, no loading="lazy" in a page hero, accessible names (see IMG_RULES / fixHtml).
 *  - Every asset referenced from HTML, CSS or JS gets a content hash in its filename (cache for a year, immutable);
 *    references are rewritten. Assets fetched by computed URLs (Khelu's voice clips) keep their own names.
 *  - Comments are removed except the integration markers (<!--tracking-head-->, <!--tracking-body-->, <!--robots-->).
 * Writes dist/asset-manifest.json (original path → hashed path, the bundles of every page, the cache rules).
 *
 * Generated images are COMMITTED, never made at deploy time (a git-triggered Vercel build has Node and Python only):
 * the responsive variants, PNG → WebP and SVGO output live in assets/gen/ (indexed by assets/gen/variants.json: each
 * file's source, the source's hash and the encoder settings). A deploy build only reads them, and fails, listing the
 * files, when one it needs is missing or stale. They are (re)made on this Mac by the local asset step:
 *   node tools/optimize.mjs --make-variants   (tools/build-assets.sh runs it last; needs cwebp, and npx for svgo)
 * which also removes variants no page uses any more. Then commit assets/gen/.
 * Needs Node 22 and the website's pinned esbuild devDependency (package.json). */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import zlib from "node:zlib";
import { createRequire } from "node:module";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const CACHE = path.join(ROOT, ".cache", "optimize");
const CSS_MODE = process.env.CSS_MODE === "link" ? "link" : "inline";
const MAKE = process.argv.includes("--make-variants");
const t0 = Date.now();

/* ---------- Tools ---------- */
// esbuild is the website's own pinned devDependency (website/package.json): nothing is downloaded at build time.
const ESB = createRequire(path.join(ROOT, "..", "package.json"))("esbuild");
// Only the local asset step (--make-variants) encodes images: cwebp from Homebrew, svgo 3.3.2 through npx.
const which = (bin) => { try { return execFileSync("sh", ["-c", `command -v ${bin}`], { encoding: "utf8" }).trim() || null; } catch { return null; } };
const CWEBP = MAKE ? which("cwebp") : null;
if (MAKE && !CWEBP) { console.error("optimize --make-variants: cwebp not found (brew install webp)"); process.exit(1); }
let SVGO = null;
if (MAKE) try { SVGO = execFileSync("npx", ["-y", "-p", "svgo@3.3.2", "-c", "command -v svgo"], { encoding: "utf8" }).trim(); } catch { console.error("optimize --make-variants: svgo 3.3.2 unavailable through npx"); process.exit(1); }

/** esbuild transform: CSS or JS in, minified out (the same as the CLI reading stdin). */
const minify = (code, loader) => ESB.transformSync(code, { loader, minify: true, legalComments: "none", logLevel: "error" }).code;

/* ---------- Helpers ---------- */
const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => { try { fs.accessSync(p); return true; } catch { return false; } };
const mkdirp = (p) => fs.mkdirSync(p, { recursive: true });
const write = (p, data) => { mkdirp(path.dirname(p)); fs.writeFileSync(p, data); };
const sha = (buf, n = 10) => crypto.createHash("sha256").update(buf).digest("hex").slice(0, n);
const rel = (abs) => path.relative(ROOT, abs).split(path.sep).join("/");
const br = (s) => zlib.brotliCompressSync(Buffer.from(s), { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
const kb = (n) => (n / 1024).toFixed(1) + " KB";

/** Width/height of a PNG or WebP, read from its header. */
function imgSize(file) {
  const b = fs.readFileSync(file);
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.length > 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const f = b.toString("ascii", 12, 16);
    if (f === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (f === "VP8L") { const v = b.readUInt32LE(21); return { w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }; }
    if (f === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  }
  return null;
}

/* ---------- Assets: virtual (generated) files and content hashes ---------- */
// Generated files (image variants, PNG→WebP, SVGO output) live in .cache and are addressed by a virtual path under assets/.
const VIRTUAL = new Map(); // "assets/img/x-640.webp" → absolute cache file
const srcOf = (r) => VIRTUAL.get(r) || path.join(ROOT, r);
const assetExists = (r) => VIRTUAL.has(r) || exists(path.join(ROOT, r));
const HASHED = new Map(); // "assets/img/x.webp" → "assets/img/x.<hash>.webp"
const SWAP = new Map(); // a reference that is served as another file (x.png → x.webp, x.svg → optimised x.svg)
function hashed(r) {
  r = SWAP.get(r) || r;
  if (HASHED.has(r)) return HASHED.get(r);
  const buf = fs.readFileSync(srcOf(r));
  const ext = path.extname(r), out = `${r.slice(0, -ext.length)}.${sha(buf)}${ext}`;
  write(path.join(DIST, out), buf);
  HASHED.set(r, out);
  return out;
}
// Only these trees hold files that pages, CSS and JS reference by URL. css/js/vendor are bundled instead.
const ASSET_DIRS = ["assets/img", "assets/fonts", "assets/video", "assets/audio"];
const SKIP_DIRS = ["assets/audio/pipeline-a-src"]; // source recordings, never served
const isMediaRef = (r) => ASSET_DIRS.some((d) => r.startsWith(d + "/")) && !SKIP_DIRS.some((d) => r.startsWith(d + "/"));

/** Rewrite every reference to a media file (absolute "/assets/…" or root-relative "assets/…") to its hashed URL. */
const REF_RE = /(^|[\s"'`(,=:])(\/?)(assets\/[A-Za-z0-9_\-./@]+\.[A-Za-z0-9]{2,5})(?=$|[\s"'`),?#])/gm;
function rewriteRefs(text) {
  return text.replace(REF_RE, (m, pre, slash, r) => (isMediaRef(r) && assetExists(r) ? `${pre}/${hashed(r)}` : m));
}

/* ---------- Images: generated variants (committed in assets/gen, see the header) ---------- */
const GEN = path.join(ROOT, "assets", "gen");
const GEN_INDEX = path.join(GEN, "variants.json");
const genIndex = exists(GEN_INDEX) ? JSON.parse(read(GEN_INDEX)) : {};
const genUsed = new Set();
const genMissing = new Set();
/** The committed file for virtual path v, made from src with an encoder (`args` names its settings). Returns the file,
 *  or null when the encoder kept nothing (an output that wasn't smaller). Deploy builds never encode: a missing or stale
 *  file is recorded and the build fails at the end. --make-variants encodes it with `make(out)` (true = keep). */
function generated(v, src, args, make) {
  const file = path.join(GEN, v.replace(/^assets\//, "")), from = rel(src), srcSha = sha(fs.readFileSync(src), 16);
  const e = genIndex[v];
  const fresh = e && e.from === from && e.sha === srcSha && e.args === args;
  if (fresh && (e.keep === false || exists(file))) { genUsed.add(v); return e.keep === false ? null : file; }
  if (!MAKE) { genMissing.add(`${v}  (${fresh ? "missing" : e ? "stale: its source or settings changed" : "not made yet"}; from ${from})`); return null; }
  mkdirp(path.dirname(file));
  const keep = make(file);
  if (!keep) fs.rmSync(file, { force: true });
  genIndex[v] = keep ? { from, sha: srcSha, args } : { from, sha: srcSha, args, keep: false };
  genUsed.add(v);
  return keep ? file : null;
}
function cwebp(src, out, args) {
  const r = spawnSync(CWEBP, ["-quiet", "-m", "6", ...args, src, "-o", out]);
  if (r.status !== 0) throw new Error(`optimize: cwebp failed for ${rel(src)}`);
  return true;
}
/** A resized WebP of the asset at path r (e.g. "assets/img/kheelu-1200.webp" at 640 → "assets/img/kheelu-1200-640w.webp"). */
function variant(r, w, name) {
  const src = srcOf(r), size = imgSize(src);
  if (!size || w >= size.w) return null;
  const dir = path.posix.dirname(r), base = name || `${path.posix.basename(r, path.extname(r))}-${w}w`;
  const v = `${dir}/${base}.webp`;
  if (exists(path.join(ROOT, v))) return v; // a real file of that name wins
  if (VIRTUAL.has(v)) return v;
  const args = ["-q", "80", "-alpha_q", "90", "-resize", String(w), "0"];
  const out = generated(v, src, `cwebp ${args.join(" ")}`, (o) => cwebp(src, o, args));
  if (!out) return null; // not kept, or missing (the build fails at the end, listing every missing file)
  VIRTUAL.set(v, out);
  return v;
}
/** PNG → WebP (kept only when smaller), SVG → SVGO (kept only when smaller). */
function prepareSwaps() {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const files = walk(path.join(ROOT, "assets/img")).map(rel);
  for (const r of files) {
    const src = path.join(ROOT, r), size = fs.statSync(src).size;
    if (r.endsWith(".png")) {
      const v = r.replace(/\.png$/, ".webp");
      if (exists(path.join(ROOT, v))) continue;
      const args = ["-q", "90", "-alpha_q", "100", "-exact"];
      const out = generated(v, src, `cwebp ${args.join(" ")}`, (o) => cwebp(src, o, args) && fs.statSync(o).size < size);
      if (out) { VIRTUAL.set(v, out); SWAP.set(r, v); }
    }
    if (r.endsWith(".svg")) {
      const v = `${r.slice(0, -4)}.min.svg`;
      const out = generated(v, src, "svgo@3.3.2 multipass preset-default keep-viewBox", (o) => {
        const cfg = path.join(CACHE, "svgo.config.mjs");
        write(cfg, `export default { multipass: true, plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false } } }] };\n`);
        const res = spawnSync(SVGO, ["--config", cfg, "-i", src, "-o", o, "--quiet"]);
        if (res.status !== 0) throw new Error(`optimize: svgo failed for ${r}`);
        return fs.statSync(o).size < size;
      });
      if (out) { VIRTUAL.set(v, out); SWAP.set(r, v); }
    }
  }
}

/* Responsive images. Each rule names an ancestor class (ctx), the image's own class (cls) and/or its file (src), the
 * widths to offer and a sizes attribute that matches the layout. Widths and sizes were measured in the browser at
 * 360, 412, 768, 1280 and 1920 px (rem sizes grow with the root font past 1600 px, hence the vw there).
 * override: also applies when the page already has a srcset (its candidates are kept; sizes is replaced). */
const IMG_RULES = [
  // Team: the founder chips in the dots bar show at 2rem; the card portraits at 150% of 6rem (4.25rem on phones).
  { ctx: "t3__dots", widths: [96, 160], sizes: "(min-width: 1600px) 2.3vw, 2rem" },
  { ctx: "t3card__pic", widths: [160, 240, 320], sizes: "(max-width: 899px) 6.4rem, (min-width: 1600px) 10vw, 9rem" },
  { ctx: "fcard__photo", widths: [320, 480], sizes: "(max-width: 599px) 88vw, (max-width: 1099px) 44vw, (min-width: 1600px) 22vw, 22rem" },
  { ctx: "th-quote", widths: [96, 160], sizes: "4rem" },
  // Home "try it": the tummy close-up (kheelu-1200) shows at 56vw on phones, 24rem on laptops.
  { ctx: "try__stage", cls: "kheelu__img", widths: [320, 480, 640, 800], sizes: "(max-width: 699px) 56vw, (min-width: 1600px) 16vw, 24rem" },
  // Product hero Khelu: 62vw on phones (the page said 70vw, which made a 1.75× phone fetch the 640 file).
  { ctx: "pdp-hero", cls: "kheelu__img", override: true, widths: [], sizes: "(max-width: 600px) 63vw, (min-width: 1600px) 23vw, 26rem" },
  // Stories: card images fill their box (object-fit: cover), so a landscape photo in a tall box needs its box height ×
  // its aspect. Cards are 108×154–217 px thumbnails on phones (the page said 100vw), 336×210 on tablets, 381×238 or
  // 582×364 on laptops; the hero collage cards are about 170×200 on phones and 310×365 on laptops.
  { ctx: "storycard__img", override: true, widths: [240, 400],
    sizes: (w, h) => (w / h > 1.2 ? "(max-width: 639px) 24rem, (max-width: 1099px) 49vw, (min-width: 1600px) 41vw, 41rem" : "(max-width: 639px) 10rem, (max-width: 1099px) 45vw, (min-width: 1600px) 37vw, 37rem") },
  { ctx: "collage__card", override: true, widths: [240, 400],
    sizes: (w, h) => (w / h > 1.2 ? "(max-width: 639px) 88vw, (max-width: 899px) 56vw, (min-width: 1600px) 42vw, 41rem" : "(max-width: 899px) 42vw, (min-width: 1600px) 21vw, 20rem") },
  // Safety: the tummy close-up is 43vw on phones; the evening photo spans the page.
  { ctx: "sf-tummy", override: true, widths: [320], sizes: "(max-width: 699px) 43vw, (min-width: 1600px) 22vw, 20rem" },
  { src: /tara-02-evening-with-amma\.webp$/, ctx: "page", widths: [480, 720], sizes: "100vw" },
  // Film posters (432 px) show at 13.5–15.5rem.
  { ctx: "film__play", widths: [240, 320], sizes: "(max-width: 1599px) 15.5rem, 18vw" },
  // Small Khelu cut-outs (kheelu-480, no srcset): footer peek, cards, the hill.
  { cls: "kheelu__img", src: /kheelu-480\.webp$/, widths: [240, 320], sizes: "(max-width: 599px) 40vw, (min-width: 1600px) 12vw, 11rem" },
  // The CTA bar's thumbnail (40 px).
  { cls: "ctabar__thumb", widths: [120], sizes: "2.5rem" },
];
const LADDER = [96, 160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1080, 1200, 1440, 1600];

const parseSrcset = (s) => s.split(",").map((c) => c.trim()).filter(Boolean).map((c) => { const [u, d = ""] = c.split(/\s+/); return { u, d }; });
const assetPath = (u) => { const m = /^\/?(assets\/.+)$/.exec(u); return m ? m[1] : null; };
/** Fill gaps wider than 1.45× in a w-descriptor srcset with generated widths (from the largest candidate). */
function augmentSrcset(s) {
  const c = parseSrcset(s);
  if (!c.length || !c.every((x) => /^\d+w$/.test(x.d) && assetPath(x.u))) return s;
  c.sort((a, b) => parseInt(a.d) - parseInt(b.d));
  const top = c[c.length - 1], slash = top.u.startsWith("/") ? "/" : "";
  const out = [...c];
  for (let i = 0; i < c.length - 1; i++) {
    const a = parseInt(c[i].d), b = parseInt(c[i + 1].d);
    if (b / a <= 1.45) continue;
    const mid = Math.sqrt(a * b), v = LADDER.filter((x) => x > a * 1.15 && x < b / 1.15).sort((x, y) => Math.abs(x - mid) - Math.abs(y - mid))[0];
    if (!v) continue;
    const p = variant(assetPath(top.u), v);
    if (p) out.push({ u: slash + p, d: v + "w" });
  }
  out.sort((a, b) => parseInt(a.d) - parseInt(b.d));
  return out.map((x) => `${x.u} ${x.d}`).join(", ");
}

/* ---------- Tiny HTML helpers ---------- */
const ATTR_RE = /([^\s=\/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
function parseAttrs(s) {
  const a = [];
  for (const m of s.matchAll(ATTR_RE)) a.push([m[1], m[2] ?? m[3] ?? m[4] ?? null]);
  return a;
}
const getA = (a, k) => (a.find((x) => x[0] === k) || [])[1];
const setA = (a, k, v) => { const x = a.find((y) => y[0] === k); if (x) x[1] = v; else a.push([k, v]); };
const delA = (a, k) => { const i = a.findIndex((x) => x[0] === k); if (i >= 0) a.splice(i, 1); };
const attrsStr = (a) => a.map(([k, v]) => (v === null ? ` ${k}` : ` ${k}="${v}"`)).join("");
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

/** Walk the start tags of a page with their ancestors' classes; fn(tag, attrs, ancestors) may return replacement HTML. */
function walkTags(html, fn) {
  const re = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>|<(\/?)([a-zA-Z][\w-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  const stack = [];
  return html.replace(re, (m, raw, close, tag, attrStr) => {
    if (!tag) return m;
    tag = tag.toLowerCase();
    if (close) { const i = stack.map((x) => x.tag).lastIndexOf(tag); if (i >= 0) stack.length = i; return m; }
    const attrs = parseAttrs(attrStr.replace(/\/\s*$/, ""));
    const r = fn(tag, attrs, stack);
    if (!VOID.has(tag) && !/\/\s*$/.test(attrStr)) stack.push({ tag, cls: (getA(attrs, "class") || "").split(/\s+/), id: getA(attrs, "id") });
    return r === undefined ? m : r;
  });
}
const inCtx = (stack, c) => stack.some((s) => s.cls.includes(c));

/* ---------- Pages ---------- */
// video/ is a link to the Next app's public/video (the full films, served by the app at /video/…; never copied twice).
const EXCLUDE_TOP = new Set(["assets", "tools", "pages", "seo", "dist", "node_modules", ".cache", ".git", "video"]);
function findPages() {
  const out = [];
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith(".html")) out.push(f);
  const walk = (d) => {
    for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const sub = d ? `${d}/${e.name}` : e.name;
      if (!d && (EXCLUDE_TOP.has(e.name) || e.name.startsWith("."))) continue;
      if (exists(path.join(ROOT, sub, "index.html"))) out.push(`${sub}/index.html`);
      walk(sub);
    }
  };
  walk("");
  return out.sort();
}
// Root files the SEO build may produce; copied as they are. Anything else at the root is a dev file.
const ROOT_FILE_RE = /^(.*\.(xml|txt|webmanifest|ico|png|jpe?g|webp|avif|svg|gif)|llms.*\.md|pricing\.md|manifest\.json|_headers|_redirects)$/;

/* Sources that the built pages reference by their minified names: the optimiser minifies the source itself. */
const SRC_MAP = { "assets/css/site.min.css": "assets/css/site.css", "assets/js/main.min.js": "assets/js/main.js" };

/* ---------- CSS ---------- */
const cssBundles = new Map(); // key (hrefs) → { css, file }
function cssBundle(hrefs) {
  const key = hrefs.join("|");
  if (cssBundles.has(key)) return cssBundles.get(key);
  let all = "";
  for (const h of hrefs) {
    const src = SRC_MAP[h] || h, dir = path.posix.dirname(src);
    all += read(path.join(ROOT, src)).replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (m, q, u) => {
      if (/^(data:|https?:|#|\/\/)/.test(u)) return m;
      const r = u.startsWith("/") ? u.slice(1) : path.posix.normalize(`${dir}/${u}`);
      return isMediaRef(r) && assetExists(r) ? `url(/${hashed(r)})` : m;
    }) + "\n";
  }
  const css = minify(all, "css").trim();
  const file = `assets/css/site.${sha(css)}.css`;
  write(path.join(DIST, file), css);
  const b = { css, file, hrefs };
  cssBundles.set(key, b);
  return b;
}

/* ---------- JS ---------- */
const jsFiles = new Map(); // key → file
function jsBundle(srcs, kind) {
  const key = kind + ":" + srcs.join("|");
  if (jsFiles.has(key)) return jsFiles.get(key);
  let code;
  if (kind === "vendor") code = srcs.map((s) => read(path.join(ROOT, s)).replace(/\n?\/\/# sourceMappingURL=\S+\s*$/, "").trim()).join("\n;\n"); // already minified upstream; their .map files aren't shipped
  else code = minify(srcs.map((s) => rewriteRefs(read(path.join(ROOT, SRC_MAP[s] || s)))).join("\n;\n"), "js");
  const file = `assets/js/${kind}.${sha(code)}.js`;
  write(path.join(DIST, file), code);
  jsFiles.set(key, file);
  return file;
}
// Module scripts: copy assets/js + assets/vendor into a temp tree (media URLs hashed, "/assets/…" specifiers made
// relative), then bundle every entry at once with code splitting, so a dynamic import() becomes its own chunk.
const modEntries = new Set();
function bundleModules() {
  const out = new Map();
  if (!modEntries.size) return out;
  const tmp = path.join(CACHE, "mod"), od = path.join(tmp, "out");
  fs.rmSync(tmp, { recursive: true, force: true });
  const walk = (d) => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]));
  for (const r of [...walk("assets/js"), ...walk("assets/vendor")].filter((r) => r.endsWith(".js") || r.endsWith(".mjs"))) {
    let code = read(path.join(ROOT, r));
    const up = path.posix.relative(path.posix.dirname(r), ".") || ".";
    code = code.replace(/((?:from|import)\s*\(?\s*["'])\/(assets\/[^"']+)/g, (m, pre, p) => `${pre}${up}/${p}`);
    if (!r.startsWith("assets/vendor/")) code = rewriteRefs(code);
    write(path.join(tmp, r), code);
  }
  const entries = [...modEntries];
  ESB.buildSync({ entryPoints: entries.map((e) => path.join(tmp, e)), bundle: true, splitting: true, format: "esm", minify: true,
    legalComments: "none", outdir: od, entryNames: "[name].[hash]", chunkNames: "[name].[hash]", logLevel: "error" });
  const files = fs.readdirSync(od);
  for (const f of files) write(path.join(DIST, "assets/js/m", f), fs.readFileSync(path.join(od, f)));
  // esbuild names entries [name].[hash].js; match each entry back by name.
  for (const e of entries) {
    const name = path.posix.basename(e, ".js"), f = files.find((x) => x.startsWith(name + ".") && x.split(".").length === 3);
    if (!f) throw new Error(`optimize: no bundle output for module ${e}`);
    out.set(e, `assets/js/m/${f}`);
  }
  return out;
}

/* ---------- HTML ---------- */
const KEEP_COMMENT = /<!--\s*(tracking-head|tracking-body|robots)\b[\s\S]*?-->/;
function fixHtml(html, route) {
  // Skip button: its accessible name is its visible text (the sources carry no aria-label any more; this keeps it so).
  html = html.replace(/(<button\b[^>]*\bid="skip"[^>]*?)\s+aria-label="[^"]*"/, "$1");
  // (The team page's still of the table scene, .t3__poster, is in its source now: pages/team.html.)
  return html;
}

const sizesFor = (rule, a) => (typeof rule.sizes === "function" ? rule.sizes(+getA(a, "width") || 1, +getA(a, "height") || 1) : rule.sizes);
function processImages(html) {
  // The page's own srcset/sizes of each image → what this step made of them, so an image preload in the head can be
  // kept identical to its <img> (a preload that differs from the image downloads the picture twice).
  const made = new Map(), key = (s) => parseSrcset(s || "").map((c) => `${assetPath(c.u)} ${c.d}`).sort().join(",");
  html = walkTags(html, (tag, a, stack) => {
    if (tag === "img" && getA(a, "srcset")) {
      const k = key(getA(a, "srcset")), out = imgTag(a, stack);
      const b = parseAttrs(out.slice(4, -1));
      if (!made.has(k)) made.set(k, { srcset: getA(b, "srcset"), sizes: getA(b, "sizes") });
      return out;
    }
    if (tag === "img") return imgTag(a, stack);
    if (tag === "source" && getA(a, "srcset")) { setA(a, "srcset", augmentSrcset(getA(a, "srcset"))); return `<source${attrsStr(a)}>`; }
  });
  return walkTags(html, (tag, a) => {
    if (tag !== "link" || getA(a, "rel") !== "preload" || !getA(a, "imagesrcset")) return;
    const m = made.get(key(getA(a, "imagesrcset")));
    if (m) { setA(a, "imagesrcset", m.srcset); if (m.sizes) setA(a, "imagesizes", m.sizes); } else setA(a, "imagesrcset", augmentSrcset(getA(a, "imagesrcset")));
    return `<link${attrsStr(a)}>`;
  });
}
/** One <img>: hero images eager, responsive variants per IMG_RULES, srcset gaps filled. Returns the new tag. */
function imgTag(a, stack) {
  {
    const src = getA(a, "src") || "", r = assetPath(src), cls = (getA(a, "class") || "").split(/\s+/);
    // Above the fold: an image in the page hero is never lazy; the hero collage's cards are all candidates for the
    // largest paint, so all three are fetched first.
    if (inCtx(stack, "ph") || inCtx(stack, "ph__visual") || inCtx(stack, "story-hero")) delA(a, "loading");
    if (inCtx(stack, "collage__card") && inCtx(stack, "ph")) setA(a, "fetchpriority", "high");
    const rule = r && IMG_RULES.find((x) => (!x.ctx || inCtx(stack, x.ctx)) && (!x.cls || cls.includes(x.cls)) && (!x.src || x.src.test(r)) && (x.override || !getA(a, "srcset")));
    if (rule && rule.override && getA(a, "srcset")) {
      // Keep the page's candidates, add smaller ones (made from the largest), and use the measured sizes.
      const c = parseSrcset(getA(a, "srcset")).filter((x) => /^\d+w$/.test(x.d) && assetPath(x.u));
      const top = c.sort((x, y) => parseInt(y.d) - parseInt(x.d))[0];
      if (top) {
        const slash = top.u.startsWith("/") ? "/" : "", have = new Set(c.map((x) => parseInt(x.d)));
        for (const w of rule.widths) if (!have.has(w) && w < parseInt(top.d)) { const v = variant(assetPath(top.u), w); if (v) c.push({ u: slash + v, d: w + "w" }); }
        c.sort((x, y) => parseInt(x.d) - parseInt(y.d));
        setA(a, "srcset", augmentSrcset(c.map((x) => `${x.u} ${x.d}`).join(", ")));
        setA(a, "sizes", sizesFor(rule, a));
      }
    } else if (getA(a, "srcset")) setA(a, "srcset", augmentSrcset(getA(a, "srcset")));
    else if (rule) {
      const size = imgSize(srcOf(SWAP.get(r) || r));
      if (size) {
        const slash = src.startsWith("/") ? "/" : "";
        const cands = rule.widths.filter((w) => w < size.w * 0.9).map((w) => ({ u: slash + variant(r, w), w })).filter((c) => !c.u.endsWith("null"));
        if (cands.length) {
          cands.push({ u: src, w: size.w });
          setA(a, "srcset", cands.map((c) => `${c.u} ${c.w}w`).join(", "));
          setA(a, "sizes", sizesFor(rule, a));
          // Smallest that still covers a 1x screen as the fallback src.
          setA(a, "src", cands[Math.min(1, cands.length - 1)].u);
        }
      }
    }
    return `<img${attrsStr(a)}>`;
  }
}

/* First-screen motion without waiting for JavaScript. Headings with [data-split] get their words wrapped here (as
 * pages.js would at runtime) and rise in with a CSS animation from the first paint; .reveal elements in the page
 * hero become .reveal-in (a CSS animation) instead of waiting for main.js. With JS the text used to paint, vanish
 * when main.js hid it, then rise; now it rises once, and the largest text paints at once. pages.css has the keyframes;
 * pages.js and main.js leave these alone ([data-split-css], .reveal-in). Reduced motion: no animation, final state. */
function splitWords(inner) {
  let i = 0, depth = 0;
  return inner.replace(/(<[^>]+>)|([^<]+)/g, (m, tag, text) => {
    if (tag) {
      if (/^<span\b[^>]*class="[^"]*\bmark\b/.test(tag) && depth === 0) { depth = 1; return tag.replace(/class="/, `style="--i:${i++}" class="split-w `); }
      if (depth && /^<span\b/.test(tag)) depth++;
      else if (depth && /^<\/span>/.test(tag)) depth--;
      return tag;
    }
    if (depth) return text;
    return text.split(/(\s+)/).map((w) => (!w || /^\s+$/.test(w) ? w : `<span class="split-w" style="--i:${i++}">${w}</span>`)).join("");
  });
}
function heroMotion(html) {
  html = html.replace(/<(h1|h2|h3|p)\b([^>]*\bdata-split\b[^>]*)>([\s\S]*?)<\/\1>/g, (m, tag, attrs, inner) =>
    /split-w/.test(inner) ? m : `<${tag}${attrs.replace(/\bdata-split\b/, "data-split data-split-css")}>${splitWords(inner)}</${tag}>`);
  let n = 0;
  return walkTags(html, (tag, a, stack) => {
    const cls = (getA(a, "class") || "").split(/\s+/);
    if (!cls.includes("reveal") || !(inCtx(stack, "ph") || cls.includes("ph"))) return;
    setA(a, "class", cls.map((c) => (c === "reveal" ? "reveal-in" : c)).join(" "));
    setA(a, "style", `${getA(a, "style") ? getA(a, "style").replace(/;?\s*$/, ";") : ""}--d:${(0.15 + 0.08 * n++).toFixed(2)}s`);
    return `<${tag}${attrsStr(a)}>`;
  });
}

function minifyHtml(html) {
  const keep = [];
  html = html.replace(/<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi, (m) => `\u0000${keep.push(m) - 1}\u0000`);
  html = html.replace(/<!--[\s\S]*?-->/g, (m) => (KEEP_COMMENT.test(m) ? m : ""));
  html = html.replace(/\n[ \t]+/g, "\n").replace(/\n{2,}/g, "\n");
  return html.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[+i]);
}

function processPage(file, modMap, report) {
  let html = read(path.join(ROOT, file));
  const route = "/" + file.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, "");
  html = fixHtml(html, route);
  html = processImages(html);
  html = heroMotion(html);

  // CSS: every local stylesheet → one bundle, inlined at the first one's place.
  const links = [...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*>/g)].filter((m) => assetPath(getA(parseAttrs(m[0].slice(5, -1)), "href") || ""));
  if (links.length) {
    const b = cssBundle(links.map((m) => assetPath(getA(parseAttrs(m[0].slice(5, -1)), "href"))));
    const tagOut = CSS_MODE === "inline" ? `<style>${b.css}</style>` : `<link rel="stylesheet" href="/${b.file}">`;
    let first = true;
    html = html.replace(/<link\b[^>]*\brel="stylesheet"[^>]*>\n?/g, (m) => { if (!assetPath(getA(parseAttrs(m.slice(5, -1)), "href") || "")) return m; const o = first ? tagOut + "\n" : ""; first = false; return o; });
    report.css = b.file;
  }

  // JS: classic deferred scripts → vendor + app bundles (document order is kept: all are defer).
  const scripts = [...html.matchAll(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)><\/script>\n?/g)];
  const classic = scripts.filter((m) => !/type="module"/.test(m[0]) && assetPath(m[2]));
  if (classic.length) {
    const srcs = classic.map((m) => assetPath(m[2]));
    const vendor = srcs.filter((s) => s.startsWith("assets/vendor/")), app = srcs.filter((s) => !s.startsWith("assets/vendor/"));
    const tags = [];
    if (vendor.length) tags.push(`<script src="/${jsBundle(vendor, "vendor")}" defer></script>`);
    if (app.length) tags.push(`<script src="/${jsBundle(app, "app")}" defer></script>`);
    let first = true;
    html = html.replace(/<script\b([^>]*)\bsrc="([^"]+)"([^>]*)><\/script>\n?/g, (m, a1, src, a2) => {
      if (/type="module"/.test(m) || !assetPath(src)) return m;
      const o = first ? tags.join("\n") + "\n" : ""; first = false; return o;
    });
    report.js = tags.map((t) => /src="\/([^"]+)"/.exec(t)[1]);
  }
  html = html.replace(/<script type="module" src="([^"]+)"><\/script>/g, (m, src) => {
    const e = assetPath(src); return e && modMap.has(e) ? `<script type="module" src="/${modMap.get(e)}"></script>` : m;
  });

  html = rewriteRefs(html);
  html = minifyHtml(html);
  write(path.join(DIST, file), html);
  report.html = { raw: Buffer.byteLength(html), br: br(html) };
}

/* ---------- Build ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
mkdirp(DIST);
prepareSwaps();

const pages = findPages();
// Module entries first (they are bundled together).
for (const f of pages) for (const m of read(path.join(ROOT, f)).matchAll(/<script type="module" src="([^"]+)"><\/script>/g)) { const e = assetPath(m[1]); if (e) modEntries.add(e); }
const modMap = bundleModules();

const reports = {};
for (const f of pages) { reports[f] = {}; processPage(f, modMap, reports[f]); }

// Committed variants: a deploy build stops here when one is missing or stale; the local step saves the index and
// removes what no page uses any more.
if (genMissing.size) {
  console.error(`optimize: ${genMissing.size} generated image(s) missing or stale in assets/gen/:\n  ${[...genMissing].join("\n  ")}\n` +
    "Run `node tools/optimize.mjs --make-variants` on a Mac with cwebp (tools/build-assets.sh runs it), then commit assets/gen/.");
  process.exit(1);
}
if (MAKE) {
  let removed = 0;
  for (const v of Object.keys(genIndex)) if (!genUsed.has(v)) { fs.rmSync(path.join(GEN, v.replace(/^assets\//, "")), { force: true }); delete genIndex[v]; removed++; }
  const sorted = Object.fromEntries(Object.keys(genIndex).sort().map((k) => [k, genIndex[k]]));
  write(GEN_INDEX, JSON.stringify(sorted, null, 1) + "\n");
  const files = Object.values(sorted).filter((e) => e.keep !== false).length;
  console.log(`optimize --make-variants: assets/gen holds ${files} files (${removed} unused removed); commit assets/gen/`);
}

// Root files (sitemap, robots, llms.txt, pricing.md, manifest, 404 is a page above) and .well-known/.
const copied = [];
for (const f of fs.readdirSync(ROOT)) {
  const p = path.join(ROOT, f);
  if (fs.statSync(p).isFile() && ROOT_FILE_RE.test(f)) { let t = fs.readFileSync(p); if (/\.(json|webmanifest)$/.test(f)) t = rewriteRefs(t.toString()); write(path.join(DIST, f), t); copied.push(f); }
}
// Public files in the other root folders (og/, media/, brand/, product/lumi.png, stories/<slug>.jpg …): share images
// and logos that meta tags and JSON-LD name by absolute URL, so they keep their paths and are never converted.
const PUBLIC_EXT = /\.(png|jpe?g|webp|avif|gif|svg|ico|pdf|xml|txt|webmanifest|mp4|webm|woff2?)$/i;
for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!e.isDirectory() || EXCLUDE_TOP.has(e.name) || e.name.startsWith(".")) continue;
  for (const f of fs.readdirSync(path.join(ROOT, e.name), { recursive: true, withFileTypes: true })) {
    if (!f.isFile() || !PUBLIC_EXT.test(f.name)) continue;
    const r = rel(path.join(f.parentPath || f.path, f.name));
    write(path.join(DIST, r), fs.readFileSync(path.join(ROOT, r)));
    copied.push(r);
  }
}
if (exists(path.join(ROOT, ".well-known"))) { fs.cpSync(path.join(ROOT, ".well-known"), path.join(DIST, ".well-known"), { recursive: true }); copied.push(".well-known/"); }

// Media that no page, stylesheet or script names literally (Khelu's voice clips, fetched by computed URLs) keep their names.
const plain = [];
for (const d of ASSET_DIRS) {
  if (!exists(path.join(ROOT, d))) continue;
  for (const e of fs.readdirSync(path.join(ROOT, d), { recursive: true, withFileTypes: true })) {
    if (!e.isFile() || e.name.startsWith(".")) continue;
    const r = rel(path.join(e.parentPath || e.path, e.name));
    if (!isMediaRef(r) || HASHED.has(r) || HASHED.has(SWAP.get(r))) continue;
    fs.copyFileSync(path.join(ROOT, r), (mkdirp(path.dirname(path.join(DIST, r))), path.join(DIST, r)));
    plain.push(r);
  }
}

const manifest = {
  generated: new Date().toISOString(),
  cssMode: CSS_MODE,
  cache: {
    immutable: "^/assets/.+\\.[0-9a-f]{10}\\.[a-z0-9]+$|^/assets/js/m/.+\\.[A-Z0-9]{8}\\.js$",
    note: "Hashed assets: Cache-Control: public, max-age=31536000, immutable. HTML and every other file: public, max-age=0, must-revalidate.",
  },
  assets: Object.fromEntries([...HASHED].sort()),
  swapped: Object.fromEntries([...SWAP]),
  modules: Object.fromEntries(modMap),
  pages: Object.fromEntries(Object.entries(reports).map(([f, r]) => [f, { css: r.css, js: r.js, html: r.html }])),
  unhashed: plain.sort(),
  rootFiles: copied,
};
write(path.join(DIST, "asset-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

/* ---------- Report ---------- */
const sizeOf = (r) => fs.statSync(path.join(DIST, r)).size;
const cssSizes = [...cssBundles.values()].map((b) => `${b.file} ${kb(Buffer.byteLength(b.css))} (br ${kb(br(b.css))})`);
const jsSizes = [...new Set([...jsFiles.values(), ...modMap.values()])].map((f) => `${f} ${kb(sizeOf(f))} (br ${kb(br(fs.readFileSync(path.join(DIST, f))))})`);
console.log(`optimize: ${pages.length} pages → dist/ in ${((Date.now() - t0) / 1000).toFixed(1)} s (CSS ${CSS_MODE})`);
console.log("  css: " + cssSizes.join("\n       "));
console.log("  js:  " + jsSizes.join("\n       "));
console.log(`  assets hashed: ${HASHED.size}, generated: ${VIRTUAL.size}, kept by name: ${plain.length}, public files at their own paths: ${copied.length} (${copied.filter((f) => !f.includes("/")).join(", ")}, …)`);
const skipped = fs.readdirSync(ROOT).filter((f) => !f.startsWith(".") && !EXCLUDE_TOP.has(f) && !ROOT_FILE_RE.test(f) && !f.endsWith(".html") && !fs.statSync(path.join(ROOT, f)).isDirectory());
if (skipped.length) console.log(`  not deployed (dev files at the root): ${skipped.join(", ")}`);
