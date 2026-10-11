// PostCSS for Next (Turbopack), Storybook and Vitest (both Vite). Task 1.2, ADR-002.
//
// Plugins are listed as plugin objects in an array: Next 16's Turbopack loader passes them through and Vite's
// postcss-load-config accepts them. (Next's webpack mode wants plugin names as strings; the build uses Turbopack.)
// Turbopack bundles this file before running it, and cannot bundle Tailwind's native bindings (lightningcss), so
// Tailwind is loaded at run time with Node's require, which Turbopack is told to leave alone.
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tailwindcss = require(/* turbopackIgnore: true */ "@tailwindcss/postcss");

// The new site's CSS entry. The legacy src/styles/globals.css, still used by the old pages until task 6.3, relies
// on arbitrary values and Tailwind's transitions, and is left alone. A query string marks a guard's probe of
// site.css: @tailwindcss/postcss caches its compiler per `from` path, so each probe compiles under its own key.
const SITE_ENTRY = /(^|[\\/])src[\\/]styles[\\/]site\.css(\?[^\\/]*)?$/;
// An escaped "[" or "(" in a utility selector is an arbitrary value, property or variant: p-[13px],
// [color:red], data-[open]:p-5, or the (--var) shorthand p-(--space-3).
const ARBITRARY = /\\[[(]/;
// Motion a utility would add: transition and animation in every longhand, smooth scrolling, view transitions, and
// Tailwind's own duration and easing variables. The reset theme still lets transition, transition-all,
// duration-300, delay-500, ease-linear and scroll-smooth through, with literal timings and no reduced-motion
// switch; on the new site motion comes only from src/motion/motion.css (ADR-007, structure §4).
const MOTION = /^(-(webkit|moz|ms|o)-)?(transition|animation)(-|$)|^scroll-behavior$|^view-transition-|^--tw-(duration|ease)$/i;

// Literal values. With every theme default reset, Tailwind's bare values still compile to literals: z-50 is
// z-index: 50, border-2 is border-width: 2px, opacity-50, ring-1, p-px, scale-105, leading-none, rounded-full,
// sr-only. Each is a decision the DS makes (its --z-* tokens, .kh-sr, the kh- classes' borders, radii, type and
// focus ring), so a utility may hold no number besides layout glue:
// - zero in any unit, 100%, a full viewport (100vh, 100dvh, 100vw) and 1fr;
const FREE_LITERAL = /^[+-]?(\d*\.)?0+([a-z]+|%)?$|^100(%|[dsl]?v[hwbi]|vmin|vmax)$|^1fr$/i;
// - a whole count where the property takes one: order, grid placement, flex grow and shrink, column count;
const COUNT_PROPERTY = /^(order|grid-(column|row)(-start|-end)?|flex|flex-grow|flex-shrink|columns)$/i;
// - Tailwind's own arithmetic around tokens: a fraction of 100% (w-1/2), a token negated (-mt-5: `* -1`), equal
//   tracks and spans (grid-cols-2, col-span-2), the space-y and divide reverse switch.
const GLUE_ARITHMETIC = [
  /calc\(\s*\d+\s*\/\s*\d+\s*\*\s*100%\s*\)/g,
  /\*\s*-1(?![\d.])/g,
  /repeat\(\s*\d+\s*,\s*minmax\(\s*0\s*,\s*1fr\s*\)\s*\)/g,
  /span \d+ \/ span \d+/g,
  /calc\(\s*1\s*-\s*var\(\s*--tw-[\w-]+-reverse\s*\)\s*\)/g,
];
// A number with its unit, not part of an identifier (translate3d) or a custom property name (--space-5).
const NUMBER = /(?<![\w.-])[+-]?(\d*\.)?\d+([a-z]+|%)?/gi;

/** The first literal a utility's declaration holds outside the layout glue above, or undefined. */
function literalIn(decl) {
  let value = decl.value;
  for (const glue of GLUE_ARITHMETIC) value = value.replace(glue, " ");
  value = value.replace(/var\(\s*--[\w-]+/g, "var("); // a token's name is no value; a fallback still is
  for (const [n] of value.matchAll(NUMBER)) {
    if (FREE_LITERAL.test(n)) continue;
    if (COUNT_PROPERTY.test(decl.prop) && /^[+-]?\d+$/.test(n)) continue;
    return n;
  }
  return undefined;
}

/** The outermost rule inside `layer` that holds `node`. */
function utilityOf(node, layer) {
  let rule;
  for (let p = node.parent; p && p !== layer; p = p.parent) if (p.type === "rule") rule = p;
  return rule;
}

/**
 * DS tokens only, and motion only from the shared presets (ADR-002 rule 5, ADR-007): drops every utility Tailwind
 * generates for site.css that has an arbitrary value, holds a literal value or declares motion, so a stray
 * p-[13px], p-(--space-3), z-50, border-2 or transition-all duration-700 in markup produces no CSS. The source
 * guards (test/guards/no-off-token.test.ts, test/guards/motion-properties.test.ts) name the offending file; this
 * makes the rule hold in the shipped CSS too, and test/guards/visual-layer.test.ts proves it.
 */
const dsOnlyUtilities = {
  postcssPlugin: "kheelona-ds-only-utilities",
  OnceExit(root, { result }) {
    const from = root.source?.input.file ?? result.opts.from ?? "";
    if (!SITE_ENTRY.test(from)) return;
    const dropped = new Set();
    root.walkAtRules("layer", (layer) => {
      if (layer.params !== "utilities" || !layer.nodes) return;
      layer.walkRules((rule) => {
        if (ARBITRARY.test(rule.selector)) dropped.add(rule);
      });
      layer.walkDecls((decl) => {
        if (!MOTION.test(decl.prop) && literalIn(decl) === undefined) return;
        const rule = utilityOf(decl, layer);
        if (rule) dropped.add(rule);
      });
    });
    for (const rule of dropped) rule.remove();
    if (dropped.size > 0) {
      const names = [...dropped].map((r) => r.selector);
      result.warn(
        `Dropped ${names.length} utilities with an arbitrary value, a literal value or motion (DS tokens only, ADR-002 rule 5; motion only from src/motion/motion.css, ADR-007): ${names.slice(0, 5).join(" ")}${names.length > 5 ? " ..." : ""}`,
        { plugin: "kheelona-ds-only-utilities" },
      );
    }
  },
};

const config = {
  plugins: [tailwindcss(), dsOnlyUtilities],
};

export default config;
