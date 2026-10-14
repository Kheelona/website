/* Every approved mockup page mapped to its URL (task 1.1; structure §5), and the routes the page
 * sweeps visit. The mapping is read from each page's own meta comment in mockup/pages/<slug>.html
 * (`<!--page {"url": …, "buybar": …, "chrome": …} -->`), so it can never drift from the approval.
 */
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { JOURNAL_SNAPSHOT } from "../../../src/config/journal";
import { REDIRECTS } from "../../../src/config/redirects";
import { topics } from "../../../src/content/en-IN/stories/topics";
import { isLegacyRoute } from "../../guards/legacy-paths";
import { ORIGINS, SLUG_FILTER, type Host } from "./env";
import { MOCKUP_SLUGS, type MockupSlug } from "./mockup-text";
import { ROOT, readRepoFile } from "./repo";

export type Route = {
  /** Mockup slug, or `article:<slug>` for the template articles without a mockup. */
  id: string;
  host: Host;
  path: string;
  mockup: MockupSlug | null;
  buybar: boolean;
  /** "chrome": false pages (store, confirmation) use StoreShell. */
  chrome: boolean;
  title: string | null;
  description: string | null;
  /** Rendered by ArticleTemplate (axe adds 412 px for templates, test plan §4.5). */
  template: "page" | "article" | "legal" | "store";
};

/** An unmatched URL: the root not-found page renders it (404.html, task 5.10). */
export const NOT_FOUND_PATH = "/kh-e2e-no-such-page";

type Meta = { title?: string; description?: string; url?: string; buybar?: boolean; chrome?: boolean };

function metaOf(slug: MockupSlug): Meta {
  const first = readRepoFile(`mockup/pages/${slug}.html`).split("\n")[0];
  const m = /^<!--page (\{.*\}) -->$/.exec(first.trim());
  if (!m) throw new Error(`mockup/pages/${slug}.html has no page meta comment`);
  return JSON.parse(m[1]) as Meta;
}

function templateOf(slug: MockupSlug): Route["template"] {
  if (slug.startsWith("story-")) return "article";
  if (["privacy", "terms", "refund", "shipping"].includes(slug)) return "legal";
  if (slug.startsWith("store")) return "store";
  return "page";
}

export function mockupRoute(slug: MockupSlug): Route {
  const meta = metaOf(slug);
  const url = meta.url ?? "/";
  const store = /^https:\/\/store\.kheelona\.com/.test(url);
  const path = slug === "404" ? NOT_FOUND_PATH : store ? new URL(url).pathname : url;
  return {
    id: slug,
    host: store ? "store" : "marketing",
    path,
    mockup: slug,
    buybar: meta.buybar === true,
    chrome: meta.chrome !== false,
    title: meta.title ?? null,
    description: meta.description ?? null,
    template: templateOf(slug),
  };
}

/** A post of the committed journal snapshot, as far as the harness reads it. */
type SnapshotPost = { readonly slug: string; readonly theme: string };

/** The journal's published posts (src/content/en-IN/stories/posts.generated.json; ADR-014, task 8b.2e). The site
 *  adapts them in journal.ts, which Playwright cannot load (it imports images), so the harness reads the same JSON. */
export function snapshotPosts(text = readRepoFile(JOURNAL_SNAPSHOT)): readonly SnapshotPost[] {
  const value = JSON.parse(text) as { posts?: unknown };
  if (!Array.isArray(value.posts)) throw new Error(`${JOURNAL_SNAPSHOT} holds no list of posts`);
  return value.posts as SnapshotPost[];
}

/** The slugs a plain `/stories/<slug>` redirect answers (src/config/redirects.ts): the redirect wins, so the journal
 *  leaves such a post out (journal-pipeline §10), and so does the sweep. */
const REDIRECTED: ReadonlySet<string> = new Set(
  REDIRECTS.filter((r) => r.has === undefined).flatMap((r) => /^\/stories\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(r.source)?.[1] ?? []),
);

/** The articles of the URL plan: the journal's published posts, redirect sources left out (20 at the export of task
 *  8b.2e: tasks 5.6, 5.17-5.19; the 3-6-9-12 article left the journal, D053, task 6.5); three have mockups. Until 8b.2e a
 *  typed list; test/e2e-harness.test.ts holds it equal to the site's (routes.ts). */
export const ARTICLE_SLUGS: readonly string[] = snapshotPosts()
  .map((post) => post.slug)
  .filter((slug) => !REDIRECTED.has(slug));

/**
 * An article's close (`"journal"`, the close with the pre-order button and the phone buy bar, or `"keep"`, the
 * keep-reading close with neither; B5): its post's topic's close (topics.ts; journal-pipeline §4), as the adapter derives
 * it. The bar reads SiteShell's ARTICLE_CLOSES, built from the article registry; test/e2e-harness.test.ts holds the two
 * equal (task 4.9 item 6). Until 8b.2e the harness read each article module's source for its `close`.
 */
export function articleClose(slug: string, posts: readonly SnapshotPost[] = snapshotPosts()): "journal" | "keep" {
  const post = posts.find((p) => p.slug === slug);
  if (post === undefined) throw new Error(`articleClose: article "${slug}" is not a post of ${JOURNAL_SNAPSHOT}`);
  const topic = topics.find((t) => t.title === post.theme);
  if (topic === undefined) throw new Error(`articleClose: the post "${slug}" names the theme "${post.theme}", which is no topic of topics.ts`);
  return topic.close;
}

/** The 18 mockup pages, filtered by KH_SLUGS when set. */
export function mockupRoutes(): Route[] {
  return MOCKUP_SLUGS.filter((s) => !SLUG_FILTER || SLUG_FILTER.includes(s)).map(mockupRoute);
}

/** Every built route a page sweep visits: the mockup pages plus the journal's other articles (17 at the export), each
 *  with the bar exactly when its close carries the pre-order button (articleClose). */
export function sweepRoutes(): Route[] {
  const withMockup = new Set(mockupRoutes().map((r) => r.path));
  const articles: Route[] = ARTICLE_SLUGS.map((slug) => ({
    id: `article:${slug}`,
    host: "marketing" as const,
    path: `/stories/${slug}`,
    mockup: null,
    buybar: articleClose(slug) === "journal",
    chrome: true,
    title: null,
    description: null,
    template: "article" as const,
  })).filter((r) => !withMockup.has(r.path) && (!SLUG_FILTER || SLUG_FILTER.includes(r.id)));
  return [...mockupRoutes(), ...articles];
}

export function builtUrl(route: Pick<Route, "host" | "path">): string {
  return `${ORIGINS[route.host]}${route.path}`;
}

export function mockupUrl(slug: MockupSlug): string {
  return pathToFileURL(join(ROOT, "mockup", `${slug}.html`)).href;
}

/** Whether the route may still be served by a legacy page (legacy-paths.ts, LEGACY_ROUTES). */
export function mayBeLegacy(route: Pick<Route, "host" | "path">): boolean {
  const path = route.path === NOT_FOUND_PATH ? "/__not-found__" : route.path;
  return isLegacyRoute(route.host, path);
}
