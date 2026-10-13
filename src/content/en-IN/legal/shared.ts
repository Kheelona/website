import type { LegalTemplateCopy } from "@/content/types";
import { seller } from "../seller";

/**
 * The words LegalTemplate prints around every legal document, the same on privacy, terms, refund and shipping (task 4.5
 * item 3): the draft note above the hero while a document is a draft, the lead of its "Last updated" line, the contents
 * list's heading and the complaint-reference line of every grievance card, worded as privacy.md, terms.md, refund.md
 * and shipping.md word them (folds 0, 1 and 3; the grievance section). The reference close's help line is the one beside
 * every chilli button, seller.help itself.
 *
 * The complaint-reference line comes off all four pages until a system issues a reference (D055 item 7; task 6.7): the
 * words hold no `grievanceNote`, so every grievance card is its D032 line alone and promises nothing (ECOM-04, Rule
 * 7(1)(f), still open). When a reference exists, legal-requirements.md line 491's sentence goes here as `grievanceNote`.
 */
export const legalTemplateCopy = {
  draftNote: "Draft for the founder’s approval; not legal advice.",
  updated: "Last updated:",
  contents: "On this page",
  help: seller.help,
} as const satisfies LegalTemplateCopy;
