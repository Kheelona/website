#!/usr/bin/env node
/** Token drift gate (§8.13): the palette lives in three places by design --
 *  Design/design-system/colors_and_type.css (canonical), site/app/globals.css
 *  @theme (Tailwind v4), site/lib/three/tokens.ts (the 3D scene's JS mirror).
 *  This script fails the site build when any mapped value drifts.
 *
 *  Run: node tools/tokens/check-tokens.mjs   (site build runs it automatically)
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// a build environment without the design system checked out can't check —
// warn and pass rather than block the deploy
if (!existsSync(join(root, "Design/design-system/colors_and_type.css"))) {
  console.warn("token-check: design system CSS not found, skipping");
  process.exit(0);
}

const ds = readFileSync(join(root, "Design/design-system/colors_and_type.css"), "utf8");
const theme = readFileSync(join(root, "site/src/styles/globals.css"), "utf8");
const three = readFileSync(join(root, "site/src/features/ambient-stage/lib/tokens.ts"), "utf8");

const cssVar = (src, name) => {
  const m = src.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  return m ? m[1].trim().toLowerCase() : null;
};
const tsHex = (name) => {
  const m = three.match(new RegExp(`${name}\\s*:\\s*"(#[0-9a-fA-F]{6})"`));
  return m ? m[1].toLowerCase() : null;
};

/** [ds --kh-*, site --color-*, tokens.ts key | null] */
const MAP = [
  ["kh-orange", "color-orange", "orange"],
  ["kh-orange-deep", "color-orange-deep", "orangeDeep"],
  ["kh-yellow", "color-yellow", "yellow"],
  ["kh-blue", "color-blue", "blue"],
  // Revamp P2 (founder 2026-07-24, brand colours only): blue-soft, teal and
  // purple are RETIRED from the live web palette — no @theme entry anymore.
  // They stay brand-deck decoratives and dormant ambient-stage mirrors, so
  // the DS ↔ tokens.ts agreement is still checked (theme column = null).
  ["kh-blue-soft", null, "blueSoft"],
  ["kh-teal", null, "teal"],
  ["kh-purple", null, "purple"],
  ["kh-ink-2", "color-ink", "ink"],
  ["kh-ink-4", "color-ink-muted", null],
  ["kh-line", "color-line", null],
  ["kh-line-soft", "color-line-soft", null],
  ["kh-bg-warm", "color-cream", "cream"],
  ["kh-bg-cool", "color-cool", "cool"],
  ["kh-bg", null, "white"],
];

/* Sanctioned site-only values, NOT checked against the DS (documented
 *  deviations; see Design/design-system/README.md sync checklist):
 *  - color-ink-head #1c1c1c (site heading ink; DS --kh-ink #000000 was
 *    softened for screens during the build)
 *  - color-footer-cocoa (site-only surface)
 *  - TOKENS.sun #fdf1e2 (the sanctioned 15%-alpha yellow, composited)
 *  - BEAT_WASHES intermediates (#fff9f1, #fffdf9, #d9f4ec) -- curated sky
 *    stops between wash tokens, not palette entries
 *  - R5 white-label fills (founder 2026-07-10: white text on CTAs/bands):
 *    orange-cta #c25210 and teal-deep #0f766e, the lightest brand-family
 *    fills where white passes 4.5:1 at any size. Site-only, but they must
 *    agree across globals.css / tokens.ts -- checked below. */

/** Site-internal invariants: [globals.css --color-*, tokens.ts key, value] */
const SITE_MAP = [
  ["color-orange-cta", "orangeCta", "#c25210"],
  // teal-deep is DEPRECATED (revamp P2): lives only under the legacy teal
  // wash until SafetyStrip + the safety hero retire (M2/M4); drop this row
  // with the token in M5 cleanup.
  ["color-teal-deep", "tealDeep", "#0f766e"],
  // R9 small-text orange: 13px sans kickers need 4.5:1 on every wash
  // (white 5.3, cream 5.0, cool 4.8, sun 4.8) — orange-cta only clears white
  ["color-orange-ink", "orangeInk", "#b54a0d"],
];

/** Site theme-only invariants (no ambient-stage mirror): [--color-*, value] */
const SITE_THEME = [
  // Revamp P2 small-text blue: darkened #29a0d7, 4.5:1+ on every wash
  // (white 5.7, cream 5.3, cool 5.1, sun 5.0) — the blue twin of orange-ink
  ["color-blue-ink", "#1b6e96"],
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
        `token-check: DRIFT TOKENS.${threeKey} in lib/three/tokens.ts is ${got}, design system --${dsName} is ${want}`,
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
    console.error(`token-check: DRIFT TOKENS.${threeKey} in lib/three/tokens.ts is ${ts}, sanctioned value is ${want}`);
    failed = true;
  }
}

if (failed) {
  console.error("token-check: FAILED — sync the palette (canonical: Design/design-system/colors_and_type.css)");
  process.exit(1);
}
console.log(`token-check: ok (${MAP.length + SITE_MAP.length + SITE_THEME.length} mappings)`);
