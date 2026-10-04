import type { Metadata } from "next";
import {
  LAUNCH_PRICE,
  FULL_PRICE,
  CAP_UNITS_TEXT,
  LAUNCH_AMOUNT_PAISE,
  TOKEN_PRICE,
  BALANCE_PRICE,
  KHEELU_AGES,
  CONTACT_EMAIL,
  SHIP_DATE_ISO,
  LEGAL_ENTITY,
  GSTIN,
  REGISTERED_ADDRESS,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";
import { KHEELU_ART } from "./kheelu-art";
import { productProperties } from "./product-facts";

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

/** The social preview image. One source, because a page that loses it shares
 *  with a blank card and nobody notices until someone looks at a WhatsApp
 *  forward. Root-relative; `metadataBase` in the root layout resolves it. */
export const OG_IMAGE = "/og.png";

const TEAM_URL = `${SITE_URL}/team`;

/** The founders, as entities. Their credentials are the site's best E-E-A-T
 *  signal and every one of them is published on /team.
 *
 *  Each carries a stable `@id` since 2026-09-05 (§8.35-d): a fragment on the
 *  page where the person is described. Every journal byline now REFERENCES
 *  that `@id` instead of repeating a bare name, so an answer engine sees one
 *  author entity with a bio and a LinkedIn profile behind nineteen articles,
 *  not nineteen strings that happen to match. */
const FOUNDERS = [
  {
    "@type": "Person",
    "@id": `${TEAM_URL}#apoorva-sahu`,
    name: "Apoorva Sahu",
    jobTitle: "Co-founder and CEO",
    description:
      "Chartered Accountant with fifteen years in finance and company-building, who grew up inside education businesses.",
    url: `${SITE_URL}/team`,
    sameAs: ["https://www.linkedin.com/in/sahu-apoorva/"],
  },
  {
    "@type": "Person",
    "@id": `${TEAM_URL}#aman-soni`,
    name: "Aman Soni",
    jobTitle: "Co-founder and CTO",
    description:
      "AI engineer with 14 patents filed in his own name. Owns the voice loop, the safety filters, and the small language model Kheelona trains itself.",
    url: `${SITE_URL}/team`,
    sameAs: ["https://www.linkedin.com/in/aman-soni-6b17b6223/"],
  },
  {
    "@type": "Person",
    "@id": `${TEAM_URL}#kashyap-c-r`,
    name: "Kashyap C.R",
    jobTitle: "Co-founder and Chief Hardware Officer",
    description:
      "Hardware engineer who led Thunderbolt 4 and 5 compliance at Intel and has taken products from a blank page to certification for over a decade.",
    url: `${SITE_URL}/team`,
    sameAs: ["https://www.linkedin.com/in/kashyap-c-r-7ba18177/"],
  },
] as const;

/** Ria writes six of the nineteen journal pieces and is on /team, so she is an
 *  entity too: `employee`, not `founder`, because that is what the page says.
 *  Bio sentence is the published /team card, shortened, nothing added. */
const RIA = {
  "@type": "Person",
  "@id": `${TEAM_URL}#ria-mangala-rewari`,
  name: "Ria Mangala Rewari",
  jobTitle: "Head of Marketing",
  description:
    "Co-founded and ran a marketing agency for seven years, and has trained more than 1,000 students and entrepreneurs in digital marketing.",
  url: TEAM_URL,
  sameAs: ["https://www.linkedin.com/in/ria-mangala/"],
} as const;

/** Byline name → entity `@id`. Every `Story.author` must resolve here
 *  (pinned in seo.test); an article by someone not on /team is a review flag,
 *  because the E-E-A-T claim behind the byline would have nothing behind it. */
export const AUTHORS: Readonly<Record<string, string>> = Object.fromEntries(
  [...FOUNDERS, RIA].map((person) => [person.name, person["@id"]]),
);

/** The author node a BlogPosting carries: a reference, never a second copy.
 *  The full Person lives once, inside the Organization on the same page. */
export function authorRef(name: string) {
  const id = AUTHORS[name];
  if (!id) throw new Error(`No author entity for "${name}": add them to /team and lib/seo first`);
  return { "@id": id };
}

/** The company as an entity. Entity recognition is what lets an answer engine
 *  say "Kheelona, an Indian company that makes…" instead of guessing. */
export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Kheelona",
  legalName: LEGAL_ENTITY,
  /* Published from the GST certificate 2026-08-22. schema.org has no GSTIN
     property; taxID is the standard place for a national tax registration. */
  taxID: GSTIN,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo-mark.png`,
  image: `${SITE_URL}${OG_IMAGE}`,
  description:
    "Kheelona makes screen-free talking friends for children. Kheelu, the first one, is a plush toy for ages 3+ that holds a real conversation, tells stories a child can question, and comes with a parent app that shows every word.",
  foundingDate: "2025",
  /* `founder`, not `founders`: the plural is deprecated and superseded, and
     Ahrefs flagged it four times per page on all 31 (2026-09-03). Same value,
     current property name. */
  founder: FOUNDERS,
  employee: [RIA],
  address: {
    "@type": "PostalAddress",
    /* Full registered address since 2026-08-22: a merchant taking payment has
       to publish where it is, and the same block prints on /contact, /refund
       and /shipping. */
    streetAddress: `${REGISTERED_ADDRESS.line1}, ${REGISTERED_ADDRESS.line2}`,
    addressLocality: REGISTERED_ADDRESS.city,
    addressRegion: REGISTERED_ADDRESS.state,
    postalCode: REGISTERED_ADDRESS.pincode,
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
  /* Entity corroboration (2026-09-05, §8.35-e). Until this round the only
     `sameAs` was kheelona.ai, a domain we also own, which gives an answer
     engine nothing independent to confirm that "Kheelona" is one company.
     These five were confirmed by the founder on 2026-09-05. The two app-store
     listings identify the APP, not the company, so they live in llms.txt and
     not here. Add a profile only when the founder confirms it is official. */
  sameAs: [
    "https://www.linkedin.com/company/kheelona/",
    "https://www.instagram.com/kheelona/",
    "https://www.facebook.com/kheelona/",
    "https://play.google.com/store/apps/developer?id=Kheelona.com",
    "https://kheelona.ai",
  ],
  /* Restates the visible "Recognised by" strip, for the two entries that are
     membership programmes by definition. Karnataka Elevate and Founders Inc
     stay visible-only until the founder names the relationship (award? grant?
     investor?), because schema must never say more than the page does. */
  memberOf: [
    { "@type": "Organization", name: "NVIDIA Inception Program" },
    { "@type": "Organization", name: "nasscom startups" },
  ],
  /* Only listed because both channels are confirmed answered. Schema must never
     promise a channel that does not answer, which is why this site published no
     telephone for its first year: the number on the legacy Wix site was the
     canonical fake Indian number.
     The number below is real (founder, 2026-08-22) but takes WhatsApp ONLY, and
     the `url` below is how that is said in schema. Every visible label on the
     site says "WhatsApp" for the same reason. */
  ...(CONTACT_EMAIL
    ? {
        contactPoint: {
          "@type": "ContactPoint",
          email: CONTACT_EMAIL,
          telephone: SUPPORT_WHATSAPP_DISPLAY,
          contactType: "customer support",
          /* NOT `contactOption: "WhatsApp"`. That shipped for two weeks and was
             a schema.org VALIDATION ERROR on all 31 pages (Ahrefs, 2026-09-03):
             `contactOption` takes a ContactPointOption, an enumeration whose
             only members are HearingImpairedSupported and TollFree. "WhatsApp"
             is not one, so the value was simply invalid — the old comment here
             called it "the honest way to say that in schema" and was wrong.
             The honest AND valid way is the url: it names the exact channel,
             a parser can follow it, and a human can click it. */
          url: SUPPORT_WHATSAPP_HREF,
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      }
    : {}),
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
    name: "How to set up Kheelu on day one",
    description:
      "Day one with Kheelu takes minutes: charge it, set your languages and topics in the parent app, teach your child the wake word, and let them talk.",
    totalTime: "PT15M",
    supply: [{ "@type": "HowToSupply", name: "Kheelu and its charger" }],
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
  name: "Two friends meet: Kheelu by Kheelona",
  description:
    "A short film in which a child meets Kheelu, the screen-free talking friend, for the first time.",
  thumbnailUrl: `${SITE_URL}/video/launch-poster.jpg`,
  contentUrl: `${SITE_URL}/video/launch.mp4`,
  uploadDate: "2026-07-08",
  publisher: { "@id": `${SITE_URL}/#organization` },
} as const;

/** The product. Kept in one place so the price can only ever come from the
 *  constants, and `availability` stays PreOrder until the founder says
 *  otherwise. The ship date became a published fact on 2026-07-31
 *  (availabilityStarts below). */
export const KHEELU_PRODUCT = {
  "@type": "Product",
  /* THE @id DELIBERATELY STILL SAYS `lumi`, AND MUST. It is an opaque stable
     identifier, not a link: it is how every consumer that already knows this
     product recognises it as the SAME product after the 2026-09-05 rename
     rather than a new one. Changing it would discard whatever entity history
     Google, Bing and the answer engines have accumulated against it, which is
     the one thing a rename is supposed to preserve.
     The navigable address is `offers.url` and the canonical below; those moved.
     Never surface this string in the UI, and never "fix" it to match the route.
     Pinned by src/lib/seo.test.ts. */
  "@id": `${SITE_URL}/products/lumi#product`,
  name: "Kheelu by Kheelona",
  /* THE RENAME, STATED IN THE GRAPH (2026-09-11, §8.36-a).
     Measured on Perplexity on 2026-09-11, six days after the rename: asked what
     Kheelona makes, it answered "its flagship product is a talking robot
     companion called Lumi". Seven of its ten citations were third-party
     profiles — the Play Store listing, YNOS, F6S, LinkedIn, Internshala — and
     every one of them still says Lumi. The site was right and was outvoted.
     `alternateName` is the one field that lets a retrieval model reconcile the
     two names into ONE product instead of guessing which is current, and it
     pairs with the `@id` above, which deliberately still reads `lumi` for
     exactly the same continuity reason (§8.32-b). Remove this only when the
     off-site profiles have been corrected and stayed corrected. */
  alternateName: "Lumi",
  brand: { "@type": "Brand", name: "Kheelona" },
  manufacturer: { "@id": `${SITE_URL}/#organization` },
  category: "Screen-free AI toy",
  audience: {
    "@type": "PeopleAudience",
    /* Ages 3+ since 2026-08-23 (founder decision #8): a minimum with no
       maximum, because the published range has no ceiling any more. */
    suggestedMinAge: 3,
    audienceType: "Children",
  },
  description: `A screen-free talking friend for children aged ${KHEELU_AGES} that holds a real conversation in up to 10 home languages, carries stories and lessons they can be quizzed on, plays your music over Bluetooth, and comes with a parent app that shows you everything. Part of a growing family of friends.`,
  image: `${SITE_URL}${KHEELU_ART.src}`,
  /* The published specification, as structured properties (§8.36-a).
     One array, shared with the visible table on /ai-toys-for-kids-in-india, so
     a machine and a parent are told the same things. `productProperties()`
     drops the rows whose honest answer is "not announced yet" — an unannounced
     spec is the absence of a fact, not a fact. See src/lib/product-facts.ts. */
  additionalProperty: productProperties(),
  isFamilyFriendly: true,
  offers: {
    "@type": "Offer",
    /* Derived from the paise constant, not scraped out of the display string
       with a regex (2026-08-22): the money now has one numeric source and a
       schema price is a number, so it should read the number.

       No priceValidUntil since 2026-08-23: the offer is bounded by a unit
       count, not a date, and schema.org has no way to say that. A lapsed
       validity date would make Google drop the Offer on a day nothing about
       the offer changed, so the honest markup is a price with the unit terms
       stated in prose. The manual sell-out sweep (FOUNDER-TODO) updates this
       price the day the capped units are gone. */
    price: LAUNCH_AMOUNT_PAISE / 100,
    priceCurrency: "INR",
    availability: "https://schema.org/PreOrder",
    availabilityStarts: SHIP_DATE_ISO,
    url: `${SITE_URL}/products/kheelu`,
    eligibleRegion: { "@type": "Country", name: "India" },
    description: `${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT}, ${FULL_PRICE} once they are gone. A refundable ${TOKEN_PRICE} reserves one of the ${CAP_UNITS_TEXT}, with the ${BALANCE_PRICE} balance due before dispatch.`,
  },
} as const;

/** One source for a route's title, description, canonical and `og:url`.
 *
 *  Why this exists (2026-08-12): Next does NOT derive `og:url` from
 *  `alternates.canonical`. Every page set the canonical and none set the og
 *  url, so all 29 URLs shipped incomplete Open Graph markup — the whole of
 *  Ahrefs' "Open Graph tags incomplete" warning, and the reason a shared link
 *  had no canonical identity of its own. Taking both from ONE `path` argument
 *  makes it impossible for the canonical and the og url to drift apart, which
 *  is the registry law (§8.19) applied to metadata.
 *
 *  `path` is root-relative ("/", "/products/kheelu"); `metadataBase` in the root
 *  layout resolves it to the apex, which is the canonical host. */
export function pageMeta({
  title,
  description,
  path,
  article,
}: {
  title: string;
  description: string;
  path: string;
  /** Journal pieces only (2026-09-05, §8.35): declares the page an article to
   *  every share and citation tool, with the dates and author the BlogPosting
   *  already carries. Marketing routes leave it out and stay `website`. */
  article?: { publishedTime: string; modifiedTime: string; authors: readonly string[] };
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    /* THE WHOLE OPEN GRAPH OBJECT, not just the url, and that is the fix.
     *
     * Next merges metadata SHALLOWLY: a page's `openGraph` REPLACES the root
     * layout's, it does not merge into it. This function used to return
     * `openGraph: { url: path }`, which silently deleted the four fields the
     * layout sets — `type`, `siteName`, `locale` and `images` — from every
     * single page that calls it.
     *
     * Ahrefs Site Audit, crawl of 2026-09-03: "Open Graph tags incomplete" on
     * 31 of 31 pages, `og:type` missing on all 31. Confirmed in the served HTML:
     * only og:title, og:description and og:url were present anywhere.
     *
     * The expensive half is `og:image`. Every WhatsApp, Facebook and LinkedIn
     * share of this site rendered with NO preview image, on a product whose
     * India referral loop is a WhatsApp share (WHATSAPP_SHARE_HREF). og.png
     * existed and was declared; no page ever carried it.
     *
     * Repeating the fields here rather than hoping for a merge is the only
     * thing that actually works, and `src/lib/seo.test.ts` pins all four so a
     * future edit cannot quietly drop them again. */
    openGraph: {
      url: path,
      title,
      description,
      siteName: "Kheelona",
      locale: "en_IN",
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: [...article.authors],
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

/** The entity graph: who publishes this site. Emitted ONCE per page, by
 *  `SiteChrome`, which every marketing route renders exactly once.
 *
 *  This used to be `graph(...nodes)`, which prepended the two entities to
 *  whatever a page passed in — and SiteChrome called it too. The result shipped
 *  live for months: two `<script type="application/ld+json">` elements per page,
 *  each declaring its own `Organization` and `WebSite` under the same `@id`.
 *  Verified on the production HTML 2026-09-05, on all nine pages that built a
 *  graph of their own.
 *
 *  Duplicate nodes under one `@id` are not fatal — a consumer reconciles them —
 *  but they are the sort of thing that makes an answer engine trust a page less,
 *  and this site's whole organic position rests on being cleanly parseable.
 *  Splitting the two callers apart makes the duplication unrepresentable.
 *
 *  `graph()` is DELETED rather than renamed, so a stale call is a build error
 *  rather than a silent second Organization (the `PLATFORM_AGES` convention). */
export function siteEntityGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [ORGANIZATION, WEBSITE],
  };
}

/** A page's own nodes: Product, FAQPage, BreadcrumbList, BlogPosting, HowTo.
 *
 *  No Organization and no WebSite — SiteChrome already published both, and a
 *  node here that needs to point at the publisher does it by `@id` reference
 *  (`{ "@id": "https://kheelona.com/#organization" }`), which is what the
 *  existing `publisher` and `manufacturer` fields already do. That is the whole
 *  point of `@id`: say the entity once, refer to it everywhere else. */
export function pageGraph(...nodes: readonly object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [...nodes],
  };
}

/** JSON-LD as text, safe to put inside a script element (F-10).
 *
 *  Ten pages inject their structured data with `dangerouslySetInnerHTML`, which
 *  is the standard way to do this and is fine as long as the serialised JSON can
 *  never contain the four characters that end a script element. Every value on
 *  this site is a constant we wrote, so there is nothing to inject today. The
 *  hole is that "today" is a property of the current content rather than of the
 *  code: the first time an article title, a testimonial, or a product field is
 *  fed in from anywhere else, `</script>` inside it would close the element and
 *  everything after it would be markup.
 *
 *  So the escaping happens here, once, at the boundary, instead of depending on
 *  the next edit to remember. A JSON parser reads a unicode escape as the
 *  character it names, so this changes nothing about the data Google receives.
 *
 *  Built from a character code rather than written as an escape sequence,
 *  because the whole point is to be legible about which characters leave. */
const BACKSLASH = String.fromCharCode(92);

export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(
    /[<>&]/g,
    (character) => `${BACKSLASH}u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}
