import type { Copy, ImageRef, RichTextString, SitePath } from "@/content/types";

/** The rewritten guide a topic features: the card words from the article's own module, its head photo, its link. */
export interface TopicGuideCard {
  readonly title: RichTextString;
  readonly summary: RichTextString;
  readonly href: SitePath;
  readonly image: ImageRef;
  /** "Read the guide · 3 min read", worded by the hub page. */
  readonly linkLabel: string;
}

/** Another guide of the topic: a row, linked once its guide has a page of its own. */
export interface TopicGuideRow {
  readonly title: RichTextString;
  readonly summary: RichTextString;
  readonly href?: SitePath;
}

/**
 * TopicSection's configuration: one topic of the stories hub (topics.ts: anchor id, heading and lead; hub.ts: which
 * guide it features and which it lists, in order; each card's words from the article's module).
 */
export interface TopicSectionConfig {
  readonly topic: { readonly id: string; readonly title: Copy; readonly lead?: Copy };
  readonly featured?: TopicGuideCard;
  readonly items: readonly TopicGuideRow[];
  /** The cream band: the hub alternates bands from its second topic. */
  readonly band?: boolean;
}
