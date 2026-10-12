import { product as kheelu, type ProductFacts } from "./kheelu/product";

/**
 * The product registry (architecture §5.4): `src/app/(site)/products/[slug]` builds one page per
 * entry and nothing else (`dynamicParams = false`). A new product is a folder under products/ and
 * one line here; which checkout tiers it sells is a founder decision.
 */
export const products = { kheelu } as const satisfies Readonly<Record<string, ProductFacts>>;

export type ProductSlug = keyof typeof products;

export const productSlugs = Object.keys(products) as ProductSlug[];

/** The product for a URL slug, or undefined for anything not in the registry. */
export function getProduct(slug: string): ProductFacts | undefined {
  return Object.hasOwn(products, slug) ? products[slug as ProductSlug] : undefined;
}
