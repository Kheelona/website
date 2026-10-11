import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, posix, relative, sep } from "node:path";
import tailwindcss from "@tailwindcss/postcss";
import postcss, { type AtRule, type Container, type Node, type Root, type Rule } from "postcss";
import { beforeAll, describe, expect, it } from "vitest";
import postcssConfig from "../../postcss.config.mjs";
import { buildComposeCss, collectComposeFiles } from "../../scripts/assets/build-compose-css.mjs";

/**
 * Motion stays gentle, tokenised and switchable (brief §9.11, ADR-007 with its D049 addendum, architecture §11).
 *
 * In every CSS file under src/ (the legacy globals.css aside), and in the Tailwind utilities site.css compiles:
 * - only `transform` and `opacity` animate, with the two founder-approved exceptions: `stroke-dashoffset` inside
 *   `.ks-doodle` rules (D049 pick 3B) and `grid-template-rows` with a discrete `content-visibility` transition
 *   inside `.kh-faq__item::details-content` rules (pick 7B);
 * - every duration and easing is a DS token (the `--duration-*` and `--ease-*` of tokens.css, never a look-alike
 *   defined elsewhere) or an expression of them, and nothing runs past five seconds;
 * - nothing loops (`infinite`) or repeats;
 * - every transition, animation and smooth scroll is neutralised under `prefers-reduced-motion: reduce` (none, or
 *   an opacity fade: the DS keeps fades and drops movement, README.md:161) by a rule for the same selector that
 *   wins the cascade (later in site.css's import order and the compose manifest, unlayered over layered,
 *   !important over normal) over the last rule that moves it; rules under `prefers-reduced-motion: no-preference`
 *   never apply then and need none;
 * - a timing that names nothing counts as animating `all`: a transition with no property (transition-property
 *   starts as `all`), or an animation-duration in a rule with no animation-name while another rule names one;
 * - property names are read as the browser reads them: case-folded, escapes decoded, vendor prefix dropped, and
 *   inside CSS nesting;
 * - no scroll-driven animation and no view transitions (ADR-007 rejects both).
 * A sheet may @import only sheets read here, the DS bundle.css and Tailwind's theme and utilities. Tailwind's
 * motion utilities never reach the new site (postcss.config.mjs drops them; new-design source asks for none), and
 * new-design source has no JavaScript motion. motion.css also stays on the class contract of architecture §11.3
 * and its only literals are the two D049 values.
 *
 * Not design-system/ (the DS's own spinner and progress bar are the DS's), and not the legacy
 * src/styles/globals.css, which 6.3 deletes with the old pages.
 */

const ROOT = process.cwd();
const SITE_CSS = "src/styles/site.css";
const COMPOSE_CSS = "src/styles/generated/compose.css";
/** The one file allowed to define the DS motion tokens: the generated copy of tokens.css. */
const DS_TOKENS_CSS = "src/styles/generated/ds-tokens.css";
const LEGACY = new Set(["src/styles/globals.css"]);
/** Folders that hold only new-design source (the legacy atoms, molecules, organisms and old pages are elsewhere). */
const NEW_DESIGN_SOURCES = ["src/components/ui", "src/components/sections", "src/components/chrome", "src/components/tracking", "src/layouts", "src/motion", "src/features/preorder/components", "src/app/store"];
/** What a scanned sheet may @import besides another scanned sheet: the DS as delivered and Tailwind's two layers. */
const IMPORTABLE = new Set(["design-system/project/components/bundle.css", "tailwindcss/theme.css", "tailwindcss/utilities.css"]);
/** Architecture §11.2: nothing moves for more than five seconds. */
const FIVE_SECONDS = 5000;

/** The DS motion tokens, name to value (design-system/project/tokens.css, read-only). */
const DS_MOTION: ReadonlyMap<string, string> = new Map(
  [...readFileSync(join(ROOT, "design-system/project/tokens.css"), "utf8").matchAll(/(--(?:duration|ease)-[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]),
);

type Sheet = { file: string; css: string };

const read = (path: string) => readFileSync(join(ROOT, path), "utf8");

/** Files under `dir` (relative to the repo), as repo-relative posix paths. */
function filesUnder(dir: string): string[] {
  const walk = (abs: string): string[] => {
    let entries: string[];
    try { entries = readdirSync(abs); } catch { return []; }
    return entries.flatMap((name) => {
      const p = join(abs, name);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });
  };
  return walk(join(ROOT, dir)).map((p) => relative(ROOT, p).split(sep).join("/"));
}

/** The CSS this guard reads: every .css file under src/, except the legacy globals.css. */
function inScope(path: string): boolean {
  return path.startsWith("src/") && path.endsWith(".css") && !LEGACY.has(path);
}

function shippedSheets(): Sheet[] {
  const files = filesUnder("src").filter(inScope);
  return cascadeSort(files, read(SITE_CSS), collectComposeFiles(join(ROOT, "src"))).map((file) => ({ file, css: read(file) }));
}

/** New-design TypeScript source (tests and stories aside). */
function newDesignSourceFiles(): Array<{ file: string; text: string }> {
  return NEW_DESIGN_SOURCES.flatMap(filesUnder)
    .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.(test|stories)\.tsx?$/.test(f))
    .map((file) => ({ file, text: read(file) }));
}

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
// Reading CSS as the browser does
// ---------------------------------------------------------------------------------------------------------------

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

/** A CSS identifier with its escapes decoded: `\74 ransition` is `transition`. */
function unescapeIdent(s: string): string {
  return s.replace(/\\(?:([0-9a-fA-F]{1,6})[ \t\n\r\f]?|([^\n\r\f0-9a-fA-F]))/g, (_m, hex?: string, ch?: string) => (hex ? String.fromCodePoint(parseInt(hex, 16)) : (ch ?? "")));
}

/** A property name as the browser reads it: escapes decoded, case folded, vendor prefix dropped. Custom properties are case-sensitive and kept. */
function propName(raw: string): string {
  const p = unescapeIdent(raw.trim());
  return p.startsWith("--") ? p : p.toLowerCase().replace(/^-(webkit|moz|ms|o)-/, "");
}

const parseVar = (tok: string) => /^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]+))?\)$/.exec(tok);
const VAR_IN = /var\([^()]*(?:\([^()]*\)[^()]*)*\)/g;

/** + - * / and parentheses over plain numbers; null for anything else. */
function arithmetic(expr: string): number | null {
  const toks = expr.match(/\d*\.?\d+|[()+\-*/]|\S/g) ?? [];
  let i = 0;
  function atom(): number | null {
    const t = toks[i++];
    if (t === "(") {
      const v = sum();
      return toks[i++] === ")" ? v : null;
    }
    if (t === "-") {
      const v = atom();
      return v === null ? null : -v;
    }
    return t !== undefined && /^\d*\.?\d+$/.test(t) ? Number(t) : null;
  }
  function product(): number | null {
    let v = atom();
    while (v !== null && (toks[i] === "*" || toks[i] === "/")) {
      const op = toks[i++];
      const r = atom();
      if (r === null) return null;
      v = op === "*" ? v * r : v / r;
    }
    return v;
  }
  function sum(): number | null {
    let v = product();
    while (v !== null && (toks[i] === "+" || toks[i] === "-")) {
      const op = toks[i++];
      const r = product();
      if (r === null) return null;
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }
  const v = sum();
  return v !== null && i === toks.length && Number.isFinite(v) ? v : null;
}

type Ctx = "any" | "reduce" | "no-preference";

/**
 * What a media query list says about reduced motion. "reduce": it matches only under reduced motion. "no-preference":
 * it never matches under it. "any": anything else, including a `not` or `or` this reader does not trust either way.
 */
function mediaContext(params: string): Ctx {
  const p = params.toLowerCase().replace(/\s+/g, " ").trim();
  if (!p.includes("prefers-reduced-motion")) return "any";
  if (/^\(?\s*not \(\s*prefers-reduced-motion: ?reduce\s*\)\s*\)?$/.test(p)) return "no-preference";
  if (/\b(not|or)\b/.test(p)) return "any";
  const queries = splitTop(p, ",");
  if (queries.every((q) => /\(\s*prefers-reduced-motion: ?no-preference\s*\)/.test(q))) return "no-preference";
  if (queries.every((q) => /\(\s*prefers-reduced-motion(: ?reduce)?\s*\)/.test(q))) return "reduce";
  return "any";
}

function ancestors(node: Node): Container[] {
  const out: Container[] = [];
  for (let p = node.parent as Container | undefined; p && p.type !== "root"; p = p.parent as Container | undefined) out.push(p);
  return out;
}
const atRules = (node: Node) => ancestors(node).filter((p): p is AtRule => p.type === "atrule");
const inKeyframes = (node: Node) => atRules(node).some((a) => /keyframes$/i.test(a.name));

/** The reduced-motion context of a declaration container: its own @media (CSS nesting) and every enclosing one. */
function contextOf(node: Container): Ctx {
  const ctx = [node, ...ancestors(node)]
    .filter((p): p is AtRule => p.type === "atrule" && (p as AtRule).name.toLowerCase() === "media")
    .map((a) => mediaContext(a.params));
  if (ctx.includes("no-preference")) return "no-preference"; // never applies under reduced motion
  return ctx.includes("reduce") ? "reduce" : "any";
}
const inReducedMotion = (rule: Container) => contextOf(rule) === "reduce";

/** The selectors a declaration container applies to, with CSS nesting resolved (`&`, or a descendant of the parent). */
function selectorsOf(node: Container): string[] {
  const chain = [node, ...ancestors(node)].filter((p): p is Rule => p.type === "rule").reverse();
  if (chain.length === 0) return [`@${node.type === "atrule" ? (node as AtRule).name : node.type}`];
  let out = [""];
  for (const rule of chain) {
    out = out.flatMap((parent) =>
      rule.selectors.map((s) => {
        const sel = s.replace(/\s+/g, " ").trim();
        if (parent === "") return sel;
        return sel.includes("&") ? sel.replace(/&/g, parent) : `${parent} ${sel}`;
      }),
    );
  }
  return out;
}

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

// ---------------------------------------------------------------------------------------------------------------
// The analyser
// ---------------------------------------------------------------------------------------------------------------

const TIME = /^[+-]?(\d*\.)?\d+(ms|s)$/i;
const ZERO_TIME = /^[+-]?(0*\.)?0+(ms|s)$/i;
const EASING_LITERAL = /^(ease|ease-in|ease-out|ease-in-out|linear|step-start|step-end)$|^(steps|cubic-bezier|linear)\(/i;
const ANIMATION_KEYWORDS = new Set(["none", "both", "forwards", "backwards", "normal", "reverse", "alternate", "alternate-reverse", "running", "paused"]);
const TRANSITION_KEYWORDS = new Set(["allow-discrete", "normal"]);
const CSS_WIDE = new Set(["initial", "unset", "revert", "revert-layer", "inherit"]);
const TIMING_PROPS = /^(transition|animation)(-(duration|delay|timing-function|property|name|iteration-count|behavior))?$/;
const SCROLL_DRIVEN = /^(animation-timeline|animation-range(-start|-end)?|scroll-timeline(-name|-axis)?|view-timeline(-name|-axis|-inset)?|timeline-scope)$/;

type Kind = "transition" | "animation" | "scroll";
const kindOf = (prop: string): "transition" | "animation" => (prop.startsWith("transition") ? "transition" : "animation");
type Decl = { prop: string; value: string; important: boolean };
type Block = { file: string; selectors: string[]; ctx: Ctx; layered: boolean; decls: Decl[] };

/** Every container of declarations (outside @keyframes) in document order, with its resolved selectors and context. */
function blocksOf(file: string, root: Root): Block[] {
  const byContainer = new Map<Container, Decl[]>();
  root.walkDecls((d) => {
    if (inKeyframes(d)) return;
    const parent = d.parent as Container;
    byContainer.set(parent, [...(byContainer.get(parent) ?? []), { prop: propName(d.prop), value: d.value.trim(), important: !!d.important }]);
  });
  return [...byContainer].map(([node, decls]) => ({
    file,
    selectors: selectorsOf(node),
    ctx: contextOf(node),
    layered: [node, ...ancestors(node)].some((p) => p.type === "atrule" && (p as AtRule).name.toLowerCase() === "layer"),
    decls,
  }));
}

/** Analyses `sheets`, which must be in cascade order (shippedSheets sorts them so). */
function analyseMotion(sheets: Sheet[], dsMotion: ReadonlyMap<string, string> = DS_MOTION): string[] {
  const findings: string[] = [];
  const roots = sheets.map((s) => ({ ...s, root: postcss.parse(s.css, { from: s.file }) }));

  // Custom properties defined anywhere in scope, so a `var(--ks-…)` timing can be checked against its definitions.
  // The DS motion token names are the DS's: defining one anywhere but the generated tokens is a second source.
  const defs = new Map<string, string[]>();
  for (const { file, root } of roots) {
    root.walkDecls((d) => {
      if (!d.prop.startsWith("--")) return;
      defs.set(d.prop, [...(defs.get(d.prop) ?? []), d.value.trim()]);
      if (/^--(duration|ease)-/.test(d.prop) && file !== DS_TOKENS_CSS) {
        findings.push(`${file}: defines ${d.prop}: --duration-* and --ease-* are DS token names and come from tokens.css only`);
      }
    });
  }

  const isTokenExpr = (tok: string, family: "duration" | "ease", seen = new Set<string>()): boolean => {
    if (family === "duration" && ZERO_TIME.test(tok)) return true;
    const v = parseVar(tok);
    if (v) {
      const [, name, fallback] = v;
      if (fallback !== undefined && !isTokenExpr(fallback.trim(), family, new Set(seen))) return false;
      if (/^--(duration|ease)-/.test(name)) return name.startsWith(`--${family}-`) && dsMotion.has(name);
      const values = defs.get(name);
      if (!values || seen.has(name)) return false;
      return values.every((value) => isTokenExpr(value, family, new Set([...seen, name])));
    }
    if (family === "duration" && /^calc\(/i.test(tok)) {
      const vars = tok.match(VAR_IN) ?? [];
      if (vars.length === 0 || !vars.every((x) => isTokenExpr(x, family, new Set(seen)))) return false;
      return /^calc\([\s\d.+\-*/()]*\)$/i.test(vars.reduce((s, x) => s.replace(x, "1"), tok));
    }
    return false;
  };

  /** A duration expression in milliseconds, from the DS token values (the longest where a property has several). */
  const msOf = (tok: string, depth = 0): number | null => {
    const t = tok.trim();
    if (depth > 8) return null;
    const lit = /^([+-]?(?:\d*\.)?\d+)(ms|s)$/i.exec(t);
    if (lit) return Number(lit[1]) * (lit[2].toLowerCase() === "s" ? 1000 : 1);
    const v = parseVar(t);
    if (v) {
      const [, name, fallback] = v;
      const values = /^--(duration|ease)-/.test(name) ? [dsMotion.get(name)].filter((x): x is string => !!x) : (defs.get(name) ?? []);
      const ms = values.map((x) => msOf(x, depth + 1)).filter((n): n is number => n !== null);
      if (ms.length > 0) return Math.max(...ms);
      return fallback !== undefined ? msOf(fallback, depth + 1) : null;
    }
    if (/^calc\(/i.test(t)) {
      let expr = t.slice(5, -1);
      for (const x of t.match(VAR_IN) ?? []) {
        const n = msOf(x, depth + 1);
        if (n === null) return null;
        expr = expr.replace(x, String(n));
      }
      return arithmetic(expr.replace(/(\d*\.?\d+)(ms|s)\b/gi, (_m, n: string, u: string) => String(Number(n) * (u.toLowerCase() === "s" ? 1000 : 1))));
    }
    return null;
  };

  let longestDuration = 0;
  let longestDelay = 0;
  const timed = (duration: number, delay: number, iterations: number, report: (msg: string) => void, what: string) => {
    longestDuration = Math.max(longestDuration, duration * Math.max(iterations, 1));
    longestDelay = Math.max(longestDelay, delay);
    if (delay + duration * Math.max(iterations, 1) > FIVE_SECONDS) report(`"${what}" runs ${delay + duration * Math.max(iterations, 1)} ms, past 5 s (nothing moves for more than five seconds)`);
  };

  // Keyframes and the at-rules and selectors that are never allowed.
  const keyframes = new Map<string, Set<string>>();
  for (const { file, root } of roots) {
    root.walkAtRules(/keyframes$/i, (a) => {
      const name = a.params.trim().replace(/^["']|["']$/g, "");
      const props = keyframes.get(name) ?? new Set<string>();
      a.walkDecls((d) => {
        const p = propName(d.prop);
        if (p === "animation-timing-function") {
          for (const t of splitTop(d.value, ",")) if (!isTokenExpr(t, "ease")) findings.push(`${file}: @keyframes ${name}: animation-timing-function "${t}" is not a DS --ease-* token`);
          return;
        }
        props.add(p);
      });
      keyframes.set(name, props);
    });
    root.walkAtRules(/^view-transition$/i, () => { findings.push(`${file}: @view-transition: view transitions are not used (ADR-007)`); });
    root.walkRules((r) => { if (/::view-transition/i.test(r.selector)) findings.push(`${file}: ${r.selector}: view transitions are not used (ADR-007)`); });
  }

  /** Animated properties and motion flags of one transition/animation declaration; reports timing violations. */
  const readDecl = (d: Decl, where: string) => {
    const animated: string[] = [];
    let moves = false;
    const report = (msg: string) => findings.push(`${where}: ${d.prop}: ${msg}`);
    const timing = (tok: string): "duration" | "ease" | null => {
      if (TIME.test(tok)) {
        if (!ZERO_TIME.test(tok)) report(`duration "${tok}" is not a DS --duration-* token`);
        return "duration";
      }
      if (EASING_LITERAL.test(tok)) { report(`easing "${tok}" is not a DS --ease-* token`); return "ease"; }
      if (/^(var|calc)\(/i.test(tok)) {
        if (isTokenExpr(tok, "duration")) return "duration";
        if (isTokenExpr(tok, "ease")) return "ease";
        report(`"${tok}" is not a DS duration or easing token`);
        return "duration";
      }
      return null;
    };
    const wide = (tok: string) => {
      const low = tok.toLowerCase();
      if (low === "inherit") report(`inherits its parent's ${kindOf(d.prop)}: name the properties and DS timings instead`);
      return CSS_WIDE.has(low);
    };
    const items = splitTop(d.value, ",");
    switch (d.prop) {
      case "transition":
      case "animation":
        for (const item of items) {
          const toks = splitTop(item, " ");
          if (toks.length === 1 && (toks[0].toLowerCase() === "none" || wide(toks[0]))) continue;
          const times: string[] = [];
          let eased = false;
          let named = false;
          let iterations = 1;
          for (const tok of toks) {
            const low = tok.toLowerCase();
            const kind = timing(tok);
            if (kind === "duration") times.push(tok);
            else if (kind === "ease") eased = true;
            else if (low === "infinite") report("loops (infinite)");
            else if (/^\d*\.?\d+$/.test(tok)) {
              iterations = Number(tok);
              if (iterations > 1) report(`repeats ${tok} times (nothing loops)`);
            } else if (d.prop === "transition" && !TRANSITION_KEYWORDS.has(low)) {
              named = true;
              if (low !== "none") animated.push(propName(tok));
            } else if (d.prop === "animation" && !ANIMATION_KEYWORDS.has(low)) {
              if (!keyframes.has(tok)) report(`uses keyframes "${tok}" that no shipped CSS defines`);
              else animated.push(...keyframes.get(tok)!);
            }
          }
          if (times.some((t) => !ZERO_TIME.test(t))) {
            moves = true;
            if (!eased) report(`"${item}" has no explicit DS --ease-* token`);
            // A transition item with a duration and no property animates `all`, transition-property's initial value.
            if (d.prop === "transition" && !named) animated.push("all");
            timed(msOf(times[0]) ?? 0, times[1] ? (msOf(times[1]) ?? 0) : 0, iterations, report, item);
          }
        }
        break;
      case "transition-property":
        for (const p of items) if (p.toLowerCase() !== "none" && !wide(p)) { animated.push(propName(p)); moves = true; }
        break;
      case "animation-name":
        for (const n of items) {
          if (n.toLowerCase() === "none" || wide(n)) continue;
          moves = true;
          if (!keyframes.has(n)) report(`uses keyframes "${n}" that no shipped CSS defines`);
          else animated.push(...keyframes.get(n)!);
        }
        break;
      case "transition-duration":
      case "transition-delay":
      case "animation-duration":
      case "animation-delay":
        for (const t of items) {
          if (wide(t)) continue;
          if (!isTokenExpr(t, "duration")) { report(`"${t}" is not a DS --duration-* token`); continue; }
          const ms = msOf(t) ?? 0;
          if (d.prop.endsWith("delay")) timed(0, ms, 1, report, t);
          else timed(ms, 0, 1, report, t);
        }
        break;
      case "transition-timing-function":
      case "animation-timing-function":
        for (const t of items) if (!wide(t) && !isTokenExpr(t, "ease")) report(`"${t}" is not a DS --ease-* token`);
        break;
      case "animation-iteration-count":
        for (const c of items) {
          if (c.toLowerCase() === "infinite") report("loops (infinite)");
          else if (Number(c) > 1) report(`repeats ${c} times (nothing loops)`);
        }
        break;
    }
    return { animated, moves };
  };

  const blocks = roots.flatMap(({ file, root }) => blocksOf(file, root));
  const namesAnimation = (d: Decl) =>
    (d.prop === "animation-name" || d.prop === "animation") &&
    splitTop(d.value, ",").some((item) => splitTop(item, " ").some((tok) => keyframes.has(tok)));
  const someBlockNamesAnAnimation = blocks.some((b) => b.decls.some(namesAnimation));

  // Per selector, the cascade rank of the last rule that moves it and of the strongest reduced-motion rule that
  // switches it off. A neutralising rule only counts when it outranks: later, unlayered over layered, !important.
  const moving = new Map<string, Partial<Record<Kind, { rank: number; where: string }>>>();
  const neutral = new Map<string, Partial<Record<Kind, number>>>();

  blocks.forEach(({ file, selectors, ctx, layered, decls }, order) => {
    const reduced = ctx === "reduce";
    const rank = (important: boolean) => (important ? 2e9 : 0) + ((important ? layered : !layered) ? 1e9 : 0) + order;
    const where = `${file}: ${selectors.join(", ")}${reduced ? " (reduced motion)" : ""}`;
    for (const d of decls) {
      if (SCROLL_DRIVEN.test(d.prop)) findings.push(`${where}: ${d.prop}: scroll-driven animation is not used (ADR-007: it replays on scrolling back)`);
      if (/^view-transition-/.test(d.prop)) findings.push(`${where}: ${d.prop}: view transitions are not used (ADR-007)`);
    }

    const timings = decls.filter((d) => TIMING_PROPS.test(d.prop));
    const has = (prop: string) => timings.some((d) => d.prop === prop);
    const nonZero = (prop: string) => timings.some((d) => d.prop === prop && splitTop(d.value, ",").some((t) => !ZERO_TIME.test(t)));
    const allNone = (props: string[]) => timings.filter((d) => props.includes(d.prop)).every((d) => d.value.toLowerCase() === "none");
    const seen: Record<"transition" | "animation", { animated: string[]; moves: boolean; important: boolean }> = {
      transition: { animated: [], moves: false, important: false },
      animation: { animated: [], moves: false, important: false },
    };
    for (const d of timings) {
      const { animated, moves } = readDecl(d, where);
      const s = seen[kindOf(d.prop)];
      s.animated.push(...animated);
      s.moves ||= moves;
      s.important ||= d.important;
    }

    // Longhand timings that name nothing. transition-property starts as `all`, so a transition-duration or
    // -delay on its own animates every property; an animation-duration on its own runs whatever animation
    // another rule names. Both also leave the default easing (`ease`, not a DS token) unless the rule sets one.
    if (!has("transition") && (nonZero("transition-duration") || nonZero("transition-delay")) && !(has("transition-property") && allNone(["transition-property"]))) {
      if (!has("transition-property")) seen.transition.animated.push("all");
      seen.transition.moves = true;
      if (!has("transition-timing-function")) findings.push(`${where}: ${nonZero("transition-duration") ? "transition-duration" : "transition-delay"}: no explicit DS --ease-* token (the rule sets no transition-timing-function, so it runs on the default ease)`);
    }
    if (!has("animation") && nonZero("animation-duration") && (has("animation-name") ? !allNone(["animation-name"]) : someBlockNamesAnAnimation)) {
      if (!has("animation-name")) seen.animation.animated.push("all");
      seen.animation.moves = true;
      if (!has("animation-timing-function")) findings.push(`${where}: animation-duration: no explicit DS --ease-* token (the rule sets no animation-timing-function, so it runs on the default ease)`);
    }

    const scroll = decls.filter((d) => d.prop === "scroll-behavior").map((d) => ({ value: d.value.toLowerCase(), important: d.important }));
    if (reduced && scroll.some((s) => s.value === "smooth")) findings.push(`${where}: scroll-behavior: smooth scrolling under reduced motion`);

    for (const selector of selectors) {
      const at = `${file}: ${selector}${reduced ? " (reduced motion)" : ""}`;
      const allowed = reduced ? new Set(["opacity"]) : allowedFor(selector);
      for (const p of new Set([...seen.transition.animated, ...seen.animation.animated])) {
        if (allowed.has(p)) continue;
        const why = reduced
          ? " under reduced motion (only an opacity fade may remain)"
          : p === "all"
            ? " (every property: a timing with no transition-property or animation-name reaches them all; name transform or opacity)"
            : " (only transform and opacity; the two D049 exceptions are scoped to .ks-doodle and .kh-faq__item::details-content)";
        findings.push(`${at}: animates "${p}"${why}`);
      }

      if (ctx === "any") {
        const m = moving.get(selector) ?? {};
        const move = (kind: Kind, important: boolean) => {
          if (rank(important) > (m[kind]?.rank ?? -1)) m[kind] = { rank: rank(important), where: at };
        };
        for (const kind of ["transition", "animation"] as const) if (seen[kind].moves) move(kind, seen[kind].important);
        const smooth = scroll.filter((s) => s.value === "smooth");
        if (smooth.length > 0) move("scroll", smooth.some((s) => s.important));
        moving.set(selector, m);
      }
      if (reduced) {
        const n = neutral.get(selector) ?? {};
        const keep = (kind: Kind, important: boolean) => { n[kind] = Math.max(rank(important), n[kind] ?? -1); };
        const transitionOff = has("transition") || has("transition-property")
          ? seen.transition.animated.every((p) => p === "opacity")
          : has("transition-duration") && !nonZero("transition-duration");
        if (transitionOff && timings.some((d) => d.prop.startsWith("transition"))) keep("transition", seen.transition.important);
        if ((has("animation") || has("animation-name")) && seen.animation.animated.every((p) => p === "opacity")) keep("animation", seen.animation.important);
        const auto = scroll.filter((s) => s.value === "auto");
        if (auto.length > 0) keep("scroll", auto.some((s) => s.important));
        neutral.set(selector, n);
      }
    }
  });

  for (const [selector, m] of moving) {
    for (const kind of ["transition", "animation", "scroll"] as const) {
      const last = m[kind];
      if (!last) continue;
      const off = neutral.get(selector)?.[kind];
      if (off !== undefined && off > last.rank) continue;
      const loses = off !== undefined ? " (a reduced-motion rule for it loses the cascade: it comes earlier, sits in a layer, or lacks !important)" : "";
      findings.push(`${last.where}: ${kind} not neutralised under prefers-reduced-motion: reduce${loses}`);
    }
  }
  if (longestDelay + longestDuration > FIVE_SECONDS) {
    findings.push(`the longest delay (${longestDelay} ms) and the longest duration (${longestDuration} ms) together run past 5 s (nothing moves for more than five seconds)`);
  }
  return findings;
}

/** @imports of CSS this guard does not read: only scanned sheets, the DS bundle.css and Tailwind's layers may load. */
function importFindings(sheets: Sheet[]): string[] {
  const findings: string[] = [];
  for (const { file, css } of sheets) {
    postcss.parse(css, { from: file }).walkAtRules(/^import$/i, (a) => {
      const spec = /^(?:url\(\s*)?["']?([^"')\s]+)/i.exec(a.params.trim())?.[1] ?? a.params;
      const target = spec.startsWith(".") ? posix.normalize(posix.join(posix.dirname(file), spec)) : spec;
      if (inScope(target) || IMPORTABLE.has(target)) return;
      findings.push(`${file}: @import "${spec}" loads CSS this guard does not read (${target}); import only scanned sheets, the DS bundle.css or Tailwind's theme and utilities`);
    });
  }
  return findings;
}

const JS_MOTION: Array<[RegExp, string]> = [
  [/(?:from\s*|import\s*\(\s*|require\s*\(\s*|import\s+)["'](?:motion|framer-motion|gsap|popmotion|animejs|@react-spring\/[\w.-]+)(?:\/[\w./-]*)?["']/, "imports a JavaScript animation library"],
  [/\.animate\s*\(/, "calls Element.animate(), the Web Animations API"],
  [/<style[\s>]/, "renders a <style> element"],
];

/** JavaScript motion in new-design source: motion comes only from src/motion/motion.css (ADR-007). */
function jsMotionFindings(files: Array<{ file: string; text: string }>): string[] {
  const findings: string[] = [];
  for (const { file, text } of files) {
    text.split("\n").forEach((line, i) => {
      for (const [pattern, why] of JS_MOTION) {
        const m = pattern.exec(line);
        if (m) findings.push(`${file}:${i + 1}: ${why} (${m[0].trim()}); motion comes only from src/motion/motion.css on the class contract (ADR-007)`);
      }
    });
  }
  return findings;
}

/** Declarations that make a Tailwind utility motion (restated independently of postcss.config.mjs). */
const MOTION_DECL = /^(-(webkit|moz|ms|o)-)?(transition|animation)(-|$)|^scroll-behavior$|^view-transition-|^--tw-(duration|ease)$/i;

function motionUtilityRules(root: Root): Rule[] {
  const found = new Set<Rule>();
  root.walkAtRules("layer", (layer) => {
    if (layer.params !== "utilities" || !layer.nodes) return;
    layer.walkDecls(MOTION_DECL, (d) => {
      let rule: Rule | undefined;
      for (let p = d.parent as Container | undefined; p && p !== layer; p = p.parent as Container | undefined) if (p.type === "rule") rule = p as Rule;
      if (rule) found.add(rule);
    });
  });
  return [...found];
}

/**
 * Each compile gets its own `from` key (`site.css?motion-<n>`): @tailwindcss/postcss caches its compiler per `from`
 * path and reuses it while the files it read keep their mtimes, so a second compile of different text under one key
 * would return the first result. postcss.config.mjs still treats the key as site.css.
 */
let probes = 0;
const probeKey = () => `${join(ROOT, SITE_CSS)}?motion-${++probes}`;

/** The motion utilities Tailwind generates for `sources` (@source lines), before any filter: what the source asks for. */
async function tailwindMotionUtilities(sources: string): Promise<string[]> {
  const css = [
    "@layer theme, utilities;",
    '@import "tailwindcss/theme.css" layer(theme);',
    '@import "tailwindcss/utilities.css" layer(utilities) source(none);',
    '@import "./tailwind-theme.css";',
    '@source not "../**/*.{test,stories}.tsx";',
    sources,
  ].join("\n");
  const out = await postcss([tailwindcss()]).process(css, { from: probeKey() });
  return motionUtilityRules(postcss.parse(out.css)).map((r) => r.selector);
}

/** The utilities layer of site.css compiled through postcss.config.mjs (as Next and Storybook compile it), as a sheet. */
async function compiledUtilities(extra = ""): Promise<Sheet> {
  buildComposeCss(); // the predev/prebuild step; compose.css is git-ignored, so a fresh clone has none yet
  const out = await postcss(postcssConfig.plugins).process(`${read(SITE_CSS)}\n${extra}`, { from: probeKey() });
  const layers = postcss.parse(out.css).nodes.filter((n): n is AtRule => n.type === "atrule" && n.name === "layer" && n.params === "utilities" && !!n.nodes);
  return { file: `${SITE_CSS} (compiled: Tailwind utilities)`, css: layers.map((l) => l.toString()).join("\n") };
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

describe("the motion analyser also catches motion written in other spellings and places", () => {
  it("reads vendor-prefixed, upper-case and escaped property names as the property they are", () => {
    expect(ok(`.ks-x { -webkit-transition: width var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/animates "width"/);
    expect(ok(`.ks-x { TRANSITION: width var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/animates "width"/);
    expect(ok(`.ks-x { \\74 ransition: width var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/animates "width"/);
    expect(ok(`.ks-x { transition: -webkit-transform var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x")}`)).toEqual([]);
    expect(ok(`@-webkit-keyframes ks-w { to { width: 0; } } .ks-x { -webkit-animation: ks-w var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x", "animation: none;")}`).join("\n")).toMatch(/animates "width"/);
    expect(ok(`.ks-x { transition: opacity var(--duration-base) var(--ease-standard) INFINITE; } ${REDUCED(".ks-x")}`).join("\n")).not.toMatch(/animates/);
    expect(ok(`@keyframes ks-in { from { opacity: 0; } } .ks-x { animation: ks-in var(--duration-base) var(--ease-standard) INFINITE; } ${REDUCED(".ks-x", "animation: none;")}`).join("\n")).toMatch(/loops/);
  });

  it("reads declarations nested in CSS nesting, inside an at-rule or a nested rule", () => {
    expect(ok(`.ks-x { @media (min-width: 720px) { transition: width var(--duration-base) var(--ease-standard); } }`).join("\n")).toMatch(/\.ks-x: animates "width"/);
    expect(ok(`.ks-x { @supports (display: grid) { transition: transform 3s linear; } }`).join("\n")).toMatch(/duration "3s"/);
    const nested = `.ks-a { .ks-b & { transition: transform var(--duration-base) var(--ease-standard); } }`;
    expect(ok(nested).join("\n")).toMatch(/\.ks-b \.ks-a: transition not neutralised/);
    expect(ok(`${nested} ${REDUCED(".ks-b .ks-a")}`)).toEqual([]);
    expect(ok(`.ks-x { transition: transform var(--duration-base) var(--ease-standard); @media (prefers-reduced-motion: reduce) { transition: none; } }`)).toEqual([]);
  });

  it("counts only a real reduced-motion query as switching motion off, and exempts rules that never apply under it", () => {
    const move = ".ks-x { transition: transform var(--duration-base) var(--ease-standard); }";
    expect(ok(`${move} @media not (prefers-reduced-motion: reduce) { .ks-x { transition: none; } }`).join("\n")).toMatch(/transition not neutralised/);
    expect(ok(`${move} @media screen, (prefers-reduced-motion: reduce) { .ks-x { transition: none; } }`).join("\n")).toMatch(/transition not neutralised/);
    expect(ok(`${move} @media (prefers-reduced-motion) { .ks-x { transition: none; } }`)).toEqual([]);
    expect(ok(`@media (prefers-reduced-motion: no-preference) { ${move} }`)).toEqual([]);
    expect(ok(`@media not (prefers-reduced-motion: reduce) { ${move} }`)).toEqual([]);
    expect(ok(`@media (prefers-reduced-motion: no-preference) { .ks-x { transition: width var(--duration-base) var(--ease-standard); } }`).join("\n")).toMatch(/animates "width"/);
  });

  it("lets a reduced-motion rule win only where the cascade lets it: !important and cascade layers", () => {
    expect(ok(`.ks-x { transition: transform var(--duration-base) var(--ease-standard) !important; } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/transition not neutralised/);
    expect(ok(`.ks-x { transition: transform var(--duration-base) var(--ease-standard) !important; } ${REDUCED(".ks-x", "transition: none !important;")}`)).toEqual([]);
    expect(ok(`.ks-x { transition: transform var(--duration-base) var(--ease-standard); } @layer utilities { ${REDUCED(".ks-x")} }`).join("\n")).toMatch(/transition not neutralised/);
    expect(ok(`@layer utilities { .ks-x { transition: transform var(--duration-base) var(--ease-standard); } } ${REDUCED(".ks-x")}`)).toEqual([]);
  });

  it("rejects an animation that repeats, and anything that runs past five seconds (token expressions included)", () => {
    const kf = "@keyframes ks-in { from { opacity: 0; } }";
    const off = (sel: string) => REDUCED(sel, "animation: none;");
    expect(ok(`${kf} .ks-x { animation: ks-in var(--duration-base) var(--ease-standard) 3; } ${off(".ks-x")}`).join("\n")).toMatch(/repeats/);
    expect(ok(`${kf} .ks-x { animation-name: ks-in; animation-iteration-count: 2; } ${off(".ks-x")}`).join("\n")).toMatch(/repeats/);
    expect(ok(`${kf} .ks-x { animation: ks-in var(--duration-base) var(--ease-standard) 1; } ${off(".ks-x")}`)).toEqual([]);
    expect(ok(`.ks-x { transition: transform calc(var(--duration-draw) * 10) var(--ease-standard); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/5 s/);
    expect(ok(`${kf} .ks-a { animation: ks-in var(--duration-draw) var(--ease-standard) both; } .ks-a.ks-late { animation-delay: calc(var(--duration-draw) * 6); } ${off(".ks-a")}`).join("\n")).toMatch(/5 s/);
    expect(ok(`${kf} .ks-a { animation: ks-in var(--duration-draw) var(--ease-standard) calc(var(--duration-base) * 8) both; } ${off(".ks-a")}`)).toEqual([]);
  });

  it("accepts only the DS's own --duration-* and --ease-* tokens, never a look-alike defined elsewhere", () => {
    expect(ok(`.ks-x { --duration-slow: 9s; transition: transform var(--duration-slow) var(--ease-standard); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/--duration-slow/);
    expect(ok(`.ks-x { --ease-snappy: linear; transition: transform var(--duration-base) var(--ease-snappy); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/--ease-snappy/);
    expect(ok(`.ks-x { transition: transform var(--duration-glacial) var(--ease-standard); } ${REDUCED(".ks-x")}`).join("\n")).toMatch(/--duration-glacial/);
    expect(ok(`:root { --duration-base: 2s; }`).join("\n")).toMatch(/--duration-base/);
  });

  it("treats CSS-wide keywords as what they do: inherit takes the parent's motion, the others switch it off", () => {
    expect(ok(`.ks-x { transition: inherit; }`).join("\n")).toMatch(/inherit/);
    expect(ok(`.ks-x { transition: initial; animation: unset; }`)).toEqual([]);
    expect(ok(`.ks-x { transition: transform var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x", "transition: initial;")}`)).toEqual([]);
  });

  it("reads an easing set inside @keyframes as an easing, not as an animated property", () => {
    expect(ok(`@keyframes ks-in { from { opacity: 0; animation-timing-function: var(--ease-standard); } } .ks-x { animation: ks-in var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x", "animation: none;")}`)).toEqual([]);
    expect(ok(`@keyframes ks-in { from { opacity: 0; animation-timing-function: linear; } } .ks-x { animation: ks-in var(--duration-base) var(--ease-standard); } ${REDUCED(".ks-x", "animation: none;")}`).join("\n")).toMatch(/linear/);
  });

  it("rejects scroll-driven animation and view transitions (ADR-007 rejects both)", () => {
    expect(ok(`@keyframes ks-in { from { opacity: 0; } } .ks-x { animation: ks-in var(--duration-base) var(--ease-standard) both; animation-timeline: view(); } ${REDUCED(".ks-x", "animation: none;")}`).join("\n")).toMatch(/scroll-driven/);
    expect(ok(`.ks-x { view-transition-name: hero; }`).join("\n")).toMatch(/view transition/);
    expect(ok(`@view-transition { navigation: auto; }`).join("\n")).toMatch(/view transition/);
  });

  it("treats smooth scrolling as motion that reduced motion must switch back to auto", () => {
    expect(ok(`.ks-track { scroll-behavior: smooth; }`).join("\n")).toMatch(/\.ks-track: scroll not neutralised/);
    expect(ok(`.ks-track { scroll-behavior: smooth; } ${REDUCED(".ks-track", "scroll-behavior: auto;")}`)).toEqual([]);
    expect(ok(`${REDUCED(".ks-track", "scroll-behavior: smooth;")}`).join("\n")).toMatch(/smooth scrolling under reduced motion/);
  });

  it("reads every CSS file under src/ except the legacy globals.css", () => {
    for (const p of ["src/motion/motion.css", "src/components/ui/Card/card.css", "src/app/store/_components/panel.css", "src/features/preorder/components/form.module.css", "src/lib/stray.css"]) expect(inScope(p), p).toBe(true);
    for (const p of ["src/styles/globals.css", "design-system/project/components/bundle.css", "mockup/mockup.css", "src/components/ui/Card/Card.tsx"]) expect(inScope(p), p).toBe(false);
  });

  it("rejects an @import of CSS it does not read, so motion cannot enter through an unscanned file", () => {
    const sheet = (css: string) => importFindings([{ file: "src/components/ui/Card/card.css", css }]);
    expect(sheet(`@import "../../../../vendor/anim.css";`).join("\n")).toMatch(/vendor\/anim\.css/);
    expect(sheet(`@import "../../../styles/globals.css";`).join("\n")).toMatch(/globals\.css/);
    expect(sheet(`@import "animate.css";`).join("\n")).toMatch(/animate\.css/);
    expect(sheet(`@import url("https://example.com/a.css");`).join("\n")).toMatch(/example\.com/);
    expect(sheet(`@import "./card-extra.css";`)).toEqual([]);
    expect(importFindings([{ file: SITE_CSS, css: readFileSync(join(ROOT, SITE_CSS), "utf8") }])).toEqual([]);
  });

  it("rejects JavaScript motion in new-design source: an animation library, Element.animate(), a <style> element", () => {
    const f = (text: string) => jsMotionFindings([{ file: "src/components/ui/Card/Card.tsx", text }]);
    expect(f(`import { motion } from "motion/react";`).join("\n")).toMatch(/motion\/react/);
    expect(f(`import { animate } from "framer-motion";`).join("\n")).toMatch(/framer-motion/);
    expect(f(`ref.current.animate([{ width: "0" }], 300);`).join("\n")).toMatch(/animate\(/);
    expect(f(`return <style>{".x{transition:width 1s}"}</style>;`).join("\n")).toMatch(/<style/);
    expect(f(`track.scrollBy({ left: w, behavior: reduce ? "auto" : "smooth" });`)).toEqual([]);
  });
});

describe("Tailwind never ships motion on the new site", () => {
  const MOTION_CLASSES = "transition transition-all transition-colors transition-opacity duration-700 delay-500 ease-linear scroll-smooth hover:transition-transform motion-safe:transition";

  it("finds the motion utilities a class string asks Tailwind for (the source check)", async () => {
    const found = await tailwindMotionUtilities(`@source inline("${MOTION_CLASSES} p-5 flex");`);
    for (const cls of [".transition-all", ".duration-700", ".delay-500", ".ease-linear", ".scroll-smooth", ".motion-safe\\:transition"]) expect(found, cls).toContain(cls);
    expect(found).not.toContain(".p-5");
    expect(found).not.toContain(".flex");
  }, 60_000);

  it("drops every motion utility from site.css's compiled output (postcss.config.mjs), whatever a class string asks", async () => {
    const utilities = await compiledUtilities(`@source inline("${MOTION_CLASSES} p-5");`);
    expect(utilities.css).toMatch(/\.p-5 \{/);
    expect(motionUtilityRules(postcss.parse(utilities.css)).map((r) => r.selector)).toEqual([]);
  }, 60_000);

  it("ships no motion utility from the real sources, and new-design source asks for none", async () => {
    expect(analyseMotion([await compiledUtilities()])).toEqual([]);
    const dirs = NEW_DESIGN_SOURCES.filter((d) => existsSync(join(ROOT, d)));
    expect(await tailwindMotionUtilities(dirs.map((d) => `@source "${posix.relative(posix.dirname(SITE_CSS), d)}";`).join("\n"))).toEqual([]);
  }, 60_000);
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

  it("imports only sheets this guard reads, the DS bundle.css and Tailwind's theme and utilities", () => {
    expect(importFindings(sheets)).toEqual([]);
  });
});

describe("new-design source", () => {
  it("has no JavaScript motion: no animation library, no Element.animate(), no <style> element", () => {
    expect(jsMotionFindings(newDesignSourceFiles())).toEqual([]);
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
