import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { refundPage } from "@/content/en-IN/legal/refund";
import type { Offer } from "@/content/types";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { mockupFold, skeleton, words, type SkeletonOptions } from "../../../../test/support/mockup-compare";

/* The /refund route (task 5.13; structure §3.1, §5): thin, rewritten in place. It loads the page's content module
 * (src/content/en-IN/legal/refund.ts) and the live offer (ADR-005: part 1 names the advance and the balance), describes
 * the page through pageMeta, and renders LegalTemplate in its `notice` family. As a whole page it is the approved
 * mockup's <main> (mockup/refund.html, D046): the same tags, classes, anchors, addresses and words; one h1; the
 * `#chargeback` paragraph; one tracked link (`refund-learn`) and no pre-order button; no sticky bar; nothing that
 * moves; no JSON-LD beyond the shell's (architecture §9.2: legal pages carry none). */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

/* The first import compiles the template and everything under it: once, under its own time limit. */
beforeAll(async () => {
  await import("./page");
}, 60_000);

const SOURCE = readFileSync("src/app/(site)/refund/page.tsx", "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
const mockupMain = mockupFold("refund", "main");

/** As LegalTemplate.test.tsx compares a legal page with its mockup (the build's own type steps and family modifiers
 *  dropped, the mockup's value markers unwrapped). */
const OPTIONS: SkeletonOptions = {
  drop: /^ks-(?:type-.+|list-reset|sticker--flush|draft--notice|doc--(?:reference|notice)|doc-summary--(?:reference|notice)|doc-close--(?:reference|notice)|toc--groups)$/,
  unwrap: "span[data-src]",
};

async function element(offer: Offer): Promise<ReactElement> {
  getOffer.mockResolvedValue(offer);
  const { default: RefundPage } = await import("./page");
  return (await RefundPage()) as ReactElement;
}

/** The page as the site shell holds it: the route's output inside <main>. */
async function renderPage(offer: Offer) {
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(await element(offer))}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { html, doc, main: doc.querySelector("main")! };
}

describe("/refund: the route file", () => {
  it("takes its metadata from the content module through pageMeta, at its own path", async () => {
    const mod = await import("./page");
    expect(mod.metadata).toEqual(pageMeta({ ...refundPage.meta, path: "/refund" }));
  });

  it("revalidates like every page that shows a price (part 1 names the advance and the balance; ADR-005)", async () => {
    expect((await import("./page")).revalidate).toBe(300);
    expect(code).toMatch(/^export const revalidate = 300;$/m);
  });

  it("gives the head its canonical, a complete Open Graph card and a large Twitter card, worded as the copy page (SPA 5)", async () => {
    const { metadata } = await import("./page");
    const title = "Kheelu returns, refunds and warranty · Kheelona";
    const description =
      "Kheelu refund policy: cancel before dispatch for a full refund, return it within 7 days of delivery, no questions asked, and a 6-month warranty.";
    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.description).toBe(description);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(metadata.alternates).toEqual({ canonical: "/refund" });
    expect(metadata.openGraph).toMatchObject({ type: "website", url: "/refund", title, description, siteName: "Kheelona", locale: "en_IN" });
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expect.any(String), width: 1200, height: 630, alt: expect.any(String) })]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title, description });
    expect(metadata.twitter?.images).toHaveLength(1);
    expect("robots" in metadata).toBe(false);
  });

  it("is thin and rewritten in place: no copy, price or address in it, only its path and its family (structure §3.1)", () => {
    const body = code.replace(/^import [^;]*;$/gm, "");
    expect([...body.matchAll(/"([^"]*)"/g)].map((m) => m[1]).sort()).toEqual(["/refund", "notice"]);
    expect(body).not.toMatch(/₹|https?:|mailto:|tel:|`/);
    expect(SOURCE).not.toMatch(/@\/components\/(atoms|molecules|organisms|templates)\/|@\/lib\/seo"|@\/lib\/legal"|@\/config\/site/);
    expect(body).not.toMatch(/\bnotFound\b/);
  });
});

describe("/refund: the rendered page against the approved mockup", () => {
  it("opens with the page's one h1, the recommended headline with its Hand accent", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const h1 = main.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe("Refunds, returns and warranty, in plain words.");
    expect(h1[0].querySelector(".kh-hand")?.textContent).toBe("plain words.");
  });

  it("keeps the mockup's heading outline: every heading's level and words in order, no level skipped (SPA 5)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const outline = (root: Element) => Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) => `${h.tagName.toLowerCase()} ${words(h)}`);
    const built = outline(main);
    expect(built).toEqual(outline(mockupMain));
    const levels = built.map((h) => Number(h[1]));
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => expect(level, built[i]).toBeLessThanOrEqual((levels[i - 1] ?? 0) + 1));
  });

  it("matches the mockup's markup: tags, classes, ARIA, ids and addresses", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(skeleton(main, OPTIONS)).toBe(skeleton(mockupMain, OPTIONS));
  });

  it("prints every word of the mockup's <main>, in order, and nothing else (token mode)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(words(main)).toBe(words(mockupMain));
  });

  it("renders in full mode too, every amount from the offer", async () => {
    const { main } = await renderPage(buildOffer("full"));
    expect(main.querySelector("h1")?.textContent).toBe("Refunds, returns and warranty, in plain words.");
    expect(main.textContent).not.toContain(buildOffer("full").prices.headline);
  });

  it("has the #chargeback paragraph in part 6, where the store page's payments line links (deviation V1)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(main.querySelectorAll("#chargeback")).toHaveLength(1);
    expect(main.querySelector("p#chargeback")?.closest("section")?.getAttribute("aria-labelledby")).toBe("payments");
  });

  it("tracks one link, Meet Kheelu (`refund-learn`), shows no pre-order button and no sticky bar (mockup meta buybar: false)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect([...main.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"))).toEqual([
      "refund-learn",
    ]);
    expect(main.querySelector("[data-ph-capture-attribute-cta]")?.getAttribute("href")).toBe("/products/kheelu");
    expect(main.querySelector(".kh-btn--cta")).toBeNull();
    expect(stickyBarPaths()).not.toContain("/refund");
  });

  it("carries no JSON-LD of its own (architecture §9.2: legal pages have none beyond the shell)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(main.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });

  it("reveals nothing, as the mockup reveals nothing, and never moves money (SPA 9)", async () => {
    const { doc, main } = await renderPage(buildOffer("token"));
    expect(mockupMain.querySelectorAll("[data-reveal]")).toHaveLength(0);
    expect(main.querySelectorAll("[data-reveal], [data-draw]")).toHaveLength(0);
    expect(revealOnMoneyInDocument(doc)).toEqual([]);
  });

  it("ships no mockup-only markup: no mk- class, no data-src, no review tool (SCA 6)", async () => {
    const { html } = await renderPage(buildOffer("token"));
    expect(html).not.toMatch(/class="[^"]*\bmk-/);
    expect(html).not.toMatch(/\sdata-src=/);
    expect(html).not.toMatch(/Headline <span|Pick a headline|Rewritten in the build/);
  });
});
