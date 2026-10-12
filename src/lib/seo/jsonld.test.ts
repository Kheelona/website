import { describe, expect, it } from "vitest";
import { jsonLd, pageGraph, siteGraph, type SchemaNode } from "./jsonld";

describe("jsonLd: JSON-LD as text that is safe inside a script element", () => {
  /* The escaping of the legacy src/lib/seo.ts, kept (task 2.7): the three characters that can end
     a script element or start an entity leave as unicode escapes. Expected strings written by hand. */
  it("lets nothing close the script element it sits in", () => {
    expect(jsonLd({ name: "</script><script>alert(1)</script>" })).toBe(
      '{"name":"\\u003c/script\\u003e\\u003cscript\\u003ealert(1)\\u003c/script\\u003e"}',
    );
  });

  it("escapes the ampersand and the closing angle too", () => {
    expect(jsonLd({ a: "Tom & Jerry > Kheelu" })).toBe('{"a":"Tom \\u0026 Jerry \\u003e Kheelu"}');
  });

  it("changes nothing a parser reads back", () => {
    const value = { name: "Kheelu <3 & > you", nested: [{ a: 1 }, "</script>"], rupee: "₹4,999" };
    expect(JSON.parse(jsonLd(value))).toEqual(value);
  });

  it("leaves ordinary text, the rupee sign and curly quotes as they are", () => {
    expect(jsonLd({ t: "Kheelu’s price is ₹4,999" })).toBe(`{"t":"Kheelu’s price is ₹4,999"}`);
  });
});

const org = { "@type": "Organization", "@id": "https://kheelona.com/#organization", name: "Kheelona" } as const;
const site = { "@type": "WebSite", "@id": "https://kheelona.com/#website", name: "Kheelona" } as const;
const faq = { "@type": "FAQPage", mainEntity: [] } as const;

describe("the two graphs", () => {
  it("publishes the publisher once, in the site graph, under the schema.org context", () => {
    expect(siteGraph(org, site)).toEqual({ "@context": "https://schema.org", "@graph": [org, site] });
  });

  it("puts a page's own nodes in the page graph, in order", () => {
    const crumbs = { "@type": "BreadcrumbList", itemListElement: [] } as const;
    expect(pageGraph(faq, crumbs)).toEqual({ "@context": "https://schema.org", "@graph": [faq, crumbs] });
  });

  /* The site shell already declared both; a second copy under the same @id is the duplicate the
     live site shipped for months (legacy seo.ts, 2026-09-05). */
  it("refuses the Organization or the WebSite in a page graph", () => {
    expect(() => pageGraph(faq, org as unknown as SchemaNode)).toThrow(/site graph/);
    expect(() => pageGraph(site as unknown as SchemaNode)).toThrow(/site graph/);
  });

  it("refuses an empty page graph, which would publish nothing", () => {
    expect(() => pageGraph()).toThrow(/at least one node/);
  });
});
