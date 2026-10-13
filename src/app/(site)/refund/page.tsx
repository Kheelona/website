import { legalTemplateCopy } from "@/content/en-IN/legal/shared";
import { refundPage } from "@/content/en-IN/legal/refund";
import type { SitePath } from "@/content/types";
import { LegalTemplate } from "@/layouts/LegalTemplate/LegalTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The refund page (task 5.13; structure §3.1, §5): its content module through the legal template's `notice` family
 * (refund and shipping), with the live offer and the template's shared words. Thin: every word is the module's
 * (src/content/en-IN/legal/refund.ts) or the template's (src/content/en-IN/legal/shared.ts). No JSON-LD beyond the
 * shell's (architecture §9.2). */

const PATH: SitePath = "/refund";

/* Part 1 names the advance and the balance, so the page follows the live mode (ADR-005; OFFER_REVALIDATE_SECONDS,
 * written as a literal because Next reads it statically). */
export const revalidate = 300;

/* The title and description name no amount, so they read the same in both modes (pageMeta needs no offer). */
export const metadata = pageMeta({ ...refundPage.meta, path: PATH });

export default async function RefundPage() {
  return <LegalTemplate doc={refundPage} variant="notice" copy={legalTemplateCopy} offer={await getOffer()} />;
}
