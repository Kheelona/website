import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import postcss, { type AtRule, type Container, type Declaration, type Rule } from "postcss";
import { beforeAll, describe, expect, it } from "vitest";

/**
 * Motion stays gentle, tokenised and switchable (brief §9.11, ADR-007 with its D049 addendum, architecture §11).
 *
 * In every CSS file of the new design:
 * - only `transform` and `opacity` animate, with the two founder-approved exceptions: `stroke-dashoffset` inside
 *   `.ks-doodle` rules (D049 pick 3B) and `grid-template-rows` with a discrete `content-visibility` transition
 *   inside `.kh-faq__item::details-content` rules (pick 7B);
 * - every duration and easing is a DS token (`--duration-*`, `--ease-*`) or an expression of them;
 * - nothing loops (`infinite`);
 * - every transition and animation is neutralised under `prefers-reduced-motion: reduce` (none, or an opacity
 *   fade: the DS keeps fades and drops movement, README.md:161).
 * motion.css also stays on the class contract of architecture §11.3 and its only literals are the two D049 values.
 *
 * Scope: src/motion, src/styles (generated files included), src/components/{ui,sections,chrome}, src/layouts.
 * Not design-system/ (the DS's own spinner and progress bar are the DS's), and not the legacy
 * src/styles/globals.css, which 6.3 deletes with the old pages.
 */

const ROOT = process.cwd();
const SCOPES = ["src/motion", "src/styles", "src/components/ui", "src/components/sections", "src/components/chrome", "src/layouts"];
const LEGACY = new Set(["src/styles/globals.css"]);

type Sheet = { file: string; css: string };

function shippedSheets(): Sheet[] {
  const walk = (dir: string): string[] => {
    let entries: string[];
    try { entries = readdirSync(dir); } catch { return []; }
    return entries.flatMap((name) => {
      const p = join(dir, name);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });
  };
  return SCOPES.flatMap((s) => walk(join(ROOT, s)))
    .map((p) => relative(ROOT, p).split(sep).join("/"))
    .filter((p) => p.endsWith(".css") && !LEGACY.has(p))
    .sort()
    .map((file) => ({ file, css: readFileSync(join(ROOT, file), "utf8") }));
}

// ---------------------------------------------------------------------------------------------------------------
// The analyser
// ---------------------------------------------------------------------------------------------------------------

const TIME = /^[+-]?(\d*\.)?\d+(ms|s)$/i;
const ZERO_TIME = /^[+-]?(0*\.)?0+(ms|s)$/i;
const EASING_LITERAL = /^(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end)$|^(steps|cubic-bezier|linear)\(/i;
const ANIMATION_KEYWORDS = new Set(["none", "both", "forwards", "backwards", "normal", "reverse", "alternate", "alternate-reverse", "running", "paused"]);
const TRANSITION_KEYWORDS = new Set(["allow-discrete", "normal"]);
const TIMING_PROPS = /^(transition|animation)(-(duration|delay|timing-function|property|name|iteration-count|behavior))?$/;

/** Splits on a separator at parenthesis depth 0. */
function splitTop(value: string, by: "," | " "): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth === 0 && (by === "," ? ch === "," : /\s/.test(ch))) {
      if (cur.trim()) out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const parseVar = (tok: string) => /^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]+))?\)$/.exec(tok);

function inReducedMotion(node: Rule): boolean {
  for (let p: Container | undefined = node.parent as Container | undefined; p && p.type !== "root"; p = p.parent as Container | undefined) {
    if (p.type === "atrule" && (p as AtRule).name === "media" && /prefers-reduced-motion:\s*reduce/.test((p as AtRule).params)) return true;
  }
  return false;
}
const inKeyframes = (node: Rule) => node.parent?.type === "atrule" && /keyframes$/.test((node.parent as AtRule).name);

function allowedFor(selector: string): Set<string> {
  const allowed = new Set(["transform", "opacity"]);
  if (selector.includes(".ks-doodle")) allowed.add("stroke-dashoffset");
  if (selector.includes(".kh-faq__item::details-content")) {
    allowed.add("grid-template-rows");
    allowed.add("content-visibility");
  }
  return allowed;
}

function analyseMotion(sheets: Sheet[]): string[] {
  const findings: string[] = [];
  const roots = sheets.map((s) => ({ ...s, root: postcss.parse(s.css, { from: s.file }) }));

  // Custom properties defined anywhere in scope, so `var(--ks-draw-delay)` can be checked against its definitions.
  const defs = new Map<string, string[]>();
  const keyframes = new Map<string, Set<string>>();
  for (const { root } of roots) {
    root.walkDecls((d) => {
      if (d.prop.startsWith("--")) defs.set(d.prop, [...(defs.get(d.prop) ?? []), d.value]);
    });
    root.walkAtRules(/keyframes$/, (a) => {
      const props = keyframes.get(a.params) ?? new Set<string>();
      a.walkDecls((d) => { props.add(d.prop); });
      keyframes.set(a.params, props);
    });
  }

  const isTokenExpr = (tok: string, family: "duration" | "ease", seen = new Set<string>()): boolean => {
    if (family === "duration" && ZERO_TIME.test(tok)) return true;
    const v = parseVar(tok);
    if (v) {
      const [, name, fallback] = v;
      if (fallback !== undefined && !isTokenExpr(fallback.trim(), family, seen)) return false;
      if (name.startsWith(`--${family}-`)) return true;
      const values = defs.get(name);
      if (!values || seen.has(name)) return false;
      seen.add(name);
      return values.every((value) => isTokenExpr(value.trim(), family, seen));
    }
    if (family === "duration" && /^calc\(/.test(tok)) {
      const vars = tok.match(/var\([^()]*(?:\([^()]*\)[^()]*)*\)/g) ?? [];
      if (vars.length === 0 || !vars.every((x) => isTokenExpr(x, family, seen))) return false;
      return /^calc\([\s\d.+\-*/()]*\)$/.test(vars.reduce((s, x) => s.replace(x, "1"), tok));
    }
    return false;
  };

  /** Animated properties and motion flags of one transition/animation declaration; reports timing violations. */
  const readDecl = (d: Declaration, where: string) => {
    const animated: string[] = [];
    let moves = false;
    const report = (msg: string) => findings.push(`${where}: ${d.prop}: ${msg}`);
    const timing = (tok: string): "duration" | "ease" | null => {
      if (TIME.test(tok)) {
        if (!ZERO_TIME.test(tok)) report(`duration "${tok}" is not a DS --duration-* token`);
        return "duration";
      }
      if (EASING_LITERAL.test(tok)) { report(`easing "${tok}" is not a DS --ease-* token`); return "ease"; }
      if (/^(var|calc)\(/.test(tok)) {
        if (isTokenExpr(tok, "duration")) return "duration";
        if (isTokenExpr(tok, "ease")) return "ease";
        report(`"${tok}" is not a DS duration or easing token`);
        return "duration";
      }
      return null;
    };
    const items = splitTop(d.value, ",");
    switch (d.prop) {
      case "transition":
      case "animation":
        for (const item of items) {
          const toks = splitTop(item, " ");
          if (toks.length === 1 && toks[0] === "none") continue;
          const times: string[] = [];
          let eased = false;
          for (const tok of toks) {
            const kind = timing(tok);
            if (kind === "duration") times.push(tok);
            else if (kind === "ease") eased = true;
            else if (tok === "infinite") report("loops (infinite)");
            else if (/^\d+(\.\d+)?$/.test(tok)) continue;
            else if (d.prop === "transition" && !TRANSITION_KEYWORDS.has(tok)) animated.push(tok);
            else if (d.prop === "animation" && !ANIMATION_KEYWORDS.has(tok)) {
              if (!keyframes.has(tok)) report(`uses keyframes "${tok}" that no shipped CSS defines`);
              else animated.push(...keyframes.get(tok)!);
            }
          }
          if (times.length > 0 && !ZERO_TIME.test(times[0])) {
            moves = true;
            if (!eased) report(`"${item}" has no explicit DS --ease-* token`);
          }
        }
        break;
      case "transition-property":
        for (const p of items) if (p !== "none") { animated.push(p); moves = true; }
        break;
      case "animation-name":
        for (const n of items) {
          if (n === "none") continue;
          moves = true;
          if (!keyframes.has(n)) report(`uses keyframes "${n}" that no shipped CSS defines`);
          else animated.push(...keyframes.get(n)!);
        }
        break;
      case "transition-duration":
      case "transition-delay":
      case "animation-duration":
      case "animation-delay":
        for (const t of items) if (!isTokenExpr(t, "duration")) report(`"${t}" is not a DS --duration-* token`);
        break;
      case "transition-timing-function":
      case "animation-timing-function":
        for (const t of items) if (!isTokenExpr(t, "ease")) report(`"${t}" is not a DS --ease-* token`);
        break;
      case "animation-iteration-count":
        if (items.includes("infinite")) report("loops (infinite)");
        break;
    }
    return { animated, moves };
  };

  const moving = new Map<string, { transition: boolean; animation: boolean; where: string }>();
  const neutral = new Map<string, { transition: boolean; animation: boolean }>();

  for (const { file, root } of roots) {
    root.walkRules((rule) => {
      if (inKeyframes(rule)) return;
      const reduced = inReducedMotion(rule);
      for (const d of rule.nodes.filter((n): n is Declaration => n.type === "decl" && TIMING_PROPS.test(n.prop))) {
        for (const selector of rule.selectors.map((s) => s.replace(/\s+/g, " ").trim())) {
          const where = `${file}: ${selector}${reduced ? " (reduced motion)" : ""}`;
          const { animated, moves } = readDecl(d, where);
          const allowed = reduced ? new Set(["opacity"]) : allowedFor(selector);
          for (const p of new Set(animated)) {
            if (!allowed.has(p)) {
              findings.push(`${where}: animates "${p}"${reduced ? " under reduced motion (only an opacity fade may remain)" : " (only transform and opacity; the two D049 exceptions are scoped to .ks-doodle and .kh-faq__item::details-content)"}`);
            }
          }
          const kind = d.prop.startsWith("transition") ? "transition" : "animation";
          if (!reduced && moves) {
            const m = moving.get(selector) ?? { transition: false, animation: false, where };
            m[kind] = true;
            moving.set(selector, m);
          }
          if (reduced && (d.prop === "transition" || d.prop === "transition-property" || d.prop === "animation" || d.prop === "animation-name")) {
            const n = neutral.get(selector) ?? { transition: false, animation: false };
            if (kind === "transition") n.transition = d.value === "none" || animated.every((p) => p === "opacity");
            else n.animation = d.value === "none";
            neutral.set(selector, n);
          }
        }
      }
    });
  }
  for (const [selector, m] of moving) {
    const n = neutral.get(selector);
    if (m.transition && !n?.transition) findings.push(`${m.where}: transition not neutralised under prefers-reduced-motion: reduce`);
    if (m.animation && !n?.animation) findings.push(`${m.where}: animation not neutralised under prefers-reduced-motion: reduce`);
  }
  return findings;
}

// ---------------------------------------------------------------------------------------------------------------

const ok = (css: string) => analyseMotion([{ file: "fixture.css", css }]);
const REDUCED = (sel: string, decl = "transition: none;") => `@media (prefers-reduced-motion: reduce) { ${sel} { ${decl} } }`;

describe("the motion analyser catches planted violations", () => {
  it("accepts a tokenised transform and opacity transition that reduced motion switches off", () => {
    expect(ok(`.ks-x { transition: opacity var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x")}`)).toEqual([]);
  });

  it("rejects a width transition", () => {
    expect(ok(`.ks-x { transition: width var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/animates "width"/);
  });

  it("rejects an infinite animation", () => {
    const css = `@keyframes ks-spin { to { transform: rotate(1turn); } } .ks-x { animation: ks-spin var(--duration-base) var(--ease-standard) infinite; } ${REDUCED(".ks-x", "animation: none;")}`;
    expect(ok(css).join("\n")).toMatch(/loops \(infinite\)/);
    expect(ok(`.ks-x { animation-iteration-count: infinite; }`).join("\n")).toMatch(/loops \(infinite\)/);
  });

  it("rejects literal durations and easings", () => {
    const found = ok(`.ks-x { transition: opacity 200ms ease-in-out; } ${REDUCED(".ks-x")}`).join("\n");
    expect(found).toMatch(/duration "200ms"/);
    expect(found).toMatch(/easing "ease-in-out"/);
    expect(ok(`.ks-x { transition: opacity var(--duration-base) cubic-bezier(0, 0, 1, 1); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/cubic-bezier/);
    expect(ok(`.ks-x { transition-duration: 0.3s; }`).join("\n")).toMatch(/"0.3s" is not a DS --duration-\* token/);
    expect(ok(`.ks-x { transition: opacity var(--duration-base); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/no explicit DS --ease-\* token/);
  });

  it("accepts token expressions and local custom properties built from tokens, rejects ones that are not", () => {
    expect(ok(`.ks-d { --ks-wait: calc(var(--duration-base) * 2); animation: ks-in var(--duration-fast) var(--ease-standard) var(--ks-wait) both; } @keyframes ks-in { from { opacity: 0; } } ${REDUCED(".ks-d", "animation: none;")}`)).toEqual([]);
    expect(ok(`.ks-d { --ks-wait: 300ms; animation: ks-in var(--duration-fast) var(--ease-standard) var(--ks-wait) both; } @keyframes ks-in { from { opacity: 0; } } ${REDUCED(".ks-d", "animation: none;")}`).join("\n")).toMatch(/var\(--ks-wait\)/);
  });

  it("rejects a transition or animation that reduced motion leaves running", () => {
    expect(ok(`.ks-x { transition: transform var(--duration-base) var(--ease-standard); }`).join("\n")).toMatch(/not neutralised/);
    expect(ok(`.ks-x { transition: transform var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x", "transition: transform var(--duration-base) var(--ease-standard);")}`).join("\n")).toMatch(/under reduced motion/);
    expect(ok(`@keyframes ks-in { from { opacity: 0; } } .ks-x { animation: ks-in var(--duration-base) var(--ease-standard); }`).join("\n")).toMatch(/animation not neutralised/);
    expect(ok(`.ks-x { transition: transform var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x", "transition: opacity var(--duration-base) var(--ease-standard);")}`)).toEqual([]);
  });

  it("allows stroke-dashoffset only in .ks-doodle rules and grid-template-rows only in .kh-faq__item::details-content rules", () => {
    const draw = `@keyframes ks-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }`;
    expect(ok(`${draw} .ks-doodle path { animation: ks-draw var(--duration-draw) var(--ease-standard) both; } ${REDUCED(".ks-doodle path", "animation: none;")}`)).toEqual([]);
    expect(ok(`${draw} .ks-card path { animation: ks-draw var(--duration-draw) var(--ease-standard) both; } ${REDUCED(".ks-card path", "animation: none;")}`).join("\n")).toMatch(/animates "stroke-dashoffset"/);
    const rows = "transition: grid-template-rows var(--duration-enter) var(--ease-standard), content-visibility var(--duration-enter) var(--ease-standard) allow-discrete;";
    expect(ok(`.kh-faq__item::details-content { ${rows} } ${REDUCED(".kh-faq__item::details-content")}`)).toEqual([]);
    expect(ok(`.ks-panel { ${rows} } ${REDUCED(".ks-panel")}`).join("\n")).toMatch(/animates "grid-template-rows"/);
  });

  it("rejects keyframes no shipped CSS defines", () => {
    expect(ok(`.ks-x { animation: ks-missing var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x", "animation: none;")}`).join("\n")).toMatch(/keyframes "ks-missing"/);
  });
});

describe("the shipped CSS", () => {
  const sheets = shippedSheets();

  it("includes motion.css (the guard never passes on an empty scope)", () => {
    expect(sheets.map((s) => s.file)).toContain("src/motion/motion.css");
  });

  it("animates only transform and opacity (plus the two D049 exceptions), with DS tokens, no loops, and nothing left running under reduced motion", () => {
    expect(analyseMotion(sheets)).toEqual([]);
  });
});

describe("motion.css", () => {
  let css = "";
  let root = postcss.parse("");
  let all = "";
  beforeAll(() => {
    css = readFileSync(join(ROOT, "src/motion/motion.css"), "utf8");
    root = postcss.parse(css);
    const selectors: string[] = [];
    root.walkRules((r) => { if (!inKeyframes(r)) selectors.push(...r.selectors); });
    all = selectors.join("\n");
  });

  // Architecture §11.3 (hooks) and §11.2 (the DS classes each preset acts on).
  const CONTRACT_CLASSES = new Set([
    "js-motion", "is-in", "is-focus", "is-hidden", "ks-doodle", "ks-doodle__fill", "ks-btn__arrow", "kh-btn--cta",
    "ks-faq__clip", "kh-faq__item", "kh-faq__sign", "ks-film", "ks-film__frame", "kh-buybar", "kh-drawer", "kh-drawer__panel",
    "ks-wa", "ks-wa__label", "ks-has-float", "kh-sticker",
  ]);
  const CONTRACT_ATTRIBUTES = new Set(["data-reveal", "data-draw", "data-draw-order", "data-buybar", "open", "pathLength"]);

  it("acts only on the class contract of architecture §11.3", () => {
    const classes = new Set([...all.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
    const attributes = new Set([...all.matchAll(/\[([a-zA-Z-]+)/g)].map((m) => m[1]));
    expect([...classes].filter((c) => !CONTRACT_CLASSES.has(c))).toEqual([]);
    expect([...attributes].filter((a) => !CONTRACT_ATTRIBUTES.has(a))).toEqual([]);
  });

  it("has a preset for every row of architecture §11.2 (D049 picks and the D050 bubble)", () => {
    const rows: Array<[string, RegExp]> = [
      ["1A reveal", /html\.js-motion \[data-reveal\]\.is-in/],
      ["1b sticker settle", /\[data-reveal\] \.kh-sticker/],
      ["3B doodle draw", /\.ks-doodle\[data-draw\]/],
      ["3B draw order", /\[data-draw-order="5"\]/],
      ["3B fills", /\.ks-doodle__fill/],
      ["4A buy bar", /\.kh-buybar\.is-hidden/],
      ["5A drawer", /dialog\.kh-drawer\[open\] \.kh-drawer__panel/],
      ["5A scrim", /dialog\.kh-drawer\[open\]::backdrop/],
      ["6B arrow nudge", /\.kh-btn--cta:hover \.ks-btn__arrow/],
      ["7B FAQ", /\.kh-faq__item\[open\]::details-content/],
      ["7B clip", /\.ks-faq__clip/],
      ["8B film focus", /\.ks-film\.is-focus \.ks-film__frame/],
      ["D050 lift", /html\[data-buybar="shown"\] \.ks-wa/],
      ["D050 label", /\.ks-wa__label/],
    ];
    for (const [row, pattern] of rows) expect(all, row).toMatch(pattern);
    expect(css).toMatch(/@supports selector\(::details-content\)/);
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\)/);
    expect(css).toMatch(/translateX\(var\(--ks-nudge\)\)/);
    expect(css).toMatch(/scale\(var\(--ks-film-focus\)\)/);
    expect(css).toMatch(/var\(--ks-buybar-h/);
  });

  it("never keys a doodle stroke on [pathLength], which Chromium does not restyle when html.js-motion arrives", () => {
    // Probe 2026-10-12, Chromium 153: `html.on .d path[pathLength]` stays unstyled after `on` is added to <html> at
    // run time (the SVG attribute is camelCase; the invalidation set holds it lower-cased), while `html.on .d path`
    // restyles. MotionController adds js-motion after hydration, so the doodle would never wait undrawn.
    const selectorsWithAttr = all.split("\n").filter((s) => /\[pathlength\]/i.test(s));
    expect(selectorsWithAttr).toEqual([]);
  });

  it("defines the two D049 literals once each, and holds no other literal value", () => {
    // Allowed besides tokens: zero, the full-size translate of the bar and drawer (100%), the FAQ rows (0fr, 1fr),
    // opacity 1, the normalised doodle stroke (pathLength="1", so dasharray and dashoffset 1), calc multipliers.
    const ALLOWED = new Set(["0", "0s", "0ms", "0px", "0fr", "1fr", "100%"]);
    const literals: string[] = [];
    root.walkDecls((d) => {
      if (d.prop === "--ks-nudge" || d.prop === "--ks-film-focus") { literals.push(`${d.prop}: ${d.value}`); return; }
      for (const [tok] of d.value.replace(/var\(--[\w-]+/g, "").matchAll(/-?\d*\.?\d+[a-z%]*/gi)) {
        if (ALLOWED.has(tok)) continue;
        if (tok === "1" && (d.prop === "opacity" || d.prop.startsWith("stroke-dash"))) continue;
        if (/^-?\d+$/.test(tok) && d.value.includes("calc(")) continue;
        literals.push(`${d.prop}: ${d.value}`);
      }
    });
    expect(literals.sort()).toEqual(["--ks-film-focus: 1.05", "--ks-nudge: 5px"]);
  });
});
