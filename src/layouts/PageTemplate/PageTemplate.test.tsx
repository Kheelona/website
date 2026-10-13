import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { cta } from "@/content/en-IN/cta";
import { faqs } from "@/content/en-IN/faqs";
import { seller } from "@/content/en-IN/seller";
import type { Meta, Offer } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { jsonLd, pageGraph } from "@/lib/seo/jsonld";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../test/e2e/support/page-checks";
import { renderSection, type SectionEntry } from "../sections-registry";
import { ART, CTA_BLOCK, ENTRY_FIXTURES } from "./__fixtures__/entries";
import { pageSchemaNodes } from "./page-schema";
import type { PageContent } from "./page-template.types";
import { PageTemplate } from "./PageTemplate";

/* PageTemplate (task 4.1; architecture §5.1, §5.4, §9.2; structure §5): a page is its content module's folds, in order,
 * each rendered through the section registry with the page's selling context (the live offer, the one CTA label from
 * content/en-IN/cta.ts, the help line from seller.ts), straight into the shell's <main> as the mockup puts them, then
 * the page's own JSON-LD, built from the same content. */

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");
const META: Meta = { title: "A page", description: "A page.", og: { image: "/og.png", alt: "Kheelu" } };
const PATH = "/lp/spring";

const heroWithCta = {
  kind: "hero-section",
  config: { variant: "art", heading: { id: "hero-title", title: "A toy that {hand:asks back}" }, art: ART },
  cta: { cta: "hero", arrow: true, id: "hero-cta", layout: "stack", trust: CTA_BLOCK.trust, helpLine: true },
} as const satisfies SectionEntry;

/** A FAQ fold whose second answer names the price, which reads differently in each offer mode (task 4.5 item 5), so
 *  "in both modes" below is a claim the two modes can tell apart. */
const faqWithPrice = {
  kind: "faq-section",
  config: { heading: { id: "faq-title", title: "Questions parents {hand:ask}" }, items: [faqs["think-less"], faqs["price-and-advance"]] },
} as const satisfies SectionEntry;

const PAGE: PageContent = {
  meta: META,
  sections: [
    heroWithCta,
    { ...ENTRY_FIXTURES["modes-section"], faq: true },
    { ...ENTRY_FIXTURES["films-strip"], cta: { ...CTA_BLOCK, cta: "see-it-ask" } },
    faqWithPrice,
    ENTRY_FIXTURES["close-section"],
  ],
};

/** The page as the shell would hold it: a document with the template's output in <main>. */
function rendered(page: PageContent, offer: Offer) {
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(<PageTemplate page={page} offer={offer} path={PATH} />)}</main></body></html>`;
  return { html, doc: new DOMParser().parseFromString(html, "text/html") };
}

describe("PageTemplate: the folds", () => {
  it("renders each fold through the registry, in the content's order, straight into main", () => {
    const { doc } = rendered(PAGE, TOKEN);
    const context = { offer: TOKEN, ctaLabel: cta.preorder, help: seller.help };
    const folds = PAGE.sections.map((entry) => renderToStaticMarkup(<>{renderSection(entry, context)}</>)).join("");
    const main = doc.querySelector("main")!;
    main.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
    expect(main.innerHTML).toBe(new DOMParser().parseFromString(`<main>${folds}</main>`, "text/html").querySelector("main")!.innerHTML);
    // React's server renderer writes the hero's LCP image preload as a <link> (in the <head> of a real document).
    const folded = [...main.children].filter((el) => el.tagName !== "LINK");
    expect(main.querySelectorAll("link").length).toBe(main.querySelectorAll('link[rel="preload"][as="image"]').length);
    expect(folded.map((el) => el.getAttribute("aria-labelledby"))).toEqual(["hero-title", "what-title", "films-title", "faq-title", "close-title"]);
  });

  it("gives every selling part the page's context: the one label, the live price sentence, the help line", () => {
    for (const offer of [TOKEN, FULL]) {
      const { doc } = rendered(PAGE, offer);
      const buttons = [...doc.querySelectorAll("main .kh-btn--cta")];
      expect(buttons.map((b) => b.getAttribute("data-ph-capture-attribute-cta"))).toEqual(["hero", "see-it-ask", "finale"]);
      for (const b of buttons) expect(b.textContent).toBe(cta.preorder);
      const sentences = new Set([...doc.querySelectorAll("main .ks-price")].map((p) => p.textContent));
      expect(sentences.size).toBe(1);
      expect(doc.querySelectorAll("main .ks-help").length).toBeGreaterThan(0);
    }
  });

  it("never puts money inside a reveal, composed as a whole page (no-reveal-on-money's DOM rule)", () => {
    expect(revealOnMoneyInDocument(rendered(PAGE, TOKEN).doc)).toEqual([]);
  });

  it("holds one h1: the page must open with its heading section and list no second one", () => {
    expect(rendered(PAGE, TOKEN).doc.querySelectorAll("h1")).toHaveLength(1);
    const late: PageContent = { meta: META, sections: [ENTRY_FIXTURES["faq-section"], heroWithCta] };
    expect(() => rendered(late, TOKEN)).toThrow(/must open with its h1 section.*faq-section/);
    const twice: PageContent = { meta: META, sections: [heroWithCta, ENTRY_FIXTURES["empty-state-section"]] };
    expect(() => rendered(twice, TOKEN)).toThrow(/one h1 section.*empty-state-section/);
    expect(() => rendered({ meta: META, sections: [] }, TOKEN)).toThrow(/must open with its h1 section/);
  });
});

describe("PageTemplate: the page's own JSON-LD", () => {
  it("prints the page graph once, after the folds, from the same content", () => {
    for (const offer of [TOKEN, FULL]) {
      const { doc } = rendered(PAGE, offer);
      const scripts = doc.querySelectorAll('main script[type="application/ld+json"]');
      expect(scripts).toHaveLength(1);
      expect(scripts[0].textContent).toBe(jsonLd(pageGraph(...pageSchemaNodes(PAGE, offer, PATH))));
      expect(doc.querySelector("main")!.lastElementChild).toBe(scripts[0]);
    }
  });

  it("has a FAQPage whose every answer the page shows (jsonld-matches-page), in both modes", () => {
    type Question = { name: string; acceptedAnswer: { text: string } };
    const priceAnswers = [TOKEN, FULL].map((offer) => {
      const { html } = rendered(PAGE, offer);
      const [graph] = jsonLdBlocks(html) as { "@graph": { "@type": string; mainEntity: Question[] }[] }[];
      expect(graph["@graph"].map((n) => n["@type"])).toEqual(["FAQPage"]);
      expect(graph["@graph"][0].mainEntity).toHaveLength(3);
      expect(jsonLdMismatches(html)).toEqual([]);
      return graph["@graph"][0].mainEntity[2];
    });
    // The price answer in each mode's own words and amounts, each the one the page shows in that mode.
    const [token, full] = priceAnswers;
    expect(token.name).toBe(toPlainText(faqs["price-and-advance"].question, TOKEN));
    expect(token.acceptedAnswer.text).toContain(TOKEN.prices.token);
    expect(full.name).toBe(toPlainText(faqs["price-and-advance"].question, FULL));
    expect(full.acceptedAnswer.text).toContain(FULL.prices.full);
    expect(full.acceptedAnswer.text).not.toContain(TOKEN.prices.token);
  });

  it("prints no script for a page with no nodes of its own", () => {
    const plain: PageContent = { meta: META, sections: [heroWithCta, ENTRY_FIXTURES["close-section"]] };
    expect(rendered(plain, TOKEN).doc.querySelector('script[type="application/ld+json"]')).toBeNull();
  });
});
