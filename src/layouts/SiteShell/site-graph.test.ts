import { describe, expect, it } from "vitest";
import { organization, type OrganizationFacts as ContentOrganization } from "@/content/en-IN/organization";
import { ORGANIZATION_ID, WEBSITE_ID } from "@/lib/seo/urls";
import { organizationFacts, siteGraphOf, SITE_LANGUAGE } from "./site-graph";

/* The site graph (task 3.1; architecture §9.2; wave-2 close ruling): the Organization and WebSite nodes the site shell
 * emits once per page. organizationFacts() maps the content's facts (src/content/en-IN/organization.ts) to the input of
 * organizationNode() (src/lib/seo/schema/organization.ts) without renaming either type; task 4.4 reuses it. */

describe("organizationFacts", () => {
  it("maps every content fact to the schema builder's input", () => {
    expect(organizationFacts(organization)).toEqual({
      name: "Kheelona",
      legalName: "Kheelona Robotics Private Limited",
      taxId: "29AAMCK1530E1ZN",
      logo: "/brand/logo-mark.png",
      image: "/og.png",
      foundingDate: "2025",
      address: {
        street: "5th Floor, No 51 (Old Site No 1), Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar",
        locality: "Bengaluru",
        region: "Karnataka",
        postalCode: "560041",
        country: "IN",
      },
      founders: [
        { name: "Apoorva Sahu", jobTitle: "Co-Founder and CEO", sameAs: ["https://www.linkedin.com/in/sahu-apoorva/"] },
        { name: "Aman Soni", jobTitle: "Co-Founder and CTO", sameAs: ["https://www.linkedin.com/in/aman-soni-6b17b6223/"] },
        {
          name: "Kashyap C.R",
          jobTitle: "Co-Founder and Chief Hardware Officer",
          sameAs: ["https://www.linkedin.com/in/kashyap-c-r-7ba18177/"],
        },
      ],
      sameAs: organization.sameAs,
      areaServed: "IN",
      contactPoint: {
        contactType: "customer support",
        email: "hello@kheelona.com",
        telephone: "+91 91875 46483",
        url: "https://wa.me/919187546483",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    });
  });

  it("refuses a founding date that is not a year", () => {
    const odd: ContentOrganization = { ...organization, foundingDate: "early 2025" };
    expect(() => organizationFacts(odd)).toThrow(/foundingDate/);
  });

  it("carries nothing the content does not hold: no description, no memberOf (D038, F11)", () => {
    const facts = organizationFacts(organization) as unknown as Record<string, unknown>;
    expect(facts).not.toHaveProperty("description");
    expect(facts).not.toHaveProperty("memberOf");
    expect(facts).not.toHaveProperty("employees");
  });
});

describe("siteGraphOf", () => {
  const graph = siteGraphOf(organization);

  it("is the Organization, then the WebSite it publishes, in one schema.org graph", () => {
    expect(graph["@context"]).toBe("https://schema.org");
    expect(graph["@graph"].map((n) => [n["@type"], n["@id"]])).toEqual([
      ["Organization", ORGANIZATION_ID],
      ["WebSite", WEBSITE_ID],
    ]);
    expect(graph["@graph"][1]).toMatchObject({ name: "Kheelona", inLanguage: "en-IN", publisher: { "@id": ORGANIZATION_ID } });
  });

  it("names the company, its address, founders and support channel on the production origin", () => {
    const org = graph["@graph"][0] as Record<string, unknown>;
    expect(org).toMatchObject({
      name: "Kheelona",
      legalName: "Kheelona Robotics Private Limited",
      url: "https://kheelona.com",
      logo: "https://kheelona.com/brand/logo-mark.png",
      address: { "@type": "PostalAddress", addressLocality: "Bengaluru", postalCode: "560041", addressCountry: "IN" },
      contactPoint: { "@type": "ContactPoint", url: "https://wa.me/919187546483" },
    });
    expect((org.founder as unknown[]).length).toBe(3);
    expect(JSON.stringify(graph)).not.toContain("memberOf");
  });

  it("states the site's language as the root layout's <html lang>", () => {
    expect(SITE_LANGUAGE).toBe("en-IN");
  });
});
