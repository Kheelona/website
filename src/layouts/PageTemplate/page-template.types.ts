import type { Copy, Meta } from "@/content/types";
import type { ProductFacts as ProductSchemaFacts } from "@/lib/seo/schema/product";
import type { SectionEntry } from "../sections-registry";

/*
 * A page as its content module holds it (task 4.1; architecture §5.4, §6.1): its meta, its folds in order, and the
 * structured-data nodes it declares. A marketing page, a campaign landing page or a product page is one of these and
 * nothing else: the module ends with `satisfies PageContent`, its route renders it with PageTemplate, and a new page
 * needs no component (brief §6).
 */

/** The Product node's facts as content holds them (architecture §9.2): the descriptions are copy, since they name
 *  the offer's amount and change with its mode; the Offer's url is the page's own path, which the template knows. */
export type ProductSchemaCopy = Omit<ProductSchemaFacts, "path" | "description" | "offerDescription"> & {
  readonly description: Copy;
  readonly offerDescription: Copy;
};

/**
 * A node the page declares (architecture §9.2): a product page's Product with its Offer, /team's AboutPage and
 * /contact's ContactPage. The FAQPage and a HowTo are never declared: the template reads them off the page's own
 * sections (a FAQ fold, an opted-in answer block, a steps fold with `howTo`), so they say exactly what the page shows.
 */
export type PageSchema =
  | { readonly kind: "product"; readonly product: ProductSchemaCopy }
  | { readonly kind: "about-page" | "contact-page"; readonly name: Copy; readonly description?: Copy };

export interface PageContent {
  /** Title, description and Open Graph image, as the copy page words them (`pageMeta` in the route). */
  readonly meta: Meta;
  /** The folds, in page order; the first is the page's one h1 section (sections-registry `PAGE_HEADING_KINDS`). */
  readonly sections: readonly SectionEntry[];
  readonly schema?: readonly PageSchema[];
}
