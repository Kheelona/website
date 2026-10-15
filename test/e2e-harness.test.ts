import type { Page } from "@playwright/test";
import postcss, { type AtRule } from "postcss";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ARTICLE_SLUGS as PLAN_ARTICLES } from "@/content/en-IN/routes";
import { ARTICLE_CLOSES, stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import {
  FOOTER_COLS_HIDDEN,
  FOOTER_ROWS,
  PRICE_LINE_HIDDEN,
  PRICE_LINE_TEXT,
  SHARED_HIDDEN,
  TAP_AREA_HIDDEN,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
  hiddenCss,
  hideDeviations,
  priceLineText,
  sellerHiddenCss,
  sharedHiddenCss,
  textDeviations,
  visualHidden,
} from "./e2e/support/deviations";
import { readRepoFile } from "./e2e/support/repo";
import { SELLER_FACTS_APPROVED } from "./e2e/support/seller-facts";
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

  it("adds the side's hiding styles, the shared rules' then the page's own then D063's, and prints each rule under the calling spec's name", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const { page, styles } = fakePage();
    await hideDeviations(page, "store-confirmation", "build", "thanks-paid");
    expect(styles).toEqual([sharedHiddenCss("build"), hiddenCss("store-confirmation", "build"), sellerHiddenCss("store-confirmation", "build")]);
    expect(log.mock.calls.length).toBeGreaterThan(0);
    for (const [line] of log.mock.calls) expect(String(line)).toMatch(/^\[thanks-paid\] store-confirmation: /);
    log.mockClear();
    await hideDeviations(page, "store-confirmation", "mockup", "visual-parity");
    for (const [line] of log.mock.calls) expect(String(line)).toMatch(/^\[visual-parity\] store-confirmation: /);
  });

  /* Since task 7.1a every page shares one rule (TAP_AREA_HIDDEN, the tap-area row V23: a help line under a trust line sits
     lower in the build), since task Q2.8 a second (PRICE_LINE_HIDDEN: the price lines D065 item 3 rewords), and since
     task Q2.14 a third (FOOTER_COLS_HIDDEN: the footer's link rows, V54 and V64), applied before the page's own, so no
     page is without them. A guide the approved mockups do not show has no rule of its own and none of D063's (task Q2.3:
     the ruling reads the mockups). */
  it("applies the rules every page shares to a page with none of its own on that side, and prints exactly those", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const { page, styles } = fakePage();
    const slug = "article:busy-hands-no-screens";
    expect(VISUAL_HIDDEN[slug] ?? []).toEqual([]);
    expect(hiddenCss(slug, "build")).toBe("");
    expect(sellerHiddenCss(slug, "build")).toBe("");
    await hideDeviations(page, slug, "build", "visual-parity");
    const shared = SHARED_HIDDEN.filter((r) => r.side === "build");
    expect(styles).toEqual([`${shared.map((r) => r.selector).join(", ")} { display: none !important; }`]);
    expect(styles).toEqual([sharedHiddenCss("build")]);
    expect(log.mock.calls.map(([line]) => String(line))).toEqual(shared.map((r) => `[visual-parity] ${slug}: ${r.selector} hidden in the build (${r.approvedBy}): ${r.reason}`));
  });

  it("puts the shared rules first, the tap areas' then the price lines' then the footer's columns', then the page's own, then D063's (task Q2.3)", () => {
    expect(SHARED_HIDDEN).toEqual([...TAP_AREA_HIDDEN, ...PRICE_LINE_HIDDEN, ...FOOTER_COLS_HIDDEN]);
    const own = VISUAL_HIDDEN.store ?? [];
    expect(visualHidden("store").slice(0, SHARED_HIDDEN.length)).toEqual(SHARED_HIDDEN);
    expect(visualHidden("store").slice(SHARED_HIDDEN.length, SHARED_HIDDEN.length + own.length)).toEqual(own);
    const ruling = visualHidden("store").slice(SHARED_HIDDEN.length + own.length);
    expect(ruling.length).toBeGreaterThan(0);
    for (const rule of ruling) expect(rule.approvedBy).toBe(SELLER_FACTS_APPROVED);
  });

  /* Task Q2.14 (V54, V64): the footer's link rows are shorter than the approved mockup's on every marketing page (44 px on
     touch, 32 px with a fine pointer), so each page's last chunk compares the footer without its columns, on both sides,
     by one shared rule; no page lists it again. chrome.spec.ts compares the columns themselves, with the approved rows
     (FOOTER_ROWS) given to the mockup's footer: those rows are footer.css's own, rule for rule. */
  it("hides the footer's link columns on both sides of every page by one shared rule (V54, V64), and no page again", () => {
    expect(FOOTER_COLS_HIDDEN.map((r) => [r.side, r.selector])).toEqual([
      ["mockup", "footer.kh-footer .kh-footer__cols"],
      ["build", "footer.kh-footer .kh-footer__cols"],
    ]);
    for (const rule of FOOTER_COLS_HIDDEN) {
      expect(rule.approvedBy).toMatch(/\bV54\b.*\bV64\b/);
      expect(rule.reason.length).toBeGreaterThan(40);
    }
    for (const slug of ["home", "safety", "contact", "privacy", "article:busy-hands-no-screens"]) {
      expect(visualHidden(slug), slug).toEqual(expect.arrayContaining([...FOOTER_COLS_HIDDEN]));
    }
    for (const [slug, rules] of Object.entries(VISUAL_HIDDEN)) {
      expect(rules.filter((r) => r.selector.includes("kh-footer__cols")), slug).toEqual([]);
    }
  });

  it("re-rules the mockup's footer with the approved rows, which are footer.css's own (V54, V64)", () => {
    const rows = (css: string) => {
      const out: string[] = [];
      postcss.parse(css).walkRules(".kh-footer__col a", (rule) => {
        const at = rule.parent?.type === "atrule" ? `@media ${(rule.parent as AtRule).params} ` : "";
        rule.walkDecls((decl) => void out.push(`${at}${decl.prop}: ${decl.value}`));
      });
      return out;
    };
    expect(rows(FOOTER_ROWS.css)).toEqual(rows(readRepoFile("src/components/chrome/Footer/footer.css")));
    expect(rows(FOOTER_ROWS.css)).toHaveLength(2);
    expect(FOOTER_ROWS).toMatchObject({ touch: 44, fine: 32 });
    expect(FOOTER_ROWS.approvedBy).toBe(FOOTER_COLS_HIDDEN[0].approvedBy);
  });

  it("gives the text pass task Q2.8's rules, then each page's own, then D063's, which excuse the help line and accept its new words", () => {
    const home = textDeviations("home");
    const priceLines = priceLineText("home");
    expect(home.slice(0, priceLines.length)).toEqual(priceLines);
    expect(home.slice(priceLines.length, priceLines.length + TEXT_DEVIATIONS.home.length)).toEqual(TEXT_DEVIATIONS.home);
    const [ruling, ...more] = home.slice(priceLines.length + TEXT_DEVIATIONS.home.length);
    expect(more).toEqual([]);
    expect(ruling.approvedBy).toBe(SELLER_FACTS_APPROVED);
    expect(ruling.mockup.test("WhatsApp or call +91 91875 46483")).toBe(true);
    expect(ruling.build?.test("Message us on WhatsApp.")).toBe(true);
    expect(ruling.mockup.test("Questions?")).toBe(false);
    /* Besides the price lines' rule every page shares, /contact's main changes nothing the text pass reads but the seller
       card's GSTIN line, and a guide the approved mockups do not show has that shared rule alone. */
    expect(textDeviations("contact").map((r) => r.approvedBy)).toEqual([PRICE_LINE_TEXT.approvedBy, SELLER_FACTS_APPROVED]);
    expect(textDeviations("article:busy-hands-no-screens")).toEqual([PRICE_LINE_TEXT]);
  });

  it("hides /contact's seller card on both sides, its only block D063 rewords (the GSTIN line off)", () => {
    expect(VISUAL_HIDDEN.contact ?? []).toEqual([]);
    const contact = visualHidden("contact").filter((r) => r.approvedBy === SELLER_FACTS_APPROVED);
    expect(contact.map((r) => [r.side, r.selector])).toEqual([
      ["mockup", ".kh-footer__legal"],
      ["build", ".kh-footer__legal"],
      ["mockup", 'section[aria-labelledby="seller-title"]'],
      ["build", 'section[aria-labelledby="seller-title"]'],
    ]);
  });
});
