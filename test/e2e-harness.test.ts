import type { Page } from "@playwright/test";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ARTICLE_SLUGS as PLAN_ARTICLES } from "@/content/en-IN/routes";
import { ARTICLE_CLOSES, stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { hiddenCss, hideDeviations } from "./e2e/support/deviations";
import { ARTICLE_SLUGS, articleClose, closeInSource, NOT_FOUND_PATH, sweepRoutes } from "./e2e/support/routes";

/* The e2e harness's shared pieces that task 4.9 item 6 changed, where they can be read without a browser.
 *
 * The routes the page sweeps visit (test/e2e/support/routes.ts): each one's `buybar` is where the phone
 * buy bar really shows, so the specs that read it (cta.spec.ts proves the bar's CTA there and nowhere else; axe.spec.ts
 * exercises the bar) prove the bar absent on the seven keep-close guides (B5). A mockup page's flag is its meta comment;
 * an article without a mockup takes its own module's close, read from the module's source because Playwright cannot load
 * the article registry (its modules import images). Here, where the registry loads, that reading is held equal to
 * SiteShell's ARTICLE_CLOSES, the closes the bar itself reads. */

describe("sweepRoutes: the buy bar on each route", () => {
  it("reads every article's close exactly as the bar does (ARTICLE_CLOSES, from the article registry)", () => {
    expect([...ARTICLE_SLUGS].sort()).toEqual([...PLAN_ARTICLES].sort());
    for (const slug of ARTICLE_SLUGS) expect(articleClose(slug), slug).toBe(ARTICLE_CLOSES[slug]);
  });

  it("gives an article route the bar exactly when its close carries the pre-order button: none on the keep-close guides", () => {
    const articles = sweepRoutes().filter((route) => route.path.startsWith("/stories/"));
    expect(articles).toHaveLength(ARTICLE_SLUGS.length);
    const withoutBar = articles.filter((route) => !route.buybar).map((route) => route.path.replace("/stories/", "")).sort();
    expect(withoutBar).toEqual(ARTICLE_SLUGS.filter((slug) => ARTICLE_CLOSES[slug] === "keep").sort());
    expect(withoutBar).toHaveLength(7);
  });

  it("agrees with the shell on every marketing route: buybar exactly where stickyBarPaths() puts the bar", () => {
    const bar = new Set<string>(stickyBarPaths());
    for (const route of sweepRoutes().filter((r) => r.host === "marketing")) {
      expect(route.buybar, route.id).toBe(route.path !== NOT_FOUND_PATH && bar.has(route.path));
    }
  });

  it("refuses an article whose module it cannot read a close from", () => {
    expect(() => articleClose("a-guide-with-no-module")).toThrow(/a-guide-with-no-module/);
  });

  /* The article modules are edited by hand (tasks 5.20a-c): a close written with a type assertion, in parentheses, as a
     template literal or through a constant of the same module is still the same close, so the parser never throws on
     it when the spec modules load (every spec that calls sweepRoutes() would fail). */
  it("reads a close however the module writes it: as const, satisfies, parentheses, a template literal, a constant", () => {
    const source = (close: string, before = "") => `${before}export const article = { slug: "x", close: ${close}, related: [] } satisfies ArticleModule;`;
    const path = "src/content/en-IN/stories/articles/x.ts";
    expect(closeInSource(path, source('"keep"'))).toBe("keep");
    expect(closeInSource(path, source('"keep" as const'))).toBe("keep");
    expect(closeInSource(path, source('"journal" satisfies ArticleClose'))).toBe("journal");
    expect(closeInSource(path, source('("journal")'))).toBe("journal");
    expect(closeInSource(path, source("`keep`"))).toBe("keep");
    expect(closeInSource(path, source("CLOSE", 'const CLOSE = "journal" as const;\n'))).toBe("journal");
    expect(closeInSource(path, `export const article = ({ close: "keep" as const }) as const;`)).toBe("keep");
  });

  it("still refuses a close it cannot read as one of the two: another word, a call, a constant from elsewhere, a loop", () => {
    const path = "src/content/en-IN/stories/articles/x.ts";
    expect(() => closeInSource(path, 'export const article = { close: "open" };')).toThrow(/x\.ts states no close/);
    expect(() => closeInSource(path, "export const article = { close: pickClose() };")).toThrow(/x\.ts states no close/);
    expect(() => closeInSource(path, 'import { CLOSE } from "./c";\nexport const article = { close: CLOSE };')).toThrow(/x\.ts states no close/);
    expect(() => closeInSource(path, "const A = B;\nconst B = A;\nexport const article = { close: A };")).toThrow(/x\.ts states no close/);
  });
});

/* hideDeviations (test/e2e/support/deviations.ts) hides one side's approved elements before a pixel comparison and prints
 * each rule it applies. Two specs call it: visual-parity.spec.ts on the routes and thanks-paid.spec.ts on the ThanksPaid
 * story, so each passes its own name and the log says which spec hid what. */
describe("hideDeviations", () => {
  afterEach(() => vi.restoreAllMocks());

  /** The one Page method it uses: the style it adds. */
  const fakePage = () => {
    const styles: string[] = [];
    return { styles, page: { addStyleTag: async ({ content }: { content: string }) => void styles.push(content) } as unknown as Page };
  };

  it("adds the side's hiding style and prints each rule under the calling spec's name", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const { page, styles } = fakePage();
    await hideDeviations(page, "store-confirmation", "build", "thanks-paid");
    expect(styles).toEqual([hiddenCss("store-confirmation", "build")]);
    expect(log.mock.calls.length).toBeGreaterThan(0);
    for (const [line] of log.mock.calls) expect(String(line)).toMatch(/^\[thanks-paid\] store-confirmation: /);
    log.mockClear();
    await hideDeviations(page, "store-confirmation", "mockup", "visual-parity");
    for (const [line] of log.mock.calls) expect(String(line)).toMatch(/^\[visual-parity\] store-confirmation: /);
  });

  it("does nothing and prints nothing for a page with no rule on that side", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const { page, styles } = fakePage();
    await hideDeviations(page, "ai-toys-for-kids-in-india", "build", "visual-parity");
    expect(styles).toEqual([]);
    expect(log).not.toHaveBeenCalled();
  });
});
