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
  MEDIA_EXCEPTIONS,
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
 * other than the DS min-/max-width breakpoints, Tailwind arbitrary values, arbitrary properties
 * (any name Tailwind compiles, digits and capitals included), arbitrary modifiers on the colour and
 * text utilities ("text-sm/[17px]", "bg-black/[0.37]"), numeric opacity steps on a colour
 * ("bg-surface/37", "text-text/50", "bg-scrim/7.5": the DS has no opacity tokens, task 2.13; a line
 * height such as "text-sm/6" and a fraction such as "w-1/2" pass), arbitrary breakpoints and the
 * (--var) shorthand, read class by class whatever
 * the variants and the important mark (in .ts modules too, where variants and class lists live, and
 * in CSS @apply), colour strings in .tsx (so a hex cannot reach an attribute through a const), named
 * colours on fill, stroke and the other colour attributes, written there or reaching them through a
 * local const, an object property, a destructured default or a spread (task 1.1b), and inline styles
 * beyond the art-board positions. The only literals allowed are listed in token-exceptions.ts and
 * printed on every run. Generated files are exempt (their drift tests compare them with the DS);
 * legacy files are skipped only while unchanged (legacy-paths.ts).
 *
 * Known limits of the named-colour flow (probed in 1.1b's review; each passes today, so a later wave
 * must not rely on this guard for them): names are resolved inside the file only, so a colour
 * exported from a .ts module (where named colours are legal) and imported is not followed; nor is a
 * local component's prop from its call site (`const Dot = ({ c }) => <path fill={c} />; <Dot c="red" />`),
 * a template literal (fill={`${C}`}), a function's return value, a destructuring of an object literal
 * (`const { fill } = { fill: "red" }`), a computed key in a spread (`{ ["fill"]: "red" }`) or an
 * array element. A key that is not a literal (`FILLS[tone]`) is followed to every value of the object.
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
        const normal = prelude.replace(/\s+/g, " ");
        const media = MEDIA_EXCEPTIONS.find((e) => e.file.test(path) && e.prelude.test(normal));
        if (media) applied.push(`${path}: ${normal} (${media.id})`);
        else
          for (const bad of mediaViolations(prelude)) {
            violations.push({ line: lineAt(text, start + buf.indexOf(prelude)), rule: "media query off the DS breakpoints", text: bad });
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
   segment is the utility, and one leading or trailing "!" (important) is dropped. The utility is
   then split at its last "/" at depth 0 into a base and a modifier ("text-sm/[17px]", "w-1/2").
   Variants may use brackets freely ("data-[state=open]:", "[&>svg]:"), except the arbitrary
   breakpoints, which compile to an off-DS media or container query. */
const ARBITRARY_VALUE = /^-?[a-z][\w-]*-\[[^\]]+\]$/;
/** Tailwind 4 compiles "[name:value]" when the name starts with a dash or a lower-case letter,
 *  whatever follows: "[--ks-x2:3px]", "[--ks-X:3px]" and "[--ks_x:3px]" all ship (probed on the
 *  pinned 4.3.2, task 1.1b); "[PLACEHOLDER:F4]" does not. */
const ARBITRARY_PROPERTY = /^\[(?:-|[a-z])[^\s:\]]*:[^\]]+\]$/;
const VAR_SHORTHAND = /^-?[a-z][\w-]*-\((?:[a-z-]+:)?--[\w-]+\)$/;
/** A bracketed or (--var) modifier: "text-sm/[17px]" is line-height: 17px, "bg-black/[0.37]" a
 *  37 percent colour-mix, "bg-black/(--x)" an opacity from any custom property. */
const ARBITRARY_MODIFIER = /^(?:\[[^\]]+\]|\([^)]+\))$/;
/** The utilities whose modifier reaches the CSS: the colour utilities (an opacity) and text-* (a line
 *  height). Probed on the pinned Tailwind 4.3.2, default theme and src/styles/tailwind-theme.css:
 *  every class of getClassList() compiled with /[0.37], /[17px] and /(--x), and only these roots put
 *  the modifier in a declaration (task 1.1b review; on every other utility it is ignored). Any
 *  bracketed modifier after one of them is refused, so "parent-guides/[slug]", "stories/[slug]" or
 *  "/store/e/[event]" are never read as utilities. */
const MODIFIABLE_BASE =
  /^-?(?:accent|bg|border|caret|decoration|divide|drop|fill|from|inset|mask|outline|placeholder|ring|scrollbar|shadow|stroke|text|to|via)(?:-[\w.-]+)?$/;
/** Tailwind's own colour values, which need no theme entry ("bg-current/50" is a colour-mix of
 *  currentcolor); black and white are listed too, though the theme drops them, so they never pass. */
const TAILWIND_COLOUR_KEYWORDS: readonly string[] = ["current", "transparent", "inherit", "black", "white"];
/** The colours a utility can name: the theme's --color-* roles (src/styles/tailwind-theme.css,
 *  which drops every Tailwind default) and the keywords above. */
const THEME_COLOURS: readonly string[] = [
  ...[...readRepoFile("src/styles/tailwind-theme.css").matchAll(/^\s*--color-([a-z0-9-]+)\s*:/gm)].map((m) => m[1]),
  ...TAILWIND_COLOUR_KEYWORDS,
];
/** A numeric modifier: an opacity step after a colour ("bg-surface/37", "bg-scrim/7.5"), a line
 *  height after a font size ("text-sm/6"), or a fraction ("w-1/2", "inset-1/2"). */
const NUMERIC_MODIFIER = /^(?:\d+(?:\.\d+)?|\.\d+)$/;
/** A colour utility: a modifiable root ending in a colour name, so the modifier is an opacity. The
 *  DS has no opacity tokens, so every numeric opacity step is off the DS (wave-2 close ruling,
 *  task 2.13); "text-sm/6" and "inset-1/2" do not end in a colour and pass. Probed on the pinned
 *  Tailwind 4.3.2 with src/styles/tailwind-theme.css (task 2.13): bg-surface/37, text-text/50,
 *  bg-scrim/7.5, bg-current/50, fill-cta/50, border-x-border/50, ring-focus/40, from-primary/20 and
 *  shadow-scrim/25 each compile to color-mix(in oklab, <colour> N%, transparent); inset-1/2 to
 *  calc(1 / 2 * 100%); text-sm/6 and ring-2/50 to nothing (the theme has no font sizes). */
const isColourUtility = (base: string) => MODIFIABLE_BASE.test(base) && THEME_COLOURS.some((c) => base.endsWith(`-${c}`));
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

/** A utility split at its last "/" outside brackets and parentheses: base and modifier. */
function splitModifier(utility: string): { base: string; modifier: string | null } {
  let depth = 0;
  let slash = -1;
  for (let i = 0; i < utility.length; i++) {
    const ch = utility[i];
    if (ch === "[" || ch === "(") depth++;
    else if ((ch === "]" || ch === ")") && depth > 0) depth--;
    else if (ch === "/" && depth === 0) slash = i;
  }
  return slash < 0 ? { base: utility, modifier: null } : { base: utility.slice(0, slash), modifier: utility.slice(slash + 1) };
}

/** Every arbitrary Tailwind class in a whitespace-separated class string, with its rule. */
function arbitraryClasses(classes: string): { rule: string; text: string }[] {
  const out: { rule: string; text: string }[] = [];
  for (const token of classes.split(/\s+/)) {
    if (!token) continue;
    const segments = classSegments(token);
    const { base, modifier } = splitModifier(segments.pop()!.replace(/^!|!$/, ""));
    const rule = ARBITRARY_VALUE.test(base)
      ? "Tailwind arbitrary value"
      : ARBITRARY_PROPERTY.test(base)
        ? "Tailwind arbitrary property"
        : VAR_SHORTHAND.test(base)
          ? "Tailwind (--var) shorthand"
          : modifier !== null && ARBITRARY_MODIFIER.test(modifier) && MODIFIABLE_BASE.test(base)
            ? "Tailwind arbitrary modifier"
            : modifier !== null && NUMERIC_MODIFIER.test(modifier) && isColourUtility(base)
              ? "Tailwind opacity modifier (the DS has no opacity tokens)"
              : segments.some((v) => ARBITRARY_BREAKPOINT.test(v))
                ? "Tailwind arbitrary breakpoint"
                : null;
    if (rule) out.push({ rule, text: token });
  }
  return out;
}

function unwrap(e: ts.Expression): ts.Expression {
  let x = e;
  while (ts.isParenthesizedExpression(x) || ts.isAsExpression(x) || ts.isSatisfiesExpression(x) || ts.isNonNullExpression(x)) x = x.expression;
  return x;
}

/** The file parsed inside a one-file program (no lib, imports not followed), so its checker can
 *  resolve a local name, an object's property or a destructured default to its declaration. */
function parseWithChecker(path: string, text: string): { sf: ts.SourceFile; checker: () => ts.TypeChecker } {
  const name = `/${path}`;
  const kind = path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const own = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true, kind);
  const host: ts.CompilerHost = {
    getSourceFile: (f) => (f === name ? own : undefined),
    getDefaultLibFileName: () => "/lib.d.ts",
    writeFile: () => undefined,
    getCurrentDirectory: () => "/",
    getCanonicalFileName: (f) => f,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => "\n",
    fileExists: (f) => f === name,
    readFile: () => undefined,
  };
  const program = ts.createProgram({ rootNames: [name], options: { noLib: true, noResolve: true, types: [], jsx: ts.JsxEmit.Preserve }, host });
  let checker: ts.TypeChecker | undefined;
  return { sf: program.getSourceFile(name) ?? own, checker: () => (checker ??= program.getTypeChecker()) };
}

/** The initializer a declaration gives its name: a variable's, a destructured or parameter
 *  default, an object property's value. */
function declaredValue(d: ts.Declaration): ts.Expression | undefined {
  if (ts.isVariableDeclaration(d) || ts.isBindingElement(d) || ts.isParameter(d) || ts.isPropertyAssignment(d)) return d.initializer;
  return undefined;
}

/** A key the checker resolves to one property: a string or numeric literal. Any other key (a prop,
 *  a const, an expression) can pick any property, so it is followed to all of them (pickedValues). */
const isLiteralKey = (key: ts.Expression) => ts.isStringLiteralLike(key) || ts.isNumericLiteral(key);
const isPickedAccess = (e: ts.Expression): e is ts.ElementAccessExpression => ts.isElementAccessExpression(e) && !isLiteralKey(e.argumentExpression);

/** The declarations behind a name, a property access or a literal-keyed element access. */
function declarationsOf(e: ts.Expression, checker: ts.TypeChecker): readonly ts.Declaration[] {
  if (isPickedAccess(e)) return [];
  const at = ts.isPropertyAccessExpression(e) ? e.name : ts.isElementAccessExpression(e) ? e.argumentExpression : e;
  const symbol = checker.getSymbolAtLocation(at);
  if (!symbol) return [];
  const decl = symbol.declarations ?? [];
  // `{ fill }` declares the property; the value is the local `fill` it reads.
  return decl.flatMap((d) => (ts.isShorthandPropertyAssignment(d) ? (checker.getShorthandAssignmentValueSymbol(d)?.declarations ?? []) : [d]));
}

const MAX_HOPS = 8;

/** Every string literal an expression can evaluate to, followed through conditions, `||`, `??`
 *  and `&&`, local consts, object properties and destructured defaults (MAX_HOPS deep). */
function stringValues(expr: ts.Expression, checker: ts.TypeChecker, hops = 0): ts.StringLiteralLike[] {
  if (hops > MAX_HOPS) return [];
  const e = unwrap(expr);
  if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) return [e];
  if (ts.isConditionalExpression(e)) return [...stringValues(e.whenTrue, checker, hops), ...stringValues(e.whenFalse, checker, hops)];
  if (ts.isBinaryExpression(e)) {
    const op = e.operatorToken.kind;
    if (op === ts.SyntaxKind.AmpersandAmpersandToken) return stringValues(e.right, checker, hops);
    if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.QuestionQuestionToken) {
      return [...stringValues(e.left, checker, hops), ...stringValues(e.right, checker, hops)];
    }
    return [];
  }
  if (isPickedAccess(e)) return pickedValues(e, checker, hops).flatMap((v) => stringValues(v, checker, hops + 1));
  if (ts.isIdentifier(e) || ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e)) {
    return declarationsOf(e, checker).flatMap((d) => {
      const value = declaredValue(d);
      return value ? stringValues(value, checker, hops + 1) : [];
    });
  }
  return [];
}

/** The object literals a spread can stand for, followed like stringValues. */
function objectLiterals(expr: ts.Expression, checker: ts.TypeChecker, hops = 0): ts.ObjectLiteralExpression[] {
  if (hops > MAX_HOPS) return [];
  const e = unwrap(expr);
  if (ts.isObjectLiteralExpression(e)) return [e];
  if (ts.isConditionalExpression(e)) return [...objectLiterals(e.whenTrue, checker, hops), ...objectLiterals(e.whenFalse, checker, hops)];
  if (ts.isBinaryExpression(e) && [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken].includes(e.operatorToken.kind)) {
    return [...objectLiterals(e.left, checker, hops), ...objectLiterals(e.right, checker, hops)];
  }
  if (isPickedAccess(e)) return pickedValues(e, checker, hops).flatMap((v) => objectLiterals(v, checker, hops + 1));
  if (ts.isIdentifier(e) || ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e)) {
    return declarationsOf(e, checker).flatMap((d) => {
      const value = declaredValue(d);
      return value ? objectLiterals(value, checker, hops + 1) : [];
    });
  }
  return [];
}

/** Every property value of an object literal, its spreads followed: what a key that is not a
 *  literal can pick (`FILLS[tone]` may read any value of FILLS, so all are checked). */
function propertyValues(obj: ts.ObjectLiteralExpression, checker: ts.TypeChecker, hops: number): ts.Expression[] {
  return obj.properties.flatMap((p) =>
    ts.isPropertyAssignment(p)
      ? [p.initializer]
      : ts.isShorthandPropertyAssignment(p)
        ? [p.name]
        : ts.isSpreadAssignment(p)
          ? objectLiterals(p.expression, checker, hops + 1).flatMap((inner) => propertyValues(inner, checker, hops + 1))
          : [],
  );
}

/** The values an element access with a non-literal key can read: every value of the objects behind it. */
function pickedValues(e: ts.ElementAccessExpression, checker: ts.TypeChecker, hops: number): ts.Expression[] {
  return objectLiterals(e.expression, checker, hops + 1).flatMap((obj) => propertyValues(obj, checker, hops + 1));
}

/** Each colour-attribute entry of a spread object (spreads inside it included): name and value. */
function spreadColourEntries(obj: ts.ObjectLiteralExpression, checker: ts.TypeChecker, hops = 0): { name: string; value: ts.Expression }[] {
  if (hops > MAX_HOPS) return [];
  const out: { name: string; value: ts.Expression }[] = [];
  for (const p of obj.properties) {
    if (ts.isSpreadAssignment(p)) {
      for (const inner of objectLiterals(p.expression, checker)) out.push(...spreadColourEntries(inner, checker, hops + 1));
      continue;
    }
    const key = p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : null;
    if (!key || !COLOUR_ATTRS.test(key)) continue;
    if (ts.isPropertyAssignment(p)) out.push({ name: key, value: p.initializer });
    else if (ts.isShorthandPropertyAssignment(p)) out.push({ name: key, value: p.name });
  }
  return out;
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

const isNamedColour = (s: string) => CSS_NAMED_COLOURS.has(s.trim().toLowerCase());
const lineOfNode = (sf: ts.SourceFile, node: ts.Node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
const within = (node: ts.Node, outer: ts.Node) => node.pos >= outer.pos && node.end <= outer.end;

/** Named colours that reach a colour attribute from outside it (task 1.1b): through a local const,
 *  an object property or a destructured default (`const C = "red"; <path fill={C} />`), or through
 *  a spread (`<path {...{ fill: "red" }} />`, `<path {...attrs} />`). A literal written inside the
 *  attribute itself is the string pass's. Names are resolved in the file only: a colour imported
 *  from another module is not followed (the header lists the other known limits). */
function colourFlowViolations(sf: ts.SourceFile, checker: () => ts.TypeChecker): Violation[] {
  const out: Violation[] = [];
  const at = (lit: ts.Node) => (lit.getSourceFile() === sf ? ` (line ${lineOfNode(sf, lit)})` : "");
  const visit = (node: ts.Node): void => {
    if (ts.isJsxAttribute(node) && COLOUR_ATTRS.test(node.name.getText(sf)) && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression) {
      const expr = node.initializer.expression;
      for (const lit of stringValues(expr, checker())) {
        if (within(lit, node) || !isNamedColour(lit.text)) continue;
        out.push({ line: lineOfNode(sf, node), rule: "named colour on a colour attribute", text: `${node.name.getText(sf)}={${expr.getText(sf)}} reads "${lit.text}"${at(lit)}` });
      }
    } else if (ts.isJsxSpreadAttribute(node)) {
      for (const obj of objectLiterals(node.expression, checker())) {
        for (const entry of spreadColourEntries(obj, checker())) {
          for (const lit of stringValues(entry.value, checker())) {
            if (!isNamedColour(lit.text)) continue;
            out.push({ line: lineOfNode(sf, node), rule: "named colour on a colour attribute", text: `{...${node.expression.getText(sf)}} sets ${entry.name}="${lit.text}"${at(lit)}` });
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/** .tsx and .ts modules: Tailwind arbitrary classes in any string, read token by token (a class can
 *  be built in a variants or classes module), and in .tsx also colour literals in any string, so a
 *  hex cannot reach an attribute through a const, named colours on colour attributes (written there,
 *  or reaching them through a const, an object property or a spread), and inline styles beyond the
 *  art-board positions. Hex in .ts stays legal: e-mail HTML and the payment sheet's theme need real
 *  colours, not tokens. */
function tsxViolations(path: string, text: string): Result {
  const isTsx = path.endsWith(".tsx");
  const parsed = isTsx ? parseWithChecker(path, text) : null;
  const sf = parsed?.sf ?? parseSource(path, text);
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
  if (parsed) {
    for (const a of jsxAttributes(sf)) {
      if (a.name !== "style") continue;
      for (const t of inlineStyleViolations(sf, a.initializer)) violations.push({ line: a.line, rule: "inline style", text: t });
    }
    violations.push(...colourFlowViolations(sf, parsed.checker));
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

  /* The mockup-mapping exceptions (wiki/engineering/mockup-css-mapping.md §4): each is red outside
     its files and green inside them (the green half is in "accepts each named exception"). */
  it.each([
    ["ds-weight-800", ".ks-a { font-weight: 800; }", "src/components/ui/Card/card.css"],
    ["ds-weight-800 at another weight in its file", ".ks-a { font-weight: 900; }", "src/components/ui/HelpLine/help-line.css"],
    ["ds-weight-700", ".ks-a { font-weight: 700; }", "src/components/ui/HelpLine/help-line.css"],
    ["ds-weight-500-legal", ".ks-a { font-weight: 500; }", "src/components/sections/ArticleBody/article-body.css"],
    ["ds-underline-offset-3px", ".ks-a { text-underline-offset: 3px; }", "src/components/ui/Field/field.css"],
    ["legal-step-numeral", ".ks-a::before { font: 800 16px/20px var(--font-display); }", "src/components/sections/StepsSection/steps-section.css"],
    ["legal-step-numeral, other size", ".ks-a::before { font: 800 18px/20px var(--font-display); }", "src/layouts/LegalTemplate/legal-template.css"],
    ["legal-toc-fine-size", ".ks-a { font-size: 14px; }", "src/components/ui/Breadcrumbs/breadcrumbs.css"],
    ["legal-toc-fine-line", ".ks-a { line-height: 20px; }", "src/components/ui/Breadcrumbs/breadcrumbs.css"],
    ["imagine-zoom", ".ks-a { transform: scale(1.32); }", "src/components/ui/ArtBoard/art-board.css"],
    ["imagine-zoom, other scale", ".ks-a { transform: scale(1.4); }", "src/components/ui/ImaginationFrame/imagination-frame.css"],
    ["guide-plush-ratio", ".ks-a { --kh-ratio: 4 / 3; }", "src/components/ui/ArtBoard/art-board.css"],
    ["content-max-1200 outside its files", "@media (min-width: 1200px) { .ks-a { margin: 0; } }", "src/components/sections/FeatureSplit/feature-split.css"],
    ["content-max-1200 combined with another feature", "@media (min-width: 1200px) and (max-width: 1300px) { .ks-a { margin: 0; } }", "src/components/ui/StepLoop/step-loop.css"],
    ["content-max-1200 as max-width", "@media (max-width: 1200px) { .ks-a { margin: 0; } }", "src/components/ui/StepLoop/step-loop.css"],
  ])("mapping exception refused out of place: %s", (_name, text, path) => {
    expect(css(text, path).length).toBeGreaterThan(0);
  });

  it("prints a refused media query at the prelude's own line", () => {
    expect(cssViolations("src/components/ui/Card/card.css", ".ks-a { margin: 0; }\n\n@media (min-width: 1200px) {\n  .ks-a { margin: 0; }\n}").violations[0]?.line).toBe(3);
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
    // Task 1.1b (1.1's last review): arbitrary modifiers compile to a literal line height or
    // opacity ("text-sm/[17px]" is line-height: 17px; "bg-black/[0.37]" is a 37% colour-mix).
    ["arbitrary line-height modifier", `export const A = () => <p className="text-sm/[17px]" />;`],
    ["arbitrary opacity modifier", `export const A = () => <div className="bg-black/[0.37]" />;`],
    ["(--var) shorthand as a modifier", `export const A = () => <div className="bg-black/(--ks-alpha)" />;`],
    ["arbitrary modifier after stacked variants, important", `export const A = () => <p className="md:hover:text-sm/[17px]!" />;`],
    // Tailwind compiles an arbitrary property whose name starts with a dash or a lower-case letter,
    // whatever follows (digits, capitals, underscores): "[--ks-x2:3px]" is --ks-x2: 3px.
    ["arbitrary property with a digit in its name", `export const A = () => <div className="[--ks-x2:3px]" />;`],
    ["arbitrary property with a capital in its name", `export const A = () => <div className="[--ks-X:3px]" />;`],
    ["arbitrary property with an underscore in its name", `export const A = () => <div className="[--ks_x:3px]" />;`],
    ["arbitrary property with a modifier", `export const A = () => <div className="[color:red]/50" />;`],
    // A CSS named colour that reaches a colour attribute through a const, an object property or a
    // spread (the literal sits outside the attribute, so the attribute pass alone never saw it).
    ["named colour through a const", `const C = "red"; export const A = () => <svg><path fill={C} /></svg>;`],
    ["named colour through a chain of consts", `const BASE = "red"; const C = BASE; export const A = () => <svg><path fill={C} /></svg>;`],
    ["named colour through a const in a condition", `const C = "red"; export const A = ({ on }: { on: boolean }) => <svg><path fill={on ? C : "currentColor"} /></svg>;`],
    ["named colour through an object property", `const C = { fill: "red" }; export const A = () => <svg><path fill={C.fill} /></svg>;`],
    ["named colour through an element access", `const TONES = { warm: "tomato" }; export const A = () => <svg><path stroke={TONES["warm"]} /></svg>;`],
    ["named colour through an as-const object", `const TONES = { warm: "tomato" } as const; export const A = () => <svg><path stroke={TONES.warm} /></svg>;`],
    ["named colour through a destructured default", `export const A = ({ tone = "red" }: { tone?: string }) => <svg><path fill={tone} /></svg>;`],
    ["named colour in a spread object", `export const A = () => <svg><path {...{ fill: "red" }} /></svg>;`],
    ["named colour in a spread const", `const attrs = { stroke: "navy" }; export const A = () => <svg><path {...attrs} /></svg>;`],
    ["named colour in a spread shorthand", `const fill = "gold"; export const A = () => <svg><path {...{ fill }} /></svg>;`],
    ["named colour in a nested spread", `const base = { fill: "red" }; const attrs = { ...base, stroke: "currentColor" }; export const A = () => <svg><path {...attrs} /></svg>;`],
    ["named colour in a conditional spread", `const on = { color: "crimson" }; export const A = ({ x }: { x: boolean }) => <svg {...(x ? on : {})} />;`],
    // 1.1b review: a key that is not a literal can pick any value of the object, so every value is read.
    ["named colour among the values behind a prop key", `const FILLS = { warm: "var(--kh-orange-500)", hot: "red" }; export const A = ({ tone = "warm" }: { tone?: "warm" | "hot" }) => <svg><path fill={FILLS[tone]} /></svg>;`],
    ["named colour among the values behind a const key", `const k = "day"; const FILLS = { day: "var(--kh-gold)", night: "navy" }; export const A = () => <svg><path fill={FILLS[k]} /></svg>;`],
    ["named colour in a spread picked by a prop key", `const ATTRS = { warm: { fill: "currentColor" }, hot: { fill: "red" } }; export const A = ({ tone = "warm" }: { tone?: "warm" | "hot" }) => <svg><path {...ATTRS[tone]} /></svg>;`],
    // 1.1b review: a bracketed modifier on any colour or text utility is refused, whatever it holds.
    ["arbitrary calc() opacity modifier", `export const A = () => <div className="bg-surface/[calc(var(--x)*2)]" />;`],
    ["arbitrary var() opacity modifier on fill", `export const A = () => <svg className="fill-cta/[var(--ks-a)]" />;`],
    ["arbitrary modifier on a shadow colour", `export const A = () => <div className="drop-shadow-scrim/[0.37] inset-ring-border/[0.5]" />;`],
    // Task 2.13 (wave-2 close ruling): a numeric opacity step on a colour is a literal opacity too,
    // and the DS has no opacity tokens ("bg-surface/37" is a 37 percent colour-mix of --surface).
    ["numeric opacity on a background colour", `export const A = () => <div className="bg-surface/37" />;`],
    ["numeric opacity on a text colour", `export const A = () => <p className="text-text/50" />;`],
    ["decimal opacity on the scrim", `export const A = () => <div className="bg-scrim/7.5" />;`],
    ["numeric opacity after stacked variants, important", `export const A = () => <div className="md:hover:bg-surface/37!" />;`],
    ["numeric opacity on a two-word colour", `export const A = () => <p className="text-text-muted/80 border-border-strong/50" />;`],
    ["numeric opacity on ring, outline and divide colours", `export const A = () => <i className="ring-focus/40 outline-focus/60 divide-border/30" />;`],
    ["numeric opacity on gradient stops", `export const A = () => <i className="from-primary/20 via-cta/10 to-deep-blue/90" />;`],
    ["numeric opacity on fill and stroke", `export const A = () => <svg className="fill-cta/50 stroke-text/25" />;`],
    ["numeric opacity on shadow and text-shadow colours", `export const A = () => <i className="shadow-scrim/25 drop-shadow-scrim/50 inset-ring-border/50 text-shadow-text/30" />;`],
    ["numeric opacity on a side border colour", `export const A = () => <i className="border-x-border/50" />;`],
    ["numeric opacity on the current colour", `export const A = () => <i className="bg-current/50" />;`],
    ["numeric opacity in a template literal", "export const A = ({ on }: { on: boolean }) => <div className={`kh-card ${on ? \"bg-scrim/7.5\" : \"\"}`} />;"],
  ])("%s", (_name, text) => {
    expect(tsx(text).length).toBeGreaterThan(0);
  });

  it("names the rule a numeric opacity step breaks", () => {
    expect(tsx(`export const A = () => <div className="bg-surface/37" />;`)).toEqual([
      { line: 1, rule: "Tailwind opacity modifier (the DS has no opacity tokens)", text: "bg-surface/37" },
    ]);
  });

  it("reads the colour names from the Tailwind theme: the 21 DS roles", () => {
    expect(THEME_COLOURS).toEqual(expect.arrayContaining(["surface", "text", "text-muted", "scrim", "deep-chilli", "on-primary"]));
    expect(THEME_COLOURS.filter((c) => !TAILWIND_COLOUR_KEYWORDS.includes(c))).toHaveLength(21);
  });

  it("names the colour attribute and the const a named colour came through", () => {
    const [v] = tsx(`const C = "red";\nexport const A = () => <svg><path fill={C} /></svg>;`);
    expect(v).toMatchObject({ line: 2, rule: "named colour on a colour attribute" });
    expect(v.text).toContain("fill={C}");
    expect(v.text).toContain('"red"');
  });

  it.each([
    ["arbitrary value in a variants module", `export const card = { base: "grid gap-4", tight: "p-[13px]" };`],
    ["arbitrary property in a classes module", `export const MASK = "[mask-type:luminance]";`],
    ["(--var) shorthand in a classes module", `export const pad = (on: boolean) => (on ? "p-(--space-3)" : "");`],
    ["arbitrary value after a variant in a variants module", `export const open = "data-[state=open]:p-[13px]";`],
    ["important arbitrary value in a classes module", `export const tight = ["grid", "gap-[3px]!"].join(" ");`],
    ["arbitrary modifier in a variants module", `export const lead = { base: "text-sm/[17px]" };`],
    ["arbitrary property with a digit in a classes module", `export const X2 = "[--ks-x2:3px]";`],
    ["numeric opacity in a variants module", `export const overlay = { base: "fixed inset-0", dim: "bg-scrim/7.5" };`],
  ])("%s (.ts)", (_name, text) => {
    expect(script(text, "src/components/ui/Card/card.variants.ts").length).toBeGreaterThan(0);
  });

  it.each([
    ["@apply of an arbitrary value", ".ks-a { @apply p-[13px]; }"],
    ["@apply of an arbitrary value and colour", ".ks-a { @apply p-[13px] text-[#ff0000]; }"],
    ["@apply of an arbitrary value after a variant", ".ks-a { @apply flex data-[state=open]:p-[13px]; }"],
    ["@apply of an arbitrary property, important", ".ks-a { @apply [mask-type:luminance] !important; }"],
    ["@apply of a (--var) shorthand", ".ks-a { @apply p-(--space-3); }"],
    ["@apply of an arbitrary modifier", ".ks-a { @apply text-sm/[17px]; }"],
    ["@apply of an arbitrary property with a capital", ".ks-a { @apply [--ks-X:3px]; }"],
    ["@apply of a numeric opacity step", ".ks-a { @apply bg-surface/37; }"],
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
    // The mockup-mapping exceptions (mockup-css-mapping.md §4), each in one of its files.
    const ok: [string, string][] = [
      [".ks-a { font-weight: 800; }", "src/components/ui/HelpLine/help-line.css"],
      [".ks-a { font-weight: 800; }", "src/layouts/LegalTemplate/legal-template.css"],
      [".ks-a { font-weight: 700; }", "src/components/ui/Field/field.css"],
      [".ks-a { font-weight: 700; }", "src/components/sections/ArticleBody/article-body.css"],
      [".ks-a { font-weight: 500; }", "src/layouts/LegalTemplate/legal-template.css"],
      [".ks-a { text-underline-offset: 3px; }", "src/components/sections/ArticleBody/article-body.css"],
      [".ks-a::before { font: 800 16px/20px var(--font-display); }", "src/layouts/LegalTemplate/legal-template.css"],
      ["@media (min-width: 1024px) and (pointer: fine) { .ks-a { font-size: 14px; line-height: 20px; } }", "src/layouts/LegalTemplate/legal-template.css"],
      [".ks-a { transform: scale(1.32); transform-origin: 52% 100%; }", "src/components/ui/ImaginationFrame/imagination-frame.css"],
      [".ks-a { --kh-ratio: 4 / 3; }", "src/components/sections/FeatureSplit/feature-split.css"],
      ["@media (min-width: 1200px) { .ks-a { margin: 0; } }", "src/components/ui/StepLoop/step-loop.css"],
      ["@media   (min-width:   1200px)   { .ks-a { margin: 0; } }", "src/components/sections/ArticleBody/article-body.css"],
    ];
    for (const [text, path] of ok) expect(css(text, path), `${path}: ${text}`).toEqual([]);
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

  it("follows consts, object properties and spreads to currentColor and tokens, and leaves colour words off colour attributes alone", () => {
    const ok = `
      const INK = "currentColor";
      const TONE = { fill: "var(--kh-orange-500)", stroke: "none" } as const;
      const LABEL = "red";
      const CHIP = { label: "red", tone: "gold" };
      export const A = ({ tone = "currentColor", on }: { tone?: string; on: boolean }) => (
        <svg aria-label={LABEL}>
          <path fill={INK} />
          <path {...TONE} />
          <path {...{ fill: "currentColor", stroke: "url(#kh-grad)" }} />
          <path stroke={TONE.fill} fill={on ? tone : INK} />
          <text data-tone={LABEL} {...CHIP}>{LABEL}</text>
        </svg>
      );`;
    expect(tsx(ok)).toEqual([]);
  });

  it("follows a key that is not a literal to every value of its object: tokens only pass", () => {
    const ok = `
      const FILLS = { orange: "var(--kh-orange-500)" };
      const k = "gold";
      const GOLD = { gold: "var(--kh-gold)", ink: "currentColor" };
      const ATTRS = { warm: { fill: "currentColor", stroke: "none" } };
      export const A = ({ tone = "orange", look = "warm" }: { tone?: "orange"; look?: "warm" }) => (
        <svg>
          <path fill={FILLS[tone]} />
          <path fill={GOLD[k]} stroke={FILLS["orange"]} />
          <path {...ATTRS[look]} />
        </svg>
      );`;
    expect(tsx(ok)).toEqual([]);
  });

  it("reads modifiers by their value: theme steps, fractions and paths with brackets pass", () => {
    const ok = `export const A = () => <a className="text-sm/6 w-1/2 md:w-1/3" href="/store/e/[event]">x</a>;`;
    expect(tsx(ok)).toEqual([]);
    // A numeric modifier on anything but a colour is a line height or a fraction, not an opacity
    // (task 2.13): "inset-1/2" is 50 percent, though "inset" is also a shadow and ring colour root.
    const fractions = `export const A = () => <i className="inset-1/2 -inset-x-1/2 top-1/2 translate-x-1/2 basis-1/3 aspect-4/3 text-base/7 bg-surface border-2 ring-2 shadow-scrim" />;`;
    expect(tsx(fractions)).toEqual([]);
    expect(css(".ks-a { @apply inset-x-1/2 text-sm/6 bg-surface; }")).toEqual([]);
    expect(script(`export const HUB = "stories/[slug]"; export const EVENT = "/store/e/[event]"; export const LEAD = "text-sm/6";`, "src/config/routes.ts")).toEqual([]);
    // Relative route patterns with a dashed segment are not utilities (1.1b review).
    expect(script(`export const GUIDE = "parent-guides/[slug]"; export const PLAY = "how-to-play/[id]";`, "src/config/routes.ts")).toEqual([]);
    expect(tsx(`export const A = () => <a href="parent-guides/[slug]" data-route="how-to-play/[id]">x</a>;`)).toEqual([]);
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
