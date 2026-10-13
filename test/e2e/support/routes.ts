/* Every approved mockup page mapped to its URL (task 1.1; structure §5), and the routes the page
 * sweeps visit. The mapping is read from each page's own meta comment in mockup/pages/<slug>.html
 * (`<!--page {"url": …, "buybar": …, "chrome": …} -->`), so it can never drift from the approval.
 */
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import ts from "typescript";
import { isLegacyRoute } from "../../guards/legacy-paths";
import { ORIGINS, SLUG_FILTER, type Host } from "./env";
import { MOCKUP_SLUGS, type MockupSlug } from "./mockup-text";
import { ROOT, readRepoFile } from "./repo";
import { parseSource } from "./source";

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

/** The 21 articles of the URL plan (tasks 5.6, 5.17-5.19); three have mockups. */
export const ARTICLE_SLUGS = [
  "learning-toys-for-a-three-year-old",
  "what-to-look-for-in-a-safe-ai-toy",
  "talking-toys-and-late-talkers",
  "how-much-screen-time-for-a-3-to-6-year-old",
  "screen-time-rules-parents-swear-by",
  "screen-time-and-tantrums",
  "the-gentle-way-off-the-phone",
  "busy-hands-no-screens",
  "screen-free-does-not-mean-silent",
  "talking-late-or-talking-little",
  "how-to-get-your-child-talking",
  "how-children-learn-by-talking",
  "how-children-collect-words",
  "raising-a-bilingual-child-in-india",
  "a-toy-that-talks-vs-a-toy-that-listens",
  "questions-parents-ask-about-ai-toys",
  "should-kids-use-ai",
  "ai-toys-and-indias-data-law",
  "does-a-three-year-old-need-an-ai-tutor",
  "what-actually-builds-a-sharp-brain",
  "why-three-to-six-are-the-years-that-matter-most",
] as const;

/**
 * An article's close as its own module states it (`close: "journal"`, the close with the pre-order button and the phone
 * buy bar, or `"keep"`, the keep-reading close with neither; B5). The bar reads SiteShell's ARTICLE_CLOSES, built from
 * the article registry, which Playwright cannot load (its modules import images), so the harness reads the same value
 * from each module's source; test/e2e-harness.test.ts holds the two equal (task 4.9 item 6).
 */
export function articleClose(slug: string): "journal" | "keep" {
  const path = `src/content/en-IN/stories/articles/${slug}.ts`;
  let text: string;
  try {
    text = readRepoFile(path);
  } catch {
    throw new Error(`articleClose: article "${slug}" has no module at ${path}`);
  }
  return closeInSource(path, text);
}

/** An expression without the wrappers that leave its value alone: `as`, `satisfies`, parentheses. */
function unwrap(node: ts.Expression): ts.Expression {
  let value = node;
  while (ts.isSatisfiesExpression(value) || ts.isAsExpression(value) || ts.isParenthesizedExpression(value)) value = value.expression;
  return value;
}

/**
 * The close an article module's source states (articleClose's reader, exported for its test): the `close` of its
 * `article` object, written as a string or a template literal with no substitution, with or without `as`, `satisfies`
 * or parentheses, or as a constant the module itself declares so. Anything else (another module's constant, a call) the
 * harness cannot read without loading the module, so it refuses it.
 */
export function closeInSource(path: string, text: string): "journal" | "keep" {
  const sf = parseSource(path, text);
  // The module's own top-level constants, by name (a close written as one of them).
  const constants = new Map<string, ts.Expression>();
  for (const statement of sf.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const d of statement.declarationList.declarations) if (ts.isIdentifier(d.name) && d.initializer) constants.set(d.name.text, d.initializer);
  }
  let written: ts.Expression | undefined;
  const visit = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node) && node.name.getText(sf) === "article" && node.initializer) {
      const value = unwrap(node.initializer);
      if (ts.isObjectLiteralExpression(value)) {
        for (const p of value.properties) if (ts.isPropertyAssignment(p) && p.name.getText(sf) === "close") written = p.initializer;
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  // A string, or a constant followed to its string (each name once, so two constants naming each other end).
  const read = (node: ts.Expression, seen: ReadonlySet<string>): string | undefined => {
    const value = unwrap(node);
    if (ts.isStringLiteralLike(value)) return value.text;
    if (!ts.isIdentifier(value) || seen.has(value.text)) return undefined;
    const constant = constants.get(value.text);
    return constant ? read(constant, new Set([...seen, value.text])) : undefined;
  };
  const close = written ? read(written, new Set()) : undefined;
  if (close !== "journal" && close !== "keep") throw new Error(`articleClose: ${path} states no close ("journal" or "keep") the harness can read`);
  return close;
}

/** The 18 mockup pages, filtered by KH_SLUGS when set. */
export function mockupRoutes(): Route[] {
  return MOCKUP_SLUGS.filter((s) => !SLUG_FILTER || SLUG_FILTER.includes(s)).map(mockupRoute);
}

/** Every built route a page sweep visits: the mockup pages plus the 18 template articles, each article with the bar
 *  exactly when its close carries the pre-order button (articleClose). */
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
