import {
  LEGAL_ENTITY,
  GSTIN,
  REGISTERED_ADDRESS_LINE,
  CONTACT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/config/site";
import type { LegalSection } from "@/components/templates/LegalDoc";

/** The seller of record, as a shared LegalDoc section (2026-08-22, §8.25-d).
 *
 *  Four pages have to say who is taking the money: /terms, /refund, /shipping
 *  and /privacy. Written once here so a change of address or support channel
 *  cannot leave three pages agreeing and one wrong, which is exactly the drift
 *  the config-constant law exists to prevent. Razorpay's activation review
 *  looks for these details, and a parent about to pay ₹499 deserves to see
 *  them without hunting. */
export const SELLER_SECTION: LegalSection = {
  h: "Who you are buying from",
  ps: [
    `${LEGAL_ENTITY}, registered at ${REGISTERED_ADDRESS_LINE}. GSTIN ${GSTIN}.`,
    `Support is on WhatsApp at ${SUPPORT_WHATSAPP_DISPLAY}, or by email at ${CONTACT_EMAIL}. The WhatsApp number takes messages, not calls, because messages are how we can answer you properly.`,
  ],
};
