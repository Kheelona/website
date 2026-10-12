import type { IconText, OfferCopy } from "@/content/types";

/**
 * The offer's words in both modes (architecture §6.1, ADR-005); src/lib/offer/offer.ts picks the
 * live mode. Every amount is a `{price:…}` token resolved from the checkout's own constants, and
 * the delivery line is `{delivery}`.
 *
 * Sources: the approved mockup for everything it shows (home.html hero, fold 9, the buy bar
 * partial; meet-kheelu.html fold 3); the copy pages for the full mode, which no mockup shows
 * (home.md "At a glance", "Phone sticky bar" and fold 9 "Full mode"; D028 wording).
 */

/** Home's card (fold 9): the delivery line first, then three perks. */
const homePerks: readonly IconText[] = [
  { icon: "truck", text: "{delivery}" },
  { icon: "package", text: "In the box: Kheelu plush toy, charger and quick-start card" },
  { icon: "map-pin", text: "Delivery anywhere in India, included" },
  { icon: "check-circle", text: "A GST invoice with every order" },
];

/** The product page's card (fold 3): five perks, Kheelona+ among them. */
const productPerks: readonly IconText[] = [
  { icon: "package", text: "In the box: Kheelu plush toy, charger and quick-start card" },
  { icon: "star", text: "6 months of Kheelona+ included: stories, poems, jingles, languages and the parent app" },
  { icon: "map-pin", text: "Delivery anywhere in India, included" },
  { icon: "truck", text: "{delivery}" },
  { icon: "check-circle", text: "A GST invoice with every order" },
];

export const offerCopy = {
  /* D028, option (d): beside every chilli button. Full mode: home.md "At a glance". */
  sentence: {
    token:
      "Reserve yours for {price:token} today, refundable until dispatch, then pay {price:balance} before delivery: {price:headline} in total (incl. GST).",
    full: "{price:full} (incl. GST), paid in full when you order.",
  },
  /* The phone buy bar (partials/buybar.html); full mode: home.md "Phone sticky bar". */
  sticky: {
    token: { big: "{price:token} today", small: "refundable · {price:headline} total (incl. GST)" },
    full: { big: "{price:full} (incl. GST)", small: "Paid in full · {delivery}" },
  },
  card: {
    product: "Kheelu",
    /* Full mode: the composed block's price reads "₹7,999 (incl. GST)" (home.md fold 9). */
    priceNote: { token: "incl. GST", full: "(incl. GST)" },
    split: [
      { label: "Today, refundable", price: "token" },
      { label: "Before delivery", price: "balance" },
    ],
    perks: { home: homePerks, product: productPerks },
  },
  /* D027's first sentence only (D041 F7), under Home's card. */
  plus: "Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app.",
} satisfies OfferCopy;
