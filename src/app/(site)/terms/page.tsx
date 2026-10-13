import type { Metadata } from "next";
import { legalTemplateCopy } from "@/content/en-IN/legal/shared";
import { termsPage } from "@/content/en-IN/legal/terms";
import type { SitePath } from "@/content/types";
import { LegalTemplate } from "@/layouts/LegalTemplate/LegalTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The pre-order terms (task 5.12; structure §3.1, §5): its legal module through LegalTemplate's reference family
 * (privacy and terms; mockup-css-mapping §6.1), with the template's shared words and the live offer. Thin: every word is
 * the module's (src/content/en-IN/legal/terms.ts) or the template's (legal/shared.ts).
 *
 * No buy bar (terms.html meta `"buybar": false`) and no structured data beyond the shell's (architecture §9.2). */

const PATH: SitePath = "/terms";

/* The page names amounts and its words change with the offer mode (terms.md folds 2 and 4), so it follows the live mode
 * (ADR-005; OFFER_REVALIDATE_SECONDS, written as a literal because Next reads it statically). */
export const revalidate = 300;

/* The meta description leads with the live total (D028), so the head reads the offer too. */
export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({ ...termsPage.meta, path: PATH, offer: await getOffer() });
}

export default async function TermsPage() {
  return <LegalTemplate doc={termsPage} variant="reference" copy={legalTemplateCopy} offer={await getOffer()} />;
}
