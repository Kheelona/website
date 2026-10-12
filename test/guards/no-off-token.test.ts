import ts from "typescript";
import { describe, expect, it } from "vitest";
import { isTestOrStory, listFiles, readRepoFile } from "../e2e/support/repo";
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
 * composition class built on tokens. This guard scans src/**\/*.css, *.tsx and *.ts (tests,
 * stories and .d.ts excluded: never shipped) for literal colours, lengths, durations, font values
 * (quoted family names included), z-indexes and scales, lengths in @media and @container preludes
 * other than the DS min-/max-width breakpoints, Tailwind arbitrary values and the (--var) shorthand
 * (in .ts modules too, where variants and class lists live), colour strings in .tsx (so a hex cannot
 * reach an attribute through a const), and inline styles beyond the art-board positions. The only
 * literals allowed are listed in token-exceptions.ts and printed on every run. Generated files are exempt (their drift tests
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
  return withoutVars(value.replace(/"[^"]*"|'[^']*'/g, '""').replace(/url\([^)]*\)/gi, "url()"));
}

/** var(...) calls collapsed to "var()"; they may nest (fallbacks), so innermost first. */
function withoutVars(value: string): string {
  let v = value;
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
  // A quoted family name is a font literal too: literalsOf() blanks strings, so read the raw value
  // with var() removed (a quoted name inside a var() fallback belongs to the token).
  if (/^(?:font|font-family)$/.test(prop) && /"[^"]*"|'[^']*'/.test(withoutVars(value))) add("font literal");
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

/** The JSX attribute a string is the value of (directly or inside {…}), if any. */
function owningAttribute(node: ts.Node): string | null {
  const parent = node.parent;
  if (parent && ts.isJsxAttribute(parent)) return parent.name.getText();
  if (parent && ts.isJsxExpression(parent) && parent.parent && ts.isJsxAttribute(parent.parent)) return parent.parent.name.getText();
  return null;
}

const COLOUR_STRING = new RegExp(`^(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|${COLOUR_FN.source}.*\\))$`, "i");

/** .tsx and .ts modules: Tailwind arbitrary values in any string (a class can be built in a
 *  variants or classes module), and in .tsx also colour literals in any string, so a hex cannot
 *  reach an attribute through a const, and inline styles beyond the art-board positions. Hex in
 *  .ts stays legal: e-mail HTML and the payment sheet's theme need real colours, not tokens. */
function tsxViolations(path: string, text: string): Result {
  const sf = parseSource(path, text);
  const isTsx = path.endsWith(".tsx");
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
    if (isTsx && COLOUR_STRING.test(s.text.trim())) {
      const attr = owningAttribute(s.node);
      if (!(attr && COLOUR_ATTR_SKIP.test(attr))) {
        violations.push({ line: s.line, rule: "colour literal", text: attr ? `${attr}="${s.text}"` : `"${s.text}"` });
      }
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
  ])("%s", (_name, text) => {
    expect(css(text).length).toBeGreaterThan(0);
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
  ])("%s", (_name, text) => {
    expect(tsx(text).length).toBeGreaterThan(0);
  });

  it.each([
    ["arbitrary value in a variants module", `export const card = { base: "grid gap-4", tight: "p-[13px]" };`],
    ["arbitrary property in a classes module", `export const MASK = "[mask-type:luminance]";`],
    ["(--var) shorthand in a classes module", `export const pad = (on: boolean) => (on ? "p-(--space-3)" : "");`],
  ])("%s (.ts)", (_name, text) => {
    expect(script(text, "src/components/ui/Card/card.variants.ts").length).toBeGreaterThan(0);
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
