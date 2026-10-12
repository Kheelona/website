import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { safetyPage } from "@/content/en-IN/pages/safety";
import type { Offer } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { words } from "../../../../test/support/mockup-compare";

/* The /safety route (task 5.3; structure §3.1, §5): the page module through PageTemplate with the live offer, thin, and
 * as a whole page equal to the approved mockup's <main> (mockup/safety.html, D046): the same words fold by fold, the
 * one chilli button (`finale`), reveals only where the mockup reveals and never on money, and a FAQPage of exactly the
 * questions the page shows: fold 2's four facts, then the two FAQ answers (wave-4 close; architecture §9.2). */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

const SOURCE = readFileSync("src/app/(site)/safety/page.tsx", "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

const mockupDoc = new DOMParser().parseFromString(readRepoFile("mockup/safety.html"), "text/html");
const mockupMain = mockupDoc.querySelector("main")!;

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

  it("changes only the price sentence in full mode (D028; safety copy, fold 8)", async () => {
    const token = await renderPage(buildOffer("token"));
    const full = await renderPage(buildOffer("full"));
    const sentence = (offer: Offer) => toPlainText(offer.sentence, offer);
    expect(full.main.querySelector("#close .ks-price")?.textContent).toBe(sentence(buildOffer("full")));
    expect(full.main.querySelector("#close .ks-price")?.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
    const others = (main: Element) => {
      const copy = visible(main);
      copy.querySelectorAll(".ks-price").forEach((n) => n.remove());
      return words(copy);
    };
    expect(others(full.main)).toBe(others(token.main));
  });

  it("has one chilli button, the close's, tracked `finale`, and no other tracked link", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect([...main.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"))).toEqual(["finale"]);
    expect(main.querySelectorAll(".kh-btn--cta")).toHaveLength(1);
    expect(main.querySelector("#close .kh-btn--cta")?.textContent).toBe("Pre-order Kheelu");
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
   * harness). The shared detector (`jsonLdMismatches`, test/e2e/support/page-checks.ts) reads the HTML through
   * `htmlToText`, which puts a space at every tag, inline ones included, so it reads "aged 6 to 12. [1] We" and "top of
   * this page ." where the page shows "aged 6 to 12.[1] We" and "top of this page."; it reports the groups answer, whose
   * marker and #facts link the approved copy carries (reported to the main session, task 5.3). */
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

  it("leaves the shared detector nothing to report but the groups answer's marker and link spacing (reported)", async () => {
    const { html } = await renderPage(buildOffer("token"));
    const problems = jsonLdMismatches(html);
    expect(problems.every((p) => p.startsWith("FAQ answer not visible: \"In January 2026, Common Sense Media"))).toBe(true);
  });
});
