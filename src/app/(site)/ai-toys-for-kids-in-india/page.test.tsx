import { readFileSync } from "node:fs";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { aiToysPage } from "@/content/en-IN/pages/ai-toys-for-kids-in-india";
import type { Offer, OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { COPY_FIXES } from "../../../../test/e2e/support/deviations";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { words } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";

/* The /ai-toys-for-kids-in-india route (task 5.4; structure §3.1, §5): the buyer's guide module through PageTemplate with
 * the live offer, thin, and as a whole page equal to the approved mockup's <main> (mockup/ai-toys-for-kids-in-india.html,
 * D046): the same words fold by fold, the one chilli button (`finale`), reveals only where the mockup reveals and never
 * on money, and a FAQPage of exactly the five questions the page shows (architecture §9.2). Its description names the
 * price, so its metadata follows the live mode. */

const PATH = "/ai-toys-for-kids-in-india";

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

type GuideRoute = {
  default: () => Promise<ReactElement>;
  generateMetadata: () => Promise<Metadata>;
  revalidate: number;
};

/* The first import of the route compiles the page template and every section under it: load it once, under its own
 * time limit, so a busy machine cannot time out whichever test happens to import it first. */
beforeAll(async () => {
  await import("./page");
}, 60_000);

async function route(mode: OfferMode): Promise<GuideRoute> {
  getOffer.mockResolvedValue(buildOffer(mode));
  return (await import("./page")) as unknown as GuideRoute;
}

const SOURCE = readFileSync(`src/app/(site)${PATH}/page.tsx`, "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

const mockupDoc = new DOMParser().parseFromString(readRepoFile("mockup/ai-toys-for-kids-in-india.html"), "text/html");
/* The approved main with its copy fix applied: the age answer's "At 3" sentence in the site's one wording (CMO review A
 * M8; deviations.ts COPY_FIXES, V22). */
const mockupMain = withFacts(mockupDoc.querySelector("main")!, COPY_FIXES["ai-toys-for-kids-in-india"].edits);

/** The page as the site shell holds it: the route's output inside <main>. */
async function renderPage(offer: Offer) {
  getOffer.mockResolvedValue(offer);
  const { default: GuidePage } = (await import("./page")) as unknown as GuideRoute;
  const element = await GuidePage();
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

describe("/ai-toys-for-kids-in-india: the route file", () => {
  it("revalidates like every page that shows a price (the description, the FAQ, the close and the buy bar; ADR-005)", async () => {
    expect((await route("token")).revalidate).toBe(300);
    expect(code).toMatch(/^export const revalidate = 300;$/m);
  });

  it.each(["token", "full"] as const)("describes the page from its module through pageMeta, in the live mode (%s)", async (mode) => {
    const { generateMetadata } = await route(mode);
    expect(await generateMetadata()).toEqual(pageMeta({ ...aiToysPage.meta, path: PATH, offer: buildOffer(mode) }));
  });

  it.each([
    ["token", "AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7. ₹4,999 (incl. GST); reserve with a refundable ₹499."],
    ["full", "AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7. ₹7,999 (incl. GST), delivered anywhere in India."],
  ] as const)("gives the head its canonical, a complete Open Graph card and a large Twitter card, worded as the copy page (%s; SPA 5)", async (mode, description) => {
    const metadata = await (await route(mode)).generateMetadata();
    const title = "AI toys for kids in India: how to choose one · Kheelona";
    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.description).toBe(description);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(metadata.alternates).toEqual({ canonical: PATH });
    expect(metadata.openGraph).toMatchObject({ type: "website", url: PATH, title, description, siteName: "Kheelona", locale: "en_IN" });
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expect.any(String), width: 1200, height: 630, alt: expect.any(String) })]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title, description });
    expect(metadata.twitter?.images).toHaveLength(1);
    expect("robots" in metadata).toBe(false);
  });

  it.each(["token", "full"] as const)("renders the page module through PageTemplate with the live offer (%s)", async (mode) => {
    const { default: GuidePage } = await route(mode);
    expect(renderToStaticMarkup(await GuidePage())).toBe(renderToStaticMarkup(<PageTemplate page={aiToysPage} offer={buildOffer(mode)} path={PATH} />));
  });

  it("is thin: no copy, price or outside address typed in it, only its own path (structure §3.1)", () => {
    const body = code.replace(/^import [^;]*;$/gm, "");
    expect([...body.matchAll(/"([^"]*)"/g)].map((m) => m[1])).toEqual([PATH]);
    expect(body).not.toMatch(/₹|https?:|`/);
    expect(body).not.toMatch(/\bnotFound\b/);
  });
});

describe("/ai-toys-for-kids-in-india: the rendered page against the approved mockup", () => {
  it("opens with the page's one h1, the approved headline (option B)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const h1 = main.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe("AI toys for kids in India: five checks before you buy.");
    expect(h1[0].querySelector(".kh-hand")?.textContent).toBe("before you buy.");
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

  it("changes only the price answer and the price sentence in full mode (D028; the guide's copy, folds 5 and 6)", async () => {
    const token = await renderPage(buildOffer("token"));
    const full = await renderPage(buildOffer("full"));
    const offer = buildOffer("full");
    expect(full.main.querySelector("#close .ks-price")?.textContent).toBe(toPlainText(offer.sentence, offer));
    expect(full.main.querySelector("#close .ks-price")?.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
    const answers = (main: Element) => Array.from(main.querySelectorAll(".kh-faq__a")).map((a) => words(a));
    expect(answers(full.main).at(-1)).toBe(
      "Kheelu is ₹7,999 (incl. GST), paid in full when you order, with delivery anywhere in India included. You can pay by UPI, card or net banking, and you get a GST invoice. Deliveries start mid-November. If it isn’t right for your family, you can return it within 7 days of delivery, no questions asked.",
    );
    expect(answers(full.main).slice(0, -1)).toEqual(answers(token.main).slice(0, -1));
    const others = (main: Element) => {
      const copy = visible(main);
      copy.querySelectorAll(".ks-price").forEach((n) => n.remove());
      copy.querySelectorAll(".kh-faq__item:last-child .kh-faq__a").forEach((n) => n.remove());
      return words(copy);
    };
    expect(others(full.main)).toBe(others(token.main));
  });

  /* The phone buy bar hides only while a #hero-cta is on screen (StickyBuyBar.client.tsx), and this page has none, so the
   * bar shows from first paint, as the mockup's meta (`buybar: true`) and the copy page ask (SPA 6). */
  it("gives the phone bar no hero button to wait for, so it shows from first paint (mockup meta buybar: true)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(mockupDoc.querySelector("#hero-cta")).toBeNull();
    expect(main.querySelector("#hero-cta")).toBeNull();
    expect(main.querySelector('section[aria-labelledby="hero-title"] .kh-btn--cta')).toBeNull();
  });

  it("has one chilli button, the close's, tracked `finale`, and no other tracked link (architecture §8.3)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect([...main.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"))).toEqual(["finale"]);
    expect(main.querySelectorAll(".kh-btn--cta")).toHaveLength(1);
    expect(main.querySelector("#close .kh-btn--cta")?.textContent).toBe("Pre-order Kheelu");
  });

  it("links where the mockup links, read as the routes its pages became", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const internal = (root: Element) =>
      Array.from(root.querySelectorAll("a[href]"))
        .map((a) => a.getAttribute("href")!)
        .filter((h) => !/^(?:#|https?:|tel:)/.test(h));
    // The close's trust links open their part of the terms page (task 7.1a, CMO built-page review C, m8); the mockup
    // links the pages' tops.
    expect(internal(main)).toEqual([
      "/stories/what-to-look-for-in-a-safe-ai-toy",
      "/safety",
      "/products/kheelu",
      "/safety",
      "/shipping#when",
      "/refund#returns",
    ]);
    expect(internal(mockupMain).filter((h) => h !== "store.html")).toEqual([
      "story-what-to-look-for-in-a-safe-ai-toy.html",
      "safety.html",
      "meet-kheelu.html",
      "safety.html",
      "shipping.html",
      "refund.html",
    ]);
  });

  it("reveals exactly what the mockup reveals, and never the first fold, a price or the chilli button (SPA 9)", async () => {
    const { doc, main } = await renderPage(buildOffer("token"));
    expect(revealTargets(main)).toEqual(revealTargets(mockupMain));
    expect(revealOnMoneyInDocument(doc)).toEqual([]);
  });

  it("draws the doodle below the first screen only: the hero's question mark stays still, the close's star draws (D049)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(main.querySelector('section[aria-labelledby="hero-title"] [data-draw]')).toBeNull();
    expect(main.querySelectorAll("#close [data-draw]")).toHaveLength(1);
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

/** The page with its inline links unwrapped to their words. The shared detector reads HTML through `htmlToText`, which
 *  puts a space at every tag, inline ones included, so the tablet answer's source markers and the age answer's safety
 *  link read "until five. [1] [2] Kheelu" and "safety page ." where the page shows "five.[1][2] Kheelu" and "page.".
 *  Once the detector's `norm` drops a space before punctuation or a source marker (test/e2e/support/page-checks.ts,
 *  task 4.6 item 1), this goes and the test hands it `html` as it is. */
const linksUnwrapped = (html: string) => html.replace(/<\/?a\b[^>]*>/gi, "");

type FaqGraph = { "@graph": { "@type": string; mainEntity: { name: string; acceptedAnswer: { text: string } }[] }[] };

describe("/ai-toys-for-kids-in-india: its JSON-LD", () => {
  it("is one FAQPage: the five questions of fold 5, in the page's order, in both modes", async () => {
    for (const offer of [buildOffer("token"), buildOffer("full")]) {
      const { html, main } = await renderPage(offer);
      expect(main.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
      const [graph] = jsonLdBlocks(html) as FaqGraph[];
      expect(graph["@graph"].map((n) => n["@type"])).toEqual(["FAQPage"]);
      expect(graph["@graph"][0].mainEntity.map((q) => q.name)).toEqual([
        "What is an AI toy?",
        "Is an AI toy better than a tablet for a young child?",
        "What age is an AI toy for?",
        "Does Kheelu need Wi-Fi?",
        "How much is Kheelu?",
      ]);
    }
  });

  /* The page's visible text as a reader gets it: blocks apart, inline runs joined exactly (`words`, the one mockup
   * harness), so every question and its whole answer are checked word for word. */
  it("says in every question and answer exactly what the page shows (jsonld-matches-page's rule), in both modes", async () => {
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
      expect(jsonLdMismatches(linksUnwrapped(html)), mode).toEqual([]);
    }
  });
});
