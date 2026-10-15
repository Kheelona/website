import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { contactPage } from "@/content/en-IN/pages/contact";
import type { Offer } from "@/content/types";
import { SiteShell } from "@/layouts/SiteShell/SiteShell";
import { stickyBarPaths } from "@/layouts/SiteShell/sticky-bar-paths";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { mockupRoute, parseMockup, skeleton, words } from "../../../../test/support/mockup-compare";

/* The /contact route (task 5.9; structure §3.1, §5): the page module through PageTemplate with the live offer, thin,
 * rewritten in place, and as a whole page equal to the approved mockup's <main> (mockup/contact.html, D046): the same
 * folds, tags, classes, anchors, addresses and words; the `#grievance` fold the footer and the hero lead link to; the
 * seller lines character for character as the site's own footer prints them; three secondary contact buttons and one
 * chilli button (`finale`); no reveal (the mockup has none); and the ContactPage node the live page had (architecture
 * §9.2), pointing at the Organization. */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));
vi.mock("next/navigation", () => ({ usePathname: () => "/contact" }));

/* The first import of the route compiles the page template and every section under it: load it once, under its own
 * time limit, so a busy machine cannot time out whichever test happens to import it first. */
beforeAll(async () => {
  await import("./page");
}, 60_000);

const SOURCE = readFileSync("src/app/(site)/contact/page.tsx", "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

/* Through the mockup comparison harness, so the close's price line and trust line read as task Q2.8 rules them (D065
 * item 3; the harness's withPriceLine). */
const mockupDoc = parseMockup("contact");
/** The approved main as D063 item 3 rules it (task Q2.3; seller-facts.ts): the seller card without its GSTIN line; the
 *  number stays on /contact (the E-Commerce Rules). */
const mockupMain = withSellerFacts(mockupDoc.querySelector("main")!);

async function element(offer: Offer): Promise<ReactElement> {
  getOffer.mockResolvedValue(offer);
  const { default: ContactPage } = await import("./page");
  return (await ContactPage()) as ReactElement;
}

/** The page as the site shell holds it: the route's output inside <main>. */
async function renderPage(offer: Offer) {
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(await element(offer))}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { html, doc, main: doc.querySelector("main")! };
}

/** <main> without its JSON-LD: the visible page. */
function visible(main: Element): Element {
  const copy = main.cloneNode(true) as Element;
  copy.querySelectorAll("script").forEach((n) => n.remove());
  return copy;
}

/** Grid items of the approved layout, each on its own line on screen though the markup runs them together: the three
 *  ways (contact.css:4, `.mk-contact-ways`) and the seller lines (contact.css:28, `.mk-seller address`). The mockup's
 *  source puts a line break between them, React none, so both sides read them apart. */
const GRID_ITEMS = "#hero-cta > a, address > *";

/** The visible words, blocks and grid items apart (the one harness's `words`). */
function pageWords(el: Element): string {
  const copy = el.cloneNode(true) as Element;
  for (const item of copy.querySelectorAll(GRID_ITEMS)) {
    item.before(" ");
    item.after(" ");
  }
  return words(copy);
}

/** The folds of <main>, by the heading that names each, in order. */
const foldNames = (main: Element) => Array.from(main.querySelectorAll("section[aria-labelledby]")).map((el) => el.getAttribute("aria-labelledby"));

describe("/contact: the route file", () => {
  it("takes its metadata from the page module through pageMeta, at its own path", async () => {
    const mod = await import("./page");
    expect(mod.metadata).toEqual(pageMeta({ ...contactPage.meta, path: "/contact" }));
  });

  it("revalidates like every page that shows a price (the close and the buy bar show one; ADR-005)", async () => {
    expect((await import("./page")).revalidate).toBe(300);
    expect(code).toMatch(/^export const revalidate = 300;$/m);
  });

  it("gives the head its canonical, a complete Open Graph card and a large Twitter card, worded as the copy page (SPA 5)", async () => {
    const { metadata } = await import("./page");
    const title = "Contact Kheelona: WhatsApp, call or email the team";
    const description =
      "Contact Kheelona: WhatsApp or call +91 91875 46483, or email hello@kheelona.com. We are a small team in Bengaluru and answer our own messages.";
    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.description).toBe(description);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(metadata.alternates).toEqual({ canonical: "/contact" });
    expect(metadata.openGraph).toMatchObject({ type: "website", url: "/contact", title, description, siteName: "Kheelona", locale: "en_IN" });
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expect.any(String), width: 1200, height: 630, alt: expect.any(String) })]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title, description });
    expect(metadata.twitter?.images).toHaveLength(1);
    expect("robots" in metadata).toBe(false);
  });

  it("is thin and rewritten in place: no copy, price, address or legacy import in it, only its own path (structure §3.1)", () => {
    const body = code.replace(/^import [^;]*;$/gm, "");
    expect([...body.matchAll(/"([^"]*)"/g)].map((m) => m[1])).toEqual(["/contact"]);
    expect(body).not.toMatch(/₹|https?:|mailto:|tel:|`/);
    expect(SOURCE).not.toMatch(/@\/components\/(atoms|molecules|organisms|templates)\/|@\/lib\/seo"|@\/config\/site/);
    expect(body).not.toMatch(/\bnotFound\b/);
  });
});

describe("/contact: the rendered page against the approved mockup", () => {
  it("opens with the page's one h1, the approved headline (option A)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const h1 = main.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe("Talk to the team behind Kheelu.");
    expect(h1[0].querySelector(".kh-hand")?.textContent).toBe("behind Kheelu.");
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

  it("holds the mockup's folds in its order, each with the mockup's id and band", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(foldNames(main)).toEqual(foldNames(mockupMain));
    const shape = (root: Element) =>
      Array.from(root.querySelectorAll("section[aria-labelledby]")).map((s) => `${s.id || "-"} ${s.classList.contains("kh-section--band") ? "band" : "plain"}`);
    expect(shape(main)).toEqual(shape(mockupMain));
  });

  /* The whole <main> as tags, DS and composition classes, ARIA, ids and addresses (the one mockup harness: a mockup
   * block takes its ks- name, a mockup page file its route). What the build adds on purpose and the components' own
   * tests already pin is dropped on both sides: the hero layout's modifier (its lead-link weight), the card links' tap
   * target (G-01), the CTA block's two hooks, and the buttons' inner spans and icons (each component's markup test
   * covers them); the mockup's value markers (data-src spans) are review-tool markup that never ships (N22). */
  it("matches the mockup's markup fold by fold: tags, classes, ARIA, ids and addresses", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const options = {
      drop: /^(ks-hero--contact|ks-card__link--tap|ks-cta__button|ks-trustline--center)$/,
      skip: "svg",
      unwrap: ".kh-btn > span, [data-src]",
    };
    expect(skeleton(visible(main), options)).toBe(skeleton(mockupMain, options));
  });

  it("prints every word of the mockup's <main>, in order, and nothing else (token mode)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(pageWords(visible(main))).toBe(pageWords(mockupMain));
  });

  it("changes only the price sentence in full mode (D028; contact copy, fold 5)", async () => {
    const token = await renderPage(buildOffer("token"));
    const full = await renderPage(buildOffer("full"));
    expect(full.main.querySelector("#close .ks-price")?.textContent).toBe(toPlainText(buildOffer("full").priceLine, buildOffer("full")));
    expect(full.main.querySelector("#close .ks-price")?.textContent).toBe("₹7,999 in total, paid in full when you order.");
    const others = (main: Element) => {
      const copy = visible(main);
      copy.querySelectorAll(".ks-price").forEach((n) => n.remove());
      return pageWords(copy);
    };
    expect(others(full.main)).toBe(others(token.main));
  });

  it("is the #grievance fold the footer's link and the hero lead's link land on", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const target = main.querySelector("section#grievance");
    expect(target?.getAttribute("aria-labelledby")).toBe("grievance-title");
    expect(target?.querySelector(".kh-card")?.textContent).toMatch(/^Grievance Officer: Aman Soni, Co-Founder and CTO, /);
    const lead = main.querySelector("#hero-title ~ .kh-heading__lead a, .kh-heading--hero .kh-heading__lead a");
    expect(lead?.getAttribute("href")).toBe("#grievance");
    expect(main.querySelectorAll("#grievance")).toHaveLength(1);
  });

  /* The phone buy bar waits while #hero-cta is on screen (StickyBuyBar.client.tsx), so it never covers the WhatsApp
   * button at load (contact.html fold 1, mockup meta buybar: true; the bar's own spec is chrome.spec.ts). */
  it("offers the three ways as secondary block buttons in #hero-cta, never chilli or the app's blue (copy page, fold 1)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const ways = Array.from(main.querySelectorAll("#hero-cta > a"));
    expect(ways.map((a) => [words(a), a.getAttribute("href")])).toEqual(
      Array.from(mockupMain.querySelectorAll("#hero-cta > a")).map((a) => [words(a), mockupRoute(a.getAttribute("href")!)]),
    );
    for (const a of ways) {
      expect(a.classList.contains("kh-btn--secondary") && a.classList.contains("kh-btn--block"), words(a)).toBe(true);
      expect(a.matches(".kh-btn--cta, .kh-btn--primary"), words(a)).toBe(false);
      expect(a.hasAttribute("data-ph-capture-attribute-cta"), words(a)).toBe(false);
    }
    expect(stickyBarPaths()).toContain("/contact");
  });

  it("has one chilli button, the close's, tracked `finale`, and no other tracked link (tracking inventory line 198)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect([...main.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"))).toEqual(["finale"]);
    expect(main.querySelectorAll(".kh-btn--cta")).toHaveLength(1);
    expect(main.querySelector("#close .kh-btn--cta")?.textContent).toBe("Pre-order Kheelu");
    expect(main.querySelector("#close .ks-help")).toBeNull();
  });

  /* The selling update's close (task Q2.12; the D2C plan v2 §9, with build condition C1): as built by tasks Q2.3 and Q2.8,
     checked here as the plan words it. "Ready when you are.", the button, the short price line in a block of its own
     after it, the trust line led by the one risk-reversal line, the ghost link; no help line, no GSTIN anywhere. */
  it("closes as the plan's §9: the button, the price line in a <p> after it, the risk-reversal line first, no help line", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const close = main.querySelector("#close")!;
    expect(close.querySelector("#close-title")?.textContent).toBe("Ready when you are.");
    const button = close.querySelector(".kh-btn--cta")!;
    const price = close.querySelector(".ks-price")!;
    expect(price.tagName).toBe("P");
    expect(button.contains(price)).toBe(false);
    expect(button.compareDocumentPosition(price) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(price.textContent).toBe("₹499 today, refundable. ₹4,999 in total.");
    expect([...close.querySelectorAll(".ks-trust li")].map((li) => li.textContent)).toEqual(["Full refund until dispatch · 7-day returns", "Deliveries start mid-November"]);
    expect(close.querySelector("a.kh-btn--ghost")?.textContent).toBe("See how Kheelu works");
    expect(words(visible(main))).not.toMatch(/GSTIN|incl\. GST/);
  });

  it("reveals nothing, as the mockup reveals nothing, and never moves money (SPA 9)", async () => {
    const { doc, main } = await renderPage(buildOffer("token"));
    expect(mockupMain.querySelectorAll("[data-reveal]")).toHaveLength(0);
    expect(main.querySelectorAll("[data-reveal]")).toHaveLength(0);
    expect(revealOnMoneyInDocument(doc)).toEqual([]);
  });

  it("ships no mockup-only markup: no mk- class, no data-src, no review tool (SCA 6)", async () => {
    const { html } = await renderPage(buildOffer("token"));
    expect(html).not.toMatch(/class="[^"]*\bmk-/);
    expect(html).not.toMatch(/\sdata-src=/);
    expect(html).not.toMatch(/Headline <span|Pick a headline|Rewritten in the build/);
  });
});

describe("/contact: the seller lines are the footer's", () => {
  /* The page inside the real site shell, as src/app/(site)/layout.tsx renders it: the seller fold's lines and the
   * footer's legal row come from the same values (seller.ts), so they cannot drift. Neither prints a GSTIN (D063 item
   * 3); the seller fold's contact line keeps the number, the footer's does not (D063 item 2; task Q2.3). */
  it("prints the entity and the address exactly as the site's footer, the © year aside; the number on the page alone", async () => {
    const offer = buildOffer("token");
    const html = renderToStaticMarkup(
      <SiteShell offer={offer} stickyBar={stickyBarPaths()}>
        {await element(offer)}
      </SiteShell>,
    );
    const doc = new DOMParser().parseFromString(html, "text/html");
    const address = doc.querySelector('main section[aria-labelledby="seller-title"] address')!;
    const page = [address.querySelector("strong.kh-title")!, ...address.querySelectorAll(":scope > span")].map((el) => el.innerHTML);
    const footer = Array.from(doc.querySelectorAll("footer .kh-footer__legal > span"))
      .slice(0, 3)
      .map((el) => el.innerHTML);
    expect(page).toHaveLength(3);
    expect(page.slice(0, 2)).toEqual([footer[0].replace(/^© \d{4} /, ""), footer[1]]);
    expect(doc.body.textContent).not.toContain("GSTIN");
    expect(page[2]).toContain('href="tel:+919187546483"');
    expect(footer[2]).not.toContain("tel:");
    expect(footer[2]).toContain('href="https://wa.me/919187546483"');
  });
});

type PageGraph = { "@graph": { "@type": string; name: string; url: string; mainEntity: { "@id": string } }[] };

describe("/contact: its JSON-LD", () => {
  it("is one ContactPage named by the eyebrow, at its own address, pointing at the Organization (architecture §9.2), in both modes", async () => {
    for (const mode of ["token", "full"] as const) {
      const { html, main } = await renderPage(buildOffer(mode));
      expect(main.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
      const [graph] = jsonLdBlocks(html) as PageGraph[];
      expect(graph["@graph"]).toEqual([
        { "@type": "ContactPage", name: "Contact Kheelona", url: "https://kheelona.com/contact", mainEntity: { "@id": "https://kheelona.com/#organization" } },
      ]);
      expect(main.querySelector(".kh-heading--hero .kh-eyebrow")?.textContent).toBe("Contact Kheelona");
    }
  });

  it("leaves the shared detector (jsonld-matches-page) nothing to report, in both modes", async () => {
    for (const mode of ["token", "full"] as const) {
      const { html } = await renderPage(buildOffer(mode));
      expect(jsonLdMismatches(html), mode).toEqual([]);
    }
  });
});
