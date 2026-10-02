#!/usr/bin/env node
/** Token drift gate (§8.13; repointed at v4 in the 2026-10 redesign).
 *
 *  The palette lives in two places by design:
 *  Design/Kheelona-Design-System-v4/tokens/kheelona.css (canonical) and
 *  src/styles/globals.css (the @theme block for light, the dark override for
 *  dark). This script fails the site build when any mapped value drifts.
 *
 *  The 3D mirror (ambient-stage/lib/tokens.ts) left with the stage itself.
 *
 *  Run: node tools/tokens/check-tokens.mjs   (site build runs it automatically)
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/* FAIL-HARD when the canonical CSS is missing: deleting the design-system
 * folder must never silently disable the whole check (§8.26-h). */
const DS_REL = "Design/Kheelona-Design-System-v4/tokens/kheelona.css";
const DS_CSS = join(root, DS_REL);
if (!existsSync(DS_CSS)) {
  console.error(`token-check: FAILED — ${DS_REL} is missing; the palette cannot be verified.`);
  process.exit(1);
}

const ds = readFileSync(DS_CSS, "utf8");
const css = readFileSync(join(root, "src/styles/globals.css"), "utf8");

/* The light values live in @theme; the dark ones in the
 * `:root[data-theme="dark"]` block (the prefers-color-scheme block repeats it,
 * and test/contrast-tokens.test.ts holds the two copies equal). */
const themeBlock = css.slice(css.indexOf("@theme {"));
const darkStart = css.indexOf(':root[data-theme="dark"] {');
const darkBlock = darkStart >= 0 ? css.slice(darkStart, css.indexOf("}", darkStart)) : "";

const cssVar = (src, name) => {
  const m = src.match(new RegExp(`--${name}\\s*:\\s*([^;]+);`));
  return m ? m[1].trim().toLowerCase() : null;
};

/** [v4 --kh-*, site --color-*] */
const LIGHT = [
  ["kh-bg", "color-bg"],
  ["kh-surface", "color-surface"],
  ["kh-ink", "color-ink"],
  ["kh-ink", "color-ink-head"],
  ["kh-muted", "color-ink-muted"],
  ["kh-line", "color-line"],
  ["kh-soft", "color-soft"],
  ["kh-blush", "color-blush"],
  ["kh-sage", "color-sage"],
  ["kh-lav", "color-lav"],
  ["kh-accent", "color-accent"],
  ["kh-on-accent", "color-on-accent"],
  ["kh-green", "color-green"],
  ["kh-on-green", "color-on-green"],
  ["kh-label", "color-label"],
  ["kh-err", "color-err"],
  ["kh-ph-text", "color-ph-text"],
];

const DARK = [
  ["kh-dark-bg", "color-bg"],
  ["kh-dark-surface", "color-surface"],
  ["kh-dark-ink", "color-ink"],
  ["kh-dark-ink", "color-ink-head"],
  ["kh-dark-muted", "color-ink-muted"],
  ["kh-dark-line", "color-line"],
  ["kh-dark-soft", "color-soft"],
  ["kh-dark-blush", "color-blush"],
  ["kh-dark-sage", "color-sage"],
  ["kh-dark-lav", "color-lav"],
  ["kh-dark-green", "color-green"],
  ["kh-dark-on-green", "color-on-green"],
  ["kh-dark-label", "color-label"],
  ["kh-dark-err", "color-err"],
  ["kh-dark-ph-text", "color-ph-text"],
];

let failed = false;
function check(pairs, block, where) {
  for (const [dsName, siteName] of pairs) {
    const want = cssVar(ds, dsName);
    if (!want) {
      console.error(`token-check: --${dsName} missing from ${DS_REL}`);
      failed = true;
      continue;
    }
    const got = cssVar(block, siteName);
    if (got !== want) {
      console.error(
        `token-check: DRIFT --${siteName} in globals.css (${where}) is ${got}, design system --${dsName} is ${want}`,
      );
      failed = true;
    }
  }
}
check(LIGHT, themeBlock, "@theme");
check(DARK, darkBlock, "dark theme");

if (failed) process.exit(1);
console.log(`token-check: OK — ${LIGHT.length} light and ${DARK.length} dark tokens match v4.`);
