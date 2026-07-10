/** Site-wide constants. The pre-order flow is Tally-backed (blueprint §8.6);
 *  every page ends with FinaleCTA (id="reserve"), so CTAs anchor within the
 *  current page. Until the founder provides NEXT_PUBLIC_TALLY_FORM_URL the
 *  panel renders a flagged placeholder. */
export const PREORDER_HREF = "#reserve";

export const NAV_LINKS = [
  { label: "Meet Lumi", href: "/products/lumi" },
  { label: "How it works", href: "/playos" },
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
