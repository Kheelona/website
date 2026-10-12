import type { Crumb } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import type { Article, IsoDate } from "@/content/types";

/**
 * ArticleHead's configuration: the article module's head and first-published date (src/content/types.ts), the crumbs
 * (the hub, then the article's topic: the template finds the topic in the hub) and the words around them, all from
 * content.
 */
export interface ArticleHeadConfig {
  readonly head: Article["head"];
  /** The stored first-published date (never computed at build). */
  readonly published: IsoDate;
  readonly trail: readonly Crumb[];
  readonly labels: {
    /** The crumbs' accessible name: "Breadcrumb". */
    readonly breadcrumb: string;
    /** Before the date: "First published". */
    readonly published: string;
    /** "4 min read", worded by the template; left out while an article has none. */
    readonly readTime?: string;
  };
  /** The h1's id, which names the article ("story-title" by default). */
  readonly titleId?: string;
}
