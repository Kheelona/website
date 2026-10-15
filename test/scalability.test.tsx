import type { Metadata } from "next";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cta } from "@/content/en-IN/cta";
import { faqs } from "@/content/en-IN/faqs";
import { films, filmsStrip } from "@/content/en-IN/films";
import { RETURN_DAYS, RETURN_PICKUP_FREE, WARRANTY_MONTHS } from "@/content/en-IN/policies";
import type { ProductFacts } from "@/content/en-IN/products/kheelu/product";
import { TRUST_COMPACT, TRUST_FULL, trustItems } from "@/content/en-IN/trust";
import type { ArtBoardRef, Offer, OfferMode } from "@/content/types";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "./e2e/support/page-checks";

/*
 * The scalability test (brief §6 "Component system"; architecture §5.4; task 4.1, N26): a new campaign landing page
 * and a new product page need only content and the existing sections, not new code. Each fixture below is written
 * exactly as a content module would be (data only, `satisfies PageContent`, every word, amount and link from the
 * content's own syntax) and rendered by the code that ships: the campaign through its real route with one line added
 * to the campaign registry, the product page through PageTemplate as products/[slug] renders it (task 5.2). The
 * article half is 4.2's (test/scalability-article.test.tsx).
 */

const compact = TRUST_COMPACT.map((id) => trustItems[id]);
const full = TRUST_FULL.map((id) => trustItems[id]);
const image = (src: `/${string}`, alt: string) => ({ src, width: 1200, height: 1200, alt });
const art = (alt: string): ArtBoardRef => ({ tone: "sun", label: alt, layers: [{ image: image("/media/kheelu-front.jpg", ""), left: 8, width: 64, bottom: 0 }] });

/** A campaign landing page, as src/content/en-IN/campaigns/<slug>.ts would hold it. */
const springCampaign = {
  meta: {
    title: "A screen-free toy that asks back",
    description: { token: "Kheelu is {price:headline} (incl. GST): a plush toy for ages 3 to 7 that asks your child questions back.", full: "Kheelu is {price:full} (incl. GST): a plush toy for ages 3 to 7 that asks your child questions back." },
    og: { image: "/og.png", alt: "Kheelu, the cream plush rabbit" },
  },
  sections: [
    {
      kind: "hero-section",
      config: { variant: "art", heading: { id: "hero-title", eyebrow: "For ages 3 to 7", title: "Fewer screens. {hand:More questions.}" }, art: art("Kheelu beside a child") },
      cta: { cta: "finale", layout: "stack", trust: compact, helpLine: true },
    },
    {
      kind: "films-strip",
      config: { heading: { id: "films-title", title: "Watch it {hand:ask}", align: "center" }, films, labels: { ...filmsStrip, of: "of" }, posters: "lazy" },
    },
    { kind: "faq-section", config: { heading: { id: "faq-title", title: "Questions parents {hand:ask}" }, items: [faqs["think-less"], faqs["price-and-advance"]] } },
    { kind: "close-section", config: { variant: "center", heading: { title: "Bring home a toy that {hand:asks back}" }, cta: { cta: "finale", trust: compact, helpLine: true } } },
  ],
} as const satisfies PageContent;

/** A second product: its facts module (products/<slug>/product.ts) and its page module (products/<slug>/page.ts). */
const plushFacts = {
  slug: "fixture-plush",
  name: "Fixture plush",
  ages: { min: 3, max: 7 },
  modes: [{ id: "story", name: "Story mode", icon: "book-open", needs: "no Wi‑Fi needed" }],
  languages: [{ name: "English", native: "English", lang: "en" }],
  languageCeiling: 1,
  specs: [
    { term: "Ages", value: "3 to 7" },
    { term: "Size and weight", value: "{ph:F4 size and weight}" },
  ],
  box: [{ icon: "package", text: "The plush toy" }],
  safety: [{ icon: "shield-check", text: "An age-graded safety layer." }],
  declarations: [{ term: "MRP", value: "{price:mrp} (incl. of all taxes)" }],
  schema: {
    id: "https://kheelona.com/products/fixture-plush#product",
    name: "Fixture plush by Kheelona",
    brand: "Kheelona",
    category: "Screen-free AI toy",
    countryOfOrigin: "IN",
    image: "/media/kheelu-front.jpg",
  },
} as const satisfies ProductFacts;

const plushPage = {
  meta: {
    title: "Fixture plush: a toy that asks back",
    description: "Fixture plush is {price:headline} (incl. GST): a plush toy for ages 3 to 7.",
    og: { image: "/og.png", alt: "The fixture plush" },
  },
  sections: [
    {
      kind: "hero-section",
      config: { variant: "product", heading: { id: "hero-title", title: `Meet ${plushFacts.name}, a toy that {hand:asks back}` }, art: art("The fixture plush") },
      cta: { cta: "product-top", layout: "stack", trust: compact, helpLine: true },
    },
    {
      kind: "product-details",
      config: {
        heading: { eyebrow: "Details", title: "What’s {hand:inside}" },
        tabsLabel: "Product details",
        specs: { title: "Specs", rows: plushFacts.specs },
        box: { title: "In the box", items: plushFacts.box },
        safety: { title: "Safety", items: plushFacts.safety },
        declarations: { title: "Declarations", rows: plushFacts.declarations },
      },
    },
    { kind: "faq-section", config: { heading: { id: "faq-title", title: "Questions parents {hand:ask}" }, items: [faqs["cost-and-advance"], faqs["returns-and-warranty"]] } },
    {
      kind: "close-section",
      config: { variant: "split", heading: { title: "Bring it {hand:home}" }, cta: { cta: "product-foot", trust: full, helpLine: true }, art: art("The fixture plush") },
    },
  ],
  schema: [
    {
      kind: "product",
      product: {
        id: plushFacts.schema.id,
        name: plushFacts.schema.name,
        brand: plushFacts.schema.brand,
        category: plushFacts.schema.category,
        description: "Fixture plush is {price:headline} (incl. GST): a screen-free plush toy for ages 3 to 7.",
        images: [plushFacts.schema.image],
        countryOfOrigin: plushFacts.schema.countryOfOrigin,
        audience: { minAge: plushFacts.ages.min, maxAge: plushFacts.ages.max },
        properties: plushFacts.specs.map(({ term, value }) => ({ name: term, value })),
        offerDescription: { token: "{price:headline} in total (incl. GST).", full: "{price:full} (incl. GST), paid in full when you order." },
        eligibleRegion: "IN",
        returnPolicy: { days: RETURN_DAYS, country: "IN", freeReturn: RETURN_PICKUP_FREE, fullRefund: true },
        shipping: { destination: "IN", free: true },
        warrantyMonths: WARRANTY_MONTHS,
      },
    },
  ],
} as const satisfies PageContent;

type CampaignRoute = {
  default: (props: { params: Promise<{ slug: string }> }) => Promise<ReactNode>;
  generateStaticParams: () => { slug: string }[];
  generateMetadata: (props: { params: Promise<{ slug: string }> }) => Promise<Metadata>;
  dynamicParams: boolean;
  revalidate: number;
};

/** The registry's lookup, watched: the route must find a campaign through it (task 4.5 item 1), never a lookup of its own. */
const lookups = vi.fn<(slug: string) => void>();

/** The campaign route as built, with the campaign registry as given and the live offer in `mode`. */
async function campaignRoute(registry: Record<string, PageContent> | null, mode: OfferMode = "token"): Promise<CampaignRoute> {
  vi.resetModules();
  lookups.mockClear();
  vi.doMock("@/lib/offer/get-offer", () => ({ getOffer: async () => buildOffer(mode) }));
  if (registry) {
    vi.doMock("@/content/en-IN/campaigns", () => ({
      campaigns: registry,
      campaignSlugs: Object.keys(registry),
      getCampaign: (slug: string) => {
        lookups(slug);
        return Object.hasOwn(registry, slug) ? registry[slug] : undefined;
      },
    }));
  }
  return (await import("@/app/(site)/lp/[slug]/page")) as CampaignRoute;
}

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const documentOf = (main: string) => `<!doctype html><html><body><main id="main">${main}</main></body></html>`;

afterEach(() => {
  vi.doUnmock("@/content/en-IN/campaigns");
  vi.doUnmock("@/lib/offer/get-offer");
});

/* What a visitor gets at an unlisted /lp/<slug> (a 404 rendered on the server, with its <main>) is a property of the
 * built site, asserted by test/e2e/redirects.spec.ts; this file holds the route's own exports to account. */
describe("the campaign route at launch", () => {
  it("builds with an empty registry: no params, dynamic params off (an unlisted slug never reaches the page), and no metadata for an unlisted slug", async () => {
    const route = await campaignRoute(null);
    expect(route.generateStaticParams()).toEqual([]);
    expect(route.dynamicParams).toBe(false);
    expect(route.revalidate).toBe(300);
    expect(await route.generateMetadata(params("spring"))).toEqual({});
  });
});

describe("a new campaign page is a content module plus one registry line", () => {
  for (const mode of ["token", "full"] as const) {
    it(`is listed, described and rendered by the route with no code change (${mode} mode)`, async () => {
      const route = await campaignRoute({ spring: springCampaign }, mode);
      const offer: Offer = buildOffer(mode);
      expect(route.generateStaticParams()).toEqual([{ slug: "spring" }]);
      expect(await route.generateMetadata(params("spring"))).toEqual(pageMeta({ ...springCampaign.meta, path: "/lp/spring", offer }));

      const main = renderToStaticMarkup(<>{await route.default(params("spring"))}</>);
      expect(main).toBe(renderToStaticMarkup(<PageTemplate page={springCampaign} offer={offer} path="/lp/spring" />));
      // Both the metadata and the page found the campaign through the registry's own lookup.
      expect(lookups.mock.calls).toEqual([["spring"], ["spring"]]);
      const doc = new DOMParser().parseFromString(documentOf(main), "text/html");
      expect(doc.querySelectorAll("h1")).toHaveLength(1);
      expect([...doc.querySelectorAll(".kh-btn--cta")].map((b) => b.textContent)).toEqual([cta.preorder, cta.preorder]);
      expect(doc.querySelector(".ks-films")).not.toBeNull();
      expect(doc.body.textContent).toContain(offer.prices.headline);
      expect(revealOnMoneyInDocument(doc)).toEqual([]);
      const graph = jsonLdBlocks(documentOf(main)) as { "@graph": { "@type": string }[] }[];
      expect(graph.flatMap((g) => g["@graph"].map((n) => n["@type"]))).toEqual(["FAQPage"]);
      expect(jsonLdMismatches(documentOf(main))).toEqual([]);
    });
  }
});

describe("a new product page is a facts module plus a page module", () => {
  for (const mode of ["token", "full"] as const) {
    it(`renders from content alone, with its Product and FAQPage JSON-LD (${mode} mode)`, () => {
      const offer = buildOffer(mode);
      const html = documentOf(renderToStaticMarkup(<PageTemplate page={plushPage} offer={offer} path="/products/fixture-plush" />));
      const doc = new DOMParser().parseFromString(html, "text/html");
      expect(doc.querySelectorAll("h1")).toHaveLength(1);
      expect(doc.querySelector("h1")?.textContent).toContain(plushFacts.name);
      expect(doc.querySelector("#specs")?.textContent).toContain("Ages");
      expect(doc.querySelector("#specs")?.textContent).toContain(offer.prices.mrp);
      expect(doc.querySelector("#specs .ks-placeholder")?.textContent).toBe("[PLACEHOLDER F4: size and weight]");
      expect([...doc.querySelectorAll(".kh-btn--cta")].map((b) => b.getAttribute("data-ph-capture-attribute-cta"))).toEqual(["product-top", "product-foot"]);
      expect(revealOnMoneyInDocument(doc)).toEqual([]);

      const [graph] = jsonLdBlocks(html) as { "@graph": Record<string, unknown>[] }[];
      expect(graph["@graph"].map((n) => n["@type"])).toEqual(["Product", "FAQPage"]);
      const product = graph["@graph"][0] as { "@id": string; url: string; offers: { price: number }; additionalProperty: { name: string }[] };
      expect(product["@id"]).toBe(plushFacts.schema.id);
      expect(product.url).toBe("https://kheelona.com/products/fixture-plush");
      expect(product.offers.price).toBe(offer.headlinePaise / 100);
      expect(product.additionalProperty.map((p) => p.name)).toEqual(["Ages"]);
      expect(jsonLdMismatches(html)).toEqual([]);
    });
  }
});
