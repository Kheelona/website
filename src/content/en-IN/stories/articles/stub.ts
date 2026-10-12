import type { Article, ArticleCard, IsoDate, Meta } from "@/content/types";
import type { ArticleSlug } from "../../routes";

/**
 * The article stub builder (architecture §6.1; task 2.1 acceptance 5). Eighteen of the 21 articles
 * wait for their rewrite (tasks 5.17-5.19). Until then each keeps its URL, its live first-published
 * date and three related links (so no article is a dead end), and shows the hub's title and summary
 * over one open paragraph: beta prints the placeholder, and the production build refuses it
 * (task 2.9). A rewrite replaces the module's stubArticle() call with the full article; the last
 * one deletes this file.
 */

/** The body of an article whose rewrite is not written yet. */
export const ARTICLE_REWRITE_PENDING = "{ph:ARTICLE rewrite pending}";

/** The body of a rewritten article whose approved copy is not yet in its module (task 5.6). */
export const ARTICLE_PORT_PENDING = "{ph:ARTICLE body from the approved mockup}";

/** The byline of every guide the team wrote together; no card names a person (stories.md). */
export const TEAM_BYLINE = "The Kheelona team";

/** The default share card (public/og.png, Kheelu on its own fur, no text; assets.md). */
export const ARTICLE_OG: Meta["og"] = {
  image: "/og.png",
  alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
};

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

/** An article that waits for its rewrite. */
export function stubArticle({ slug, card, metaTitle, related, published, updated }: StubInput): Article {
  return {
    slug,
    meta: { title: metaTitle ?? card.title, description: card.summary, og: ARTICLE_OG },
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
