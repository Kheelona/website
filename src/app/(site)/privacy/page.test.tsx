import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { privacyPage } from "@/content/en-IN/legal/privacy";
import type { Offer } from "@/content/types";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { PRIVACY_B11_BUILD } from "../../../../test/e2e/support/deviations";
import { PAGE_FACTS } from "../../../../test/e2e/support/page-facts";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { skeleton, words, type SkeletonOptions } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";

/* The /privacy route (task 5.11; structure §3.1, §5): the legal module through LegalTemplate's reference family with the
 * live offer, thin, and as a whole page equal to the approved mockup's <main> (mockup/privacy.html, D046): the same
 * elements, classes, ids and addresses in order, the same words, the same heading outline. No pre-order button, no
 * tracking value and no buy bar (privacy.md "CTA: None"; the mockup's meta says `"buybar": false`); no structured data
 * beyond the shell's (architecture §9.2: legal pages none). The mockup is compared with the founder's page facts applied
 * (task 6.7; D055 items 7, 8 and 12-24, D054 item 12; test/e2e/support/page-facts.ts): each placeholder filled in his
 * words or ruled off, and nothing else changed. */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

/* The first import of the route compiles the legal template and every block under it: load it once, under its own time
 * limit, so a busy machine cannot time out whichever test happens to import it first. */
beforeAll(async () => {
  await import("./page");
}, 60_000);

const SOURCE = readFileSync("src/app/(site)/privacy/page.tsx", "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

const mockupDoc = new DOMParser().parseFromString(readRepoFile("mockup/privacy.html"), "text/html");
const approvedMain = mockupDoc.querySelector("main")!;
/** The approved page with the founder's page facts applied: what the build must print (task 6.7). */
const mockupMain = withFacts(approvedMain, PAGE_FACTS.privacy.edits);

/** The approved Google Analytics sentence V10 replaces, and the PostHog sentence V10's new one follows. */
const GA4_APPROVED = "Counts visits and the steps of a pre-order: starting the form, opening and closing the payment window, paying, and saving your address.";
const POSTHOG_LEAD =
  "Records which buttons and links you tap, and a replay of your screen as you move through the site, so we can find the places where the pre-order form confuses people.";

/** The page as the site shell holds it: the route's output inside <main>. */
async function renderPage(offer: Offer) {
  getOffer.mockResolvedValue(offer);
  const { default: PrivacyPage } = await import("./page");
  const element = (await PrivacyPage()) as ReactElement;
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(element)}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { html, doc, main: doc.querySelector("main")! };
}

/** What the build adds and the mockup does not carry, as the template's own parity test drops it (LegalTemplate.test.tsx):
 *  the generated type steps, TrustList's list reset, and the reference family's block modifiers. */
const OPTIONS: SkeletonOptions = {
  drop: /^ks-(?:type-.+|list-reset|doc--reference|doc-summary--reference|doc-close--reference)$/,
  unwrap: "span[data-src]",
};

const outline = (root: Element) => Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) => `${h.tagName.toLowerCase()} ${words(h)}`);

describe("/privacy: the route file", () => {
  it("takes its metadata from the legal module through pageMeta, at its own path", async () => {
    const mod = await import("./page");
    expect(mod.metadata).toEqual(pageMeta({ ...privacyPage.meta, path: "/privacy" }));
  });

  it("gives the head its canonical, a complete Open Graph card and a large Twitter card, worded as the copy page (SPA 5)", async () => {
    const { metadata } = await import("./page");
    const title = "Kheelona privacy policy, in plain words";
    const description =
      "How Kheelona handles your data and your child’s: what we collect, every tool we use, 36 months for conversations, and how to opt out or delete.";
    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.description).toBe(description);
    expect(metadata.alternates).toEqual({ canonical: "/privacy" });
    expect(metadata.openGraph).toMatchObject({ type: "website", url: "/privacy", title, description, siteName: "Kheelona", locale: "en_IN" });
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expect.any(String), width: 1200, height: 630, alt: expect.any(String) })]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title, description });
    expect("robots" in metadata).toBe(false);
  });

  it("is thin: no copy, price or outside address typed in it, only its path and its family (structure §3.1)", () => {
    const body = code.replace(/^import [^;]*;$/gm, "");
    expect([...body.matchAll(/"([^"]*)"/g)].map((m) => m[1]).sort()).toEqual(["/privacy", "reference"]);
    expect(body).not.toMatch(/₹|https?:|`/);
    expect(body).not.toMatch(/\bnotFound\b/);
  });

  /* The page shows no price, so it needs no revalidation of its own: the (site) layout's 300 s window covers the drawer's
   * price sentence (ADR-005). The proof is that the page reads the same in both modes. */
  it("names no amount: the page is the same in both offer modes, so it sets no revalidate of its own", async () => {
    const token = await renderPage(buildOffer("token"));
    const fullMode = await renderPage(buildOffer("full"));
    expect(fullMode.html).toBe(token.html);
    expect("revalidate" in (await import("./page"))).toBe(false);
  });
});

describe("/privacy: the rendered page against the approved mockup", () => {
  it("renders the mockup's markup: the same elements, classes, ARIA, ids, addresses and order", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(skeleton(main, OPTIONS)).toBe(skeleton(mockupMain, OPTIONS));
  });

  it("differs from the approved page only by the founder's page facts, every placeholder among them", () => {
    expect(words(mockupMain)).not.toBe(words(approvedMain));
    expect(approvedMain.querySelectorAll(".mk-placeholder").length).toBeGreaterThan(30);
    expect(mockupMain.querySelectorAll(".mk-placeholder")).toHaveLength(0);
  });

  it("prints every word of the mockup's <main> with the founder's facts, in order, and nothing else, V10's two sentences aside", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const approved = words(mockupMain);
    // The B11 events in the founder's words (D054 item 10; deviations.md V10), present in the mockup to be replaced.
    const [ga4, posthog] = PRIVACY_B11_BUILD;
    expect(approved).toContain(GA4_APPROVED);
    expect(approved).toContain(POSTHOG_LEAD);
    expect(words(main)).toBe(approved.replace(GA4_APPROVED, ga4).replace(POSTHOG_LEAD, `${POSTHOG_LEAD} ${posthog}`));
  });

  it("is LegalTemplate's reference family (privacy and terms; mockup-css-mapping §6.1)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(main.querySelector(".ks-doc.ks-doc--reference")).not.toBeNull();
    expect(main.querySelector(".ks-doc-summary--reference")).not.toBeNull();
    expect(main.querySelector(".ks-doc-close--reference")).not.toBeNull();
    expect(main.querySelector(".ks-doc--notice, .ks-draft--notice, .ks-doc-art")).toBeNull();
  });

  it("opens with the draft note, then the page's one h1, the approved headline with its Hand accent", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const hero = main.querySelector("section")!;
    expect(hero.getAttribute("aria-labelledby")).toBe("privacy-title");
    expect(hero.querySelector(".ks-draft")?.textContent).toBe("Draft for the founder’s approval; not legal advice.");
    const h1 = main.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].id).toBe("privacy-title");
    expect(h1[0].textContent).toBe("Privacy, in plain words.");
    expect(h1[0].querySelector(".kh-hand")?.textContent).toBe("plain words.");
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
    expect(rows).toHaveLength(14);
    for (const href of main.querySelectorAll('a[href^="#"]')) {
      const id = href.getAttribute("href")!.slice(1);
      expect(main.querySelector(`#${CSS.escape(id)}`), href.getAttribute("href")!).not.toBeNull();
    }
  });

  it("has no pre-order button, no tracking value and no hero button; the phone buy bar is not placed on /privacy", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(main.querySelectorAll(".kh-btn--cta")).toHaveLength(0);
    expect(main.querySelectorAll("[data-ph-capture-attribute-cta]")).toHaveLength(0);
    expect(main.querySelector("#hero-cta")).toBeNull();
    expect(stickyBarPaths()).not.toContain("/privacy");
    expect(main.querySelector(".ks-doc-close .kh-btn--secondary")?.getAttribute("href")).toBe("/products/kheelu");
  });

  it("carries no structured data of its own (architecture §9.2: legal pages, none beyond the shell)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(main.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });

  it("moves nothing and ships no mockup-only markup: no reveal, no drawing doodle, no mk- class, no data-src (SCA 6, SPA 9)", async () => {
    const { html, main } = await renderPage(buildOffer("token"));
    expect(main.querySelector("[data-reveal], [data-draw], svg.ks-doodle")).toBeNull();
    expect(html).not.toMatch(/class="[^"]*\bmk-/);
    expect(html).not.toMatch(/\sdata-src=/);
    expect(html).not.toMatch(/Headline <span|Pick a headline|Rewritten in the build/);
  });
});
