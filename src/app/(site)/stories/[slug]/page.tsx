import type { Metadata } from "next";
import { ARTICLE_SLUGS } from "@/content/en-IN/routes";
import { getArticle } from "@/content/en-IN/stories/articles";
import type { Article } from "@/content/types";
import { ArticleTemplate, articleMeta } from "@/layouts/ArticleTemplate/ArticleTemplate";
import { getOffer } from "@/lib/offer/get-offer";

/* An article page (structure §3.1, §5; task 4.2): the article's module, through the article template, with the live
 * offer. Thin: no words here.
 *
 * Only the 21 articles of the URL plan exist. With `dynamicParams = false` every other slug stops at the router and
 * the marketing 404 renders on the server; a `notFound()` thrown from a page would serve a blank document instead
 * (test/not-found-ssr.test.ts, lessons §1). */
export const dynamicParams = false;

/* The journal close shows the price, so the page follows the live mode (ADR-005; OFFER_REVALIDATE_SECONDS, written as a
 * literal because Next reads it statically). */
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams(): { slug: string }[] {
  return ARTICLE_SLUGS.map((slug) => ({ slug }));
}

/** The article for a prerendered slug. Any other slug never reaches the page (dynamicParams = false). */
async function articleOf({ params }: Props): Promise<Article> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (article === undefined) throw new Error(`/stories/${slug} is not in the article registry, yet reached the page`);
  return article;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  return articleMeta(await articleOf(props));
}

export default async function StoryPage(props: Props) {
  const article = await articleOf(props);
  return <ArticleTemplate article={article} offer={await getOffer()} />;
}
