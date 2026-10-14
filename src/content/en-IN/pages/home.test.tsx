import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { doodleSrc } from "@/components/ui/Doodle/doodle-files";
import type { ArtLayer, OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { CLAIM_FIXES, COPY_FIXES } from "../../../../test/e2e/support/deviations";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { mockupFold, mockupLinks, skeleton, words } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";
import { homePage } from "./home";

/*
 * Home `/` (task 5.1; structure §5; architecture §9.2; tasks.md SPA): the page is its content module, rendered by
 * PageTemplate, and it prints what the approved mockup prints (mockup/home.html, the built Gate A page, D045, D046):
 * the ten folds in order, word for word, with the mockup's tracking values, links, pictures, icons and tones; the
 * hero exactly D045 with its Hand accent; the hero doodle still and the frame and close doodles drawing (D049 picks 2
 * and 3); one LCP image; FAQPage = the six visible answers plus fold 4's "What is Kheelu?" (wave-4 close).
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
 * check. MOCKUP below is the approved page with exactly those applied, the claim fixes in a pass of their own.
 */

/* The hero board's two stickers as Next imports them (`{ src, width, height }`, the size read from the DS file), where
 * Vite would give a bare URL: the board picks its LCP image by drawn area, which needs the size. */
const staticImport = vi.hoisted(() => async (file: string) => {
  const { default: sharp } = await import("sharp");
  const { width, height } = await sharp(file).metadata();
  return { default: { src: `/_next/static/media/${file.split("/").pop()}`, width, height } };
});
vi.mock("@ds/assets/Cast/advik-sticker.png", () => staticImport("design-system/project/assets/Cast/advik-sticker.png"));
vi.mock("@ds/assets/Kheelu/kheelu-front-sticker.png", () => staticImport("design-system/project/assets/Kheelu/kheelu-front-sticker.png"));

const MOCKUP = withFacts(withFacts(mockupFold("home", "main"), COPY_FIXES.home.edits), CLAIM_FIXES.home.edits);
const LABELS = ["hero-title", "ask-title", "why-title", "what-title", "see-title", "safety-title", "compare-title", "guides-title", "faq-title", "close-title"];

/** The copy page's targets for the three untracked links whose mockup address was a page of the review build. */
const COPY_PAGE_LINKS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "why-title": { "/stories": "/stories/how-children-learn-by-talking" }, // home.md fold 3
  "what-title": { "/products/kheelu": "/products/kheelu#modes" }, // home.md fold 4
  "see-title": { "/products/kheelu": "/products/kheelu#app" }, // home.md fold 5
};

function rendered(mode: OfferMode) {
  const main = renderToStaticMarkup(<PageTemplate page={homePage} offer={buildOffer(mode)} path="/" />);
  const html = `<!doctype html><html><body><main id="main">${main}</main></body></html>`;
  return { html, doc: new DOMParser().parseFromString(html, "text/html") };
}

const TOKEN = rendered("token");
const FULL = rendered("full");
const BUILT = TOKEN.doc.querySelector("main")!;

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

  it("differs from the frozen mockup only in the lines task 7.1b (V18) and task 8b.1 (V26) changed", () => {
    const frozen = mockupFold("home", "main");
    const changed = LABELS.filter((label) => words(fold(frozen, label)) !== words(fold(MOCKUP, label)));
    expect(changed).toEqual(["see-title", "safety-title", "guides-title", "faq-title", "close-title"]);
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
    const values = ["hero", "hero-learn", "see-it-ask", "see-it-ask-learn", "safety", "safety-learn", "compare-learn", "faq-more", "finale"];
    expect(ctaValues(MOCKUP)).toEqual(values);
    expect(ctaValues(BUILT)).toEqual(values);
    expect(all(BUILT, ".kh-btn--cta").map((b) => b.getAttribute("data-ph-capture-attribute-cta"))).toEqual(["hero", "see-it-ask", "safety", "finale"]);
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

  it("keeps the hero board's doodle still and loads one LCP image, the hero's, at high priority", () => {
    expect(all(hero, "[data-draw]")).toEqual([]);
    expect(all(hero, "img.kh-art__layer").map((img) => img.getAttribute("src"))).toContain(doodleSrc("chalk-question-mark"));
    const high = all(BUILT, '[fetchpriority="high"]');
    expect(high).toHaveLength(1);
    expect(hero.contains(high[0])).toBe(true);
    expect(high[0].getAttribute("loading")).toBe("eager");
    // The boy's sticker, the board's largest drawn raster (layers in the mockup's order: sun, boy, Kheelu, question mark).
    expect(all(hero, ".kh-art > .kh-art__layer").indexOf(high[0])).toBe(1);
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

  it("the boards: the hero's and the close's layers are the mockup's files and places; the close's heart draws", async () => {
    for (const [label, kind] of [["hero-title", "hero-section"], ["close-title", "offer-section"]] as const) {
      const entry = homePage.sections.find((s) => s.kind === kind);
      const art = entry?.kind === "hero-section" && "art" in entry.config ? entry.config.art : entry?.kind === "offer-section" && entry.config.variant === "close" ? entry.config.art : undefined;
      if (!art) throw new Error(`no board in ${label}`);
      const expected = all(fold(MOCKUP, label), ".kh-art__layer");
      expect(art.layers.map(ofContent)).toEqual(await Promise.all(expected.map((img) => asImported(img.getAttribute("src")!))));
      expect(art.layers.map(ofLayer)).toEqual(expected.map((img) => placement(img.getAttribute("style")!)));
    }
    const close = fold(BUILT, "close-title");
    expect(all(close, "svg.kh-art__layer[data-draw]")).toHaveLength(1);
    expect(all(fold(BUILT, "hero-title"), ".kh-sticker").map((s) => s.textContent)).toEqual(["It asks.They think."]);
  });
});

describe("Home: the page's FAQPage (wave-4 close; architecture §9.2; home.md fold 8)", () => {
  const QUESTIONS = {
    token: [
      "What is Kheelu?",
      "Won’t an AI toy make my child think less?",
      "What ages is Kheelu for?",
      "How much is Kheelu, and how does the advance work?",
      "What if it isn’t right for us?",
      "When will my Kheelu arrive?",
      "Is Kheelu the same as Lumi?",
    ],
    full: [
      "What is Kheelu?",
      "Won’t an AI toy make my child think less?",
      "What ages is Kheelu for?",
      "How much is Kheelu?",
      "What if it isn’t right for us?",
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
