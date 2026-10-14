import type { MetadataRoute } from "next";
import { routes, type RouteEntry } from "@/content/en-IN/routes";
import { getArticle } from "@/content/en-IN/stories/articles";
import type { IsoDate } from "@/content/types";
import { absoluteUrl } from "@/lib/seo/urls";

/**
 * `/sitemap.xml` (architecture §9.3, ADR-012): the URL plan in `src/content/en-IN/routes.ts` and nothing else,
 * so the redirected `/playos` and 2-year-old article, the store host (noindex) and campaign pages never appear.
 * Every URL is canonical on the production origin, in every environment (`absoluteUrl`, D048).
 *
 * `lastModified` only where a route's content stores a real date (lessons §6): each article's `updated`, as its
 * dashboard post stores it (the journal registry, ADR-014; the import keeps the given dates). A marketing page joins
 * the day its module carries one. Never `new Date()`: on the old site every one of 31 URLs said "changed just now" on
 * every deploy, and a crawler that learns the field is noise stops trusting it on the day a page really changes.
 */

/** The date a route's content stores, if any: an article's `updated`; no marketing page stores one yet. */
function storedDate(route: RouteEntry): IsoDate | undefined {
  if (route.kind !== "article") return undefined;
  const article = getArticle(route.path.slice("/stories/".length));
  if (article === undefined) throw new Error(`sitemap: the URL plan lists ${route.path}, which the journal does not publish`);
  return article.updated;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => {
    const lastModified = storedDate(route);
    return {
      url: absoluteUrl(route.path),
      ...(lastModified ? { lastModified } : {}),
      priority: route.priority,
    };
  });
}
