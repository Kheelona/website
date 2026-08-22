/** Site-wide constants.
 *
 *  Since 2026-08-22 the pre-order is a PAID reservation: a refundable token
 *  taken through Razorpay on store.kheelona.com (§8.25).
 *
 *  Since 2026-08-23 every pre-order CTA goes STRAIGHT to the store, in one tap
 *  (founder call, §8.25-b). CTAs used to anchor to the finale first so that a
 *  parent read the price, the refund promise and the ship date before a payment
 *  form could open. The store page carries all three itself, above its own form,
 *  so the second tap bought no extra honesty and cost completions. Every page
 *  still ends in FinaleCTA (id="reserve"): the mobile guide hides against that
 *  anchor and LegalDoc appends it, so the id is layout, not a route.
 *
 *  MONEY LAW: amounts live here once, in PAISE, and every rupee string is
 *  derived from them. A price change is one integer. Nothing anywhere else may
 *  hardcode a rupee amount, and nothing may hardcode a paise amount that a
 *  payment request could read (test/preorder-money.test.ts guards both). */

/** The store host. Same repo, reached through the host rewrite in src/proxy.ts
 *  (§8.25-a), so the design system and the brand laws stay in one place. */
export const STORE_URL = "https://store.kheelona.com";

/** Where every "Pre-order Lumi" button goes. One tap from anywhere on the site
 *  to the page that takes the payment. */
export const PREORDER_HREF = STORE_URL;

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
  /* Real pages since 2026-08-22. They were 301s to /terms while nothing could
     be refunded or shipped; money changes that, and Razorpay's own review
     looks for both by name. */
  { label: "Refunds", href: "/refund" },
  { label: "Shipping", href: "/shipping" },
  { label: "Setup", href: "/setup" },
] as const;

/* ── Money ──────────────────────────────────────────────────────────────── */

/** Indian rupee formatting, one implementation. Intl gives the lakh grouping
 *  correctly, which a naive toLocaleString on the wrong locale does not. */
export function formatInr(paise: number): string {
  return `₹${new Intl.NumberFormat("en-IN").format(Math.round(paise / 100))}`;
}

/** The pre-order price, held for the first PREORDER_CAP_UNITS units. */
export const LAUNCH_AMOUNT_PAISE = 499_900;
/** The launch price, once the capped units are gone: paid in full, upfront.
 *  Founder 2026-08-23: after the cap, there is no token and no balance. */
export const FULL_AMOUNT_PAISE = 799_900;
/** The token that reserves a capped unit. Refundable until dispatch. */
export const TOKEN_AMOUNT_PAISE = 49_900;
/** What is left to pay when the unit is ready. Derived, never typed twice:
 *  a token change must move the balance in the same breath. */
export const BALANCE_AMOUNT_PAISE = LAUNCH_AMOUNT_PAISE - TOKEN_AMOUNT_PAISE;

export const LAUNCH_PRICE = formatInr(LAUNCH_AMOUNT_PAISE);
export const FULL_PRICE = formatInr(FULL_AMOUNT_PAISE);
export const TOKEN_PRICE = formatInr(TOKEN_AMOUNT_PAISE);
export const BALANCE_PRICE = formatInr(BALANCE_AMOUNT_PAISE);

/** The whole of the urgency, since 2026-08-23 (founder: the 30 September date
 *  deadline is retired ENTIRELY). ₹4,999 holds while fewer than this many
 *  launch-priced orders are paid; the switch is decided on the server from a
 *  live Supabase count (`lib/store/mode.ts`) and the count itself is never
 *  published — pages and APIs carry only which MODE the store is in. A refund
 *  reopens a slot, deliberately: the paid queue is the truth (§8.25-ee), so
 *  the cap counts it rather than keeping a second opinion. */
export const PREORDER_CAP_UNITS = 500;
/** The offer term as prose, derived so copy can never drift from the gate. */
export const CAP_UNITS_TEXT = `first ${PREORDER_CAP_UNITS} units`;

/** The one CTA verb (R9 law), founder-chosen 2026-08-22. No number on the
 *  button: the amount is settled in the panel beside it, so this label never
 *  needs editing when a price moves, and it reads the same in a 15px navbar
 *  as it does in a hero. */
export const PREORDER_LABEL = "Pre-order Lumi";

/** The standard reassurance caption under a pre-order button. */
export const PRICE_CAPTION = `${TOKEN_PRICE} now, ${BALANCE_PRICE} on dispatch. Fully refundable until we ship.`;
/** Taxes, founder-confirmed 2026-08-22: every price published on this site is
 *  GST-inclusive, so the number a parent reads is the number they pay. Indian
 *  packaged-goods practice expects that said out loud, and it removes the one
 *  question a price with no tax note always raises. */
export const TAX_LINE = "All prices include GST.";

/** The hero and finale offer line. Two clauses, no paraphrase anywhere else —
 *  V6 D11 holds: three wordings of one price read as three offers, so this
 *  string and PRICE_CAPTION are the only two allowed. */
export const PREORDER_OFFER_LINE = `${TOKEN_PRICE} reserves one of the ${CAP_UNITS_TEXT} at ${LAUNCH_PRICE}. ${FULL_PRICE} once they are gone.`;
/** The hold promise (V6 D11): one sentence, one source. Still exactly true of
 *  a paid reservation, so it survives the money change unchanged. */
export const PRICE_HOLD_LINE = "We hold the price, you hold your place.";

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

/** Ship date (founder, 2026-08-23: moved from 1 October). Render from these,
 *  never inline, so a logistics change is a one-file edit. */
export const SHIP_DATE_TEXT = "20 October 2026";
export const SHIP_DATE_ISO = "2026-10-20";

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
export const LANGUAGES_LINE = `${LUMI_LANGUAGES.slice(0, -1).join(", ")}, and ${
  LUMI_LANGUAGES[LUMI_LANGUAGES.length - 1]
}`;

/** WhatsApp share (V3, India's native referral loop — no backend). "Rs" not
 *  "₹" in the payload: the rupee sign garbles in some WhatsApp clients. Leads
 *  with the token, which is the easy number to pass along, and carries the
 *  unit-cap urgency (2026-08-23: the date deadline is gone). */
export const WHATSAPP_SHARE_HREF = `https://wa.me/?text=${encodeURIComponent(
  `A screen-free talking friend that teaches, for ages ${LUMI_AGES}. Rs ${TOKEN_AMOUNT_PAISE / 100} reserves one of the ${CAP_UNITS_TEXT} at Rs ${LAUNCH_AMOUNT_PAISE / 100}, fully refundable: ${STORE_URL}`,
)}`;
export const WHATSAPP_SHARE_LABEL = "Know a parent who needs this? Share Lumi on WhatsApp";

/** V3 (AEO): journal freshness. Answer engines weight recency, and the honest
 *  signal we have is the month the whole journal was written and verified
 *  (documented in docs/qa-report.md). NOT per-article publication dates —
 *  those would be invented. Update this when the journal is next reviewed. */
export const JOURNAL_REVIEWED = "July 2026";

/** The contact email. Founder-confirmed 2026-07-28 as a monitored inbox. */
export const CONTACT_EMAIL: string | null = "hello@kheelona.com";

/* ── Seller of record ───────────────────────────────────────────────────── */

/** Founder-supplied 2026-08-22 from the GST registration certificate
 *  (REG-06, approved 26/11/2025). A page that takes money has to say who is
 *  taking it: this block prints on /contact, /refund, /shipping, the store
 *  footer and every acknowledgement email, and Razorpay's activation review
 *  looks for exactly these details. */
export const LEGAL_ENTITY = "Kheelona Robotics Private Limited";
export const GSTIN = "29AAMCK1530E1ZN";
export const REGISTERED_ADDRESS = {
  line1: "5th Floor, No 51 (Old Site No 1)",
  line2: "Kokarya Business Synergy Center, 5th Main, 5th Block Jayanagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560041",
  country: "India",
} as const;
export const REGISTERED_ADDRESS_LINE = `${REGISTERED_ADDRESS.line1}, ${REGISTERED_ADDRESS.line2}, ${REGISTERED_ADDRESS.city} ${REGISTERED_ADDRESS.pincode}, ${REGISTERED_ADDRESS.state}, ${REGISTERED_ADDRESS.country}`;

/** Support line, founder-supplied 2026-08-22. WhatsApp ONLY, and every visible
 *  label must say so: the number does not answer calls, and a support channel
 *  that does not answer is worse than none. This is the first phone number this
 *  site has ever published — the one on the legacy Wix site was the canonical
 *  fake Indian number and was deliberately never carried over. */
export const SUPPORT_WHATSAPP_DISPLAY = "+91 91875 46483";
export const SUPPORT_WHATSAPP_HREF = "https://wa.me/919187546483";
export const SUPPORT_WHATSAPP_LABEL = `WhatsApp ${SUPPORT_WHATSAPP_DISPLAY}`;

/* ── Measurement ────────────────────────────────────────────────────────── */

/** GA4, wired 2026-07-28 (founder's property: stream "kheelona.com",
 *  https://kheelona.com, stream id 15336032355, enhanced measurement ON).
 *
 *  Hardcoded on purpose. A measurement ID is a public client-side identifier,
 *  not a secret — Google's own snippet ships it in the page.
 *
 *  GA4_HOSTS is the reason this is safe to hardcode: the tag loads ONLY on
 *  these hostnames, so localhost and preview deploys never pollute the real
 *  property. store.kheelona.com joined the list on 2026-08-22 — the standing
 *  law is that this list moves whenever the production hosts move, and the
 *  store is where the purchase event now fires. */
export const GA4_MEASUREMENT_ID = "G-7LMKSFEXZ9";
export const GA4_HOSTS = ["kheelona.com", "www.kheelona.com", "store.kheelona.com"] as const;

/** Ahrefs Web Analytics, added 2026-07-30 at the founder's request.
 *
 *  A public site key, like the GA4 measurement ID above. Unlike GA4 this one is
 *  NOT host-gated, and that is a deliberate trade: Ahrefs verifies an install
 *  by fetching the page and looking for the tag, so a client-side gate would
 *  leave the script out of the HTML source and verification would keep
 *  failing. The cost is that local and preview page views reach the property. */
export const AHREFS_ANALYTICS_KEY = "N7vd/jLtIIlHqzFqu57UBg";
