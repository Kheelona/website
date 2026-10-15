import { describe, expect, it } from "vitest";
import {
  BALANCE_AMOUNT_PAISE,
  FULL_AMOUNT_PAISE,
  LAUNCH_AMOUNT_PAISE,
  MRP_AMOUNT_PAISE,
  TOKEN_AMOUNT_PAISE,
} from "@/config/site";
import { offerCopy, PLUS_NOTE } from "@/content/en-IN/offer";
import { seller } from "@/content/en-IN/seller";
import type { Offer, OfferCopy, RichTextString } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { formatInr } from "@/lib/format/inr";
import { KHEELONA_PLUS, OFFER_ORIGIN_PERK, PRICE_LINE } from "../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { buildOffer, headlinePaise, offerPrices } from "./offer";

/* The offer view model (ADR-005, architecture §7; task 2.1 acceptance 3). Visible wording is
 * checked against the approved mockup, the only place it is shown (architecture §6.3); the
 * full-mode wording, which no mockup shows, against the copy pages (home.md "At a glance" and
 * "Phone sticky bar"; home.md fold 9 "Full mode"). Mockups are read as built
 * (mockup/<slug>.html, the files the parity specs open: icons inlined, partials included, so the
 * buy bar is Home's own).
 *
 * Task Q2.8 (D065 item 3; the main session's ruling 3 of the selling update, 2026-10-15): beside every button on the
 * selling pages the short price line, written out here by hand from the task, where the mockup prints D028's long
 * sentence; the buy bar's small line says "in total" without GST; the offer card's "incl. GST" note comes off. D028's
 * sentence stays the checkout's (the store's first screen, the pre-order form, /terms, /pricing.md). */

const doc = (path: string) => new DOMParser().parseFromString(readRepoFile(path), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const home = doc("mockup/home.html");
const buybar = home.querySelector(".kh-buybar")!;
const text = (value: RichTextString, offer: Offer) => toPlainText(value, offer);

describe("headlinePaise and the formatted amounts", () => {
  it("is LAUNCH in token mode and FULL in full mode (the ViewContent value × 100)", () => {
    expect(headlinePaise("token")).toBe(LAUNCH_AMOUNT_PAISE);
    expect(headlinePaise("token")).toBe(499_900);
    expect(headlinePaise("full")).toBe(FULL_AMOUNT_PAISE);
  });

  it("formats every amount from the checkout's own paise constants", () => {
    expect(offerPrices("token")).toEqual({
      token: formatInr(TOKEN_AMOUNT_PAISE),
      balance: formatInr(BALANCE_AMOUNT_PAISE),
      headline: formatInr(LAUNCH_AMOUNT_PAISE),
      full: formatInr(FULL_AMOUNT_PAISE),
      mrp: formatInr(MRP_AMOUNT_PAISE),
      launch: formatInr(LAUNCH_AMOUNT_PAISE),
    });
    expect(offerPrices("token")).toEqual({ token: "₹499", balance: "₹4,500", headline: "₹4,999", full: "₹7,999", mrp: "₹7,999", launch: "₹4,999" });
    expect(offerPrices("full").headline).toBe("₹7,999");
  });

  /* Task 4.7 item 2: a reservation made while the advance was open still owes the rest of the launch price after the
     store sells at the full price, so the words that name a reservation's total read `{price:launch}`, which is the
     launch price in both modes (the headline follows the mode). */
  it("names the launch price as `launch` in both modes, LAUNCH_AMOUNT_PAISE formatted once", () => {
    expect(offerPrices("token").launch).toBe(formatInr(LAUNCH_AMOUNT_PAISE));
    expect(offerPrices("full").launch).toBe(formatInr(LAUNCH_AMOUNT_PAISE));
    expect(offerPrices("full").launch).toBe("₹4,999");
    expect(buildOffer("full").prices.launch).toBe(buildOffer("token").prices.headline);
  });
});

describe("token mode", () => {
  const offer = buildOffer("token");

  it("carries the mode and headline", () => {
    expect(offer.mode).toBe("token");
    expect(offer.headlinePaise).toBe(499_900);
  });

  it("keeps D028's price sentence for the checkout, exactly as the store's first screen prints it", () => {
    const sentence = text(offer.sentence, offer);
    expect(sentence).toBe(norm(doc("mockup/store.html").querySelector("#store-price")?.textContent));
    expect(sentence).toBe(
      "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    );
  });

  it("carries the short price line for every button on the selling pages (D065 item 3), where the mockup prints D028's", () => {
    expect(text(offer.priceLine, offer)).toBe("₹499 today, refundable. ₹4,999 in total.");
    expect(norm(home.querySelector("#hero-price")?.textContent)).toBe(text(offer.sentence, offer));
  });

  /* The parity rule of task Q2.8 spells its lines out (Playwright loads it and cannot load every content module): the
     mockup's as the approved Home prints them, the build's as this view model does. */
  it("is the build side of the price-line deviation, whose mockup side is the approved Home's", () => {
    expect(PRICE_LINE.sentence).toEqual({ mockup: text(offer.sentence, offer), build: text(offer.priceLine, offer) });
    expect(PRICE_LINE.sentence.mockup).toBe(norm(home.querySelector("#hero-price")?.textContent));
    expect(PRICE_LINE.bar).toEqual({ mockup: norm(buybar.querySelector(".kh-buybar__small")?.textContent), build: text(offer.sticky.small, offer) });
    expect(PRICE_LINE.cardNote).toBe(norm(home.querySelector(".kh-offer__prices .kh-body-s")?.textContent));
    expect(PRICE_LINE.delivery).toBe(offer.delivery);
  });

  it("renders the sticky bar's big line as the buy bar partial, and its small line without GST (D065 item 3)", () => {
    expect(text(offer.sticky.big, offer)).toBe(norm(buybar.querySelector(".kh-buybar__big")?.textContent));
    expect(text(offer.sticky.small, offer)).toBe("refundable · ₹4,999 in total");
  });

  it("keeps the split on the offer card, as Home's card shows it, and no note beside the amount (D065 item 3)", () => {
    const card = home.querySelector(".kh-offer")!;
    expect(offer.card.product).toBe(norm(card.querySelector(".kh-offer__product")?.textContent));
    expect("priceNote" in offer.card).toBe(false);
    const split = Array.from(card.querySelectorAll(".kh-offer__split > *")).map((el) => norm(el.textContent));
    expect(offer.card.split?.flatMap((row) => [text(row.label, offer), offer.prices[row.price]])).toEqual(split);
  });

  /* Task Q2.9 (the selling update; the D2C plan v2 §2 fold 7, the CMO's m8): one perk list, in Home's order, on both
     offer cards: the delivery line first ("when does it come?" is the first pre-order doubt) with the dispatch order, the
     box, delivery anywhere, Kheelona+ with "Nothing renews without you." (D065 item 6), Made in India last (D061 item 10).
     "A GST invoice with every order" left the cards for the store (D065 item 3: GST only at checkout). The frozen
     mockups' two lists are the offer rule's (deviations.ts OFFER_ADDITIONS, ONE_PERK_LIST). */
  it("lists one perk list, the plan's, on both cards, in the plan's order and icons (D2C plan v2 §2 fold 7; CMO m8)", () => {
    const PLAN = [
      ["truck", "Deliveries start mid-November. Pre-orders go out first, in the order they were placed."],
      ["package", "In the box: Kheelu plush toy, charger and quick-start card"],
      ["map-pin", "Delivery anywhere in India, included"],
      ["star", "6 months of Kheelona+ included. Nothing renews without you."],
      ["house", OFFER_ORIGIN_PERK],
    ];
    for (const list of [offer.card.perks.home, offer.card.perks.product]) {
      expect(list.map((p) => [p.icon, text(p.text, offer)])).toEqual(PLAN);
    }
    expect(offer.card.perks.product).toBe(offer.card.perks.home);
    expect(JSON.stringify(offerCopy.card.perks)).not.toMatch(/GST|invoice|₹/);
  });

  it("words the Kheelona+ note under the cards as the plan's small line, apart from the store's sentence (offer.plus)", () => {
    expect(PLUS_NOTE).toBe("Kheelona+ is our paid subscription, on top of the free parent app.");
    expect(offer.plus).not.toBe(PLUS_NOTE);
  });

  it("ends both cards with the seller's origin line and its DS icon, house (D061 item 10; map-pin is the delivery perk's)", () => {
    for (const list of [offer.card.perks.home, offer.card.perks.product]) {
      expect(list.at(-1)).toEqual({ icon: "house", text: seller.origin.line });
      expect(list.filter((p) => p.icon === "house")).toHaveLength(1);
    }
    expect(OFFER_ORIGIN_PERK).toBe(seller.origin.line);
  });

  /* D058 item 3 (task 8b.1; deviations.md V26): the parent app is free and Kheelona+ a paid subscription on top of it, with
     no feature list, where the mockup lists D027's features. */
  it("carries the Kheelona+ line under Home's card (D058 item 3, verbatim; D041 F7)", () => {
    const line = Array.from(home.querySelectorAll("p")).find((p) => p.textContent?.startsWith("Every Kheelu comes with"));
    expect(norm(line?.textContent)).toBe(KHEELONA_PLUS.mockup);
    expect(offer.plus).toBe(KHEELONA_PLUS.build);
    expect(offer.plus).toBe("Every Kheelu comes with 6 months of Kheelona+, our paid subscription, on top of the free parent app.");
  });

  it("carries the delivery line and its schema date (D023, D037)", () => {
    expect(offer.delivery).toBe("Deliveries start mid-November");
    expect(offer.delivery).toBe(norm(home.querySelector('[data-src="DELIVERY_TEXT"]')?.textContent));
    expect(offer.availabilityStarts).toBe("2026-11-15");
  });
});

describe("full mode", () => {
  const offer = buildOffer("full");

  it("carries the mode and the full headline", () => {
    expect(offer.mode).toBe("full");
    expect(offer.headlinePaise).toBe(799_900);
    expect(offer.prices.headline).toBe("₹7,999");
  });

  it("keeps the full-mode D028 sentence for the checkout (home.md, At a glance)", () => {
    expect(text(offer.sentence, offer)).toBe("₹7,999 (incl. GST), paid in full when you order.");
  });

  it("carries the full-mode short price line for the selling pages (D065 item 3)", () => {
    expect(text(offer.priceLine, offer)).toBe("₹7,999 in total, paid in full when you order.");
  });

  /* The D2C plan v2 §1.2 (the copy page decides the full-mode bar, which no mockup shows; SPA 7): the amount "in total". */
  it("renders the full-mode sticky bar without GST, the amount in total (D065 item 3; D2C plan v2 §1.2)", () => {
    expect(text(offer.sticky.big, offer)).toBe("₹7,999 in total");
    expect(text(offer.sticky.small, offer)).toBe("Paid in full · Deliveries start mid-November");
  });

  it("omits the split and keeps the perks (G-08; home.md fold 9), with no note beside the amount", () => {
    expect("split" in offer.card).toBe(false);
    expect("priceNote" in offer.card).toBe(false);
    expect(offer.card.perks).toEqual(buildOffer("token").card.perks);
  });

  it("never mentions the advance or the balance anywhere in its own lines", () => {
    const lines = [offer.sentence, offer.priceLine, offer.sticky.big, offer.sticky.small].map((l) => text(l, offer));
    for (const line of lines) {
      expect(line).not.toContain("₹499");
      expect(line).not.toContain("₹4,500");
      expect(line).not.toMatch(/refundable/i);
    }
  });
});

/* D065 item 3: GST and the payment breakdown only at checkout. On the selling pages the offer's own lines (the short
   price line, the buy bar, the card's later price) say neither "GST" nor the balance; the card's two split rows (today,
   before delivery) keep their amounts. D028's sentence is the checkout's and keeps both. */
describe.each(["token", "full"] as const)("%s mode: the selling lines say no GST and no balance (D065 item 3)", (mode) => {
  const offer = buildOffer(mode);
  const selling = [offer.priceLine, offer.sticky.big, offer.sticky.small, ...(offer.card.later === undefined ? [] : [offer.card.later])];

  it("names neither GST nor the balance in the price line, the buy bar or the later price", () => {
    for (const line of selling.map((l) => text(l, offer))) {
      expect(line).not.toMatch(/GST/);
      expect(line).not.toContain(offer.prices.balance);
    }
  });

  it("says GST only in the checkout's D028 sentence", () => {
    expect(text(offer.sentence, offer)).toMatch(/\(incl\. GST\)/);
  });
});

describe("the view model reads its words from the copy it is given", () => {
  it("uses another locale's copy when passed one (the hi-IN folder would)", () => {
    const copy: OfferCopy = {
      ...offerCopy,
      sentence: { token: "T {price:token}", full: "F {price:full}" },
      priceLine: { token: "L {price:token}", full: "M {price:full}" },
    };
    const offer = buildOffer("token", copy);
    expect(text(offer.sentence, offer)).toBe("T ₹499");
    expect(text(offer.priceLine, offer)).toBe("L ₹499");
  });
});
