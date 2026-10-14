import type { OrganizationFacts as ContentOrganization } from "@/content/en-IN/organization";
import { siteGraph, type SchemaGraph } from "@/lib/seo/jsonld";
import { organizationNode, type OrganizationFacts as SchemaOrganization } from "@/lib/seo/schema/organization";
import { websiteNode } from "@/lib/seo/schema/website";

/**
 * The site graph (architecture §9.2; wave-2 close ruling): the content's Organization facts
 * (src/content/en-IN/organization.ts) turned into the input of `organizationNode()` (src/lib/seo), and the
 * Organization and WebSite nodes the site shell emits once per page. Neither type is renamed; task 4.4 reuses
 * `organizationFacts()` wherever the Organization input is needed again, so nothing restates it.
 *
 * Only what content holds goes in: no description and no `memberOf` (the proof gate is lifted, D054 item 20, but
 * /team states no relationship with the programmes it names: B26, team.md).
 */

/** The site's language: the root layout's `<html lang>` (src/app/layout.tsx) and the WebSite node's `inLanguage`. */
export const SITE_LANGUAGE = "en-IN";

const YEAR = /^\d{4}$/;

export function organizationFacts(org: ContentOrganization): SchemaOrganization {
  if (!YEAR.test(org.foundingDate)) {
    throw new Error(`organization.ts foundingDate must be a year for schema.org, not "${org.foundingDate}"`);
  }
  const { address, contactPoint } = org;
  return {
    name: org.name,
    legalName: org.legalName,
    taxId: org.taxId,
    logo: org.logo,
    image: org.image,
    foundingDate: org.foundingDate as `${number}`,
    address: {
      // As the live graph wrote it: the two street lines, then city, state and PIN in their own fields.
      street: `${address.line1}, ${address.line2}`,
      locality: address.city,
      region: address.state,
      postalCode: address.pincode,
      country: org.country,
    },
    founders: org.founders.map((founder) => ({ name: founder.name, jobTitle: founder.role, sameAs: [founder.sameAs] })),
    sameAs: org.sameAs,
    areaServed: contactPoint.areaServed,
    contactPoint: {
      contactType: contactPoint.contactType,
      email: contactPoint.email,
      telephone: contactPoint.telephone,
      url: contactPoint.url,
      areaServed: contactPoint.areaServed,
      availableLanguage: contactPoint.availableLanguage,
    },
  };
}

/** Who publishes the site, for the shell's one JSON-LD script. */
export function siteGraphOf(org: ContentOrganization): SchemaGraph {
  return siteGraph(organizationNode(organizationFacts(org)), websiteNode({ name: org.name, inLanguage: SITE_LANGUAGE }));
}
