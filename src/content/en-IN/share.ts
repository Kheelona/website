import { CANONICAL_ORIGIN } from "@/config/env";
import { WHATSAPP_SHARE_LABEL } from "@/config/site";
import type { OfferShareCopy } from "@/content/types";

/**
 * The "Share Kheelu on WhatsApp" link under the offer cards on Home (fold 9) and the product page (fold 3): D061 and the
 * main session's ruling on the share link (wiki/qa/cmo-review-advisor-proposal-2026-10-15.md, AP-28; task 8c.2).
 * src/lib/offer/offer.ts resolves it for the live mode into the offer, and OfferSection renders it through `Button`
 * (tracked `share-whatsapp`, architecture §8.3).
 *
 * - The label is the live site's own (WHATSAPP_SHARE_LABEL, src/config/site.ts), reused word for word. The old share
 *   link (WHATSAPP_SHARE_HREF) stays as it is, pinned in the frozen money block (ADR-013), and is never used here: its
 *   message said "talking friend that teaches" and "first 500".
 * - The message is new, a draft the founder signs at Gate B (D015): it leads with the total, incl. GST (D028, as for ad
 *   text), names the advance only as refundable (DARK-03), never "first 500" (D041 as D061 changed it allows that line on
 *   the cards alone). Its first two sentences follow the approved H1 (D045). Full mode has no advance, so its last
 *   sentence is the approved full-mode price sentence (home.md "At a glance"; offer.ts `sentence.full`).
 * - For the founder's sign-off: the prices reach the payload as the site prints them, with the rupee sign, because the
 *   message takes tokens only (task 8c.2). The live site's message wrote "Rs" instead: its note
 *   (WHATSAPP_SHARE_HREF, src/config/site.ts) says the rupee sign garbles in some WhatsApp clients. Before Gate B the
 *   message is opened on an Android and an iOS WhatsApp; if the sign garbles, the main session decides whether the
 *   payload takes an "Rs" form of the token (a new price format in src/lib/offer/, never a typed amount).
 * - The address is kheelona.com, tagged as docs/utm-conventions.md says for a link a parent passes on in WhatsApp
 *   (source `whatsapp`, medium `referral`, campaign `<yyyy-mm>-<slug>`): exactly what `npm run utm -- --source=whatsapp
 *   --medium=referral --campaign=2026-10-share --path=/` prints (share.test.ts). It is only ever words inside the
 *   message, never a link on a page (the conventions' rule 2).
 */
export const share = {
  label: WHATSAPP_SHARE_LABEL,
  href: "https://wa.me/",
  text: {
    token:
      "Kheelu is a screen-free talking toy for children aged 3 to 7. It answers every why, then asks one back. {price:headline} (incl. GST); pre-order with {price:token} today, refundable until dispatch.",
    full: "Kheelu is a screen-free talking toy for children aged 3 to 7. It answers every why, then asks one back. {price:full} (incl. GST), paid in full when you order.",
  },
  address: `${CANONICAL_ORIGIN}/?utm_source=whatsapp&utm_medium=referral&utm_campaign=2026-10-share`,
} as const satisfies OfferShareCopy;
