import ts from "typescript";
import { describe, expect, it } from "vitest";
import { listFiles, readRepoFile } from "../e2e/support/repo";
import { jsxAttributes, parseSource, sourceStrings, stripCssComments } from "../e2e/support/source";
import { isStillLegacy } from "./legacy-paths";
import {
  CSS_EXCEPTIONS,
  EXEMPT_FILES,
  INLINE_STYLE_KEYS,
  INLINE_STYLE_TEMPLATE_TEXT,
  INLINE_STYLE_VALUE,
  MEDIA_LENGTHS,
  ZERO,
} from "./token-exceptions";

/* no-off-token (task 1.1; architecture §4.4, brief §9.9).
 *
 * Every visual value in src/ comes from the design system: a DS token, a kh- class, or a ks-
 * composition class built on tokens. This guard scans src/**\/*.css and src/**\/*.tsx (tests and
 * stories excluded: never shipped) for literal colours, lengths, durations, font values, z-indexes
 * and scales, off-DS media queries, Tailwind arbitrary values and the (--var) shorthand, and inline
 * styles beyond the art-board positions. The only literals allowed are listed in
 * token-exceptions.ts and printed on every run. Generated files are exempt (their drift tests
 * compare them with the DS); legacy files are skipped only while unchanged (legacy-paths.ts).
 */

type Violation = { line: number; rule: string; text: string };
type Result = { violations: Violation[]; applied: string[] };

const NAMED_COLOURS =
  /\b(?:white|black|red|green|blue|yellow|orange|purple|pink|gray|grey|brown|cyan|magenta|lime|navy|teal|olive|maroon|silver|gold|beige|ivory|coral|salmon|crimson|indigo|violet|tomato)\b/i;
const COLOUR_FN = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const HEX = /#[0-9a-fA-F]{3,8}\b/;
const LENGTH = /(?<![\w.-])-?(?:\d+\.?\d*|\.\d+)(px|rem|em|pt|pc|cm|mm|in|q)\b/gi;
const TIME = /(?<![\w.-])-?(?:\d+\.?\d*|\.\d+)(ms|s)\b/gi;
const FONT_PROPS = /^(?:font|font-size|font-weight|font-family|line-height|letter-spacing)$/;
const NUMBER = /(?<![\w.#-])-?(?:\d+\.?\d*|\.\d+)(?![\w%.])/g;

function lineAt(text: string, index: number): number {
  return text.slice(0, index).split("\n").length;
}

/** The value with strings, url(...) and var(...) removed: what is left are the literals. */
function literalsOf(value: string): string {
  let v = value.replace(/"[^"]*"|'[^']*'/g, '""').replace(/url\([^)]*\)/gi, "url()");
  // var() may nest (fallbacks); remove innermost first.
  for (let i = 0; i < 5 && /var\(/.test(v); i++) v = v.replace(/var\([^()]*\)/g, "var()");
  return v;
}

function nonZero(matches: string[]): string[] {
  return matches.filter((m) => !ZERO.test(m));
}

function declarationViolations(path: string, prop: string, rawValue: string): { rule: string; text: string }[] {
  const value = rawValue.trim();
  const exception = CSS_EXCEPTIONS.find((e) => e.file.test(path) && e.property.test(prop) && e.value.test(value));
  if (exception) return [{ rule: `exception:${exception.id}`, text: `${prop}: ${value}` }];
  const lit = literalsOf(value);
  const out: { rule: string; text: string }[] = [];
  const add = (rule: string) => out.push({ rule, text: `${prop}: ${value}` });
  if (HEX.test(lit) || COLOUR_FN.test(lit) || (!prop.startsWith("--") && NAMED_COLOURS.test(lit))) add("colour literal");
  if (nonZero(lit.match(LENGTH) ?? []).length) add("length literal (px, rem, em …)");
  if (nonZero(lit.match(TIME) ?? []).length) add("duration literal");
  if (FONT_PROPS.test(prop) && !/^(?:inherit|initial|unset|normal|var\(\))$/.test(lit.trim())) {
    if ((lit.match(NUMBER) ?? []).length || /[a-z]/i.test(lit.replace(/var\(\)|inherit|normal/g, ""))) add("font literal");
  }
  if (prop === "z-index" && nonZero(lit.match(NUMBER) ?? []).length) add("z-index literal");
  if (/\bscale[XYZ3d]*\(\s*-?\d/.test(lit) && !/\bscale[XYZ3d]*\(\s*-?1\s*\)/.test(lit)) add("scale literal");
  if (prop.startsWith("--") && nonZero(lit.match(NUMBER) ?? []).length) add("literal in a custom property");
  return out.filter((v, i, a) => a.findIndex((w) => w.rule === v.rule) === i);
}

function mediaViolations(prelude: string): string[] {
  const out: string[] = [];
  const re = /\(\s*(min-width|max-width|min-height|max-height|width|height)\s*:\s*([^)]+)\)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(prelude))) {
    const feature = m[1].toLowerCase() as keyof typeof MEDIA_LENGTHS;
    const px = /^(\d+)px$/.exec(m[2].trim());
    const allowed = MEDIA_LENGTHS[feature];
    if (!allowed || !px || !allowed.includes(Number(px[1]))) out.push(m[0]);
  }
  if (/\b\d+(?:\.\d+)?(?:em|rem)\b/.test(prelude)) out.push(prelude);
  return out;
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
      if (/^@media\b/i.test(prelude)) {
        for (const bad of mediaViolations(prelude)) {
          violations.push({ line: lineAt(text, start), rule: "media query off the DS breakpoints", text: bad });
        }
      }
      buf = "";
      start = i + 1;
    } else if (ch === ";" || ch === "}") {
      const decl = buf.trim();
      const m = /^(-{0,2}[a-zA-Z][\w-]*)\s*:([\s\S]*)$/.exec(decl);
      if (m && !decl.startsWith("@")) {
        for (const v of declarationViolations(path, m[1], m[2].replace(/!important\s*$/, ""))) {
          if (v.rule.startsWith("exception:")) applied.push(`${path}: ${v.text} (${v.rule.slice(10)})`);
          else violations.push({ line: lineAt(text, start + buf.indexOf(decl)), ...v });
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

const ARBITRARY_VALUE = /(?:^|\s)(?:[\w-]+:)*!?-?[a-z][\w-]*-\[[^\]\s]+\](?:\/[\w.[\]]+)?(?=\s|$)/;
const ARBITRARY_PROPERTY = /(?:^|\s)(?:[\w-]+:)*\[[a-z-]+:[^\]\s]+\](?=\s|$)/;
const VAR_SHORTHAND = /(?:^|\s)(?:[\w-]+:)*!?-?[a-z][\w-]*-\(--[\w-]+\)(?=\s|$)/;
const COLOUR_ATTR_SKIP = /^(?:href|id|key|to|htmlFor|aria-[\w-]+|data-[\w-]+)$/;

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
      const statics = [v.head.text, ...v.templateSpans.map((s) => s.literal.text)];
      if (!statics.every((s) => INLINE_STYLE_TEMPLATE_TEXT.test(s))) out.push(`${key}: ${v.getText(sf)}`);
    } else if (ts.isNumericLiteral(v)) {
      out.push(`${key}: ${v.text} (a bare number is pixels)`);
    }
    // Identifiers and other expressions are typed props (percent numbers), checked by the component's types.
  }
  return out;
}

function tsxViolations(path: string, text: string): Result {
  const sf = parseSource(path, text);
  const violations: Violation[] = [];
  for (const s of sourceStrings(sf)) {
    if (s.kind === "jsx-text") continue;
    for (const [re, rule] of [
      [ARBITRARY_VALUE, "Tailwind arbitrary value"],
      [ARBITRARY_PROPERTY, "Tailwind arbitrary property"],
      [VAR_SHORTHAND, "Tailwind (--var) shorthand"],
    ] as const) {
      const m = re.exec(s.text);
      if (m) violations.push({ line: s.line, rule, text: m[0].trim() });
    }
  }
  for (const a of jsxAttributes(sf)) {
    if (a.name === "style") {
      for (const t of inlineStyleViolations(sf, a.initializer)) violations.push({ line: a.line, rule: "inline style", text: t });
    } else if (a.value !== null && !COLOUR_ATTR_SKIP.test(a.name) && (/^#[0-9a-fA-F]{3,8}$/.test(a.value) || COLOUR_FN.test(a.value))) {
      violations.push({ line: a.line, rule: "colour literal attribute", text: `${a.name}="${a.value}"` });
    }
  }
  return { violations, applied: [] };
}

const css = (text: string, path = "src/components/ui/Card/card.css") => cssViolations(path, text).violations;
const tsx = (text: string, path = "src/components/ui/Card/Card.tsx") => tsxViolations(path, text).violations;

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
  ])("%s", (_name, text) => {
    expect(css(text).length).toBeGreaterThan(0);
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
  ])("%s", (_name, text) => {
    expect(tsx(text).length).toBeGreaterThan(0);
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
      @media (prefers-reduced-motion: reduce) { .ks-a { transition: none; } }
      @keyframes ks-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }`;
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
          </div>
        );
      }`;
    expect(tsx(ok)).toEqual([]);
  });
});

describe("no-off-token: src/", () => {
  const all = listFiles(["src/**/*.css", "src/**/*.tsx"]).filter((p) => !/\.(test|stories)\.tsx$/.test(p));
  const exempt = all.filter((p) => EXEMPT_FILES.some((re) => re.test(p)));
  const legacy = all.filter((p) => !exempt.includes(p) && isStillLegacy(p));
  const scanned = all.filter((p) => !exempt.includes(p) && !legacy.includes(p));

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
