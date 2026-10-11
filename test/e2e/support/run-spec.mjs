#!/usr/bin/env node
// Runs one page spec for some mockup slugs (task 1.1; tasks.md SPA 1 and 2).
//
//   npm run test:visual -- home safety          visual parity of / and /safety at the approved widths
//   npm run test:text -- home                   text parity of /, JavaScript on and off
//   npm run test:visual -- home --calibrate     the mockup against itself (must give zero difference)
//
// Slugs are the file names in mockup/ (home, meet-kheelu, store-confirmation …). Without slugs every
// approved page runs. A built route needs `npm run build` first; Playwright starts `next start`.
// Arguments that begin with "--" (other than --calibrate) are passed to Playwright.

import { spawnSync } from "node:child_process";

const [spec, ...rest] = process.argv.slice(2);
if (!spec) {
  console.error("usage: node test/e2e/support/run-spec.mjs <spec> [slug ...] [--calibrate] [playwright args]");
  process.exit(2);
}
const calibrate = rest.includes("--calibrate");
const slugs = rest.filter((a) => !a.startsWith("--"));
const passThrough = rest.filter((a) => a.startsWith("--") && a !== "--calibrate");

const env = { ...process.env };
if (slugs.length) env.KH_SLUGS = slugs.join(",");
if (calibrate) {
  env.KH_PARITY_TARGET = "mockup";
  env.KH_NO_SERVER = "1";
}

const run = spawnSync("npx", ["playwright", "test", `test/e2e/${spec}.spec.ts`, "--project=site", ...passThrough], {
  stdio: "inherit",
  env,
});
process.exit(run.status ?? 1);
