import { describe, expect, it } from "vitest";
import { listFiles, readRepoFile } from "../e2e/support/repo";
import { jsxAttributes, parseSource, sourceStrings, stripCssComments } from "../e2e/support/source";
import { isStillLegacy } from "./legacy-paths";

/* mockup-markup (task 1.1; QA review N22, architecture §19).
 *
 * The approved mockup is the visual reference, not code to ship. Its own scaffolding must never
 * reach src/: the mk- classes (each mockup block is renamed ks- when it is ported, components §7),
 * the data-src attributes that mark where a value comes from, and the Gate A review tool (the
 * headline picker, review notes and "Rewritten in the build" labels). The rendered-HTML half of
 * this rule is test/e2e/content-integrity.spec.ts.
 */

type Hit = { line: number; what: string };

const MK_TOKEN = /(?:^|[\s.#"'`,(])(mk-[a-z0-9][\w-]*)/;
const REVIEW_ATTRS = /^data-(?:open-h1|close-h1|h1-list|h1-n|src)$/;
const REVIEW_TEXT = /Rewritten in the build|Gate A review|headline option/i;

function sourceHits(path: string, text: string): Hit[] {
  const hits: Hit[] = [];
  if (path.endsWith(".css")) {
    const css = stripCssComments(text);
    css.split("\n").forEach((line, i) => {
      const m = /\.(mk-[a-z0-9][\w-]*)/.exec(line);
      if (m) hits.push({ line: i + 1, what: `mockup class .${m[1]}` });
      if (/\[data-src\b/.test(line)) hits.push({ line: i + 1, what: "data-src selector" });
    });
    return hits;
  }
  const sf = parseSource(path, text);
  for (const s of sourceStrings(sf)) {
    const m = MK_TOKEN.exec(s.text);
    if (m && s.kind !== "jsx-text") hits.push({ line: s.line, what: `mockup class or id "${m[1]}"` });
    if (REVIEW_TEXT.test(s.text)) hits.push({ line: s.line, what: `review-tool text "${s.text.slice(0, 60)}"` });
  }
  for (const a of jsxAttributes(sf)) {
    if (REVIEW_ATTRS.test(a.name)) hits.push({ line: a.line, what: `mockup attribute ${a.name}` });
  }
  return hits;
}

describe("mockup-markup detector", () => {
  it.each([
    ["mk- class in JSX", `export const A = () => <p className="kh-body-s mk-price">x</p>;`],
    ["mk- class in clsx", `export const A = () => <p className={clsx("a", "mk-trust")} />;`],
    ["mk- id", `export const A = () => <div id="mk-h1" />;`],
    ["data-src attribute", `export const A = () => <span data-src="TOKEN_PRICE">x</span>;`],
    ["review-tool attribute", `export const A = () => <button data-open-h1>Headlines</button>;`],
    ["review label", `export const A = () => <span>Rewritten in the build</span>;`],
  ])("red on %s", (_n, text) => {
    expect(sourceHits("src/components/ui/X/X.tsx", text).length).toBeGreaterThan(0);
  });

  it("red on an mk- block in composition CSS", () => {
    expect(sourceHits("src/components/sections/X/x.css", ".mk-films { gap: var(--space-3); }").length).toBe(1);
  });

  it("green on ported ks- markup", () => {
    const ok = `export const A = () => <p className="kh-body-s ks-price" data-ph-capture-attribute-cta="hero">mk is not a class here</p>;`;
    expect(sourceHits("src/components/ui/X/X.tsx", ok)).toEqual([]);
    expect(sourceHits("src/components/ui/X/x.css", "/* was .mk-price */ .ks-price { margin: 0; }")).toEqual([]);
  });

  it("records: it finds the mockup's own scaffolding (control)", () => {
    const home = readRepoFile("mockup/home.html");
    expect(home).toMatch(/class="[^"]*\bmk-price\b/);
    expect(MK_TOKEN.test(' class="kh-body-s mk-price"')).toBe(true);
    expect(sourceHits("src/x.css", readRepoFile("mockup/mockup.css")).length).toBeGreaterThan(20);
  });
});

describe("mockup-markup: src/", () => {
  const all = listFiles(["src"])
    .filter((p) => /\.(tsx|ts|css)$/.test(p))
    .filter((p) => !/\.test\.tsx?$/.test(p));
  const legacy = all.filter((p) => isStillLegacy(p));
  const scanned = all.filter((p) => !legacy.includes(p));

  it("ships no mk- class, data-src attribute or review-tool markup", () => {
    const problems: string[] = [];
    for (const path of scanned) {
      for (const h of sourceHits(path, readRepoFile(path))) problems.push(`${path}:${h.line} ${h.what}`);
    }
    console.log(`[mockup-markup] scanned ${scanned.length} file(s); skipped ${legacy.length} unchanged legacy file(s).`);
    expect(problems, problems.join("\n")).toEqual([]);
  });
});
