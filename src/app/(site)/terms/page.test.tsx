import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { legalTemplateCopy } from "@/content/en-IN/legal/shared";
import { termsPage } from "@/content/en-IN/legal/terms";
import type { Offer } from "@/content/types";
import { LegalTemplate } from "@/layouts/LegalTemplate/LegalTemplate";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { OFFER_REVALIDATE_SECONDS } from "@/lib/offer/get-offer";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { termsFixture } from "../../../../test/fixtures/legal/terms";
import { CLAIM_FIXES, COPY_FIXES, FOUNDER_ANSWERS, VISUAL_HIDDEN } from "../../../../test/e2e/support/deviations";
import { GRIEVANCE_NOTE, PAGE_FACTS } from "../../../../test/e2e/support/page-facts";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { mockupFold, skeleton, words, type SkeletonOptions } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";

/* The /terms route (task 5.12; structure §3.1, §5): the legal module through LegalTemplate's reference family with the
 * live offer, thin, and as a whole page equal to the approved mockup's <main> (mockup/terms.html, D046) in token mode, the
 * mode it shows: the same elements, classes, ids and addresses in order, the same words, the same heading outline. In full
 * mode the copy page's variants render instead (terms.md folds 2 and 4, sections 5 and 6). No pre-order button, no
 * tracking value and no buy bar (terms.md "CTA: None"; the mockup's meta says `"buybar": false`); no structured data
 * beyond the shell's (architecture §9.2: legal pages none). */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", async (importOriginal) => ({ ...(await importOriginal<object>()), getOffer }));

/* The first import of the route compiles the legal template and every block under it: load it once, under its own time
 * limit, so a busy machine cannot time out whichever test happens to import it first. */
beforeAll(async () => {
  await import("./page");
}, 60_000);

const SOURCE = readFileSync("src/app/(site)/terms/page.tsx", "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

const approvedMain = mockupFold("terms", "main");
/** The approved page with the founder's page facts applied (task 6.7; D055 items 7, 8, 10 and 11; page-facts.ts), and
 *  section 8's refund timing as /refund words it (task 7.1b; D056 item 4; deviations.ts COPY_FIXES.terms, V21); then
 *  D058's claim fixes in a pass of their own (task 8b.1; deviations.ts CLAIM_FIXES.terms, V33): Kheelona+, the mechanism
 *  in the live team's words, and the parent app's terms of the live /terms; then task Q2.17's founder answers in a pass
 *  of their own (D066 item 6; deviations.ts FOUNDER_ANSWERS.terms): section 12 without the pre-launch test; then D063
 *  items 2-3: the seller sentence without the GSTIN, the close's help line without the call (task Q2.3; seller-facts.ts). */
const mockupMain = withSellerFacts(
  withFacts(
    withFacts(withFacts(approvedMain, [...PAGE_FACTS.terms.edits, ...COPY_FIXES.terms.edits]), CLAIM_FIXES.terms.edits),
    FOUNDER_ANSWERS.terms.edits,
  ),
);

const TOKEN = buildOffer("token");
const FULL = buildOffer("full");

/** The page as the site shell holds it: the route's output inside <main>. */
async function renderPage(offer: Offer) {
  getOffer.mockResolvedValue(offer);
  const { default: TermsPage } = await import("./page");
  const element = (await TermsPage()) as ReactElement;
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(element)}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { html, doc, main: doc.querySelector("main")! };
}

/** What the build adds and the mockup does not carry, as the template's own parity test drops it (LegalTemplate.test.tsx):
 *  the generated type steps, the reference family's block modifiers and the grouped contents' modifier. */
const OPTIONS: SkeletonOptions = {
  drop: /^ks-(?:type-.+|list-reset|doc--reference|doc-summary--reference|doc-close--reference|toc--groups)$/,
  unwrap: "span[data-src]",
};

const outline = (root: Element) => Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) => `${h.tagName.toLowerCase()} ${words(h)}`);
const textOf = (el: Element | null) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

describe("/terms: the route file", () => {
  it("takes its metadata from the legal module through pageMeta, at its own path, with the live offer", async () => {
    const { generateMetadata } = await import("./page");
    for (const offer of [TOKEN, FULL]) {
      getOffer.mockResolvedValue(offer);
      expect(await generateMetadata()).toEqual(pageMeta({ ...termsPage.meta, path: "/terms", offer }));
    }
  });

  it("gives the head its canonical, a complete Open Graph card and a large Twitter card, worded as the copy page per mode (SPA 5)", async () => {
    const { generateMetadata } = await import("./page");
    const title = "Kheelu pre-order terms · Kheelona";
    const descriptions = [
      [TOKEN, "Kheelu pre-order terms: ₹4,999 (incl. GST), reserved with a refundable ₹499 advance. Paying, delivery, cancelling, returns and using Kheelu."],
      [FULL, "Kheelu pre-order terms: ₹7,999 (incl. GST), paid in full when you order. Paying, delivery, cancelling, returns and using Kheelu and its app."],
    ] as const;
    for (const [offer, description] of descriptions) {
      getOffer.mockResolvedValue(offer);
      const metadata = await generateMetadata();
      expect(metadata.title).toEqual({ absolute: title });
      expect(metadata.description).toBe(description);
      expect(metadata.alternates).toEqual({ canonical: "/terms" });
      expect(metadata.openGraph).toMatchObject({ type: "website", url: "/terms", title, description, siteName: "Kheelona", locale: "en_IN" });
      expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expect.any(String), width: 1200, height: 630, alt: expect.any(String) })]);
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title, description });
      expect("robots" in metadata).toBe(false);
    }
  });

  it("is thin: no copy, price or outside address typed in it, only its path and its family (structure §3.1)", () => {
    const body = code.replace(/^import [^;]*;$/gm, "");
    expect([...body.matchAll(/"([^"]*)"/g)].map((m) => m[1]).sort()).toEqual(["/terms", "reference"]);
    expect(body).not.toMatch(/₹|https?:|`/);
    expect(body).not.toMatch(/\bnotFound\b/);
  });

  /* The page names amounts and its words change with the mode, so it follows the live mode: the offer's window
   * (ADR-005; written as a literal because Next reads it statically). */
  it("revalidates on the offer's window, because it shows prices that change with the mode (ADR-005)", async () => {
    const mod = await import("./page");
    expect(mod.revalidate).toBe(OFFER_REVALIDATE_SECONDS);
    expect(code).toMatch(/export const revalidate = 300;/);
    const token = await renderPage(TOKEN);
    const fullMode = await renderPage(FULL);
    expect(fullMode.html).not.toBe(token.html);
  });
});

describe("/terms: the rendered page against the approved mockup (token mode, the mode it shows)", () => {
  it("renders the mockup's markup: the same elements, classes, ARIA, ids, addresses and order", async () => {
    const { main } = await renderPage(TOKEN);
    expect(skeleton(main, OPTIONS)).toBe(skeleton(mockupMain, OPTIONS));
  });

  it("prints every word of the mockup's <main> with the founder's facts, in order, and nothing else", async () => {
    const { main } = await renderPage(TOKEN);
    expect(words(main)).toBe(words(mockupMain));
  });

  it("is exactly what the template renders from the parity fixture copied from the mockup (test/fixtures/legal/terms.ts), with the founder's facts", async () => {
    const { main } = await renderPage(TOKEN);
    const fixture = renderToStaticMarkup(<LegalTemplate doc={termsFixture} variant="reference" copy={legalTemplateCopy} offer={TOKEN} />);
    const fixtureMain = new DOMParser().parseFromString(`<main>${fixture}</main>`, "text/html").querySelector("main")!;
    // The complaint-reference line is the template's (legal/shared.ts), so the fixture's render already lacks it.
    const documentFacts = PAGE_FACTS.terms.edits.filter((edit) => edit !== GRIEVANCE_NOTE);
    const earlier = withFacts(fixtureMain, [...documentFacts, ...COPY_FIXES.terms.edits], { built: true });
    // Then task 8b.1's claim fixes, then task Q2.17's founder answers (D066 item 6), each in a pass of its own.
    const claimed = withFacts(earlier, CLAIM_FIXES.terms.edits, { built: true });
    expect(main.innerHTML).toBe(withFacts(claimed, FOUNDER_ANSWERS.terms.edits, { built: true }).innerHTML);
  });

  it("is LegalTemplate's reference family (privacy and terms; mockup-css-mapping §6.1)", async () => {
    const { main } = await renderPage(TOKEN);
    expect(main.querySelector(".ks-doc.ks-doc--reference")).not.toBeNull();
    expect(main.querySelector(".ks-doc-summary--reference")).not.toBeNull();
    expect(main.querySelector(".ks-doc-close--reference")).not.toBeNull();
    expect(main.querySelector(".ks-doc--notice, .ks-draft--notice, .ks-doc-art")).toBeNull();
  });

  it("opens with the draft note, then the page's one h1, the approved headline with its Hand accent", async () => {
    const { main } = await renderPage(TOKEN);
    const hero = main.querySelector("section")!;
    expect(hero.getAttribute("aria-labelledby")).toBe("terms-title");
    expect(hero.querySelector(".ks-draft")?.textContent).toBe("Draft for the founder’s approval; not legal advice.");
    expect(hero.querySelector(".kh-eyebrow")?.textContent).toBe("Terms");
    const h1 = main.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].id).toBe("terms-title");
    expect(h1[0].textContent).toBe("Pre-order terms, in plain words.");
    expect(h1[0].querySelector(".kh-hand")?.textContent).toBe("plain words.");
    expect(textOf(hero.querySelector(".ks-updated"))).toBe("Last updated: 14 October 2026");
  });

  it("keeps the mockup's heading outline: every heading's level and words in order, no level skipped (SPA 5)", async () => {
    const { main } = await renderPage(TOKEN);
    const built = outline(main);
    expect(built).toEqual(outline(mockupMain));
    const levels = built.map((h) => Number(h[1]));
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => expect(level, built[i]).toBeLessThanOrEqual((levels[i - 1] ?? 0) + 1));
  });

  it("lists sixteen parts under three headings, and every in-page link reaches an element that exists", async () => {
    const { main } = await renderPage(TOKEN);
    expect([...main.querySelectorAll(".ks-toc__group")].map((h) => h.textContent)).toEqual(["Your pre-order", "Using Kheelu", "The legal part"]);
    expect([...main.querySelectorAll(".ks-doc__group")].map((p) => p.textContent)).toEqual([
      "Part one · Your pre-order",
      "Part two · Using Kheelu",
      "Part three · The legal part",
    ]);
    expect(main.querySelectorAll(".ks-toc a")).toHaveLength(16);
    for (const link of main.querySelectorAll('a[href^="#"]')) {
      const id = link.getAttribute("href")!.slice(1);
      expect(main.querySelector(`#${CSS.escape(id)}`), link.getAttribute("href")!).not.toBeNull();
    }
  });

  it("prints the seller and grievance cards from seller.ts, with no complaint-reference line (D032; D055 item 7)", async () => {
    const { main } = await renderPage(TOKEN);
    const cardEls = [...main.querySelectorAll("#contact .ks-doc__card")];
    const cards = cardEls.map(textOf);
    expect(cards).toHaveLength(3);
    expect(cards[0]).toMatch(/^Seller: Kheelona Robotics Private Limited, registered at /);
    expect(cards[1]).toBe("Customer care: WhatsApp or call +91 91875 46483, or email hello@kheelona.com.");
    // The D032 line alone, one paragraph: the complaint-reference note is off until a system issues a reference (D055 item 7).
    expect(cards[2]).toMatch(/^Grievance Officer: Aman Soni, Co-Founder and CTO, .*of receiving it\.$/);
    expect(cardEls[2].querySelectorAll("p")).toHaveLength(1);
  });

  it("has no pre-order button, no tracking value and no hero button; the phone buy bar is not placed on /terms", async () => {
    const { main } = await renderPage(TOKEN);
    expect(main.querySelectorAll(".kh-btn--cta")).toHaveLength(0);
    expect(main.querySelectorAll("[data-ph-capture-attribute-cta]")).toHaveLength(0);
    expect(main.querySelector("#hero-cta")).toBeNull();
    expect(stickyBarPaths()).not.toContain("/terms");
    expect(main.querySelector(".ks-doc-close .kh-btn--secondary")?.getAttribute("href")).toBe("/products/kheelu");
  });

  it("carries no structured data of its own (architecture §9.2: legal pages, none beyond the shell)", async () => {
    const { main } = await renderPage(TOKEN);
    expect(main.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });

  it("moves nothing and ships no mockup-only markup: no reveal, no drawing doodle, no mk- class, no data-src (SCA 6, SPA 9)", async () => {
    const { html, main } = await renderPage(TOKEN);
    expect(main.querySelector("[data-reveal], [data-draw], svg.ks-doodle")).toBeNull();
    expect(html).not.toMatch(/class="[^"]*\bmk-/);
    expect(html).not.toMatch(/\sdata-src=/);
  });
});

describe("/terms: full mode (terms.md folds 2 and 4, sections 5 and 6)", () => {
  it("prints the full-mode short version: the price paid in full, and cancelling before dispatch", async () => {
    const { main } = await renderPage(FULL);
    const points = [...main.querySelectorAll(".ks-short li")].map(textOf);
    expect(points).toHaveLength(8);
    expect(points[0]).toBe("What you pay. ₹7,999 (incl. GST), paid in full when you order.");
    expect(points[1]).toBe("Changed your mind before dispatch? Cancel any time before dispatch for a full refund, no reason needed. We start it within 2 working days.");
    const tokenPoints = [...(await renderPage(TOKEN)).main.querySelectorAll(".ks-short li")].map(textOf);
    expect(points.slice(2)).toEqual(tokenPoints.slice(2));
  });

  it("prints the full-mode price section: one paragraph in place of the first two, the rest unchanged", async () => {
    const { main } = await renderPage(FULL);
    const price = [...main.querySelectorAll("#price > p")].map(textOf);
    const tokenPrice = [...(await renderPage(TOKEN)).main.querySelectorAll("#price > p")].map(textOf);
    expect(price[0]).toBe("Kheelu costs ₹7,999 (incl. GST), paid in full when you order. There is no advance and no balance.");
    expect(price.slice(1)).toEqual(tokenPrice.slice(2));
  });

  it("leaves out the two balance paragraphs, and never prints an empty paragraph", async () => {
    const { main } = await renderPage(FULL);
    expect(textOf(main.querySelector("#payment"))).not.toMatch(/balance is paid by a payment link/);
    expect(textOf(main.querySelector("#cancel"))).not.toMatch(/If you don’t pay the balance/);
    expect(main.querySelectorAll("#payment > p")).toHaveLength(3);
    expect(main.querySelectorAll("#cancel > p")).toHaveLength(3);
    expect([...main.querySelectorAll("p, li")].filter((el) => textOf(el) === "")).toEqual([]);
  });

  it("names no advance, balance or launch amount and not the cap once the reservations close", async () => {
    const { main } = await renderPage(FULL);
    const text = textOf(main);
    for (const amount of [FULL.prices.token, FULL.prices.balance, TOKEN.prices.headline]) expect(text).not.toContain(amount);
    expect(text).not.toMatch(/first \d+ units/);
    expect(text).toContain(FULL.prices.full);
  });
});

describe("/terms: the founder's page facts for the pixels (task 6.7)", () => {
  it("finds each block the visual pass hides on the build side, once, on the page as it renders", async () => {
    const { main } = await renderPage(TOKEN);
    const selectors = VISUAL_HIDDEN.terms.filter((rule) => rule.side === "build").map((rule) => rule.selector);
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) expect(main.querySelectorAll(selector), selector).toHaveLength(1);
  });
});
