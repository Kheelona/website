import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT, readRepoFile } from "../../../test/e2e/support/repo";
import { MOCKUP_SLUGS } from "../../../test/e2e/support/mockup-text";
import { ARTICLE_SLUGS as E2E_ARTICLE_SLUGS } from "../../../test/e2e/support/routes";
import { navigation, type NavLink } from "./navigation";
import { ARTICLE_SLUGS, routes, routeFor } from "./routes";
import { JOURNAL_SLUGS } from "./stories/journal";

/* The URL plan (architecture §6.1, §9.3; strategy §4.1; wiki/site/url-map.md §1; task 2.1
 * acceptance 4): every indexable URL, its content module, its sitemap priority and its nav and
 * footer membership. /playos, the merged 2-year-old article and the removed 3-6-9-12 article are redirects, never
 * routes (D041, D053). */

const paths = routes.map((r) => r.path);

/** The live sitemap priorities (url-map §1a and §1b), kept for every URL that stays. */
const PRIORITY: Readonly<Record<string, number>> = {
  "/": 1,
  "/products/kheelu": 0.9,
  "/safety": 0.8,
  "/ai-toys-for-kids-in-india": 0.8,
  "/stories": 0.7,
  "/team": 0.6,
  "/setup": 0.5,
  "/contact": 0.4,
  "/privacy": 0.3,
  "/terms": 0.3,
  "/refund": 0.3,
  "/shipping": 0.3,
};

describe("the routes", () => {
  it("are the twelve marketing pages and the 20 articles, each once", () => {
    expect(routes.filter((r) => r.kind !== "article")).toHaveLength(12);
    expect(routes.filter((r) => r.kind === "article")).toHaveLength(20);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("leave out /playos and the merged 2-year-old article (D041; both redirect)", () => {
    expect(paths).not.toContain("/playos");
    expect(paths).not.toContain("/stories/brain-development-toys-for-a-2-year-old");
  });

  it("leave out the 3-6-9-12 article (D053; it redirects to the hub's screen-time topic)", () => {
    expect(paths).not.toContain("/stories/screen-time-rules-parents-swear-by");
  });

  it("include every marketing page the approved mockups define (their meta urls)", () => {
    for (const slug of MOCKUP_SLUGS) {
      const meta = JSON.parse(/^<!--page (\{.*\}) -->/.exec(readRepoFile(`mockup/pages/${slug}.html`))![1]) as { url?: string };
      if (slug === "404" || !meta.url || meta.url.startsWith("https://store.")) continue;
      expect(paths, slug).toContain(meta.url);
    }
  });

  it("keep the live sitemap priorities: the pages by URL, every article at 0.6", () => {
    for (const r of routes) expect(r.priority, r.path).toBe(r.kind === "article" ? 0.6 : PRIORITY[r.path]);
  });

  it("name each page's content module by the structure's convention (structure §3.3)", () => {
    const expected = (path: string) => {
      if (path === "/") return "pages/home";
      if (path === "/products/kheelu") return "products/kheelu/page";
      if (path === "/stories") return "stories/hub";
      /* Every article is a journal post, filled by the journal registry (ADR-014; task 8b.2e). */
      if (path.startsWith("/stories/")) return "stories/journal";
      if (["/privacy", "/terms", "/refund", "/shipping"].includes(path)) return `legal${path}`;
      return `pages${path}`;
    };
    for (const r of routes) expect(r.module, r.path).toBe(expected(r.path));
  });

  it("finds a route by path", () => {
    expect(routeFor("/safety")?.module).toBe("pages/safety");
    expect(routeFor("/playos")).toBeUndefined();
  });
});

describe("the articles", () => {
  it("are the 20 of the URL plan (the e2e sweep's list)", () => {
    expect([...ARTICLE_SLUGS].sort()).toEqual([...E2E_ARTICLE_SLUGS].sort());
  });

  /* Until task 8b.2e each article was a module of its own (stories/articles/<slug>.ts); now each is a published post of
     the committed snapshot, through the journal registry (ADR-014), so a new story needs no line here. */
  it("are the journal's published posts, in its order, filled by the journal registry", () => {
    expect(ARTICLE_SLUGS).toEqual(JOURNAL_SLUGS);
    expect(existsSync(join(ROOT, "src/content/en-IN/stories/journal.ts"))).toBe(true);
    for (const slug of ARTICLE_SLUGS) expect(routeFor(`/stories/${slug}`)?.module, slug).toBe("stories/journal");
  });
});

describe("nav and footer membership (read from navigation.ts)", () => {
  it("marks exactly the four main links as in the nav", () => {
    expect(routes.filter((r) => r.nav).map((r) => r.path)).toEqual(navigation.main.map((l) => l.href));
  });

  it("marks each footer link's column", () => {
    for (const column of navigation.footer.columns) {
      for (const link of column.links) expect(routeFor(link.href)?.footer, link.href).toBe(column.id);
    }
    const inFooter = routes.filter((r) => r.footer !== null).length;
    expect(inFooter).toBe(navigation.footer.columns.flatMap<NavLink>((c) => c.links).length);
  });

  it("never links the chrome to a URL outside the plan", () => {
    const links = [...navigation.main, ...navigation.footer.columns.flatMap<NavLink>((c) => c.links), navigation.footer.grievance, ...navigation.policies];
    // A link may open a part of its page (the grievance officer's block on /contact, QA-005, task 7.1a): its page counts.
    for (const link of links) expect(paths, link.href).toContain(link.href.split("#")[0]);
  });
});
