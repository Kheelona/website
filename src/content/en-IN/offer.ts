import type { IconText, OfferCopy } from "@/content/types";
import { share } from "./share";

/**
 * The offer's words in both modes (architecture §6.1, ADR-005); src/lib/offer/offer.ts picks the
 * live mode. Every amount is a `{price:…}` token resolved from the checkout's own constants, and
 * the delivery line is `{delivery}`.
 *
 * Sources: the approved mockup for everything it shows (home.html hero, fold 9, the buy bar
 * partial; meet-kheelu.html fold 3); the copy pages for the full mode, which no mockup shows
 * (home.md "At a glance", "Phone sticky bar" and fold 9 "Full mode"; D028 wording). Kheelona+ is
 * the founder's D058 item 3 sentence, in both places (task 8b.1; home.md fold 9, meet-kheelu.md
 * fold 3): the parent app is free, Kheelona+ a paid subscription on top of it, and no feature list.
 *
 * Task 8c.2 (D061 item 3, after Gate A): the later price on both offer cards, in token mode only, as a plain line (never
 * struck through, no counter, no "save"; PRICE-01, DARK-01), and the share link under both cards (share.ts).
 *
 * Task Q2.8 (D065 item 3, the founder: "no need to mention about GST and other technical things at all places"; the main
 * session's ruling 3 of the selling update, 2026-10-15): GST and the payment breakdown only at checkout. Beside every
 * button on the selling pages the short price line (`priceLine`); the buy bar says "in total" without GST; the card's
 * amount takes no note. D028's long sentence (`sentence`) stays the checkout's: the store's first screen, the pre-order
 * form, /terms and /pricing.md read it.
 */

/** D058 item 3, verbatim: which features stay free is not decided, so the sentence lists none. */
const PLUS = "Every Kheelu comes with 6 months of Kheelona+, our paid subscription, on top of the free parent app.";

/** The small line under the offer cards' perks since task Q2.9 (the D2C plan v2 §2 fold 7; D058 item 3: a paid
 *  subscription on top of the free parent app, no feature list): the perk itself says "6 months of Kheelona+ included".
 *  Since task Q2.13 both cards print it inside the card, before the button (ui/OfferCard's `note`; plan §3 fold 3), from
 *  the pages' OfferSection config (pages/home.ts, products/kheelu/page.ts). */
export const PLUS_NOTE = "Kheelona+ is our paid subscription, on top of the free parent app.";

/**
 * The offer cards' one perk list since task Q2.9 (the selling update; the D2C plan v2 §2 fold 7, the CMO's m8: one order
 * on both cards, Home's): the delivery line first, with the dispatch order ("Order of dispatch", facts.md, EXTERNAL),
 * because "when does it come?" is the first pre-order doubt; the box; delivery anywhere in India; 6 months of Kheelona+
 * and "Nothing renews without you." (D065 item 6, G30); "Made in India" last (task 8c.5; D061 item 10, confirming D034:
 * the seller's origin line, typed here, not read from seller.ts, because the checkout's client words load this module and
 * the seller data stays out of the browser, store/client-words.test.ts; src/lib/offer/offer.test.ts holds the two equal),
 * with the DS house icon (map-pin is the delivery perk's). "A GST invoice with every order" left the cards: GST only at
 * checkout (D065 item 3), where the store's "How can I pay?" answer says it.
 */
const PERKS: readonly IconText[] = [
  { icon: "truck", text: "{delivery}. Pre-orders go out first, in the order they were placed." },
  { icon: "package", text: "In the box: Kheelu plush toy, charger and quick-start card" },
  { icon: "map-pin", text: "Delivery anywhere in India, included" },
  { icon: "star", text: "6 months of Kheelona+ included. Nothing renews without you." },
  { icon: "house", text: "Made in India" },
];

export const offerCopy = {
  /* D028, option (d): the checkout's sentence (the store's first screen and the pre-order form, /terms, /pricing.md).
     Full mode: home.md "At a glance". */
  sentence: {
    token:
      "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
    full: "{price:full} (incl. GST), paid in full when you order.",
  },
  /* D065 item 3 (task Q2.8): beside every "Pre-order Kheelu" on the selling pages (the heroes, the CTA blocks, the closes,
     the drawer, the offer card's fine print). */
  priceLine: {
    token: "{price:token} today, refundable. {price:headline} in total.",
    full: "{price:full} in total, paid in full when you order.",
  },
  card: {
    product: "Kheelu",
    split: [
      { label: "Today, refundable", price: "token" },
      { label: "Before delivery", price: "balance" },
    ],
    /* One list for both placements (task Q2.9; CMO m8). */
    perks: { home: PERKS, product: PERKS },
    /* D061 item 3, verbatim: token mode only (the view model leaves it out in full mode, when the later price is the
       price). */
    later: "{price:headline} for the first 500 units. {price:full} once they are gone.",
  },
  /* The phone buy bar (partials/buybar.html); full mode, which no mockup shows: the D2C plan v2 §1.2 (SPA 7: the copy
     page decides it). No GST on it (D065 item 3; task Q2.8): the token mode's small line and the full mode's amount
     both say "in total". */
  sticky: {
    token: { big: "{price:token} today", small: "refundable · {price:headline} in total" },
    full: { big: "{price:full} in total", small: "Paid in full · {delivery}" },
  },
  /* Under Home's card, and at the start of the store's small print and /terms section 3; nothing after six months (D041
     F7). */
  plus: PLUS,
  /* Under both offer cards (D061; share.ts). */
  share,
} satisfies OfferCopy;
