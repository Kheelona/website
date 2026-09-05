#!/usr/bin/env node
/** What a reader actually SEES, plus every link, for a route.
 *  Usage: node tools/qa/text.mjs <url>
 *
 *  Use this instead of grepping HTML (§8.25-bb). A Next page's source carries
 *  the RSC flight payload, so a grep finds strings that are not on the page:
 *  it once reported "Meet Lumi" (the product's name before the 2026-09-05
 *  rename) on the store's 404 and sent a chase after a bug
 *  that did not exist. It is also the honest way to run the voice lint, since
 *  copy is assembled from constants and split across JSX nodes. */
import { openPage, loadSettled, looksLocal } from "./lib/browser.mjs";

const [url] = process.argv.slice(2);
if (!url) {
  console.error("usage: node tools/qa/text.mjs <url>");
  process.exit(1);
}
const { browser, page } = await openPage({ width: 1280, local: looksLocal(url) });
const response = await loadSettled(page, url, { settleMs: 800 });
const text = await page.evaluate(() => document.body.innerText);
const links = await page.evaluate(() =>
  [...document.querySelectorAll("a")].map(
    (a) => `${a.textContent.trim().slice(0, 48)} -> ${a.getAttribute("href")}`,
  ),
);
console.log(`[${response.status()}] ${url}`);
console.log("--- text ---");
console.log(text.replace(/\n{2,}/g, "\n"));
console.log("--- links ---");
console.log(links.join("\n"));
await browser.close();
