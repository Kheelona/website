import type { Metadata } from "next";
import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import { homePage } from "@/content/en-IN/pages/home";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* Home, `/` (task 5.1; structure §3.1, §5): the page's content module through the page template, with the live offer.
 * Thin: no words here. Meta ViewContent reports on load with the offer's headline, the product page's payload
 * (architecture §8.2, B9). */

/* The page shows prices, so it follows the live mode (ADR-005; OFFER_REVALIDATE_SECONDS, written as a literal because
 * Next reads it statically). */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return pageMeta({ ...homePage.meta, path: "/", offer: await getOffer() });
}

export default async function HomePage() {
  const offer = await getOffer();
  return (
    <>
      <PageTemplate page={homePage} offer={offer} path="/" />
      <ViewContentTracker valuePaise={offer.headlinePaise} />
    </>
  );
}
