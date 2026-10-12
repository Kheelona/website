import ts from "typescript";
import { describe, expect, it } from "vitest";
import { isTestOrStory, listFiles, readRepoFile } from "../e2e/support/repo";
import { jsxAttributes, parseSource, sourceStrings, stripCssComments } from "../e2e/support/source";
import { isStillLegacy } from "./legacy-paths";
import {
  CSS_EXCEPTIONS,
  EXEMPT_FILES,
  INLINE_STYLE_KEYS,
  INLINE_STYLE_TEMPLATE,
  INLINE_STYLE_TYPED_KEYS,
  INLINE_STYLE_VALUE,
  MEDIA_LENGTHS,
  VAR_FALLBACK_KEYWORDS,
  ZERO,
} from "./token-exceptions";

/* no-off-token (task 1.1; architecture §4.4, brief §9.9).
 *
 * Every visual value in src/ comes from the design system: a DS token, a kh- class, or a ks-
 * composition class built on tokens. This guard scans src/**\/*.css, *.tsx and *.ts (tests,
 * stories and .d.ts excluded: never shipped) for literal colours (hex, colour functions and all
 * 148 CSS named colours, custom properties included), lengths, durations, font values (quoted
 * family names included), z-indexes and scales, literals in var() fallbacks (only another var(),
 * a keyword or a zero may follow the comma), lengths in @media and @container preludes
 * other than the DS min-/max-width breakpoints, Tailwind arbitrary values, arbitrary properties,
 * arbitrary breakpoints and the (--var) shorthand, read class by class whatever the variants and
 * the important mark (in .ts modules too, where variants and class lists live, and in CSS @apply),
 * colour strings in .tsx (so a hex cannot reach an attribute through a const), named colours on
 * fill, stroke and the other colour attributes, and inline styles beyond the art-board positions. The only
 * literals allowed are listed in token-exceptions.ts and printed on every run. Generated files are exempt (their drift tests
 * compare them with the DS); legacy files are skipped only while unchanged (legacy-paths.ts).
 */

type Violation = { line: number; rule: string; text: string };
type Result = { violations: Violation[]; applied: string[] };

/** CSS Color 4 named colours, all 148 (gray and grey spellings both), matched as whole tokens. */
const CSS_NAMED_COLOURS: ReadonlySet<string> = new Set(
  `aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown
   burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan
   darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid
   darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet
   deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro
   ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki
   lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow
   lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray
   lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine
   mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen
   mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace
   olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred
   papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue
   saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey
   snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow
   yellowgreen`.split(/\s+/),
);
const COLOUR_FN = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const HEX = /#[0-9a-fA-F]{3,8}\b/;
const LENGTH = /(?<![\w.-])-?(?:\d+\.?\d*|\.\d+)(px|rem|em|pt|pc|cm|mm|in|q)\b/gi;
const TIME = /(?<![\w.-])-?(?:\d+\.?\d*|\.\d+)(ms|s)\b/gi;
const FONT_PROPS = /^(?:font|font-size|font-weight|font-family|line-height|letter-spacing)$/;
const NUMBER = /(?<![\w.#-])-?(?:\d+\.?\d*|\.\d+)(?![\w%.])/g;

function lineAt(text: string, index: number): number {
  return text.slice(0, index).split("\n").length;
}

/** Index of the parenthesis that closes the one at `open`, or -1 (strings are blanked first). */
function closingParen(s: string, open: number): number {
  let depth = 0;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")" && --depth === 0) return i;
  }
  return -1;
}

/** The text after the first comma outside parentheses, or null when there is none. */
function afterFirstComma(s: string): string | null {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") depth--;
    else if (s[i] === "," && depth === 0) return s.slice(i + 1);
  }
  return null;
}

function isSingleVar(s: string): boolean {
  return /^var\(/i.test(s) && closingParen(s, 3) === s.length - 1;
}

/** A fallback that adds no literal of its own: another var(), a keyword, a zero, or nothing. */
function isTokenFallback(fallback: string): boolean {
  return fallback === "" || isSingleVar(fallback) || VAR_FALLBACK_KEYWORDS.test(fallback) || ZERO.test(fallback);
}

/** var(--name) and var(--name, <token fallback>) collapse to "var()". Any other fallback replaces
 *  its var(), innermost first, so the literal rules read it, and is listed in `fallbacks`
 *  ("var(--space-3, 12px)" ships 12px whenever the token is missing). */
function resolveVars(value: string): { text: string; fallbacks: string[] } {
  const fallbacks: string[] = [];
  const call = /(?<![\w-])var\(/gi;
  let text = "";
  let i = 0;
  for (;;) {
    call.lastIndex = i;
    const m = call.exec(value);
    const close = m ? closingParen(value, m.index + 3) : -1;
    if (!m || close < 0) return { text: text + value.slice(i), fallbacks };
    text += value.slice(i, m.index);
    const fallback = afterFirstComma(value.slice(m.index + 4, close))?.trim() ?? "";
    const inner = resolveVars(fallback);
    if (isTokenFallback(fallback) && !inner.fallbacks.length) {
      text += "var()";
    } else {
      text += inner.text;
      if (!isTokenFallback(fallback)) fallbacks.push(fallback);
      fallbacks.push(...inner.fallbacks);
    }
    i = close + 1;
  }
}

/** The value with strings and url(...) blanked and var(...) resolved: what is left are the literals. */
function literalsOf(value: string): { lit: string; fallbacks: string[] } {
  const r = resolveVars(value.replace(/"[^"]*"|'[^']*'/g, '""').replace(/url\([^)]*\)/gi, "url()"));
  return { lit: r.text, fallbacks: r.fallbacks };
}

/** A CSS named colour standing as a whole token ("darkred", never the "red" of "ks-red-dot"). */
function namedColourIn(lit: string): string | undefined {
  return lit
    .toLowerCase()
    .split(/[^a-z-]+/)
    .find((token) => CSS_NAMED_COLOURS.has(token));
}

function nonZero(matches: string[]): string[] {
  return matches.filter((m) => !ZERO.test(m));
}

function declarationViolations(path: string, prop: string, rawValue: string): { rule: string; text: string }[] {
  const value = rawValue.trim();
  const exception = CSS_EXCEPTIONS.find((e) => e.file.test(path) && e.property.test(prop) && e.value.test(value));
  if (exception) return [{ rule: `exception:${exception.id}`, text: `${prop}: ${value}` }];
  const { lit, fallbacks } = literalsOf(value);
  const out: { rule: string; text: string }[] = [];
  const add = (rule: string) => out.push({ rule, text: `${prop}: ${value}` });
  if (fallbacks.length) add(`literal in a var() fallback (${fallbacks.join("; ")})`);
  if (HEX.test(lit) || COLOUR_FN.test(lit) || namedColourIn(lit)) add("colour literal");
  if (nonZero(lit.match(LENGTH) ?? []).length) add("length literal (px, rem, em …)");
  if (nonZero(lit.match(TIME) ?? []).length) add("duration literal");
  if (FONT_PROPS.test(prop) && !/^(?:inherit|initial|unset|normal|var\(\))$/.test(lit.trim())) {
    if ((lit.match(NUMBER) ?? []).length || /[a-z]/i.test(lit.replace(/var\(\)|inherit|normal/g, ""))) add("font literal");
  }
  // A quoted family name is a font literal too (strings are blanked to "" in `lit`; a quoted name
  // in a var() fallback is refused with the fallback).
  if (/^(?:font|font-family)$/.test(prop) && lit.includes('""')) add("font literal");
  if (prop === "z-index" && nonZero(lit.match(NUMBER) ?? []).length) add("z-index literal");
  if (/\bscale[XYZ3d]*\(\s*-?\d/.test(lit) && !/\bscale[XYZ3d]*\(\s*-?1\s*\)/.test(lit)) add("scale literal");
  if (prop.startsWith("--") && nonZero(lit.match(NUMBER) ?? []).length) add("literal in a custom property");
  return out.filter((v, i, a) => a.findIndex((w) => w.rule === v.rule) === i);
}

/** Every length in an @media or @container prelude is off the DS, except a min-width or max-width
 *  in pixels that MEDIA_LENGTHS allows. So range syntax ("width >= 1200px"), heights and em or rem
 *  queries are all refused, whatever the width. */
function mediaViolations(prelude: string): string[] {
  const rest = prelude.replace(/\(\s*(min-width|max-width)\s*:\s*(\d+)px\s*\)/gi, (whole, feature: string, px: string) =>
    MEDIA_LENGTHS[feature.toLowerCase() as keyof typeof MEDIA_LENGTHS].includes(Number(px)) ? "()" : whole,
  );
  const lengths = nonZero(rest.match(LENGTH) ?? []);
  return lengths.length ? [`${prelude} (${lengths.join(", ")})`] : [];
}

function cssViolations(path: string, css: string): Result {
  const text = stripCssComments(css);
  const violations: Violation[] = [];
  const applied: string[] = [];
  let buf = "";
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      const prelude = buf.trim();
      if (/^@(?:media|container)\b/i.test(prelude)) {
        for (const bad of mediaViolations(prelude)) {
          violations.push({ line: lineAt(text, start), rule: "media query off the DS breakpoints", text: bad });
        }
      }
      buf = "";
      start = i + 1;
    } else if (ch === ";" || ch === "}") {
      const decl = buf.trim();
      const line = () => lineAt(text, start + buf.indexOf(decl));
      const m = /^(-{0,2}[a-zA-Z][\w-]*)\s*:([\s\S]*)$/.exec(decl);
      const apply = /^@apply\s+([\s\S]*)$/i.exec(decl);
      if (apply) {
        // The classes an @apply pulls in compile to the same CSS as in markup: same per-token check.
        for (const v of arbitraryClasses(apply[1].replace(/!important\s*$/i, ""))) violations.push({ line: line(), rule: `${v.rule} in @apply`, text: v.text });
      } else if (m && !decl.startsWith("@")) {
        for (const v of declarationViolations(path, m[1], m[2].replace(/!important\s*$/, ""))) {
          if (v.rule.startsWith("exception:")) applied.push(`${path}: ${v.text} (${v.rule.slice(10)})`);
          else violations.push({ line: line(), ...v });
        }
      }
      buf = "";
      start = i + 1;
    } else {
      buf += ch;
    }
  }
  return { violations, applied };
}

/* Tailwind classes are read one token at a time, by their utility: the token is split on ":" at
   bracket and parenthesis depth 0 (so "supports-[display:grid]" stays one variant), the last
   segment is the utility, and one leading or trailing "!" (important) is dropped. Variants may use
   brackets freely ("data-[state=open]:", "[&>svg]:"), except the arbitrary breakpoints, which
   compile to an off-DS media or container query. */
const ARBITRARY_VALUE = /^-?[a-z][\w-]*-\[[^\]]+\](?:\/[\w.[\]]+)?$/;
const ARBITRARY_PROPERTY = /^\[[a-z-]+:[^\]]+\]$/;
const VAR_SHORTHAND = /^-?[a-z][\w-]*-\((?:[a-z-]+:)?--[\w-]+\)(?:\/\S+)?$/;
const ARBITRARY_BREAKPOINT = /^@?(?:min|max)-\[[^\]]+\]$|^@\[[^\]]+\]$/;
const COLOUR_ATTR_SKIP = /^(?:href|id|key|to|htmlFor|aria-[\w-]+|data-[\w-]+)$/;

/** A class token's variants and utility, split on ":" outside brackets and parentheses. */
function classSegments(token: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < token.length; i++) {
    const ch = token[i];
    if (ch === "[" || ch === "(") depth++;
    else if ((ch === "]" || ch === ")") && depth > 0) depth--;
    else if (ch === ":" && depth === 0) {
      out.push(token.slice(from, i));
      from = i + 1;
    }
  }
  out.push(token.slice(from));
  return out;
}

/** Every arbitrary Tailwind class in a whitespace-separated class string, with its rule. */
function arbitraryClasses(classes: string): { rule: string; text: string }[] {
  const out: { rule: string; text: string }[] = [];
  for (const token of classes.split(/\s+/)) {
    if (!token) continue;
    const segments = classSegments(token);
    const utility = segments.pop()!.replace(/^!|!$/, "");
    const rule = ARBITRARY_VALUE.test(utility)
      ? "Tailwind arbitrary value"
      : ARBITRARY_PROPERTY.test(utility)
        ? "Tailwind arbitrary property"
        : VAR_SHORTHAND.test(utility)
          ? "Tailwind (--var) shorthand"
          : segments.some((v) => ARBITRARY_BREAKPOINT.test(v))
            ? "Tailwind arbitrary breakpoint"
            : null;
    if (rule) out.push({ rule, text: token });
  }
  return out;
}

function unwrap(e: ts.Expression): ts.Expression {
  let x = e;
  while (ts.isParenthesizedExpression(x) || ts.isAsExpression(x) || ts.isSatisfiesExpression(x)) x = x.expression;
  return x;
}

function inlineStyleViolations(sf: ts.SourceFile, init: ts.JsxAttributeValue | undefined): string[] {
  if (!init || !ts.isJsxExpression(init) || !init.expression) return ["style without a value"];
  const obj = unwrap(init.expression);
  if (!ts.isObjectLiteralExpression(obj)) {
    return [`style={${init.expression.getText(sf)}}: pass an inline object literal so this guard can check it`];
  }
  const out: string[] = [];
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p)) {
      out.push(`${p.getText(sf)}: spread or shorthand style properties cannot be checked`);
      continue;
    }
    const key = ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : p.name.getText(sf);
    if (!INLINE_STYLE_KEYS.includes(key)) {
      out.push(`${key}: inline style allows only art-board positions, --kh-tilt and --kh-ratio`);
      continue;
    }
    const v = unwrap(p.initializer);
    if (ts.isStringLiteral(v) || ts.isNoSubstitutionTemplateLiteral(v)) {
      if (!INLINE_STYLE_VALUE[key].test(v.text)) out.push(`${key}: "${v.text}" is not an allowed value`);
    } else if (ts.isTemplateExpression(v)) {
      const shape = [v.head.text, ...v.templateSpans.map((s) => s.literal.text)].join("${}");
      if (!INLINE_STYLE_TEMPLATE[key].test(shape)) {
        out.push(`${key}: ${v.getText(sf)} (allowed: ${INLINE_STYLE_TEMPLATE[key].source.replace(/\\/g, "").slice(1, -1)})`);
      }
    } else if (ts.isNumericLiteral(v)) {
      out.push(`${key}: ${v.text} (a bare number is pixels)`);
    } else if (!INLINE_STYLE_TYPED_KEYS.includes(key)) {
      // React renders a number in left, top, width or height as pixels, and a variable transform
      // can carry any scale: positions take `${x}%`, the transform `rotate(${deg}deg)`.
      out.push(`${key}: ${v.getText(sf)} (a variable may be a number, which React renders as pixels; write a template literal)`);
    }
  }
  return out;
}

/** The JSX attribute a string is the value of, if any: directly, inside {…}, or as a branch of a
 *  condition in it (`fill={on ? "navy" : "currentColor"}`, `color={tone ?? "red"}`). */
function owningAttribute(node: ts.Node): string | null {
  let child = node;
  let parent = node.parent;
  while (
    parent &&
    (ts.isParenthesizedExpression(parent) ||
      (ts.isConditionalExpression(parent) && child !== parent.condition) ||
      (ts.isBinaryExpression(parent) &&
        [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(parent.operatorToken.kind)))
  ) {
    child = parent;
    parent = parent.parent;
  }
  if (parent && ts.isJsxAttribute(parent)) return parent.name.getText();
  if (parent && ts.isJsxExpression(parent) && parent.parent && ts.isJsxAttribute(parent.parent)) return parent.parent.name.getText();
  return null;
}

const COLOUR_STRING = new RegExp(`^(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|${COLOUR_FN.source}.*\\))$`, "i");
/** SVG and colour attributes, where a bare colour word paints (currentColor, none, url(#…) and
 *  var(--…) are not named colours, so they pass). */
const COLOUR_ATTRS = /^(?:fill|stroke|color|stopColor|floodColor|lightingColor|stop-color|flood-color|lighting-color)$/;

/** .tsx and .ts modules: Tailwind arbitrary classes in any string, read token by token (a class can
 *  be built in a variants or classes module), and in .tsx also colour literals in any string, so a
 *  hex cannot reach an attribute through a const, named colours on colour attributes, and inline
 *  styles beyond the art-board positions. Hex in .ts stays legal: e-mail HTML and the payment
 *  sheet's theme need real colours, not tokens. */
function tsxViolations(path: string, text: string): Result {
  const sf = parseSource(path, text);
  const isTsx = path.endsWith(".tsx");
  const violations: Violation[] = [];
  for (const s of sourceStrings(sf)) {
    if (s.kind === "jsx-text") continue;
    for (const v of arbitraryClasses(s.text)) violations.push({ line: s.line, ...v });
    if (!isTsx) continue;
    const value = s.text.trim();
    const attr = owningAttribute(s.node);
    if (COLOUR_STRING.test(value)) {
      if (!(attr && COLOUR_ATTR_SKIP.test(attr))) {
        violations.push({ line: s.line, rule: "colour literal", text: attr ? `${attr}="${s.text}"` : `"${s.text}"` });
      }
    } else if (attr && COLOUR_ATTRS.test(attr) && CSS_NAMED_COLOURS.has(value.toLowerCase())) {
      violations.push({ line: s.line, rule: "named colour on a colour attribute", text: `${attr}="${s.text}"` });
    }
  }
  if (isTsx) {
    for (const a of jsxAttributes(sf)) {
      if (a.name !== "style") continue;
      for (const t of inlineStyleViolations(sf, a.initializer)) violations.push({ line: a.line, rule: "inline style", text: t });
    }
  }
  return { violations, applied: [] };
}

const css = (text: string, path = "src/components/ui/Card/card.css") => cssViolations(path, text).violations;
const tsx = (text: string, path = "src/components/ui/Card/Card.tsx") => tsxViolations(path, text).violations;
const script = (text: string, path: string) => tsxViolations(path, text).violations;

describe("no-off-token detector: red on every planted literal", () => {
  it.each([
    ["hex colour", ".ks-a { color: #fff; }"],
    ["rgb colour", ".ks-a { background: rgba(0, 0, 0, 0.4); }"],
    ["named colour", ".ks-a { color: white; }"],
    ["pixel length", ".ks-a { margin-top: 13px; }"],
    ["rem length", ".ks-a { gap: 1.5rem; }"],
    ["em length", ".ks-a { vertical-align: -0.2em; }"],
    ["duration", ".ks-a { transition: opacity 200ms ease; }"],
    ["font weight", ".ks-a { font-weight: 800; }"],
    ["font shorthand", ".ks-a { font: 800 18px/24px var(--font-display); }"],
    ["z-index", ".ks-a { z-index: 60; }"],
    ["scale literal", ".ks-a { transform: scale(1.32); }"],
    ["custom property literal", ".ks-a { --ks-gap: 1.25; }"],
    ["off-DS breakpoint", "@media (min-width: 1200px) { .ks-a { margin: 0; } }"],
    ["exception outside its file", ".ks-a { --ks-nudge: 5px; }"],
    ["quoted font family", '.ks-a { font-family: "Comic Sans MS"; }'],
    ["quoted font fallback after a token", ".ks-a { font-family: var(--font-body), 'Comic Sans MS'; }"],
    ["range-syntax media query", "@media (width >= 1200px) { .ks-a { margin: 0; } }"],
    ["range-syntax media query on a DS width", "@media (720px <= width) { .ks-a { margin: 0; } }"],
    ["media query on height", "@media (min-height: 600px) { .ks-a { margin: 0; } }"],
    ["container query off the DS widths", "@container (min-width: 400px) { .ks-a { margin: 0; } }"],
    ["nested media query", ".ks-a { @media (max-width: 1199px) { margin: 0; } }"],
    // Review of 1.1 (2026-10-12): each of these passed the first version of this guard.
    ["named colour in a custom property", ".b { --ks-bg: white; }"],
    ["compound named colour", ".c { color: firebrick; }"],
    ["compound named colour in a shorthand", ".d { background: darkred; }"],
    ["named colour outside the common thirty", ".e { color: rebeccapurple; }"],
    ["named colour aqua", ".e { border-color: aqua; }"],
    ["named colour fuchsia", ".e { outline: 2px solid fuchsia; }"],
    ["named colour in a custom property, mixed case", ".e { --ks-x: DarkSlateGray; }"],
    ["length in a var() fallback, font property", ".f { letter-spacing: var(--x, 0.02em); }"],
    ["hex in a var() fallback", ".g { color: var(--kh-nope, #f00); }"],
    ["length in a var() fallback", ".g { margin: var(--kh-nope, 13px); }"],
    ["named colour in a var() fallback", ".g { color: var(--kh-nope, white); }"],
    ["literal in a nested var() fallback", ".g { padding: var(--a, var(--b, 12px)); }"],
    ["percentage in a var() fallback", ".g { width: var(--kh-nope, 50%); }"],
    ["duration in a var() fallback", ".g { transition: opacity var(--kh-nope, 200ms); }"],
    ["calc() in a var() fallback", ".g { margin: var(--kh-nope, calc(var(--space-2) + 1px)); }"],
    ["quoted family in a var() fallback", '.g { font-family: var(--kh-nope, "Comic Sans MS"); }'],
  ])("%s", (_name, text) => {
    expect(css(text).length).toBeGreaterThan(0);
  });

  it("knows every CSS named colour (CSS Color 4: 148 names)", () => {
    expect(CSS_NAMED_COLOURS.size).toBe(148);
    for (const name of CSS_NAMED_COLOURS) expect(css(`.ks-a { color: ${name}; }`), name).not.toEqual([]);
  });

  it("WhatsApp green: only the one D050 hex, in its own file", () => {
    const file = "src/components/chrome/WhatsAppFloat/whatsapp-float.css";
    expect(css(".ks-wa { --ks-wa-green: #ff0000; }", file).length).toBeGreaterThan(0);
    expect(css(".ks-wa { --ks-wa-green: #25D366; }").length).toBeGreaterThan(0);
  });

  it.each([
    ["Tailwind arbitrary value", `export const A = () => <div className="p-[13px]" />;`],
    ["arbitrary colour in clsx", `export const A = ({ on }: { on: boolean }) => <div className={clsx("flex", on && "bg-[#fff]")} />;`],
    ["arbitrary property", `export const A = () => <div className="[mask-type:luminance]" />;`],
    ["(--var) shorthand", `export const A = () => <div className="p-(--space-3)" />;`],
    ["class string outside className", `const base = "text-[15px] font-bold"; export const A = () => <p className={base} />;`],
    ["inline style key", `export const A = () => <div style={{ color: "red" }} />;`],
    ["inline style value", `export const A = () => <div style={{ left: "12px" }} />;`],
    ["inline style by reference", `const s = { left: "10%" }; export const A = () => <div style={s} />;`],
    ["hex colour attribute", `export const A = () => <svg><path fill="#EF762F" /></svg>;`],
    ["hex colour through a const", `const RED = "#ff0000"; export const A = () => <svg><path fill={RED} /></svg>;`],
    ["colour function through an object", `const TONES = { warm: "rgb(239 118 47)" }; export const A = () => <i data-tone={TONES.warm} />;`],
    // React renders a bare number in left/top/width/height as pixels, so a variable is refused.
    ["inline position from a variable (a number is pixels)", `const w = 13; export const KhPlant = () => <div style={{ width: w }} />;`],
    ["inline position from a prop", `export const A = ({ left }: { left: number }) => <div style={{ left }} />;`],
    ["inline position from an expression", `export const A = ({ x }: { x: number }) => <div style={{ top: x * 2 }} />;`],
    ["inline position template not in percent", "export const A = ({ x }: { x: number }) => <div style={{ height: `${x}` }} />;"],
    ["inline position template in degrees", "export const A = ({ x }: { x: number }) => <div style={{ right: `${x}deg` }} />;"],
    ["inline transform from a variable", `export const A = ({ t }: { t: string }) => <div style={{ transform: t }} />;`],
    ["inline transform template beyond a rotation", "export const A = ({ s }: { s: number }) => <div style={{ transform: `scale(${s})` }} />;"],
    // Review of 1.1, round 3: each class below compiles to a literal and passed the whole-string
    // patterns, which allowed no brackets in a variant and nothing after the closing bracket.
    ["arbitrary value with the important suffix", `export const A = () => <div className="p-[13px]!" />;`],
    ["arbitrary value with the important prefix", `export const A = () => <div className="!p-[13px]" />;`],
    ["arbitrary value after an arbitrary data variant", `export const A = () => <div className="data-[state=open]:p-[13px]" />;`],
    ["arbitrary colour after an arbitrary selector variant", `export const A = () => <div className="[&>svg]:text-[#ff0000]" />;`],
    ["arbitrary grid after a supports variant", `export const A = () => <div className="grid supports-[display:grid]:grid-cols-[200px_1fr]" />;`],
    ["(--var) shorthand after an aria variant", `export const A = () => <div className="aria-[expanded=true]:p-(--space-3)" />;`],
    ["typed (--var) shorthand", `export const A = () => <div className="text-(length:--kh-nope)" />;`],
    ["arbitrary value with a modifier", `export const A = () => <div className="bg-[#ff0000]/50" />;`],
    ["arbitrary property after a stacked variant", `export const A = () => <div className="md:hover:[mask-type:luminance]!" />;`],
    ["arbitrary breakpoint variant", `export const A = () => <div className="min-[1200px]:grid" />;`],
    ["arbitrary max breakpoint variant", `export const A = () => <div className="max-[600px]:hidden" />;`],
    ["arbitrary container-query variant", `export const A = () => <div className="@min-[400px]:grid @[30rem]:flex" />;`],
    ["arbitrary value in a template literal", "export const A = ({ on }: { on: boolean }) => <div className={`kh-card ${on ? \"is-in\" : \"\"} data-[side=top]:mt-[3px]`} />;"],
    // Named colours on an SVG or colour attribute (hex is refused in any .tsx string already).
    ["named colour on fill", `export const A = () => <svg><path fill="red" /></svg>;`],
    ["named colour on stroke, any case", `export const A = () => <svg><path stroke="White" /></svg>;`],
    ["named colour on stopColor in braces", `export const A = () => <svg><stop stopColor={"rebeccapurple"} /></svg>;`],
    ["named colour on color, in a condition", `export const A = ({ on }: { on: boolean }) => <svg color={on ? "navy" : "currentColor"} />;`],
    ["named colour on floodColor and lightingColor", `export const A = () => <svg><feFlood floodColor="gold" /><feDiffuseLighting lightingColor="snow" /></svg>;`],
  ])("%s", (_name, text) => {
    expect(tsx(text).length).toBeGreaterThan(0);
  });

  it.each([
    ["arbitrary value in a variants module", `export const card = { base: "grid gap-4", tight: "p-[13px]" };`],
    ["arbitrary property in a classes module", `export const MASK = "[mask-type:luminance]";`],
    ["(--var) shorthand in a classes module", `export const pad = (on: boolean) => (on ? "p-(--space-3)" : "");`],
    ["arbitrary value after a variant in a variants module", `export const open = "data-[state=open]:p-[13px]";`],
    ["important arbitrary value in a classes module", `export const tight = ["grid", "gap-[3px]!"].join(" ");`],
  ])("%s (.ts)", (_name, text) => {
    expect(script(text, "src/components/ui/Card/card.variants.ts").length).toBeGreaterThan(0);
  });

  it.each([
    ["@apply of an arbitrary value", ".ks-a { @apply p-[13px]; }"],
    ["@apply of an arbitrary value and colour", ".ks-a { @apply p-[13px] text-[#ff0000]; }"],
    ["@apply of an arbitrary value after a variant", ".ks-a { @apply flex data-[state=open]:p-[13px]; }"],
    ["@apply of an arbitrary property, important", ".ks-a { @apply [mask-type:luminance] !important; }"],
    ["@apply of a (--var) shorthand", ".ks-a { @apply p-(--space-3); }"],
  ])("%s (CSS)", (_name, text) => {
    expect(css(text).length).toBeGreaterThan(0);
  });
});

describe("no-off-token detector: green on DS-token code", () => {
  it("accepts tokens, zero values, layout proportions and the DS breakpoints", () => {
    const ok = `
      /* a comment may say #fff or 13px */
      .ks-films__track { padding-block: var(--space-3); margin-block: calc(var(--space-3) * -1); }
      .ks-a { margin: 0; grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; opacity: 0; }
      .ks-a { transition: transform var(--duration-fast) var(--ease-standard); transform: translateY(100%); }
      .ks-a:focus-visible { outline-offset: 2px; }
      .ks-a { max-width: 60ch; content: "13px #fff"; background: url(/x#fff.png); }
      @media (min-width: 720px) and (max-width: 899px) { .ks-a { grid-column: 1 / -1; } }
      @container (min-width: 900px) { .ks-a { grid-column: span 2; } }
      .ks-a { font-family: var(--font-display); font-weight: var(--weight-bold, inherit); }
      @media (prefers-reduced-motion: reduce) { .ks-a { transition: none; } }
      @keyframes ks-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }`;
    expect(css(ok)).toEqual([]);
  });

  it("accepts a var() fallback only when it is a var(), a keyword or zero", () => {
    const ok = `
      .ks-a { transform: translateY(calc(var(--ks-buybar-h, 0px) * -1)); }
      .ks-a { color: var(--kh-a, var(--kh-b)); background: var(--kh-a, var(--kh-b, transparent)); }
      .ks-a { border-color: var(--kh-a, currentColor); outline-color: var(--kh-a, currentcolor); }
      .ks-a { inset: var(--kh-a, auto); max-height: var(--kh-a, none); line-height: var(--kh-a, normal); }
      .ks-a { color: var(--kh-a, inherit); margin: var(--kh-a, initial) var(--kh-b, unset); }
      .ks-a { padding: var(--kh-a, 0) var(--kh-b,0); gap: var(--kh-a,); }`;
    expect(css(ok)).toEqual([]);
  });

  it("reads a named colour as a whole value token, never inside a longer name", () => {
    const ok = `
      .ks-a { animation-name: ks-gold-shine; transition-property: color, background-color; }
      .ks-a { grid-template-areas: "tan red"; --ks-tone: var(--kh-orange-500); }
      .kh-tone-blue { color: var(--on-primary); }`;
    expect(css(ok)).toEqual([]);
  });

  it("accepts each named exception in its own file only", () => {
    expect(css(".ks-x { --ks-nudge: 5px; --ks-film-focus: 1.05; }", "src/motion/motion.css")).toEqual([]);
    expect(
      css(".ks-wa { --ks-wa-green: #25D366; }", "src/components/chrome/WhatsAppFloat/whatsapp-float.css"),
    ).toEqual([]);
    expect(css("@theme inline { --breakpoint-sm: 720px; --breakpoint-xl: 1024px; }", "src/styles/tailwind-theme.css")).toEqual([]);
  });

  it("accepts DS classes, utilities without arbitrary values, and art-board inline styles", () => {
    const ok = `
      import clsx from "clsx";
      export function A({ left, tilt, on }: { left: number; tilt: number; on: boolean }) {
        return (
          <div className={clsx("kh-art grid gap-4 md:grid-cols-2", on && "is-in")}>
            <img className="kh-art__layer" style={{ left: \`\${left}%\`, width: "30%", transform: \`rotate(\${tilt}deg)\` }} alt="" />
            <span className="kh-sticker" style={{ "--kh-tilt": "8deg" } as React.CSSProperties}>[PLACEHOLDER F4: size]</span>
            <a href="#faq">FAQ</a>
            <a href="#add" id="#bad">Add</a>
          </div>
        );
      }`;
    expect(tsx(ok)).toEqual([]);
  });

  it("accepts art-board positions only as percent templates, rotations only as rotate(…deg)", () => {
    const ok = `
      export function A({ x, y, w, tilt, ratio }: { x: number; y: number; w: number; tilt: number; ratio: string }) {
        return (
          <i
            className="kh-art__layer"
            style={{ left: \`\${x}%\`, top: \`\${y}%\`, width: \`\${w}%\`, height: "40%", transform: \`rotate(\${tilt}deg)\`, "--kh-ratio": ratio } as React.CSSProperties}
          />
        );
      }`;
    expect(tsx(ok)).toEqual([]);
  });

  it("reads each class by its utility: arbitrary variants are fine when the utility is a token", () => {
    const ok = `
      export function A({ on }: { on: boolean }) {
        return (
          <div className={clsx("data-[state=open]:rotate-45 [&>svg]:size-5 group-hover:opacity-100", on && "aria-[expanded=true]:is-in")}>
            <i className="supports-[display:grid]:grid md:hover:opacity-100! !hidden has-[input:checked]:opacity-100" />
            <a href="/store/e/[event]">x</a>
          </div>
        );
      }`;
    expect(tsx(ok)).toEqual([]);
    expect(css(".ks-a { @apply flex group-hover:opacity-100 data-[state=open]:rotate-45; }")).toEqual([]);
    expect(script(`export const open = "data-[state=open]:rotate-45 [&>svg]:size-5"; export const PATH = "/store/e/[event]";`, "src/components/ui/Card/card.variants.ts")).toEqual([]);
  });

  it("allows currentColor, none, url(#…) and tokens on colour attributes, and colour words elsewhere", () => {
    const ok = `
      export const A = () => (
        <svg fill="currentColor" stroke="none" color="var(--kh-ink)" aria-label="A red ball">
          <path fill="url(#kh-grad)" stroke="currentcolor" />
          <stop stopColor="var(--kh-orange-500)" />
          <title>red, white and gold</title>
          <text data-tone="red">red</text>
        </svg>
      );`;
    expect(tsx(ok)).toEqual([]);
  });

  it("accepts .ts modules of plain utilities, anchors and route patterns", () => {
    const ok = `
      export const card = { base: "kh-card grid gap-4 md:grid-cols-2", on: "is-in" };
      export const FAQ = "#faq";
      export const EVENT = "/store/e/[event]";
      export const THEME = { color: "#EF762F" };`;
    expect(script(ok, "src/components/ui/Card/card.variants.ts")).toEqual([]);
  });
});

describe("no-off-token: src/", () => {
  const all = listFiles(["src/**/*.css", "src/**/*.tsx", "src/**/*.ts"]).filter((p) => !isTestOrStory(p) && !p.endsWith(".d.ts"));
  const exempt = all.filter((p) => EXEMPT_FILES.some((re) => re.test(p)));
  const legacy = all.filter((p) => !exempt.includes(p) && isStillLegacy(p));
  const scanned = all.filter((p) => !exempt.includes(p) && !legacy.includes(p));

  it("scans a real file list: CSS, .tsx and the .ts modules a class string can live in", () => {
    for (const ext of [".css", ".tsx", ".ts"]) {
      expect(all.filter((p) => p.endsWith(ext)).length, `no ${ext} file listed`).toBeGreaterThan(0);
    }
    expect(scanned).toContain("src/config/site.ts");
    expect(scanned.some((p) => p.endsWith(".d.ts") || isTestOrStory(p))).toBe(false);
  });

  it("uses DS tokens only (the named exceptions aside)", () => {
    const problems: string[] = [];
    const applied: string[] = [];
    for (const path of scanned) {
      const text = readRepoFile(path);
      const result = path.endsWith(".css") ? cssViolations(path, text) : tsxViolations(path, text);
      applied.push(...result.applied);
      for (const v of result.violations) problems.push(`${path}:${v.line} ${v.rule}: ${v.text}`);
    }
    console.log(
      `[no-off-token] scanned ${scanned.length} file(s); skipped ${legacy.length} unchanged legacy and ` +
        `${exempt.length} generated file(s).` +
        (applied.length ? `\n[no-off-token] accepted exceptions:\n  ${applied.join("\n  ")}` : ""),
    );
    expect(problems, `off-token values (DS tokens only; token-exceptions.ts lists the rest):\n${problems.join("\n")}`).toEqual([]);
  });
});

describe("no-off-token calibration: the approved mockup's own CSS (printed, never failing)", () => {
  /* The detector run over mockup/mockup.css and mockup/css/*.css, as banned-phrases is run over
     the mockup's copy. It cannot fail: the mockup is the visual reference, not src/. It prints what
     a faithful port would need the DS (or a class-based mapping) to answer, so those decisions are
     made by the main session before the section and page tasks of waves 3 and 5 meet them; those
     tasks cannot edit token-exceptions.ts. */
  it("counts the mockup's literals by rule", () => {
    const files = listFiles(["mockup/mockup.css", "mockup/css/*.css"]);
    expect(files.length, "the mockup's CSS moved; re-point this calibration").toBeGreaterThan(1);
    const byRule = new Map<string, Map<string, number>>();
    for (const path of files) {
      for (const v of cssViolations(path, readRepoFile(path)).violations) {
        const values = byRule.get(v.rule) ?? new Map<string, number>();
        const key = v.rule.startsWith("media") ? `${path.replace(/^mockup\//, "")}:${v.line} ${v.text}` : v.text;
        values.set(key, (values.get(key) ?? 0) + 1);
        byRule.set(v.rule, values);
      }
    }
    const total = [...byRule.values()].reduce((n, m) => n + [...m.values()].reduce((a, b) => a + b, 0), 0);
    const lines = [...byRule.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([rule, values]) => {
        const count = [...values.values()].reduce((a, b) => a + b, 0);
        const top = [...values.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, rule.startsWith("media") ? 20 : 8)
          .map(([text, n]) => `      ${n > 1 ? `${n} x ` : ""}${text}`);
        return [`  ${rule}: ${count}`, ...top].join("\n");
      });
    console.log(`[no-off-token calibration] mockup CSS: ${files.length} file(s), ${total} declaration(s) off the DS tokens\n${lines.join("\n")}`);
  });
});
