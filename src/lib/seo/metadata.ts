import type { Metadata } from "next";
import type { Copy, IsoDate, Meta, Offer, SitePath } from "@/content/types";
import { isModeVariant } from "@/lib/content/mode";
import { toPlainText } from "@/lib/content/plain-text";
import { leadWithHeadline, noTypedAmount } from "./price-lead";

/**
 * A page's metadata from its content module (ADR-012, architecture §9.1).
 *
 *   export const metadata = pageMeta({ ...page.meta, path: "/safety", offer });
 *
 * Four rules, each learned on the live site (lessons §1, §6; D028):
 *
 * 1. **The title is absolute.** `{ absolute }` ignores any parent title template, so the brand can
 *    never be doubled (it was, on production, for months). The words are the content module's.
 * 2. **Open Graph and Twitter are returned whole.** Next merges metadata key by key, so a page's
 *    `openGraph` replaces the layout's completely; a partial object once stripped `og:image` and
 *    `og:type` from all 31 pages.
 * 3. **Never a `robots` key** (N15). For the same reason, a page-level `robots` would replace the
 *    root layout's beta noindex. The return type cannot hold one, and the object is built field by
 *    field, so nothing in the input passes through.
 * 4. **Machine-read text leads with the total** (D028): with an offer, a title or description whose
 *    first amount is not the offer's headline amount stops the build. And every amount is a
 *    `{price:…}` token: a typed rupee amount in either mode's source stops the build, with or
 *    without an offer (task 2.13).
 *
 * Paths stay root-relative: the root layout's `metadataBase` (`CANONICAL_ORIGIN`) makes them
 * absolute, on the production origin in every environment (accepted on beta, N8).
 */

/** Every Open Graph card is 1200 x 630: `scripts/assets/build-og.mjs` renders them at that size and
 *  `test/guards/generated-icons.test.ts` checks it (task 1.5). */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

const SITE_NAME = "Kheelona";
const OG_LOCALE = "en_IN";

export interface PageMetaInput extends Meta {
  /** The page's own path: the canonical and `og:url`. No fragment, no query, no trailing slash. */
  readonly path: SitePath;
  /** Needed when the title or description changes with the offer mode or names an amount. */
  readonly offer?: Offer;
  /** Journal pieces: the stored dates and the byline, so share tools see an article. */
  readonly article?: {
    readonly published: IsoDate;
    readonly updated: IsoDate;
    readonly authors: readonly string[];
  };
}

/** Exactly the keys pageMeta sets; `robots` is not among them (N15). */
export type PageMetadata = Pick<Metadata, "title" | "description" | "alternates" | "openGraph" | "twitter">;

/** `/`, or slash-separated segments with no trailing slash, query or fragment. */
const CANONICAL_PATH = /^\/(?:[A-Za-z0-9._~%-]+(?:\/[A-Za-z0-9._~%-]+)*)?$/;

/** Every source string of a piece of copy: both modes of a variant, whichever one renders. */
function sources(copy: Copy): readonly string[] {
  return isModeVariant(copy) ? [copy.token, copy.full] : [copy];
}

export function pageMeta({ title, description, og, path, offer, article }: PageMetaInput): PageMetadata {
  if (!CANONICAL_PATH.test(path)) {
    throw new Error(`pageMeta: "${path}" cannot be a canonical (a site path without fragment, query or trailing slash)`);
  }
  for (const source of sources(title)) noTypedAmount(source, `The title of ${path}`);
  for (const source of sources(description)) noTypedAmount(source, `The meta description of ${path}`);
  const titleText = toPlainText(title, offer);
  const descriptionText = toPlainText(description, offer);
  if (offer) {
    leadWithHeadline(titleText, offer.prices.headline, `The title of ${path}`);
    leadWithHeadline(descriptionText, offer.prices.headline, `The meta description of ${path}`);
  }

  return {
    title: { absolute: titleText },
    description: descriptionText,
    alternates: { canonical: path },
    openGraph: {
      ...(article
        ? {
            type: "article",
            publishedTime: article.published,
            modifiedTime: article.updated,
            authors: [...article.authors],
          }
        : { type: "website" }),
      url: path,
      title: titleText,
      description: descriptionText,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      images: [{ url: og.image, ...OG_IMAGE_SIZE, alt: og.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descriptionText,
      images: [{ url: og.image, alt: og.alt }],
    },
  };
}
