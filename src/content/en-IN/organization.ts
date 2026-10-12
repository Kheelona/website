import type { Meta, SitePath } from "@/content/types";
import { seller } from "./seller";

/**
 * The facts behind the Organization and WebSite JSON-LD (architecture §6.1, §9.2), rendered once
 * by the site shell; the schema builders (src/lib/seo) take them as data. Owner page:
 * wiki/product/facts.md ("Identity", "Company facts the site uses as proof"). No `memberOf` and no
 * founder bios until each proof is filed in wiki/raw/ (D038, F11): schema never says more than the
 * page does. Paths are site paths; the builders make them absolute against the canonical origin.
 */

export interface Founder {
  readonly name: string;
  /** As the team page prints it. */
  readonly role: string;
  /** The fragment on /team that describes the person (stable `@id`, so bylines can point at it). */
  readonly anchor: string;
  /** The profile the team page links. */
  readonly sameAs: `https://${string}`;
}

export interface OrganizationFacts {
  readonly name: string;
  readonly legalName: string;
  /** The GSTIN (schema.org `taxID`). */
  readonly taxId: string;
  readonly logo: SitePath;
  readonly image: SitePath;
  readonly foundingDate: string;
  readonly address: typeof seller.address;
  readonly country: "IN";
  readonly sameAs: readonly `https://${string}`[];
  readonly contactPoint: {
    readonly email: string;
    readonly telephone: string;
    /** The channel itself: `contactOption` cannot say WhatsApp (an invalid value in schema.org). */
    readonly url: `https://${string}`;
    readonly contactType: "customer support";
    readonly areaServed: "IN";
    readonly availableLanguage: readonly string[];
  };
  readonly founders: readonly Founder[];
}

export const organization = {
  name: seller.brand,
  legalName: seller.legalName,
  taxId: seller.gstin,
  logo: "/brand/logo-mark.png",
  image: "/og.png",
  /* As the live Organization node states it (src/lib/seo.ts at the tag). */
  foundingDate: "2025",
  address: seller.address,
  country: seller.origin.countryCode,
  /* The five profiles the founder confirmed on 2026-09-05 (src/lib/seo.ts at the tag); add one only
     when the founder confirms it is official. */
  sameAs: [
    "https://www.linkedin.com/company/kheelona/",
    "https://www.instagram.com/kheelona/",
    "https://www.facebook.com/kheelona/",
    "https://play.google.com/store/apps/developer?id=Kheelona.com",
    "https://kheelona.ai",
  ],
  contactPoint: {
    email: seller.support.email,
    telephone: seller.support.phone,
    url: seller.support.whatsapp,
    contactType: "customer support",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  founders: [
    {
      name: "Apoorva Sahu",
      role: "Co-Founder and CEO",
      anchor: "apoorva-sahu",
      sameAs: "https://www.linkedin.com/in/sahu-apoorva/",
    },
    {
      name: "Aman Soni",
      role: "Co-Founder and CTO",
      anchor: "aman-soni",
      sameAs: "https://www.linkedin.com/in/aman-soni-6b17b6223/",
    },
    {
      name: "Kashyap C.R",
      role: "Co-Founder and Chief Hardware Officer",
      anchor: "kashyap-c-r",
      sameAs: "https://www.linkedin.com/in/kashyap-c-r-7ba18177/",
    },
  ],
} as const satisfies OrganizationFacts;

/** The byline of every guide the team wrote together; no card names a person (stories.md). */
export const TEAM_BYLINE = "The Kheelona team";

/** The default share card: public/og.png, Kheelu on its own fur, no text (assets.md), with the
 *  copy pages' words for it (home.md). For every page whose copy names no card of its own. */
export const DEFAULT_OG = {
  image: organization.image,
  alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
} as const satisfies Meta["og"];
