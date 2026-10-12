import type { LegalPage } from "@/content/types";
import type { LegalVariant } from "@/layouts/LegalTemplate/legal-template.types";
import { privacyFixture } from "./privacy";
import { refundFixture } from "./refund";
import { shippingFixture } from "./shipping";
import { termsFixture } from "./terms";

/* The legal template's parity fixtures (task 4.3): the four approved legal pages as content, copied from
 * mockup/pages/{privacy,terms,refund,shipping}.html. The words the template prints around every one of them are content
 * (src/content/en-IN/legal/shared.ts, task 4.5), not a fixture. The test and the story render each with its family
 * (mockup-css-mapping §6.1). Never shipped. */

export type LegalSlug = "privacy" | "terms" | "refund" | "shipping";

export const LEGAL_FIXTURES: Readonly<Record<LegalSlug, { readonly doc: LegalPage; readonly variant: LegalVariant }>> = {
  privacy: { doc: privacyFixture, variant: "reference" },
  terms: { doc: termsFixture, variant: "reference" },
  refund: { doc: refundFixture, variant: "notice" },
  shipping: { doc: shippingFixture, variant: "notice" },
};

export const LEGAL_SLUGS = Object.keys(LEGAL_FIXTURES) as LegalSlug[];
