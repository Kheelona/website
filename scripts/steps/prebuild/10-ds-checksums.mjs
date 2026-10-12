#!/usr/bin/env node
// Prebuild step 10 (task 1.1): the design system is unchanged before anything is built.
//
// Runs scripts/ds-checksums.mjs, which compares every file in design-system/ with the SHA-256
// manifest in wiki/design-system/manifest.md and exits 1 on any drift (D005, brief §4.1).
// The production build therefore needs wiki/ in Vercel's clone (it is committed, D010; never
// list it in a .vercelignore). If the manifest or the design system is missing, this step says
// so plainly instead of letting the checksum script crash (N26, structure §8).

import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const MANIFEST = join(ROOT, "wiki", "design-system", "manifest.md");
const DS = join(ROOT, "design-system");

if (!existsSync(MANIFEST)) {
  console.error(
    "[ds-checksums] wiki/design-system/manifest.md is missing, so the design system cannot be " +
      "verified and the build stops. The deploy needs wiki/ in its clone: make sure wiki/ is " +
      "committed and not excluded by a .vercelignore (structure §8, N26).",
  );
  process.exit(1);
}
if (!existsSync(DS)) {
  console.error(
    "[ds-checksums] design-system/ is missing, so there is nothing to verify against " +
      "wiki/design-system/manifest.md and the build stops. design-system/ is committed and read-only (D005).",
  );
  process.exit(1);
}

const run = spawnSync(process.execPath, [join(ROOT, "scripts", "ds-checksums.mjs")], {
  stdio: "inherit",
});
process.exit(run.status ?? 1);
