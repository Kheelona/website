import type { Page } from "@playwright/test";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ARTICLE_SLUGS as PLAN_ARTICLES } from "@/content/en-IN/routes";
import { ARTICLE_CLOSES, stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import {
  PRICE_LINE_HIDDEN,
  SHARED_HIDDEN,
  TAP_AREA_HIDDEN,
  VISUAL_HIDDEN,
  hiddenCss,
  hideDeviations,
  sharedHiddenCss,
  visualHidden,
} from "./e2e/support/deviations";
import { ARTICLE_SLUGS, articleClose, NOT_FOUND_PATH, snapshotPosts, sweepRoutes } from "./e2e/support/routes";

/* The e2e harness's shared pieces that task 4.9 item 6 changed, where they can be read without a browser.
 *
 * The routes the page sweeps visit (test/e2e/support/routes.ts): each one's `buybar` is where the phone
 * buy bar really shows, so the specs that read it (cta.spec.ts proves the bar's CTA there and nowhere else; axe.spec.ts
 * exercises the bar) prove the bar absent on the seven keep-close guides (B5). A mockup page's flag is its meta comment;
 * an article without a mockup takes its post's topic's close, read from the committed journal snapshot and topics.ts
 * because Playwright cannot load the article registry (journal.ts imports images; until task 8b.2e the harness read each
 * article module's source). Here, where the registry loads, that reading is held equal to SiteShell's ARTICLE_CLOSES,
 * the closes the bar itself reads, and the harness's articles to the URL plan's, in its order. */

describe("sweepRoutes: the buy bar on each route", () => {
  it("reads every article's close exactly as the bar does (ARTICLE_CLOSES, from the article registry)", () => {
    expect(ARTICLE_SLUGS).toEqual(PLAN_ARTICLES);
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

  it("refuses an article the journal does not publish", () => {
    expect(() => articleClose("a-guide-with-no-post")).toThrow(/a-guide-with-no-post.*posts\.generated\.json/);
  });

  /* Until 8b.2e: the module-source reader (closeInSource) and its cases went with the modules. A post states no close:
     its topic does (journal-pipeline §4), so a writer who moves a guide to another topic moves its bar with it. */
  it("reads a close from the post's topic, and refuses a theme that is no topic", () => {
    const posts = [
      { slug: "a-talking-post", theme: "Talking and language" },
      { slug: "a-learning-post", theme: "Learning and play" },
      { slug: "a-retired-theme", theme: "Safety" },
    ];
    expect(articleClose("a-talking-post", posts)).toBe("keep");
    expect(articleClose("a-learning-post", posts)).toBe("journal");
    expect(() => articleClose("a-retired-theme", posts)).toThrow(/"Safety", which is no topic/);
  });

  it("reads the committed snapshot's posts, and refuses a file with no list", () => {
    expect(snapshotPosts().map((p) => p.slug)).toEqual(expect.arrayContaining([...ARTICLE_SLUGS]));
    expect(() => snapshotPosts('{ "generated": "x" }')).toThrow(/holds no list of posts/);
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

  it("adds the side's hiding styles, the shared rules' then the page's own, and prints each rule under the calling spec's name", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const { page, styles } = fakePage();
    await hideDeviations(page, "store-confirmation", "build", "thanks-paid");
    expect(styles).toEqual([sharedHiddenCss("build"), hiddenCss("store-confirmation", "build")]);
    expect(log.mock.calls.length).toBeGreaterThan(0);
    for (const [line] of log.mock.calls) expect(String(line)).toMatch(/^\[thanks-paid\] store-confirmation: /);
    log.mockClear();
    await hideDeviations(page, "store-confirmation", "mockup", "visual-parity");
    for (const [line] of log.mock.calls) expect(String(line)).toMatch(/^\[visual-parity\] store-confirmation: /);
  });

  /* Since task 7.1a every page shares one rule (TAP_AREA_HIDDEN, the tap-area row V23: a help line under a trust line sits
     lower in the build), and since task Q2.8 a second (PRICE_LINE_HIDDEN: the price lines D065 item 3 rewords), applied
     before the page's own, so no page is without them. */
  it("applies the rules every page shares to a page with none of its own on that side, and prints exactly those", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const { page, styles } = fakePage();
    expect(VISUAL_HIDDEN.contact ?? []).toEqual([]);
    expect(hiddenCss("contact", "build")).toBe("");
    await hideDeviations(page, "contact", "build", "visual-parity");
    const shared = SHARED_HIDDEN.filter((r) => r.side === "build");
    expect(styles).toEqual([`${shared.map((r) => r.selector).join(", ")} { display: none !important; }`]);
    expect(styles).toEqual([sharedHiddenCss("build")]);
    expect(log.mock.calls.map(([line]) => String(line))).toEqual(shared.map((r) => `[visual-parity] contact: ${r.selector} hidden in the build (${r.approvedBy}): ${r.reason}`));
  });

  it("puts the shared rules first, the tap areas' then the price lines', then the page's own", () => {
    expect(SHARED_HIDDEN).toEqual([...TAP_AREA_HIDDEN, ...PRICE_LINE_HIDDEN]);
    expect(visualHidden("store").slice(0, SHARED_HIDDEN.length)).toEqual(SHARED_HIDDEN);
    expect(visualHidden("store").slice(SHARED_HIDDEN.length)).toEqual(VISUAL_HIDDEN.store);
  });
});
