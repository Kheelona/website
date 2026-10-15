import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { organization } from "@/content/en-IN/organization";
import { teamPage } from "@/content/en-IN/pages/team";
import type { Offer } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { jsonLdBlocks, jsonLdMismatches, revealOnMoneyInDocument } from "../../../../test/e2e/support/page-checks";
import { CLAIM_FIXES, CLOSES_ALIKE, SELLING_CLOSES } from "../../../../test/e2e/support/deviations";
import { withSellerFacts } from "../../../../test/e2e/support/seller-facts";
import { parseMockup, words } from "../../../../test/support/mockup-compare";
import { withFacts } from "../../../../test/support/mockup-facts";

/* The /team route (task 5.7; structure §3.1, §5): the page module through PageTemplate with the live offer, thin, and as
 * a whole page equal to the approved mockup's <main> (mockup/team.html, D046) apart from what the plan changes on
 * purpose: fold 1's lede is the CMO's fix M-T1 (the first screen says what Kheelu is, the age band and the search term);
 * the mockup's placeholders for the founders' photos and background lines and for the "Recognised by." programmes are
 * resolved by the founder's answers of 2026-10-14 (D054 item 20, task 6.6): the live photos, the live bios' lines and
 * the live strip, as the copy page words them. One chilli button (`finale`), no reveal (the mockup has none), the
 * AboutPage node described by the visible fold-2 answer (architecture §9.2). */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

/* The first import of the route compiles the page template and every section under it: load it once, under its own
 * time limit, so a busy machine cannot time out whichever test happens to import it first. */
beforeAll(async () => {
  await import("./page");
}, 60_000);

const SOURCE = readFileSync("src/app/(site)/team/page.tsx", "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

/* Through the mockup comparison harness, so the close's price line and trust line read as task Q2.8 rules them (D065
 * item 3; the harness's withPriceLine). */
const mockupDoc = parseMockup("team");
/** The approved main as D063 item 2 rules it (task Q2.3; seller-facts.ts): fold 2's answer and the close's help line
 *  without the number. */
const mockupMain = withSellerFacts(mockupDoc.querySelector("main")!);

const APPROVED_LEDE = "Kheelu is designed by parents in Bengaluru. You’re trusting us near your child, so here is who we are.";
const CMO_LEDE =
  "Kheelona’s founders are parents in Bengaluru, building Kheelu: a screen-free plush toy that talks, for children aged 3 to 7. You’re trusting us near your child, so here is who we are.";

/** The founders' background lines (team.md fold 3, D054 item 20), in the card order. */
const BIOS = [
  "He is a Chartered Accountant with 15 years in finance and company-building. He was the first student at his family’s pre-school, in 1994.",
  "He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name.",
  "Over a decade in hardware, including years at Intel leading Thunderbolt 4 and 5 compliance, he took products from a blank page to certification.",
];
/** The founders' photos and their alts (team.md fold 3), in the card order: empty, the name is printed beside each. */
const PHOTOS = [
  ["/team/apoorva.jpg", ""],
  ["/team/aman.jpg", ""],
  ["/team/kashyap.jpg", ""],
];

/** The approved <main> as the build must show it: the hero lede replaced by the CMO's fix M-T1, and the mockup's
 *  placeholders resolved (D054 item 20): each founder's photo in the initials badge's place (the photo placeholder line
 *  gone), each background line the live bio's, and fold 5's line the strip's visible names (the two marks that name
 *  their programmes carry no text); and Aman's job line and fold 4's keys line in the live team's code-checked words
 *  (task 8b.1; D058; deviations.md V30, CLAIM_FIXES.team); then the selling update's (task Q2.12; D065 item 7; the D2C plan
 *  v2 §8; SELLING_CLOSES.team): the keys line in G26's words and the close's lead; then the consistency review's (task
 *  Q2.15, CON-6; CLOSES_ALIKE.team): the close labelled "Pre-order". Every other word stays the mockup's. */
function expectedMain(): Element {
  const copy = withFacts(withFacts(withFacts(mockupMain, CLAIM_FIXES.team.edits), SELLING_CLOSES.team.edits), CLOSES_ALIKE.team.edits);
  const lede = copy.querySelector('section[aria-labelledby="hero-title"] .kh-heading__lead')!;
  expect(lede.textContent).toBe(APPROVED_LEDE);
  lede.textContent = CMO_LEDE;
  copy.querySelectorAll(".mk-founder__photo").forEach((n) => n.remove());
  copy.querySelectorAll(".mk-founder__head .kh-avatar").forEach((n) => (n.textContent = ""));
  // The quote's "AS" badge is Apoorva's live photo since task 7.1a (CMO M10; deviations.md V7).
  copy.querySelectorAll(".kh-quote__avatar").forEach((n) => (n.textContent = ""));
  const bios = copy.querySelectorAll(".mk-founder__bg");
  expect(bios).toHaveLength(BIOS.length);
  bios.forEach((n, i) => (n.textContent = BIOS[i]));
  const programmes = copy.querySelector('section[aria-labelledby="recognised-title"] header > p.kh-body')!;
  expect(programmes.textContent).toMatch(/^\[PLACEHOLDER F11: programme names/);
  programmes.textContent = "Karnataka Elevate Founders Inc";
  return copy;
}

/** The page as the site shell holds it: the route's output inside <main>. */
async function renderPage(offer: Offer) {
  getOffer.mockResolvedValue(offer);
  const { default: TeamPage } = await import("./page");
  const element = (await TeamPage()) as ReactElement;
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup(element)}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { html, doc, main: doc.querySelector("main")! };
}

/** The file an image renders: its path on this site, through next/image's `url` parameter when optimised. */
function imageUrl(img: Element): string | null {
  const src = new URL(img.getAttribute("src")!, "https://kheelona.com");
  return src.searchParams.get("url") ?? src.pathname;
}

/** <main> without its JSON-LD and React's image preload links: the visible page. */
function visible(main: Element): Element {
  const copy = main.cloneNode(true) as Element;
  copy.querySelectorAll('script, link[rel="preload"]').forEach((n) => n.remove());
  return copy;
}

/** The words of a page, with the quote's byline items kept apart: `.kh-quote__who` is a DS flex row, whose items render
 *  apart whatever whitespace the markup holds between them (the mockup has a line break there, React none). */
function pageWords(root: Element): string {
  const copy = root.cloneNode(true) as Element;
  copy.querySelectorAll(".kh-quote__who > *").forEach((item) => {
    item.before(" ");
    item.after(" ");
  });
  return words(copy);
}

/** The folds of <main>, by the heading that names each, in order. */
const foldNames = (main: Element) =>
  Array.from(main.querySelectorAll("section[aria-labelledby]")).map((el) => el.getAttribute("aria-labelledby"));

/** A reveal target as compared with the mockup's: its tag and DS (kh-) classes. */
const revealTargets = (root: Element) =>
  Array.from(root.querySelectorAll("[data-reveal]")).map(
    (el) => `${el.tagName.toLowerCase()}${[...el.classList].filter((c) => c.startsWith("kh-")).sort().map((c) => `.${c}`).join("")}`,
  );

describe("/team: the route file", () => {
  it("takes its metadata from the page module through pageMeta, at its own path", async () => {
    const mod = await import("./page");
    expect(mod.metadata).toEqual(pageMeta({ ...teamPage.meta, path: "/team" }));
  });

  it("revalidates like every page that shows a price (the close and the buy bar show one; ADR-005)", async () => {
    expect((await import("./page")).revalidate).toBe(300);
    expect(code).toMatch(/^export const revalidate = 300;$/m);
  });

  it("gives the head its canonical, a complete Open Graph card and a large Twitter card, worded as the copy page (SPA 5)", async () => {
    const { metadata } = await import("./page");
    const title = "Kheelona founders: the parents building Kheelu";
    const description =
      "Meet the Kheelona founders, Apoorva Sahu, Aman Soni and Kashyap C.R: parents in Bengaluru building Kheelu, a screen-free plush toy for ages 3 to 7.";
    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.description).toBe(description);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(metadata.alternates).toEqual({ canonical: "/team" });
    expect(metadata.openGraph).toMatchObject({ type: "website", url: "/team", title, description, siteName: "Kheelona", locale: "en_IN" });
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expect.any(String), width: 1200, height: 630, alt: expect.any(String) })]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title, description });
    expect(metadata.twitter?.images).toHaveLength(1);
    expect("robots" in metadata).toBe(false);
  });

  it("is thin: no copy, price or outside address typed in it, only its own path (structure §3.1)", () => {
    const body = code.replace(/^import [^;]*;$/gm, "");
    expect([...body.matchAll(/"([^"]*)"/g)].map((m) => m[1])).toEqual(["/team"]);
    expect(body).not.toMatch(/₹|https?:|`/);
    expect(body).not.toMatch(/\bnotFound\b/);
  });
});

describe("/team: the rendered page against the approved mockup", () => {
  it("opens with the page's one h1, the approved headline with the Hand on “parents”", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const h1 = main.querySelectorAll("h1");
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent).toBe("The parents building Kheelu.");
    expect(h1[0].querySelector(".kh-hand")?.textContent).toBe("parents");
  });

  it("says on the first fold what Kheelu is, the age band and the search term (CMO fix M-T1)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const lede = main.querySelector('section[aria-labelledby="hero-title"] .kh-heading__lead');
    expect(lede?.textContent).toBe(CMO_LEDE);
  });

  it("keeps the mockup's heading outline: every level and its words in order, no level skipped (SPA 5)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const outline = (root: Element) =>
      Array.from(root.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((h) => `${h.tagName.toLowerCase()} ${words(h)}`);
    const built = outline(main);
    expect(built).toEqual(outline(mockupMain));
    expect(built).toContain("h2 Recognised by.");
    const levels = built.map((h) => Number(h[1]));
    expect(levels[0]).toBe(1);
    levels.forEach((level, i) => expect(level, built[i]).toBeLessThanOrEqual((levels[i - 1] ?? 0) + 1));
  });

  it("holds the mockup's six folds in its order, “Recognised by.” shown (D054 item 20)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(foldNames(main)).toEqual(["hero-title", "who-title", "founders-title", "why-title", "recognised-title", "close-title"]);
    expect(foldNames(main)).toEqual(foldNames(mockupMain));
  });

  it("prints every word of the mockup's <main>, in order, and nothing else, but the M-T1 lede and the resolved placeholders (token mode)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(pageWords(visible(main))).toBe(pageWords(expectedMain()));
  });

  it("shows each founder's background line from the live bio, under the card's words (D054 item 20)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const bios = [...main.querySelectorAll(".ks-founder__bg")];
    expect(bios.map((p) => p.textContent)).toEqual(BIOS);
    expect(bios.map((p) => p.previousElementSibling?.className)).toEqual(Array(3).fill("kh-card__body"));
    expect(words(visible(main))).not.toMatch(/PLACEHOLDER|language model|train ourselves/i);
  });

  it("shows each founder's live photo in the badge's place, alt empty beside the visible name (D054 item 20; DS Avatar)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(main.querySelector(".ks-founder__photo")).toBeNull();
    const photos = [...main.querySelectorAll<HTMLImageElement>(".ks-founder__head .kh-avatar img")];
    expect(photos.map((img) => [imageUrl(img), img.getAttribute("alt")])).toEqual(PHOTOS);
    expect(photos.map((img) => [img.getAttribute("width"), img.getAttribute("height"), img.getAttribute("loading")])).toEqual(
      Array(3).fill(["480", "480", "lazy"]),
    );
    expect(main.querySelectorAll(".ks-founder .kh-avatar[aria-hidden]")).toHaveLength(0);
  });

  it("shows Apoorva's live photo in the quote's avatar, alt empty beside his printed name, never initials (task 7.1a, CMO M10)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const who = main.querySelector('section[aria-labelledby="why-title"] .kh-quote__who')!;
    expect(who.querySelector(".kh-quote__avatar")).toBeNull();
    const img = who.querySelector<HTMLImageElement>(".kh-avatar img")!;
    expect([imageUrl(img), img.getAttribute("alt")]).toEqual(PHOTOS[0]);
    expect(who.querySelector(".kh-quote__name")?.textContent).toBe(organization.founders[0].name);
  });

  it("shows the strip as live: the NVIDIA and nasscom marks, the Karnataka seal beside its name, Founders Inc as text (D054 item 20)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    const strip = main.querySelector('section[aria-labelledby="recognised-title"]')!;
    const items = [...strip.querySelectorAll("ul.ks-recognition > li")].map((li) => {
      const img = li.querySelector("img");
      return { mark: img && imageUrl(img), alt: img?.getAttribute("alt"), text: li.textContent };
    });
    expect(items).toEqual([
      { mark: "/recognition/nvidia-inception.png", alt: "NVIDIA Inception Program", text: "" },
      { mark: "/recognition/karnataka-seal.png", alt: "", text: "Karnataka Elevate" },
      { mark: "/recognition/nasscom.png", alt: "nasscom startups", text: "" },
      { mark: null, alt: undefined, text: "Founders Inc" },
    ]);
    expect(words(strip)).not.toMatch(/backed|funded|partner|investor|member|Government/i);
  });

  it("gives each founder's name the person's fragment, so the article bylines resolve on /team", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect([...main.querySelectorAll(".ks-founder h3")].map((h) => [h.id, h.textContent])).toEqual(
      organization.founders.map((f) => [f.anchor, f.name]),
    );
  });

  it("changes only the price sentence in full mode (D028; team copy, fold 6)", async () => {
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

  /* The phone buy bar hides only while a #hero-cta is on screen (StickyBuyBar.client.tsx), and this page has none, so the
   * bar shows from first paint, as the mockup's meta (`buybar: true`) and the copy page ask (SPA 6). */
  it("gives the phone bar no hero button to wait for, so it shows from first paint (mockup meta buybar: true)", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect(mockupDoc.querySelector("#hero-cta")).toBeNull();
    expect(main.querySelector("#hero-cta")).toBeNull();
    expect(main.querySelector('section[aria-labelledby="hero-title"] .kh-btn--cta')).toBeNull();
  });

  it("has one chilli button, the close's, tracked `finale`, and no other tracked link", async () => {
    const { main } = await renderPage(buildOffer("token"));
    expect([...main.querySelectorAll("[data-ph-capture-attribute-cta]")].map((el) => el.getAttribute("data-ph-capture-attribute-cta"))).toEqual(["finale"]);
    expect(main.querySelectorAll(".kh-btn--cta")).toHaveLength(1);
    expect(main.querySelector("#close .kh-btn--cta")?.textContent).toBe("Pre-order Kheelu");
  });

  it("reveals exactly what the mockup reveals (nothing), and never the first fold, a price or the chilli button (SPA 9)", async () => {
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

type AboutGraph = { "@graph": { "@type": string; name: string; url: string; description: string; mainEntity: { "@id": string } }[] };

describe("/team: its JSON-LD", () => {
  it("is one AboutPage, named as the live page, described by the visible fold-2 answer, pointing at the Organization", async () => {
    for (const offer of [buildOffer("token"), buildOffer("full")]) {
      const { html, main } = await renderPage(offer);
      expect(main.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
      const [graph] = jsonLdBlocks(html) as AboutGraph[];
      expect(graph["@graph"]).toEqual([
        {
          "@type": "AboutPage",
          name: "The people who build Kheelona",
          url: "https://kheelona.com/team",
          description: words(main.querySelector('section[aria-labelledby="who-title"] p')!),
          mainEntity: { "@id": "https://kheelona.com/#organization" },
        },
      ]);
    }
  });

  it("leaves the shared detector (jsonld-matches-page) nothing to report, in both modes", async () => {
    for (const mode of ["token", "full"] as const) {
      const { html } = await renderPage(buildOffer(mode));
      expect(jsonLdMismatches(html), mode).toEqual([]);
    }
  });
});
