import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { shippingPage } from "@/content/en-IN/legal/shipping";
import { routeFor } from "@/content/en-IN/routes";
import type { Offer } from "@/content/types";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { PAGE_FACTS } from "../../../../test/e2e/support/page-facts";
import { skeleton, words, type SkeletonOptions } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";

/* The /shipping route (task 5.14; structure §3.1, §5): the legal module through LegalTemplate's notice family (refund
 * and shipping; mockup-css-mapping §6.1) with the live offer, thin, and as a whole page equal to the approved mockup's
 * <main> (mockup/shipping.html, D046): the same elements, classes, ids and addresses in order, the same words, the same
 * heading outline. The close's Meet Kheelu link carries `shipping-learn` (architecture §8.3); no pre-order button and no
 * buy bar (shipping.md: "CTA: no Pre-order Kheelu button in the page body"; the mockup's meta says `"buybar": false`);
 * no structured data beyond the shell's (architecture §9.2: legal pages none). */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

/* The first import of the route compiles the legal template and every block under it: load it once, under its own time
 * limit, so a busy machine cannot time out whichever test happens to import it first. */
beforeAll(async () => {
  await import("./page");
}, 60_000);

const SOURCE = readFileSync("src/app/(site)/shipping/page.tsx", "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

const mockupDoc = new DOMParser().parseFromString(readRepoFile("mockup/shipping.html"), "text/html");
const approvedMain = mockupDoc.querySelector("main")!;
/** The approved page with the founder's page facts applied (task 6.7; D055 items 7-9; test/e2e/support/page-facts.ts). */
const mockupMain = withFacts(approvedMain, PAGE_FACTS.shipping.edits);

/** The page as the site shell holds it: the route's output inside <main>. */
async function renderPage(offer: Offer) {
  getOffer.mockResolvedValue(offer);
  const { default: ShippingPage } = await import("./page");
  const element = (await ShippingPage()) as ReactElement;
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(element)}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { html, doc, main: doc.querySelector("main")! };
}

/** What the build adds and the mockup does not carry, as the template's own parity test drops it (LegalTemplate.test.tsx):
 *  the generated type steps, TrustList's list reset, the paragraph sticker's margin class, the notice family's block
 *  modifiers; the mockup's value markers (`span[data-src]` around an amount or the delivery line) are its own. */
const OPTIONS: SkeletonOptions = {
  drop: /^ks-(?:type-.+|list-reset|sticker--flush|draft--notice|doc--notice|doc-summary--notice|doc-close--notice)$/,
  unwrap: "span[data-src]",
};

const outline = (root: Element) => Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) => `${h.tagName.toLowerCase()} ${words(h)}`);

describe("/shipping: the route file", () => {
  it("takes its metadata from the legal module through pageMeta, at its own path", async () => {
    const mod = await import("./page");
    expect(mod.metadata).toEqual(pageMeta({ ...shippingPage.meta, path: "/shipping" }));
  });

  it("gives the head its canonical, a complete Open Graph card and a large Twitter card, worded as the copy page (SPA 5)", async () => {
    const { metadata } = await import("./page");
    const title = "Kheelu shipping and delivery in India · Kheelona";
    const description =
      "Kheelu delivery and shipping in India: deliveries start mid-November, delivery is included anywhere in India, and you get tracking at dispatch.";
    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.description).toBe(description);
    expect(metadata.alternates).toEqual({ canonical: "/shipping" });
    expect(metadata.openGraph).toMatchObject({ type: "website", url: "/shipping", title, description, siteName: "Kheelona", locale: "en_IN" });
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expect.any(String), width: 1200, height: 630, alt: expect.any(String) })]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title, description });
    expect("robots" in metadata).toBe(false);
  });

  it("is thin: no copy, price or outside address typed in it, only its path and its family (structure §3.1)", () => {
    const body = code.replace(/^import [^;]*;$/gm, "");
    expect([...body.matchAll(/"([^"]*)"/g)].map((m) => m[1]).sort()).toEqual(["/shipping", "notice"]);
    expect(body).not.toMatch(/₹|https?:|`/);
    expect(body).not.toMatch(/\bnotFound\b/);
  });

  /* The short version and the balance section name the advance, the balance and the total, so the page follows the live
   * offer mode within the 300 s window every page that shows a price keeps (ADR-005, architecture §7). */
  it("names amounts from the live offer, so it revalidates like every page that shows a price (ADR-005)", async () => {
    expect((await import("./page")).revalidate).toBe(300);
    const { main } = await renderPage(buildOffer("token"));
    const offer = buildOffer("token");
    expect(words(main)).toContain(`Reserved with the refundable ${offer.prices.token}?`);
    expect(words(main)).toContain(`the remaining ${offer.prices.balance} of the ${offer.prices.headline} price (incl. GST)`);
  });

  it("is a route of the URL plan served by its own legal module (routes.ts)", () => {
    expect(routeFor("/shipping")).toMatchObject({ kind: "legal", module: "legal/shipping" });
    expect(SOURCE).toMatch(/from "@\/content\/en-IN\/legal\/shipping"/);
    expect(SOURCE).toMatch(/from "@\/content\/en-IN\/legal\/shared"/);
  });
});

describe("/shipping: the rendered page against the approved mockup", () => {
  it("renders the mockup's markup: the same elements, classes, ARIA, ids, addresses and order", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(skeleton(main, OPTIONS)).toBe(skeleton(mockupMain, OPTIONS));
  });

  it("prints every word of the mockup's <main> with the founder's facts, in order, and nothing else", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(words(main)).toBe(words(mockupMain));
  });

  it("is LegalTemplate's notice family (refund and shipping; mockup-css-mapping §6.1)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(main.querySelector(".ks-doc.ks-doc--notice")).not.toBeNull();
    expect(main.querySelector(".ks-doc-summary--notice")).not.toBeNull();
    expect(main.querySelector(".ks-doc-close--notice .kh-card.kh-tone-sun")).not.toBeNull();
    expect(main.querySelector(".ks-draft.ks-draft--notice > svg.kh-icon + span")).not.toBeNull();
    expect(main.querySelector(".ks-hero .kh-art.ks-doc-art")).not.toBeNull();
    expect(main.querySelector(".ks-doc--reference, .ks-doc-summary--reference, .ks-doc-close--reference, .ks-doc-hero")).toBeNull();
  });

  it("opens with the draft note, then the page's one h1, the approved headline with its Hand accent", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const hero = main.querySelector("section")!;
    expect(hero.getAttribute("aria-labelledby")).toBe("shipping-title");
    expect(hero.querySelector(".ks-draft")?.textContent).toBe("Draft for the founder’s approval; not legal advice.");
    const h1 = main.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].id).toBe("shipping-title");
    expect(h1[0].textContent).toBe("Shipping and delivery, in plain words.");
    expect(h1[0].querySelector(".kh-hand")?.textContent).toBe("plain words.");
    expect(hero.querySelector(".ks-updated")?.textContent).toBe("Last updated: 14 October 2026");
  });

  it("keeps the mockup's heading outline: every heading's level and words in order, no level skipped (SPA 5)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const built = outline(main);
    expect(built).toEqual(outline(mockupMain));
    const levels = built.map((h) => Number(h[1]));
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => expect(level, built[i]).toBeLessThanOrEqual((levels[i - 1] ?? 0) + 1));
  });

  it("links every contents row to its part, and every in-page link to an element that exists", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const rows = [...main.querySelectorAll(".ks-toc a")].map((a) => a.getAttribute("href")!);
    expect(rows).toEqual(["#when", "#where", "#balance", "#tracking", "#address", "#problems", "#seller"]);
    for (const href of main.querySelectorAll('a[href^="#"]')) {
      const id = href.getAttribute("href")!.slice(1);
      expect(main.querySelector(`#${CSS.escape(id)}`), href.getAttribute("href")!).not.toBeNull();
    }
  });

  it("sends every link on the page to a route of the URL plan or to the seller's own contacts", async () => {
    const { main } = await renderPage(buildOffer("token"));
    for (const a of main.querySelectorAll("a[href]")) {
      const href = a.getAttribute("href")!;
      if (href.startsWith("#")) continue;
      if (href.startsWith("/")) expect(routeFor(href.split("#")[0]), href).toBeDefined();
      else expect(href, href).toMatch(/^(?:https:\/\/wa\.me\/|tel:|mailto:)/);
    }
  });

  it("prints the delivery line from the offer, as the mockup's delivery markers do (D023)", async () => {
    const offer = buildOffer("token");
    const { main } = await renderPage(offer);
    const marked = [...mockupMain.querySelectorAll('[data-src="DELIVERY_TEXT"]')];
    expect(marked).toHaveLength(2);
    expect(main.querySelector(".kh-trust__title")?.textContent).toBe(`${offer.delivery}.`);
    expect(main.querySelector("#when + p")?.textContent?.startsWith(`${offer.delivery}.`)).toBe(true);
  });

  it("keeps the seller line's phrases together and the grievance card's role whole (task 4.3; shipping.html:114, 118)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const seller = main.querySelector("#seller")!.closest("section")!;
    const kept = [...seller.querySelectorAll("span.ks-nowrap")].map((s) => s.textContent);
    expect(kept).toEqual(["No 51", "(Old Site No 1)", "Bengaluru 560041", "Co-Founder"]);
    expect([...seller.querySelectorAll("a.ks-nowrap")].map((a) => a.getAttribute("href"))).toEqual(["tel:+919187546483", "tel:+919187546483"]);
  });

  it("closes with the Meet Kheelu link carrying shipping-learn and a ghost link to the refund page; no pre-order button; no buy bar on /shipping", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const close = main.querySelector(".ks-doc-close")!;
    const secondary = close.querySelector("a.kh-btn--secondary")!;
    expect(secondary.getAttribute("href")).toBe("/products/kheelu");
    expect(secondary.getAttribute("data-ph-capture-attribute-cta")).toBe("shipping-learn");
    expect(close.querySelector("a.kh-btn--ghost")?.getAttribute("href")).toBe("/refund");
    expect([...main.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"))).toEqual([
      "shipping-learn",
    ]);
    expect(main.querySelectorAll(".kh-btn--cta")).toHaveLength(0);
    expect(main.querySelector("#hero-cta")).toBeNull();
    expect(stickyBarPaths()).not.toContain("/shipping");
  });

  it("carries no structured data of its own (architecture §9.2: legal pages, none beyond the shell)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(main.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });

  it("moves nothing and ships no mockup-only markup: a still hero, no reveal, no drawing doodle, no mk- class, no data-src (SCA 6, SPA 9)", async () => {
    const { html, main } = await renderPage(buildOffer("token"));
    expect(main.querySelector("[data-reveal], [data-draw], svg.ks-doodle")).toBeNull();
    expect(html).not.toMatch(/class="[^"]*\bmk-/);
    expect(html).not.toMatch(/\sdata-src=/);
    expect(html).not.toMatch(/Headline <span|Pick a headline|Rewritten in the build/);
  });

  it("renders in full mode too, every amount from the offer and the delivery line unchanged", async () => {
    const offer = buildOffer("full");
    const { main } = await renderPage(offer);
    expect(words(main)).toContain(`Reserved with the refundable ${offer.prices.token}?`);
    expect(main.querySelector(".kh-trust__title")?.textContent).toBe(`${offer.delivery}.`);
  });
});
