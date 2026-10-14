import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { MRP_PRICE } from "@/config/site";
import type { Offer, OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../../test/e2e/support/page-checks";
import {
  CLAIM_FIXES,
  COPY_FIXES,
  PROOF_ADDITIONS,
  PROOF_ADDITIONS_APPROVED,
  PROOF_EXAMPLE_BUILD,
  PROOF_STEPS_BUILD,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
} from "../../../../../test/e2e/support/deviations";
import { findBanned } from "../../../../../test/guards/banned-phrases.data";
import { htmlToText } from "../../../../../test/e2e/support/mockup-text";
import { PAGE_FACTS } from "../../../../../test/e2e/support/page-facts";
import { sentences } from "../../../../../test/e2e/support/parity";
import { ROOT } from "../../../../../test/e2e/support/repo";
import { mockupRoute as mockupPageRoute } from "../../../../../test/e2e/support/routes";
import { mockupLinks, mockupPage, STORE, words } from "../../../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach, withFacts } from "../../../../../test/support/mockup-facts";
import { faqs } from "../../faqs";
import { filmQuotes, films } from "../../films";
import { recognitionStrip } from "../../recognition";
import { SAFETY_FACTS } from "../../trust";
import { kheeluPage } from "./page";
import { product } from "./product";

/*
 * The product page's content (task 5.2; structure §5 "meet-kheelu.html"; meet-kheelu.md): rendered by the template that
 * ships, it says and links exactly what the approved mockup's `main` says and links, fold by fold, in both offer modes.
 * The sections' own tests prove their markup against the same folds; this file proves the page's content feeds them
 * the approved words, addresses, names, reveals and tracking values, and the structured data the copy page asks for.
 * The mockup is compared with the founder's page facts applied (task 6.7; test/e2e/support/page-facts.ts): the parent
 * app's phones filled (D055 item 26), and the rows and lines still waiting on an F4 value hidden (D054 item 19); and
 * with task 7.1b's copy fixes (deviation V17; test/e2e/support/deviations.ts COPY_FIXES): the films heading without a
 * count (D056 item 2) and the sources line in Home's short form (CMO review A M6); then with task 8b.1's claim fixes
 * (deviation V27; CLAIM_FIXES["meet-kheelu"]; D058): Kheelona+ as D058 item 3 words it, the parent app as the live
 * team's code check found it (fold 5 without the four-skills report and its chips), the safety block, specs, Safety
 * tab and two answers in the code-checked words.
 */

const PATH = "/products/kheelu";
const TOKEN = buildOffer("token");
const FULL = buildOffer("full");

/** The page as the site shell holds it: the template's output in `main#main`. `main` is the page without the blocks
 *  task 8c.3 adds (PROOF_ADDITIONS; D061 item 4 and the main session's rulings: the parents' quotes, the recognition
 *  strip, the four steps and the example conversation), what must equal the approved page; `whole` is the page as it
 *  renders, on which those blocks are tested below. */
function rendered(offer: Offer) {
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(<PageTemplate page={kheeluPage} offer={offer} path={PATH} />)}</main></body></html>`;
  const whole = new DOMParser().parseFromString(html, "text/html");
  const doc = whole.cloneNode(true) as Document;
  for (const selector of PROOF_ADDITIONS["meet-kheelu"].selectors) for (const el of doc.querySelectorAll(selector)) el.remove();
  return { html, doc, main: doc.querySelector("main")!, whole: whole.querySelector("main")! };
}

const BUILT = rendered(TOKEN);
const APPROVED = mockupPage("meet-kheelu").querySelector("main")!;
/** The approved page with the founder's page facts (task 6.7) and task 7.1b's copy fixes applied, then task 8b.1's claim
 *  fixes in a pass of their own: what the build must say. */
const MOCKUP = withFacts(withFacts(APPROVED, [...PAGE_FACTS["meet-kheelu"].edits, ...COPY_FIXES["meet-kheelu"].edits]), CLAIM_FIXES["meet-kheelu"].edits);
/** The folds: `main`'s sections, in order (React's image preload links and the JSON-LD script left out). */
const folds = (main: Element) => [...main.children].filter((el) => el.tagName === "SECTION");
const name = (el: Element) => el.getAttribute("aria-labelledby");
/** An element's text, white space collapsed (the parsed document is not the test's own, so no DOM matchers here). */
const text = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** P15's default (deviations.md V6; task 4.7 item 4): the shared FAQ answer "What if it isn’t right for us, or stops
 *  working?" gives D033's remedy for a faulty Kheelu, as /refund does. The rule deviations.ts holds for it, and the one
 *  sentence it accepts on each side, read from the two pages' folds (exactly one each, so the rule is precise; the
 *  JSON-LD script is not a fold). */
const P15_RULE = TEXT_DEVIATIONS["meet-kheelu"].find((rule) => rule.approvedBy.startsWith("deviations.md V6"));
const only = (from: Element, pattern: RegExp | undefined) => {
  const found = folds(from).flatMap((fold) => sentences(text(fold))).filter((s) => pattern?.test(s));
  if (found.length !== 1) throw new Error(`P15: expected one sentence matching ${pattern}, found ${JSON.stringify(found)}`);
  return found[0];
};
const P15 = { mockup: only(MOCKUP, P15_RULE?.mockup), build: only(BUILT.main, P15_RULE?.build) };

describe("the product page's meta (meet-kheelu.md \"At a glance\")", () => {
  const plain = (mode: OfferMode) => ({
    title: toPlainText(kheeluPage.meta.title, buildOffer(mode)),
    description: toPlainText(kheeluPage.meta.description, buildOffer(mode)),
  });

  it("is the mockup's title and token-mode description, word for word", () => {
    const meta = mockupPageRoute("meet-kheelu");
    expect(plain("token")).toEqual({ title: meta.title, description: meta.description });
  });

  it("turns to the copy page's full-mode description once the first 500 are gone", () => {
    expect(plain("full").description).toBe(
      "Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to 7. ₹7,999 (incl. GST), delivery included.",
    );
  });

  it("shares the Kheelu card with the copy page's words, and passes pageMeta in both modes", () => {
    expect(kheeluPage.meta.og).toEqual({ image: "/og/kheelu.jpg", alt: "Kheelu, the cream plush rabbit that talks back" });
    expect(existsSync(join(ROOT, "public", kheeluPage.meta.og.image))).toBe(true);
    for (const offer of [TOKEN, FULL]) expect(() => pageMeta({ ...kheeluPage.meta, path: PATH, offer })).not.toThrow();
  });
});

describe("the product page as rendered (token mode)", () => {
  it("holds the mockup's nine folds, in order, each named by the mockup's heading", () => {
    expect(folds(BUILT.main).map(name)).toEqual(folds(MOCKUP).map(name));
    expect(folds(BUILT.main).map((f) => f.id)).toEqual(folds(MOCKUP).map((f) => f.id));
  });

  it("changes the approved page only where the founder's facts, task 7.1b's copy fixes and task 8b.1's claim fixes do", () => {
    const changed = folds(APPROVED).filter((fold, i) => words(fold) !== words(folds(MOCKUP)[i])).map(name);
    // Fold 2's heading and fold 8's sources line (V17, task 7.1b); fold 4's charging line and fold 7's details (V16); the
    // offer card, Good to know, fold 5, fold 6, fold 7 and two answers (V27, task 8b.1).
    expect(changed).toEqual(["films-title", "offer-title", "modes-title", "app-title", "safety-title", "specs-title", "faq-title"]);
    for (const hide of CLAIM_FIXES["meet-kheelu"].hidden.both) expect(BUILT.main.querySelectorAll(hide), hide).toHaveLength(1);
    const facts = withFacts(APPROVED, PAGE_FACTS["meet-kheelu"].edits);
    expect(folds(APPROVED).filter((fold, i) => words(fold) !== words(folds(facts)[i])).map(name)).toEqual(["modes-title", "specs-title"]);
  });

  it("titles the films without a count or a place under the films' count (D056 item 2, D057 item 2) and cites Harvard in Home's short form (CMO A M6; V17)", () => {
    const films = BUILT.main.querySelector("#films-title")!;
    expect(text(films.closest("header")!.querySelector(".kh-eyebrow"))).toBe(COPY_FIXES["meet-kheelu"].build[0]);
    expect(text(films)).toBe(COPY_FIXES["meet-kheelu"].build[1]);
    expect(films.querySelector(".kh-hand")?.textContent).toBe("real families.");
    expect(text(BUILT.main.querySelector("#src-1"))).toBe(COPY_FIXES["meet-kheelu"].build[3]);
    expect(BUILT.main.querySelector("#src-1 a")?.getAttribute("href")).toBe("https://developingchild.harvard.edu/key-concept/serve-and-return/");
  });

  it("says, fold by fold, exactly what the mockup says with the founder's facts and the copy fixes applied, P15's one sentence aside (V6)", () => {
    const built = folds(BUILT.main);
    // The one accepted difference is in the questions fold, and it is there in the mockup to be replaced (not vacuous).
    expect(folds(MOCKUP).filter((fold) => words(fold).includes(P15.mockup)).map(name)).toEqual(["faq-title"]);
    folds(MOCKUP).forEach((fold, i) => expect(words(built[i]), name(fold) ?? `fold ${i + 1}`).toBe(words(fold).replace(P15.mockup, P15.build)));
  });

  it("links every address the mockup links, in the same order (the store as this build's store)", () => {
    const hrefs = (root: Element) => [...root.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")!);
    // mockupLinks: the mockup's addresses as routes, each trust link with its part of the terms page (task 7.1a, m8).
    expect(hrefs(BUILT.main)).toEqual(mockupLinks(MOCKUP));
    expect(hrefs(BUILT.main).filter((h) => h === STORE)).toHaveLength(4);
  });

  it("carries the mockup's CTA values, in order (architecture §8.3; meet-kheelu.md \"CTA tracking values\")", () => {
    const values = (root: Element) => [...root.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"));
    expect(values(BUILT.main)).toEqual(values(MOCKUP));
    expect(values(BUILT.main)).toEqual(["product-top", "product-offer", "product-safety", "product-safety-learn", "product-foot"]);
  });

  it("names what the mockup names: regions, lists, boards, buttons and markers (aria-label), in order", () => {
    const labels = (root: Element) => [...root.querySelectorAll("[aria-label]")].map((el) => el.getAttribute("aria-label"));
    expect(labels(BUILT.main)).toEqual(labels(MOCKUP));
  });

  it("describes every picture as the mockup does (alt text), decorative layers left empty", () => {
    // A doodle below the first screen is the inline SVG that draws itself (D049 pick 3), hidden from the tree as the
    // mockup's <img alt=""> is: both count as one decorative picture, in document order.
    const alts = (root: Element) =>
      [...root.querySelectorAll("img, svg.ks-doodle[data-draw]")].map((el) => (el.tagName === "IMG" ? el.getAttribute("alt") : el.getAttribute("aria-hidden") === "true" ? "" : "named svg"));
    expect(alts(BUILT.main)).toEqual(alts(MOCKUP));
  });

  it("draws every icon the mockup draws, in order: the same DS glyph each time", () => {
    // The facts line's icons come from trust.ts typed as content (IconRef) and reach the section by a type assertion,
    // and the close swaps the delivery item's icon (wave-3 close), so the glyphs themselves are compared here.
    const glyphs = (root: Element) => [...root.querySelectorAll("svg.kh-icon")].map((svg) => [...svg.querySelectorAll("path")].map((p) => p.getAttribute("d")).join(" "));
    expect(glyphs(BUILT.main)).toEqual(glyphs(MOCKUP));
    expect(glyphs(BUILT.main).length).toBeGreaterThan(20);
  });

  it("reveals exactly the blocks the mockup reveals, and never the money (SPA 9)", () => {
    const reveals = (root: Element) => folds(root).map((f) => f.querySelectorAll("[data-reveal]").length);
    expect(reveals(BUILT.main)).toEqual(reveals(MOCKUP));
    expect(revealOnMoneyInDocument(BUILT.doc)).toEqual([]);
  });

  it("keeps every fragment the mockup has, plus the two the old page carried (#story-mode, #reserve; url-map §5a)", () => {
    const ids = (root: Element) => [...root.querySelectorAll("[id]")].map((el) => el.id);
    const built = ids(BUILT.main);
    for (const id of ids(MOCKUP)) expect(built, id).toContain(id);
    for (const id of ["faq", "story-mode", "reserve", "offer", "specs", "films", "modes", "app", "safety", "close"]) {
      expect(BUILT.main.querySelectorAll(`[id="${id}"]`), id).toHaveLength(1);
    }
    expect(text(BUILT.main.querySelector("#story-mode"))).toBe("Story mode");
    expect(BUILT.main.querySelector("#reserve")?.getAttribute("data-ph-capture-attribute-cta")).toBe("product-foot");
  });

  it("shows the phone buy bar from first paint: the hero's button carries no id for the bar to watch", () => {
    const hero = folds(BUILT.main)[0];
    expect(hero.querySelector(".kh-btn--cta")?.hasAttribute("id")).toBe(false);
    expect(BUILT.main.querySelector("#hero-cta")).toBeNull();
  });

  it("keeps the hero's doodle still and lets the close's doodle draw (D049 picks 2 and 3)", () => {
    const [hero] = folds(BUILT.main);
    const close = BUILT.main.querySelector("#close")!;
    expect(hero.querySelector("[data-draw]")).toBeNull();
    expect(close.querySelectorAll(".ks-doodle[data-draw]")).toHaveLength(1);
  });

  it("puts the details on tabs named \"Product details\", every panel's words in the HTML (3.5; P1)", () => {
    const specs = BUILT.main.querySelector("#specs")!;
    expect(specs.querySelector('[role="tablist"]')?.getAttribute("aria-label")).toBe("Product details");
    for (const id of ["panel-specs", "panel-box", "panel-safety", "tab-specs", "tab-box", "tab-safety"]) expect(specs.querySelector(`#${id}`), id).not.toBeNull();
    expect(words(specs.querySelector("#panel-box")!)).toBe(["In the box", ...product.box.map((b) => b.text)].join(" "));
  });

  it("declares the MRP from the checkout's own constant, labelled exactly \"MRP\" (D034)", () => {
    for (const offer of [TOKEN, FULL]) {
      const declarations = rendered(offer).main.querySelector("#specs .ks-declare")!;
      expect(words(declarations.querySelector("dl > div")!)).toBe(`MRP ${MRP_PRICE} (incl. of all taxes)`);
    }
  });

  it("draws the close's \"Delivery included anywhere in India\" with the map pin, as the mockup does (wave-3 close)", () => {
    const item = [...BUILT.main.querySelectorAll("#close .kh-trustline li")].find((li) => li.textContent === "Delivery included anywhere in India")!;
    expect(item.querySelector("path")?.getAttribute("d")).toBe(ICON_PATHS["map-pin"]);
  });

  it("shows the D025 line under the questions, without opening an answer", () => {
    expect(text(BUILT.main.querySelector("#faq .ks-faq__disclaimer"))).toBe(
      "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.",
    );
  });

  it("loads every film poster lazily: the hero board is the page's one eager picture (N19)", () => {
    const posters = [...BUILT.main.querySelectorAll("#films img")];
    expect(posters).toHaveLength(films.length);
    for (const poster of posters) expect(poster.getAttribute("loading")).toBe("lazy");
  });
});

describe("the product page in full mode", () => {
  const { main } = rendered(FULL);

  it("prints the full-mode price sentence beside every chilli button and drops the split", () => {
    expect([...main.querySelectorAll(".ks-price")].map((p) => p.textContent)).toEqual(
      Array(3).fill("₹7,999 (incl. GST), paid in full when you order."),
    );
    expect(main.querySelector(".kh-offer__split")).toBeNull();
  });

  it("asks and answers the price question in its full-mode words (meet-kheelu.md fold 8)", () => {
    expect(text(main.querySelector("#faq"))).toContain(toPlainText(faqs["cost-and-advance"].question, FULL));
    expect(text(main.querySelector("#faq"))).toContain(toPlainText(faqs["cost-and-advance"].answer, FULL));
  });
});

describe("the product page's structured data (architecture §9.2)", () => {
  type Node = Record<string, unknown> & { "@type": string };
  const graph = (offer: Offer) => {
    const { html } = rendered(offer);
    const [block] = jsonLdBlocks(html) as { "@graph": Node[] }[];
    return { html, nodes: block["@graph"] };
  };

  it.each([
    ["token", TOKEN],
    ["full", FULL],
  ] as const)("is the Product with its Offer, then the FAQPage of the eight questions and answers exactly as shown (%s mode)", (_mode, offer) => {
    const { nodes } = graph(offer);
    expect(nodes.map((n) => n["@type"])).toEqual(["Product", "FAQPage"]);
    const entities = nodes[1].mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    const shown = [...rendered(offer).main.querySelectorAll("#faq .kh-faq__item")];
    expect(entities).toHaveLength(8);
    expect(entities.map((q) => q.name)).toEqual(shown.map((item) => text(item.querySelector(".kh-faq__q"))));
    expect(entities.map((q) => q.acceptedAnswer.text)).toEqual(shown.map((item) => text(item.querySelector(".kh-faq__a"))));
  });

  it("keeps the Product's identity: the old @id, the name, the former name, the brand, ages 3 to 7", () => {
    const [p] = graph(TOKEN).nodes;
    expect(p).toMatchObject({
      "@id": "https://kheelona.com/products/lumi#product",
      name: "Kheelu by Kheelona",
      alternateName: "Lumi",
      brand: { "@type": "Brand", name: "Kheelona" },
      url: "https://kheelona.com/products/kheelu",
      image: ["https://kheelona.com/media/kheelu-front.jpg"],
      audience: { "@type": "PeopleAudience", suggestedMinAge: 3, suggestedMaxAge: 7 },
    });
    // Only the announced specs: the F4 rows are hidden (D054 item 19), and the parent app's row is filled (D055 item 26).
    const properties = (p.additionalProperty as { name: string; value: string }[]).map((x) => x.name);
    expect(properties).toEqual(product.specs.map((row) => row.term));
    expect(properties).toContain("Ages");
    expect(properties).not.toContain("Size and weight");
    expect((p.additionalProperty as { name: string; value: string }[]).find((x) => x.name === "Parent app")?.value).toMatch(/ On iPhone and Android\.$/);
  });

  it.each([
    ["token", TOKEN, 4999],
    ["full", FULL, 7999],
  ] as const)("offers it at the headline the page shows (%s mode), leading with that amount (D028)", (_mode, offer, price) => {
    const { html, nodes } = graph(offer);
    const offers = nodes[0].offers as Record<string, unknown>;
    expect(offers).toMatchObject({
      price,
      priceCurrency: "INR",
      availability: "https://schema.org/PreOrder",
      availabilityStarts: "2026-11-15",
      hasMerchantReturnPolicy: { merchantReturnDays: 7, returnFees: "https://schema.org/FreeReturn", refundType: "https://schema.org/FullRefund" },
      shippingDetails: { shippingRate: { value: 0, currency: "INR" }, shippingDestination: { addressCountry: "IN" } },
      warranty: { durationOfWarranty: { value: 6, unitCode: "MON" } },
    });
    expect(offers).not.toHaveProperty("priceValidUntil");
    expect(String(offers.description).match(/₹[\d,]+/)?.[0]).toBe(offer.prices.headline);
    expect(String(nodes[0].description)).not.toMatch(/₹/);
    // The shared detector (jsonld-matches-page): every answer, price and policy number is on the page, FAQ 8's
    // "skills.[1] Kheelu" included (its `norm` drops the space htmlToText puts before an inline marker; task 4.6).
    expect(jsonLdMismatches(html)).toEqual([]);
  });
});

describe("the module's imports (structure §6, wave-4 close: page modules import types only from layouts and components)", () => {
  /** Every import of page.ts from components or layouts: its source and whether it is `import type`. */
  const sharedImports = () =>
    [...readFileSync(join(ROOT, "src/content/en-IN/products/kheelu/page.ts"), "utf8").matchAll(/^import\s+(type\s+)?[^;]*?from\s+"([^"]+)";/gm)]
      .filter((m) => /^@\/(components|layouts)\//.test(m[2]))
      .map((m) => ({ from: m[2], typeOnly: Boolean(m[1]) }));

  it("takes only types from components and layouts, never a value", () => {
    expect(sharedImports().length).toBeGreaterThan(0);
    expect(sharedImports().filter((i) => !i.typeOnly)).toEqual([]);
  });
});

describe("the shared facts it passes on (trust.ts)", () => {
  it("hands the safety fold exactly trust.ts's three facts, each a DS icon (trust.test.ts guards the list itself)", () => {
    const safety = kheeluPage.sections.find((s) => s.kind === "trust-section")!;
    expect(safety.config.variant === "safety" && safety.config.facts).toEqual(SAFETY_FACTS);
    for (const { icon } of SAFETY_FACTS) expect(Object.keys(ICON_PATHS)).toContain(icon);
  });
});

describe("the founder's page facts as a text deviation (deviations.md V16; task 6.7)", () => {
  const FACTS = PAGE_FACTS["meet-kheelu"];
  const rule = TEXT_DEVIATIONS["meet-kheelu"].find((r) => r.approvedBy === FACTS.approvedBy)!;

  it("lists exactly the sentences the facts change (page-facts.ts against the mockup)", () => {
    expect(factSentences(APPROVED, FACTS.edits)).toEqual({ missing: [...FACTS.mockup], extra: [...FACTS.build] });
  });

  it("excuses and accepts exactly those sentences, and no other line of the page", () => {
    expect(ruleReach(APPROVED, FACTS.edits, rule)).toEqual({ excused: [...FACTS.mockup], accepted: [...FACTS.build] });
  });

  it("accepts the parent app's line as the page prints it", () => {
    expect(sentences(htmlToText(BUILT.html))).toContain(FACTS.build[0]);
  });

  it("hides for the pixels exactly the blocks the facts change, each found once on its side (VISUAL_HIDDEN)", () => {
    expect(hiddenProblems(APPROVED, FACTS)).toEqual([]);
    const sel = (side: string) => VISUAL_HIDDEN["meet-kheelu"].filter((r) => r.side === side && r.approvedBy === FACTS.approvedBy).map((r) => r.selector);
    expect(sel("mockup")).toEqual([...FACTS.hidden.both, ...FACTS.hidden.mockup]);
    expect(sel("build")).toEqual([...FACTS.hidden.both, ...FACTS.hidden.build]);
    // The build side's selectors hold on the page as it renders, too.
    for (const selector of sel("build")) expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(1);
  });

  it("leaves beside them only the films heading and the sources line of the copy fixes (V17), then the claim fixes' blocks (V27), each found once on the page as it renders, then task 8c.3's added blocks", () => {
    const claims = CLAIM_FIXES["meet-kheelu"];
    const others = VISUAL_HIDDEN["meet-kheelu"].filter((r) => r.approvedBy !== FACTS.approvedBy);
    expect(others.map((r) => [r.side, r.selector, r.approvedBy])).toEqual([
      ...(["mockup", "build"] as const).flatMap((side) => ["#films-title", "#src-1"].map((selector) => [side, selector, COPY_FIXES["meet-kheelu"].approvedBy])),
      ...(["mockup", "build"] as const).flatMap((side) => claims.hidden.both.map((selector) => [side, selector, claims.approvedBy])),
      ...PROOF_ADDITIONS["meet-kheelu"].selectors.map((selector) => ["build", selector, PROOF_ADDITIONS_APPROVED]),
    ]);
    for (const selector of claims.hidden.both) expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(1);
    expect(BUILT.main.querySelectorAll("#films-title")).toHaveLength(1);
    expect(BUILT.main.querySelectorAll("#src-1")).toHaveLength(1);
  });
});

describe("the JavaScript-off text deviation for this route (deviations.md V3; test/e2e/support/deviations.ts)", () => {
  const DEVIATIONS = "../../../../../test/e2e/support/deviations";
  /** The sentences of the details panels that the tabs hide with JavaScript on: In the box and Safety. */
  const stacked = (p: typeof product) => [...p.box, ...p.safety].flatMap(({ text }) => sentences(toPlainText(text)));

  afterEach(() => {
    vi.doUnmock("./product");
    vi.resetModules();
  });

  it("is one rule, for the JavaScript-off run only (with JavaScript on the build's tabs hide what the mockup's hide)", () => {
    expect(TEXT_DEVIATIONS["meet-kheelu"].filter((rule) => rule.approvedBy.includes("V3"))).toEqual([
      expect.objectContaining({ mockup: /^Specs$/, jsOff: true }),
    ]);
    // The route's other rules are P15's (V6, task 4.7), the founder's page facts (V16, task 6.7), task 7.1b's copy fixes
    // (V17), task 8c.3's added blocks and task 8b.1's claim fixes (V27, last), for both runs: the FAQ answer, the details,
    // the heading, the sources, the added blocks and D058's lines read the same with JavaScript off.
    expect(TEXT_DEVIATIONS["meet-kheelu"].map((rule) => [rule.approvedBy.slice(0, "deviations.md V3".length), rule.jsOff ?? false])).toEqual([
      ["deviations.md V3", true],
      ["deviations.md V6", false],
      ["deviations.md V1", false],
      ["deviations.md V1", false],
      [PROOF_ADDITIONS_APPROVED.slice(0, "deviations.md V3".length), false],
      ["deviations.md V2", false],
    ]);
    expect(TEXT_DEVIATIONS["meet-kheelu"][2].approvedBy).toBe(PAGE_FACTS["meet-kheelu"].approvedBy);
    expect(TEXT_DEVIATIONS["meet-kheelu"][3].approvedBy).toBe(COPY_FIXES["meet-kheelu"].approvedBy);
    expect(TEXT_DEVIATIONS["meet-kheelu"][4].approvedBy).toBe(PROOF_ADDITIONS_APPROVED);
    expect(TEXT_DEVIATIONS["meet-kheelu"][5].approvedBy).toBe(CLAIM_FIXES["meet-kheelu"].approvedBy);
  });

  it("accepts on the build side exactly the stacked panels' lines, as the page prints them, and no other line of the page", () => {
    const [rule] = TEXT_DEVIATIONS["meet-kheelu"];
    const page = new Set(sentences(htmlToText(BUILT.html)));
    expect([...page].filter((s) => rule.build!.test(s)).sort()).toEqual([...new Set(stacked(product))].sort());
  });

  it("reads those lines from product.ts, so it still holds once the founder fills an F4 placeholder", async () => {
    vi.resetModules();
    vi.doMock("./product", async (importOriginal) => {
      const real = await importOriginal<typeof import("./product")>();
      // A filled F4 value brings its line back (D054 item 19: hidden only while it waits).
      const safety = [...real.product.safety, { icon: "battery-charging", text: "Battery safety: a filled-in fact." }];
      return { ...real, product: { ...real.product, safety } };
    });
    const [rule] = (await import(DEVIATIONS)).TEXT_DEVIATIONS["meet-kheelu"] as typeof TEXT_DEVIATIONS[string];
    expect(rule.build!.test("Battery safety: a filled-in fact.")).toBe(true);
    expect(rule.build!.test("Battery safety: [PLACEHOLDER F4: battery safety certification]")).toBe(false);
  });
});

/* Task 8c.3 (D061 item 4 and the main session's rulings, 2026-10-15): parents' own words under the films, the "Recognised
 * by." strip after them, and, just before "How it works", four plain steps and the labelled example conversation. The
 * approved page has none of them, so the tests above compare the page without them (PROOF_ADDITIONS), and these hold the
 * blocks themselves on the page as it renders. */
describe("the product page's added blocks (task 8c.3)", () => {
  const WHOLE = BUILT.whole;
  const fold = (label: string) => folds(WHOLE).find((f) => name(f) === label)!;
  /** Straight quotes and apostrophes, for comparing the site's typography with the copy page's plain text. */
  const plainQuotes = (s: string) => s.replace(/[“”]/g, '"').replace(/’/g, "'");
  /** home.md fold 2 variant b's copy block, line by line: the heading, the label, each speaker and their words, the line after. */
  const variantB = () => {
    const md = readFileSync(join(ROOT, "wiki/site/pages/home.md"), "utf8");
    const start = md.indexOf("### Variant (b): without the films");
    const block = md.slice(md.indexOf("**Copy:**", start), md.indexOf("- **H2 accent:**", start));
    return block
      .split("\n")
      .filter((l) => l.startsWith("> ") && l.trim() !== ">")
      .map((l) => l.slice(2).trim())
      .flatMap((l) => {
        const said = /^\*\*(.+?):\*\* (.+)$/.exec(l);
        if (said) return said[1] === "H2" ? [said[2]] : [said[1], said[2]];
        return [l.replace(/^\*(.+)\*$/, "$1")];
      });
  };

  it("orders the page at every width: hero, films with the quotes, the strip, the offer, the steps and the example, then the rest", () => {
    expect(folds(WHOLE).map(name)).toEqual([
      "hero-title",
      "films-title",
      "recognised-title",
      "offer-title",
      "steps-title",
      "example-title",
      "modes-title",
      "app-title",
      "safety-title",
      "specs-title",
      "faq-title",
      "close-title",
    ]);
    expect(fold("films-title").querySelector(".ks-films-ctrl + .ks-film-quotes")).not.toBeNull();
  });

  it("prints the parents' quotes under the films, each button playing its film; every poster still lazy, no film before a tap", () => {
    const quotes = fold("films-title").querySelector(".ks-film-quotes")!;
    expect([...quotes.querySelectorAll("blockquote")].map((q) => q.textContent)).toEqual(filmQuotes.items.map((q) => q.quote));
    expect([...quotes.querySelectorAll("button")].map((b) => b.getAttribute("aria-label"))).toEqual(
      filmQuotes.items.map((q) => `${filmQuotes.watch}: ${films.find((f) => f.id === q.film)!.chip}`),
    );
    expect([...fold("films-title").querySelectorAll("img")].every((img) => img.getAttribute("loading") === "lazy")).toBe(true);
    expect(WHOLE.querySelector("video")).toBeNull();
  });

  it("shows the team's strip as built, after the films and before the offer, its marks lazy", () => {
    const strip = fold("recognised-title");
    expect(text(strip.querySelector("h2"))).toBe(recognitionStrip.title);
    expect(strip.querySelectorAll(".ks-recognition__item")).toHaveLength(recognitionStrip.items.length);
    expect([...strip.querySelectorAll("img")].map((img) => img.getAttribute("loading"))).toEqual(["lazy", "lazy", "lazy"]);
  });

  it("states the four steps in the plan's words (D018, D017, D036: \"remembers\" beside reading every conversation)", () => {
    const steps = fold("steps-title");
    expect(steps.className).toBe("kh-section kh-section--band");
    expect(steps.querySelector("ol.kh-steps.ks-steps--four")).not.toBeNull();
    expect([...steps.querySelectorAll("#steps-title .kh-hand")].map((s) => s.textContent)).toEqual(["presses it."]);
    const shown = [text(steps.querySelector("#steps-title")), ...[...steps.querySelectorAll(".kh-step")].flatMap((s) => [text(s.querySelector(".kh-step__title")), text(s.querySelector(".kh-step__body"))])];
    expect(shown).toEqual([...PROOF_STEPS_BUILD]);
    expect(steps.querySelector("[data-reveal]")).toBeNull();
  });

  it("shows the example conversation word for word as home.md fold 2 variant b, the label above the exchange", () => {
    const example = fold("example-title");
    expect(example.className).toBe("kh-section");
    expect([...example.querySelectorAll("#example-title .kh-hand")].map((s) => s.textContent)).toEqual(["asking back"]);
    const shown = [
      text(example.querySelector("#example-title")),
      text(example.querySelector(".ks-exchange__note")),
      ...[...example.querySelectorAll(".ks-exchange__line")].flatMap((li) => [text(li.querySelector(".ks-exchange__who")), text(li).slice(text(li.querySelector(".ks-exchange__who")).length)]),
      text(example.querySelector(".ks-exchange__after")),
    ];
    expect(shown).toEqual([...PROOF_EXAMPLE_BUILD]);
    expect(PROOF_EXAMPLE_BUILD.map(plainQuotes)).toEqual(variantB());
    // The label names the exchange; no doodle and no picture in the fold (the page's HTML budget, task 8c.3).
    expect(example.querySelector(`ol[aria-labelledby="${example.querySelector(".ks-exchange__note")?.id}"]`)).not.toBeNull();
    expect(example.querySelector("img, svg.ks-doodle, [data-reveal]")).toBeNull();
  });

  it("keeps the page's tracking values, the offer card's fragment and its one h1", () => {
    const values = (root: Element) => [...root.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"));
    expect(values(WHOLE)).toEqual(values(BUILT.main));
    expect(WHOLE.querySelectorAll("#offer")).toHaveLength(1);
    expect(WHOLE.querySelectorAll("h1")).toHaveLength(1);
    expect(revealOnMoneyInDocument(BUILT.whole.ownerDocument)).toEqual([]);
  });

  it("hides for the pixels exactly the added blocks, each found once on the page and gone from the page compared", () => {
    for (const selector of PROOF_ADDITIONS["meet-kheelu"].selectors) {
      expect(WHOLE.querySelectorAll(selector), selector).toHaveLength(1);
      expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(0);
    }
  });

  it("accepts in the text pass every added line as the page prints it, and excuses no approved line", () => {
    const rule = TEXT_DEVIATIONS["meet-kheelu"].find((r) => r.approvedBy === PROOF_ADDITIONS_APPROVED)!;
    const added = PROOF_ADDITIONS["meet-kheelu"].selectors.flatMap((selector) => [...WHOLE.querySelectorAll(selector)]);
    // Every line the rule accepts, split as the text pass splits a page's lines into sentences.
    for (const line of PROOF_ADDITIONS["meet-kheelu"].build) for (const s of sentences(line)) expect(rule.build!.test(s), s).toBe(true);
    // And those lines are every word the added blocks print, in order (the browser's text pass gives the who labels and
    // the steps' numerals lines of their own; the NVIDIA and nasscom marks carry their names as alt text).
    const squash = (s: string) => s.replace(/\s/g, "");
    const lines = [
      ...filmQuotes.items.flatMap((q) => [q.quote, q.name, q.role, filmQuotes.watch]),
      "Recognised by.",
      "Karnataka Elevate",
      "Founders Inc",
      PROOF_STEPS_BUILD[0],
      ...PROOF_STEPS_BUILD.slice(1).flatMap((line, i) => (i % 2 === 0 ? [String(i / 2 + 1), line] : [line])),
      ...PROOF_EXAMPLE_BUILD,
    ];
    expect(squash(added.map((block) => block.textContent ?? "").join(""))).toBe(squash(lines.join("")));
    expect(lines.every((line) => PROOF_ADDITIONS["meet-kheelu"].build.includes(line as never))).toBe(true);
    for (const line of sentences(words(MOCKUP))) expect(rule.mockup.test(line), line).toBe(false);
  });

  it("passes the claims guard on every added line, and says nothing of an age under 3", () => {
    for (const line of PROOF_ADDITIONS["meet-kheelu"].build) {
      expect(findBanned(line), line).toEqual([]);
      expect(line).not.toMatch(/\b[0-2]\s*(?:years?|yrs?|months?)\b|toddler|baby|babies/i);
    }
  });
});
