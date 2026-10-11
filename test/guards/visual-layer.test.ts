import { readFileSync } from "node:fs";
import { join } from "node:path";
import postcss, { type AtRule, type ChildNode, type Container, type Root } from "postcss";
import { beforeAll, describe, expect, it } from "vitest";
import postcssConfig from "../../postcss.config.mjs";
import { buildComposeCss } from "../../scripts/assets/build-compose-css.mjs";

/**
 * The one CSS entry loads the approved cascade (ADR-002, architecture §4.1).
 *
 * The mockups the founder approved load tokens.css, bundle.css, then composition CSS, all unlayered. site.css
 * must ship that cascade: DS tokens (font-less), DS fonts, bundle.css as delivered, type steps, motion presets,
 * the composition manifest, and only then Tailwind's theme and utilities inside cascade layers, with no
 * preflight. Unlayered CSS beats any layer, so a utility can never restyle a DS class. site.css is compiled here
 * through the project's own PostCSS pipeline (postcss.config.mjs), the same one Next and Storybook run.
 */

const ROOT = process.cwd();
const SITE = join(ROOT, "src/styles/site.css");
const siteCss = readFileSync(SITE, "utf8");

async function compile(css: string): Promise<Root> {
  const result = await postcss(postcssConfig.plugins).process(css, { from: SITE });
  return postcss.parse(result.css);
}

/** Top-level position of the first node matching `test` (searching inside each top-level node). */
function indexOf(root: Root, test: (n: ChildNode) => boolean): number {
  return root.nodes.findIndex((top) => {
    if (test(top)) return true;
    let hit = false;
    if ("walk" in top) top.walk((n) => { if (test(n)) hit = true; });
    return hit;
  });
}
const ruleWith = (selector: string) => (n: ChildNode) => n.type === "rule" && n.selector === selector;
/** The name of the nearest enclosing @layer block, if any. */
const inLayer = (n: ChildNode): string | undefined => {
  for (let p = n.parent as Container | undefined; p && p.type !== "root"; p = p.parent as Container | undefined) {
    if (p.type === "atrule" && (p as AtRule).name === "layer") return (p as AtRule).params;
  }
  return undefined;
};

describe("site.css source", () => {
  it("declares the layer order first, then imports in the order of architecture §4.1", () => {
    const at = postcss.parse(siteCss).nodes.filter((n): n is AtRule => n.type === "atrule");
    expect(at.map((n) => `@${n.name} ${n.params}`)).toEqual([
      "@layer theme, utilities",
      '@import "./generated/ds-tokens.css"',
      '@import "./generated/fonts.css"',
      '@import "../../design-system/project/components/bundle.css"',
      '@import "./generated/type-steps.css"',
      '@import "../motion/motion.css"',
      '@import "./generated/compose.css"',
      '@import "tailwindcss/theme.css" layer(theme)',
      '@import "tailwindcss/utilities.css" layer(utilities)',
      '@import "./tailwind-theme.css"',
      '@source "../**/*.{ts,tsx}"',
      '@source not "../**/*.{test,stories}.tsx"',
    ]);
  });

  it("never imports Tailwind's preflight or the whole tailwindcss entry", () => {
    const imports = postcss.parse(siteCss).nodes.filter((n): n is AtRule => n.type === "atrule" && n.name === "import").map((n) => n.params);
    expect(imports.filter((p) => /preflight|^"tailwindcss"/.test(p))).toEqual([]);
  });
});

describe("site.css compiled through postcss.config.mjs", () => {
  let out: Root;
  let probe: Root;
  beforeAll(async () => {
    buildComposeCss(); // the predev/prebuild step; compose.css is git-ignored, so a fresh clone has none yet
    out = await compile(siteCss);
    probe = await compile(`${siteCss}\n@source inline("p-[13px] bg-red-500 [color:red] p-(--space-3) p-5 flex lg:p-7");`);
  }, 60_000);

  it("keeps the cascade order: tokens, fonts, bundle.css, type steps, motion, compose, then Tailwind's layers", () => {
    const order = [
      indexOf(out, (n) => n.type === "decl" && n.prop === "--fur-100"), // 1. ds-tokens.css
      indexOf(out, (n) => n.type === "atrule" && (n as AtRule).name === "font-face"), // 2. fonts.css
      indexOf(out, ruleWith(".kh-btn--cta")), // 3. bundle.css
      indexOf(out, ruleWith(".ks-type-display-xl")), // 4. type-steps.css
      indexOf(out, (n) => n.type === "rule" && n.selector.includes("[data-reveal]")), // 5. motion.css
    ];
    const compose = buildComposeCss().files;
    if (compose.length > 0) {
      const first = postcss.parse(readFileSync(join(ROOT, "src", compose[0]), "utf8")).nodes.find((n) => n.type === "rule");
      if (first?.type === "rule") order.push(indexOf(out, ruleWith(first.selector))); // 6. compose.css (from wave 2 on)
    }
    order.push(indexOf(out, (n) => n.type === "atrule" && (n as AtRule).name === "layer" && (n as AtRule).params === "theme" && !!(n as AtRule).nodes)); // 7.
    for (const i of order) expect(i).toBeGreaterThanOrEqual(0);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(new Set(order).size).toBe(order.length);
  });

  it("declares the layer order before any layered block, and leaves DS, motion and composition CSS unlayered", () => {
    const statements = out.nodes.filter((n): n is AtRule => n.type === "atrule" && n.name === "layer" && !n.nodes);
    expect(statements.map((s) => s.params)).toContain("theme, utilities");
    const firstBlock = out.nodes.findIndex((n) => n.type === "atrule" && (n as AtRule).name === "layer" && !!(n as AtRule).nodes);
    expect(out.nodes.findIndex((n) => n === statements.find((s) => s.params === "theme, utilities"))).toBeLessThan(firstBlock);
    for (const selector of [".kh-btn--cta", ".ks-type-display-xl"]) {
      out.walkRules((r) => { if (r.selector === selector) expect(inLayer(r), selector).toBeUndefined(); });
    }
    out.walkRules((r) => { if (r.selector.includes("[data-reveal]")) expect(inLayer(r), r.selector).toBeUndefined(); });
  });

  it("has no preflight: no base layer and no Tailwind reset", () => {
    const layers = new Set<string>();
    out.walkAtRules("layer", (a) => { if (a.nodes) layers.add(a.params); });
    expect([...layers].filter((l) => l !== "theme" && l !== "utilities" && l !== "properties")).toEqual([]);
    out.walkRules((r) => expect(r.selector, "Tailwind preflight selector").not.toContain("::file-selector-button"));
  });

  it("drops arbitrary values and the (--var) shorthand, and theme defaults produce nothing", () => {
    const selectors: string[] = [];
    probe.walkRules((r) => { selectors.push(r.selector); });
    expect(selectors).toContain(".p-5");
    expect(selectors).toContain(".flex");
    for (const s of [".p-\\[13px\\]", ".bg-red-500", ".\\[color\\:red\\]", ".p-\\(--space-3\\)"]) expect(selectors, s).not.toContain(s);
    expect(probe.toString()).not.toMatch(/padding: 13px/);
    expect(selectors.filter((s) => /\\\[|\\\(/.test(s))).toEqual([]);
  });

  it("puts Tailwind's utilities inside the utilities layer", () => {
    const seen: string[] = [];
    probe.walkRules((r) => {
      if (r.selector === ".p-5" || r.selector === ".flex" || r.selector === ".lg\\:p-7") {
        seen.push(r.selector);
        expect(inLayer(r), r.selector).toBe("utilities");
      }
    });
    expect(seen.sort()).toEqual([".flex", ".lg\\:p-7", ".p-5"]);
  });
});

describe("Storybook", () => {
  it("loads the same CSS entry as the site", () => {
    const preview = readFileSync(join(ROOT, ".storybook/preview.tsx"), "utf8");
    expect(preview).toMatch(/^import "\.\.\/src\/styles\/site\.css";$/m);
    expect(preview).not.toMatch(/^import .*globals\.css/m);
  });
});
