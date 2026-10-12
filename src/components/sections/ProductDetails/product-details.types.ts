import type { Copy, IconText, RichTextString, SitePath } from "@/content/types";

/** A term and its value; a list of values prints one line each (consumer care's ways to reach us). Same shape as the
 *  product facts' `SpecRow` (products/kheelu/product.ts). */
export interface DetailRow {
  readonly term: string;
  readonly value: RichTextString | readonly RichTextString[];
}

/**
 * ProductDetails' configuration: the product's details panels and declarations (products/kheelu/product.ts, with
 * their open F4 facts as placeholders) and the words around them (the product page, task 5.2).
 */
export interface ProductDetailsConfig {
  readonly heading: { readonly eyebrow?: Copy; readonly title: Copy };
  readonly specs: { readonly title: string; readonly rows: readonly DetailRow[] };
  readonly box: { readonly title: string; readonly items: readonly IconText[] };
  readonly safety: { readonly title: string; readonly items: readonly IconText[] };
  readonly declarations: { readonly title: string; readonly rows: readonly DetailRow[] };
  /** The ghost link after the fold (to the returns and warranty terms). */
  readonly link?: { readonly label: string; readonly href: SitePath };
}
