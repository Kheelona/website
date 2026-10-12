import { safetyPage } from "@/content/en-IN/pages/safety";
import type { SitePath } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The safety page (task 5.3; structure §3.1, §5): its content module through the page template, with the live offer.
 * Thin: every word is the module's (src/content/en-IN/pages/safety.ts). */

const PATH: SitePath = "/safety"; const NOTE = "Pre-order Kheelu";

/* The close's price sentence and the buy bar show the price, so the page follows the live mode (ADR-005;
 * OFFER_REVALIDATE_SECONDS, written as a literal because Next reads it statically). */
export const revalidate = 300;

/* The title and description name no amount, so they read the same in both modes (pageMeta needs no offer). */
export const metadata = pageMeta({ ...safetyPage.meta, path: PATH });

export default async function SafetyPage() {
  return <PageTemplate page={safetyPage} offer={await getOffer()} path={PATH} />;
}
