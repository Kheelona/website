import type { LegalTemplateCopy } from "@/content/types";
import { seller } from "../seller";

/**
 * The words LegalTemplate prints around every legal document, the same on privacy, terms, refund and shipping (task 4.5
 * item 3): the draft note above the hero while a document is a draft, the lead of its "Last updated" line, the contents
 * list's heading and the complaint-reference line of every grievance card (an open fact: ECOM-04, Rule 7(1)(f)), worded
 * as privacy.md, terms.md, refund.md and shipping.md word them (folds 0, 1 and 3; the grievance section). The reference
 * close's help line is the one beside every chilli button, seller.help itself.
 */
export const legalTemplateCopy = {
  draftNote: "Draft for the founder’s approval; not legal advice.",
  updated: "Last updated:",
  contents: "On this page",
  grievanceNote: "{ph:how you get a complaint reference to track your complaint; not set up yet}",
  help: seller.help,
} as const satisfies LegalTemplateCopy;
