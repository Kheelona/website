/**
 * The one rupee formatter (architecture §3): the checkout's own, re-exported so
 * new code imports formatting from src/lib/format while the money stays in the
 * frozen block of src/config/site.ts (ADR-004, ADR-013). The argument is PAISE,
 * like every money constant: formatInr(499_900) is "₹4,999", formatInr(10_000_000)
 * is "₹1,00,000". (The design system's own helper takes rupees; this one does not.)
 */
export { formatInr } from "@/config/site";
