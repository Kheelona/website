/** Site-wide constants. The pre-order flow is Tally-backed (blueprint §8.6);
 *  every page ends with FinaleCTA (id="reserve"), so CTAs anchor within the
 *  current page. Until the founder provides NEXT_PUBLIC_TALLY_FORM_URL the
 *  panel renders a flagged placeholder. */
export const PREORDER_HREF = "#reserve";

export const NAV_LINKS = [
  { label: "Meet Lumi", href: "/products/lumi" },
  // R11 (founder): the tab is the platform's name — the page and Home both
  // say PlayOS, so the nav saying "How it works" read as a different place
  { label: "PlayOS", href: "/playos" },
  { label: "Safety", href: "/safety" },
  { label: "Stories", href: "/stories" },
  { label: "Team", href: "/team" },
] as const;

export const FOOTER_LINKS = [
  ...NAV_LINKS,
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Setup", href: "/setup" },
] as const;

export const LAUNCH_PRICE = "₹4,999";
export const LATER_PRICE = "₹9,999";

/* R11 consistency audit: the price strings above were imported by ONE file
   while ~30 call sites hardcoded the rupee values, and the reserve wording
   drifted per page. These are load-bearing marketing claims — they live
   here once. A price change is now a one-file edit. */

/** The one CTA verb (R9 law), long form — section CTAs. */
export const RESERVE_LABEL = `Reserve Lumi at ${LAUNCH_PRICE}`;
/** Short form — navbar + sticky bar, where width is tight. */
export const RESERVE_LABEL_SHORT = `Reserve at ${LAUNCH_PRICE}`;
/** The standard reassurance caption under a reserve button. */
export const PRICE_CAPTION = `${LATER_PRICE} after launch. No payment now.`;
/** The launch-cap line (R9, founder-supplied real number). */
export const CAP_LINE = `First 500 units at ${LAUNCH_PRICE}. ${LATER_PRICE} after launch. No payment now.`;

/* V3 (founder 2026-07-27, from the YC application): Lumi's own age band and
   the platform arc it grows into. These replace the retired "3 to 10" law —
   render age copy from here so the two can never drift again. */
export const LUMI_AGES = "2 to 5";
export const PLATFORM_AGES = "2 to 14";

/** The ONLY sanctioned Kheelona+ wording (V3; updated 2026-07-31 when the
 *  founder cleared HALF of gate V3-b): Lumi's smart features are LIFETIME —
 *  that is the post-lapse answer — and pricing stays deliberately open-ended
 *  as "announced soon" (founder: no details yet). STILL GATED: any ₹ amount
 *  for Kheelona+. */
export const KHEELONA_PLUS_LINE =
  "Every Lumi includes 6 months of Kheelona+, the stories, lessons, languages, and the parent app. Lumi's smart features are yours for life, and Kheelona+ pricing is announced soon.";
/** Short form, for the finale's small print. */
export const KHEELONA_PLUS_SHORT = "Every Lumi includes 6 months of Kheelona+.";

/** Ship date (founder, 2026-07-31): the gate is CLEARED. Render from these,
 *  never inline, so a logistics change is a one-file edit. */
export const SHIP_DATE_TEXT = "1 September 2026";
export const SHIP_DATE_ISO = "2026-09-01";

/** The announced languages (founder, 2026-07-31 — "they are final"). Eight
 *  named today; the published ceiling stays "up to 10", so two more can land
 *  without any copy change. Render the list from here (AEO: the named list is
 *  the strongest answer content this product has). */
export const LUMI_LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Telugu",
  "Tamil",
  "Kannada",
  "Spanish",
  "French",
] as const;
export const LANGUAGES_LINE =
  "English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, and French";

/** WhatsApp share (V3, India's native referral loop — no backend). "Rs" not
 *  "₹" in the payload: the rupee sign garbles in some WhatsApp clients. */
export const WHATSAPP_SHARE_HREF = `https://wa.me/?text=${encodeURIComponent(
  `A screen-free talking friend that teaches, for ages ${LUMI_AGES}. First 500 units at Rs 4,999, no payment now: https://kheelona.com`,
)}`;
export const WHATSAPP_SHARE_LABEL = "Know a parent who needs this? Share Lumi on WhatsApp";

/** V3 (AEO): journal freshness. Answer engines weight recency, and the honest
 *  signal we have is the month the whole journal was written and verified
 *  (documented in docs/qa-report.md). NOT per-article publication dates —
 *  those would be invented. Update this when the journal is next reviewed. */
export const JOURNAL_REVIEWED = "July 2026";

/** The contact email. Founder-confirmed 2026-07-28 as a monitored inbox.
 *
 *  The old Wix site published this address beside "+91 98765 43210" — the
 *  canonical fake Indian phone number — so the email was confirmed separately
 *  before use and the phone number was NOT carried over. If a phone line ever
 *  becomes real, it needs the same confirmation. */
export const CONTACT_EMAIL: string | null = "hello@kheelona.com";

/** The Tally pre-order form (the founder's; 5 fields as of 2026-07-31:
 *  parent name, kid's age, city, WhatsApp number, WhatsApp consent).
 *
 *  Hardcoded for the same reason as the GA4 ID below: it is a public
 *  identifier the live site prints in every reserve panel, and hardcoding it
 *  lets the PREVIEW and local builds render the real form — the founder asked
 *  to review the form on the demo site (2026-07-31). NEXT_PUBLIC_TALLY_FORM_URL
 *  still overrides when set, so the production env config keeps working
 *  unchanged. Submissions from preview/local are REAL submissions in Tally;
 *  delete test entries there. */
export const TALLY_FORM_URL = "https://tally.so/r/Y5XW7J";

/** GA4, wired 2026-07-28 (founder's property: stream "kheelona.com",
 *  https://kheelona.com, stream id 15336032355, enhanced measurement ON).
 *
 *  Hardcoded on purpose. A measurement ID is a public client-side identifier,
 *  not a secret — Google's own snippet ships it in the page — and the env var
 *  this replaces (`NEXT_PUBLIC_GA4_MEASUREMENT_ID`) was never read by anything,
 *  so keeping it would have added a founder gate for no security gain.
 *
 *  GA4_HOSTS is the reason this is safe to hardcode: the tag loads ONLY on
 *  these hostnames. Without that, every localhost run and every preview deploy
 *  would report into the founder's real property, and analytics you cannot
 *  trust is worse than none. Add a host here when a new production domain goes
 *  live, not when a preview URL changes. */
export const GA4_MEASUREMENT_ID = "G-7LMKSFEXZ9";
export const GA4_HOSTS = ["kheelona.com", "www.kheelona.com"] as const;

/** Ahrefs Web Analytics, added 2026-07-30 at the founder's request.
 *
 *  A public site key, like the GA4 measurement ID above — it identifies the
 *  property, it does not authorise anything, and Ahrefs' own instructions have
 *  you paste it into public HTML.
 *
 *  Unlike GA4 this one is NOT host-gated, and that is a deliberate trade. Ahrefs
 *  verifies an installation by fetching the page and looking for the tag, so a
 *  client-side gate would leave the script out of the HTML source and the
 *  "Recheck installation" button would keep failing. The cost is that local and
 *  preview page views reach the property. If that noise ever matters, the fix is
 *  the GA4_HOSTS pattern plus re-verifying by another method. */
export const AHREFS_ANALYTICS_KEY = "N7vd/jLtIIlHqzFqu57UBg";
