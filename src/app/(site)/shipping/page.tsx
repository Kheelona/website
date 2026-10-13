import { legalTemplateCopy } from "@/content/en-IN/legal/shared";
import { shippingPage } from "@/content/en-IN/legal/shipping";
import type { SitePath } from "@/content/types";
import { LegalTemplate } from "@/layouts/LegalTemplate/LegalTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The shipping and delivery policy (task 5.14; structure §3.1, §5): its legal module through LegalTemplate's notice
 * family (refund and shipping; mockup-css-mapping §6.1), with the template's shared words and the live offer. Thin: every
 * word is the module's (src/content/en-IN/legal/shipping.ts) or the template's (legal/shared.ts).
 *
 * No buy bar (shipping.html meta `"buybar": false`) and no structured data beyond the shell's (architecture §9.2). The
 * title and description name no amount, so they read the same in both modes (pageMeta needs no offer). */

const PATH: SitePath = "/shipping";

/* The short version and the balance section name the advance, the balance and the total, so the page follows the live
 * mode (ADR-005; OFFER_REVALIDATE_SECONDS, written as a literal because Next reads it statically). */
export const revalidate = 300;

export const metadata = pageMeta({ ...shippingPage.meta, path: PATH });

export default async function ShippingPage() {
  return <LegalTemplate doc={shippingPage} variant="notice" copy={legalTemplateCopy} offer={await getOffer()} />;
}
