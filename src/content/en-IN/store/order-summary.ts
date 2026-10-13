import type { OrderSummaryCopy } from "@/components/sections/store/StoreDetails/store-details.types";
import { CAP_UNITS_TEXT } from "@/config/site";
import { offerCopy } from "../offer";

/**
 * The agreement card's words, "What you are agreeing to" (store.md fold 4; task 5.15, moved here by task 4.8). A
 * words-only module, like the form's (preorder-form.ts): types, the Kheelona+ sentence (offer.ts) and the unit cap from
 * the checkout's own config, nothing else (client-words.test.ts). Every amount is a `{price:…}` token, filled from the
 * order the server priced (sections/store/StoreDetails/checkout-words.ts).
 */
export const orderSummaryCopy = {
  title: "What you are agreeing to",
  titleId: "agree-title",
  rows: {
    token: [
      { icon: "currency-inr", head: "{price:token} today", note: "A refundable advance, part of the {price:headline} price (incl. GST)." },
      {
        icon: "calendar-check",
        head: "{price:balance} before delivery",
        note: "The rest of the price, by a payment link we send on WhatsApp and by email. Never charged automatically.",
      },
      { icon: "arrow-counter-clockwise", head: "Refundable in full", note: "Ask any time before we dispatch your Kheelu. No fee, and no reason needed." },
    ],
    full: [
      { icon: "currency-inr", head: "{price:full} today", note: "The whole price, incl. GST." },
      { icon: "calendar-check", head: "Nothing due before delivery", note: "You have paid the whole price. No balance link, and nothing automatic." },
      { icon: "arrow-counter-clockwise", head: "Refundable in full", note: "Ask any time before we dispatch your Kheelu. No fee, and no reason needed." },
    ],
  },
  delivery: { icon: "truck", note: "Pre-orders go out first, in the order they were placed." },
  fine: {
    /* The cap once on the page, as an offer term, never a count (D041); its words are config's, as in faqs.ts. */
    token: `${offerCopy.plus} The price is {price:headline} (incl. GST) for the ${CAP_UNITS_TEXT}, and {price:full} (incl. GST) once they are gone. Delivery anywhere in India is included, and every order comes with a GST invoice.`,
    full: `${offerCopy.plus} The ${CAP_UNITS_TEXT} at {price:headline} have been reserved, and this order is at the {price:full} price (incl. GST). Delivery anywhere in India is included, and every order comes with a GST invoice.`,
  },
} as const satisfies OrderSummaryCopy;
