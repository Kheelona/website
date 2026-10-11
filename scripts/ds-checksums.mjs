#!/usr/bin/env node
// Design-system integrity check (KICKOFF.md section 4.1).
//
// design-system/ is read-only: other teams share it, so any change to it breaks their work.
// This script records a SHA-256 for every file in it and proves nothing has changed since.
//
//   node scripts/ds-checksums.mjs           verify against the manifest (exit 1 on any drift)
//   node scripts/ds-checksums.mjs --write   (re)write the manifest; only when a NEW DS version
//                                           is delivered, and log that delivery in wiki/log.md
//
// The manifest lives at wiki/design-system/manifest.md. QA runs the verify mode before every gate.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const DS = join(ROOT, "design-system");
const MANIFEST = join(ROOT, "wiki", "design-system", "manifest.md");
const LINE = /^([0-9a-f]{64}) {2}(.+)$/;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function hashAll() {
  const out = new Map();
  for (const file of walk(DS)) {
    const rel = relative(DS, file).split(sep).join("/");
    out.set(rel, createHash("sha256").update(readFileSync(file)).digest("hex"));
  }
  return new Map([...out].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

function readManifest() {
  const text = readFileSync(MANIFEST, "utf8");
  const out = new Map();
  for (const line of text.split("\n")) {
    const m = LINE.exec(line);
    if (m) out.set(m[2], m[1]);
  }
  return out;
}

if (process.argv.includes("--write")) {
  const hashes = hashAll();
  const body = [...hashes].map(([p, h]) => `${h}  ${p}`).join("\n");
  const today = new Date().toISOString().slice(0, 10);
  writeFileSync(
    MANIFEST,
    `---
title: Design-system checksum manifest
type: manifest
updated: ${today}
sources: [design-system/README.md]
---

# Design-system checksum manifest

SHA-256 of every file in \`design-system/\` as delivered (${hashes.size} files). Verify with
\`node scripts/ds-checksums.mjs\`; it fails on any changed, missing or added file. Rewrite only
when a new DS version is delivered, and log it. How the DS is used: [overview](overview.md).

\`\`\`
${body}
\`\`\`
`,
  );
  console.log(`wrote ${hashes.size} checksums to ${relative(ROOT, MANIFEST)}`);
  process.exit(0);
}

const expected = readManifest();
const actual = hashAll();
const problems = [];
for (const [p, h] of expected) {
  if (!actual.has(p)) problems.push(`missing  ${p}`);
  else if (actual.get(p) !== h) problems.push(`changed  ${p}`);
}
for (const p of actual.keys()) if (!expected.has(p)) problems.push(`added    ${p}`);

if (expected.size === 0) {
  console.error("manifest has no checksum lines; refusing to pass an empty check");
  process.exit(1);
}
if (problems.length) {
  console.error(`design-system/ has drifted (${problems.length}):\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`design-system/ intact: ${actual.size} files match the manifest`);
