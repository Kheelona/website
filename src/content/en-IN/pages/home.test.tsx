import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { findBanned } from "../../../../test/guards/banned-phrases.data";
import { htmlToText } from "../../../../test/e2e/support/mockup-text";
import {
  FOOTER_COLS_HIDDEN,
  HOME_SELLING,
  HOME_SELLING_APPROVED,
  HOME_SELLING_HIDDEN,
  HOME_SELLING_TEXT,
  TEXT_DEVIATIONS,
  VISUAL_HIDDEN,
  visualHidden,
  type HomeSellingFold,
} from "../../../../test/e2e/support/deviations";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { sentences } from "../../../../test/e2e/support/parity";
import { mockupFold } from "../../../../test/support/mockup-compare";
import { expertClip, expertFold } from "../expert-video";
import { faqs } from "../faqs";
import { filmQuotes, films } from "../films";
import { PLUS_NOTE } from "../offer";
import { product } from "../products/kheelu/product";
import { recognitionStrip } from "../recognition";
import { homePage } from "./home";

/*
 * Home `/` since the selling update (task Q2.9; D064, D065; the copy: wiki/site/d2c-conversion-plan-2026-10-15.md v2 §1
 * and §2, checked by the claims guard and the CMO, wiki/qa/cmo-review-d2c-plan-v2-2026-10-15.md; the main session's
 * rulings of 2026-10-15). The page is its content module, rendered by PageTemplate. Eleven folds in the plan's order,
 * every line in the plan's words, every amount a token of the live offer and every policy number from its module. The
 * approved Gate A page (mockup/home.html, D046) is no longer its reference: what still differs from it, fold by fold,
 * is test/e2e/support/deviations.ts's HOME_SELLING (its rows are the main session's in wiki/qa/deviations.md).
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

function rendered(mode: OfferMode) {
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(<PageTemplate page={homePage} offer={buildOffer(mode)} path="/" />)}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { html, doc, main: doc.querySelector("main")! };
}
const TOKEN = rendered("token");
const FULL = rendered("full");

const all = (el: ParentNode, selector: string) => [...el.querySelectorAll(selector)];
const text = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
const folds = (main: Element) => [...main.children].filter((el) => el.tagName === "SECTION");
const fold = (label: string, main: Element = TOKEN.main) => folds(main).find((el) => el.getAttribute("aria-labelledby") === label)!;
const ctaValues = (el: Element) => all(el, "[data-ph-capture-attribute-cta]").map((a) => a.getAttribute("data-ph-capture-attribute-cta"));
const chilli = (el: Element) => all(el, ".kh-btn--cta").map((a) => a.getAttribute("data-ph-capture-attribute-cta"));
const trustRow = (el: Element) => all(el, ".ks-trust li").map((li) => text(li));
const alts = (el: Element) => all(el, "img").map((img) => img.getAttribute("alt"));

/** The page's eleven folds (the plan's §2 table), the strip under the films counted with fold 2. */
const LABELS = [
  "hero-title",
  "films-title",
  "recognised-title",
  "why-title",
  "languages-title",
  "asks-title",
  "expert-title",
  "offer-title",
  "safety-title",
  "day-title",
  "faq-title",
  "close-title",
];
const PRICE_LINE = { token: "₹499 today, refundable. ₹4,999 in total.", full: "₹7,999 in total, paid in full when you order." };
const TRUST = ["Full refund until dispatch · 7-day returns", "Deliveries start mid-November"];

describe("Home: the folds, in the plan's order (D2C plan v2 §2)", () => {
  it("lists the eleven folds, each a section named by its heading, the recognition strip right after the films", () => {
    for (const { main } of [TOKEN, FULL]) expect(folds(main).map((f) => f.getAttribute("aria-labelledby"))).toEqual(LABELS);
  });

  it("is one h1, then an h2 per fold, then the items' h3, with no level skipped (SPA 5)", () => {
    for (const { main } of [TOKEN, FULL]) {
      const levels = all(main, "h1, h2, h3, h4, h5, h6").map((h) => Number(h.tagName[1]));
      expect(levels.filter((l) => l === 1)).toHaveLength(1);
      expect(levels[0]).toBe(1);
      expect(levels.flatMap((l, i) => (i > 0 && l > levels[i - 1] + 1 ? [i] : []))).toEqual([]);
    }
    // The recognition strip is a label, not a heading (the plan's ruling 1; CMO m10).
    expect(fold("recognised-title").querySelector("h2, h3")).toBeNull();
  });

  it("puts at most one accent in each heading (DS 10-pages.md:39), and none in the h1 but the founder's", () => {
    for (const h of all(TOKEN.main, "h1, h2, h3")) expect(h.querySelectorAll(".kh-hand, .kh-mark").length, text(h)).toBeLessThanOrEqual(1);
  });

  it("carries six chilli buttons, each with its own value, and the links in page order (plan §11)", () => {
    expect(chilli(TOKEN.main)).toEqual(["hero", "home-why", "home-asks", "home-offer", "safety", "finale"]);
    expect(ctaValues(TOKEN.main)).toEqual(["hero", "hero-film", "home-why", "home-asks", "home-asks-learn", "home-offer", "share-whatsapp", "safety", "safety-learn", "finale"]);
    // The values that stop firing on Home: they stay registered, their elements are gone.
    for (const gone of ["see-it-ask", "see-it-ask-learn", "compare-learn", "faq-more", "hero-learn"]) expect(ctaValues(TOKEN.main)).not.toContain(gone);
  });

  it("links away three times only (ruling 1): how it works, the safety page, and the share link; the source is a citation", () => {
    const away = all(TOKEN.main, "a[href]")
      .map((a) => a.getAttribute("href")!)
      // In-page links, the store's buttons and the trust lines' policy links (refund, shipping, terms) are not exits.
      .filter((href) => !href.startsWith("#") && !href.startsWith("https://store") && !/^\/(?:refund|shipping|terms)#/.test(href));
    expect(away).toEqual(["https://developingchild.harvard.edu/key-concept/serve-and-return/", "/products/kheelu#modes", expect.stringMatching(/^https:\/\/wa\.me\/\?text=/), "/safety"]);
  });

  it("watches the hero button for the phone buy bar, which Home carries", () => {
    expect(fold("hero-title").querySelector("#hero-cta.kh-btn--cta")).not.toBeNull();
    expect(stickyBarPaths()).toContain("/");
  });
});

describe("Home fold 1 · hero (plan §2.0 and fold 1; D065 item 1)", () => {
  const hero = fold("hero-title");

  it("says the founder's eyebrow and h1 and the two-line lead, word for word", () => {
    expect(text(hero.querySelector(".kh-eyebrow"))).toBe("Screen-free AI toy · Ages 3 to 7");
    expect(text(hero.querySelector("h1"))).toBe("The AI toy that answers every why, then asks your child one back.");
    expect(all(hero, "h1 .kh-hand").map((s) => s.textContent)).toEqual(["one back."]);
    expect(text(hero.querySelector(".kh-heading__lead"))).toBe("Kheelu by Kheelona is a soft plush rabbit. You can read every chat.");
  });

  it("puts the button, then the price line as its own block, then the risk-reversal line and the delivery line, and no help line", () => {
    const button = hero.querySelector("#hero-cta")!;
    expect(text(button)).toBe("Pre-order Kheelu");
    const price = hero.querySelector("#hero-price")!;
    expect(price.tagName).toBe("P");
    expect(button.closest(".kh-section__actions")?.nextElementSibling).toBe(price);
    expect(text(price)).toBe(PRICE_LINE.token);
    expect(trustRow(hero)).toEqual(TRUST);
    expect(hero.querySelector(".ks-help")).toBeNull();
  });

  it("offers the film link on laptops only, its length read from film 1, playing film 1 in the strip (CMO M1, M2)", () => {
    const link = hero.querySelector('[data-ph-capture-attribute-cta="hero-film"]')!;
    expect(text(link)).toBe("Watch Kheelu ask, in a 30-second film");
    expect(films[0].duration).toBe("0:30");
    expect(link.getAttribute("href")).toBe("#learning-by-asking");
    expect(link.classList.contains("kh-btn--ghost")).toBe(true);
    expect(link.parentElement?.classList.contains("ks-cta__laptop")).toBe(true);
    // The film the link names is film 1, and the strip's tile for it carries its id (the strip is anchored).
    expect(TOKEN.main.querySelector("#learning-by-asking")?.getAttribute("data-video-id")).toBe("learning-by-asking");
  });

  it("shows the Kabir photo, phone crop first, with the plan's alt (CMO m4), still", () => {
    const figures = all(hero, "figure");
    expect(figures.map((f) => f.className)).toEqual(["kh-photo kh-photo--xl ks-hero__phone-art", "kh-photo kh-photo--xl ks-hero-photo ks-art--clamp"]);
    const ALT = "A boy in glasses and an olive T-shirt stacking wooden blocks into a tall tower on a patterned rug, with Kheelu, the cream plush rabbit from Kheelona, beside him.";
    expect(alts(hero)).toEqual([ALT, ALT]);
    expect(all(hero, "[data-reveal], [data-draw]")).toEqual([]);
  });

  /* Plan §1.6 and fold 1 (CMO m14): the photo is the LCP on laptops (the 4:5 crop, from 720 px); on phones the H1 is,
     and the phone crop starts below a 360 x 590 screen, so it loads eagerly with no priority hint. The server's preloads
     are HeroSection.test.tsx's (the real next/image; this file renders the shared stand-in). */
  it("gives the high priority to the 4:5 crop alone; the phone crop is eager with none (CMO m14)", () => {
    const [phone, image] = all(hero, "figure > img");
    expect(all(TOKEN.main, '[fetchpriority="high"]')).toEqual([image]);
    expect([phone.getAttribute("loading"), phone.getAttribute("fetchpriority")]).toEqual(["eager", null]);
  });
});

describe("Home fold 2 · films, parents' words, recognised by (plan fold 2)", () => {
  const films2 = fold("films-title");

  it("heads the strip with the product page's built words, on the band, with no button", () => {
    expect(films2.className).toBe("kh-section kh-section--band");
    expect(text(films2.querySelector(".kh-eyebrow"))).toBe("Seven films");
    expect(text(films2.querySelector("h2"))).toBe("Real children, real families.");
    expect(all(films2, "h2 .kh-hand").map((s) => s.textContent)).toEqual(["real families."]);
    expect(text(films2.querySelector(".kh-heading__lead"))).toBe("Watch the children do the thinking. Then hear from two of their parents.");
    expect(chilli(films2)).toEqual([]);
  });

  it("plays the seven films in D064's order, every poster lazy, with the proof line and the two parents' quotes", () => {
    expect(all(films2, "[data-video-id]").map((li) => text(li.querySelector(".kh-chip")))).toEqual([
      "Learning by asking",
      "A mother joins in",
      "A father’s view",
      "Real families",
      "Counting out loud",
      "Two languages",
      "In a parent’s words",
    ]);
    for (const img of all(films2, ".ks-film img")) expect(img.getAttribute("loading")).toBe("lazy");
    expect(text(films2.querySelector(".ks-films-proof"))).toBe("Kids doing the talking. Parents, in their own words.");
    expect(all(films2, "blockquote").map((q) => text(q))).toEqual(filmQuotes.items.map((q) => q.quote));
  });

  it("follows with the strip as a small label, “Recognised by”, names only, on the films' band", () => {
    const strip = fold("recognised-title");
    expect(strip.className).toBe("kh-section kh-section--band kh-section--tight ks-recognised");
    expect(text(strip.querySelector("#recognised-title"))).toBe("Recognised by");
    expect(all(strip, ".ks-recognition__item").map((li) => li.querySelector("img")?.getAttribute("alt") || text(li))).toEqual(
      recognitionStrip.items.map((item) => item.name),
    );
  });
});

describe("Home fold 3 · why it matters (plan fold 3; D016, D026)", () => {
  const why = fold("why-title");

  it("says the brain line in D016's form and the Harvard sentence, credited, with no picture", () => {
    expect(text(why.querySelector(".kh-eyebrow"))).toBe("Why it matters");
    expect(text(why.querySelector("h2"))).toBe("Conversation helps a young brain grow.");
    expect(all(why, "h2 .kh-mark").map((s) => s.textContent)).toEqual(["Conversation"]);
    expect(text(why.querySelector("p.kh-body-l"))).toBe(
      "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain.[1]",
    );
    expect(why.querySelector("img, .kh-imagine")).toBeNull();
  });

  it("gives the card the plan's words and the source note its link", () => {
    expect(text(why.querySelector(".kh-card__title"))).toBe("Where Kheelu comes in");
    expect(text(why.querySelector(".kh-card__body"))).toBe(
      "Kheelu is built around the same idea: it answers your child, then asks a question back. It doesn’t replace that time with you.",
    );
    expect(why.querySelector('a[href="https://developingchild.harvard.edu/key-concept/serve-and-return/"]')).not.toBeNull();
  });

  it("ends on its button, home-why, with the price line and the trust line", () => {
    expect(chilli(why)).toEqual(["home-why"]);
    expect(text(why.querySelector(".ks-price"))).toBe(PRICE_LINE.token);
    expect(trustRow(why)).toEqual(TRUST);
  });
});

describe("Home fold 4 · languages (plan fold 4; D064 item 9)", () => {
  const langs = fold("languages-title");
  const NAMES = product.languages.map((l) => l.name);

  it("says the ceiling from product.ts and the eight languages in the lead, the names rendered from product.ts", () => {
    expect(NAMES).toEqual(["English", "Hindi", "Bengali", "Telugu", "Tamil", "Kannada", "Spanish", "French"]);
    expect(text(langs.querySelector(".kh-eyebrow"))).toBe("Languages");
    expect(text(langs.querySelector("h2"))).toBe(`Kheelu speaks up to ${product.languageCeiling} languages at launch.`);
    expect(all(langs, "h2 .kh-hand").map((s) => s.textContent)).toEqual(["languages"]);
    expect(text(langs.querySelector(".kh-heading__lead"))).toBe(
      "Eight today: English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French. In AI mode, it can switch between them mid-sentence: when your child changes language, Kheelu changes with them.",
    );
  });

  it("lists the eight in their own scripts, then plays film 6 in place with its caption: a real film, never a cast photo", () => {
    expect(all(langs, ".kh-lang")).toHaveLength(8);
    const figure = langs.querySelector("figure.ks-langs-film")!;
    const poster = figure.querySelector("img")!;
    expect(poster.getAttribute("alt")).toBe("A girl on a sofa beside the cream Kheelu plush.");
    expect(poster.getAttribute("loading")).toBe("lazy");
    expect(text(figure.querySelector(".ks-clip__chip"))).toBe("Two languages · 0:31");
    expect(figure.querySelector("button")?.getAttribute("aria-label")).toBe("Play: Two languages. In AI mode, Arha switches to English, and Kheelu switches with her.");
    expect(text(figure.querySelector("figcaption"))).toBe("In AI mode, Arha switches to English, and Kheelu switches with her.");
    expect(chilli(langs)).toEqual([]);
    // The film and its poster are film 6's; the video's own poster is that still, never the animated .webp preview.
    const entry = homePage.sections.find((s) => s.kind === "languages-section");
    const six = films.find((f) => f.id === "a-story-in-two-languages")!;
    expect(entry?.kind === "languages-section" && [entry.config.film.video, entry.config.film.still]).toEqual([six.video, six.poster.src]);
  });
});

describe("Home fold 5 · Kheelu asks, your child thinks (plan fold 5; the CMO's m3 and m5)", () => {
  const asks = fold("asks-title");
  const POINTS = [
    ["A soft plush rabbit. No screen.", "Kheelu is a cream plush rabbit with a speaker in its tummy. Your child talks and listens instead of watching."],
    ["Press and ask.", "Your child presses the wake-up button and asks. A light shows Kheelu is listening."],
    ["It answers, then asks one back.", "It answers the question first. Then it asks your child a question back, so they do the thinking."],
    ["It can’t browse the internet.", "And when it doesn’t know something, it says so instead of guessing."],
    [
      "You read every conversation.",
      "Each one appears in the parent app, word for word, a few minutes after it ends. Kheelu remembers them too, so it can pick up where your child stopped.",
    ],
    [
      "From age 3. Still asking back at 7.",
      "Made for children aged 3 to 7. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby. You set your child’s age in the parent app, and Kheelu’s AI is given child-safety rules for that age.",
    ],
  ];

  it("heads the fold with the plan's eyebrow and h2", () => {
    expect(text(asks.querySelector(".kh-eyebrow"))).toBe("How it works");
    expect(text(asks.querySelector("h2"))).toBe("Kheelu asks. Your child thinks.");
    expect(all(asks, "h2 .kh-hand").map((s) => s.textContent)).toEqual(["Your child thinks."]);
  });

  it("reads the six points word for word, in order", () => {
    expect(all(asks, ".ks-sticky__point").map((li) => [text(li.querySelector("h3")), text(li.querySelector(".ks-sticky__body"))])).toEqual(POINTS);
  });

  it("gives each point its picture and alt, the pictures of points 3 and 4 swapped (CMO m3): Advik above the example, Ira above the transcript", () => {
    expect(all(asks, ".ks-sticky__point").map((li) => li.querySelector("img")?.getAttribute("alt"))).toEqual([
      "Kheelu, the cream plush rabbit from Kheelona, with rainbow-lined ears and a speaker in its tummy.",
      "Kheelu’s tummy unit up close, with its speaker, light ring and buttons.",
      "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window.",
      "A girl in a yellow printed frock drawing a dragon on a cotton dhurrie, with Kheelu beside her.",
      "The parent app showing one conversation word for word: Kheelu greets Aarav, and when he asks for Hindi, Kheelu answers in Hindi.",
      "A girl and her mother on a sofa in the evening lamp light, with Kheelu between them.",
    ]);
    // The stage repeats them for sighted readers on laptops, without words.
    expect(asks.querySelector(".ks-sticky__stage")?.getAttribute("aria-hidden")).toBe("true");
    expect(alts(asks.querySelector(".ks-sticky__stage")!)).toEqual(["", "", "", "", "", ""]);
  });

  it("labels the written example under point 3 above the exchange, word for word (AP-15)", () => {
    const example = all(asks, ".ks-sticky__point")[2].querySelector(".ks-sticky__example")!;
    expect(text(example.querySelector("p"))).toBe("Illustrative example, not a recording.");
    expect(all(example, "li").map((li) => text(li))).toEqual([
      "Your child “Why does the moon follow our car?”",
      "Kheelu “The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?”",
      "Your child “My shadow?”",
    ]);
  });

  it("ends on the line, not a heading, then home-asks with its price and trust lines, and the link to how it works", () => {
    const line = asks.querySelector(".ks-sticky__line")!;
    expect(line.tagName).toBe("P");
    expect(text(line)).toBe("Other AI gives answers. Kheelu asks questions.");
    expect(chilli(asks)).toEqual(["home-asks"]);
    expect(text(asks.querySelector(".ks-price"))).toBe(PRICE_LINE.token);
    expect(trustRow(asks)).toEqual(TRUST);
    const learn = asks.querySelector('[data-ph-capture-attribute-cta="home-asks-learn"]')!;
    expect(text(learn)).toBe("See how it works");
    expect(learn.getAttribute("href")).toBe("/products/kheelu#modes");
  });
});

describe("Home fold 6 · the expert clip (plan fold 6; D061 items 12-13, D064 item 8)", () => {
  const expert = fold("expert-title");

  it("is the clip's own fold from expert-video.ts, on the band, with no button, and never names Kheelu", () => {
    expect(expert.getAttribute("id")).toBe(expertFold.id);
    expect(expert.className).toBe("kh-section kh-section--band");
    expect(text(expert.querySelector(".kh-eyebrow"))).toBe("A video from an expert");
    expect(text(expert.querySelector("h2"))).toBe("Watching isn’t talking.");
    expect(text(expert.querySelector(".ks-clip__chip"))).toBe("0:34");
    expect(expert.querySelector("button")?.getAttribute("aria-label")).toBe("Play the video from an expert: Chaitra, therapist and developmental coach. 34 seconds.");
    expect(all(expert, "figcaption p").map((p) => text(p))).toEqual([expertClip.credit, expertClip.disclosure]);
    expect(text(expert)).not.toMatch(/Kheelu/);
    expect(chilli(expert)).toEqual([]);
  });
});

describe("Home fold 7 · what you get, and what you pay (plan fold 7; D065 items 3, 4 and 6; CMO M4, m8)", () => {
  const offer = fold("offer-title");

  /* The plan's lead as approved: the founder declined the CMO's "Kheelu is there every day at home…" (CMO-7), which task
     Q2.15 had built (D066 item 4; task Q2.17). */
  it("heads the card with the built h2 and the plan's lead, in the plan's words", () => {
    expect(offer.getAttribute("id")).toBe("offer");
    expect(text(offer.querySelector(".kh-eyebrow"))).toBe("Pre-order");
    expect(text(offer.querySelector("h2"))).toBe("What you get, and what you pay.");
    expect(text(offer.querySelector(".kh-heading__lead"))).toBe("There every day at home, with no screen to switch off.");
    expect(findBanned(text(offer.querySelector(".kh-heading__lead")))).toEqual([]);
  });

  it("prints the total, the split rows without GST, the first-500 line, the one perk list and the Kheelona+ note", () => {
    const card = offer.querySelector(".kh-offer")!;
    expect(text(card.querySelector(".kh-offer__price"))).toBe("₹4,999");
    expect(text(card.querySelector(".kh-offer__split"))).not.toMatch(/GST/);
    expect(text(card.querySelector(".ks-offer__later"))).toBe("₹4,999 for the first 500 units. ₹7,999 once they are gone.");
    expect(all(card, ".kh-offer__list li").map((li) => text(li))).toEqual([
      "Deliveries start mid-November. Pre-orders go out first, in the order they were placed.",
      "In the box: Kheelu plush toy, charger and quick-start card",
      "Delivery anywhere in India, included",
      "6 months of Kheelona+ included. Nothing renews without you.",
      "Made in India",
    ]);
    // The note in the card, after the perks and before the button, since task Q2.13 (OfferCard `note`; plan fold 7).
    const note = card.querySelector(":scope > .ks-offer__note");
    expect(text(note)).toBe(PLUS_NOTE);
    expect(note?.previousElementSibling?.className).toBe("kh-offer__list");
    expect(note?.nextElementSibling?.getAttribute("data-ph-capture-attribute-cta")).toBe("home-offer");
  });

  it.each(["token", "full"] as const)("prints the price once, in the card's price block: no short price line under its button (%s mode)", (mode) => {
    const card = (mode === "token" ? TOKEN : FULL).main.querySelector('section[aria-labelledby="offer-title"] .kh-offer')!;
    expect(card.querySelector(".kh-offer__fine")).toBeNull();
    expect(card.lastElementChild?.getAttribute("data-ph-capture-attribute-cta")).toBe("home-offer");
    expect(text(card)).not.toContain(PRICE_LINE[mode]);
  });

  it("puts home-offer on the card, the trust line and the card's third row under it, the share link last, and no help line", () => {
    expect(chilli(offer)).toEqual(["home-offer"]);
    expect(trustRow(offer)).toEqual([...TRUST, "6-month warranty", "UPI, card or net banking"]);
    // The built share link (D061 item 7; its message as approved: the main session's ruling (b)).
    expect(text(offer.querySelector('[data-ph-capture-attribute-cta="share-whatsapp"]'))).toBe("Know a parent who needs this? Share Kheelu on WhatsApp");
    expect(offer.querySelector(".ks-help")).toBeNull();
  });

  it("keeps the built board beside it, the Myra sticker its one cast child", () => {
    expect(offer.querySelector(".kh-art")?.getAttribute("aria-label")).toBe("A curious girl in a mustard flowered frock beside Kheelu, the cream plush rabbit");
    expect(all(offer, ".kh-art img").map((img) => img.getAttribute("src") ?? "").filter((src) => /Cast/.test(src))).toHaveLength(1);
  });
});

describe("Home fold 8 · safety you can check (plan fold 8; D064 item 2; D065 items 5 and 7; CMO M3)", () => {
  const safety = fold("safety-title");

  it("says five one-line promises beside the privacy screen, with their DS icons", () => {
    expect(text(safety.querySelector(".kh-eyebrow"))).toBe("Safety");
    expect(text(safety.querySelector("h2"))).toBe("Safety you can check.");
    expect(all(safety, ".kh-trust__item").map((li) => text(li))).toEqual([
      "It listens only after someone presses the wake-up button.",
      "No web browsing.",
      "You read every conversation in the parent app.",
      "We don’t sell your data.",
      "Each Kheelu has a daily limit on how long it talks.",
    ]);
    expect(safety.querySelector(".kh-trust__title")).toBeNull();
  });

  it("shows the real privacy screen with G26's alt and the app caption", () => {
    expect(alts(safety)).toEqual([
      "The parent app’s privacy centre: chats kept for 36 months, a switch to save voice recordings, buttons to download your child’s data and to delete all chats, and links to the privacy policy, terms and the grievance officer.",
    ]);
    expect(text(safety.querySelector("figcaption"))).toBe("The Kheelona app is live on Apple’s App Store and the Google Play Store.");
  });

  it("ends on safety with its price and trust lines, and the built link to /safety, “See how we built safety in”", () => {
    expect(chilli(safety)).toEqual(["safety"]);
    expect(text(safety.querySelector(".ks-price"))).toBe(PRICE_LINE.token);
    expect(trustRow(safety)).toEqual(TRUST);
    const link = safety.querySelector('[data-ph-capture-attribute-cta="safety-learn"]')!;
    expect(text(link)).toBe("See how we built safety in");
    expect(link.getAttribute("href")).toBe("/safety");
  });
});

describe("Home fold 9 · a day with Kheelu (plan fold 9; D065 item 5; D044)", () => {
  const day = fold("day-title");

  it("says the plan's heading, lead, five moments with their modes, and the closing line", () => {
    expect(text(day.querySelector(".kh-eyebrow"))).toBe("Little moments");
    expect(text(day.querySelector("h2"))).toBe("A day with Kheelu, sunrise to bedtime.");
    expect(text(day.querySelector(".kh-heading__lead"))).toBe("Not all day. A few moments, wherever the day goes.");
    expect(all(day, ".ks-day__moment").map((li) => [text(li.querySelector("h3")), text(li.querySelector(".ks-day__line")), text(li.querySelector(".kh-chip"))])).toEqual([
      ["Breakfast", "The first ‘why’ of the day. Kheelu answers, then asks one back.", "AI mode · home Wi‑Fi"],
      ["After school", "Yesterday’s question, picked up where your child stopped: Kheelu remembers earlier conversations.", "AI mode · home Wi‑Fi"],
      ["While you cook", "A question to think about, not a cartoon to watch.", "AI mode · home Wi‑Fi"],
      ["At Nani’s", "Stories, poems and jingles in Story mode, with no Wi‑Fi needed.", "Story mode · no Wi‑Fi needed"],
      ["Bedtime", "One last story, lights low.", "Story mode · no Wi‑Fi needed"],
    ]);
    expect(text(day.querySelector(".ks-day__closing"))).toBe(
      "Each Kheelu has a daily limit on how long it talks. In the parent app, you can see how long your child talked each day.",
    );
  });

  it("shows the real activity screen with its built alt and the caption, and no button", () => {
    expect(alts(day)).toEqual(["The parent app’s activity screen for today: 22 minutes of talking, 3 chats and 9 questions asked, with today’s chats listed."]);
    expect(text(day.querySelector("figcaption"))).toBe("The Kheelona app is live on Apple’s App Store and the Google Play Store.");
    expect(chilli(day)).toEqual([]);
  });

  it("never says games, rhymes or that a parent sets the limit", () => {
    expect(text(day)).not.toMatch(/\bgames?\b|\brhymes?\b|you set|set the limit|limit you set/i);
  });
});

describe("Home fold 10 · questions parents ask (plan fold 10; CMO m1, m2)", () => {
  const faq = fold("faq-title");
  const IDS = ["what-is-kheelu", "not-right-for-us", "price-and-advance", "screen-time-in-disguise", "think-less", "what-ages", "when-arrive", "same-as-lumi"] as const;

  it.each(["token", "full"] as const)("asks the eight in the plan's order, decision questions first (%s mode)", (mode) => {
    const offer = buildOffer(mode);
    const { main } = mode === "token" ? TOKEN : FULL;
    expect(all(fold("faq-title", main), "summary").map((s) => text(s))).toEqual(IDS.map((id) => toPlainText(faqs[id].question, offer)));
    expect(text(fold("faq-title", main).querySelector(".kh-eyebrow"))).toBe("Questions");
    expect(text(fold("faq-title", main).querySelector("h2"))).toBe("Questions parents ask.");
  });

  it("is the page's FAQPage, every answer on the page, and has no “See all questions” link", () => {
    for (const { html } of [TOKEN, FULL]) {
      const graphs = jsonLdBlocks(html) as { "@graph": { "@type": string; mainEntity: unknown[] }[] }[];
      expect(graphs).toHaveLength(1);
      expect(graphs[0]["@graph"].map((n) => n["@type"])).toEqual(["FAQPage"]);
      expect(graphs[0]["@graph"][0].mainEntity).toHaveLength(8);
      expect(jsonLdMismatches(html)).toEqual([]);
    }
    expect(faq.querySelector(".kh-btn--ghost")).toBeNull();
  });
});

describe("Home fold 11 · close (plan fold 11)", () => {
  const close = fold("close-title");

  it("says “It asks. They think.” with the built lead, then finale with its price and trust lines, and no help line", () => {
    expect(text(close.querySelector(".kh-eyebrow"))).toBe("Pre-order");
    expect(text(close.querySelector("h2"))).toBe("It asks. They think.");
    expect(all(close, "h2 .kh-hand").map((s) => s.textContent)).toEqual(["They think."]);
    expect(text(close.querySelector(".kh-heading__lead"))).toBe("For your own child, or as a gift for a 3 to 7 year old in the family.");
    expect(chilli(close)).toEqual(["finale"]);
    expect(text(close.querySelector(".ks-price"))).toBe(PRICE_LINE.token);
    expect(trustRow(close)).toEqual(TRUST);
    expect(close.querySelector(".ks-help")).toBeNull();
  });

  it("draws a board with no cast child: the sun shape, Kheelu's sticker and an ink heart that draws itself", () => {
    const board = close.querySelector(".kh-art")!;
    expect(board.getAttribute("aria-label")).toBe("Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.");
    const files = all(board, "img").map((img) => decodeURIComponent(img.getAttribute("src") ?? ""));
    // The DS shape loads inline (an SVG data address), named by its own title.
    expect(files.some((f) => /sun-sun|Cut-paper shape: sun sun/.test(f))).toBe(true);
    expect(files.some((f) => /kheelu-front-sticker/.test(f))).toBe(true);
    expect(files.some((f) => /Cast\//.test(f))).toBe(false);
    expect(all(board, "svg.ks-doodle[data-draw]")).toHaveLength(1);
  });
});

describe("Home: the selling rules on every fold (plan §1.1, §1.4, §1.5; D065 items 3 and 4; C1)", () => {
  it.each(["token", "full"] as const)("puts the short price line after every button but the offer card's, as its own block (C1; %s mode)", (mode) => {
    const { main } = mode === "token" ? TOKEN : FULL;
    for (const button of all(main, ".kh-btn--cta").filter((b) => !b.closest(".kh-offer"))) {
      const after = button.closest(".kh-section__actions")!.nextElementSibling!;
      const price = after.matches(".ks-price") ? after : after.querySelector(":scope > .ks-price");
      expect(price?.tagName, button.getAttribute("data-ph-capture-attribute-cta")!).toBe("P");
      expect(text(price)).toBe(PRICE_LINE[mode]);
    }
  });

  it("says no “incl. GST” anywhere, and the balance and “first 500” on the offer card only (D065 items 3-4)", () => {
    for (const { main } of [TOKEN, FULL]) {
      expect(text(main)).not.toMatch(/incl\. GST|GST invoice/);
      const outsideCard = main.cloneNode(true) as Element;
      outsideCard.querySelector(".kh-offer")?.remove();
      expect(text(outsideCard)).not.toMatch(/first 500|₹4,500/i);
    }
    // The card's two split rows: today and before delivery, the balance's one place (ruling 5).
    expect(all(fold("offer-title"), ".kh-offer__split span").map((s) => text(s))).toEqual(["Today, refundable", "Before delivery"]);
  });

  it("prints no phone number and no help line (the WhatsApp bubble replaces them, plan §1.1)", () => {
    expect(TOKEN.html).not.toMatch(/91875\s?46483|tel:/);
    expect(TOKEN.main.querySelector(".ks-help")).toBeNull();
  });

  it("passes the claims guard on every word the page prints, in both modes", () => {
    for (const { html } of [TOKEN, FULL]) {
      // A block element starts a line, as a browser's innerText reads it (C1: the price line is its own block).
      const hits = findBanned(htmlToText(html.replace(/<(p|ul|ol|li|div|figure)\b/g, "\n<$1")));
      expect(hits, hits.map((h) => `${h.id}: ${h.sentence}`).join("\n")).toEqual([]);
    }
  });

  it("names ages 3 to 7 only, and nothing under 3 but “under 3”", () => {
    expect(text(TOKEN.main)).not.toMatch(/\b[0-2]\s*(?:years?|yrs?|months? old)\b|toddler|bab(?:y|ies)/i);
  });

  it("shows each cast child at most once, and none beside the films or the parents' quotes (ruling 7)", () => {
    const srcs = all(TOKEN.main, "img").map((img) => decodeURIComponent(img.getAttribute("src") ?? ""));
    for (const child of ["kabir", "ira", "advik", "tara", "myra"]) {
      const folds = new Set(all(TOKEN.main, "img").filter((img) => new RegExp(`${child}-`).test(decodeURIComponent(img.getAttribute("src") ?? ""))).map((img) => img.closest("section")!.getAttribute("aria-labelledby")));
      expect(folds.size, child).toBeLessThanOrEqual(1);
    }
    // Kabir is the hero's photo alone (its crops are imported files, which the test's image stand-in drops: their alt
    // names him), and no other picture shows a boy in glasses.
    expect(all(TOKEN.main, 'img[alt^="A boy in glasses"]').map((img) => img.closest("section")!.getAttribute("aria-labelledby"))).toEqual(["hero-title", "hero-title"]);
    expect(srcs.some((src) => /kabir/.test(src))).toBe(false);
    expect(all(fold("films-title"), "img").some((img) => /Photo library|Cast\//.test(decodeURIComponent(img.getAttribute("src") ?? "")))).toBe(false);
  });

  it("never moves money on arrival: no price, chilli button, offer card or h1 inside a reveal", () => {
    expect(revealOnMoneyInDocument(TOKEN.doc)).toEqual([]);
  });

  it("loads every picture below the hero lazily (ruling 9)", () => {
    for (const img of all(TOKEN.main, "img").filter((i) => !i.closest('[aria-labelledby="hero-title"]'))) {
      expect(img.getAttribute("loading"), img.getAttribute("alt") ?? "").toBe("lazy");
    }
  });
});

describe("Home: full mode (ADR-005)", () => {
  it("prints the paid-in-full price line beside every button, no advance and no split, and the same folds", () => {
    const main = FULL.main;
    expect(all(main, ".ks-price").map((p) => text(p))).toEqual(Array(5).fill(PRICE_LINE.full));
    expect(main.querySelector(".kh-offer__split, .ks-offer__later")).toBeNull();
    expect(text(main)).not.toMatch(/₹499\b/);
  });
});

describe("Home: search and share metadata (plan §2, title, meta)", () => {
  it.each([
    ["token", "Kheelu by Kheelona: a screen-free AI toy for ages 3 to 7 that answers every why, then asks one back. ₹4,999 in total; reserve with a refundable ₹499."],
    ["full", "Kheelu by Kheelona: a screen-free AI toy for ages 3 to 7 that answers every why, then asks one back. ₹7,999 in total, delivered anywhere in India."],
  ] as const)("is the plan's title and %s-mode description, with no GST, and the Kheelu card", (mode, description) => {
    const offer = buildOffer(mode);
    expect(toPlainText(homePage.meta.title, offer)).toBe("Kheelu by Kheelona: a screen-free plush toy that talks");
    expect(toPlainText(homePage.meta.description, offer)).toBe(description);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(pageMeta({ ...homePage.meta, path: "/", offer }).alternates?.canonical).toBe("/");
    expect(homePage.meta.og).toEqual({ image: "/og/kheelu.jpg", alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy." });
  });
});

/* Home's rules for the parity passes since task Q2.9 (test/e2e/support/deviations.ts HOME_SELLING; tasks.md SPA 1 and 2):
 * fold by fold, one per deviation row. The text pass reads the browser's text at 390 px; here every line a fold lists is
 * held to the page it names: an excused line to the approved page (it is a real approved sentence), an accepted line to
 * the page as it renders (it is a real sentence of the build). Every fold of either page is hidden for the pixels on its
 * side, each selector finding exactly one fold. */
describe("Home: the parity rules of the selling update (deviations.ts HOME_SELLING)", () => {
  const APPROVED = mockupFold("home", "main");
  /** A page's sentences as the text pass splits them, every block a line of its own, eyebrows also in capitals. */
  const linesOf = (html: string) => {
    // htmlToText spaces every inline tag, so a source marker reads "brain. [1]" where a browser reads "brain.[1]".
    // Blocks start a line, and so do the labels and chips CSS sets on their own line, as a browser's innerText reads them.
    const blocks = html.replace(/<(span class="(?:kh-label-s|kh-chip)"[^>]*>[^<]*<\/span>)/g, "\n<$1\n").replace(/<(p|ul|ol|li|div|figure|figcaption|h[1-6])\b/g, "\n<$1");
    const text = htmlToText(blocks);
    const lines = sentences(text.replace(/[ \t]+(?=[.,;:!?)\]…]|\[\d+\])/g, ""));
    return new Set([...lines, ...lines.map((l) => l.toUpperCase())]);
  };
  const approvedLines = linesOf(APPROVED.outerHTML);
  const builtLines = linesOf(TOKEN.html);
  /** What the text pass reads: a closed FAQ answer is not in a browser's innerText. */
  const shown = TOKEN.doc.cloneNode(true) as Document;
  shown.querySelectorAll(".kh-faq__a").forEach((a) => a.remove());
  const shownLines = linesOf(shown.documentElement.outerHTML);
  const folds = Object.entries(HOME_SELLING as Readonly<Record<string, HomeSellingFold>>);

  it("lists the eleven folds of the build and the approved folds that left, each once, with its reason", () => {
    expect(folds.flatMap(([, f]) => (f.buildFold ? [f.buildFold] : []))).toEqual(LABELS);
    const approved = [...APPROVED.children].filter((el) => el.tagName === "SECTION").map((el) => el.getAttribute("aria-labelledby"));
    expect(folds.flatMap(([, f]) => f.mockupFolds).sort()).toEqual([...approved].sort());
    for (const [name, fold] of folds) expect(fold.reason.length, name).toBeGreaterThan(20);
  });

  it("excuses only approved sentences, and accepts only sentences the page prints", () => {
    for (const [name, fold] of folds) {
      for (const line of fold.mockup) expect(approvedLines.has(line) || approvedLines.has(line.toUpperCase()), `${name}: "${line}" is not an approved sentence`).toBe(true);
      for (const line of fold.build) expect(builtLines.has(line), `${name}: "${line}" is not a sentence of the page`).toBe(true);
    }
  });

  it("hides every fold of both pages for the pixels, each selector finding one fold on its side, and the footer's columns", () => {
    const rules = VISUAL_HIDDEN.home.filter((r) => r.approvedBy === HOME_SELLING_APPROVED);
    expect(rules).toEqual(HOME_SELLING_HIDDEN);
    const doc = { mockup: mockupFold("home", "html"), build: TOKEN.doc.documentElement };
    for (const rule of rules) expect(doc[rule.side].querySelectorAll(rule.selector), `${rule.side} ${rule.selector}`).toHaveLength(1);
    expect(rules.filter((r) => r.side === "mockup")).toHaveLength(10);
    expect(rules.filter((r) => r.side === "build")).toHaveLength(LABELS.length);
    // The footer's columns by the rule every page shares since task Q2.14 (V54, V64), no longer one of Home's own.
    expect(visualHidden("home")).toEqual(expect.arrayContaining([...FOOTER_COLS_HIDDEN]));
  });

  it("is a text rule a fold, before the claim fixes (which only the FAQ fix may follow)", () => {
    const rules = TEXT_DEVIATIONS.home;
    const at = rules.indexOf(HOME_SELLING_TEXT[0]);
    expect(at).toBeGreaterThan(-1);
    expect(rules.slice(at, at + HOME_SELLING_TEXT.length)).toEqual([...HOME_SELLING_TEXT]);
    expect(HOME_SELLING_TEXT).toHaveLength(folds.length);
    expect(rules.slice(at + HOME_SELLING_TEXT.length).map((r) => r.approvedBy)).toEqual([expect.stringMatching(/^deviations\.md V26 /), expect.stringMatching(/D061/)]);
  });

  it("excuses no line the page still prints, and every rule's words pass the claims guard", () => {
    for (const [name, fold] of folds) {
      for (const line of fold.mockup) expect(shownLines.has(line), `${name}: "${line}" is excused but the page prints it`).toBe(false);
      for (const line of fold.build) expect(findBanned(line), `${name}: ${line}`).toEqual([]);
    }
  });
});
