import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { ArtLayer, OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import {
  CLAIM_FIXES,
  COPY_FIXES,
  FAQ_FIXES,
  HOME_FILMS_ORDER,
  HOME_HERO_PHOTO,
  HOME_OFFER_ART,
  NOT_RIGHT_QUESTION,
  OFFER_ADDITIONS,
  PROOF_ADDITIONS,
  PROOF_ADDITIONS_APPROVED,
  TEAM_STRIP_BUILD,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
} from "../../../../test/e2e/support/deviations";
import { sentences } from "../../../../test/e2e/support/parity";
import { findBanned } from "../../../../test/guards/banned-phrases.data";
import { filmQuotes, films } from "../films";
import { recognitionStrip } from "../recognition";
import { photos } from "../stories/photos";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { mockupFold, mockupLinks, skeleton, words } from "../../../../test/support/mockup-compare";
import { blockSentences, withFacts } from "../../../../test/support/mockup-facts";
import { homePage } from "./home";

/*
 * Home `/` (task 5.1; structure §5; architecture §9.2; tasks.md SPA): the page is its content module, rendered by
 * PageTemplate, and it prints what the approved mockup prints (mockup/home.html, the built Gate A page, D045, D046):
 * the ten folds in order, word for word, with the mockup's tracking values, links, pictures, icons and tones; the
 * hero exactly D045 with its Hand accent; the hero still and the frame and close doodles drawing (D049 picks 2
 * and 3); one LCP image per width range; FAQPage = the six visible answers plus fold 4's "What is Kheelu?" (wave-4 close).
 *
 * The section tests prove each section prints its mockup fold from a given config; this file proves the configs this
 * module gives are the approved page's. Three links follow the copy page (wiki/site/pages/home.md) rather than the
 * mockup, whose review build had no page for them: architecture §6.3 takes everything but the visible words from the
 * copy page. They are listed below and printed in the task report.
 *
 * Three approved lines changed after the built-page reviews (task 7.1b; deviation V18; test/e2e/support/deviations.ts
 * COPY_FIXES.home): the screen-time guide card's line (CMO review A M5), and in the FAQ the age-3 advice (A M8) and the
 * refund timing (D056 item 4). Then the founder's D058 (task 8b.1; deviation V26; CLAIM_FIXES.home): fold 5's bullets,
 * fold 6's safety items and its privacy screen's alt, the age answer and the Kheelona+ line follow the live team's code
 * check. Then D061 item 3 and the share link (task 8c.2; OFFER_ADDITIONS.home): the offer card's later price in token
 * mode and "Know a parent who needs this? Share Kheelu on WhatsApp" under it, tracked share-whatsapp. Then the founder's
 * D061 (task 8c.4; FAQ_FIXES.home): the fourth question in the parent's words, "What if my child doesn’t like it?", its
 * answer unchanged (AP-30). MOCKUP below is the approved page with exactly those applied, the claim fixes, the offer
 * additions and the FAQ fix each in a pass of its own, in that order. Then the founder's D064 (task Q2.1): the films in
 * his order (item 1), and the hero's picture, the DS photo library's "Kabir · block rocket" in place of the board
 * (item 4): the page is compared with the mockup without the hero's picture on both sides (HOME_HERO_PHOTO, as the
 * visual pass compares it), and the photo is held below on its own.
 */

/* The hero photo's two crops as Next imports them (`{ src, width, height }`, the size read from the file), where Vite
 * would give a bare URL: the hero frames each crop at its own ratio (task Q2.1), which needs the size. */
const staticImport = vi.hoisted(() => async (file: string) => {
  const { default: sharp } = await import("sharp");
  const { width, height } = await sharp(file).metadata();
  return { default: { src: `/_next/static/media/${file.split("/").pop()}`, width, height } };
});
vi.mock("@/assets/hero/kabir-02-block-rocket-4x5.jpg", () => staticImport("src/assets/hero/kabir-02-block-rocket-4x5.jpg"));
vi.mock("@/assets/hero/kabir-02-block-rocket-16x10.jpg", () => staticImport("src/assets/hero/kabir-02-block-rocket-16x10.jpg"));

/** D064 item 1 (task Q2.1): Home's strip plays the films list's 2nd film 4th and its 3rd 7th, each swapped with the film
 *  that replaces it, so the list's 1, 4, 7, 2, 5, 6, 3. The list itself (films.ts) keeps the approved order, which the
 *  product page and the store show. */
const HOME_FILM_ORDER = [1, 4, 7, 2, 5, 6, 3].map((n) => films[n - 1].id);
/** The approved page with Home's strip in that order: each film's chip, length, poster, play button and caption move
 *  with it, as one list item. */
function inHomeFilmOrder(main: Element): Element {
  const strip = main.querySelector("[data-films]")!;
  const byId = new Map([...strip.children].map((li) => [li.getAttribute("data-video-id"), li]));
  strip.replaceChildren(...HOME_FILM_ORDER.map((id) => byId.get(id)!));
  return main;
}

/** A page's main without its hero picture (task Q2.1, D064 item 4): the approved board on the mockup's side, the
 *  photo's two crops on the build's, as the visual pass compares them (HOME_HERO_PHOTO). */
function withoutHeroPicture(main: Element, selector: string): Element {
  const copy = main.cloneNode(true) as Element;
  for (const el of copy.querySelectorAll(selector)) el.remove();
  return copy;
}

/* Then D063 item 2: the hero's and the close's help lines without the call (task Q2.3; seller-facts.ts). */
const MOCKUP = withoutHeroPicture(
  inHomeFilmOrder(
    withSellerFacts(
      withFacts(
        withFacts(withFacts(withFacts(mockupFold("home", "main"), COPY_FIXES.home.edits), CLAIM_FIXES.home.edits), OFFER_ADDITIONS.home.edits),
        FAQ_FIXES.home.edits,
      ),
    ),
  ),
  HOME_HERO_PHOTO.mockup,
);
const LABELS = ["hero-title", "ask-title", "why-title", "what-title", "see-title", "safety-title", "compare-title", "guides-title", "faq-title", "close-title"];

/** The copy page's targets for the three untracked links whose mockup address was a page of the review build. */
const COPY_PAGE_LINKS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "why-title": { "/stories": "/stories/how-children-learn-by-talking" }, // home.md fold 3
  "what-title": { "/products/kheelu": "/products/kheelu#modes" }, // home.md fold 4
  "see-title": { "/products/kheelu": "/products/kheelu#app" }, // home.md fold 5
};

/** The page without the blocks task 8c.3 adds (PROOF_ADDITIONS; D061 item 4: the parents' quotes and the recognition
 *  strip): what must equal the approved page. Those blocks are tested on the page as it renders (`whole`), below. */
function withoutAdditions(doc: Document): Document {
  const copy = doc.cloneNode(true) as Document;
  for (const selector of PROOF_ADDITIONS.home.selectors) for (const el of copy.querySelectorAll(selector)) el.remove();
  return copy;
}

function rendered(mode: OfferMode) {
  const main = renderToStaticMarkup(<PageTemplate page={homePage} offer={buildOffer(mode)} path="/" />);
  const html = `<!doctype html><html><body><main id="main">${main}</main></body></html>`;
  const whole = new DOMParser().parseFromString(html, "text/html");
  return { html, whole, doc: withoutAdditions(whole) };
}

const TOKEN = rendered("token");
const FULL = rendered("full");
/** The page as compared with the approved one: without the hero's photo (task Q2.1; its markup is HeroSection's test's,
 *  its place on the first phone screen test/e2e/first-screen.spec.ts's, the photo itself is held below). */
const BUILT = withoutHeroPicture(TOKEN.doc.querySelector("main")!, HOME_HERO_PHOTO.build);

const folds = (main: Element) => [...main.children].filter((el) => el.tagName === "SECTION");
const fold = (main: Element, label: string) => folds(main).find((el) => el.getAttribute("aria-labelledby") === label)!;
const each = (label: string) => ({ built: fold(BUILT, label), mockup: fold(MOCKUP, label) });

const all = (el: Element, selector: string) => [...el.querySelectorAll(selector)];
const ctaValues = (el: Element) => all(el, "[data-ph-capture-attribute-cta]").map((a) => a.getAttribute("data-ph-capture-attribute-cta"));
const hrefs = (el: Element) => all(el, "a[href]").map((a) => a.getAttribute("href")!);
/** The words a picture gives a reader: every alt that is not empty, and every named image role, in page order. */
const pictureWords = (el: Element) =>
  all(el, 'img, [role="img"]').flatMap((p) => (p.getAttribute("role") === "img" ? [`label: ${p.getAttribute("aria-label")}`] : p.getAttribute("alt") ? [`alt: ${p.getAttribute("alt")}`] : []));
/** The DS icons, as the path they draw, in page order. */
const icons = (el: Element) => all(el, "svg.kh-icon path").map((p) => p.getAttribute("d"));
/** The classes content chooses: tones, tints and bands. */
const tones = (el: Element) =>
  [el, ...all(el, "*")].flatMap((e) => [...e.classList].filter((c) => /^kh-tone-|^kh-card--tint$|^kh-section--band$/.test(c)));

describe("Home: the folds of the approved page", () => {
  it("lists the ten folds in the mockup's order, each named by its heading, with the mockup's anchors", () => {
    expect(folds(MOCKUP).map((f) => f.getAttribute("aria-labelledby"))).toEqual(LABELS);
    expect(folds(BUILT).map((f) => f.getAttribute("aria-labelledby"))).toEqual(LABELS);
    for (const id of ["modes", "app", "close", "offer", "hero-cta", "hero-price", "src-1"]) {
      expect(BUILT.querySelector(`#${id}`), id).not.toBeNull();
    }
  });

  it.each(LABELS)("%s says word for word what the mockup says (token mode)", (label) => {
    const { built, mockup } = each(label);
    expect(words(built)).toBe(words(mockup));
  });

  it("asks the fourth question in the parent's words, where the approved page asks it, and keeps its answer (task 8c.4, D061)", () => {
    const questions = all(fold(BUILT, "faq-title"), ".kh-faq__q > span:first-child").map((s) => s.textContent);
    expect(questions[3]).toBe(NOT_RIGHT_QUESTION.build);
    expect(words(BUILT)).not.toContain(NOT_RIGHT_QUESTION.mockup);
    expect(all(fold(mockupFold("home", "main"), "faq-title"), ".kh-faq__q > span:first-child")[3].textContent).toBe(NOT_RIGHT_QUESTION.mockup);
    // The one block the visual pass hides for it, found once on the page as it renders, holds the new question.
    const [hide] = FAQ_FIXES.home.hidden.both;
    expect(BUILT.querySelectorAll(hide)).toHaveLength(1);
    expect(BUILT.querySelector(`${hide} .kh-faq__q`)?.textContent).toBe(NOT_RIGHT_QUESTION.build);
  });

  it("differs from the frozen mockup only in the lines task 7.1b (V18), task 8b.1 (V26), task 8c.4 and D063 changed, the hero's picture and the films' order (Q2.1)", () => {
    const frozen = mockupFold("home", "main");
    const changed = LABELS.filter((label) => words(fold(frozen, label)) !== words(fold(MOCKUP, label)));
    expect(changed).toEqual(["hero-title", "ask-title", "see-title", "safety-title", "guides-title", "faq-title", "close-title"]);
    // The hero changes in its picture and its help line alone (D063 item 2): the approved board (and its word sticker) is
    // what the comparison leaves out, and the help line drops the call.
    expect(words(fold(MOCKUP, "hero-title"))).toBe(words(withoutHeroPicture(fold(withSellerFacts(frozen), "hero-title"), HOME_HERO_PHOTO.mockup)));
    // The films fold changes in its order alone: the same films, words and pictures.
    const tiles = (main: Element) => all(fold(main, "ask-title"), "[data-video-id]").map((li) => words(li));
    expect(tiles(MOCKUP).sort()).toEqual(tiles(frozen).sort());
    for (const line of CLAIM_FIXES.home.build) expect(words(BUILT)).toContain(line);
    // Each block the visual pass hides for the claim fixes is found once on the page as it renders.
    for (const hide of CLAIM_FIXES.home.hidden.both) expect(BUILT.querySelectorAll(hide), hide).toHaveLength(1);
    expect(words(fold(BUILT, "guides-title"))).toContain(COPY_FIXES.home.build[0]);
    expect(words(fold(BUILT, "faq-title"))).toContain(COPY_FIXES.home.build[1]);
    expect(words(fold(BUILT, "faq-title"))).toContain(COPY_FIXES.home.build[2]);
    // The card's line is the one block the visual pass hides for them, found once on the page as it renders.
    const [hide] = COPY_FIXES.home.hidden.both;
    expect(BUILT.querySelectorAll(hide)).toHaveLength(1);
    expect(words(BUILT.querySelector(hide)!)).toBe(COPY_FIXES.home.build[0]);
  });

  it.each(LABELS)("%s draws the mockup's icons, tones and pictures (and the pictures' words)", (label) => {
    const { built, mockup } = each(label);
    expect(icons(built)).toEqual(icons(mockup));
    expect(tones(built)).toEqual(tones(mockup));
    expect(pictureWords(built)).toEqual(pictureWords(mockup));
  });

  it.each(LABELS)("%s links where the mockup links (three untracked links where the copy page sends them)", (label) => {
    const { built, mockup } = each(label);
    const copyPage = COPY_PAGE_LINKS[label] ?? {};
    // mockupLinks: the mockup's addresses as routes, each trust link with its part of the terms page (task 7.1a, m8).
    expect(hrefs(built)).toEqual(mockupLinks(mockup).map((href) => copyPage[href] ?? href));
  });

  /* What the build prints differently from the approved markup, each documented where it was decided: the classes the
   * build adds (the arrow's nudge hook and the inline-button rule, components §2 CtaBlock; the band chip fix G-19; the
   * centred trust row; the list reset; the FAQ head and the answer clip of D049 pick 7), the films' `mk-films-buy`
   * wrapper dropped (components §2 FilmsStrip), the bare value-marker spans of the mockup around an amount or the
   * delivery line in running text (data-src, N22; the offer card's own price elements and perk span stay), the FAQ
   * fold's default `#faq` anchor, and the doodles that draw, an inline SVG in the build (D049 pick 3), which the tests
   * below compare file by file and place by place. The hero's still doodle is an <img> on both sides. */
  const SKELETON = {
    drop: /^ks-(?:cta__button|btn__arrow|chip--on-band|trustline--center|list-reset|faq-head)$/,
    unwrap: ".ks-faq__clip, .mk-films-buy, :not(li) > span[data-src]:not([class])",
    skip: ".ks-doodle, img.kh-imagine__doodle, #close img[src*='Doodles']",
  };
  const asApproved = (label: string, el: Element) =>
    Object.entries(COPY_PAGE_LINKS[label] ?? {}).reduce((s, [from, to]) => s.replaceAll(`[href=${from}]`, `[href=${to}]`), skeleton(el, SKELETON));

  it.each(LABELS)("%s has the mockup's markup: tags, classes, ARIA, ids and addresses (SCA 1)", (label) => {
    const { built, mockup } = each(label);
    expect(skeleton(built, SKELETON).replace("[id=faq]", "")).toBe(asApproved(label, mockup));
  });

  it("reveals exactly the blocks the mockup reveals (SPA 9)", () => {
    const reveals = (main: Element) => folds(main).map((f) => all(f, "[data-reveal]").map((el) => skeleton(el, SKELETON).split("\n")[0]));
    expect(reveals(BUILT)).toEqual(reveals(MOCKUP));
    expect(reveals(BUILT).flat()).toHaveLength(11);
  });

  it("carries the approved tracking values in page order (architecture §8.3; home.md CTA tracking values)", () => {
    // share-whatsapp: the share link under the offer card (D061, task 8c.2), in the mockup through OFFER_ADDITIONS.home.
    const values = ["hero", "hero-learn", "see-it-ask", "see-it-ask-learn", "safety", "safety-learn", "compare-learn", "faq-more", "finale", "share-whatsapp"];
    expect(ctaValues(MOCKUP)).toEqual(values);
    expect(ctaValues(BUILT)).toEqual(values);
    expect(all(BUILT, ".kh-btn--cta").map((b) => b.getAttribute("data-ph-capture-attribute-cta"))).toEqual(["hero", "see-it-ask", "safety", "finale"]);
  });
});

describe("Home: the films in the founder's order (D064 item 1, task Q2.1)", () => {
  const ids = (main: Element) => all(fold(main, "ask-title"), "[data-video-id]").map((li) => li.getAttribute("data-video-id"));

  it("shows the list's 1, 4, 7, 2, 5, 6, 3: the 2nd film replaced by the 4th and the 3rd by the 7th", () => {
    expect(HOME_FILM_ORDER).toEqual([
      "learning-by-asking",
      "a-mother-joins-in",
      "a-father-speaks",
      "first-conversations",
      "counting-out-loud",
      "a-story-in-two-languages",
      "a-parent-speaks",
    ]);
    expect(ids(TOKEN.whole.querySelector("main")!)).toEqual(HOME_FILM_ORDER);
    expect(ids(FULL.whole.querySelector("main")!)).toEqual(HOME_FILM_ORDER);
  });

  it("keeps the films list itself in the approved order, which the product page and the store show", () => {
    expect(films.map((f) => f.id)).toEqual(ids(mockupFold("home", "main")));
  });

  it("hides for the pixels the strip's films on both sides, each found once on its side; the text pass needs no rule", () => {
    const rules = VISUAL_HIDDEN.home.filter((r) => r.approvedBy === HOME_FILMS_ORDER.approvedBy);
    expect(rules.map((r) => [r.side, r.selector, r.media])).toEqual([
      ["mockup", HOME_FILMS_ORDER.mockup, undefined],
      ["build", HOME_FILMS_ORDER.build, undefined],
    ]);
    expect(mockupFold("home", "main").querySelectorAll(HOME_FILMS_ORDER.mockup)).toHaveLength(1);
    expect(TOKEN.whole.querySelectorAll(HOME_FILMS_ORDER.build)).toHaveLength(1);
    // The text pass compares sentences in any order (sentenceDiff), so the same films in other places differ in nothing.
    expect(TEXT_DEVIATIONS.home.filter((r) => r.approvedBy === HOME_FILMS_ORDER.approvedBy)).toEqual([]);
  });
});

describe("Home: the close's board top-aligned with the offer card on laptops (D064 item 5, task Q2.1)", () => {
  it("hides for the pixels the board on both sides from 900 px only, each found once in the close on its side", () => {
    const rules = VISUAL_HIDDEN.home.filter((r) => r.approvedBy === HOME_OFFER_ART.approvedBy);
    expect(rules.map((r) => [r.side, r.selector, r.media])).toEqual([
      ["mockup", HOME_OFFER_ART.mockup, "(min-width: 900px)"],
      ["build", HOME_OFFER_ART.build, "(min-width: 900px)"],
    ]);
    const board = (main: Element, selector: string) => [...main.querySelectorAll(selector)];
    expect(board(mockupFold("home", "main"), HOME_OFFER_ART.mockup).map((el) => el.closest("section")?.id)).toEqual(["close"]);
    expect(board(TOKEN.whole.querySelector("main")!, HOME_OFFER_ART.build).map((el) => el.closest("section")?.id)).toEqual(["close"]);
    // Its place moves, not its words: nothing for the text pass.
    expect(TEXT_DEVIATIONS.home.filter((r) => r.approvedBy === HOME_OFFER_ART.approvedBy)).toEqual([]);
  });
});

describe("Home: the hero (D045) and the first screen", () => {
  const hero = fold(BUILT, "hero-title");

  it("is the page's one h1, exactly D045, with the Hand accent on its last words", () => {
    expect(BUILT.querySelectorAll("h1")).toHaveLength(1);
    const h1 = hero.querySelector("h1")!;
    expect(h1.textContent).toBe("Kheelu answers every why. Then it asks one back.");
    expect(all(h1, ".kh-hand").map((s) => s.textContent)).toEqual(["asks one back."]);
    expect(hero.querySelector(".kh-eyebrow")?.textContent).toBe("Ages 3 to 7");
  });

  it("orders its headings without a skipped level: the h1, then each fold's h2, then the cards' h3 (SPA 5)", () => {
    for (const { doc } of [TOKEN, FULL]) {
      const levels = all(doc.querySelector("main")!, "h1, h2, h3, h4, h5, h6").map((h) => Number(h.tagName[1]));
      expect(levels[0]).toBe(1);
      expect(levels.filter((l) => l === 1)).toHaveLength(1);
      expect(levels.filter((l) => l === 2)).toHaveLength(LABELS.length - 1);
      const skips = levels.flatMap((l, i) => (i > 0 && l > levels[i - 1] + 1 ? [`h${levels[i - 1]} → h${l} at heading ${i + 1}`] : []));
      expect(skips).toEqual([]);
    }
  });

  it("watches the hero CTA for the phone buy bar, which Home carries (after the hero CTA leaves)", () => {
    const button = hero.querySelector("#hero-cta")!;
    expect(button.classList.contains("kh-btn--cta")).toBe(true);
    expect(button.querySelector(".ks-btn__arrow")).not.toBeNull();
    expect(stickyBarPaths()).toContain("/");
  });

  /* Task Q2.1 (D064 item 4): the hero's picture is the DS photo library's "Kabir · block rocket", in place of the board,
     in its two crops (scripts/assets/build-hero-crops.mjs): the 16:10 band in the phone board's place under 720 px
     (D061 item 1), the 4:5 DS photo frame from 720 px. Their markup is HeroSection's test's; here, the page's files and
     words. */
  const picture = fold(TOKEN.whole.querySelector("main")!, "hero-title");

  it("shows the Kabir photo in place of the board: its 16:10 crop first, then its 4:5 crop, with the photo's one alt", () => {
    const figures = all(picture, "figure");
    expect(figures.map((f) => f.className)).toEqual(["kh-photo kh-photo--xl ks-hero__phone-art", "kh-photo kh-photo--xl ks-hero-photo ks-art--clamp"]);
    expect(figures.every((f) => f.matches(HOME_HERO_PHOTO.build))).toBe(true);
    // The generated crops (the test's next/image stand-in drops an imported source, so the config holds the files and the
    // frames their sizes).
    const entry = homePage.sections[0];
    const photo = entry.kind === "hero-section" && "photo" in entry.config ? entry.config.photo : undefined;
    expect(photo && [photo.phone.src, photo.image.src]).toEqual([
      { src: "/_next/static/media/kabir-02-block-rocket-16x10.jpg", width: 1600, height: 1000 },
      { src: "/_next/static/media/kabir-02-block-rocket-4x5.jpg", width: 1200, height: 1500 },
    ]);
    const imgs = figures.map((f) => f.querySelector("img")!);
    expect(imgs.map((img) => img.getAttribute("style"))).toEqual([expect.stringContaining("--kh-ratio:1600 / 1000"), expect.stringContaining("--kh-ratio:1200 / 1500")]);
    // The photo's one alt, the journal photo table's for the same DS photo (one alt per image, journal pipeline §8.2).
    for (const img of imgs) expect(img.getAttribute("alt")).toBe(photos["kabir-02-block-rocket"].image.alt);
    // No board and no word sticker anywhere in the hero; the words column is the approved one (compared above).
    expect(picture.querySelector(".kh-art, .kh-sticker")).toBeNull();
  });

  it("keeps the hero still and loads its LCP image, one crop per width range, at high priority", () => {
    expect(all(picture, "[data-draw], [data-reveal]")).toEqual([]);
    const high = all(TOKEN.whole.querySelector("main")!, '[fetchpriority="high"]');
    expect(high).toHaveLength(2);
    for (const img of high) {
      expect(picture.contains(img)).toBe(true);
      expect(img.getAttribute("loading")).toBe("eager");
      expect(img.closest("figure")?.matches(HOME_HERO_PHOTO.build)).toBe(true);
    }
  });

  it("accepts in the text pass only the board's word sticker as gone (its two lines), and excuses no other approved line", () => {
    const rule = TEXT_DEVIATIONS.home.find((r) => r.approvedBy === HOME_HERO_PHOTO.approvedBy)!;
    expect(rule.build).toBeUndefined();
    // The browser reads the round sticker as two lines (its <strong> is a block: bundle.css, .kh-sticker--round strong).
    expect(mockupFold("home", "main .mk-hero .kh-sticker").textContent).toBe(HOME_HERO_PHOTO.sticker.join(""));
    for (const line of HOME_HERO_PHOTO.sticker) expect(rule.mockup.test(line), line).toBe(true);
    // No other approved line: every sentence of the approved page but the sticker's passes the rule by.
    const others = blockSentences(withoutHeroPicture(mockupFold("home", "main"), ".mk-hero .kh-sticker"));
    expect(others.filter((line) => rule.mockup.test(line))).toEqual([]);
    // The build prints neither line.
    expect(TOKEN.whole.querySelector("main")!.textContent).not.toMatch(/It asks\.|They think\./);
  });

  it("never moves money on arrival: no price, chilli button, offer card or h1 inside a reveal", () => {
    expect(revealOnMoneyInDocument(TOKEN.doc)).toEqual([]);
    expect(all(hero, "[data-reveal]")).toEqual([]);
  });
});

describe("Home: the doodles below the first screen draw themselves (D049 pick 3)", () => {
  /** A layer's placement as the mockup's inline style gives it: left/right, top/bottom, width, rotation. */
  const placement = (style: string) => {
    const props = Object.fromEntries(style.split(";").map((d) => d.split(":").map((s) => s.trim())).filter(([k, v]) => k && v));
    const pct = (v?: string) => (v === undefined ? undefined : Number(v.replace("%", "")));
    const rotate = /rotate\((-?[\d.]+)deg\)/.exec(props.transform ?? "")?.[1];
    return { left: pct(props.left), top: pct(props.top), bottom: pct(props.bottom), width: pct(props.width), rotate: rotate === undefined ? undefined : Number(rotate) };
  };
  const ofLayer = (layer: ArtLayer) => ({ left: layer.left, top: layer.top, bottom: layer.bottom, width: layer.width, rotate: layer.rotate });
  const fileOf = (src: string) => decodeURIComponent(src).split("/").pop()!.replace(/\.[a-z]+$/, "");
  /** What a mockup layer's file is in the build: a doodle by its DS name, any other DS file as its static import. */
  const asImported = async (src: string) => {
    const path = decodeURIComponent(src);
    if (path.includes("/Doodles/")) return `doodle ${fileOf(path)}`;
    return ((await import(/* @vite-ignore */ path.replace("../design-system/project/", "@ds/"))) as { default: unknown }).default;
  };
  const ofContent = (layer: ArtLayer) => (layer.doodle ? `doodle ${layer.doodle.name}` : layer.image.src);

  it("the imagination frame's four doodles: the mockup's files and places, drawn in turn", () => {
    const frame = homePage.sections.find((s) => s.kind === "feature-split" && s.config.variant === "imagination");
    if (frame?.kind !== "feature-split" || frame.config.variant !== "imagination") throw new Error("no imagination fold");
    const expected = all(fold(MOCKUP, "why-title"), "img.kh-imagine__doodle");
    expect((frame.config.frame.doodles ?? []).map((d) => d.doodle.name)).toEqual(expected.map((img) => fileOf(img.getAttribute("src")!)));
    expect((frame.config.frame.doodles ?? []).map(ofLayer)).toEqual(expected.map((img) => placement(img.getAttribute("style")!)));
    const drawn = all(fold(BUILT, "why-title"), "svg.kh-imagine__doodle[data-draw]");
    expect(drawn.map((d) => d.getAttribute("data-draw-order"))).toEqual(["1", "2", "3", "4"]);
  });

  it("the close's board: the mockup's files and places, and its heart draws (the hero's picture is the photo since Q2.1)", async () => {
    const entry = homePage.sections.find((s) => s.kind === "offer-section");
    const art = entry?.kind === "offer-section" && entry.config.variant === "close" ? entry.config.art : undefined;
    if (!art) throw new Error("no board in close-title");
    const expected = all(fold(MOCKUP, "close-title"), ".kh-art__layer");
    expect(art.layers.map(ofContent)).toEqual(await Promise.all(expected.map((img) => asImported(img.getAttribute("src")!))));
    expect(art.layers.map(ofLayer)).toEqual(expected.map((img) => placement(img.getAttribute("style")!)));
    const close = fold(BUILT, "close-title");
    expect(all(close, "svg.kh-art__layer[data-draw]")).toHaveLength(1);
    const hero = homePage.sections.find((s) => s.kind === "hero-section");
    expect(hero?.kind === "hero-section" && "photo" in hero.config && hero.config.photo !== undefined).toBe(true);
  });
});

describe("Home: the page's FAQPage (wave-4 close; architecture §9.2; home.md fold 8)", () => {
  const QUESTIONS = {
    token: [
      "What is Kheelu?",
      "Won’t an AI toy make my child think less?",
      "What ages is Kheelu for?",
      "How much is Kheelu, and how does the advance work?",
      "What if my child doesn’t like it?",
      "When will my Kheelu arrive?",
      "Is Kheelu the same as Lumi?",
    ],
    full: [
      "What is Kheelu?",
      "Won’t an AI toy make my child think less?",
      "What ages is Kheelu for?",
      "How much is Kheelu?",
      "What if my child doesn’t like it?",
      "When will my Kheelu arrive?",
      "Is Kheelu the same as Lumi?",
    ],
  };

  it.each(["token", "full"] as const)("is fold 4's answer and the six visible answers, every one on the page (%s mode)", (mode) => {
    const { html, doc } = mode === "token" ? TOKEN : FULL;
    const graphs = jsonLdBlocks(html) as { "@graph": { "@type": string; mainEntity: { name: string; acceptedAnswer: { text: string } }[] }[] }[];
    expect(graphs).toHaveLength(1);
    expect(graphs[0]["@graph"].map((n) => n["@type"])).toEqual(["FAQPage"]);
    const questions = graphs[0]["@graph"][0].mainEntity;
    expect(questions.map((q) => q.name)).toEqual(QUESTIONS[mode]);
    expect(questions[0].acceptedAnswer.text).toBe(fold(doc.querySelector("main")!, "what-title").querySelector(".kh-heading__lead")?.textContent);
    expect(all(fold(doc.querySelector("main")!, "faq-title"), "summary").map((s) => s.textContent)).toEqual(QUESTIONS[mode].slice(1));
    expect(jsonLdMismatches(html)).toEqual([]);
  });
});

describe("Home: full mode (ADR-005)", () => {
  const main = FULL.doc.querySelector("main")!;

  it("prints the paid-in-full sentence beside every chilli button, and no advance anywhere", () => {
    const sentences = all(main, ".ks-price, .kh-offer__fine").map((p) => p.textContent);
    expect(sentences.length).toBeGreaterThanOrEqual(4);
    for (const s of sentences) expect(s).toBe("₹7,999 (incl. GST), paid in full when you order.");
    expect(main.querySelector(".kh-offer__split")).toBeNull();
    expect(main.textContent).not.toContain("₹499");
    expect(main.textContent).not.toContain("₹4,500");
  });

  it("keeps every other word and fold", () => {
    expect(folds(main).map((f) => f.getAttribute("aria-labelledby"))).toEqual(LABELS);
    for (const label of ["ask-title", "why-title", "what-title", "see-title", "compare-title", "guides-title"]) {
      expect(words(fold(main, label)).replaceAll("₹7,999 (incl. GST), paid in full when you order.", "")).toBe(
        words(fold(BUILT, label)).replaceAll("Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).", ""),
      );
    }
  });
});

describe("Home: search and share metadata (home.md At a glance; D028)", () => {
  it.each([
    ["token", "Kheelu by Kheelona: a screen-free plush toy, ages 3 to 7, that answers your child, then asks back. ₹4,999 (incl. GST); reserve with a refundable ₹499."],
    ["full", "Kheelu by Kheelona: a screen-free plush toy, ages 3 to 7, that answers your child, then asks back. ₹7,999 (incl. GST), delivered anywhere in India."],
  ] as const)("is the copy page's title and %s-mode description, with the Kheelu card", (mode, description) => {
    const offer = buildOffer(mode);
    expect(toPlainText(homePage.meta.title, offer)).toBe("Kheelu by Kheelona: a screen-free plush toy that talks");
    expect(toPlainText(homePage.meta.description, offer)).toBe(description);
    const meta = pageMeta({ ...homePage.meta, path: "/", offer });
    expect(meta.alternates?.canonical).toBe("/");
    expect(homePage.meta.og).toEqual({ image: "/og/kheelu.jpg", alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy." });
  });
});

/* Task 8c.3 (D061 item 4 and the main session's rulings): parents' own words under the films, and the "Recognised by."
 * strip right after the films (the /team strip as built, D054 item 20). The approved page has neither, so the tests above
 * compare the page without them (PROOF_ADDITIONS), and these hold the blocks themselves, on the page as it renders. */
describe("Home: parents' own words and the recognition strip (task 8c.3)", () => {
  const WHOLE = TOKEN.whole.querySelector("main")!;

  it("puts the strip right after the films, before fold 3; every other fold in the approved order", () => {
    const order = folds(WHOLE).map((f) => f.getAttribute("aria-labelledby"));
    expect(order).toEqual([LABELS[0], LABELS[1], "recognised-title", ...LABELS.slice(2)]);
    expect(folds(FULL.whole.querySelector("main")!).map((f) => f.getAttribute("aria-labelledby"))).toEqual(order);
  });

  it("prints the two quotes under the films' controls, before the CTA block, each with the button that plays its film", () => {
    const filmsFold = fold(WHOLE, "ask-title");
    const quotes = filmsFold.querySelector(".ks-films-wrap .ks-films-ctrl + .ks-film-quotes")!;
    expect(quotes).not.toBeNull();
    expect(all(quotes, "blockquote").map((q) => q.textContent)).toEqual(filmQuotes.items.map((q) => q.quote));
    expect(all(quotes, ".kh-quote__name").map((n) => n.textContent)).toEqual(filmQuotes.items.map((q) => q.name));
    const chip = (id: string) => films.find((f) => f.id === id)!.chip;
    expect(all(quotes, "button").map((b) => [b.textContent, b.getAttribute("aria-label")])).toEqual(
      filmQuotes.items.map((q) => [filmQuotes.watch, `${filmQuotes.watch}: ${chip(q.film)}`]),
    );
    // The proof line covers them (D040) and stays; the CTA block still follows the strip.
    expect(filmsFold.querySelector(".ks-films-proof")?.textContent).toBe("Kids doing the talking. Parents, in their own words.");
    expect(filmsFold.querySelector(".ks-films-wrap ~ .kh-section__actions .kh-btn--cta")?.getAttribute("data-ph-capture-attribute-cta")).toBe("see-it-ask");
    // No film before a tap.
    expect(WHOLE.querySelector("video")).toBeNull();
  });

  it("shows the team's strip as built: its heading, the programmes in order, the marks lazy and no CTA", () => {
    const strip = fold(WHOLE, "recognised-title");
    expect(strip.className).toBe("kh-section kh-section--tight");
    expect(strip.querySelector("#recognised-title")?.textContent).toBe(recognitionStrip.title);
    expect(all(strip, ".ks-recognition__item").map((li) => li.querySelector("img")?.getAttribute("alt") || li.textContent)).toEqual([
      "NVIDIA Inception Program",
      "Karnataka Elevate",
      "nasscom startups",
      "Founders Inc",
    ]);
    expect(all(strip, "img").map((img) => img.getAttribute("loading"))).toEqual(["lazy", "lazy", "lazy"]);
    expect(all(strip, ".ks-recognition__name").map((n) => n.textContent)).toEqual([...TEAM_STRIP_BUILD]);
    expect(strip.querySelector("[data-reveal], [data-ph-capture-attribute-cta]")).toBeNull();
  });

  it("keeps the page's tracking values, its one h1 and its one LCP image", () => {
    expect(ctaValues(WHOLE)).toEqual(ctaValues(BUILT));
    expect(WHOLE.querySelectorAll("h1")).toHaveLength(1);
    // One LCP image per width range since task 8c.1 (D061 item 1), the hero photo's two crops since task Q2.1: the 16:10
    // crop's under 720 px and the 4:5 crop's from 720 px, each asking for a 1px image at the other's widths (HeroSection's
    // test holds the sizes).
    const high = all(WHOLE, '[fetchpriority="high"]');
    expect(high).toHaveLength(2);
    for (const img of high) expect(img.closest(".ks-hero"), "inside the hero").not.toBeNull();
    expect(revealOnMoneyInDocument(TOKEN.whole)).toEqual([]);
  });

  it("hides for the pixels exactly the added blocks, each found once on the page and gone from the page compared", () => {
    const rules = VISUAL_HIDDEN.home.filter((r) => r.approvedBy === PROOF_ADDITIONS_APPROVED);
    expect(rules.map((r) => [r.side, r.selector])).toEqual(PROOF_ADDITIONS.home.selectors.map((s) => ["build", s]));
    for (const selector of PROOF_ADDITIONS.home.selectors) {
      expect(WHOLE.querySelectorAll(selector), selector).toHaveLength(1);
      expect(BUILT.querySelectorAll(selector), selector).toHaveLength(0);
    }
  });

  it("accepts in the text pass the added lines, word for word as the page prints them, and excuses no approved line", () => {
    const rule = TEXT_DEVIATIONS.home.find((r) => r.approvedBy === PROOF_ADDITIONS_APPROVED)!;
    const added = [
      ...all(WHOLE, ".ks-film-quotes blockquote, .ks-film-quotes .kh-quote__name, .ks-film-quotes .kh-quote__role, .ks-film-quotes button"),
      ...all(fold(WHOLE, "recognised-title"), "h2, .ks-recognition__name"),
    ].map((el) => el.textContent!);
    expect(added).toHaveLength(11);
    for (const line of added) for (const s of sentences(line)) expect(rule.build!.test(s), s).toBe(true);
    for (const line of sentences(words(MOCKUP))) expect(rule.mockup.test(line), line).toBe(false);
  });

  it("passes the claims guard on every added line, and says nothing of an age under 3", () => {
    for (const line of PROOF_ADDITIONS.home.build) {
      expect(findBanned(line), line).toEqual([]);
      expect(line).not.toMatch(/\b[0-2]\s*(?:years?|yrs?|months?)\b|toddler|baby|babies/i);
    }
  });
});
