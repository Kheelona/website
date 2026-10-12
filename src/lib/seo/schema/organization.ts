import type { SitePath } from "@/content/types";
import { absoluteUrl, ORGANIZATION_ID, personId } from "../urls";
import { countryNode, definedOnly, profileLinks, type CountryCode, type HttpsUrl } from "./shared";

/**
 * The Organization node: who publishes the site (architecture §9.2). The site shell emits it once
 * per page, in `siteGraph()`; every other node refers to it by `ORGANIZATION_ID`.
 *
 * Facts come from content/en-IN/organization.ts and seller.ts (task 2.1). Deliberately missing:
 * `memberOf`, which stays proof-gated until F11 (D038), and `contactOption`, whose only valid values
 * are HearingImpairedSupported and TollFree ("WhatsApp" was a validation error on every live page;
 * the channel is said with the contact point's wa.me `url`).
 */

export interface PersonFacts {
  readonly name: string;
  readonly jobTitle?: string;
  readonly sameAs?: readonly HttpsUrl[];
}

export interface OrganizationFacts {
  readonly name: string;
  readonly legalName: string;
  /** The GSTIN: schema.org has no GST property; `taxID` is the national tax registration. */
  readonly taxId?: string;
  readonly description?: string;
  readonly logo: SitePath;
  readonly image?: SitePath;
  readonly foundingDate?: `${number}`;
  readonly address?: {
    readonly street: string;
    readonly locality: string;
    readonly region: string;
    readonly postalCode: string;
    readonly country: CountryCode;
  };
  readonly founders?: readonly PersonFacts[];
  readonly employees?: readonly PersonFacts[];
  /** Profiles the founder confirmed as official, each once. */
  readonly sameAs?: readonly HttpsUrl[];
  readonly areaServed?: CountryCode;
  readonly knowsAbout?: readonly string[];
  readonly contactPoint?: {
    readonly contactType: string;
    readonly email?: string;
    readonly telephone?: string;
    /** The channel, said as a link (a wa.me address for WhatsApp). */
    readonly url?: HttpsUrl;
    readonly areaServed?: CountryCode;
    readonly availableLanguage?: readonly string[];
  };
}

/** A person on the team page, under the id their byline references (`personId`). */
export function personNode(person: PersonFacts) {
  return definedOnly({
    "@type": "Person" as const,
    "@id": personId(person.name),
    name: person.name,
    jobTitle: person.jobTitle,
    url: absoluteUrl("/team"),
    sameAs: profileLinks(person.sameAs, `${person.name}'s profiles`),
  });
}

export function organizationNode(facts: OrganizationFacts) {
  const { address, contactPoint } = facts;
  return definedOnly({
    "@type": "Organization" as const,
    "@id": ORGANIZATION_ID,
    name: facts.name,
    legalName: facts.legalName,
    taxID: facts.taxId,
    url: absoluteUrl("/"),
    logo: absoluteUrl(facts.logo),
    image: facts.image && absoluteUrl(facts.image),
    description: facts.description,
    foundingDate: facts.foundingDate,
    founder: facts.founders?.map(personNode),
    employee: facts.employees?.map(personNode),
    address: address && {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    areaServed: facts.areaServed && countryNode(facts.areaServed),
    knowsAbout: facts.knowsAbout && [...facts.knowsAbout],
    sameAs: profileLinks(facts.sameAs, "Organization sameAs"),
    contactPoint:
      contactPoint &&
      definedOnly({
        "@type": "ContactPoint",
        contactType: contactPoint.contactType,
        email: contactPoint.email,
        telephone: contactPoint.telephone,
        url: contactPoint.url,
        areaServed: contactPoint.areaServed,
        availableLanguage: contactPoint.availableLanguage && [...contactPoint.availableLanguage],
      }),
  });
}

export type OrganizationNode = ReturnType<typeof organizationNode>;
