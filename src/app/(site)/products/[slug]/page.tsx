import type { Metadata } from "next";
import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import { productSlugs, type ProductSlug } from "@/content/en-IN/products";
import { kheeluPage } from "@/content/en-IN/products/kheelu/page";
import type { SitePath } from "@/content/types";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { getOffer } from "@/lib/offer/get-offer";
import { pageMeta } from "@/lib/seo/metadata";

/* A product page (structure §3.1, §5; architecture §5.4; task 5.2): the product's page module (products/<slug>/page.ts)
 * through PageTemplate with the live offer, and Meta's ViewContent with the offer's headline (B9, ADR-005: 4999 in
 * token mode, 7999 in full mode). Thin: no words here. */

/** Each product's page module. The `satisfies` refuses to compile until every product of the registry has its page.
 *  ViewContent's payload names Kheelu (tracking inventory §4), so a second product needs its own tracking decision. */
const pages = { kheelu: kheeluPage } as const satisfies Readonly<Record<ProductSlug, PageContent>>;

/* Only the products of the registry (content/en-IN/products) exist. With `dynamicParams = false` every other slug stops
 * at the router and the marketing 404 renders on the server; a `notFound()` thrown from a page would serve a blank
 * document instead (test/not-found-ssr.test.ts, lessons §1). */
export const dynamicParams = false;

/* The page shows the price, so it follows the live mode (ADR-005; OFFER_REVALIDATE_SECONDS, written as a literal because
 * Next reads it statically). */
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams(): { slug: string }[] {
  return productSlugs.map((slug) => ({ slug }));
}

/** The product page for a prerendered slug. Any other slug never reaches the page (dynamicParams = false). */
async function productOf({ params }: Props): Promise<{ page: PageContent; path: SitePath }> {
  const { slug } = await params;
  if (!Object.hasOwn(pages, slug)) throw new Error(`/products/${slug} is not in the product registry, yet reached the page`);
  return { page: pages[slug as ProductSlug], path: `/products/${slug}` };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { page, path } = await productOf(props);
  return pageMeta({ ...page.meta, path, offer: await getOffer() });
}

export default async function ProductPage(props: Props) {
  const { page, path } = await productOf(props);
  const offer = await getOffer();
  return (
    <>
      <PageTemplate page={page} offer={offer} path={path} />
      <ViewContentTracker valuePaise={offer.headlinePaise} />
    </>
  );
}
