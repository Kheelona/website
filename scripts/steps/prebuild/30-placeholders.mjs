#!/usr/bin/env node
// Prebuild step 30 (task 2.9): no open placeholder in src/ reaches a production build.
//
// Runs scripts/guards/placeholders.mjs --source after DS checksums (10) and compose.css (20).
// Production exits 1 on any {ph:} token, placeholder() call, [PLACEHOLDER marker or draft legal
// document outside the two files that define them; beta, preview and development print the count
// and the list and continue (architecture §6.2, ADR-004).
//
// The guard runs in a child process so it can import src/config/env.ts with Node's type
// stripping without the MODULE_TYPELESS_PACKAGE_JSON notice in every build log (package.json has
// no "type" field, so Node re-parses env.ts as an ES module and says so). Any arguments are
// passed through (the tests point --root at a fixture tree; scripts/run-steps.mjs passes none).

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const GUARD = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "guards", "placeholders.mjs");

const run = spawnSync(
  process.execPath,
  ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", GUARD, "--source", ...process.argv.slice(2)],
  { stdio: "inherit" },
);
process.exit(run.status ?? 1);
