import type { GuideLink } from "@/components/sections/RelatedGuides/related-guides.types";
import type { Crumb } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { organization } from "@/content/en-IN/organization";
import { routes } from "@/content/en-IN/routes";
import { articlePageCopy, getArticle, PLAIN_CLOSE_ART } from "@/content/en-IN/stories/articles";
import { hubTopics } from "@/content/en-IN/stories/hub";
import { topics } from "@/content/en-IN/stories/topics";
import type { Article, ArtBoardRef, Offer, SitePath } from "@/content/types";
import { organizationFacts } from "@/layouts/SiteShell/site-graph";
import { toPlainText } from "@/lib/content/plain-text";
import { pageGraph, type SchemaGraph } from "@/lib/seo/jsonld";
import { pageMeta, type PageMetadata } from "@/lib/seo/metadata";
import { blogPostingNode } from "@/lib/seo/schema/blog-posting";
import { breadcrumbListNode } from "@/lib/seo/schema/breadcrumb-list";
import { personIds } from "@/lib/seo/schema/organization";

/**
 * What the article template works out from an article module and the stories content (task 4.2): the page's path, its
 * crumbs (the hub, then the article's topic on the hub), its related guides (worded by each guide's own card), its close
 * art, its metadata and its page graph (BlogPosting and BreadcrumbList, architecture §9.2). Pure; the template renders.
 */

/** An article's page: its address in the URL plan (routes.ts), the route whose content module is the article's. A story
 *  is its module plus its slug in the plan (architecture §5.4), so an article with no route has no page. */
export function articlePath(slug: string): SitePath {
  const route = routes.find((r) => r.kind === "article" && r.module === `stories/articles/${slug}`);
  if (route === undefined) throw new Error(`Article "${slug}" has no route in routes.ts: a story is its module plus its slug in the URL plan`);
  return route.path;
}

/**
 * The bylines that are people: the person ids the shell's Organization node publishes (its founders), from the same
 * mapper the shell uses (src/layouts/SiteShell/site-graph.ts), so a founder's byline is that Person and any other
 * byline, the team's included, is credited to the Organization (task 2.13).
 */
const KNOWN_AUTHOR_IDS = personIds(organizationFacts(organization));

/** The visible crumbs: the hub, then the topic the hub lists the article under (hub.ts, topics.ts). */
export function articleTrail(article: Article): Crumb[] {
  const { hub } = articlePageCopy.crumbs;
  const group = hubTopics.find((g) => g.featured === article.slug || (g.slugs as readonly string[]).includes(article.slug));
  const topic = group && topics.find((t) => t.id === group.topic);
  if (topic === undefined) {
    throw new Error(`Article "${article.slug}" sits under no hub topic (src/content/en-IN/stories/hub.ts): its crumbs lead to its topic`);
  }
  return [hub, { name: topic.title, path: `${hub.path}#${topic.id}` }];
}

/** The article's three related guides, each by its own card title, linked to its page. */
export function relatedGuides(article: Article): GuideLink[] {
  return article.related.map((slug) => {
    const guide = getArticle(slug);
    if (guide === undefined) {
      throw new Error(`Article "${article.slug}" relates "${slug}", which is not in the article registry (stories/articles/index.ts)`);
    }
    return { title: guide.card.title, href: articlePath(slug) };
  });
}

/** The journal close's art board; a safety guide's stays plain, without the doodle (PLAIN_CLOSE_ART). */
export function closeArt(article: Article): ArtBoardRef {
  const art: ArtBoardRef = articlePageCopy.close.art;
  return (PLAIN_CLOSE_ART as readonly string[]).includes(article.slug) ? { ...art, layers: art.layers.filter((layer) => !layer.doodle) } : art;
}

/** The page's metadata: the module's own words on its path, an article for share tools with its stored dates. */
export function articleMeta(article: Article): PageMetadata {
  return pageMeta({
    ...article.meta,
    path: articlePath(article.slug),
    article: { published: article.published, updated: article.updated, authors: [article.head.author] },
  });
}

/** The page's own graph (the shell declares the Organization and the WebSite): the BlogPosting with the module's
 *  stored dates and the visible headline, then the BreadcrumbList of the visible crumbs. */
export function articleGraph(article: Article, offer: Offer): SchemaGraph {
  return pageGraph(
    blogPostingNode({
      path: articlePath(article.slug),
      headline: toPlainText(article.head.title, offer),
      description: toPlainText(article.meta.description, offer),
      image: article.meta.og.image,
      published: article.published,
      updated: article.updated,
      author: article.head.author,
      knownAuthorIds: KNOWN_AUTHOR_IDS,
    }),
    breadcrumbListNode(articleTrail(article)),
  );
}
