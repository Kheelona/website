import { describe, expect, it, vi } from "vitest";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import { checkoutPrices, checkoutWords } from "@/components/sections/store/StoreDetails/checkout-words";
import { BALANCE_PRICE, FULL_PRICE, TOKEN_PRICE } from "@/config/site";
import type { Copy } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { readRepoFile } from "../../../../test/e2e/support/repo";
import { mockupRoute } from "../../../../test/support/mockup-compare";
import { faqs } from "../faqs";
import { films, filmsStrip } from "../films";
import { navigation } from "../navigation";
import { offerCopy } from "../offer";
import { DEFAULT_OG } from "../organization";
import { seller } from "../seller";
import { TRUST_COMPACT, TRUST_FULL, trustItems } from "../trust";
import { paymentsLine } from "./payments-line";
import { orderSummaryCopy, preorderFormCopy, storePage } from "./store-page";

/* The store page module (task 5.15; structure §5 row store.html; wiki/site/pages/store.md). Token mode is the approved
 * mockup's, word for word (mockup/store.html, D046); full mode, which no mockup shows, is the copy page's. Shared facts are
 * read by reference (offer.ts's D028 sentence, trust.ts, seller.ts, faqs.ts, films.ts, navigation.ts), never retyped. */

const token = buildOffer("token");
const full = buildOffer("full");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const plain = (copy: Copy) => toPlainText(copy, token);

const mockup = new DOMParser().parseFromString(readRepoFile("mockup/store.html"), "text/html");
const main = mockup.querySelector("main")!;
function the(selector: string, root: ParentNode = main): Element {
  const el = root.querySelector(selector);
  if (!el) throw new Error(`mockup/store.html has no ${selector}`);
  return el;
}
/** Visible words of a mockup element, its visually hidden notes left out. */
function seen(el: Element): string {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll(".kh-sr").forEach((n) => n.remove());
  return norm(copy.textContent);
}
/** A mockup icon (inlined SVG) as its DS name, read from its path data. */
function iconOf(svg: Element | null): IconName | undefined {
  const d = Array.from(svg?.querySelectorAll("path") ?? [])
    .map((p) => p.getAttribute("d"))
    .join("");
  return d === "" ? undefined : (Object.keys(ICON_PATHS) as IconName[]).find((name) => ICON_PATHS[name] === d);
}
/** A mockup trust line as the items it links: icon, words, page. */
const trustOf = (ul: Element) =>
  Array.from(ul.querySelectorAll("li > a")).map((a) => ({ icon: iconOf(a.querySelector("svg")), label: seen(a), href: mockupRoute(a.getAttribute("href")!) }));

describe("store page module: meta (store.md, At a glance)", () => {
  it("title, both descriptions and the default card, through pageMeta (which refuses a typed amount)", () => {
    const tokenMeta = pageMeta({ ...storePage.meta, path: "/", offer: token });
    expect(tokenMeta.title).toEqual({ absolute: "Pre-order Kheelu · Kheelona" });
    expect(tokenMeta.description).toBe(
      "Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7. ₹4,999 (incl. GST); reserve yours today with a refundable ₹499.",
    );
    expect(pageMeta({ ...storePage.meta, path: "/", offer: full }).description).toBe(
      "Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7. ₹7,999 (incl. GST), with delivery anywhere in India included.",
    );
    expect(storePage.meta.og).toBe(DEFAULT_OG);
  });

  it("the token description equals the approved mockup's", () => {
    const description = /<meta name="description" content="([^"]*)"/.exec(readRepoFile("mockup/store.html"))![1];
    expect(toPlainText(storePage.meta.description, token)).toBe(description);
  });
});

describe("store page module: fold 1, heading and price", () => {
  const top = the("section.mk-store-top");

  it("eyebrow, h1 and its id, the image's alt and the price sentence's id, as the mockup", () => {
    expect(plain(storePage.top.eyebrow)).toBe(norm(the(".kh-eyebrow", top).textContent));
    expect(plain(storePage.top.title)).toBe(norm(the("h1", top).textContent));
    expect(storePage.top.titleId).toBe(the("h1", top).id);
    expect(storePage.top.image.alt).toBe(the("img", top).getAttribute("alt"));
    expect(storePage.top.priceId).toBe(the(".mk-store-top__price", top).id);
  });

  it("the image is the DS kheelu-front.webp, the mockup's file (a static import: Next reads its 1080 x 1324 size)", () => {
    const src: unknown = storePage.top.image.src;
    const path = typeof src === "string" ? src : (src as { src: string }).src;
    expect(path).toMatch(/Kheelu\/kheelu-front\.webp$/);
    expect(the("img", the("section.mk-store-top")).getAttribute("src")).toMatch(/Kheelu\/kheelu-front\.webp$/);
  });

  it("the compact trust line is trust.ts's TRUST_COMPACT, in the mockup's order, icons and pages", () => {
    expect(storePage.top.trust).toEqual(TRUST_COMPACT.map((id) => trustItems[id]));
    expect(storePage.top.trust.map((item) => ({ icon: item.icon, label: plain(item.label), href: item.href }))).toEqual(
      trustOf(the("ul.mk-store-top__trust", top)),
    );
  });
});

describe("store page module: fold 3, the form and what sits beside the pay button", () => {
  const form = the("form.mk-form");
  const labels = Array.from(form.querySelectorAll(".kh-field__label")).map((l) => norm(l.textContent));
  const hint = (id: string) => norm(the(`#${id}-d`, form).textContent);

  it("the details heading and its fragment", () => {
    expect(storePage.details).toEqual({ id: the("section.mk-details").id, title: norm(the("#details-title").textContent), titleId: "details-title" });
  });

  it("the four labels and the hints as the mockup (token mode)", () => {
    const { labels: l, hints } = preorderFormCopy;
    expect([l.parentName, l.phone, l.email, l.childAge]).toEqual(labels);
    expect(hints.phone.token).toBe(hint("phone"));
    expect(hints.email).toBe(hint("email"));
    expect(hints.childAge).toBe(hint("childAge"));
  });

  it("the full-mode phone hint is the copy page's", () => {
    expect(preorderFormCopy.hints.phone.full).toBe("For messages about your order.");
  });

  it("the consent row verbatim, around its two links", () => {
    const { lead, terms, join, refund, tail } = preorderFormCopy.consent;
    const text = the(".kh-check__text > span", form);
    expect(`${lead} ${terms} ${join} ${refund}${tail}`).toBe(seen(text));
    expect(Array.from(text.querySelectorAll("a")).map((a) => seen(a))).toEqual([terms, refund]);
    expect(preorderFormCopy.newTabNote).toBe(navigation.labels.newTabNote);
    expect(norm(the(".kh-sr", text).textContent)).toBe(norm(navigation.labels.newTabNote));
  });

  it("beside the button, token mode: the D028 sentence from offer.ts, which carries the refund promise", () => {
    expect(preorderFormCopy.price.token).toBe(offerCopy.sentence.token);
    const words = checkoutWords(preorderFormCopy.price.token, checkoutPrices("token", TOKEN_PRICE, BALANCE_PRICE));
    expect(words).toBe(seen(the(".mk-pay-beside .mk-price")));
    expect(words).toMatch(/\brefundable\b/);
  });

  it("beside the button, full mode: the copy page's sentence, then the refund promise in the page's own words (ADR-013)", () => {
    /* store.md fold 3 swaps the D028 sentence for the full-price one; the refund promise must stay in the pay button's
       block (architecture §16.3; the JSX contract), so it follows in the store FAQ's full-mode words (store.md fold 5). */
    expect(preorderFormCopy.price.full.startsWith(offerCopy.sentence.full)).toBe(true);
    expect(checkoutWords(preorderFormCopy.price.full, checkoutPrices("full", FULL_PRICE, BALANCE_PRICE))).toBe(
      "₹7,999 (incl. GST), paid in full when you order. Until we dispatch your Kheelu, all of it is refundable.",
    );
    expect(toPlainText(faqs["paying-today"].answer, full)).toContain("Until we dispatch your Kheelu, all of it is refundable.");
  });

  it("the full trust row, the payment window line and the help line, as the mockup", () => {
    const beside = the(".mk-pay-beside");
    expect(storePage.beside.trust).toEqual(TRUST_FULL.map((id) => trustItems[id]));
    expect(storePage.beside.trust.map((item) => ({ icon: item.icon, label: plain(item.label), href: item.href }))).toEqual(trustOf(the("ul.mk-trust", beside)));
    expect(plain(storePage.beside.payment)).toBe(seen(the("p.mk-muted", beside)));
    const help = the("p.mk-help", beside);
    expect(`${plain(storePage.beside.help.lead)} ${plain(storePage.beside.help.contact)}`).toBe(seen(help));
    expect(storePage.beside.help.contact).toBe(seller.help.contact);
  });
});

describe("store page module: fold 4, what you are agreeing to", () => {
  const card = the("section.mk-agree");
  const rows = Array.from(card.querySelectorAll(".mk-agree__list > li"));
  const tokenPrices = checkoutPrices("token", TOKEN_PRICE, BALANCE_PRICE);

  it("the heading and its id", () => {
    expect(orderSummaryCopy.title).toBe(norm(the("h2", card).textContent));
    expect(orderSummaryCopy.titleId).toBe(the("h2", card).id);
  });

  it("token rows: icons, heads and notes as the mockup; the delivery row's icon and note", () => {
    const built = [
      ...orderSummaryCopy.rows.token.map((row) => ({ icon: row.icon, head: checkoutWords(row.head, tokenPrices), note: checkoutWords(row.note, tokenPrices) })),
      { icon: orderSummaryCopy.delivery.icon, head: token.delivery, note: orderSummaryCopy.delivery.note },
    ];
    expect(built).toEqual(
      rows.map((li) => ({ icon: iconOf(li.querySelector("svg")), head: norm(the(".kh-label", li).textContent), note: norm(the(".mk-muted", li).textContent) })),
    );
  });

  it("the token small print as the mockup", () => {
    expect(checkoutWords(orderSummaryCopy.fine.token, tokenPrices)).toBe(norm(the(".mk-agree__fine", card).textContent));
  });

  it("full mode, as the copy page: the whole price today, nothing due, the refund row unchanged, and its small print", () => {
    const prices = checkoutPrices("full", FULL_PRICE, BALANCE_PRICE);
    expect(orderSummaryCopy.rows.full.map((row) => [checkoutWords(row.head, prices), checkoutWords(row.note, prices)])).toEqual([
      ["₹7,999 today", "The whole price, incl. GST."],
      ["Nothing due before delivery", "You have paid the whole price. No balance link, and nothing automatic."],
      [orderSummaryCopy.rows.token[2].head, orderSummaryCopy.rows.token[2].note],
    ]);
    expect(checkoutWords(orderSummaryCopy.fine.full, prices)).toBe(
      "Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app. The first 500 units at ₹4,999 have been reserved, and this order is at the ₹7,999 price (incl. GST). Delivery anywhere in India is included, and every order comes with a GST invoice.",
    );
  });

  it("the Kheelona+ sentence is offer.ts's (D027's first sentence only)", () => {
    expect(orderSummaryCopy.fine.token.startsWith(offerCopy.plus)).toBe(true);
    expect(orderSummaryCopy.fine.full.startsWith(offerCopy.plus)).toBe(true);
  });
});

describe("store page module: fold 5, questions before you pay", () => {
  const fold = the("section.mk-faq");

  it("the heading and the four store FAQs from faqs.ts, in the mockup's order and words", () => {
    expect(storePage.questions.heading).toEqual({ title: norm(the("h2", fold).textContent), id: the("h2", fold).id });
    const items = Array.from(fold.querySelectorAll(".kh-faq__item")).map((d) => ({ q: norm(the(".kh-faq__q", d).textContent), a: norm(the(".kh-faq__a", d).textContent) }));
    expect(storePage.questions.items.map((id) => ({ q: plain(faqs[id].question), a: plain(faqs[id].answer) }))).toEqual(items);
  });
});

describe("store page module: fold 6, films", () => {
  const fold = the('section[aria-labelledby="ask-title"]');

  it("heading, lede, proof line and the way back to the form, as the mockup", () => {
    const { heading, proof, link, posters } = storePage.films;
    expect(plain(heading.title)).toBe(norm(the("h2", fold).textContent));
    expect(heading.id).toBe(the("h2", fold).id);
    expect(plain(heading.lead!)).toBe(norm(the(".kh-heading__lead", fold).textContent));
    expect(plain(proof!.text)).toBe(norm(the(".mk-films-proof", fold).textContent));
    expect(link).toEqual({ label: norm(the(".kh-section__actions a", fold).textContent), href: the(".kh-section__actions a", fold).getAttribute("href"), iconEnd: "caret-up" });
    expect(posters).toBe("lazy");
  });

  it("the seven films the strip shows are films.ts's, in the mockup's order", () => {
    expect(films.map((f) => f.id)).toEqual(Array.from(fold.querySelectorAll("[data-video-id]")).map((li) => li.getAttribute("data-video-id")));
    expect(filmsStrip.listLabel).toBe(the("[data-films]", fold).getAttribute("aria-label"));
  });
});

describe("store page module: the payments line (store.md fold 7; deviations V1)", () => {
  it("is the shared line /thanks prints too (payments-line.ts, task 4.8; its words are checked there)", () => {
    expect(storePage.payments).toBe(paymentsLine);
  });
});

describe("store page module: the not-configured state (store.md, Other states; as live)", () => {
  it("keeps the live words", () => {
    expect(storePage.notConfigured).toEqual({
      title: "Pre-orders open here shortly.",
      body: "Our store is not switched on yet. Nothing is wrong at your end, and nothing has been charged.",
      action: "Message us on WhatsApp",
      note: "We will reserve one for you by hand in the meantime.",
    });
  });
});

describe("store page module: sources", () => {
  const source = readRepoFile("src/content/en-IN/store/store-page.ts");

  it("types no amount, number, address or delivery date: each comes from its one source", () => {
    expect(source).not.toMatch(/₹|Rs\.? ?\d|91875|wa\.me|mid-November|20 October/);
  });

  it("types no unit cap: the agreement card's small print reads config's CAP_UNITS_TEXT, as faqs.ts does (checkout.md)", async () => {
    expect(source).not.toMatch(/\b500\b|first \d+ units/);
    // Change the cap at its source and both small prints follow.
    vi.resetModules();
    vi.doMock("@/config/site", async (importOriginal) => ({ ...(await importOriginal<typeof import("@/config/site")>()), CAP_UNITS_TEXT: "first 9 units" }));
    try {
      const { orderSummaryCopy: moved } = await import("./store-page");
      expect(moved.fine.token).toContain("(incl. GST) for the first 9 units, and");
      expect(moved.fine.full).toContain("The first 9 units at {price:headline} have been reserved");
    } finally {
      vi.doUnmock("@/config/site");
      vi.resetModules();
    }
  });

  it("names no banned line (\"Families already using Kheelu\", the old ages)", () => {
    expect(source).not.toMatch(/Families already using|ages 3\+|nearly 3/);
  });
});
