#!/usr/bin/env node
// Predev step 40 (2026-10-22, the redesign as the marketing site): prepare the last redesign build for `next dev`.
//
// Runs scripts/site/prepare.mjs --no-build: the existing redesign/dist (or KH_SITE_DIST) into build/site/ and
// public/_site/, plus the tracking shell bundle, without rebuilding the redesign (run `bash redesign/tools/build-site.sh`
// first for fresh pages). A child process with type stripping, as prebuild 40 (it imports src/config/env.ts).

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
    "--no-build",
    ...process.argv.slice(2),
  ],
  { stdio: "inherit" },
);
process.exit(run.status ?? 1);
