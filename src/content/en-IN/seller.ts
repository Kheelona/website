import {
  CONTACT_EMAIL,
  LEGAL_ENTITY,
  REGISTERED_ADDRESS,
  REGISTERED_ADDRESS_LINE,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";
import type { HelpLineCopy, LeadText, RichTextString, SupportChat } from "@/content/types";
import { GRIEVANCE_ACK_HOURS, GRIEVANCE_RESOLUTION } from "./policies";

/** A help line: a short lead, then the WhatsApp link (the call came off with D063 item 2). A content shape
 *  (src/content/types.ts, since task 4.5: the legal template's words carry one), named here too for the modules that
 *  import it from the seller. */
export type { HelpLineCopy };

/**
 * Who sells Kheelu and how to reach them (architecture §6.1): the seller block, the support line,
 * the grievance officer and the WhatsApp chat bubble's words. The entity, address, number and email
 * are read from src/config/site.ts, which the receipt emails also print, so every surface says the
 * same thing (owner page: wiki/product/policies.md, "Seller details"; D029, D032, D034, D050).
 *
 * D063 items 2-3 (confirmed by D064 item 11; task Q2.3): the website prints no GSTIN (src/config/site.ts
 * keeps it for the receipt emails and invoices), and the number shows only on /contact and the legal
 * pages, where the E-Commerce Rules want a customer-care number (r.4(2)(d); legal-requirements ECOM-01,
 * ECOM-02): `support.line` and `grievance.line` there. Every other line (the help lines, the footers',
 * the store's) keeps WhatsApp and the email, without the number or a call link.
 */

type GrievanceLine = LeadText & { readonly lead: RichTextString; readonly text: RichTextString };

export interface Seller {
  readonly brand: string;
  readonly legalName: string;
  /** The short form the declarations use: "Kheelona Robotics Pvt Ltd" (D034). */
  readonly shortLegalName: string;
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
    /** /contact's seller block: the number (WhatsApp or call) and the email (ECOM-01). */
    readonly line: RichTextString;
    /** The footer's and the store footer's contact line: WhatsApp and the email, no number (D063 item 2). */
    readonly footerLine: RichTextString;
    /** "WhatsApp or email hello@…", for a sentence that offers both (setup's close, two guides; D063 item 2). */
    readonly reach: RichTextString;
  };
  /** The help line beside every chilli button: WhatsApp, no number (D063 item 2). */
  readonly help: HelpLineCopy;
  /** The store header's help line: the help line's words since task Q2.12 (one wording everywhere, CMO m9). */
  readonly storeHelp: HelpLineCopy;
  /** The grievance officer (D029) and the D032 published line. */
  readonly grievance: {
    readonly name: string;
    readonly role: string;
    readonly email: string;
    readonly phone: string;
    /** /contact and the legal pages (ECOM-02): with the number. */
    readonly line: GrievanceLine;
    /** The store footer's: the same words without the number (D063 item 2). */
    readonly footerLine: GrievanceLine;
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
const emailLink = `[${email}](mailto:${email})`;
/** The D032 line around its contacts: the officer and his email, then the response times. The number goes between
 *  them only where the rules want it (D063 item 2). */
const grievanceLead = "Grievance Officer:";
const grievanceOfficer = "Aman Soni, Co-Founder and CTO, [aman@kheelona.com](mailto:aman@kheelona.com)";
const grievanceTimes = `We acknowledge every complaint within ${GRIEVANCE_ACK_HOURS} hours and resolve it within ${GRIEVANCE_RESOLUTION} of receiving it.`;
/** The help lines' one link (D063 item 2: the call came off; WhatsApp stays). */
const whatsappUs = `[WhatsApp us](${SUPPORT_WHATSAPP_HREF})`;

export const seller = {
  brand: "Kheelona",
  legalName: LEGAL_ENTITY,
  shortLegalName,
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
    line: `${phoneLink} (WhatsApp or call) · ${emailLink}`,
    footerLine: `[WhatsApp](${SUPPORT_WHATSAPP_HREF}) · ${emailLink}`,
    reach: `[WhatsApp](${SUPPORT_WHATSAPP_HREF}) or email ${emailLink}`,
  },
  help: {
    lead: "Questions?",
    contact: whatsappUs,
  },
  /* The help line's words in the store's header too (the D2C plan v2 §1.1 and §10, CMO m9; task Q2.12): "Questions?" in
     place of the mockup's "Need help?", so a parent reads one help line on every page. */
  storeHelp: {
    lead: "Questions?",
    contact: whatsappUs,
  },
  grievance: {
    name: "Aman Soni",
    role: "Co-Founder and CTO",
    email: "aman@kheelona.com",
    phone: SUPPORT_WHATSAPP_DISPLAY,
    line: { lead: grievanceLead, text: `${grievanceOfficer}, ${phoneLink}. ${grievanceTimes}` },
    footerLine: { lead: grievanceLead, text: `${grievanceOfficer}. ${grievanceTimes}` },
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
