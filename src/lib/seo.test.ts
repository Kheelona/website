import {
  ORGANIZATION,
  WEBSITE,
  LUMI_PRODUCT,
  LAUNCH_VIDEO,
  breadcrumbs,
  faqPage,
  setupHowTo,
  pageGraph,
  siteEntityGraph,
  jsonLd,
  SITE_URL,
} from "./seo";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { SETUP_STEPS } from "./setup-steps";

/** These tests guard the two rules that make schema safe here: it may only
 *  describe visible copy, and it may never carry a founder-gated fact. Schema is
 *  the easiest place for an invented claim to hide, because nobody reads it. */
describe("structured data", () => {
  const everything = JSON.stringify(
    pageGraph(LUMI_PRODUCT, LAUNCH_VIDEO, faqPage([{ q: "q", a: "a" }]), setupHowTo(SETUP_STEPS), breadcrumbs([])),
  );

  it("never leaks a gated fact (Kheelona+ price, certifications) and carries the published ship date", () => {
    /* The ship date became a PUBLISHED fact on 2026-07-31 (founder), so the
       old no-ship-date guard flipped into a positive assertion. */
    expect(everything).toMatch(/"availabilityStarts":"2026-10-20"/);
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
       aman-soni-6b17b6223 is an address, not a figure.
       Since 2026-08-22 the graph also carries the seller of record: GSTIN,
       pincode, street number and the WhatsApp support number. Those are
       IDENTIFIERS, not figures, so they are stripped rather than allow-listed.
       Allow-listing them would blunt the guard permanently: a stray "1530"
       inside a future price claim would then pass. */
    const identifiers = /"(taxID|telephone|postalCode|streetAddress)":"[^"]*"/g;
    const withoutUrls = everything
      .replace(/https?:\/\/[^"]+/g, "")
      .replace(identifiers, "");
    const numbers = withoutUrls.match(/\d{4,}/g) ?? [];
    /* "9999" left this list on 2026-08-23 with the ₹9,999 price itself; the
       ₹7,999 in the offer description never reaches here because its comma
       breaks the digit run, and the schema price NUMBER stays 4999. */
    for (const n of numbers) expect(["4999", "2025", "2026"]).toContain(n);
  });

  it("makes no claim about what happens if Kheelona+ lapses (gate V3-b)", () => {
    expect(everything).not.toMatch(/lapse|expire|without a subscription|still works/i);
  });

  it("keeps the offer at pre-order, priced as a number, with no validity date", () => {
    expect(LUMI_PRODUCT.offers.availability).toBe("https://schema.org/PreOrder");
    expect(LUMI_PRODUCT.offers.priceCurrency).toBe("INR");
    // a schema price is a number, and it comes from the paise constant
    expect(LUMI_PRODUCT.offers.price).toBe(4999);
    /* Inverted 2026-08-23 (§8.26): the offer is bounded by a UNIT COUNT now,
       which schema.org cannot express. A priceValidUntil would make Google
       drop the offer on a day nothing changed, so its ABSENCE is the correct
       markup and this guards against it creeping back. The unit terms live in
       the offer's prose description instead. */
    expect("priceValidUntil" in LUMI_PRODUCT.offers).toBe(false);
  });

  it("states Lumi's real age band, not the retired ones", () => {
    /* Ages 3+ since 2026-08-23 (founder decision #8): a minimum with NO
       maximum, because the published range has no ceiling. "2 to 5" and
       "2 to 14" joined the dead-ranges list the day they were replaced. */
    expect(LUMI_PRODUCT.audience.suggestedMinAge).toBe(3);
    expect("suggestedMaxAge" in LUMI_PRODUCT.audience).toBe(false);
    expect(everything).not.toMatch(/3 to 10|3 to 6|2 to 5|2 to 14/);
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

  it("declares the two entities exactly once, in the site graph", () => {
    const g = siteEntityGraph() as { "@graph": { "@id"?: string }[] };
    expect(g["@graph"]).toHaveLength(2);
    expect(g["@graph"][0]["@id"]).toBe(`${SITE_URL}/#organization`);
    expect(g["@graph"][1]["@id"]).toBe(`${SITE_URL}/#website`);
  });

  /* The regression this pins. Until 2026-09-05 one function served both
     callers, so SiteChrome and the page each emitted an Organization and a
     WebSite: two ld+json scripts per page, both declaring the same two @ids.
     A page graph that quietly re-declares the publisher is the failure, and it
     is invisible unless something counts. */
  it("keeps the publisher OUT of a page graph, so it is never declared twice", () => {
    const g = pageGraph({ "@type": "AboutPage" }) as { "@graph": { "@type"?: string }[] };
    expect(g["@graph"]).toHaveLength(1);
    expect(g["@graph"][0]["@type"]).toBe("AboutPage");
    const types = JSON.stringify(g);
    expect(types).not.toMatch(/"@type":"Organization"/);
    expect(types).not.toMatch(/"@type":"WebSite"/);
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

/** F-10. Structured data goes into the page through dangerouslySetInnerHTML,
 *  which is the standard way and is safe only while nothing in the data can end
 *  a script element. Every value is ours today; the escaping is so that stays
 *  true the day one of them is not. */
describe("json-ld serialisation", () => {
  it("lets nothing close the script element it sits in", () => {
    const serialised = jsonLd({ name: "</script><script>alert(1)</script>" });
    expect(serialised).not.toContain("<");
    expect(serialised).not.toContain(">");
    expect(serialised).toContain("u003c");
  });

  it("escapes the ampersand too, so an entity cannot be smuggled in", () => {
    expect(jsonLd({ name: "Sneha & Raj" })).not.toContain("&");
  });

  it("changes nothing about the data a parser reads back", () => {
    /* A unicode escape is the character it names, so Google receives exactly
       what it received before. This is the assertion that makes the escaping
       safe to apply to every page at once. */
    const value = { name: "Kheelu <3 & > you", nested: [{ a: 1 }, "</script>"] };
    expect(JSON.parse(jsonLd(value))).toEqual(value);
  });

  it("is what every page actually uses, with no raw stringify left behind", () => {
    /* The failure this catches: one page keeps JSON.stringify and quietly stays
       the exception. Read as text, like the other repo-level guards. */
    const files = execFileSync("git", ["ls-files", "src/app", "src/components"], {
      encoding: "utf8",
    })
      .split("\n")
      .filter((file) => file.endsWith(".tsx") && !file.includes(".test."));

    const offenders = files.filter((file) =>
      readFileSync(file, "utf8").includes("__html: JSON.stringify"),
    );
    expect(offenders).toEqual([]);
  });

  /* The structural half of the de-duplication (2026-09-05).
   *
   * `siteEntityGraph()` publishes Organization and WebSite. It is correct
   * exactly once per rendered page, and SiteChrome is the one component that
   * renders once per marketing page. Any second caller — a page that wants "the
   * full graph", a new template, a store layout — puts the publisher on the page
   * twice again, which is the bug this pair of functions was split to make
   * impossible. So the call site is pinned, not just the return value. */
  it("lets only SiteChrome publish the entity graph", () => {
    const files = execFileSync("git", ["ls-files", "src/app", "src/components", "src/features"], {
      encoding: "utf8",
    })
      .split("\n")
      .filter((file) => /\.tsx?$/.test(file) && !file.includes(".test.") && !file.includes(".stories."));

    const callers = files.filter((file) =>
      /\bsiteEntityGraph\s*\(/.test(readFileSync(file, "utf8")),
    );
    expect(callers).toEqual(["src/components/templates/SiteChrome.tsx"]);
  });

  /* And the other direction: a page graph must never carry the publisher, so no
   * page may hand Organization or WebSite to pageGraph() by hand either. */
  it("keeps ORGANIZATION and WEBSITE out of every page module", () => {
    const files = execFileSync("git", ["ls-files", "src/app"], { encoding: "utf8" })
      .split("\n")
      .filter((file) => /\.tsx?$/.test(file) && !file.includes(".test."));

    const offenders = files.filter((file) =>
      /\b(ORGANIZATION|WEBSITE)\b/.test(readFileSync(file, "utf8")),
    );
    expect(offenders).toEqual([]);
  });
});
