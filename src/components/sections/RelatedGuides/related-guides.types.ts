import type { Copy, RichTextString, SitePath } from "@/content/types";

/** A link the section shows: its words and where it goes on the site. */
export interface GuideLink {
  readonly title: RichTextString;
  readonly href: SitePath;
}

/**
 * RelatedGuides' configuration: the guides an article links to (its module's `related` slugs, worded and linked by
 * the template, task 4.2) and how they close the page:
 * - `related`: the band of related guides under an article with a close (story-*.html, after the column);
 * - `keep`: the keep-reading close that replaces the pre-order close (B5; the late-talker article), a tinted card
 *   ending on a secondary button to the hub.
 */
export interface RelatedGuidesConfig {
  readonly variant: "related" | "keep";
  /** "Related guides" or "Keep reading". */
  readonly title: Copy;
  readonly items: readonly GuideLink[];
  /** The secondary button after the rows (the keep card's link to the hub). */
  readonly action?: { readonly label: string; readonly href: SitePath };
  /** The heading's id, which names the section ("related-title" or "keep-title" by default). */
  readonly id?: string;
}
