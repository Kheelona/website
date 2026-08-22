#!/usr/bin/env node
/** Token drift gate (§8.13, repointed at v3 in CS3 Phase A, 2026-08-23): the
 *  palette lives in three places by design --
 *  Design/Kheelona-Design-System-v3/tokens/kheelona.css (canonical),
 *  src/styles/globals.css @theme (Tailwind v4), and
 *  src/features/ambient-stage/lib/tokens.ts (the 3D mirror).
 *  This script fails the site build when any mapped value drifts.
 *
 *  Run: node tools/tokens/check-tokens.mjs   (site build runs it automatically)
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/* FAIL-HARD when the canonical CSS is missing (changed in CS3). The old gate
 * warned-and-passed here, which meant deleting the design-system folder would
 * silently disable the whole check — the exact failure §8.26-h's twin-list
 * lesson warns about. v3 is tracked in git, so a build without it is a broken
 * checkout, not a legitimate environment. */
const DS_CSS = join(root, "Design/Kheelona-Design-System-v3/tokens/kheelona.css");
if (!existsSync(DS_CSS)) {
  console.error(
    "token-check: FAILED — Design/Kheelona-Design-System-v3/tokens/kheelona.css is missing. " +
      "The v3 design system is tracked in git; a checkout without it cannot verify the palette.",
  );
  process.exit(1);
}

const ds = readFileSync(DS_CSS, "utf8");
const theme = readFileSync(join(root, "src/styles/globals.css"), "utf8");
const three = readFileSync(join(root, "src/features/ambient-stage/lib/tokens.ts"), "utf8");

const cssVar = (src, name) => {
  const m = src.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  return m ? m[1].trim().toLowerCase() : null;
};
const tsHex = (name) => {
  const m = three.match(new RegExp(`${name}\\s*:\\s*"(#[0-9a-fA-F]{6})"`));
  return m ? m[1].toLowerCase() : null;
};

/** [v3 --kh-*, site --color-*, tokens.ts key | null]
 *
 *  The v3 names this reads are the August 2026 token set: the ink ramp is
 *  kh-ink / kh-ink-2 / kh-ink-3, the surfaces are kh-cream / kh-line, and the
 *  content tints are kh-*-tint. blue-soft, orange-deep, bg-warm/bg-cool and
 *  ink-4 do not exist in v3 — their rows died with them (orangeDeep and
 *  blueSoft survive only as dormant tokens.ts mirrors until Phase B). */
const MAP = [
  ["kh-orange", "color-orange", "orange"],
  ["kh-yellow", "color-yellow", "yellow"],
  ["kh-blue", "color-blue", "blue"],
  // teal and purple stay retired from the live web palette (no @theme entry);
  // the DS ↔ tokens.ts agreement is still checked for the dormant mirrors.
  ["kh-teal", null, "teal"],
  ["kh-purple", null, "purple"],
  ["kh-ink", "color-ink-head", null],
  ["kh-ink-2", "color-ink", "ink"],
  ["kh-ink-3", "color-ink-muted", null],
  ["kh-line", "color-line", null],
  // line-soft is ALIASED to kh-line for Phase A; the row dies with the token
  // when Phase B merges its call sites into `line`.
  ["kh-line", "color-line-soft", null],
  ["kh-cream", "color-cream", "cream"],
  ["kh-blue-tint", "color-cool", "cool"],
  ["kh-yellow-tint", "color-sun", "sun"],
  ["kh-white", null, "white"],
];

/* Sanctioned site-only values, NOT checked against v3 (documented extensions;
 *  gap proposals live in migration-to-new-dsx.md and get filed into v3 at the
 *  end of the engagement):
 *  - color-orange-ink / color-blue-ink: the small-text orange and blue. v3
 *    ships no ≥4.5:1 small-text brand colours, and its §6 note that white is
 *    safe on brand orange computes to 2.88:1 — these two tokens are the
 *    arithmetic the site keeps instead.
 *  - color-action / color-action-ink: the one-line-flip indirection.
 *  - color-footer-cocoa (site-only surface, F3) and color-orange-deep
 *    (retired in v3; drains to orange-ink in Phase B, then deleted).
 *  - TOKENS.orangeDeep / TOKENS.blueSoft: dormant mirrors, Phase B cleanup.
 *  - BEAT_WASHES intermediates (#fff9f1, #fffdf9, #d9f4ec) — curated sky
 *    stops, flagged for Phase B re-curation.
 *  - The R5 white-label fills orange-cta / teal-deep: orange-cta survives as
 *    a dormant token and must agree across globals.css / tokens.ts. */

/** Site-internal invariants: [globals.css --color-*, tokens.ts key, value] */
const SITE_MAP = [
  ["color-orange-cta", "orangeCta", "#c25210"],
  // R9 small-text orange, recomputed on the v3 washes (CS3): white 5.32,
  // cream 5.01, cool 4.67, sun 4.65 — still the only orange legal everywhere.
  ["color-orange-ink", "orangeInk", "#b54a0d"],
];

/** Site theme-only invariants (no ambient-stage mirror): [--color-*, value] */
const SITE_THEME = [
  // Small-text blue, recomputed on the v3 washes: white 5.65, cream 5.32,
  // cool 4.96, sun 4.94 — the blue twin of orange-ink.
  ["color-blue-ink", "#1b6e96"],
  // Retired in v3; kept while its accent call sites drain in Phase B.
  ["color-orange-deep", "#d85f1b"],
];

let failed = false;
for (const [dsName, themeName, threeKey] of MAP) {
  const want = cssVar(ds, dsName);
  if (!want) {
    console.error(`token-check: --${dsName} missing from the design system CSS`);
    failed = true;
    continue;
  }
  if (themeName) {
    const got = cssVar(theme, themeName);
    if (got !== want) {
      console.error(
        `token-check: DRIFT --${themeName} in globals.css @theme is ${got}, design system --${dsName} is ${want}`,
      );
      failed = true;
    }
  }
  if (threeKey) {
    const got = tsHex(threeKey);
    if (got !== want) {
      console.error(
        `token-check: DRIFT TOKENS.${threeKey} in ambient-stage/lib/tokens.ts is ${got}, design system --${dsName} is ${want}`,
      );
      failed = true;
    }
  }
}

for (const [themeName, want] of SITE_THEME) {
  const got = cssVar(theme, themeName);
  if (got !== want) {
    console.error(`token-check: DRIFT --${themeName} in globals.css @theme is ${got}, sanctioned value is ${want}`);
    failed = true;
  }
}

for (const [themeName, threeKey, want] of SITE_MAP) {
  const got = cssVar(theme, themeName);
  if (got !== want) {
    console.error(`token-check: DRIFT --${themeName} in globals.css @theme is ${got}, sanctioned value is ${want}`);
    failed = true;
  }
  const ts = tsHex(threeKey);
  if (ts !== want) {
    console.error(`token-check: DRIFT TOKENS.${threeKey} in ambient-stage/lib/tokens.ts is ${ts}, sanctioned value is ${want}`);
    failed = true;
  }
}

if (failed) {
  console.error(
    "token-check: FAILED — sync the palette (canonical: Design/Kheelona-Design-System-v3/tokens/kheelona.css)",
  );
  process.exit(1);
}
console.log(`token-check: ok (${MAP.length + SITE_MAP.length + SITE_THEME.length} mappings)`);
