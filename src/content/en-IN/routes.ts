import type { SitePath } from "@/content/types";
import { navigation, type FooterColumn } from "./navigation";
import { JOURNAL_SLUGS } from "./stories/journal";

/**
 * The URL plan (architecture §6.1, §9.3; strategy §4.1): every indexable URL of the marketing
 * site, the content module that fills it (every article: the journal registry), its sitemap
 * priority, and whether the nav and footer link it (read from navigation.ts, so membership is
 * stated once). The sitemap, the article route's static params and the data-driven page guards
 * (task 4.4) all read this list.
 *
 * Not here: /playos and /stories/brain-development-toys-for-a-2-year-old (308s, D041),
 * /stories/screen-time-rules-parents-swear-by (308 to the hub's screen-time topic, D053), the 404,
 * the store host (noindex) and campaign pages (campaigns/index.ts, none at launch). Priorities are
 * the live sitemap's (url-map §1a, §1b). A new page is a line here only if the URL plan allows it.
 */

/** The articles of the URL plan: the journal's published posts, in its order (the committed snapshot of the admin
 *  dashboard's posts, src/content/en-IN/stories/journal.ts; ADR-014, task 8b.2e). 20 at the export: the guides rewritten
 *  in tasks 5.6 and 5.17-5.19; the 3-6-9-12 article left the journal (D053, task 6.5). A new story is a published post,
 *  never a line here; a post whose address is a redirect's source is left out by the journal (the redirect wins). */
export const ARTICLE_SLUGS: readonly string[] = JOURNAL_SLUGS;

/** A journal article's slug: any published post's, known at build from the snapshot (no longer a literal union). */
export type ArticleSlug = string;

export type RouteKind = "page" | "product" | "hub" | "article" | "legal";

export interface RouteEntry {
  readonly path: SitePath;
  readonly kind: RouteKind;
  /** The content module, as a path under src/content/en-IN/ without its extension. */
  readonly module: string;
  /** Sitemap priority, 0 to 1. */
  readonly priority: number;
  /** Linked from the laptop nav and the phone drawer. */
  readonly nav: boolean;
  /** The footer column that links it, if any. */
  readonly footer: FooterColumn["id"] | null;
}

type PlannedRoute = Pick<RouteEntry, "path" | "kind" | "module" | "priority">;

const PAGES: readonly PlannedRoute[] = [
  { path: "/", kind: "page", module: "pages/home", priority: 1 },
  { path: "/products/kheelu", kind: "product", module: "products/kheelu/page", priority: 0.9 },
  { path: "/safety", kind: "page", module: "pages/safety", priority: 0.8 },
  { path: "/ai-toys-for-kids-in-india", kind: "page", module: "pages/ai-toys-for-kids-in-india", priority: 0.8 },
  { path: "/stories", kind: "hub", module: "stories/hub", priority: 0.7 },
  { path: "/team", kind: "page", module: "pages/team", priority: 0.6 },
  { path: "/setup", kind: "page", module: "pages/setup", priority: 0.5 },
  { path: "/contact", kind: "page", module: "pages/contact", priority: 0.4 },
  { path: "/privacy", kind: "legal", module: "legal/privacy", priority: 0.3 },
  { path: "/terms", kind: "legal", module: "legal/terms", priority: 0.3 },
  { path: "/refund", kind: "legal", module: "legal/refund", priority: 0.3 },
  { path: "/shipping", kind: "legal", module: "legal/shipping", priority: 0.3 },
];

/* Every article is filled by the journal registry, one module for all of them. */
const ARTICLES: readonly PlannedRoute[] = ARTICLE_SLUGS.map((slug) => ({
  path: `/stories/${slug}`,
  kind: "article",
  module: "stories/journal",
  priority: 0.6,
}));

function footerColumn(path: SitePath): FooterColumn["id"] | null {
  return navigation.footer.columns.find((column) => column.links.some((link) => link.href === path))?.id ?? null;
}

export const routes: readonly RouteEntry[] = [...PAGES, ...ARTICLES].map((route) => ({
  ...route,
  nav: navigation.main.some((link) => link.href === route.path),
  footer: footerColumn(route.path),
}));

/** The planned route for a path, or undefined for a URL outside the plan. */
export function routeFor(path: string): RouteEntry | undefined {
  return routes.find((route) => route.path === path);
}
