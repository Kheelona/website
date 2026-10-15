import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { MRP_PRICE } from "@/config/site";
import type { Offer, OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../../test/e2e/support/page-checks";
import {
  AFTER_SIX_MONTHS,
  CLAIM_FIXES,
  COPY_FIXES,
  FAQ_FIXES,
  FOUNDER_ANSWERS,
  FOUNDER_ANSWERS_APPROVED,
  G28_LINES,
  LANGUAGES_FAQ,
  OFFER_ADDITIONS,
  PRODUCT_CHATS,
  PRODUCT_COMPARE,
  PRODUCT_HERO,
  PRODUCT_KNOW,
  PRODUCT_OFFER_ALT,
  PRODUCT_SAFETY_LINE,
  PROOF_ADDITIONS,
  PROOF_ADDITIONS_APPROVED,
  PROOF_EXAMPLE_BUILD,
  PROOF_STEPS_BUILD,
  PRODUCT_RECOGNISED,
  RETURNS_QUESTION,
  SCREEN_TIME_FAQ,
  SELLING_ADDITIONS,
  SELLING_UPDATE,
  SELLING_UPDATE_APPROVED,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
} from "../../../../../test/e2e/support/deviations";
import { findBanned } from "../../../../../test/guards/banned-phrases.data";
import { htmlToText } from "../../../../../test/e2e/support/mockup-text";
import { PAGE_FACTS } from "../../../../../test/e2e/support/page-facts";
import { sentences } from "../../../../../test/e2e/support/parity";
import { ROOT } from "../../../../../test/e2e/support/repo";
import { mockupRoute as mockupPageRoute } from "../../../../../test/e2e/support/routes";
import { withSellerFacts } from "../../../../../test/e2e/support/seller-facts";
import { mockupLinks, mockupPage, STORE, withOneCtaShape, words } from "../../../../../test/support/mockup-compare";
import { blockSentences, factSentences, hiddenProblems, ruleReach, withFacts } from "../../../../../test/support/mockup-facts";
import { cta } from "../../cta";
import { faqs, filmLink } from "../../faqs";
import { filmQuotes, films } from "../../films";
import { recognitionStrip } from "../../recognition";
import { seller } from "../../seller";
import { kheeluPage } from "./page";
import { product } from "./product";

/*
 * The product page's content (task 5.2; structure §5 "meet-kheelu.html"; meet-kheelu.md): rendered by the template that
 * ships, it says and links exactly what the approved mockup's `main` says and links, fold by fold, in both offer modes.
 * The sections' own tests prove their markup against the same folds; this file proves the page's content feeds them
 * the approved words, addresses, names, reveals and tracking values, and the structured data the copy page asks for.
 * The mockup is compared with the founder's page facts applied (task 6.7; test/e2e/support/page-facts.ts): the parent
 * app's phones filled (D055 item 26), and the rows and lines still waiting on an F4 value hidden (D054 item 19); and
 * with task 7.1b's copy fixes (deviation V17; test/e2e/support/deviations.ts COPY_FIXES): the films heading without a
 * count (D056 item 2) and the sources line in Home's short form (CMO review A M6); then with task 8b.1's claim fixes
 * (deviation V27; CLAIM_FIXES["meet-kheelu"]; D058): Kheelona+ as D058 item 3 words it, the parent app as the live
 * team's code check found it (fold 5 without the four-skills report and its chips), the safety block, specs, Safety
 * tab and two answers in the code-checked words; then with task 8c.2's offer additions (OFFER_ADDITIONS["meet-kheelu"];
 * D061): the card's later price in token mode and the share link under the card, tracked share-whatsapp; then with task
 * 8c.4's FAQ fix (FAQ_FIXES["meet-kheelu"]; D061): the questions fold answers "Which languages does Kheelu speak?" after
 * the first-week question; then with task Q2.10's selling update (SELLING_UPDATE["meet-kheelu"]; D064 items 2 and 8,
 * D065; the D2C plan v2 §3): the hero's eyebrow and lead without the help line, the offer photo's alt, Good to know with
 * "instead of guessing" and the daily limit, the parent-app and safety folds off the page (their words are /safety's,
 * task Q2.11), the price answer with the total and no GST, the delivery question off and the Kheelona+ question on.
 */

const PATH = "/products/kheelu";
const TOKEN = buildOffer("token");
const FULL = buildOffer("full");

/** The page as the site shell holds it: the template's output in `main#main`. `main` is the page without the blocks
 *  task 8c.3 adds (PROOF_ADDITIONS; D061 item 4 and the main session's rulings: the parents' quotes, the recognition
 *  strip, the four steps and the example conversation, on tabs since task Q2.10) and without the folds task Q2.10 adds
 *  (SELLING_ADDITIONS: the comparison moved from Home and the safety line), what must equal the approved page with its
 *  accepted changes; `whole` is the page as it renders, on which those blocks are tested below. (Task 8c.6's expert clip
 *  left the page with task Q2.10: task Q2.9 takes it to Home, D064 item 8.) */
function rendered(offer: Offer) {
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(<PageTemplate page={kheeluPage} offer={offer} path={PATH} />)}</main></body></html>`;
  const whole = new DOMParser().parseFromString(html, "text/html");
  const doc = whole.cloneNode(true) as Document;
  for (const selector of [...PROOF_ADDITIONS["meet-kheelu"].selectors, ...SELLING_ADDITIONS["meet-kheelu"].selectors]) for (const el of doc.querySelectorAll(selector)) el.remove();
  return { html, doc, main: doc.querySelector("main")!, whole: whole.querySelector("main")! };
}

/** D061 item 1 (task 8c.1): the hero's phone board is the one block the approved page does not have (its markup is
 *  HeroSection's test's, its place test/e2e/first-screen.spec.ts's): the page is compared with the mockup without it. */
const PHONE_ART = ".ks-hero__phone-art";
const RENDERED = rendered(TOKEN);
const withoutPhoneArt = (main: Element) => {
  const copy = main.cloneNode(true) as Element;
  copy.querySelectorAll(PHONE_ART).forEach((el) => el.remove());
  return copy;
};
const BUILT = { ...RENDERED, main: withoutPhoneArt(RENDERED.main) };
const APPROVED = mockupPage("meet-kheelu").querySelector("main")!;
/** The approved page with the founder's page facts (task 6.7) and task 7.1b's copy fixes applied, then task 8b.1's claim
 *  fixes, task 8c.2's offer additions and task 8c.4's FAQ fix, each in a pass of its own: the mockup task Q2.10's selling
 *  update starts from. */
const BEFORE_SELLING = withFacts(
  withFacts(
    withFacts(withFacts(APPROVED, [...PAGE_FACTS["meet-kheelu"].edits, ...COPY_FIXES["meet-kheelu"].edits]), CLAIM_FIXES["meet-kheelu"].edits),
    OFFER_ADDITIONS["meet-kheelu"].edits,
  ),
  FAQ_FIXES["meet-kheelu"].edits,
);
const SELLING = SELLING_UPDATE["meet-kheelu"];
/** Then task Q2.10's selling update (SELLING_UPDATE) in a pass of its own, then task Q2.17's founder answers in theirs
 *  (FOUNDER_ANSWERS; D066), and D063 item 2: the help lines without the call (task Q2.3; seller-facts.ts; the consumer
 *  care declaration keeps it, task Q2.10): what the build must say. */
const ANSWERS = FOUNDER_ANSWERS["meet-kheelu"];
const MOCKUP = withSellerFacts(withFacts(withFacts(BEFORE_SELLING, SELLING.edits), ANSWERS.edits));
/* And the one CTA block shape (task Q2.15, the consistency review's R2): every CTA block's button full width on phones
   with the arrow (test/support/mockup-compare.ts `withOneCtaShape`). */
withOneCtaShape(MOCKUP);
/** The folds: `main`'s sections, in order (React's image preload links and the JSON-LD script left out). */
const folds = (main: Element) => [...main.children].filter((el) => el.tagName === "SECTION");
const name = (el: Element) => el.getAttribute("aria-labelledby");
/** An element's text, white space collapsed (the parsed document is not the test's own, so no DOM matchers here). */
const text = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

/** P15's default (deviations.md V6; task 4.7 item 4): the shared FAQ answer "What if it isn’t right for us, or stops
 *  working?" gives D033's remedy for a faulty Kheelu, as /refund does. The rule deviations.ts holds for it, and the one
 *  sentence it accepts on each side, read from the two pages' folds (exactly one each, so the rule is precise; the
 *  JSON-LD script is not a fold). */
const P15_RULE = TEXT_DEVIATIONS["meet-kheelu"].find((rule) => rule.approvedBy.startsWith("deviations.md V6"));
const only = (from: Element, pattern: RegExp | undefined) => {
  const found = folds(from).flatMap((fold) => sentences(text(fold))).filter((s) => pattern?.test(s));
  if (found.length !== 1) throw new Error(`P15: expected one sentence matching ${pattern}, found ${JSON.stringify(found)}`);
  return found[0];
};
const P15 = { mockup: only(MOCKUP, P15_RULE?.mockup), build: only(BUILT.main, P15_RULE?.build) };

describe("the product page's meta (meet-kheelu.md \"At a glance\")", () => {
  const plain = (mode: OfferMode) => ({
    title: toPlainText(kheeluPage.meta.title, buildOffer(mode)),
    description: toPlainText(kheeluPage.meta.description, buildOffer(mode)),
  });

  it("keeps the mockup's title, word for word (the D2C plan v2 §3: unchanged)", () => {
    expect(plain("token").title).toBe(mockupPageRoute("meet-kheelu").title);
    expect(plain("full").title).toBe(mockupPageRoute("meet-kheelu").title);
  });

  /* Task Q2.10 (the D2C plan v2 §3 "Product page: title, meta, keywords"; D065 item 3): the total, never "incl. GST". */
  it("describes the page with the total and no GST in both modes, as the plan words it", () => {
    expect(plain("token").description).toBe(
      "Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to 7. ₹4,999 in total; ₹499 refundable advance.",
    );
    expect(plain("full").description).toBe(
      "Kheelu, the screen-free toy that talks back: it answers your child, then asks a question back. Ages 3 to 7. ₹7,999 in total, delivery included.",
    );
    for (const mode of ["token", "full"] as const) {
      expect(plain(mode).description.length, mode).toBeLessThanOrEqual(155);
      expect(plain(mode).description, mode).not.toMatch(/GST/);
    }
  });

  it("shares the Kheelu card with the copy page's words, and passes pageMeta in both modes", () => {
    expect(kheeluPage.meta.og).toEqual({ image: "/og/kheelu.jpg", alt: "Kheelu, the cream plush rabbit that talks back" });
    expect(existsSync(join(ROOT, "public", kheeluPage.meta.og.image))).toBe(true);
    for (const offer of [TOKEN, FULL]) expect(() => pageMeta({ ...kheeluPage.meta, path: PATH, offer })).not.toThrow();
  });
});

describe("the product page as rendered (token mode)", () => {
  it("holds the mockup's folds left after the selling update (task Q2.10), in order, each named by the mockup's heading", () => {
    expect(folds(MOCKUP).map(name)).toEqual(["hero-title", "films-title", "offer-title", "modes-title", "specs-title", "faq-title", "close-title"]);
    expect(folds(BUILT.main).map(name)).toEqual(folds(MOCKUP).map(name));
    expect(folds(BUILT.main).map((f) => f.id)).toEqual(folds(MOCKUP).map((f) => f.id));
  });

  it("changes the approved page only where the founder's facts, task 7.1b's copy fixes, task 8b.1's claim fixes and D063 do, before the selling update", () => {
    const before = withSellerFacts(BEFORE_SELLING);
    const changed = folds(APPROVED).filter((fold, i) => words(fold) !== words(folds(before)[i])).map(name);
    // Fold 2's heading and fold 8's sources line (V17, task 7.1b); fold 4's charging line and fold 7's details (V16); the
    // offer card, Good to know, fold 5, fold 6, fold 7 and two answers (V27, task 8b.1); the hero's and the close's help
    // lines (D063 item 2; task Q2.3).
    expect(changed).toEqual(["hero-title", "films-title", "offer-title", "modes-title", "app-title", "safety-title", "specs-title", "faq-title", "close-title"]);
    // Each claim-fix block once, but those in the parent-app and safety folds, which left with task Q2.10.
    for (const hide of CLAIM_FIXES["meet-kheelu"].hidden.both) expect(BUILT.main.querySelectorAll(hide), hide).toHaveLength(/^#app\b|safety-title/.test(hide) ? 0 : 1);
    const facts = withFacts(APPROVED, PAGE_FACTS["meet-kheelu"].edits);
    expect(folds(APPROVED).filter((fold, i) => words(fold) !== words(folds(facts)[i])).map(name)).toEqual(["modes-title", "specs-title"]);
  });

  it("titles the films without a count or a place under the films' count (D056 item 2, D057 item 2) and cites Harvard in Home's short form (CMO A M6; V17)", () => {
    const films = BUILT.main.querySelector("#films-title")!;
    expect(text(films.closest("header")!.querySelector(".kh-eyebrow"))).toBe(COPY_FIXES["meet-kheelu"].build[0]);
    expect(text(films)).toBe(COPY_FIXES["meet-kheelu"].build[1]);
    expect(films.querySelector(".kh-hand")?.textContent).toBe("real families.");
    expect(text(BUILT.main.querySelector("#src-1"))).toBe(COPY_FIXES["meet-kheelu"].build[3]);
    expect(BUILT.main.querySelector("#src-1 a")?.getAttribute("href")).toBe("https://developingchild.harvard.edu/key-concept/serve-and-return/");
  });

  it("says, fold by fold, exactly what the mockup says with the founder's facts and the copy fixes applied, P15's one sentence aside (V6)", () => {
    const built = folds(BUILT.main);
    // The one accepted difference is in the questions fold, and it is there in the mockup to be replaced (not vacuous).
    expect(folds(MOCKUP).filter((fold) => words(fold).includes(P15.mockup)).map(name)).toEqual(["faq-title"]);
    folds(MOCKUP).forEach((fold, i) => expect(words(built[i]), name(fold) ?? `fold ${i + 1}`).toBe(words(fold).replace(P15.mockup, P15.build)));
  });

  it("links every address the mockup links, in the same order (the store as this build's store)", () => {
    const hrefs = (root: Element) => [...root.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")!);
    // mockupLinks: the mockup's addresses as routes, each trust link with its part of the terms page (task 7.1a, m8).
    expect(hrefs(BUILT.main)).toEqual(mockupLinks(MOCKUP));
    expect(hrefs(BUILT.main).filter((h) => h === STORE)).toHaveLength(3);
  });

  it("carries the mockup's CTA values, in order (architecture §8.3; meet-kheelu.md \"CTA tracking values\")", () => {
    const values = (root: Element) => [...root.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"));
    expect(values(BUILT.main)).toEqual(values(MOCKUP));
    // share-whatsapp: the share link under the offer card (D061, task 8c.2), in the mockup through OFFER_ADDITIONS. The
    // safety fold's product-safety and product-safety-learn left with it (task Q2.10); the whole page's are below.
    expect(values(BUILT.main)).toEqual(["product-top", "product-offer", "share-whatsapp", "product-foot"]);
  });

  it("names what the mockup names: regions, lists, boards, buttons and markers (aria-label), in order", () => {
    const labels = (root: Element) => [...root.querySelectorAll("[aria-label]")].map((el) => el.getAttribute("aria-label"));
    expect(labels(BUILT.main)).toEqual(labels(MOCKUP));
  });

  it("describes every picture as the mockup does (alt text), decorative layers left empty", () => {
    // A doodle below the first screen is the inline SVG that draws itself (D049 pick 3), hidden from the tree as the
    // mockup's <img alt=""> is: both count as one decorative picture, in document order.
    const alts = (root: Element) =>
      [...root.querySelectorAll("img, svg.ks-doodle[data-draw]")].map((el) => (el.tagName === "IMG" ? el.getAttribute("alt") : el.getAttribute("aria-hidden") === "true" ? "" : "named svg"));
    expect(alts(BUILT.main)).toEqual(alts(MOCKUP));
  });

  it("draws every icon the mockup draws, in order: the same DS glyph each time", () => {
    // The facts line's icons come from trust.ts typed as content (IconRef) and reach the section by a type assertion,
    // and the close swaps the delivery item's icon (wave-3 close), so the glyphs themselves are compared here.
    const glyphs = (root: Element) => [...root.querySelectorAll("svg.kh-icon")].map((svg) => [...svg.querySelectorAll("path")].map((p) => p.getAttribute("d")).join(" "));
    expect(glyphs(BUILT.main)).toEqual(glyphs(MOCKUP));
    expect(glyphs(BUILT.main).length).toBeGreaterThan(20);
  });

  it("reveals exactly the blocks the mockup reveals, and never the money (SPA 9)", () => {
    const reveals = (root: Element) => folds(root).map((f) => f.querySelectorAll("[data-reveal]").length);
    expect(reveals(BUILT.main)).toEqual(reveals(MOCKUP));
    expect(revealOnMoneyInDocument(BUILT.doc)).toEqual([]);
  });

  it("keeps every fragment the mockup has, plus the two the old page carried (#story-mode, #reserve; url-map §5a)", () => {
    const ids = (root: Element) => [...root.querySelectorAll("[id]")].map((el) => el.id);
    const built = ids(BUILT.main);
    for (const id of ids(MOCKUP)) expect(built, id).toContain(id);
    // #safety stays, on the safety line that points to /safety (task Q2.10); #app left with the parent-app fold.
    for (const id of ["faq", "story-mode", "reserve", "offer", "specs", "films", "modes", "safety", "close"]) {
      expect(RENDERED.whole.querySelectorAll(`[id="${id}"]`), id).toHaveLength(1);
    }
    expect(RENDERED.whole.querySelector("#app")).toBeNull();
    expect(text(BUILT.main.querySelector("#story-mode"))).toBe("Story mode");
    expect(BUILT.main.querySelector("#reserve")?.getAttribute("data-ph-capture-attribute-cta")).toBe("product-foot");
  });

  it("shows the phone buy bar from first paint: the hero's button carries no id for the bar to watch", () => {
    const hero = folds(BUILT.main)[0];
    expect(hero.querySelector(".kh-btn--cta")?.hasAttribute("id")).toBe(false);
    expect(BUILT.main.querySelector("#hero-cta")).toBeNull();
  });

  it("adds one block to the approved page, the hero's phone board (D061 item 1): the board's name, tone, files and words", () => {
    const phone = [...RENDERED.main.querySelectorAll(PHONE_ART)];
    expect(phone).toHaveLength(1);
    const approved = folds(BUILT.main)[0].querySelector(".kh-art")!;
    expect(name(phone[0].closest("section")!)).toBe("hero-title");
    expect(phone[0].getAttribute("aria-label")).toBe(approved.getAttribute("aria-label"));
    expect(phone[0].className).toBe(`${approved.className} ${PHONE_ART.slice(1)}`);
    const files = (board: Element) => [...board.querySelectorAll(".kh-art__layer")].map((layer) => layer.getAttribute("src")).sort();
    expect(files(phone[0])).toEqual(files(approved));
    // The approved board's sticker sits top left, clear of Myra's face (ks-hero-sticker); the phone board's in its own corner.
    expect(text(phone[0].querySelector(".kh-sticker"))).toBe(text(approved.querySelector(".kh-sticker")));
    expect(phone[0].querySelectorAll("[data-draw], [data-reveal]")).toHaveLength(0);
  });

  it("keeps the hero's doodle still and lets the close's doodle draw (D049 picks 2 and 3)", () => {
    const [hero] = folds(BUILT.main);
    const close = BUILT.main.querySelector("#close")!;
    expect(hero.querySelector("[data-draw]")).toBeNull();
    expect(close.querySelectorAll(".ks-doodle[data-draw]")).toHaveLength(1);
  });

  it("puts the details on tabs named \"Product details\", every panel's words in the HTML (3.5; P1)", () => {
    const specs = BUILT.main.querySelector("#specs")!;
    expect(specs.querySelector('[role="tablist"]')?.getAttribute("aria-label")).toBe("Product details");
    for (const id of ["panel-specs", "panel-box", "panel-safety", "tab-specs", "tab-box", "tab-safety"]) expect(specs.querySelector(`#${id}`), id).not.toBeNull();
    expect(words(specs.querySelector("#panel-box")!)).toBe(["In the box", ...product.box.map((b) => b.text)].join(" "));
  });

  it("declares the MRP from the checkout's own constant, labelled exactly \"MRP\" (D034)", () => {
    for (const offer of [TOKEN, FULL]) {
      const declarations = rendered(offer).main.querySelector("#specs .ks-declare")!;
      expect(words(declarations.querySelector("dl > div")!)).toBe(`MRP ${MRP_PRICE} (incl. of all taxes)`);
    }
  });

  /* Task Q2.8 (D065 item 3; the D2C plan v2 §1.1, product folds 3 and 12): the one risk-reversal line under every button,
     first, the delivery line second; the offer card adds the card's third row (its own list since task Q2.15, the
     consistency review's CON-3); the close carries the trust line. */
  it("leads every trust line beside a button with the risk-reversal line, the delivery line second", () => {
    const row = (el: Element) => [...el.querySelectorAll("li")].map((li) => text(li));
    const LINE = ["Full refund until dispatch · 7-day returns", "Deliveries start mid-November"];
    // The linked trust lines (`ks-trust`; the safety facts line is not linked), the offer card's third row aside.
    const rows = [...RENDERED.main.querySelectorAll(".ks-trust:not(.ks-offer-third)")].map(row);
    expect(rows.length).toBeGreaterThanOrEqual(3);
    for (const r of rows) expect(r).toEqual(LINE);
    expect([...BUILT.main.querySelectorAll("#offer .ks-trust")].map(row)).toEqual([LINE, ["6-month warranty", "UPI, card or net banking"]]);
    expect(BUILT.main.querySelector("#offer .ks-trust + .ks-trust")?.getAttribute("class")).toBe("kh-trustline ks-trust ks-offer-third");
    expect(row(BUILT.main.querySelector("#close .ks-trust")!)).toEqual(LINE);
    expect(rows.flat()).not.toContain("7-day returns, no questions asked");
    // Each item keeps its one icon from trust.ts: the returns arrow, then the truck.
    const icons = [...BUILT.main.querySelectorAll("#close .ks-trust li path")].map((p) => p.getAttribute("d"));
    expect(icons).toEqual([ICON_PATHS["arrow-counter-clockwise"], ICON_PATHS.truck]);
  });

  it("shows the D025 line under the questions, without opening an answer", () => {
    expect(text(BUILT.main.querySelector("#faq .ks-faq__disclaimer"))).toBe(
      "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.",
    );
  });

  it("loads every film poster lazily: the hero board is the page's one eager picture (N19)", () => {
    const posters = [...BUILT.main.querySelectorAll("#films img")];
    expect(posters).toHaveLength(films.length);
    for (const poster of posters) expect(poster.getAttribute("loading")).toBe("lazy");
  });
});

describe("the product page in full mode", () => {
  const { main } = rendered(FULL);

  it("prints the full-mode price line beside every chilli button and drops the split", () => {
    // The short price line (D065 item 3; task Q2.8): the hero, the sample chats (task Q2.10) and the close.
    const whole = rendered(FULL).whole;
    expect([...whole.querySelectorAll(".ks-price")].map((p) => p.textContent)).toEqual(Array(3).fill("₹7,999 in total, paid in full when you order."));
    expect(main.querySelector(".kh-offer__split")).toBeNull();
  });

  it("asks and answers the price question in its full-mode words (meet-kheelu.md fold 8)", () => {
    expect(text(main.querySelector("#faq"))).toContain(toPlainText(faqs["cost-and-advance"].question, FULL));
    expect(text(main.querySelector("#faq"))).toContain(toPlainText(faqs["cost-and-advance"].answer, FULL));
  });
});

describe("the product page's structured data (architecture §9.2)", () => {
  type Node = Record<string, unknown> & { "@type": string };
  const graph = (offer: Offer) => {
    const { html } = rendered(offer);
    const [block] = jsonLdBlocks(html) as { "@graph": Node[] }[];
    return { html, nodes: block["@graph"] };
  };

  it.each([
    ["token", TOKEN],
    ["full", FULL],
  ] as const)("is the Product with its Offer, then the FAQPage of the questions and answers exactly as shown (%s mode)", (_mode, offer) => {
    const { nodes } = graph(offer);
    expect(nodes.map((n) => n["@type"])).toEqual(["Product", "FAQPage"]);
    const entities = nodes[1].mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    const shown = [...rendered(offer).main.querySelectorAll("#faq .kh-faq__item")];
    // The questions the page lists (task Q2.10: the Kheelona+ question in, the delivery question out).
    expect(entities.map((q) => q.name)).toContain(toPlainText(faqs.languages.question, offer));
    expect(entities.map((q) => q.name)).toContain(AFTER_SIX_MONTHS.question);
    expect(entities.map((q) => q.name)).not.toContain("When does delivery start?");
    expect(entities.map((q) => q.name)).toEqual(shown.map((item) => text(item.querySelector(".kh-faq__q"))));
    expect(entities.map((q) => q.acceptedAnswer.text)).toEqual(shown.map((item) => text(item.querySelector(".kh-faq__a"))));
  });

  it("keeps the Product's identity: the old @id, the name, the former name, the brand, ages 3 to 7", () => {
    const [p] = graph(TOKEN).nodes;
    expect(p).toMatchObject({
      "@id": "https://kheelona.com/products/lumi#product",
      name: "Kheelu by Kheelona",
      alternateName: "Lumi",
      brand: { "@type": "Brand", name: "Kheelona" },
      url: "https://kheelona.com/products/kheelu",
      image: ["https://kheelona.com/media/kheelu-front.jpg"],
      audience: { "@type": "PeopleAudience", suggestedMinAge: 3, suggestedMaxAge: 7 },
    });
    // Only the announced specs: the F4 rows are hidden (D054 item 19), and the parent app's row is filled (D055 item 26).
    const properties = (p.additionalProperty as { name: string; value: string }[]).map((x) => x.name);
    expect(properties).toEqual(product.specs.map((row) => row.term));
    expect(properties).toContain("Ages");
    expect(properties).not.toContain("Size and weight");
    expect((p.additionalProperty as { name: string; value: string }[]).find((x) => x.name === "Parent app")?.value).toMatch(/ On iPhone and Android\.$/);
  });

  it.each([
    ["token", TOKEN, 4999],
    ["full", FULL, 7999],
  ] as const)("offers it at the headline the page shows (%s mode), leading with that amount (D028)", (_mode, offer, price) => {
    const { html, nodes } = graph(offer);
    const offers = nodes[0].offers as Record<string, unknown>;
    expect(offers).toMatchObject({
      price,
      priceCurrency: "INR",
      availability: "https://schema.org/PreOrder",
      availabilityStarts: "2026-11-15",
      hasMerchantReturnPolicy: { merchantReturnDays: 7, returnFees: "https://schema.org/FreeReturn", refundType: "https://schema.org/FullRefund" },
      shippingDetails: { shippingRate: { value: 0, currency: "INR" }, shippingDestination: { addressCountry: "IN" } },
      warranty: { durationOfWarranty: { value: 6, unitCode: "MON" } },
    });
    expect(offers).not.toHaveProperty("priceValidUntil");
    expect(String(offers.description).match(/₹[\d,]+/)?.[0]).toBe(offer.prices.headline);
    expect(String(nodes[0].description)).not.toMatch(/₹/);
    // The shared detector (jsonld-matches-page): every answer, price and policy number is on the page, FAQ 8's
    // "skills.[1] Kheelu" included (its `norm` drops the space htmlToText puts before an inline marker; task 4.6).
    expect(jsonLdMismatches(html)).toEqual([]);
  });
});

describe("the module's imports (structure §6, wave-4 close: page modules import types only from layouts and components)", () => {
  /** Every import of page.ts from components or layouts: its source and whether it is `import type`. */
  const sharedImports = () =>
    [...readFileSync(join(ROOT, "src/content/en-IN/products/kheelu/page.ts"), "utf8").matchAll(/^import\s+(type\s+)?[^;]*?from\s+"([^"]+)";/gm)]
      .filter((m) => /^@\/(components|layouts)\//.test(m[2]))
      .map((m) => ({ from: m[2], typeOnly: Boolean(m[1]) }));

  it("takes only types from components and layouts, never a value", () => {
    expect(sharedImports().length).toBeGreaterThan(0);
    expect(sharedImports().filter((i) => !i.typeOnly)).toEqual([]);
  });
});

describe("the founder's page facts as a text deviation (deviations.md V16; task 6.7)", () => {
  const FACTS = PAGE_FACTS["meet-kheelu"];
  const rule = TEXT_DEVIATIONS["meet-kheelu"].find((r) => r.approvedBy === FACTS.approvedBy)!;

  it("lists exactly the sentences the facts change (page-facts.ts against the mockup)", () => {
    expect(factSentences(APPROVED, FACTS.edits)).toEqual({ missing: [...FACTS.mockup], extra: [...FACTS.build] });
  });

  it("excuses and accepts exactly those sentences, and no other line of the page", () => {
    expect(ruleReach(APPROVED, FACTS.edits, rule)).toEqual({ excused: [...FACTS.mockup], accepted: [...FACTS.build] });
  });

  it("accepts the parent app's line as the page prints it", () => {
    expect(sentences(htmlToText(BUILT.html))).toContain(FACTS.build[0]);
  });

  it("hides for the pixels exactly the blocks the facts change, each found once on its side (VISUAL_HIDDEN)", () => {
    expect(hiddenProblems(APPROVED, FACTS)).toEqual([]);
    const sel = (side: string) => VISUAL_HIDDEN["meet-kheelu"].filter((r) => r.side === side && r.approvedBy === FACTS.approvedBy).map((r) => r.selector);
    expect(sel("mockup")).toEqual([...FACTS.hidden.both, ...FACTS.hidden.mockup]);
    expect(sel("build")).toEqual([...FACTS.hidden.both, ...FACTS.hidden.build]);
    // The build side's selectors hold on the page as it renders, too.
    for (const selector of sel("build")) expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(1);
  });

  it("leaves beside them only the films heading and the sources line of the copy fixes (V17), then the claim fixes' blocks (V27), then the FAQ fix's question (task 8c.4), then the offer additions (task 8c.2), each found once on the page as it renders, then task 8c.3's added blocks, then the selling update's (task Q2.10)", () => {
    const claims = CLAIM_FIXES["meet-kheelu"];
    const selling = VISUAL_HIDDEN["meet-kheelu"].filter((r) => r.approvedBy === SELLING_UPDATE_APPROVED);
    const faq = FAQ_FIXES["meet-kheelu"];
    const additions = OFFER_ADDITIONS["meet-kheelu"];
    // The hero's phone art (D061 item 1, task 8c.1) is hidden under 720 px only, on both sides: HeroSection's test holds it.
    // (The offer photo, top-aligned with the card from 900 px since task Q2.15, needs no hide: under the pixels' other
    // hides the photo is the split's tallest column, where centred and top-aligned are the same place.)
    const phonesOnly = VISUAL_HIDDEN["meet-kheelu"].filter((r) => r.media);
    expect(phonesOnly.map((r) => [r.side, r.selector, r.media])).toEqual([
      ["mockup", ".mk-hero .kh-art", "(max-width: 719px)"],
      ["build", ".ks-hero .kh-art", "(max-width: 719px)"],
    ]);
    const others = VISUAL_HIDDEN["meet-kheelu"].filter((r) => r.approvedBy !== FACTS.approvedBy && r.approvedBy !== SELLING_UPDATE_APPROVED && !r.media);
    expect(selling.length).toBeGreaterThan(0);
    expect(others.map((r) => [r.side, r.selector, r.approvedBy])).toEqual([
      ...(["mockup", "build"] as const).flatMap((side) => ["#films-title", "#src-1"].map((selector) => [side, selector, COPY_FIXES["meet-kheelu"].approvedBy])),
      ...(["mockup", "build"] as const).flatMap((side) => claims.hidden.both.map((selector) => [side, selector, claims.approvedBy])),
      ...(["mockup", "build"] as const).flatMap((side) => faq.hidden.both.map((selector) => [side, selector, faq.approvedBy])),
      ...faq.hidden.build.map((selector) => ["build", selector, faq.approvedBy]),
      ...additions.hidden.build.map((selector) => ["build", selector, additions.approvedBy]),
      ...PROOF_ADDITIONS["meet-kheelu"].selectors.map((selector) => ["build", selector, PROOF_ADDITIONS_APPROVED]),
    ]);
    for (const selector of additions.hidden.build) expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(1);
    // The claim fixes' hides in the parent-app and safety folds find nothing on the build: those folds left with the
    // selling update (task Q2.10), which hides them whole on the mockup's side.
    const gone = (selector: string) => /^#app\b|safety-title/.test(selector);
    expect(claims.hidden.both.filter(gone)).toHaveLength(4);
    for (const selector of claims.hidden.both) expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(gone(selector) ? 0 : 1);
    // The build's alone holds the languages question: its hide finds it on the page the FAQ fixes start from (faqs.test.ts
    // proves it there). On the page as it renders, the selling update's questions move every item after the price question
    // (task Q2.13 puts Home's screen-time question fifth, in the delivery question's place, so the languages question is
    // ninth), and the selling update hides the questions' list whole on both sides: the hide finds one item of that list.
    const LIST = 'section[aria-labelledby="faq-title"] .kh-faq';
    expect(SELLING.hidden.both).toContain(LIST);
    for (const selector of faq.hidden.build) {
      expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(1);
      expect(BUILT.main.querySelector(selector)?.closest(LIST), selector).not.toBeNull();
    }
    const questions = [...BUILT.main.querySelectorAll(`${LIST} .kh-faq__q`)].map(text);
    expect(questions.indexOf(toPlainText(faqs.languages.question, TOKEN))).toBe(8);
    expect(BUILT.main.querySelectorAll("#films-title")).toHaveLength(1);
    expect(BUILT.main.querySelectorAll("#src-1")).toHaveLength(1);
  });
});

describe("the JavaScript-off text deviation for this route (deviations.md V3; test/e2e/support/deviations.ts)", () => {
  const DEVIATIONS = "../../../../../test/e2e/support/deviations";
  /** The sentences of the details panels that the tabs hide with JavaScript on: In the box and Safety. */
  const stacked = (p: typeof product) => [...p.box, ...p.safety].flatMap(({ text }) => sentences(toPlainText(text)));

  afterEach(() => {
    vi.doUnmock("./product");
    vi.resetModules();
  });

  it("is one rule, for the JavaScript-off run only (with JavaScript on the build's tabs hide what the mockup's hide)", () => {
    expect(TEXT_DEVIATIONS["meet-kheelu"].filter((rule) => rule.approvedBy.includes("V3"))).toEqual([
      expect.objectContaining({ mockup: /^Specs$/, jsOff: true }),
    ]);
    // The route's other rules are P15's (V6, task 4.7), the founder's page facts (V16, task 6.7), task 7.1b's copy fixes
    // (V17), task 8c.2's offer additions (D061, rows numbered at the merge), task 8c.3's added blocks, task Q2.10's
    // selling update and its added folds, task 8b.1's claim fixes (V27), task 8c.4's FAQ fix and task Q2.17's founder
    // answers (D066), for both runs: the FAQ answer, the details, the heading, the sources, the offer's two lines, the added
    // blocks, the selling update's lines, D058's lines, the languages question and D066's lines read the same with
    // JavaScript off. (Task 8c.6's expert clip left the page.)
    expect(TEXT_DEVIATIONS["meet-kheelu"].map((rule) => [rule.approvedBy.slice(0, "deviations.md V3".length), rule.jsOff ?? false])).toEqual([
      ["deviations.md V3", true],
      ["deviations.md V6", false],
      ["deviations.md V1", false],
      ["deviations.md V1", false],
      ["deviations.md ro", false],
      [PROOF_ADDITIONS_APPROVED.slice(0, "deviations.md V3".length), false],
      [SELLING_UPDATE_APPROVED.slice(0, "deviations.md V3".length), false],
      [SELLING_UPDATE_APPROVED.slice(0, "deviations.md V3".length), false],
      [SELLING_UPDATE_APPROVED.slice(0, "deviations.md V3".length), true],
      ["deviations.md V2", false],
      ["deviations.md V4", false],
      [FOUNDER_ANSWERS_APPROVED.slice(0, "deviations.md V3".length), false],
    ]);
    expect(TEXT_DEVIATIONS["meet-kheelu"][2].approvedBy).toBe(PAGE_FACTS["meet-kheelu"].approvedBy);
    expect(TEXT_DEVIATIONS["meet-kheelu"][3].approvedBy).toBe(COPY_FIXES["meet-kheelu"].approvedBy);
    expect(TEXT_DEVIATIONS["meet-kheelu"][4].approvedBy).toBe(OFFER_ADDITIONS["meet-kheelu"].approvedBy);
    expect(TEXT_DEVIATIONS["meet-kheelu"][5].approvedBy).toBe(PROOF_ADDITIONS_APPROVED);
    expect(TEXT_DEVIATIONS["meet-kheelu"][6].approvedBy).toBe(SELLING_UPDATE_APPROVED);
    expect(TEXT_DEVIATIONS["meet-kheelu"][7].approvedBy).toBe(SELLING_UPDATE_APPROVED);
    expect(TEXT_DEVIATIONS["meet-kheelu"][8].approvedBy).toBe(SELLING_UPDATE_APPROVED);
    expect(TEXT_DEVIATIONS["meet-kheelu"][9].approvedBy).toBe(CLAIM_FIXES["meet-kheelu"].approvedBy);
    expect(TEXT_DEVIATIONS["meet-kheelu"][10].approvedBy).toBe(FAQ_FIXES["meet-kheelu"].approvedBy);
    expect(TEXT_DEVIATIONS["meet-kheelu"][11].approvedBy).toBe(ANSWERS.approvedBy);
  });

  it("accepts on the build side exactly the stacked panels' lines, as the page prints them, and no other line of the page", () => {
    const [rule] = TEXT_DEVIATIONS["meet-kheelu"];
    const page = new Set(sentences(htmlToText(BUILT.html)));
    expect([...page].filter((s) => rule.build!.test(s)).sort()).toEqual([...new Set(stacked(product))].sort());
  });

  it("reads those lines from product.ts, so it still holds once the founder fills an F4 placeholder", async () => {
    vi.resetModules();
    vi.doMock("./product", async (importOriginal) => {
      const real = await importOriginal<typeof import("./product")>();
      // A filled F4 value brings its line back (D054 item 19: hidden only while it waits).
      const safety = [...real.product.safety, { icon: "battery-charging", text: "Battery safety: a filled-in fact." }];
      return { ...real, product: { ...real.product, safety } };
    });
    const [rule] = (await import(DEVIATIONS)).TEXT_DEVIATIONS["meet-kheelu"] as typeof TEXT_DEVIATIONS[string];
    expect(rule.build!.test("Battery safety: a filled-in fact.")).toBe(true);
    expect(rule.build!.test("Battery safety: [PLACEHOLDER F4: battery safety certification]")).toBe(false);
  });
});


/* Task 8c.3 (D061 item 4 and the main session's rulings, 2026-10-15): parents' own words under the films, the "Recognised
 * by." strip after the offer column, and, just before "How it works", four plain steps and the labelled example
 * conversation (three of them on tabs since task Q2.10). The approved page has none of them, so the tests above compare
 * the page without them (PROOF_ADDITIONS), and these hold the blocks themselves on the page as it renders. */
describe("the product page's added blocks (task 8c.3)", () => {
  const WHOLE = BUILT.whole;
  const fold = (label: string) => folds(WHOLE).find((f) => name(f) === label)!;

  it("prints the parents' quotes under the films, each button playing its film; every poster still lazy, no film before a tap", () => {
    expect(fold("films-title").querySelector(".ks-films-ctrl + .ks-film-quotes")).not.toBeNull();
    const quotes = fold("films-title").querySelector(".ks-film-quotes")!;
    expect([...quotes.querySelectorAll("blockquote")].map((q) => q.textContent)).toEqual(filmQuotes.items.map((q) => q.quote));
    expect([...quotes.querySelectorAll("button")].map((b) => b.getAttribute("aria-label"))).toEqual(
      filmQuotes.items.map((q) => `${filmQuotes.watch}: ${films.find((f) => f.id === q.film)!.chip}`),
    );
    expect([...fold("films-title").querySelectorAll("img")].every((img) => img.getAttribute("loading") === "lazy")).toBe(true);
    expect(WHOLE.querySelector("video")).toBeNull();
  });

  /* Task 8c.8 (the CMO's wave 8c review, m2): the strip follows the offer column, so the films lead straight to the offer.
     Since task Q2.13 (the D2C plan v2 §3 fold 4; the CMO's m10) it is Home's label strip: the small label "Recognised by"
     over the team's row, no heading. */
  it("shows the team's strip right after the offer column (task 8c.8), as Home's label strip (task Q2.13), its marks lazy", () => {
    const order = folds(WHOLE).map(name);
    expect(order.indexOf("recognised-title")).toBe(order.indexOf("offer-title") + 1);
    expect(order.indexOf("offer-title")).toBe(order.indexOf("films-title") + 1);
    expect(fold("offer-title").querySelector(".ks-offer-share")).not.toBeNull();
    const strip = fold("recognised-title");
    const label = strip.querySelector("#recognised-title")!;
    expect(label.tagName).toBe("P");
    expect(label.className).toBe("kh-label-s ks-recognition__label");
    expect(text(label)).toBe(PRODUCT_RECOGNISED);
    expect(strip.querySelector("h2, h3")).toBeNull();
    expect(strip.classList.contains("ks-recognised")).toBe(true);
    expect(strip.querySelectorAll(".ks-recognition__item")).toHaveLength(recognitionStrip.items.length);
    expect([...strip.querySelectorAll("img")].map((img) => img.getAttribute("loading"))).toEqual(["lazy", "lazy", "lazy"]);
  });

  it("takes Home's label strip config: the team's programmes, the label \"Recognised by\", on the page's own background", () => {
    const strips = kheeluPage.sections.filter((s) => s.kind === "recognition-strip");
    expect(strips).toHaveLength(1);
    const [{ config }] = strips;
    expect(config).toEqual({ ...recognitionStrip, title: PRODUCT_RECOGNISED, variant: "label" });
    // The text pass accepts the label (the strip is the build's alone, PROOF_ADDITIONS hides it for the pixels).
    expect(TEXT_DEVIATIONS["meet-kheelu"].some((rule) => rule.build?.test(PRODUCT_RECOGNISED))).toBe(true);
  });

  /* The built step heading stays (the D2C plan v2 §3 fold 5; the CMO's m7; the main session's ruling on §13 item 8 (a)). */
  it("states the four steps in the plan's words (D018, D017, D036: \"remembers\" beside reading every conversation)", () => {
    const steps = fold("steps-title");
    expect(steps.className).toBe("kh-section kh-section--band");
    expect(steps.querySelector("ol.kh-steps.ks-steps--four")).not.toBeNull();
    expect([...steps.querySelectorAll("#steps-title .kh-hand")].map((s) => s.textContent)).toEqual(["presses it."]);
    const shown = [text(steps.querySelector("#steps-title")), ...[...steps.querySelectorAll(".kh-step")].flatMap((s) => [text(s.querySelector(".kh-step__title")), text(s.querySelector(".kh-step__body"))])];
    expect(shown).toEqual([...PROOF_STEPS_BUILD]);
    expect(steps.querySelector("[data-reveal]")).toBeNull();
  });

  it("hides for the pixels exactly the added blocks, each found once on the page and gone from the page compared", () => {
    for (const selector of PROOF_ADDITIONS["meet-kheelu"].selectors) {
      expect(WHOLE.querySelectorAll(selector), selector).toHaveLength(1);
      expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(0);
    }
  });

  it("passes the claims guard on every added line, and says nothing of an age under 3", () => {
    for (const line of PROOF_ADDITIONS["meet-kheelu"].build) {
      expect(findBanned(line), line).toEqual([]);
      expect(line).not.toMatch(/\b[0-2]\s*(?:years?|yrs?|months?)\b|toddler|baby|babies/i);
    }
  });
});

/* Task Q2.10: the selling update on the product page (D064 items 2 and 8, D065 items 1, 3-6 and 8; the main session's
 * rulings of 2026-10-15; the copy: the D2C plan v2 §3 with the CMO's conditions, C1 and m7-m12). Twelve folds in the plan's
 * order, the expert, parent-app and safety folds off the page (Home and /safety carry them, tasks Q2.9 and Q2.11), the
 * three sample chats on the DS Tabs with their own button, the comparison moved here from Home, and safety in one line
 * that points to /safety. The literals deviations.ts spells for the parity passes are held to the content here. */
describe("the product page's selling update (task Q2.10; the D2C plan v2 §3)", () => {
  const WHOLE = BUILT.whole;
  const fold = (label: string) => folds(WHOLE).find((f) => name(f) === label)!;
  const section = <K extends (typeof kheeluPage.sections)[number]["kind"]>(kind: K) =>
    kheeluPage.sections.filter((s): s is Extract<(typeof kheeluPage.sections)[number], { kind: K }> => s.kind === kind);
  const values = (root: Element) => [...root.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"));

  it("orders the page as the plan's twelve folds: hero, films, offer, recognised by, steps, sample chats, how it works, compare, safety, details, questions, close", () => {
    expect(folds(WHOLE).map(name)).toEqual([
      "hero-title",
      "films-title",
      "offer-title",
      "recognised-title",
      "steps-title",
      "example-title",
      "modes-title",
      "compare-title",
      "safety-line",
      "specs-title",
      "faq-title",
      "close-title",
    ]);
    expect(WHOLE.querySelectorAll("h1")).toHaveLength(1);
  });

  it("takes the expert clip, the parent-app fold and the safety fold off the page (D064 items 2 and 8)", () => {
    expect(WHOLE.querySelector("#expert, #app, [aria-labelledby='expert-title'], [aria-labelledby='app-title'], [aria-labelledby='safety-title']")).toBeNull();
    expect(WHOLE.querySelector("img[src*='app-transcript'], img[src*='app-activity'], img[src*='app-privacy'], img[src*='expert-clip']")).toBeNull();
    expect(text(WHOLE)).not.toContain("Every conversation, word for word.");
    expect(text(WHOLE)).not.toContain("Safety you can check.");
    expect(kheeluPage.sections.some((s) => s.kind === "films-strip" && "layout" in s.config)).toBe(false);
  });

  it("carries the plan's CTA values in order: product-ask after the sample chats, the safety line's product-safety-learn, no product-safety", () => {
    expect(values(WHOLE)).toEqual(["product-top", "product-offer", "share-whatsapp", "product-ask", "product-safety-learn", "product-foot"]);
    expect(WHOLE.querySelectorAll(`a[href="${STORE}"]`)).toHaveLength(4);
  });

  describe("fold 1, the hero", () => {
    const hero = () => fold("hero-title");

    it("says the plan's eyebrow and lead under the built H1 (D065 item 1)", () => {
      expect(text(hero().querySelector(".kh-eyebrow"))).toBe(PRODUCT_HERO.eyebrow.build);
      expect(text(hero().querySelector("h1"))).toBe("Kheelu talks back. The good kind.");
      expect(text(hero().querySelector(".kh-heading__lead"))).toBe(PRODUCT_HERO.lead.build);
      const [config] = section("hero-section");
      expect(config.config.heading).toMatchObject({ eyebrow: PRODUCT_HERO.eyebrow.build, lead: PRODUCT_HERO.lead.build });
    });

    it("ends on the button, its price line as a block of its own after it (C1), then the trust line: no help line", () => {
      const button = hero().querySelector(".kh-btn--cta")!;
      expect(button.getAttribute("data-ph-capture-attribute-cta")).toBe("product-top");
      const price = hero().querySelector(".ks-price")!;
      expect(price.tagName).toBe("P");
      expect(button.contains(price) || button.closest(".kh-section__actions")!.contains(price)).toBe(false);
      expect(button.compareDocumentPosition(price) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(text(price)).toBe("₹499 today, refundable. ₹4,999 in total.");
      expect([...hero().querySelectorAll(".ks-trust li")].map(text)).toEqual(["Full refund until dispatch · 7-day returns", "Deliveries start mid-November"]);
      expect(hero().querySelector(".ks-help")).toBeNull();
    });
  });

  it("fold 3: describes the offer photo with the page's keyword, true of the picture", () => {
    expect(fold("offer-title").querySelector(".ks-offer-photo img, .kh-photo img")?.getAttribute("alt")).toBe(PRODUCT_OFFER_ALT.build);
  });

  describe("fold 6, the sample chats (ruling 6)", () => {
    const chats = () => fold("example-title");
    const [entry] = section("example-conversation");

    it("shows three labelled chats on the DS Tabs, each under the label, the plan's words exactly (the deviations' literals)", () => {
      const tabs = entry.config.tabs!;
      expect(tabs.items.map((t) => t.label)).toEqual([...PRODUCT_CHATS.tabs]);
      const box = chats().querySelector(".ks-exchange > .kh-tabs[data-tabs]")!;
      expect([...box.querySelectorAll('[role="tab"]')].map(text)).toEqual([...PRODUCT_CHATS.tabs]);
      expect(box.querySelector('[role="tablist"]')?.getAttribute("aria-label")).toBe("What asking back sounds like.");
      const panels = [...box.querySelectorAll(":scope > .kh-tabs__panel")];
      expect(panels.map((p) => text(p.querySelector("[data-tab-heading]")))).toEqual([...PRODUCT_CHATS.tabs]);
      for (const p of panels) expect(text(p.querySelector(".ks-exchange__note"))).toBe("Illustrative example, not a recording.");
      const said = (p: Element) => [...p.querySelectorAll(".ks-exchange__line")].map((li) => text(li).slice(text(li.querySelector(".ks-exchange__who")).length));
      expect(said(panels[0])).toEqual(PROOF_EXAMPLE_BUILD.filter((_, i) => i >= 2 && i % 2 === 1));
      expect(said(panels[1])).toEqual([...PRODUCT_CHATS.dosa]);
      expect(said(panels[2])).toEqual([...PRODUCT_CHATS.spider]);
      // Each led by the child, then Kheelu answers and asks back, then the child: AI mode only (D017), no exclamation mark.
      for (const p of panels) {
        expect([...p.querySelectorAll(".ks-exchange__line")].map((li) => li.className.split("--").pop())).toEqual(["child", "kheelu", "child"]);
        expect(text(p)).not.toContain("!");
      }
    });

    it("ends on the line that plays film 6, then the button (product-ask), its price line a block of its own (C1) and the trust line, no help line", () => {
      const column = chats().querySelector(".ks-exchange")!;
      const after = column.querySelector(":scope > .ks-exchange__after")!;
      expect(text(after)).toBe(PRODUCT_CHATS.after);
      const link = after.querySelector("a")!;
      expect(link.getAttribute("href")).toBe(LANGUAGES_FAQ.film.href);
      expect(WHOLE.querySelector(LANGUAGES_FAQ.film.href)?.closest("section")?.id).toBe("films");
      const button = column.querySelector(".kh-btn--cta")!;
      expect(button.getAttribute("data-ph-capture-attribute-cta")).toBe("product-ask");
      expect(after.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      const price = column.querySelector(".ks-price")!;
      expect(price.tagName).toBe("P");
      expect(button.closest(".kh-section__actions")!.contains(price)).toBe(false);
      expect([...column.querySelectorAll(".ks-trust li")].map(text)).toEqual(["Full refund until dispatch · 7-day returns", "Deliveries start mid-November"]);
      expect(column.querySelector(".ks-help")).toBeNull();
      expect(entry.cta).toMatchObject({ cta: "product-ask" });
    });

    /* The review of task Q2.10: the line names film 6 the way the languages answer does, through faqs.ts's filmLink and
       films.ts, so a renamed chip or id changes both together; PRODUCT_CHATS.after stays the literal check above. */
    it("builds that line's film link from films.ts, as the languages answer does, never typing the film's chip or id", () => {
      const six = films.find((f) => f.id === "a-story-in-two-languages")!;
      expect(entry.config.after).toBe(`Hear it in two languages: watch ${filmLink(six.id)}.`);
      expect(faqs.languages.answer).toContain(filmLink(six.id));
      const source = readFileSync(join(ROOT, "src/content/en-IN/products/kheelu/page.ts"), "utf8");
      expect(source).not.toContain(`“${six.chip}”`);
      expect(source).not.toContain(`#${six.id}`);
    });

    it("reveals nothing and carries no picture (the HTML budget; nothing that sells reveals)", () => {
      expect(chats().querySelector("img, svg.ks-doodle, [data-reveal], [data-draw]")).toBeNull();
    });
  });

  /* Task Q2.17 (D066 item 7, G28's other half, both true): "Between conversations nothing is sent anywhere, and when Kheelu
     rests, its Wi‑Fi is switched off." after the wake-up line (G28's row: "beside the wake-up button"), before the daily
     limit, with the DS moon (Kheelu resting). */
  it("fold 7: Good to know says \"instead of guessing\" (D065 item 8), Wi‑Fi off at rest (D066 item 7) and the daily limit (D065 item 5), in order", () => {
    const know = [...fold("modes-title").querySelectorAll("#know-title ~ ul > li")];
    const lines = know.map(text);
    expect(lines.slice(0, 6)).toEqual([
      "AI mode needs your home Wi‑Fi. Story mode and Bluetooth mode work without it.",
      PRODUCT_KNOW.browse.build,
      PRODUCT_KNOW.wake,
      G28_LINES.know,
      PRODUCT_KNOW.limit,
      "At setup, you enter your child’s age in the parent app.",
    ]);
    expect(lines[6]).toBe("It charges with the charger in the box.");
    expect(G28_LINES.know).toBe("Between conversations nothing is sent anywhere, and when Kheelu rests, its Wi‑Fi is switched off.");
    expect([...know[3].querySelectorAll("path")].map((path) => path.getAttribute("d"))).toEqual([ICON_PATHS.moon]);
    expect([...know[4].querySelectorAll("path")].map((path) => path.getAttribute("d"))).toEqual([ICON_PATHS.clock]);
    expect(findBanned(G28_LINES.know)).toEqual([]);
    // Never that a parent sets the limit (D065 item 5).
    expect(text(fold("modes-title"))).not.toMatch(/you set (?:the|its) (?:daily )?limit/i);
  });

  it("fold 8: compares by kind of product, moved from Home in its built words, with no link (compare-learn stays Home's)", () => {
    const compare = fold("compare-title");
    expect(text(compare.querySelector(".kh-eyebrow"))).toBe(PRODUCT_COMPARE.eyebrow);
    expect(text(compare.querySelector("#compare-title"))).toBe(PRODUCT_COMPARE.title);
    expect(text(compare.querySelector(".kh-heading__lead"))).toBe(PRODUCT_COMPARE.lead);
    const cards = [...compare.querySelectorAll(".ks-compare-stack .kh-card")];
    expect(cards.map((c) => [text(c.querySelector(".kh-card__title")), text(c.querySelector(".kh-card__body")), [...c.querySelectorAll(".ks-compare-others li")].map(text)])).toEqual(
      PRODUCT_COMPARE.rows.map((r) => [r.label, r.us, [...r.others]]),
    );
    expect(compare.querySelector(".ks-compare-stack .kh-caption")?.textContent).toBe(PRODUCT_COMPARE.caption);
    expect(compare.querySelector(".kh-compare-wrap")?.getAttribute("aria-label")).toBe("Comparison by kind of product");
    expect(compare.querySelector("a")).toBeNull();
    expect(text(compare)).not.toMatch(/Alexa|Echo|ChatGPT|Miko|Tonies|YouTube/);
  });

  /* Task Q2.15 (the consistency review's CMO-3, CON-4): "See how we built safety in" is the DS secondary button with the
     shield, as on Home and /team (DS 07-selling.md:52 names it a secondary learning action), where it was a ghost link. */
  it("fold 9: says where the safety facts live in one line, then the built link to /safety as Home's: the secondary button with the shield (product-safety-learn)", () => {
    const line = fold("safety-line");
    expect(line.id).toBe("safety");
    expect(text(line.querySelector("#safety-line"))).toBe(PRODUCT_SAFETY_LINE.line);
    const links = [...line.querySelectorAll("a")];
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("/safety");
    expect(links[0].className).toBe("kh-btn kh-btn--secondary");
    expect(links[0].firstElementChild?.querySelector("path")?.getAttribute("d")).toBe(ICON_PATHS["shield-check"]);
    expect(links[0].querySelectorAll("svg")).toHaveLength(1);
    expect(links[0].getAttribute("data-ph-capture-attribute-cta")).toBe("product-safety-learn");
    expect(text(links[0])).toBe(PRODUCT_SAFETY_LINE.link);
    expect(PRODUCT_SAFETY_LINE.link).toBe(cta.secondary["product-safety-learn"].label);
  });

  describe("fold 11, the questions", () => {
    const shown = (offer: Offer) => [...rendered(offer).whole.querySelectorAll("#faq .kh-faq__item")].map((item) => text(item.querySelector(".kh-faq__q")));

    it("asks the plan's questions in its order: the price question, Home's screen-time question, then the Kheelona+ question after the first-week one, no delivery question", () => {
      const ids = [
        "do-the-thinking",
        "talks-back",
        "right-for-a-three-year-old",
        "cost-and-advance",
        "screen-time-in-disguise",
        "returns-and-warranty",
        "after-the-first-week",
        "after-six-months",
        "languages",
        "speech",
      ] as const;
      for (const offer of [TOKEN, FULL]) expect(shown(offer)).toEqual(ids.map((id) => toPlainText(faqs[id].question, offer)));
      expect(shown(TOKEN)).not.toContain("When does delivery start?");
    });

    /* Task Q2.13 (the D2C plan v2 §3 fold 11, question 5: "As Home's question 4"): the one faqs.ts entry Home lists, so the
       words are Home's on both pages; fifth, after the price question, where the delivery question stood. */
    it("asks Home's \"Isn’t this just screen time in disguise?\" fifth, after the price question, from the one faqs.ts entry", () => {
      const [faqFold] = section("faq-section");
      const ids = faqFold.config.items.map((item) => item.id);
      expect(ids.indexOf("screen-time-in-disguise")).toBe(ids.indexOf("cost-and-advance") + 1);
      expect(faqFold.config.items[ids.indexOf("screen-time-in-disguise")]).toBe(faqs["screen-time-in-disguise"]);
      const fifth = [...WHOLE.querySelectorAll("#faq .kh-faq__item")][4];
      expect(text(fifth.querySelector(".kh-faq__q"))).toBe(SCREEN_TIME_FAQ.question);
      expect(text(fifth.querySelector(".kh-faq__a"))).toBe(SCREEN_TIME_FAQ.answer);
      for (const offer of [TOKEN, FULL]) {
        expect(toPlainText(faqs["screen-time-in-disguise"].question, offer)).toBe(SCREEN_TIME_FAQ.question);
        expect(toPlainText(faqs["screen-time-in-disguise"].answer, offer)).toBe(SCREEN_TIME_FAQ.answer);
      }
    });

    it("answers the price question with the total and no GST, balance or first 500 (D065 items 3-4), in both modes", () => {
      for (const offer of [TOKEN, FULL]) {
        const faq = rendered(offer).whole.querySelector("#faq")!;
        expect(text(faq)).toContain(toPlainText(faqs["cost-and-advance"].answer, offer));
        expect(text(faq)).not.toMatch(/GST|₹4,500|first 500/);
      }
    });
  });

  it("prints no \"incl. GST\" and no balance amount outside the offer card's split rows; the MRP keeps its statutory \"(incl. of all taxes)\" (D065 item 3)", () => {
    for (const offer of [TOKEN, FULL]) {
      const page = rendered(offer).whole.cloneNode(true) as Element;
      expect(text(page)).not.toContain("incl. GST");
      expect(text(page.querySelector(".ks-declare"))).toContain("(incl. of all taxes)");
      page.querySelectorAll(".kh-offer__split").forEach((el) => el.remove());
      expect(text(page)).not.toContain(offer.prices.balance ?? "no balance");
    }
    expect(text(WHOLE.querySelector(".kh-offer__split"))).toContain("₹4,500");
  });

  it("declares consumer care with the support number, its one call link on the page, and the email (the Legal Metrology rules)", () => {
    const rows = [...WHOLE.querySelectorAll(".ks-declare dl > div")];
    const care = rows.find((row) => text(row.querySelector("dt")) === "Consumer care")!;
    expect([...care.querySelectorAll(".ks-care")].map(text)).toEqual([`WhatsApp or call ${seller.support.phone}`, seller.support.email]);
    expect([...WHOLE.querySelectorAll('a[href^="tel:"]')]).toEqual([care.querySelector(`a[href="${seller.support.tel}"]`)]);
    const outside = WHOLE.cloneNode(true) as Element;
    [...outside.querySelectorAll(".ks-declare dl > div")].find((row) => text(row.querySelector("dt")) === "Consumer care")!.remove();
    expect(text(outside)).not.toContain(seller.support.phone);
  });

  it("shows each AI cast child at most once, and none beside the films' real quotes and captions (ruling 7; DS 03-cast)", () => {
    const castIn = (el: Element) => [...el.querySelectorAll("img")].map((img) => /(?:Cast|Photo library)\/([a-z]+)-/.exec(decodeURIComponent(img.getAttribute("src") ?? ""))?.[1] ?? /\/([a-z]+)-(?:sticker|0\d)/.exec(decodeURIComponent(img.getAttribute("src") ?? ""))?.[1]).filter(Boolean);
    const where = new Map<string, Set<string>>();
    for (const f of folds(WHOLE)) for (const child of castIn(f)) where.set(child!, (where.get(child!) ?? new Set()).add(name(f)!));
    expect(Object.fromEntries([...where].map(([child, at]) => [child, [...at]]))).toEqual({ myra: ["hero-title"], advik: ["modes-title"], ira: ["close-title"] });
    expect(castIn(fold("films-title"))).toEqual([]);
  });

  it("keeps the Product node's description free of GST, its offer read from the price answer (D028: the total first)", () => {
    const [block] = jsonLdBlocks(BUILT.html) as { "@graph": (Record<string, unknown> & { "@type": string })[] }[];
    const node = block["@graph"].find((n) => n["@type"] === "Product")!;
    expect(JSON.stringify(node)).not.toContain("incl. GST");
    expect((node.offers as { description: string }).description).toBe(toPlainText(faqs["cost-and-advance"].answer, TOKEN));
  });

  it("passes the claims guard on every line the page prints, in both modes", () => {
    for (const offer of [TOKEN, FULL]) {
      const page = rendered(offer).whole;
      const lines = [...page.querySelectorAll("h1, h2, h3, p, li, dt, dd, summary, a, button, td, th")].map(text).filter(Boolean);
      const hits = lines.flatMap((line) => findBanned(line).map((h) => `${h.id}: ${line}`));
      expect(hits).toEqual([]);
    }
  });

  /* The rule for the parity passes (deviations.ts SELLING_UPDATE and SELLING_ADDITIONS): it changes and adds exactly what
     the page does, and excuses no other approved line. */
  describe("as a parity deviation", () => {
    const once = (lines: readonly string[]) => [...new Set(lines)];
    const rules = TEXT_DEVIATIONS["meet-kheelu"].filter((r) => r.approvedBy === SELLING_UPDATE_APPROVED && !r.jsOff);

    it("lists exactly the sentences its edits change, against the mockup with the page's earlier rules applied", () => {
      expect(factSentences(BEFORE_SELLING, SELLING.edits)).toEqual({ missing: [...SELLING.mockup], extra: [...SELLING.build] });
    });

    it("is two rules of the page, before the claim fixes: the first excuses and accepts exactly those sentences, the second accepts the added folds' lines and excuses nothing", () => {
      expect(rules).toHaveLength(2);
      const all = TEXT_DEVIATIONS["meet-kheelu"];
      expect(all.indexOf(rules[0])).toBeLessThan(all.findIndex((r) => r.approvedBy === CLAIM_FIXES["meet-kheelu"].approvedBy));
      expect(ruleReach(BEFORE_SELLING, SELLING.edits, rules[0])).toEqual({ excused: once(SELLING.mockup), accepted: once(SELLING.build) });
      for (const line of sentences(words(BEFORE_SELLING))) expect(rules[1].mockup.test(line), line).toBe(false);
      for (const rule of rules) expect(rule.jsOff).toBeUndefined();
    });

    it("hides for the pixels the blocks it lists, in its order, each found once on its side and holding a sentence its edits change", () => {
      expect(hiddenProblems(BEFORE_SELLING, SELLING)).toEqual([]);
      const hides = VISUAL_HIDDEN["meet-kheelu"].filter((r) => r.approvedBy === SELLING_UPDATE_APPROVED);
      const sel = (side: string) => hides.filter((r) => r.side === side).map((r) => r.selector);
      expect(sel("mockup")).toEqual([...SELLING.hidden.both, ...SELLING.hidden.mockup]);
      expect(sel("build")).toEqual([...SELLING.hidden.both, ...SELLING.hidden.build, ...SELLING_ADDITIONS["meet-kheelu"].selectors]);
      for (const selector of [...SELLING.hidden.both, ...SELLING.hidden.build]) expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(1);
    });

    /* Without JavaScript the three chats stand stacked under their tabs' words, as the details panels do (V3): the
       JavaScript-off run (no-js.spec.ts) reads the second and third chats, and the first chat's words once (its tab and
       its screen-reader heading read twice with JavaScript on). */
    it("is one JavaScript-off rule for the stacked chats: it accepts every line of the second and third chat and excuses only the first tab's words", () => {
      const jsOff = TEXT_DEVIATIONS["meet-kheelu"].filter((r) => r.approvedBy === SELLING_UPDATE_APPROVED && r.jsOff);
      expect(jsOff).toHaveLength(1);
      const panels = [...fold("example-title").querySelectorAll(".kh-tabs__panel")].map((el) => el.cloneNode(true) as Element);
      for (const p of panels) p.querySelectorAll(".ks-exchange__who").forEach((who) => who.after("\n"));
      const later = panels.slice(1).flatMap((p) => blockSentences(p).filter((line) => !PRODUCT_CHATS.tabs.includes(line as never)));
      expect(later.length).toBeGreaterThan(10);
      expect(later.filter((line) => !jsOff[0].build!.test(line))).toEqual([]);
      const page = sentences(words(BEFORE_SELLING));
      expect([...PRODUCT_CHATS.tabs, ...page].filter((line) => jsOff[0].mockup.test(line))).toEqual([PRODUCT_CHATS.tabs[0]]);
    });

    it("hides the added folds for the pixels, each found once on the page and gone from the page compared", () => {
      for (const selector of SELLING_ADDITIONS["meet-kheelu"].selectors) {
        expect(WHOLE.querySelectorAll(selector), selector).toHaveLength(1);
        expect(BUILT.main.querySelectorAll(selector), selector).toHaveLength(0);
      }
    });

    it("accepts in the text pass every line the added folds and tabs print (the comparison's phone cards, as the 390 px pass reads it), and nothing the mockup says", () => {
      const accepted = (line: string) => TEXT_DEVIATIONS["meet-kheelu"].some((r) => r.build?.test(line));
      const added = [
        ...SELLING_ADDITIONS["meet-kheelu"].selectors.map((selector) => {
          const el = WHOLE.querySelector(selector)!.cloneNode(true) as Element;
          el.querySelectorAll(".kh-compare-wrap").forEach((table) => table.remove());
          return el;
        }),
        ...[...fold("example-title").querySelectorAll('[role="tab"], .kh-tabs__panel, .ks-exchange__after')].map((el) => el.cloneNode(true) as Element),
      ];
      // Who says each line is a line of its own on the page (example-conversation.css: display block).
      for (const el of added) el.querySelectorAll(".ks-exchange__who").forEach((who) => who.after("\n"));
      // The sample chats' button and its lines take the place of the safety fold's on the page (both texts count them).
      const lines = added.flatMap((el) => blockSentences(el));
      expect(lines.length).toBeGreaterThan(30);
      expect(lines.filter((line) => !accepted(line))).toEqual([]);
      // The eyebrow renders in capitals (kh-eyebrow), as the browser's text reports it.
      expect(accepted(PRODUCT_COMPARE.eyebrow.toUpperCase())).toBe(true);
      expect(accepted(PRODUCT_HERO.eyebrow.build.toUpperCase())).toBe(true);
    });

    it("spells the content's words: the hero, the photo's alt, Good to know, the comparison, the chats and the safety line", () => {
      const [modes] = section("modes-section");
      expect(modes.config.know?.items.map((i) => i.text)).toEqual(expect.arrayContaining([PRODUCT_KNOW.browse.build, PRODUCT_KNOW.wake, PRODUCT_KNOW.limit]));
      const [offerFold] = section("offer-section");
      expect(offerFold.config.variant === "photo" && offerFold.config.photo.alt).toBe(PRODUCT_OFFER_ALT.build);
      const [compare] = section("compare-by-category");
      expect(compare.config.rows.map((r) => [r.label, r.phone.us, [...r.phone.others]])).toEqual(PRODUCT_COMPARE.rows.map((r) => [r.label, r.us, [...r.others]]));
      expect([compare.config.heading.eyebrow, toPlainText(compare.config.heading.title), compare.config.heading.lead, compare.config.caption]).toEqual([
        PRODUCT_COMPARE.eyebrow,
        PRODUCT_COMPARE.title,
        PRODUCT_COMPARE.lead,
        PRODUCT_COMPARE.caption,
      ]);
      const [chats] = section("example-conversation");
      const tabs = chats.config.tabs!;
      expect(tabs.items[1].lines.map((l) => l.text)).toEqual([...PRODUCT_CHATS.dosa]);
      expect(tabs.items[2].lines.map((l) => l.text)).toEqual([...PRODUCT_CHATS.spider]);
      expect(toPlainText(chats.config.after!)).toBe(PRODUCT_CHATS.after);
      const pointer = section("trust-section").find((s) => s.config.variant === "pointer")!;
      expect(pointer.config.variant === "pointer" && [pointer.config.pointer, pointer.config.link.label]).toEqual([PRODUCT_SAFETY_LINE.line, PRODUCT_SAFETY_LINE.link]);
    });
  });
});

/* Task 8c.8 (the CMO's review of wave 8c on the beta, m7 and m8; the main session's rulings, 2026-10-15): the questions
   fold's two changes, on the page as it renders and in its FAQPage JSON-LD. The returns question takes Home's words with
   its own second half (the answer unchanged), and the languages answer's film name links to that film's tile in the
   strip, so a parent can play it from the answer (the strip's island; FilmsStrip's test). Each question is found by its
   words, so another question added before it moves nothing here. */
describe("the product page's questions after the CMO's wave 8c review (task 8c.8)", () => {
  const WHOLE = BUILT.whole;
  const item = (question: string) => [...WHOLE.querySelectorAll("#faq .kh-faq__item")].find((el) => text(el.querySelector(".kh-faq__q")) === question)!;
  type Question = { name: string; acceptedAnswer: { text: string } };
  const faqPage = (offer: Offer): Question[] => {
    const [block] = jsonLdBlocks(rendered(offer).html) as { "@graph": { "@type": string; mainEntity?: Question[] }[] }[];
    return block["@graph"].find((n) => n["@type"] === "FAQPage")?.mainEntity ?? [];
  };

  it("m7: asks \"What if my child doesn’t like it, or it stops working?\", the answer unchanged, on the page and in the JSON-LD", () => {
    expect(text(item(RETURNS_QUESTION.build).querySelector(".kh-faq__a"))).toBe(toPlainText(faqs["returns-and-warranty"].answer, TOKEN));
    expect(text(WHOLE)).not.toContain(RETURNS_QUESTION.mockup);
    for (const offer of [TOKEN, FULL]) {
      const asked = faqPage(offer).find((q) => q.name === RETURNS_QUESTION.build);
      expect(asked?.acceptedAnswer.text).toBe(toPlainText(faqs["returns-and-warranty"].answer, offer));
    }
  });

  it("m8: links the languages answer's film name to film 6's tile in the strip, the words unchanged on the page and in the JSON-LD", () => {
    const answer = item(LANGUAGES_FAQ.question).querySelector(".kh-faq__a")!;
    expect(text(answer)).toBe(LANGUAGES_FAQ.answer);
    const links = [...answer.querySelectorAll("a")];
    expect(links.map((a) => [a.getAttribute("href"), a.textContent])).toEqual([[LANGUAGES_FAQ.film.href, LANGUAGES_FAQ.film.name]]);
    const tile = WHOLE.querySelector(LANGUAGES_FAQ.film.href)!;
    expect(tile.closest("section")?.id).toBe("films");
    expect(tile.getAttribute("data-video-id")).toBe(LANGUAGES_FAQ.film.href.slice(1));
    expect(faqPage(TOKEN).find((q) => q.name === LANGUAGES_FAQ.question)?.acceptedAnswer.text).toBe(LANGUAGES_FAQ.answer);
  });
});
