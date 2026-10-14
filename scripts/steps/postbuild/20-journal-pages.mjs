#!/usr/bin/env node
// Postbuild step 20 (task 8b.2b; ADR-014; journal-pipeline §8.2 row 26): every journal post became a page.
//
// Runs scripts/journal/sync-posts.mjs --pages: for each post of src/content/en-IN/stories/posts.generated.json that is
// not a redirect source (the redirect wins, §10), the prerendered stories/<slug>.html must exist and hold something, in
// .next/server/app or, on Vercel, .next/server/route-cache (scripts/prerendered.mjs), and there must be at least 4. A post the adapter dropped or a page `next build` did not prerender fails
// `npm run build` in every environment, so Vercel keeps the previous deployment.
//
// Child process and pass-through arguments for the same reasons as prebuild/15-journal-sync.mjs.

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SYNC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "journal", "sync-posts.mjs");

const run = spawnSync(
  process.execPath,
  ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", SYNC, "--pages", ...process.argv.slice(2)],
  { stdio: "inherit" },
);
process.exit(run.status ?? 1);
