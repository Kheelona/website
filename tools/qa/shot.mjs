#!/usr/bin/env node
/** Screenshot a route, headless, with reveals forced.
 *  Usage: node tools/qa/shot.mjs <url> <out.png> [width] [--full] */
import { openPage, loadSettled } from "./lib/browser.mjs";

const [url, out, widthArg, ...flags] = process.argv.slice(2);
if (!url || !out) {
  console.error("usage: node tools/qa/shot.mjs <url> <out.png> [width] [--full]");
  process.exit(1);
}
const width = Number(widthArg) || 1280;
const { browser, page } = await openPage({ width, scale: 2 });
await loadSettled(page, url);
await page.screenshot({ path: out, fullPage: flags.includes("--full") });
console.log(`${out} @ ${width}px${flags.includes("--full") ? " full" : ""}`);
await browser.close();
