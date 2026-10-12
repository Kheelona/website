import type { Article, ArticleCard, IsoDate } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { DEFAULT_OG, organization, TEAM_BYLINE } from "../../organization";
import type { ArticleSlug } from "../../routes";

/**
 * The article stub builder (architecture §6.1; task 2.1 acceptance 5). Eighteen of the 21 articles
 * wait for their rewrite (tasks 5.17-5.19). Until then each keeps its URL, its live first-published
 * date and three related links (so no article is a dead end), and shows the hub's title and summary
 * over one open paragraph: beta prints the placeholder, and the production build refuses it
 * (task 2.9). A rewrite replaces the module's stubArticle() call with the full article.
 *
 * This file holds only what is open, so it goes once no body is open: the folder test in
 * articles.test.ts asks for that, and the production build refuses its two constants. The byline
 * and the share card are permanent and live in organization.ts.
 */

/** The body of an article whose rewrite is not written yet. */
export const ARTICLE_REWRITE_PENDING = "{ph:ARTICLE rewrite pending}";

/** The body of a rewritten article whose approved copy is not yet in its module (task 5.6). */
export const ARTICLE_PORT_PENDING = "{ph:ARTICLE body from the approved mockup}";

/** The meta title limit (architecture §9.1). */
const TITLE_LIMIT = 60;

export interface StubInput {
  readonly slug: ArticleSlug;
  /** The hub's title and one-line summary for this guide (stories.md folds 2-5). */
  readonly card: ArticleCard;
  /** Only where the card title is over the 60-character meta limit. */
  readonly metaTitle?: string;
  readonly related: readonly [ArticleSlug, ArticleSlug, ArticleSlug];
  /** The live article's dates (src/lib/stories*.ts at the freeze tag), never computed at build. */
  readonly published: IsoDate;
  readonly updated: IsoDate;
}

/**
 * The page's whole title (pageMeta's `absolute`, ADR-012): the hub's title with the brand, as the
 * rewritten articles carry it, unless the brand would take it over the limit. Shortening a title to
 * make room would be new copy.
 */
function absoluteTitle(title: string): string {
  const branded = `${title} · ${organization.name}`;
  return toPlainText(branded).length <= TITLE_LIMIT ? branded : title;
}

/** An article that waits for its rewrite. */
export function stubArticle({ slug, card, metaTitle, related, published, updated }: StubInput): Article {
  return {
    slug,
    meta: { title: absoluteTitle(metaTitle ?? card.title), description: card.summary, og: DEFAULT_OG },
    card,
    related,
    published,
    updated,
    head: { title: card.title, author: TEAM_BYLINE },
    body: [{ kind: "part", blocks: [{ kind: "p", text: ARTICLE_REWRITE_PENDING }] }],
    sources: [],
    close: "journal",
  };
}
