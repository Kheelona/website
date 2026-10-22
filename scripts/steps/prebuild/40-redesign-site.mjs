#!/usr/bin/env node
// Prebuild step 40 (2026-10-22, the redesign as the marketing site): build the redesign and prepare it for `next build`.
//
// Runs scripts/site/prepare.mjs: `bash redesign/tools/build-site.sh` (which runs redesign/tools/publish-stories.sh, the
// journal sync under the live BLOG_SYNC rule), then the pages and machine files into build/site/, the static files into
// public/_site/, and the tracking shell bundle. After the journal sync (15), so the snapshot it reads is the fresh one.
// A child process with type stripping, as the other steps run their scripts (it imports src/config/env.ts).

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PREPARE = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "site", "prepare.mjs");

const run = spawnSync(
  process.execPath,
  [
    "--experimental-strip-types",
    "--disable-warning=ExperimentalWarning",
    "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
    PREPARE,
    ...process.argv.slice(2),
  ],
  { stdio: "inherit" },
);
process.exit(run.status ?? 1);
