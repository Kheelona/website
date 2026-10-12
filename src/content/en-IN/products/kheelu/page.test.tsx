import { existsSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { MRP_PRICE } from "@/config/site";
import type { Offer, OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../../test/e2e/support/page-checks";
import { ROOT } from "../../../../../test/e2e/support/repo";
import { mockupRoute as mockupPageRoute } from "../../../../../test/e2e/support/routes";
import { mockupPage, mockupRoute, STORE, words } from "../../../../../test/support/mockup-compare";
import { faqs } from "../../faqs";
import { films } from "../../films";
import { kheeluPage } from "./page";
import { product } from "./product";

/*
 * The product page's content (task 5.2; structure §5 "meet-kheelu.html"; meet-kheelu.md): rendered by the template that
 * ships, it says and links exactly what the approved mockup's `main` says and links, fold by fold, in both offer modes.
 * The sections' own tests prove their markup against the same folds; this file proves the page's content feeds them
 * the approved words, addresses, names, reveals and tracking values, and the structured data the copy page asks for.
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
const MOCKUP = mockupPage("meet-kheelu").querySelector("main")!;
/** The folds: `main`'s sections, in order (React's image preload links and the JSON-LD script left out). */
const folds = (main: Element) => [...main.children].filter((el) => el.tagName === "SECTION");
const name = (el: Element) => el.getAttribute("aria-labelledby");
/** An element's text, white space collapsed (the parsed document is not the test's own, so no DOM matchers here). */
const text = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

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

  it("says, fold by fold, exactly what the mockup says (placeholders included)", () => {
    const built = folds(BUILT.main);
    folds(MOCKUP).forEach((fold, i) => expect(words(built[i]), name(fold) ?? `fold ${i + 1}`).toBe(words(fold)));
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
    // Only the announced specs: a row that still holds a placeholder is left out.
    const properties = (p.additionalProperty as { name: string }[]).map((x) => x.name);
    expect(properties).toContain("Ages");
    expect(properties).not.toContain("Size and weight");
    expect(properties).not.toContain("Parent app");
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
    // The shared detector (jsonld-matches-page): every price and policy number is on the page. Its FAQ check reads the
    // page through htmlToText, which puts a space where an inline tag was, so FAQ 8's marker ("skills.[1] Kheelu")
    // reads "skills. [1] Kheelu" there; the test above holds each answer equal to its visible text exactly.
    expect(jsonLdMismatches(html).filter((m) => !m.startsWith("FAQ answer not visible: \"Kheelu is a toy"))).toEqual([]);
  });
});
