#!/usr/bin/env node
// Prebuild step 15 (task 8b.2b; ADR-014; journal-pipeline §2.2): the journal before `next build`.
//
// Runs scripts/journal/sync-posts.mjs, which refreshes src/content/en-IN/stories/posts.generated.json from the
// dashboard's API on a production build with JOURNAL_SOURCE "api" (or BLOG_SYNC=on), and otherwise checks the
// committed file with no request. Either way a journal that breaks a build rule or holds fewer than 4 posts stops the
// build, and so does (from the API) one that cannot be fetched or lost half its posts; Vercel keeps the last good
// deployment.
//
// After DS checksums (10, which fails fast without the network) and before compose.css (20) and the placeholder scan
// of src/ (30), which then reads the fresh file. Child process and pass-through arguments for the same reasons as
// prebuild/30-placeholders.mjs (the script imports .ts files with Node's type stripping; the tests pass --root).

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SYNC = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "journal", "sync-posts.mjs");

const run = spawnSync(
  process.execPath,
  ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", SYNC, ...process.argv.slice(2)],
  { stdio: "inherit" },
);
process.exit(run.status ?? 1);
