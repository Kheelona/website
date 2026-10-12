#!/usr/bin/env node
// Build-hook runner (task 1.1; structure §1, ADR-011).
//
//   node scripts/run-steps.mjs <predev|prebuild|postbuild>
//
// Runs every scripts/steps/<hook>/NN-name.mjs in name order and stops at the first step that
// exits non-zero, with that exit code. Each step file belongs to the task that writes its
// script, so package.json never changes when a step is added (N25). A hook with no folder or no
// steps is a no-op. A .mjs file in a hook folder that does not follow the NN-name.mjs pattern is
// an error, never silently skipped: a step nobody runs is a guard nobody has.
//
// KH_STEPS_ROOT points the runner at another steps folder (used to prove the runner itself).

import { existsSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOKS = ["predev", "prebuild", "postbuild"];
const STEP = /^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.mjs$/;

const hook = process.argv[2];
if (!HOOKS.includes(hook)) {
  console.error(`usage: node scripts/run-steps.mjs <${HOOKS.join("|")}>`);
  process.exit(2);
}

const root = process.env.KH_STEPS_ROOT ?? join(dirname(fileURLToPath(import.meta.url)), "steps");
const dir = join(root, hook);
const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".mjs")) : [];

const misnamed = files.filter((f) => !STEP.test(f));
if (misnamed.length) {
  console.error(
    `[steps] ${hook}: ${misnamed.join(", ")} must be named NN-name.mjs (two digits, kebab-case).`,
  );
  process.exit(1);
}

const steps = files.sort();
if (!steps.length) {
  console.log(`[steps] ${hook}: no steps`);
  process.exit(0);
}

for (const step of steps) {
  console.log(`[steps] ${hook}/${step}`);
  const run = spawnSync(process.execPath, [join(dir, step)], {
    stdio: "inherit",
    env: { ...process.env, KH_STEP_HOOK: hook },
  });
  if (run.status !== 0) {
    const why = run.status === null ? `signal ${run.signal}` : `exit ${run.status}`;
    console.error(`[steps] ${hook}/${step} failed (${why}); later steps did not run.`);
    process.exit(run.status || 1);
  }
}
console.log(`[steps] ${hook}: ${steps.length} step(s) passed`);
