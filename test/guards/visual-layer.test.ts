import { readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import tailwindcss from "@tailwindcss/postcss";
import postcss, { type AtRule, type ChildNode, type Container, type Root } from "postcss";
import { beforeAll, describe, expect, it, vi } from "vitest";
import postcssConfig from "../../postcss.config.mjs";
import { buildComposeCss } from "../../scripts/assets/build-compose-css.mjs";

/**
 * The one CSS entry loads the approved cascade (ADR-002, architecture §4.1).
 *
 * The mockups the founder approved load tokens.css, bundle.css, then composition CSS, all unlayered. site.css
 * must ship that cascade: DS tokens (font-less), DS fonts, bundle.css as delivered, type steps, motion presets,
 * the composition manifest, and only then Tailwind's theme and utilities inside cascade layers, with no
 * preflight. Unlayered CSS beats any layer, so a utility can never restyle a DS class. Tailwind finds class names
 * only where site.css's @source lines point (src/ TypeScript, tests and stories aside): `source(none)` turns off its
 * automatic detection, which would otherwise scan the whole repository (wiki/, design-system/, mockup/, test/), so a
 * wiki edit could change the shipped CSS. site.css is compiled here through the project's own PostCSS pipeline
 * (postcss.config.mjs), the same one Next and Storybook run.
 */

const ROOT = process.cwd();
const SITE = join(ROOT, "src/styles/site.css");
const siteCss = readFileSync(SITE, "utf8");

/** Repo-relative paths of the files the last compile read (its dependency messages: imports and scanned sources). */
let scannedFiles: string[] = [];

/**
 * Compiles `css` as site.css. @tailwindcss/postcss caches its compiler per `from` path and reuses it while the files
 * it read keep their mtimes, so a second compile of different text under the same path would return the first
 * result: each compile gets its own key (`site.css?<key>`), which postcss.config.mjs still treats as site.css.
 */
async function compile(css: string, key: string): Promise<Root> {
  const result = await postcss(postcssConfig.plugins).process(css, { from: `${SITE}?visual-layer-${key}` });
  scannedFiles = result.messages.filter((m) => m.type === "dependency").map((m) => relative(ROOT, m.file as string).split(sep).join("/"));
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
      '@import "tailwindcss/utilities.css" layer(utilities) source(none)',
      '@import "./tailwind-theme.css"',
      '@source "../**/*.{ts,tsx}"',
      '@source not "../**/*.{test,stories}.{ts,tsx}"',
    ]);
  });

  it("never imports Tailwind's preflight or the whole tailwindcss entry", () => {
    const imports = postcss.parse(siteCss).nodes.filter((n): n is AtRule => n.type === "atrule" && n.name === "import").map((n) => n.params);
    expect(imports.filter((p) => /preflight|^"tailwindcss"/.test(p))).toEqual([]);
  });
});

/**
 * Tailwind's bare values compile to literals even with every theme default reset (`z-50` is `z-index: 50`,
 * `border-2` is `border-width: 2px`): each is a visual decision the DS makes (its --z-* tokens, .kh-sr, the kh-
 * classes' borders, radii, type and focus ring), so none may ship (ADR-002 rule 5, tokens only).
 */
const LITERAL_UTILITIES = [
  "z-50", "-z-1", "border", "border-2", "border-t-4", "divide-x-2", "opacity-50", "ring", "ring-1", "p-px", "h-px",
  "scale-105", "rotate-45", "skew-x-3", "leading-none", "rounded-full", "stroke-2", "decoration-2",
  "underline-offset-2", "outline", "outline-2", "outline-hidden", "aspect-square", "brightness-50", "bg-cta/50",
  "sr-only", "line-clamp-2", "lg:z-50",
];
/** Layout glue that carries no literal besides zero, 100%, a full viewport, a fraction or a grid or flex count. */
const GLUE_UTILITIES = [
  "p-5", "flex", "lg:p-7", "bg-deep-sun", "grid-cols-2", "sm:grid-cols-3", "col-span-2", "col-start-2",
  "col-span-full", "order-first", "-order-1", "flex-1", "flex-initial", "grow", "shrink-0", "basis-1/3", "w-1/2",
  "w-full", "h-screen", "min-h-dvh", "max-w-content", "-mt-5", "space-y-4", "border-0", "opacity-0", "top-1/2",
  "-translate-x-1/2", "translate-y-full", "columns-2", "z-auto", "overflow-hidden", "hidden",
];
/** The selector Tailwind writes for a class name. */
const selectorOf = (cls: string) => `.${cls.replace(/[/:]/g, "\\$&")}`;

describe("site.css compiled through postcss.config.mjs", () => {
  let out: Root;
  let probe: Root;
  let literal: Root;
  beforeAll(async () => {
    buildComposeCss(); // the predev/prebuild step; compose.css is git-ignored, so a fresh clone has none yet
    out = await compile(siteCss, "site");
    const siteScan = scannedFiles; // the probes below add an inline source; keep what the real entry reads
    probe = await compile(`${siteCss}\n@source inline("p-[13px] bg-red-500 [color:red] p-(--space-3) p-5 flex lg:p-7 bg-deep-sun");`, "probe");
    literal = await compile(`${siteCss}\n@source inline("${[...LITERAL_UTILITIES, ...GLUE_UTILITIES].join(" ")}");`, "literal");
    scannedFiles = siteScan;
  }, 60_000);

  it("drops utilities that carry a literal value instead of a token (Tailwind's bare values), and keeps layout glue", () => {
    const selectors = new Set<string>();
    literal.walkRules((r) => { if (inLayer(r) === "utilities") selectors.add(r.selector); });
    expect(LITERAL_UTILITIES.map(selectorOf).filter((s) => selectors.has(s))).toEqual([]);
    expect(GLUE_UTILITIES.map(selectorOf).filter((s) => !selectors.has(s))).toEqual([]);
    // Only the utilities layer: bundle.css itself holds `width: 1px` (.kh-sr), as delivered.
    const utilities = literal.nodes.filter((n) => n.type === "atrule" && n.name === "layer" && n.params === "utilities").join("\n");
    expect(utilities).toMatch(/grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
    for (const decl of [/z-index: 50/, /border-width: 2px/, /opacity: 50%/, /width: 1px/, /scale-x: 105%/]) expect(utilities).not.toMatch(decl);
  });

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
    // 7. Tailwind's layers: the first layered block (theme only appears when a utility reads a theme variable that
    // @theme inline does not inline; utilities whenever src/ uses one).
    order.push(indexOf(out, (n) => n.type === "atrule" && (n as AtRule).name === "layer" && ["theme", "utilities"].includes((n as AtRule).params) && !!(n as AtRule).nodes));
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
    expect(selectors, "the probe's own candidates reach the compiler").toContain(".bg-deep-sun");
    for (const s of [".p-\\[13px\\]", ".bg-red-500", ".\\[color\\:red\\]", ".p-\\(--space-3\\)"]) expect(selectors, s).not.toContain(s);
    expect(probe.toString()).not.toMatch(/padding: 13px/);
    expect(selectors.filter((s) => /\\\[|\\\(/.test(s))).toEqual([]);
  });

  it("finds class names only in src/ TypeScript: no automatic detection of wiki/, design-system/ or mockup/, no tests or stories", () => {
    const scanned = scannedFiles.filter((f) => !f.endsWith(".css"));
    expect(scanned.length).toBeGreaterThan(0);
    expect(scanned.filter((f) => !/^src\/.+\.(ts|tsx)$/.test(f) || /\.(test|stories)\.tsx?$/.test(f))).toEqual([]);
    // src/ holds .test.ts files too (src/lib/seo.test.ts, fbq.test.ts): their strings must not add utilities either.
    expect(scanned.some((f) => f.startsWith("src/lib/"))).toBe(true);
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

/** Runs `make` with NODE_ENV=production, as next build does: @tailwindcss/postcss reads it when a plugin is created. */
async function asProduction<T>(make: () => Promise<T> | T): Promise<T> {
  const env = process.env as Record<string, string | undefined>; // Next's types make NODE_ENV read-only
  const was = env.NODE_ENV;
  env.NODE_ENV = "production";
  try {
    return await make();
  } finally {
    if (was === undefined) delete env.NODE_ENV;
    else env.NODE_ENV = was;
  }
}

/** postcss.config.mjs's plugins as next build creates them. */
async function productionPlugins(): Promise<typeof postcssConfig.plugins> {
  vi.resetModules();
  return asProduction(async () => (await import("../../postcss.config.mjs")).default.plugins);
}

describe("site.css compiled as next build compiles it (NODE_ENV=production)", () => {
  // @tailwindcss/postcss optimises its output when the plugin is created under NODE_ENV=production (next build) but
  // not under test: it would fold w-1/2 into `width: 50%` and flatten nesting before the filter reads the CSS, so the
  // shipped CSS would differ from what the guards above prove. Found on a scratch next build, 2026-10-11.
  it("drops and keeps the same utilities as the test pipeline", async () => {
    const plugins = await productionPlugins();
    const css = `${siteCss}\n@source inline("${[...LITERAL_UTILITIES, ...GLUE_UTILITIES].join(" ")}");`;
    const out = postcss.parse((await postcss(plugins).process(css, { from: `${SITE}?visual-layer-production` })).css);
    const selectors = new Set<string>();
    out.walkRules((r) => { if (inLayer(r) === "utilities") selectors.add(r.selector); });
    expect(LITERAL_UTILITIES.map(selectorOf).filter((s) => selectors.has(s))).toEqual([]);
    expect(GLUE_UTILITIES.map(selectorOf).filter((s) => !selectors.has(s))).toEqual([]);
  }, 60_000);

  // Task 1.2 review (2026-10-11): one unoptimised Tailwind for every file reshaped the legacy globals.css in next
  // build (60,988 to 63,364 bytes: media blocks no longer merged). Only site.css needs Tailwind unoptimised.
  it("compiles every other CSS file, the legacy globals.css included, exactly as Tailwind's default plugin does", async () => {
    const plugins = await productionPlugins();
    const reference = await asProduction(() => tailwindcss());
    const GLOBALS = join(ROOT, "src/styles/globals.css");
    const legacy = readFileSync(GLOBALS, "utf8");
    const viaConfig = (await postcss(plugins).process(legacy, { from: `${GLOBALS}?visual-layer-legacy-config` })).css;
    const viaDefault = (await postcss([reference]).process(legacy, { from: `${GLOBALS}?visual-layer-legacy-default` })).css;
    expect(viaConfig.length).toBeGreaterThan(0);
    expect(viaConfig).toBe(viaDefault);
  }, 60_000);
});

describe("postcss.config.mjs on Next.js", () => {
  // Next's PostCSS guide asks for plugin names as strings; postcss.config.mjs passes plugin objects (its header says
  // why). Turbopack 16.3.8 runs them, which a scratch next build showed on 2026-10-11; nothing in Vitest runs
  // Turbopack, so a Next upgrade that stopped running the filter would pass every guard above. This pin makes the
  // upgrade repeat that check.
  it("runs on the Next version its plugin objects were verified on", () => {
    const next = (JSON.parse(readFileSync(join(ROOT, "node_modules/next/package.json"), "utf8")) as { version: string }).version;
    expect(
      next,
      "Next changed: import src/styles/site.css in a scratch root layout, run next build, and check that the built CSS's @layer utilities holds no .transition, .duration-, .z-50, .border-2 or \\[ selector while .p-5 is present, and that src/styles/globals.css builds byte for byte as with the plain `\"@tailwindcss/postcss\": {}` config; then update this version",
    ).toBe("16.3.8");
  });
});

describe("Storybook", () => {
  it("loads the same CSS entry as the site", () => {
    const preview = readFileSync(join(ROOT, ".storybook/preview.tsx"), "utf8");
    expect(preview).toMatch(/^import "\.\.\/src\/styles\/site\.css";$/m);
    expect(preview).not.toMatch(/^import .*globals\.css/m);
  });
});
