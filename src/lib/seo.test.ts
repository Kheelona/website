import {
  ORGANIZATION,
  WEBSITE,
  LUMI_PRODUCT,
  LAUNCH_VIDEO,
  breadcrumbs,
  faqPage,
  setupHowTo,
  graph,
  SITE_URL,
} from "./seo";
import { SETUP_STEPS } from "./setup-steps";

/** These tests guard the two rules that make schema safe here: it may only
 *  describe visible copy, and it may never carry a founder-gated fact. Schema is
 *  the easiest place for an invented claim to hide, because nobody reads it. */
describe("structured data", () => {
  const everything = JSON.stringify(
    graph(LUMI_PRODUCT, LAUNCH_VIDEO, faqPage([{ q: "q", a: "a" }]), setupHowTo(SETUP_STEPS), breadcrumbs([])),
  );

  it("never leaks a gated fact (Kheelona+ price, certifications) and carries the published ship date", () => {
    /* The ship date became a PUBLISHED fact on 2026-07-31 (founder), so the
       old no-ship-date guard flipped into a positive assertion. */
    expect(everything).toMatch(/"availabilityStarts":"2026-09-01"/);
    expect(everything).not.toMatch(/shipDate|deliveryDate/);
    /* Certification is gated for the PRODUCT, not for a person's career. The
       risk is a schema property asserting Lumi is certified, so test for the
       properties and the badge names — Kashyap's bio legitimately says he has
       taken hardware to certification, which is his history, not our claim. */
    expect(everything).not.toMatch(/hasCertification|"certification"|ISO 27001|COPPA/i);
    expect(JSON.stringify(LUMI_PRODUCT)).not.toMatch(/certif/i);
    /* Any 4-digit-or-longer number in the graph must be one we can point at:
       Lumi's two published prices, or a year we actually state (founded 2025,
       the film's upload date 2026). A new number appearing here means someone
       put an unpublished figure into schema, which is the failure mode this
       whole test exists to catch. URLs are stripped first: a LinkedIn slug like
       aman-soni-6b17b6223 is an address, not a figure. */
    const withoutUrls = everything.replace(/https?:\/\/[^"]+/g, "");
    const numbers = withoutUrls.match(/\d{4,}/g) ?? [];
    for (const n of numbers) expect(["4999", "9999", "2025", "2026"]).toContain(n);
  });

  it("makes no claim about what happens if Kheelona+ lapses (gate V3-b)", () => {
    expect(everything).not.toMatch(/lapse|expire|without a subscription|still works/i);
  });

  it("keeps the offer at pre-order with no payment claim", () => {
    expect(LUMI_PRODUCT.offers.availability).toBe("https://schema.org/PreOrder");
    expect(LUMI_PRODUCT.offers.priceCurrency).toBe("INR");
    expect(LUMI_PRODUCT.offers.price).toBe("4999");
  });

  it("states Lumi's real age band, not the retired ones", () => {
    expect(LUMI_PRODUCT.audience.suggestedMinAge).toBe(2);
    expect(LUMI_PRODUCT.audience.suggestedMaxAge).toBe(5);
    expect(everything).not.toMatch(/3 to 10|3 to 6/);
  });

  it("carries the founders as entities: our strongest E-E-A-T signal", () => {
    const names = ORGANIZATION.founders.map((f) => f.name);
    expect(names).toEqual(["Apoorva Sahu", "Aman Soni", "Kashyap C.R"]);
    // credentials must be the published ones, not inflated
    expect(JSON.stringify(ORGANIZATION.founders)).toMatch(/14 patents/);
    expect(JSON.stringify(ORGANIZATION.founders)).toMatch(/Thunderbolt 4 and 5 compliance at Intel/);
  });

  it("declares the company as Indian, for geo queries", () => {
    expect(ORGANIZATION.address.addressCountry).toBe("IN");
    expect(ORGANIZATION.address.addressLocality).toBe("Bengaluru");
    expect(ORGANIZATION.areaServed.name).toBe("India");
    expect(WEBSITE.inLanguage).toBe("en-IN");
  });

  it("binds every page to one entity by @id, not a per-page island", () => {
    const g = graph({ "@type": "AboutPage" }) as { "@graph": { "@id"?: string }[] };
    expect(g["@graph"][0]["@id"]).toBe(`${SITE_URL}/#organization`);
    expect(g["@graph"][1]["@id"]).toBe(`${SITE_URL}/#website`);
  });

  it("numbers breadcrumbs from Home", () => {
    const b = breadcrumbs([{ name: "Safety", path: "/safety" }]);
    expect(b.itemListElement.map((i) => i.name)).toEqual(["Home", "Safety"]);
    expect(b.itemListElement[0].item).toBe(SITE_URL);
    expect(b.itemListElement[1].position).toBe(2);
  });

  it("turns the four day-one steps into a HowTo without inventing any", () => {
    const h = setupHowTo(SETUP_STEPS);
    expect(h.step.length).toBe(4);
    expect(h.step[0].name).toBe("Unbox and charge");
    expect(h.step[3].position).toBe(4);
  });

  it("points the video schema at assets that exist", () => {
    expect(LAUNCH_VIDEO.contentUrl).toBe(`${SITE_URL}/video/launch.mp4`);
    expect(LAUNCH_VIDEO.thumbnailUrl).toBe(`${SITE_URL}/video/launch-poster.jpg`);
  });
});
