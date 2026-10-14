#!/usr/bin/env node
// Postbuild step 10 (task 2.9): no open placeholder in what next build prerendered.
//
// Runs scripts/guards/placeholders.mjs --html over the prerendered HTML and route bodies (llms.txt,
// pricing.md, sitemap.xml, robots.txt), in .next/server/app or, on Vercel, .next/server/route-cache
// (scripts/prerendered.mjs). It catches a marker the source scan cannot see, such as one
// assembled at render time. Production exits 1 on any finding, and also when there is no
// prerendered HTML to scan; beta, preview and development print the count and the list and
// continue (architecture §6.2, ADR-004). npm runs this after `next build`, so a
// failure here fails `npm run build` and Vercel keeps the previous deployment.
//
// Child process and pass-through arguments for the same reasons as prebuild/30-placeholders.mjs.

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const GUARD = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "guards", "placeholders.mjs");

const run = spawnSync(
  process.execPath,
  ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", GUARD, "--html", ...process.argv.slice(2)],
  { stdio: "inherit" },
);
process.exit(run.status ?? 1);
