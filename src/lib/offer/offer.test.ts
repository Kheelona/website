import { describe, expect, it } from "vitest";
import {
  BALANCE_AMOUNT_PAISE,
  FULL_AMOUNT_PAISE,
  LAUNCH_AMOUNT_PAISE,
  MRP_AMOUNT_PAISE,
  TOKEN_AMOUNT_PAISE,
} from "@/config/site";
import { offerCopy } from "@/content/en-IN/offer";
import type { Offer, OfferCopy, RichTextString } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { formatInr } from "@/lib/format/inr";
import { KHEELONA_PLUS } from "../../../test/e2e/support/deviations";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { buildOffer, headlinePaise, offerPrices } from "./offer";

/* The offer view model (ADR-005, architecture §7; task 2.1 acceptance 3). Visible wording is
 * checked against the approved mockup, the only place it is shown (architecture §6.3); the
 * full-mode wording, which no mockup shows, against the copy pages (home.md "At a glance" and
 * "Phone sticky bar"; home.md fold 9 "Full mode"). Mockups are read as built
 * (mockup/<slug>.html, the files the parity specs open: icons inlined, partials included, so the
 * buy bar is Home's own). */

const doc = (path: string) => new DOMParser().parseFromString(readRepoFile(path), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const home = doc("mockup/home.html");
const product = doc("mockup/meet-kheelu.html");
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

  it("renders the D028 price sentence exactly as the mockup's hero, drawer and offer card", () => {
    const sentence = text(offer.sentence, offer);
    expect(sentence).toBe(norm(home.querySelector("#hero-price")?.textContent));
    expect(sentence).toBe(norm(home.querySelector(".kh-offer__fine")?.textContent));
    expect(sentence).toBe(
      "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    );
  });

  it("renders the sticky bar's two lines exactly as the buy bar partial", () => {
    expect(text(offer.sticky.big, offer)).toBe(norm(buybar.querySelector(".kh-buybar__big")?.textContent));
    expect(text(offer.sticky.small, offer)).toBe(norm(buybar.querySelector(".kh-buybar__small")?.textContent));
  });

  it("keeps the split on the offer card, as Home's card shows it", () => {
    const card = home.querySelector(".kh-offer")!;
    expect(offer.card.product).toBe(norm(card.querySelector(".kh-offer__product")?.textContent));
    expect(text(offer.card.priceNote, offer)).toBe(norm(card.querySelector(".kh-offer__prices .kh-body-s")?.textContent));
    const split = Array.from(card.querySelectorAll(".kh-offer__split > *")).map((el) => norm(el.textContent));
    expect(offer.card.split?.flatMap((row) => [text(row.label, offer), offer.prices[row.price]])).toEqual(split);
  });

  /* The product card's Kheelona+ perk reads D058 item 3's sentence since task 8b.1 (deviations.md V27): the mockup keeps
     the approved perk, and only that perk differs. */
  it("lists each placement's perks exactly as its card (Home fold 9, product fold 3; the product's Kheelona+ perk as D058 words it)", () => {
    const perks = (d: Document) => Array.from(d.querySelectorAll(".kh-offer__list li")).map((li) => norm(li.textContent));
    expect(offer.card.perks.home.map((p) => text(p.text, offer))).toEqual(perks(home));
    expect(perks(product)).toContain(KHEELONA_PLUS.perk);
    expect(offer.card.perks.product.map((p) => text(p.text, offer))).toEqual(perks(product).map((p) => (p === KHEELONA_PLUS.perk ? KHEELONA_PLUS.build : p)));
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

  it("renders the full-mode price sentence (home.md, At a glance)", () => {
    expect(text(offer.sentence, offer)).toBe("₹7,999 (incl. GST), paid in full when you order.");
  });

  it("renders the full-mode sticky bar (home.md, Phone sticky bar)", () => {
    expect(text(offer.sticky.big, offer)).toBe("₹7,999 (incl. GST)");
    expect(text(offer.sticky.small, offer)).toBe("Paid in full · Deliveries start mid-November");
  });

  it("omits the split and keeps the perks (G-08; home.md fold 9)", () => {
    expect("split" in offer.card).toBe(false);
    expect(text(offer.card.priceNote, offer)).toBe("(incl. GST)");
    expect(offer.card.perks).toEqual(buildOffer("token").card.perks);
  });

  it("never mentions the advance or the balance anywhere in its own lines", () => {
    const lines = [offer.sentence, offer.sticky.big, offer.sticky.small, offer.card.priceNote].map((l) => text(l, offer));
    for (const line of lines) {
      expect(line).not.toContain("₹499");
      expect(line).not.toContain("₹4,500");
      expect(line).not.toMatch(/refundable/i);
    }
  });
});

describe("the view model reads its words from the copy it is given", () => {
  it("uses another locale's copy when passed one (the hi-IN folder would)", () => {
    const copy: OfferCopy = {
      ...offerCopy,
      sentence: { token: "T {price:token}", full: "F {price:full}" },
    };
    const offer = buildOffer("token", copy);
    expect(text(offer.sentence, offer)).toBe("T ₹499");
  });
});
