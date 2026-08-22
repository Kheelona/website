#!/usr/bin/env node
/** axe on a real page, with reveals forced and settled.
 *  Usage: node tools/qa/axe-run.mjs <url> [width]
 *  Exits 1 when anything is found, so it can gate a script. */
import { readFileSync } from "node:fs";
import { openPage, loadSettled, looksLocal } from "./lib/browser.mjs";
import { axeSourcePath } from "./lib/resolve.mjs";

const [url, widthArg] = process.argv.slice(2);
if (!url) {
  console.error("usage: node tools/qa/axe-run.mjs <url> [width]");
  process.exit(1);
}
const width = Number(widthArg) || 1280;
const { browser, page } = await openPage({ width, local: looksLocal(url) });
await loadSettled(page, url);
await page.evaluate(readFileSync(axeSourcePath(), "utf8"));
const violations = await page.evaluate(async () => {
  const result = await window.axe.run(document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
  });
  return result.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.slice(0, 4).map((n) => ({ target: n.target, summary: n.failureSummary })),
  }));
});
console.log(`${url} @ ${width}px: ${violations.length} violation type(s)`);
if (violations.length) console.log(JSON.stringify(violations, null, 2));
await browser.close();
process.exit(violations.length ? 1 : 0);
