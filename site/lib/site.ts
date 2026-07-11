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
