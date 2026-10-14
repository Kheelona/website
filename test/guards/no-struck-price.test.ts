import ts from "typescript";
import { describe, expect, it } from "vitest";
import { listFiles, readRepoFile } from "../e2e/support/repo";
import { parseSource, sourceStrings, stripCssComments } from "../e2e/support/source";

/* no-struck-price (task 8c.2; D061 item 3; wiki/product/legal-requirements.md PRICE-01, DARK-01).
 *
 * The later price shows as a plain line ("₹4,999 for the first 500 units. ₹7,999 once they are gone."), never as a
 * struck-through amount: a struck ₹7,999 is a bargain claim, not lawful until ₹7,999 has actually been charged, and from
 * 1 January 2027 a reduction must show the 30-day lowest prior price (CPA s.2(47); E-commerce Rules 4(11)(a), 4(13)).
 * So nothing in src/ may strike text through, however it is written:
 * - an element that draws a strike: <s>, <del>, <strike> (JSX, createElement, or markup inside a string);
 * - the CSS that draws one: `line-through` (a declaration, an inline style value, a Tailwind utility such as
 *   `line-through` or `decoration-line-through`, in any string);
 * - the DS's own struck later price, `kh-offer__was` (bundle.css draws it with line-through), the place the OfferCard's
 *   later price must never take;
 * - Unicode strike characters (U+0335, U+0336, U+0338 combining overlays, as in "₹̶7̶,̶9̶9̶9̶").
 * Every shipped and story file under src/ is read (tests are not: they name these to assert their absence); TypeScript
 * through the compiler's parser, so a comment explaining the rule never trips it, CSS without its comments, and any other
 * text file (the journal snapshot's JSON) as it is.
 */

type Hit = { line: number; what: string };

const STRUCK_TAGS = new Set(["s", "del", "strike"]);
const STRUCK_TEXT: readonly [RegExp, string][] = [
  [/line-through/i, "line-through"],
  [/\bkh-offer__was\b/, "the DS's struck later price (kh-offer__was)"],
  [/<(?:s|del|strike)(?=[\s>/])/i, "a strike element in markup"],
  [/[̵̶̸]/, "a Unicode strike character"],
];

const lineAt = (text: string, index: number) => text.slice(0, index).split("\n").length;

/** Each struck pattern in a stretch of text, by line. */
function textHits(text: string, firstLine = 1): Hit[] {
  const hits: Hit[] = [];
  for (const [pattern, what] of STRUCK_TEXT) {
    const m = pattern.exec(text);
    if (m) hits.push({ line: firstLine + lineAt(text, m.index) - 1, what });
  }
  return hits;
}

export function struckHits(path: string, text: string): Hit[] {
  if (path.endsWith(".css")) return textHits(stripCssComments(text));
  if (!/\.[cm]?[jt]sx?$/.test(path)) return textHits(text);
  const sf = parseSource(path, text);
  const hits: Hit[] = sourceStrings(sf).flatMap((s) => textHits(s.text, s.line));
  const line = (node: ts.Node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
  const visit = (node: ts.Node): void => {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && STRUCK_TAGS.has(node.tagName.getText(sf))) {
      hits.push({ line: line(node), what: `a <${node.tagName.getText(sf)}> element` });
    }
    if (ts.isCallExpression(node) && /(?:^|\.)createElement$/.test(node.expression.getText(sf))) {
      const first = node.arguments[0];
      if (first && (ts.isStringLiteral(first) || ts.isNoSubstitutionTemplateLiteral(first)) && STRUCK_TAGS.has(first.text)) {
        hits.push({ line: line(node), what: `createElement("${first.text}")` });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return hits;
}

describe("no-struck-price detector", () => {
  it.each([
    ["an <s> element", "src/components/ui/X/X.tsx", `export const A = () => <s>₹7,999</s>;`],
    ["a <del> element", "src/components/ui/X/X.tsx", `export const A = () => <p><del className="x">{was}</del> {now}</p>;`],
    ["a self-closing <strike>", "src/components/ui/X/X.tsx", `export const A = () => <strike />;`],
    ["createElement(\"del\")", "src/layouts/x.ts", `export const a = createElement("del", null, "₹7,999");`],
    ["React.createElement(\"s\")", "src/layouts/x.ts", `export const a = React.createElement("s", null, was);`],
    ["markup inside a string", "src/content/en-IN/x.ts", `export const a = "<s>₹7,999</s> ₹4,999";`],
    ["the DS's struck later price", "src/components/ui/X/X.tsx", `export const A = () => <span className="kh-offer__was">{was}</span>;`],
    ["an inline line-through", "src/components/ui/X/X.tsx", `export const A = () => <span style={{ textDecoration: "line-through" }} />;`],
    ["a Tailwind line-through utility", "src/components/ui/X/X.tsx", `export const A = () => <span className="text-muted line-through" />;`],
    ["a Tailwind decoration utility", "src/components/ui/X/X.tsx", `export const A = () => <span className={clsx("decoration-line-through")} />;`],
    ["a struck price in a template", "src/content/en-IN/x.ts", "export const a = `${was} ₹̶7̶,̶9̶9̶9̶`;"],
    ["a CSS line-through", "src/components/ui/X/x.css", ".ks-was { text-decoration: line-through; }"],
    ["a CSS rule on the DS's struck price", "src/components/ui/X/x.css", ".kh-offer__was { color: var(--text); }"],
    ["the journal snapshot's markup", "src/content/en-IN/stories/posts.generated.json", `{"html": "Was <del>₹7,999</del>"}`],
  ])("red on %s", (_name, path, text) => {
    expect(struckHits(path, text).length).toBeGreaterThan(0);
  });

  it.each([
    ["the later price as a plain line", "src/components/ui/X/X.tsx", `export const A = () => <p className="kh-body-s ks-offer__later">{later}</p>;`],
    ["elements whose names start with s or del", "src/components/ui/X/X.tsx", `export const A = () => <section><span /><strong /><small /><svg /><summary /></section>;`],
    ["words that contain the letters", "src/content/en-IN/x.ts", `export const a = "Delivery anywhere in India, included. Discount codes are never struck.";`],
    ["a comment that explains the rule", "src/components/ui/X/X.tsx", `/* never kh-offer__was, never line-through, never <s> */\nexport const A = () => null;`],
    ["a CSS comment that explains the rule", "src/components/ui/X/x.css", "/* never line-through (PRICE-01) */ .ks-x { margin: 0; }"],
    ["an underline", "src/components/ui/X/x.css", ".ks-x { text-decoration: underline; }"],
  ])("green on %s", (_name, path, text) => {
    expect(struckHits(path, text)).toEqual([]);
  });

  it("records: the DS strikes its later price, the place the build must not use (control)", () => {
    const bundle = readRepoFile("design-system/project/components/bundle.css");
    expect(struckHits("src/x.css", bundle).map((h) => h.what)).toEqual(expect.arrayContaining(["line-through", "the DS's struck later price (kh-offer__was)"]));
  });
});

describe("no-struck-price: src/", () => {
  const files = listFiles(["src"])
    .filter((p) => /\.(?:[cm]?[jt]sx?|css|json|md|mdx|html|svg)$/.test(p))
    .filter((p) => !/\.(?:test|test-d)\.[cm]?[jt]sx?$/.test(p));

  it("strikes no price through, anywhere: no <s>, <del>, line-through, kh-offer__was or strike character", () => {
    expect(files.length).toBeGreaterThan(300);
    const problems = files.flatMap((path) => struckHits(path, readRepoFile(path)).map((h) => `${path}:${h.line} ${h.what}`));
    console.log(`[no-struck-price] scanned ${files.length} file(s) under src/.`);
    expect(problems, problems.join("\n")).toEqual([]);
  });
});
