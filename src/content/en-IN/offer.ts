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

/** Each offer-card perk, written once; the cards below list them in their own order. `origin` (task 8c.5; D061 item 10,
 *  confirming D034): the seller's origin line, "Made in India", which the footer and the product page's Country of
 *  origin already state, with the DS house icon, the closest of the DS set to a home-grown product (map-pin is the
 *  delivery perk's). Typed here, not read from seller.ts: the checkout's client words load this module, and the seller
 *  data stays out of the browser (store/client-words.test.ts); src/lib/offer/offer.test.ts holds the two equal. */
const perk = {
  delivery: { icon: "truck", text: "{delivery}" },
  box: { icon: "package", text: "In the box: Kheelu plush toy, charger and quick-start card" },
  plus: { icon: "star", text: PLUS },
  anywhere: { icon: "map-pin", text: "Delivery anywhere in India, included" },
  invoice: { icon: "check-circle", text: "A GST invoice with every order" },
  origin: { icon: "house", text: "Made in India" },
} as const satisfies Readonly<Record<string, IconText>>;

/** Home's card (fold 9): the delivery line first, then three perks; Made in India last (task 8c.5, after Gate A). */
const homePerks: readonly IconText[] = [perk.delivery, perk.box, perk.anywhere, perk.invoice, perk.origin];

/** The product page's card (fold 3): five perks, Kheelona+ among them; Made in India last (task 8c.5, after Gate A). */
const productPerks: readonly IconText[] = [perk.box, perk.plus, perk.anywhere, perk.delivery, perk.invoice, perk.origin];

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
    perks: { home: homePerks, product: productPerks },
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
