import type { LegalPage, LegalTemplateCopy, LegalVariant } from "@/layouts/LegalTemplate/legal-template.types";
import { privacyFixture } from "./privacy";
import { refundFixture } from "./refund";
import { shippingFixture } from "./shipping";
import { termsFixture } from "./terms";

/* The legal template's parity fixtures (task 4.3): the four approved legal pages as content, and the words the
 * template prints around every one of them, copied from mockup/pages/{privacy,terms,refund,shipping}.html. The test
 * and the story render each with its family (mockup-css-mapping §6.1). Never shipped. */

/** The words the four mockups print around their documents: the draft note, the "Last updated" lead, the contents
 *  heading and the grievance card's complaint-reference line (privacy.html:9, 15, 44, 291; refund.html:10, 15, 53,
 *  134; terms.html:13, 19, 52, 225; shipping.html:11, 16, 53, 119). */
export const legalCopyFixture = {
  draftNote: "Draft for the founder’s approval; not legal advice.",
  updated: "Last updated:",
  contents: "On this page",
  grievanceNote: "{ph:how you get a complaint reference to track your complaint; not set up yet}",
} as const satisfies LegalTemplateCopy;

export type LegalSlug = "privacy" | "terms" | "refund" | "shipping";

export const LEGAL_FIXTURES: Readonly<Record<LegalSlug, { readonly doc: LegalPage; readonly variant: LegalVariant }>> = {
  privacy: { doc: privacyFixture, variant: "reference" },
  terms: { doc: termsFixture, variant: "reference" },
  refund: { doc: refundFixture, variant: "notice" },
  shipping: { doc: shippingFixture, variant: "notice" },
};

export const LEGAL_SLUGS = Object.keys(LEGAL_FIXTURES) as LegalSlug[];
