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
// on arbitrary values and is left alone.
const SITE_ENTRY = /(^|[\\/])src[\\/]styles[\\/]site\.css$/;
// An escaped "[" or "(" in a utility selector is an arbitrary value, property or variant: p-[13px],
// [color:red], data-[open]:p-5, or the (--var) shorthand p-(--space-3).
const ARBITRARY = /\\[[(]/;

/**
 * DS tokens only (ADR-002 rule 5): drops every arbitrary-value utility Tailwind generates for site.css, so a
 * stray p-[13px] or p-(--space-3) in markup produces no CSS. The source guard (test/guards/no-off-token.test.ts)
 * names the offending file; this makes the rule hold in the shipped CSS too.
 */
const noArbitraryValues = {
  postcssPlugin: "kheelona-no-arbitrary-values",
  OnceExit(root, { result }) {
    const from = root.source?.input.file ?? result.opts.from ?? "";
    if (!SITE_ENTRY.test(from)) return;
    const dropped = [];
    root.walkAtRules("layer", (layer) => {
      if (layer.params !== "utilities") return;
      layer.walkRules((rule) => {
        if (ARBITRARY.test(rule.selector)) {
          dropped.push(rule.selector);
          rule.remove();
        }
      });
    });
    if (dropped.length > 0) {
      result.warn(
        `Dropped ${dropped.length} arbitrary-value utilities (DS tokens only, ADR-002): ${dropped.slice(0, 5).join(" ")}${dropped.length > 5 ? " ..." : ""}`,
        { plugin: "kheelona-no-arbitrary-values" },
      );
    }
  },
};

const config = {
  plugins: [tailwindcss(), noArbitraryValues],
};

export default config;
