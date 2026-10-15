import { describe, expect, it } from "vitest";
import type { Meta, Offer } from "@/content/types";
import { pageMeta, type PageMetaInput } from "./metadata";

const prices = { token: "₹499", balance: "₹4,500", full: "₹7,999", mrp: "₹7,999", launch: "₹4,999" };
const tokenOffer: Offer = {
  mode: "token",
  headlinePaise: 499_900,
  prices: { ...prices, headline: "₹4,999" },
  sentence: "",
  priceLine: "",
  sticky: { big: "", small: "" },
  card: { product: "Kheelu", perks: { home: [], product: [] } },
  plus: "",
  delivery: "Deliveries start mid-November",
  availabilityStarts: "2026-11-15",
};
const fullOffer: Offer = { ...tokenOffer, mode: "full", headlinePaise: 799_900, prices: { ...prices, headline: "₹7,999" } };

/** A product page's meta as a content module holds it: the description names a price, so it
 *  changes with the offer mode. */
const productMeta: Meta = {
  title: "Kheelu: the {mark:screen-free} AI toy for ages 3 to 7",
  description: {
    token: "Kheelu is {price:headline} (incl. GST). Reserve for {price:token}, refundable.",
    full: "Kheelu is {price:headline} (incl. GST), paid in full when you order.",
  },
  og: { image: "/og/kheelu.jpg", alt: "Kheelu, a plush toy, on fur" },
};

describe("pageMeta", () => {
  it("returns the whole metadata a page needs, from its content and path", () => {
    expect(pageMeta({ ...productMeta, path: "/products/kheelu", offer: tokenOffer })).toEqual({
      title: { absolute: "Kheelu: the screen-free AI toy for ages 3 to 7" },
      description: "Kheelu is ₹4,999 (incl. GST). Reserve for ₹499, refundable.",
      alternates: { canonical: "/products/kheelu" },
      openGraph: {
        type: "website",
        url: "/products/kheelu",
        title: "Kheelu: the screen-free AI toy for ages 3 to 7",
        description: "Kheelu is ₹4,999 (incl. GST). Reserve for ₹499, refundable.",
        siteName: "Kheelona",
        locale: "en_IN",
        images: [{ url: "/og/kheelu.jpg", width: 1200, height: 630, alt: "Kheelu, a plush toy, on fur" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Kheelu: the screen-free AI toy for ages 3 to 7",
        description: "Kheelu is ₹4,999 (incl. GST). Reserve for ₹499, refundable.",
        images: [{ url: "/og/kheelu.jpg", alt: "Kheelu, a plush toy, on fur" }],
      },
    });
  });

  it("resolves the description for the offer mode, in every place it appears", () => {
    const meta = pageMeta({ ...productMeta, path: "/products/kheelu", offer: fullOffer });
    const full = "Kheelu is ₹7,999 (incl. GST), paid in full when you order.";
    expect(meta.description).toBe(full);
    expect(meta.openGraph).toMatchObject({ description: full });
    expect(meta.twitter).toMatchObject({ description: full });
  });

  it("refuses to guess a mode: copy that changes with the offer needs the offer", () => {
    expect(() => pageMeta({ ...productMeta, path: "/products/kheelu" })).toThrow(/offer/);
  });

  it("needs no offer for a page whose meta names no price", () => {
    const meta = pageMeta({
      title: "Contact Kheelona",
      description: "WhatsApp or call us.",
      og: { image: "/og.png", alt: "Kheelu" },
      path: "/contact",
    });
    expect(meta.title).toEqual({ absolute: "Contact Kheelona" });
  });

  it("declares a journal piece an article, with its stored dates and author", () => {
    const meta = pageMeta({
      title: "Learning toys for a 3-year-old",
      description: "What a 3-year-old is working on.",
      og: { image: "/og.png", alt: "Kheelu" },
      path: "/stories/learning-toys-for-a-three-year-old",
      article: { published: "2026-07-28", updated: "2026-10-11", authors: ["Ria Mangala Rewari"] },
    });
    expect(meta.openGraph).toEqual({
      type: "article",
      publishedTime: "2026-07-28",
      modifiedTime: "2026-10-11",
      authors: ["Ria Mangala Rewari"],
      url: "/stories/learning-toys-for-a-three-year-old",
      title: "Learning toys for a 3-year-old",
      description: "What a 3-year-old is working on.",
      siteName: "Kheelona",
      locale: "en_IN",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Kheelu" }],
    });
  });

  /* A journal post's uploaded cover is shared at its own shape (ADR-014; journal-pipeline §6): the optimiser serves it
     1200 wide, so its card is not 1200 x 630, and share tools are told the size they will get. */
  it("gives a share card its own size when the content names one, and 1200 x 630 otherwise", () => {
    const upload = "/_next/image?url=https%3A%2F%2Fapi.kheelona.com%2Fv1%2Fpublic%2Fblog%2Fimages%2Fcover.jpg&w=1200&q=75" as const;
    const meta = pageMeta({
      title: "A guide with an uploaded cover",
      description: "What an uploaded cover changes.",
      og: { image: upload, alt: "A child's drawing", width: 1200, height: 675 },
      path: "/stories/a-guide",
    });
    expect(meta.openGraph?.images).toEqual([{ url: upload, width: 1200, height: 675, alt: "A child's drawing" }]);
    expect(meta.twitter?.images).toEqual([{ url: upload, alt: "A child's drawing" }]);
    const card = pageMeta({ title: "Kheelu", description: "Kheelu.", og: { image: "/og.png", alt: "Kheelu" }, path: "/" });
    expect(card.openGraph?.images).toEqual([{ url: "/og.png", width: 1200, height: 630, alt: "Kheelu" }]);
  });

  it("refuses half a size or a size that is not whole pixels", () => {
    const og = (size: Record<string, number>) => ({ title: "Kheelu", description: "Kheelu.", og: { image: "/og.png" as const, alt: "Kheelu", ...size }, path: "/" as const });
    expect(() => pageMeta(og({ width: 1200 }))).toThrow('pageMeta: the share card of "/" names a width without a height');
    expect(() => pageMeta(og({ height: 675 }))).toThrow('pageMeta: the share card of "/" names a height without a width');
    expect(() => pageMeta(og({ width: 1200.5, height: 675 }))).toThrow('pageMeta: the share card of "/" is not a size in whole pixels (1200.5 x 675)');
  });

  /* D028: page titles and meta descriptions are machine-read, so they lead with the total
     (₹4,999 incl. GST, or ₹7,999 in full mode), never with the ₹499 advance. Every approved meta
     description does (home, meet-kheelu, the guide, terms and store copy pages). */
  it("refuses a title or description that leads with any amount but the headline", () => {
    const leadsWithAdvance = { ...productMeta, description: "Reserve for {price:token} today. Kheelu is {price:headline}." };
    expect(() => pageMeta({ ...leadsWithAdvance, path: "/products/kheelu", offer: tokenOffer })).toThrow(/lead with ₹4,999/);
    const titleWithAdvance = { ...productMeta, title: "Kheelu from {price:token}" };
    expect(() => pageMeta({ ...titleWithAdvance, path: "/products/kheelu", offer: fullOffer })).toThrow(/lead with ₹7,999/);
  });

  /* Task 2.13 (the 2.7 review's probe): "Reserve Kheelu for ₹499" without an offer passed, because
     the D028 check runs only with an offer. Every amount is a {price:…} token (architecture §6.2),
     so a typed amount is refused in any mode and with or without an offer: it can never follow the
     checkout's price, and it can lead a machine-read line with the advance. */
  const plain = { og: { image: "/og.png" as const, alt: "" }, path: "/x" as const };
  it.each([
    ["a title, no offer", { ...plain, title: "Reserve Kheelu for ₹499", description: "Plain." }, undefined, /title of \/x/],
    ["a description, no offer", { ...plain, title: "Plain", description: "Kheelu costs ₹4,999 in total." }, undefined, /description of \/x/],
    ["a title that leads with the headline", { ...plain, title: "₹4,999 Kheelu", description: "Plain." }, tokenOffer, /title of \/x/],
    ["a spaced amount", { ...plain, title: "Kheelu for ₹ 4,999", description: "Plain." }, undefined, /title/],
    ["Rs", { ...plain, title: "Kheelu for Rs. 4999", description: "Plain." }, undefined, /title/],
    ["INR", { ...plain, title: "Plain", description: "Kheelu is INR 4999." }, undefined, /description/],
    ["rupees", { ...plain, title: "Plain", description: "Kheelu is 4999 rupees." }, undefined, /description/],
    ["the mode the offer does not pick", { ...plain, title: "Plain", description: { token: "Kheelu is {price:headline}.", full: "Kheelu is ₹7,999." } }, tokenOffer, /description of \/x/],
  ] as const)("refuses a typed rupee amount in %s", (_name, meta, offer, where) => {
    expect(() => pageMeta({ ...meta, offer })).toThrow(/typed rupee amount/);
    expect(() => pageMeta({ ...meta, offer })).toThrow(where);
  });

  it("accepts the same amounts as {price:…} tokens, and words that only look like amounts", () => {
    expect(pageMeta({ ...plain, title: "Kheelu for {price:headline}", description: "Plain.", offer: tokenOffer }).title).toEqual({
      absolute: "Kheelu for ₹4,999",
    });
    expect(() => pageMeta({ ...plain, title: "Kheelu for ages 3 to 7", description: "36 months of Kheelona+. Rs is not a price." })).not.toThrow();
  });

  it("refuses a canonical that is not the page's own clean path", () => {
    const base = { title: "T", description: "D", og: { image: "/og.png" as const, alt: "" } };
    expect(() => pageMeta({ ...base, path: "/products/kheelu#offer" })).toThrow(/canonical/);
    expect(() => pageMeta({ ...base, path: "/products/kheelu?utm_source=x" })).toThrow(/canonical/);
    expect(() => pageMeta({ ...base, path: "/products/kheelu/" })).toThrow(/canonical/);
    expect(() => pageMeta({ ...base, path: "https://kheelona.com/x" as never })).toThrow(/canonical/);
    expect(pageMeta({ ...base, path: "/" }).alternates).toEqual({ canonical: "/" });
  });
});

/* N15: Next merges metadata key by key, so a page-level `robots` would replace the root layout's
   beta noindex. pageMeta returns exactly these five keys for every input, robots never among them. */
describe("pageMeta never returns a robots key", () => {
  const KEYS = ["alternates", "description", "openGraph", "title", "twitter"];
  const articles = [undefined, { published: "2026-07-28", updated: "2026-10-11", authors: ["Aman Soni"] }] as const;
  const offers = [undefined, tokenOffer, fullOffer];
  const metas: Meta[] = [
    { title: "Plain", description: "Plain description.", og: { image: "/og.png", alt: "" } },
    productMeta,
  ];
  /* Every combination except a mode variant without its offer, which refuses (tested above). */
  const cases = metas
    .flatMap((meta) => offers.flatMap((offer) => articles.map((article) => ({ ...meta, path: "/x" as const, offer, article }))))
    .filter((input) => !(input.title === productMeta.title && input.offer === undefined));

  it("covers ten combinations", () => expect(cases).toHaveLength(10));

  it.each(cases.map((input, i) => [i, input] as const))("case %i", (_i, input) => {
    const meta = pageMeta(input as PageMetaInput);
    expect(Object.keys(meta).sort()).toEqual(KEYS);
    expect(meta).not.toHaveProperty("robots");
  });

  it("does not pass a robots value through even when one is smuggled into the input", () => {
    const smuggled = {
      ...productMeta,
      path: "/x",
      offer: tokenOffer,
      robots: { index: false, follow: false },
      other: { robots: "index" },
    } as unknown as PageMetaInput;
    const meta = pageMeta(smuggled);
    expect(Object.keys(meta).sort()).toEqual(KEYS);
    expect(JSON.stringify(meta)).not.toMatch(/robots|index/);
  });
});
