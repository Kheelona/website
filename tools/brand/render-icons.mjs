#!/usr/bin/env node
/** Rasterize the v3 logo SVGs into every PNG surface the site ships (CS3).
 *
 *  Sources: public/brand/kheelona-mark.svg and kheelona-wordmark.svg (copied
 *  verbatim from Design/Kheelona-Design-System-v3/assets/logo/). Outputs:
 *   - public/brand/logo-mark.png       512px, transparent (JSON-LD logo)
 *   - src/app/icon.png                 512px, transparent
 *   - src/app/apple-icon.png           180px, PLATED on footer-cocoa #2A1608
 *                                      (iOS composites transparency onto black)
 *   - /tmp/favicon-{16,32,48}.png      assembled into favicon.ico separately
 *
 *  Uses the same puppeteer-core resolution as tools/qa, and omitBackground
 *  for real alpha. Not tools/cutout: that is a photo-cutout pipeline, and an
 *  SVG needs rasterizing, not background removal. Re-run whenever the logo
 *  changes; the founder's R5-a law says a logo change is ONE pass across the
 *  navbar, this icon set, og.png, and the seo.ts schema logo. */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { openPage } from "../qa/lib/browser.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const markSvg = readFileSync(join(root, "public/brand/kheelona-mark.svg"), "utf8");

async function renderMark({ size, out, plate = null, pad = 0 }) {
  const { browser, page } = await openPage({ width: size, height: size, local: true });
  const inner = Math.round(size - pad * 2);
  const html = `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;width:${size}px;height:${size}px;
      background:${plate ?? "transparent"};display:grid;place-items:center}
    svg{width:${inner}px;height:${inner}px;display:block}
  </style></head><body>${markSvg}</body></html>`;
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.screenshot({
    path: out,
    omitBackground: plate === null,
    clip: { x: 0, y: 0, width: size, height: size },
  });
  await browser.close();
  console.log("wrote", out);
}

const jobs = [
  { size: 512, out: join(root, "public/brand/logo-mark.png") },
  { size: 512, out: join(root, "src/app/icon.png") },
  /* The apple icon is plated: iOS composites alpha onto black. Cocoa is the
     footer ground and survived the v3 mapping as extension F3. Padding keeps
     the mark off iOS's corner crop. */
  { size: 180, out: join(root, "src/app/apple-icon.png"), plate: "#2A1608", pad: 22 },
  { size: 48, out: "/tmp/favicon-48.png" },
  { size: 32, out: "/tmp/favicon-32.png" },
  { size: 16, out: "/tmp/favicon-16.png" },
];

for (const job of jobs) await renderMark(job);
