import { ARTICLE_SLUGS, type ArticleSlug } from "@/content/en-IN/routes";
import { articles } from "@/content/en-IN/stories/articles";
import type { Article, SitePath } from "@/content/types";
import { CTAS, type CtaPlacement } from "@/lib/tracking/cta";

/**
 * Where the phone buy bar shows (structure §5, "Sticky bar" column). The site shell is a layout and cannot know its page,
 * so it hands the bar the list of paths it belongs on and the bar reads its own path (StickyBuyBar.client.tsx).
 *
 * The list is the CTA registry's placements for `sticky-bar` (src/lib/tracking/cta.ts, architecture §8.3; checked
 * against the approved mockups by test/guards/tracking-registry.test.ts), so the bar appears exactly where its tracking
 * value is registered, with the "articles-with-close" group resolved from each article's own `close`: an article whose
 * close carries the pre-order button carries the bar too; the keep-reading close (B5) carries neither. The closes are
 * read from the article registry (src/content/en-IN/stories/articles/index.ts, task 4.2), so a new article is its
 * module, its line there and its slug in routes.ts, never an edit here.
 */

/** Each article's close, by slug: "journal" carries the pre-order button, "keep" does not (B5). */
export const ARTICLE_CLOSES: Readonly<Record<ArticleSlug, Article["close"]>> = Object.fromEntries(
  ARTICLE_SLUGS.map((slug) => [slug, articles[slug].close]),
) as Record<ArticleSlug, Article["close"]>;

/** The paths that carry the bar: the registry's placements in its order, then the articles with a pre-order close. */
export function stickyBarPaths(placements: readonly CtaPlacement[] = CTAS["sticky-bar"].pages): SitePath[] {
  const paths: SitePath[] = [];
  for (const placement of placements) {
    if (placement.startsWith("/")) paths.push(placement as SitePath);
    else if (placement === "articles-with-close") {
      for (const slug of ARTICLE_SLUGS) if (ARTICLE_CLOSES[slug] === "journal") paths.push(`/stories/${slug}`);
    } else {
      throw new Error(`stickyBarPaths cannot place the sticky bar on "${placement}" (src/lib/tracking/cta.ts)`);
    }
  }
  return [...new Set(paths)];
}
