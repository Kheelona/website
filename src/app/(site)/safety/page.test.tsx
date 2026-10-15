import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { safetyPage } from "@/content/en-IN/pages/safety";
import type { Offer } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import {
  CLAIM_FIXES,
  COPY_FIXES,
  PRICE_LINE,
  SAFETY_SELLING,
  SAFETY_SELLING_LAYOUT_HIDDEN,
  VISUAL_HIDDEN,
} from "../../../../test/e2e/support/deviations";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { sentences } from "../../../../test/e2e/support/parity";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { parseMockup, words } from "../../../../test/support/mockup-compare";
import { blockSentences, withFacts } from "../../../../test/support/mockup-facts";

/* The /safety route (task 5.3; structure §3.1, §5): the page module through PageTemplate with the live offer, thin, and
 * as a whole page equal to the approved mockup's <main> (mockup/safety.html, D046): the same words fold by fold, the
 * one chilli button (`finale`), reveals only where the mockup reveals and never on money, and a FAQPage of exactly the
 * questions the page shows: fold 2's four facts, then the two FAQ answers (wave-4 close; architecture §9.2). The approved
 * page is the mockup with task 7.1b's copy fixes applied (deviation V19; test/e2e/support/deviations.ts COPY_FIXES.safety):
 * the age-3 advice in one wording (CMO review A M8) and the open answer's pointer to the next question (A M4). */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

/* The first import of the route compiles the page template and every section under it: load it once, under its own
 * time limit, so a busy machine cannot time out whichever test happens to import it first. */
beforeAll(async () => {
  await import("./page");
}, 60_000);

const SOURCE = readFileSync("src/app/(site)/safety/page.tsx", "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

/* Through the mockup comparison harness, so the close's price line and trust line read as task Q2.8 rules them (D065
 * item 3; the harness's withPriceLine). */
const mockupDoc = parseMockup("safety");
const frozenMain = mockupDoc.querySelector("main")!;
/* Task 7.1b's copy fixes (V19), then task 8b.1's claim fixes (V28; D058) in a pass of their own, then task Q2.11's
   selling update (the D2C plan v2 §4; deviations.ts SAFETY_SELLING), then D063 item 2: the close's help line without the
   call (task Q2.3; seller-facts.ts). */
const mockupMain = withSellerFacts(
  withFacts(withFacts(withFacts(frozenMain, COPY_FIXES.safety.edits), CLAIM_FIXES.safety.edits), SAFETY_SELLING.edits),
);

/** The page as the site shell holds it: the route's output inside <main>. */
async function renderPage(offer: Offer) {
  getOffer.mockResolvedValue(offer);
  const { default: SafetyPage } = await import("./page");
  const element = (await SafetyPage()) as ReactElement;
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(element)}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { html, doc, main: doc.querySelector("main")! };
}

/** <main> without its JSON-LD and React's image preload links: the visible page. */
function visible(main: Element): Element {
  const copy = main.cloneNode(true) as Element;
  copy.querySelectorAll('script, link[rel="preload"]').forEach((n) => n.remove());
  return copy;
}

/** The folds of <main>, by the heading that names each, in order. */
const foldNames = (main: Element) =>
  Array.from(main.querySelectorAll("section[aria-labelledby]")).map((el) => el.getAttribute("aria-labelledby"));

/** A reveal target as compared with the mockup's: its tag and DS (kh-) classes. */
const revealTargets = (root: Element) =>
  Array.from(root.querySelectorAll("[data-reveal]")).map(
    (el) => `${el.tagName.toLowerCase()}${[...el.classList].filter((c) => c.startsWith("kh-")).sort().map((c) => `.${c}`).join("")}`,
  );

describe("/safety: the route file", () => {
  it("takes its metadata from the page module through pageMeta, at its own path", async () => {
    const mod = await import("./page");
    expect(mod.metadata).toEqual(pageMeta({ ...safetyPage.meta, path: "/safety" }));
  });

  it("revalidates like every page that shows a price (the close and the buy bar show one; ADR-005)", async () => {
    expect((await import("./page")).revalidate).toBe(300);
    expect(code).toMatch(/^export const revalidate = 300;$/m);
  });

  it("gives the head its canonical, a complete Open Graph card and a large Twitter card, worded as the copy page (SPA 5)", async () => {
    const { metadata } = await import("./page");
    const title = "Are AI toys safe? How Kheelu works · Kheelona";
    const description =
      "Are AI toys safe? Check Kheelu: its mic turns on only when someone presses its button, no camera, no internet browsing, and you read every conversation.";
    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.description).toBe(description);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(metadata.alternates).toEqual({ canonical: "/safety" });
    expect(metadata.openGraph).toMatchObject({ type: "website", url: "/safety", title, description, siteName: "Kheelona", locale: "en_IN" });
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expect.any(String), width: 1200, height: 630, alt: expect.any(String) })]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title, description });
    expect(metadata.twitter?.images).toHaveLength(1);
    expect("robots" in metadata).toBe(false);
  });

  it("is thin: no copy, price or outside address typed in it, only its own path (structure §3.1)", () => {
    const body = code.replace(/^import [^;]*;$/gm, "");
    expect([...body.matchAll(/"([^"]*)"/g)].map((m) => m[1])).toEqual(["/safety"]);
    expect(body).not.toMatch(/₹|https?:|`/);
    expect(body).not.toMatch(/\bnotFound\b/);
  });
});

describe("/safety: the rendered page against the approved mockup", () => {
  it("opens with the page's one h1, the approved headline", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const h1 = main.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe("Are AI toys safe? Check ours, fact by fact.");
    expect(h1[0].querySelector(".kh-hand")?.textContent).toBe("fact by fact.");
  });

  it("keeps the mockup's heading outline: every heading's level and words in order, no level skipped (SPA 5)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const outline = (root: Element) =>
      Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) => `${h.tagName.toLowerCase()} ${words(h)}`);
    const built = outline(main);
    expect(built).toEqual(outline(mockupMain));
    const levels = built.map((h) => Number(h[1]));
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => expect(level, built[i]).toBeLessThanOrEqual((levels[i - 1] ?? 0) + 1));
  });

  it("holds the mockup's folds in its order", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(foldNames(main)).toEqual(foldNames(mockupMain));
  });

  it("prints every word of the mockup's <main>, in order, and nothing else (token mode)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(words(visible(main))).toBe(words(mockupMain));
  });

  it("differs from the frozen mockup only in the lines task 7.1b (V19), task 8b.1 (V28), task Q2.11 and D063 (Q2.3) changed, and the fold Q2.11 adds", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const fold = (root: Element, name: string) => root.querySelector(`section[aria-labelledby="${name}"]`)!;
    const changed = foldNames(frozenMain).filter((name) => words(fold(frozenMain, name!)) !== words(fold(mockupMain, name!)));
    /* The close: its help line without the call (D063 item 2). */
    expect(changed).toEqual(["facts-title", "never-title", "controls-title", "kept-title", "faq-title", "close-title"]);
    expect(foldNames(main).filter((name) => !foldNames(frozenMain).includes(name))).toEqual(["app-title"]);
    const faq = words(fold(main, "faq-title"));
    for (const line of COPY_FIXES.safety.build) expect(faq).toContain(line);
    for (const line of COPY_FIXES.safety.mockup) expect(faq).not.toContain(line);
    /* Task 8b.1's lines, but the two Q2.11 replaces (G26's deletion line; the single-chat sentence off). */
    const page = words(visible(main));
    for (const line of CLAIM_FIXES.safety.build.filter((l) => !SAFETY_SELLING.mockup.some((gone) => l.includes(gone)))) {
      expect(page).toContain(line);
    }
    for (const line of SAFETY_SELLING.build) expect(page).toContain(line);
    for (const line of SAFETY_SELLING.mockup) expect(page).not.toContain(line);
  });

  /* Build condition C1 (the D2C plan v2 §1.1; CMO review C1): after every button the price line is its own block, a <p>
     after the button's row, never a span in the button or joined to its label (joined with a space, the label and the
     price line read as "Pre-order Kheelu ₹499 today, refundable." and fire the guard's part-price-button). */
  it("puts the price line after each button as its own paragraph, never inside or beside the label (C1)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const buttons = Array.from(main.querySelectorAll<HTMLElement>(".kh-btn--cta"));
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button.textContent).toBe("Pre-order Kheelu");
      expect(button.querySelector(".ks-price")).toBeNull();
      const row = button.parentElement!;
      expect(row.matches(".kh-section__actions")).toBe(true);
      const after = row.nextElementSibling!;
      const price = after.matches("p.ks-price") ? after : after.querySelector(":scope > p.ks-price");
      expect(price?.tagName).toBe("P");
      expect(price?.textContent).toBe(PRICE_LINE.sentence.build);
    }
  });

  /* "No duplicate line on the page" (task Q2.11): what moved here from the product page repeats nothing the page says. A
     sentence shows twice only where every button carries it (its label, the price line, the trust line: one each beside
     the two buttons); and two the page had as built, which the plan keeps: "It can’t browse or search the web.", fold 3's
     body that task 8b.1 also wrote into fold 7's closed "Replies" answer (faqs.ts, child-safety-groups), and "No.", how
     the first and fourth facts each open their answer. */
  it("says no sentence twice, but the lines beside each button and two the built page already repeated", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const lines = blockSentences(visible(main));
    const twice = [...new Set(lines.filter((line, i) => lines.indexOf(line) !== i))];
    const beside = ["Pre-order Kheelu", ...sentences(PRICE_LINE.sentence.build), PRICE_LINE.returns.build, PRICE_LINE.delivery];
    expect(twice.sort()).toEqual([...beside, "It can’t browse or search the web.", "No."].sort());
    for (const line of twice) expect(lines.filter((l) => l === line), line).toHaveLength(2);
  });

  it("never says “incl. GST” or the balance, in either mode (D065 item 3: GST and the breakdown only at checkout)", async () => {
    for (const mode of ["token", "full"] as const) {
      const { html, main } = await renderPage(buildOffer(mode));
      expect(html, mode).not.toMatch(/incl\. GST|GST/);
      expect(main.textContent, mode).not.toMatch(/₹4,500|before delivery/);
    }
  });

  it("finds each block the visual pass hides on the build side, once, on the page as it renders: the open answer (V19), the claim fixes' blocks (V28), the selling update's (Q2.11)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const selectors = (VISUAL_HIDDEN.safety ?? []).filter((rule) => rule.side === "build").map((rule) => rule.selector);
    expect(selectors).toEqual([
      ...COPY_FIXES.safety.hidden.both,
      ...CLAIM_FIXES.safety.hidden.both,
      ...CLAIM_FIXES.safety.hidden.build,
      ...SAFETY_SELLING.hidden.both,
      ...SAFETY_SELLING.hidden.build,
      ...SAFETY_SELLING_LAYOUT_HIDDEN.filter((rule) => rule.side === "build").map((rule) => rule.selector),
    ]);
    for (const selector of selectors) expect(main.querySelectorAll(selector), selector).toHaveLength(1);
    expect(words(main.querySelector(selectors[0])!)).toContain(COPY_FIXES.safety.build[0]);
  });

  it("changes only the price sentence in full mode (D028; safety copy, fold 8)", async () => {
    const token = await renderPage(buildOffer("token"));
    const full = await renderPage(buildOffer("full"));
    const sentence = (offer: Offer) => toPlainText(offer.priceLine, offer);
    expect(full.main.querySelector("#close .ks-price")?.textContent).toBe(sentence(buildOffer("full")));
    expect(full.main.querySelector("#close .ks-price")?.textContent).toBe("₹7,999 in total, paid in full when you order.");
    const others = (main: Element) => {
      const copy = visible(main);
      copy.querySelectorAll(".ks-price").forEach((n) => n.remove());
      return words(copy);
    };
    expect(others(full.main)).toBe(others(token.main));
  });

  /* Wave-2 close: the /safety FeatureSplit shows its one privacy screen through AppScreens variant="safety" (the plain
   * DS frame, 272 px then 300 from 900 px; safety.html:87-93), never Home's or the product page's rows of shots. */
  it("shows the parent controls' one privacy screen as AppScreens `safety`: the plain DS phone, no rows of shots", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const fold = main.querySelector('section[aria-labelledby="controls-title"]')!;
    const shots = fold.querySelectorAll("figure.ks-shots");
    expect(shots).toHaveLength(1);
    expect([...shots[0].classList]).toEqual(expect.arrayContaining(["ks-shots", "ks-shots--safety"]));
    expect(shots[0].querySelectorAll(".ks-shots__row, .ks-shot")).toHaveLength(0);
    const screens = shots[0].querySelectorAll(".kh-device img");
    expect(screens).toHaveLength(1);
    expect(screens[0].getAttribute("sizes")).toBe("(min-width: 900px) 300px, 272px");
  });

  /* Task Q2.11 (the D2C plan v2 §4 fold 4): the product page's two screens move here as that page showed them, side by
   * side in AppScreens `product` (two phones in a row), with the caption under them; the controls keep their one phone. */
  it("shows every conversation's two screens side by side (AppScreens `product`) with the app's caption, before the controls", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const fold = main.querySelector('section[aria-labelledby="app-title"]')!;
    expect(fold.classList.contains("kh-section--band")).toBe(true);
    const shots = fold.querySelectorAll("figure.ks-shots");
    expect(shots).toHaveLength(1);
    expect([...shots[0].classList]).toEqual(expect.arrayContaining(["ks-shots", "ks-shots--product"]));
    expect(shots[0].querySelectorAll(".ks-shots__row .kh-device img")).toHaveLength(2);
    expect(shots[0].querySelector("figcaption")?.textContent).toBe("The Kheelona app is live on Apple’s App Store and the Google Play Store.");
    expect(foldNames(main).indexOf("app-title")).toBe(foldNames(main).indexOf("controls-title") - 1);
    expect(main.querySelectorAll("figcaption.kh-caption")).toHaveLength(1);
  });

  /* The phone buy bar hides only while a #hero-cta is on screen (StickyBuyBar.client.tsx), and this page has none, so the
   * bar shows from first paint, as the mockup's meta (`buybar: true`) and the copy page ask (SPA 6). */
  it("gives the phone bar no hero button to wait for, so it shows from first paint (mockup meta buybar: true)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(mockupDoc.querySelector("#hero-cta")).toBeNull();
    expect(main.querySelector("#hero-cta")).toBeNull();
    expect(main.querySelector('section[aria-labelledby="hero-title"] .kh-btn--cta')).toBeNull();
  });

  /* The plan v2 §4 and §11: `safety-facts` after the four facts (registered by the selling update's tracking task), then
     the close's `finale`; no other tracked link (the controls' link to the product page's app fold is gone). */
  it("has two chilli buttons, after the four facts (`safety-facts`) and in the close (`finale`), and no other tracked link", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect([...main.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"))).toEqual([
      "safety-facts",
      "finale",
    ]);
    expect(main.querySelectorAll(".kh-btn--cta")).toHaveLength(2);
    expect(main.querySelector('#facts .kh-btn--cta[data-ph-capture-attribute-cta="safety-facts"]')?.textContent).toBe("Pre-order Kheelu");
    expect(main.querySelector("#close .kh-btn--cta")?.textContent).toBe("Pre-order Kheelu");
    expect(main.querySelector('a[href="/products/kheelu#app"]')).toBeNull();
  });

  it("reveals exactly what the mockup reveals, and never the first fold, a price or the chilli button (SPA 9)", async () => {
    const { doc, main } = await renderPage(buildOffer("token"));
    expect(revealTargets(main)).toEqual(revealTargets(mockupMain));
    expect(revealOnMoneyInDocument(doc)).toEqual([]);
  });

  it("ships no mockup-only markup: no mk- class, no data-src, no review tool (SCA 6)", async () => {
    const { html } = await renderPage(buildOffer("token"));
    expect(html).not.toMatch(/class="[^"]*\bmk-/);
    expect(html).not.toMatch(/\sdata-src=/);
    expect(html).not.toMatch(/Headline <span|Pick a headline|Rewritten in the build/);
  });
});

/** Text as jsonld-matches-page compares it: typographic quotes plain, spaces collapsed, case folded. */
const comparable = (s: string) =>
  s
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();


type FaqGraph = { "@graph": { "@type": string; mainEntity: { name: string; acceptedAnswer: { text: string } }[] }[] };

describe("/safety: its JSON-LD", () => {
  it("is one FAQPage: fold 2's four facts in the founder's order, then the two FAQ answers", async () => {
    for (const offer of [buildOffer("token"), buildOffer("full")]) {
      const { html, main } = await renderPage(offer);
      expect(main.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
      const [graph] = jsonLdBlocks(html) as FaqGraph[];
      expect(graph["@graph"].map((n) => n["@type"])).toEqual(["FAQPage"]);
      expect(graph["@graph"][0].mainEntity.map((q) => q.name)).toEqual([
        "Is Kheelu always listening?",
        "How does Kheelu understand and answer my child?",
        "Can I read every conversation?",
        "Do you sell my child’s data?",
        "Is Kheelu OK for a 3-year-old?",
        "What do child-safety groups say about AI toys?",
      ]);
    }
  });

  /* The page's visible text as a reader gets it: blocks apart, inline runs joined exactly (`words`, the one mockup
   * harness), so every question and its whole answer, detail list included, are checked word for word. */
  it("says in every answer, question and fact exactly what the page shows (jsonld-matches-page's rule), in both modes", async () => {
    for (const offer of [buildOffer("token"), buildOffer("full")]) {
      const { html, main } = await renderPage(offer);
      const text = comparable(words(visible(main)));
      const [graph] = jsonLdBlocks(html) as FaqGraph[];
      for (const q of graph["@graph"][0].mainEntity) {
        expect(text, q.name).toContain(comparable(q.name));
        expect(text, q.name).toContain(comparable(q.acceptedAnswer.text));
      }
    }
  });

  it("leaves the shared detector (jsonld-matches-page) nothing to report, in both modes", async () => {
    for (const mode of ["token", "full"] as const) {
      const { html } = await renderPage(buildOffer(mode));
      expect(jsonLdMismatches(html), mode).toEqual([]);
    }
  });
});
