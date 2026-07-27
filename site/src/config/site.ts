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

/** The ONLY sanctioned Kheelona+ wording (V3). The monthly price and what
 *  happens if the subscription lapses are BOTH founder-gated (V3-b): never
 *  render a ₹ amount for Kheelona+, and never claim post-lapse behaviour. */
export const KHEELONA_PLUS_LINE =
  "Every Lumi includes 6 months of Kheelona+, the stories, lessons, languages, and the parent app. The monthly price after that is announced before launch.";
/** Short form, for the finale's small print. */
export const KHEELONA_PLUS_SHORT = "Every Lumi includes 6 months of Kheelona+.";

/** WhatsApp share (V3, India's native referral loop — no backend). "Rs" not
 *  "₹" in the payload: the rupee sign garbles in some WhatsApp clients. */
export const WHATSAPP_SHARE_HREF = `https://wa.me/?text=${encodeURIComponent(
  `A screen-free talking friend that teaches, for ages ${LUMI_AGES}. First 500 units at Rs 4,999, no payment now: https://kheelona.com`,
)}`;
export const WHATSAPP_SHARE_LABEL = "Know a parent who needs this? Share Lumi on WhatsApp";
