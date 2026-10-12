import { describe, expect, it } from "vitest";
import { organizationNode, personIds, type OrganizationFacts } from "./organization";

/* Fixture facts in the shape organization.ts and seller.ts hand over (task 2.1 owns the real ones). */
const facts: OrganizationFacts = {
  name: "Kheelona",
  legalName: "Kheelona Robotics Private Limited",
  taxId: "29AAMCK1530E1ZN",
  description: "Kheelona makes Kheelu, a screen-free talking friend for children aged 3 to 7.",
  logo: "/brand/logo-mark.png",
  image: "/og.png",
  foundingDate: "2025",
  address: {
    street: "Line one, Line two",
    locality: "Bengaluru",
    region: "Karnataka",
    postalCode: "560001",
    country: "IN",
  },
  founders: [
    { name: "Apoorva Sahu", jobTitle: "Co-founder and CEO", sameAs: ["https://www.linkedin.com/in/sahu-apoorva/"] },
    { name: "Kashyap C.R" },
  ],
  sameAs: ["https://www.linkedin.com/company/kheelona/", "https://kheelona.ai"],
  areaServed: "IN",
  contactPoint: {
    contactType: "customer support",
    email: "hello@kheelona.com",
    telephone: "+91 91875 46483",
    url: "https://wa.me/919187546483",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
};

describe("organizationNode", () => {
  it("builds the publisher entity from the facts it is given", () => {
    expect(organizationNode(facts)).toEqual({
      "@type": "Organization",
      "@id": "https://kheelona.com/#organization",
      name: "Kheelona",
      legalName: "Kheelona Robotics Private Limited",
      taxID: "29AAMCK1530E1ZN",
      url: "https://kheelona.com",
      logo: "https://kheelona.com/brand/logo-mark.png",
      image: "https://kheelona.com/og.png",
      description: "Kheelona makes Kheelu, a screen-free talking friend for children aged 3 to 7.",
      foundingDate: "2025",
      founder: [
        {
          "@type": "Person",
          "@id": "https://kheelona.com/team#apoorva-sahu",
          name: "Apoorva Sahu",
          jobTitle: "Co-founder and CEO",
          url: "https://kheelona.com/team",
          sameAs: ["https://www.linkedin.com/in/sahu-apoorva/"],
        },
        {
          "@type": "Person",
          "@id": "https://kheelona.com/team#kashyap-c-r",
          name: "Kashyap C.R",
          url: "https://kheelona.com/team",
        },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Line one, Line two",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        postalCode: "560001",
        addressCountry: "IN",
      },
      areaServed: { "@type": "Country", name: "India" },
      sameAs: ["https://www.linkedin.com/company/kheelona/", "https://kheelona.ai"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "hello@kheelona.com",
        telephone: "+91 91875 46483",
        url: "https://wa.me/919187546483",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    });
  });

  it("leaves out every fact it is not given, instead of inventing one", () => {
    const node = organizationNode({ name: "Kheelona", legalName: "Kheelona Robotics Private Limited", logo: "/brand/logo-mark.png" });
    expect(Object.keys(node).sort()).toEqual(["@id", "@type", "legalName", "logo", "name", "url"]);
  });

  /* D038: memberships stay proof-gated (F11), so the builder has no way to publish one, and a
     value that reaches it anyway is dropped. */
  it("publishes no membership, even if one is passed in", () => {
    const smuggled = { ...facts, memberOf: [{ "@type": "Organization", name: "Some programme" }] } as OrganizationFacts;
    expect(JSON.stringify(organizationNode(smuggled))).not.toContain("memberOf");
  });

  /* `contactOption: "WhatsApp"` was a schema.org validation error on every live page (Ahrefs,
     2026-09-03): the channel is said with the wa.me url, which the builder keeps. */
  it("says the WhatsApp channel with a url, never with contactOption", () => {
    const node = JSON.stringify(organizationNode(facts));
    expect(node).not.toContain("contactOption");
    expect(node).toContain('"url":"https://wa.me/919187546483"');
  });

  it("refuses a profile listed twice or a profile that is not https", () => {
    expect(() => organizationNode({ ...facts, sameAs: ["https://kheelona.ai", "https://kheelona.ai"] })).toThrow(/twice/);
    expect(() => organizationNode({ ...facts, sameAs: ["http://kheelona.ai" as never] })).toThrow(/https/);
  });
});

describe("personIds", () => {
  /* The ids a BlogPosting author may take (task 2.13): exactly the people the Organization node
     publishes, founders and employees, under the ids personNode gives them. */
  it("lists the id of every founder and employee the Organization node publishes", () => {
    const withStaff: OrganizationFacts = { ...facts, employees: [{ name: "Ria Mangala Rewari" }] };
    const node = organizationNode(withStaff);
    expect(personIds(withStaff)).toEqual([...(node.founder ?? []), ...(node.employee ?? [])].map((p) => p["@id"]));
    expect(personIds(withStaff)).toEqual([
      "https://kheelona.com/team#apoorva-sahu",
      "https://kheelona.com/team#kashyap-c-r",
      "https://kheelona.com/team#ria-mangala-rewari",
    ]);
  });

  it("is empty when the Organization names nobody", () => {
    expect(personIds({ name: "Kheelona", legalName: "Kheelona Robotics Private Limited", logo: "/brand/logo-mark.png" })).toEqual([]);
  });
});
