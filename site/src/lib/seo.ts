import { LAUNCH_PRICE, LATER_PRICE, LUMI_AGES, PLATFORM_AGES } from "@/config/site";

/** Structured data builders (V3 SEO/AEO/GEO pass, 2026-07-28).
 *
 *  Why this file exists: schema was scattered across page files, and the parts
 *  that matter most for AI citation were missing — the company as an ENTITY
 *  (with the founders' real credentials, which is our strongest E-E-A-T asset),
 *  the site itself, breadcrumbs, and the how-to/video/blog types that map onto
 *  the questions parents actually ask.
 *
 *  TWO RULES, both non-negotiable:
 *  1. **Schema may only ever describe copy visible on the page.** Google treats
 *     invisible schema as spam, and it breaks the honesty law this brand runs on.
 *  2. **No gated facts.** No ship date, no named language list, no Kheelona+
 *     price, no certification claims. Everything here is published on-site or on
 *     kheelona.ai. */

export const SITE_URL = "https://kheelona.com";

/** The founders, as entities. Their credentials are the site's best E-E-A-T
 *  signal and every one of them is published on /team. */
const FOUNDERS = [
  {
    "@type": "Person",
    name: "Apoorva Sahu",
    jobTitle: "Co-founder and CEO",
    description:
      "Chartered Accountant with fifteen years in finance and company-building, who grew up inside education businesses.",
    url: `${SITE_URL}/team`,
    sameAs: ["https://www.linkedin.com/in/sahu-apoorva/"],
  },
  {
    "@type": "Person",
    name: "Aman Soni",
    jobTitle: "Co-founder and CTO",
    description:
      "AI engineer with 14 patents filed in his own name. Owns the voice loop, the safety filters, and the small language model Kheelona trains itself.",
    url: `${SITE_URL}/team`,
    sameAs: ["https://www.linkedin.com/in/aman-soni-6b17b6223/"],
  },
  {
    "@type": "Person",
    name: "Kashyap C.R",
    jobTitle: "Co-founder and Chief Hardware Officer",
    description:
      "Hardware engineer who led Thunderbolt 4 and 5 compliance at Intel and has taken products from a blank page to certification for over a decade.",
    url: `${SITE_URL}/team`,
    sameAs: ["https://www.linkedin.com/in/kashyap-c-r-7ba18177/"],
  },
] as const;

/** The company as an entity. Entity recognition is what lets an answer engine
 *  say "Kheelona, an Indian company that makes…" instead of guessing. */
export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Kheelona",
  legalName: "Kheelona Robotics Pvt Ltd",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo-mark.png`,
  image: `${SITE_URL}/og.png`,
  description:
    "Kheelona makes screen-free talking friends for children. Lumi, the first one, is a plush toy for ages 2 to 5 that holds a real conversation, tells stories a child can question, and comes with a parent app that shows every word.",
  foundingDate: "2025",
  founders: FOUNDERS,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  areaServed: { "@type": "Country", name: "India" },
  knowsAbout: [
    "screen-free AI toys",
    "talking toys for children",
    "child-safe conversational AI",
    "early childhood learning",
    "Indian language voice technology",
  ],
  sameAs: ["https://kheelona.ai"],
} as const;

export const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Kheelona",
  inLanguage: "en-IN",
  publisher: { "@id": `${SITE_URL}/#organization` },
} as const;

/** Breadcrumbs. Answer engines use them to understand where a page sits, and
 *  Google shows them in results. Home is always the root. */
export function breadcrumbs(trail: readonly { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path === "/" ? "" : t.path}`,
    })),
  };
}

export function faqPage(items: readonly { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** The day-one HowTo. /setup is literally a four-step process, and "how do you
 *  set up an AI toy" is a question an answer engine can serve directly. */
export function setupHowTo(steps: readonly { title: string; body: string }[]) {
  return {
    "@type": "HowTo",
    name: "How to set up Lumi on day one",
    description:
      "Day one with Lumi takes minutes: charge it, set your languages and topics in the parent app, teach your child the wake word, and let them talk.",
    totalTime: "PT15M",
    supply: [{ "@type": "HowToSupply", name: "Lumi and its charger" }],
    tool: [{ "@type": "HowToTool", name: "The Kheelona parent app on a phone" }],
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title.replace(/\.$/, ""),
      text: s.body,
      url: `${SITE_URL}/setup`,
    })),
  };
}

/** The brand film. Video is cited heavily by AI Overviews, and this one is a
 *  real asset with a real poster. */
export const LAUNCH_VIDEO = {
  "@type": "VideoObject",
  name: "Two friends meet: Lumi by Kheelona",
  description:
    "A short film in which a child meets Lumi, the screen-free talking friend, for the first time.",
  thumbnailUrl: `${SITE_URL}/video/launch-poster.jpg`,
  contentUrl: `${SITE_URL}/video/launch.mp4`,
  uploadDate: "2026-07-08",
  publisher: { "@id": `${SITE_URL}/#organization` },
} as const;

/** The product. Kept in one place so the price can only ever come from the
 *  constants, and `availability` stays PreOrder until the founder says
 *  otherwise. No shipping date: it is not announced. */
export const LUMI_PRODUCT = {
  "@type": "Product",
  "@id": `${SITE_URL}/products/lumi#product`,
  name: "Lumi by Kheelona",
  brand: { "@type": "Brand", name: "Kheelona" },
  manufacturer: { "@id": `${SITE_URL}/#organization` },
  category: "Screen-free AI toy",
  audience: {
    "@type": "PeopleAudience",
    suggestedMinAge: 2,
    suggestedMaxAge: 5,
    audienceType: "Children",
  },
  description: `A screen-free talking friend for children aged ${LUMI_AGES} that holds a real conversation in up to 10 home languages, carries stories and lessons they can be quizzed on, plays your music over Bluetooth, and comes with a parent app that shows you everything. Part of a family of friends spanning ages ${PLATFORM_AGES}.`,
  image: `${SITE_URL}/product/lumi-blue-2.png`,
  offers: {
    "@type": "Offer",
    price: LAUNCH_PRICE.replace(/[^0-9]/g, ""),
    priceCurrency: "INR",
    availability: "https://schema.org/PreOrder",
    url: `${SITE_URL}/products/lumi`,
    eligibleRegion: { "@type": "Country", name: "India" },
    description: `${LAUNCH_PRICE} for the first 500 units, ${LATER_PRICE} after launch. No payment is taken at pre-order.`,
  },
} as const;

/** Wraps any set of nodes in one graph with the org and site attached, so every
 *  page contributes to one entity rather than repeating a standalone island. */
export function graph(...nodes: readonly object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [ORGANIZATION, WEBSITE, ...nodes],
  };
}
