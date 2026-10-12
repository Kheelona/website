import {
  CONTACT_EMAIL,
  GSTIN,
  LEGAL_ENTITY,
  REGISTERED_ADDRESS,
  REGISTERED_ADDRESS_LINE,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";
import type { LeadText, RichTextString, SupportChat } from "@/content/types";
import { GRIEVANCE_ACK_HOURS, GRIEVANCE_RESOLUTION } from "./policies";

/**
 * Who sells Kheelu and how to reach them (architecture §6.1): the seller block, the support line,
 * the grievance officer and the WhatsApp chat bubble's words. The entity, GSTIN, address, number
 * and email are read from src/config/site.ts, which the store footer and the receipt emails
 * already print, so every surface says the same thing (owner page: wiki/product/policies.md,
 * "Seller details"; D029, D032, D034, D050).
 */

/** A help line: a short lead, then the WhatsApp and call links. */
export interface HelpLineCopy {
  readonly lead: string;
  readonly contact: RichTextString;
}

export interface Seller {
  readonly brand: string;
  readonly legalName: string;
  /** The short form the declarations use: "Kheelona Robotics Pvt Ltd" (D034). */
  readonly shortLegalName: string;
  readonly gstin: string;
  readonly address: typeof REGISTERED_ADDRESS;
  readonly addressLine: string;
  /** The footer's first legal line. */
  readonly copyright: RichTextString;
  /** Country of origin (D034). */
  readonly origin: { readonly country: string; readonly countryCode: "IN"; readonly line: string };
  /** Manufacturer and address, as the product page declares it (D034). */
  readonly manufacturer: string;
  readonly support: {
    /** "+91 91875 46483": WhatsApp and calls (D032). */
    readonly phone: string;
    readonly tel: `tel:${string}`;
    readonly whatsapp: `https://wa.me/${string}`;
    readonly email: string;
    /** The footer and store-footer contact line. */
    readonly line: RichTextString;
  };
  /** The help line beside every chilli button. */
  readonly help: HelpLineCopy;
  /** The store header's shorter help line. */
  readonly storeHelp: HelpLineCopy;
  /** The grievance officer (D029) and the D032 published line. */
  readonly grievance: {
    readonly name: string;
    readonly role: string;
    readonly email: string;
    readonly phone: string;
    readonly line: LeadText & { readonly lead: RichTextString; readonly text: RichTextString };
  };
  /** The WhatsApp chat bubble (D050). */
  readonly chat: SupportChat;
}

function present(value: string | null, name: string): string {
  if (value === null) throw new Error(`${name} is not set in src/config/site.ts; the seller block needs it.`);
  return value;
}

const email = present(CONTACT_EMAIL, "CONTACT_EMAIL");
const tel = `tel:${SUPPORT_WHATSAPP_DISPLAY.replace(/\s/g, "")}` as const;
/** The no-wrap on the whole link, as the mockup marks every phone link (`<a class="mk-nowrap">`): RichText renders
 *  `{nowrap:[…](tel:…)}` as `<a class="ks-nowrap">` (task 3.6). */
const phoneLink = `{nowrap:[${SUPPORT_WHATSAPP_DISPLAY}](${tel})}`;
const shortLegalName = "Kheelona Robotics Pvt Ltd";

export const seller = {
  brand: "Kheelona",
  legalName: LEGAL_ENTITY,
  shortLegalName,
  gstin: GSTIN,
  address: REGISTERED_ADDRESS,
  addressLine: REGISTERED_ADDRESS_LINE,
  copyright: `© 2026 ${LEGAL_ENTITY}`,
  origin: { country: "India", countryCode: "IN", line: "Made in India" },
  manufacturer: `${shortLegalName}, ${REGISTERED_ADDRESS_LINE}`,
  support: {
    phone: SUPPORT_WHATSAPP_DISPLAY,
    tel,
    whatsapp: SUPPORT_WHATSAPP_HREF as `https://wa.me/${string}`,
    email,
    line: `${phoneLink} (WhatsApp or call) · [${email}](mailto:${email})`,
  },
  help: {
    lead: "Questions?",
    contact: `[WhatsApp](${SUPPORT_WHATSAPP_HREF}) or {nowrap:[call ${SUPPORT_WHATSAPP_DISPLAY}](${tel})}`,
  },
  storeHelp: {
    lead: "Need help?",
    contact: `[WhatsApp](${SUPPORT_WHATSAPP_HREF}) or [call](${tel})`,
  },
  grievance: {
    name: "Aman Soni",
    role: "Co-Founder and CTO",
    email: "aman@kheelona.com",
    phone: SUPPORT_WHATSAPP_DISPLAY,
    line: {
      lead: "Grievance Officer:",
      text: `Aman Soni, Co-Founder and CTO, [aman@kheelona.com](mailto:aman@kheelona.com), ${phoneLink}. We acknowledge every complaint within ${GRIEVANCE_ACK_HOURS} hours and resolve it within ${GRIEVANCE_RESOLUTION} of receiving it.`,
    },
  },
  chat: {
    number: "919187546483",
    label: "Chat with us on WhatsApp",
    /** The laptop label reads the link's name (P13 default; WCAG 2.5.3, label in name). */
    shortLabel: "Chat with us on WhatsApp",
    texts: {
      site: "Hi Kheelona! I have a question about Kheelu.",
      store: "Hi Kheelona! I need help with my pre-order.",
      thanks: "Hi Kheelona! I have a question about my order.",
    },
  },
} satisfies Seller;
