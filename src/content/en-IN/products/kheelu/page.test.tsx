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
import { TEXT_DEVIATIONS, VISUAL_HIDDEN } from "../../../../../test/e2e/support/deviations";
import { htmlToText } from "../../../../../test/e2e/support/mockup-text";
import { PAGE_FACTS } from "../../../../../test/e2e/support/page-facts";
import { sentences } from "../../../../../test/e2e/support/parity";
import { ROOT } from "../../../../../test/e2e/support/repo";
import { mockupRoute as mockupPageRoute } from "../../../../../test/e2e/support/routes";
import { mockupPage, mockupRoute, STORE, words } from "../../../../../test/support/mockup-compare";
import { factSentences, hiddenProblems, ruleReach, withFacts } from "../../../../../test/support/mockup-facts";
import { faqs } from "../../faqs";
import { films } from "../../films";
import { SAFETY_FACTS } from "../../trust";
import { kheeluPage } from "./page";
import { product } from "./product";

/*
 * The product page's content (task 5.2; structure §5 "meet-kheelu.html"; meet-kheelu.md): rendered by the template that
 * ships, it says and links exactly what the approved mockup's `main` says and links, fold by fold, in both offer modes.
 * The sections' own tests prove their markup against the same folds; this file proves the page's content feeds them
 * the approved words, addresses, names, reveals and tracking values, and the structured data the copy page asks for.
 * The mockup is compared with the founder's page facts applied (task 6.7; test/e2e/support/page-facts.ts): the parent
 * app's phones filled (D055 item 26), and the rows and lines still waiting on an F4 value hidden (D054 item 19).
 */

const PATH = "/products/kheelu";
const TOKEN = buildOffer("token");
const FULL = buildOffer("full");

/** The page as the site shell holds it: the template's output in `main#main`. */
function rendered(offer: Offer) {
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(<PageTemplate page={kheeluPage} offer={offer} path={PATH} />)}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { html, doc, main: doc.querySelector("main")! };
}

const BUILT = rendered(TOKEN);
const APPROVED = mockupPage("meet-kheelu").querySelector("main")!;
/** The approved page with the founder's page facts applied: what the build must say (task 6.7). */
const MOCKUP = withFacts(APPROVED, PAGE_FACTS["meet-kheelu"].edits);
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

  it("changes the approved page only where the founder's facts do: fold 4's charging line and fold 7's details", () => {
    const changed = folds(APPROVED).filter((fold, i) => words(fold) !== words(folds(MOCKUP)[i])).map(name);
    expect(changed).toEqual(["modes-title", "specs-title"]);
  });

  it("says, fold by fold, exactly what the mockup says with the founder's facts applied, P15's one sentence aside (V6)", () => {
    const built = folds(BUILT.main);
    // The one accepted difference is in the questions fold, and it is there in the mockup to be replaced (not vacuous).
    expect(folds(MOCKUP).filter((fold) => words(fold).includes(P15.mockup)).map(name)).toEqual(["faq-title"]);
    folds(MOCKUP).forEach((fold, i) => expect(words(built[i]), name(fold) ?? `fold ${i + 1}`).toBe(words(fold).replace(P15.mockup, P15.build)));
  });

  it("links every address the mockup links, in the same order (the store as this build's store)", () => {
    const hrefs = (root: Element, read: (href: string) => string) => [...root.querySelectorAll("a[href]")].map((a) => read(a.getAttribute("href")!));
    expect(hrefs(BUILT.main, (h) => h)).toEqual(hrefs(MOCKUP, mockupRoute));
    expect(hrefs(BUILT.main, (h) => h).filter((h) => h === STORE)).toHaveLength(4);
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
    const sel = (side: string) => VISUAL_HIDDEN["meet-kheelu"].filter((r) => r.side === side).map((r) => r.selector);
    expect(sel("mockup")).toEqual([...FACTS.hidden.both, ...FACTS.hidden.mockup]);
    expect(sel("build")).toEqual([...FACTS.hidden.both, ...FACTS.hidden.build]);
    // The build side's selectors hold on the page as it renders, too.
    for (const selector of sel("build")) expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(1);
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
    // The route's other rules are P15's (V6, task 4.7) and the founder's page facts (V16, task 6.7), for both runs: the
    // FAQ answer and the details read the same with JavaScript off.
    expect(TEXT_DEVIATIONS["meet-kheelu"].map((rule) => [rule.approvedBy.slice(0, "deviations.md V3".length), rule.jsOff ?? false])).toEqual([
      ["deviations.md V3", true],
      ["deviations.md V6", false],
      ["deviations.md V1", false],
    ]);
    expect(TEXT_DEVIATIONS["meet-kheelu"][2].approvedBy).toBe(PAGE_FACTS["meet-kheelu"].approvedBy);
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
