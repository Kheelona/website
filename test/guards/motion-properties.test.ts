import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, posix, relative, sep } from "node:path";
import postcss, { type AtRule, type Container, type Declaration, type Rule } from "postcss";
import { beforeAll, describe, expect, it } from "vitest";
import { collectComposeFiles } from "../../scripts/assets/build-compose-css.mjs";

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
 *   fade: the DS keeps fades and drops movement, README.md:161), by a rule for the same selector that comes later
 *   in the cascade (site.css import order, then the compose manifest) than the last rule that moves it;
 * - a timing that names nothing counts as animating `all`: a transition with no property (transition-property
 *   starts as `all`), or an animation-duration in a rule with no animation-name while another rule names one.
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
  const files = SCOPES.flatMap((s) => walk(join(ROOT, s)))
    .map((p) => relative(ROOT, p).split(sep).join("/"))
    .filter((p) => p.endsWith(".css") && !LEGACY.has(p));
  return cascadeSort(files, readFileSync(join(ROOT, SITE_CSS), "utf8"), collectComposeFiles(join(ROOT, "src")))
    .map((file) => ({ file, css: readFileSync(join(ROOT, file), "utf8") }));
}

const SITE_CSS = "src/styles/site.css";
const COMPOSE_CSS = "src/styles/generated/compose.css";

/**
 * `files` in the order the browser cascades them: site.css's relative imports in order, with the compose manifest
 * (collectComposeFiles, the order build-compose-css.mjs writes) where compose.css is imported. Files site.css never
 * loads go last, alphabetically. The neutralisation check depends on this: a later rule wins.
 */
function cascadeSort(files: string[], siteCss: string, composeFiles: string[]): string[] {
  const order: string[] = [];
  postcss.parse(siteCss).walkAtRules("import", (a) => {
    const spec = /^["']([^"']+)["']/.exec(a.params)?.[1];
    if (!spec?.startsWith(".")) return;
    const path = posix.join(posix.dirname(SITE_CSS), spec);
    if (path === COMPOSE_CSS) order.push(...composeFiles.map((f) => `src/${f}`));
    else order.push(path);
  });
  const rank = (f: string) => (order.includes(f) ? order.indexOf(f) : order.length);
  return [...files].sort((a, b) => rank(a) - rank(b) || (a < b ? -1 : a > b ? 1 : 0));
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

/** The two founder-approved exceptions (ADR-007, D049), matched on whole class names: `.ks-doodle-card` is not one. */
function allowedFor(selector: string): Set<string> {
  const allowed = new Set(["transform", "opacity"]);
  if (/\.ks-doodle(?![\w-])/.test(selector)) allowed.add("stroke-dashoffset");
  if (/\.kh-faq__item(?![\w-])[^,]*::details-content/.test(selector)) {
    allowed.add("grid-template-rows");
    allowed.add("content-visibility");
  }
  return allowed;
}

type Kind = "transition" | "animation";
const kindOf = (prop: string): Kind => (prop.startsWith("transition") ? "transition" : "animation");

/** Analyses `sheets`, which must be in cascade order (shippedSheets sorts them so). */
function analyseMotion(sheets: Sheet[]): string[] {
  const findings: string[] = [];
  const roots = sheets.map((s) => ({ ...s, root: postcss.parse(s.css, { from: s.file }) }));

  // Custom properties defined anywhere in scope, so a `var(--ks-…)` timing can be checked against its definitions.
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
          let named = false;
          for (const tok of toks) {
            const kind = timing(tok);
            if (kind === "duration") times.push(tok);
            else if (kind === "ease") eased = true;
            else if (tok === "infinite") report("loops (infinite)");
            else if (/^\d+(\.\d+)?$/.test(tok)) continue;
            else if (d.prop === "transition" && !TRANSITION_KEYWORDS.has(tok)) {
              named = true;
              if (tok !== "none") animated.push(tok);
            } else if (d.prop === "animation" && !ANIMATION_KEYWORDS.has(tok)) {
              if (!keyframes.has(tok)) report(`uses keyframes "${tok}" that no shipped CSS defines`);
              else animated.push(...keyframes.get(tok)!);
            }
          }
          if (times.some((t) => !ZERO_TIME.test(t))) {
            moves = true;
            if (!eased) report(`"${item}" has no explicit DS --ease-* token`);
            // A transition item with a duration and no property animates `all`, transition-property's initial value.
            if (d.prop === "transition" && !named) animated.push("all");
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

  // Every style rule outside @keyframes, in cascade order, with its timing declarations.
  const rules: Array<{ file: string; rule: Rule; reduced: boolean; decls: Declaration[] }> = [];
  for (const { file, root } of roots) {
    root.walkRules((rule) => {
      if (inKeyframes(rule)) return;
      const decls = rule.nodes.filter((n): n is Declaration => n.type === "decl" && TIMING_PROPS.test(n.prop));
      if (decls.length > 0) rules.push({ file, rule, reduced: inReducedMotion(rule), decls });
    });
  }
  const namesAnimation = (d: Declaration) =>
    (d.prop === "animation-name" || d.prop === "animation") &&
    splitTop(d.value, ",").some((item) => splitTop(item, " ").some((tok) => keyframes.has(tok)));
  const someRuleNamesAnAnimation = rules.some((r) => r.decls.some(namesAnimation));

  // Per selector, the cascade position of the last rule that moves it and of the last reduced-motion rule that
  // switches it off. A neutralising rule only counts when it comes later: the later rule wins.
  const moving = new Map<string, Partial<Record<Kind, { order: number; where: string }>>>();
  const neutral = new Map<string, Partial<Record<Kind, number>>>();

  rules.forEach(({ file, rule, reduced, decls }, order) => {
    const has = (prop: string) => decls.some((d) => d.prop === prop);
    const nonZero = (prop: string) => decls.some((d) => d.prop === prop && splitTop(d.value, ",").some((t) => !ZERO_TIME.test(t)));
    const allNone = (props: string[]) => decls.filter((d) => props.includes(d.prop)).every((d) => d.value === "none");

    for (const selector of rule.selectors.map((s) => s.replace(/\s+/g, " ").trim())) {
      const where = `${file}: ${selector}${reduced ? " (reduced motion)" : ""}`;
      const seen: Record<Kind, { animated: string[]; moves: boolean }> = {
        transition: { animated: [], moves: false },
        animation: { animated: [], moves: false },
      };
      for (const d of decls) {
        const { animated, moves } = readDecl(d, where);
        seen[kindOf(d.prop)].animated.push(...animated);
        seen[kindOf(d.prop)].moves ||= moves;
      }

      // Longhand timings that name nothing. transition-property starts as `all`, so a transition-duration or
      // -delay on its own animates every property; an animation-duration on its own runs whatever animation
      // another rule names. Both also leave the default easing (`ease`, not a DS token) unless the rule sets one.
      if (!has("transition") && (nonZero("transition-duration") || nonZero("transition-delay")) && !(has("transition-property") && allNone(["transition-property"]))) {
        if (!has("transition-property")) seen.transition.animated.push("all");
        seen.transition.moves = true;
        if (!has("transition-timing-function")) findings.push(`${where}: ${nonZero("transition-duration") ? "transition-duration" : "transition-delay"}: no explicit DS --ease-* token (the rule sets no transition-timing-function, so it runs on the default ease)`);
      }
      if (!has("animation") && nonZero("animation-duration") && (has("animation-name") ? !allNone(["animation-name"]) : someRuleNamesAnAnimation)) {
        if (!has("animation-name")) seen.animation.animated.push("all");
        seen.animation.moves = true;
        if (!has("animation-timing-function")) findings.push(`${where}: animation-duration: no explicit DS --ease-* token (the rule sets no animation-timing-function, so it runs on the default ease)`);
      }

      const allowed = reduced ? new Set(["opacity"]) : allowedFor(selector);
      for (const p of new Set([...seen.transition.animated, ...seen.animation.animated])) {
        if (allowed.has(p)) continue;
        const why = reduced
          ? " under reduced motion (only an opacity fade may remain)"
          : p === "all"
            ? " (every property: a timing with no transition-property or animation-name reaches them all; name transform or opacity)"
            : " (only transform and opacity; the two D049 exceptions are scoped to .ks-doodle and .kh-faq__item::details-content)";
        findings.push(`${where}: animates "${p}"${why}`);
      }

      for (const kind of ["transition", "animation"] as const) {
        if (!reduced && seen[kind].moves) moving.set(selector, { ...moving.get(selector), [kind]: { order, where } });
      }
      if (reduced) {
        const n = neutral.get(selector) ?? {};
        if (has("transition") || has("transition-property")) {
          n.transition = seen.transition.animated.every((p) => p === "opacity") ? order : undefined;
        }
        if (has("animation") || has("animation-name")) n.animation = allNone(["animation", "animation-name"]) ? order : undefined;
        neutral.set(selector, n);
      }
    }
  });

  for (const [selector, m] of moving) {
    for (const kind of ["transition", "animation"] as const) {
      const last = m[kind];
      if (!last) continue;
      const off = neutral.get(selector)?.[kind];
      if (off !== undefined && off > last.order) continue;
      const earlier = off !== undefined ? " (a reduced-motion rule for it comes earlier in the cascade, so this later rule wins)" : "";
      findings.push(`${last.where}: ${kind} not neutralised under prefers-reduced-motion: reduce${earlier}`);
    }
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

  it("treats a transition that names no property as animating every property (transition-property starts as all)", () => {
    // Plant (a): the shorthand with a duration and no property.
    expect(ok(`.ks-film { transition: var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-film")}`).join("\n")).toMatch(/\.ks-film: animates "all"/);
    // Plant (b): a duration on its own: every property moves, with the default `ease`, and nothing switches it off.
    const found = ok(`.ks-film { transition-duration: var(--duration-base); }`).join("\n");
    expect(found).toMatch(/\.ks-film: animates "all"/);
    expect(found).toMatch(/\.ks-film: transition-duration: no explicit DS --ease-\* token/);
    expect(found).toMatch(/\.ks-film: transition not neutralised/);
    expect(ok(`.ks-film { transition-delay: var(--duration-base); transition-timing-function: var(--ease-standard); } ${REDUCED(".ks-film")}`).join("\n")).toMatch(/animates "all"/);
  });

  it("accepts tokenised longhands that name their property, and timings that move nothing", () => {
    expect(ok(`.ks-x { transition-property: transform; transition-duration: var(--duration-base); transition-timing-function: var(--ease-standard); } ${REDUCED(".ks-x")}`)).toEqual([]);
    expect(ok(`.ks-x { transition-property: none; transition-duration: var(--duration-base); }`)).toEqual([]);
    expect(ok(`.ks-x { transition-duration: 0s; }`)).toEqual([]);
    expect(ok(`.ks-x { animation-duration: var(--duration-base); }`)).toEqual([]); // no rule names an animation
  });

  it("treats an animation-duration set apart from any animation-name as animating every property", () => {
    const named = `@keyframes ks-in { from { opacity: 0; } } .ks-a { animation-name: ks-in; } ${REDUCED(".ks-a", "animation: none;")}`;
    expect(ok(named)).toEqual([]);
    const found = ok(`${named} .ks-b { animation-duration: var(--duration-base); }`).join("\n");
    expect(found).toMatch(/\.ks-b: animates "all"/);
    expect(found).toMatch(/\.ks-b: animation not neutralised/);
  });

  it("counts a reduced-motion rule only when it comes after the last rule that moves the selector (cascade order)", () => {
    const move = ".ks-film { transition: transform var(--duration-base) var(--ease-standard); }";
    expect(ok(`${REDUCED(".ks-film")} ${move}`).join("\n")).toMatch(/\.ks-film: transition not neutralised/);
    const motion = { file: "src/motion/motion.css", css: REDUCED(".ks-wa") };
    const bubble = { file: "src/components/chrome/WhatsAppFloat/whatsapp-float.css", css: ".ks-wa { transition: transform var(--duration-base) var(--ease-standard); }" };
    expect(analyseMotion([motion, bubble]).join("\n")).toMatch(/whatsapp-float\.css: \.ks-wa: transition not neutralised/);
    expect(analyseMotion([bubble, motion])).toEqual([]);
  });

  it("matches the two exceptions on whole class names, not prefixes", () => {
    const draw = `@keyframes ks-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }`;
    expect(ok(`${draw} .ks-doodle-card path { animation: ks-draw var(--duration-draw) var(--ease-standard) both; } ${REDUCED(".ks-doodle-card path", "animation: none;")}`).join("\n")).toMatch(/animates "stroke-dashoffset"/);
    const rows = "transition: grid-template-rows var(--duration-enter) var(--ease-standard);";
    expect(ok(`.kh-faq__item-x::details-content { ${rows} } ${REDUCED(".kh-faq__item-x::details-content")}`).join("\n")).toMatch(/animates "grid-template-rows"/);
  });
});

describe("the cascade order the analyser reads the sheets in", () => {
  it("follows site.css: its relative imports in order, with the compose manifest where compose.css is imported", () => {
    const site = [
      '@layer theme, utilities;',
      '@import "./generated/ds-tokens.css";',
      '@import "../../design-system/project/components/bundle.css";',
      '@import "../motion/motion.css";',
      '@import "./generated/compose.css";',
      '@import "tailwindcss/theme.css" layer(theme);',
      '@import "./tailwind-theme.css";',
    ].join("\n");
    const compose = ["components/ui/Button/button.css", "components/chrome/WhatsAppFloat/whatsapp-float.css", "layouts/page.css"];
    const files = [
      "src/layouts/page.css",
      "src/styles/zz-stray.css",
      "src/styles/tailwind-theme.css",
      "src/components/ui/Button/button.css",
      "src/motion/motion.css",
      "src/components/chrome/WhatsAppFloat/whatsapp-float.css",
      "src/styles/aa-stray.css",
      "src/styles/generated/ds-tokens.css",
    ];
    expect(cascadeSort(files, site, compose)).toEqual([
      "src/styles/generated/ds-tokens.css",
      "src/motion/motion.css",
      "src/components/ui/Button/button.css",
      "src/components/chrome/WhatsAppFloat/whatsapp-float.css",
      "src/layouts/page.css",
      "src/styles/tailwind-theme.css",
      "src/styles/aa-stray.css",
      "src/styles/zz-stray.css",
    ]);
  });

  it("puts the shipped sheets in that order (the DS derivatives before motion.css, Tailwind's theme after it)", () => {
    const files = shippedSheets().map((s) => s.file);
    const at = (f: string) => files.indexOf(f);
    for (const f of ["src/styles/generated/ds-tokens.css", "src/styles/generated/type-steps.css", "src/styles/tailwind-theme.css"]) expect(at(f), f).toBeGreaterThanOrEqual(0);
    expect(at("src/styles/generated/ds-tokens.css")).toBeLessThan(at("src/styles/generated/type-steps.css"));
    expect(at("src/styles/generated/type-steps.css")).toBeLessThan(at("src/motion/motion.css"));
    expect(at("src/motion/motion.css")).toBeLessThan(at("src/styles/tailwind-theme.css"));
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
  // data-scroll-behavior is Next 16's own opt-in on <html>, set by the root layout (see the scroll-behavior test).
  const CONTRACT_ATTRIBUTES = new Set(["data-reveal", "data-draw", "data-draw-order", "data-buybar", "open", "pathLength", "data-scroll-behavior"]);

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

  /** The selectors of every rule that declares `prop` (optionally with `value`), and whether each sits under reduced motion. */
  const rulesSetting = (prop: string, value?: string) => {
    const out: Array<{ selector: string; reduced: boolean; value: string }> = [];
    root.walkDecls(prop, (d) => {
      if (value !== undefined && d.value !== value) return;
      const rule = d.parent as Rule;
      for (const selector of rule.selectors) out.push({ selector: selector.replace(/\s+/g, " ").trim(), reduced: inReducedMotion(rule), value: d.value });
    });
    return out;
  };

  it("leaves a doodle undashed without JavaScript: the stroke dash is set only under html.js-motion", () => {
    // Without JavaScript the doodle must look drawn whatever the generated SVG holds, so nothing may dash it then.
    const dashed = rulesSetting("stroke-dasharray");
    expect(dashed.length).toBeGreaterThan(0);
    expect(dashed.filter((r) => !r.selector.startsWith("html.js-motion ")).map((r) => r.selector)).toEqual([]);
  });

  it("staggers a doodle group --duration-base x 2 apart: order n waits --duration-base x 2(n - 1), its fills a draw longer (§11.2 row 3)", () => {
    const delayOf = (selector: string) => rulesSetting("animation-delay").find((r) => r.selector === selector)?.value;
    for (const n of [2, 3, 4, 5]) {
      const doodle = `html.js-motion .ks-doodle[data-draw][data-draw-order="${n}"].is-in`;
      expect(delayOf(`${doodle} path:not(.ks-doodle__fill)`), `order ${n} stroke`).toBe(`calc(var(--duration-base) * ${2 * (n - 1)})`);
      expect(delayOf(`${doodle} .ks-doodle__fill`), `order ${n} fill`).toBe(`calc(var(--duration-base) * ${2 * (n - 1)} + var(--duration-draw))`);
    }
    const shorthand = (selector: string) => rulesSetting("animation").find((r) => r.selector === selector && !r.reduced)?.value;
    expect(shorthand("html.js-motion .ks-doodle[data-draw].is-in path:not(.ks-doodle__fill)")).toBe("ks-draw var(--duration-draw) var(--ease-standard) both");
    expect(shorthand("html.js-motion .ks-doodle[data-draw].is-in .ks-doodle__fill")).toBe("ks-fade-in var(--duration-fast) var(--ease-standard) var(--duration-draw) both");
  });

  it("puts no number in a custom property except the two D049 literals (task 1.1's no-off-token rule)", () => {
    const numbered: string[] = [];
    root.walkDecls(/^--/, (d) => {
      if (d.prop === "--ks-nudge" || d.prop === "--ks-film-focus") return;
      const rest = d.value.replace(/var\([^()]*\)/g, "");
      if ((rest.match(/-?\d*\.?\d+/g) ?? []).some((n) => Number(n) !== 0)) numbered.push(`${d.prop}: ${d.value}`);
    });
    expect(numbered).toEqual([]);
  });

  it("glides in-page only where the root layout sets data-scroll-behavior=\"smooth\", which Next 16 needs to jump on a route change", () => {
    // node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md, "Scroll Behavior Override": Next resets
    // scroll-behavior to auto during a navigation only when <html data-scroll-behavior="smooth"> is set.
    const KEY = 'html[data-scroll-behavior="smooth"]';
    expect(rulesSetting("scroll-behavior", "smooth")).toEqual([{ selector: KEY, reduced: false, value: "smooth" }]);
    expect(rulesSetting("scroll-behavior").filter((r) => r.value !== "smooth")).toEqual([{ selector: KEY, reduced: true, value: "auto" }]);
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
