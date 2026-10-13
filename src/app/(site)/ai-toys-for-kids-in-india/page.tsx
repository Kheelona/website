import type { Metadata } from "next";
import { aiToysPage } from "@/content/en-IN/pages/ai-toys-for-kids-in-india";
import type { SitePath } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The buyer's guide (task 5.4; structure §3.1, §5): its content module through the page template, with the live offer.
 * Thin: every word is the module's (src/content/en-IN/pages/ai-toys-for-kids-in-india.ts). */

const PATH: SitePath = "/ai-toys-for-kids-in-india";

/* The description, the price answer, the close's price sentence and the buy bar show the price, so the page follows the
 * live mode (ADR-005; OFFER_REVALIDATE_SECONDS, written as a literal because Next reads it statically). */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({ ...aiToysPage.meta, path: PATH, offer: await getOffer() });
}

export default async function AiToysGuidePage() {
  return <PageTemplate page={aiToysPage} offer={await getOffer()} path={PATH} />;
}
