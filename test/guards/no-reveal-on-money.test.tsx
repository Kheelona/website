import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { MOCKUP_SLUGS } from "../e2e/support/mockup-text";
import { freshBuiltPages, isNewDesignHtml, revealOnMoneyInDocument } from "../e2e/support/page-checks";
import { listFiles, readRepoFile } from "../e2e/support/repo";
import { parseSource } from "../e2e/support/source";
import { isStillLegacy } from "./legacy-paths";

/* no-reveal-on-money (task 1.1; architecture §11.2 "never animated", D049 picks 1A and 2A, SPA 9).
 *
 * Nothing that sells moves on arrival: the first section, any h1, the price sentence, any chilli
 * button, the offer card and the store form never sit inside a [data-reveal] block, and no doodle
 * draws in the first section (hero doodles stay still). Three layers:
 *   1. the DOM rule, on rendered fixtures (red and green) and on all 18 approved mockup pages,
 *      which follow it (so the rule never contradicts the approval);
 *   2. the source rule: no JSX element with data-reveal wraps a money element or component;
 *   3. the prerendered pages of the last build, when newer than src/ (verify:e2e builds first;
 *      test/e2e/motion.spec.ts checks the served pages too).
 */

const MONEY_COMPONENTS = /^(?:PreorderButton|PriceSentence|OfferCard|OfferSection|CtaBlock|HeroSection|StickyBuyBar|PreorderForm|OrderSummary)$/;
const MONEY_CLASSES = /\b(?:kh-btn--cta|ks-price|kh-offer)\b/;

function sourceViolations(path: string, text: string): string[] {
  const sf = parseSource(path, text);
  const out: string[] = [];
  const hasReveal = (n: ts.JsxOpeningLikeElement) =>
    n.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText(sf) === "data-reveal");
  const isMoney = (n: ts.JsxOpeningLikeElement) => {
    const tag = n.tagName.getText(sf);
    if (tag === "h1" || MONEY_COMPONENTS.test(tag)) return true;
    return n.attributes.properties.some(
      (a) => ts.isJsxAttribute(a) && a.name.getText(sf) === "className" && MONEY_CLASSES.test(a.initializer?.getText(sf) ?? ""),
    );
  };
  const visit = (n: ts.Node, revealed: string | null) => {
    let inside = revealed;
    if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)) {
      const open = ts.isJsxElement(n) ? n.openingElement : n;
      const line = sf.getLineAndCharacterOfPosition(open.getStart(sf)).line + 1;
      if (inside === null && hasReveal(open)) inside = `${open.tagName.getText(sf)} (line ${line})`;
      if (inside !== null && isMoney(open)) out.push(`${path}:${line} <${open.tagName.getText(sf)}> inside data-reveal ${inside}`);
    }
    ts.forEachChild(n, (c) => visit(c, inside));
  };
  visit(sf, null);
  return out;
}

describe("no-reveal-on-money: the DOM rule", () => {
  const check = (ui: React.ReactElement) => revealOnMoneyInDocument(render(ui).container);

  it("is red on a revealed first section, a revealed CTA, price, h1 or offer card, and a drawing hero doodle", () => {
    expect(check(<main><section data-reveal><h1>Hi</h1></section></main>)).not.toEqual([]);
    expect(
      check(
        <main>
          <section><h1>Hi</h1></section>
          <section data-reveal><a className="kh-btn kh-btn--cta">Pre-order Kheelu</a></section>
        </main>,
      ),
    ).not.toEqual([]);
    expect(check(<main><section /><div data-reveal><p className="kh-body-s ks-price">₹499 today</p></div></main>)).not.toEqual([]);
    expect(check(<main><section /><div data-reveal><div className="kh-offer" /></div></main>)).not.toEqual([]);
    expect(check(<main><section><svg className="ks-doodle" data-draw="" /></section></main>)).not.toEqual([]);
  });

  it("is green on reveals below the first section that hold no money", () => {
    expect(
      check(
        <main>
          <section><h1>Hi</h1><a className="kh-btn kh-btn--cta">Pre-order Kheelu</a></section>
          <section data-reveal><h2>Why it matters</h2><svg className="ks-doodle" data-draw="" /></section>
        </main>,
      ),
    ).toEqual([]);
  });

  it.each(MOCKUP_SLUGS)("holds on the approved mockup: %s", (slug) => {
    const doc = new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
    expect(revealOnMoneyInDocument(doc)).toEqual([]);
  });

  it("sees the mockup's reveals at all (control)", () => {
    const reveals = MOCKUP_SLUGS.reduce(
      (n, slug) => n + new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html").querySelectorAll("[data-reveal]").length,
      0,
    );
    expect(reveals).toBeGreaterThan(20);
  });
});

describe("no-reveal-on-money: the source rule", () => {
  it("is red on a revealed money component and green on a revealed heading", () => {
    expect(sourceViolations("x.tsx", `export const A = () => <section data-reveal><div><PreorderButton cta="safety" /></div></section>;`)).toHaveLength(1);
    expect(sourceViolations("x.tsx", `export const A = () => <div data-reveal><p className="kh-body-s ks-price">x</p></div>;`)).toHaveLength(1);
    expect(sourceViolations("x.tsx", `export const A = () => <section data-reveal><h2>Why</h2></section>;`)).toEqual([]);
  });

  it("holds in src/", () => {
    const files = listFiles(["src"]).filter((p) => p.endsWith(".tsx") && !/\.(test|stories)\.tsx$/.test(p) && !isStillLegacy(p));
    const problems = files.flatMap((p) => sourceViolations(p, readRepoFile(p)));
    expect(problems, problems.join("\n")).toEqual([]);
  });
});

const built = freshBuiltPages();
describe.skipIf(built === null)("no-reveal-on-money: prerendered pages of the last build", () => {
  it("holds on every new-design page", () => {
    const problems: string[] = [];
    for (const p of built ?? []) {
      const html = readFileSync(p.file, "utf8");
      if (!isNewDesignHtml(html)) continue;
      const doc = new DOMParser().parseFromString(html, "text/html");
      problems.push(...revealOnMoneyInDocument(doc).map((m) => `${p.route}: ${m}`));
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
});
