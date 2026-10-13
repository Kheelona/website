import type { PreorderFormCopy } from "@/components/sections/store/StoreDetails/store-details.types";
import { navigation } from "../navigation";
import { offerCopy } from "../offer";

/**
 * The pre-order form's words (store.md fold 3; task 5.15, moved here by task 4.8). A words-only module: the form is a
 * client island, so this module ships to the browser with what it imports, which is types, the D028 sentence
 * (offer.ts) and the new-tab note (navigation.ts) only; the seller and organisation data stay on the server
 * (client-words.test.ts). Every amount is a `{price:…}` token, filled from the order the server priced
 * (sections/store/StoreDetails/checkout-words.ts).
 *
 * Restyle only (ADR-013, brief §4.4): field names, validation, the consent row, the payment flow and the pay button's
 * wording stay the form's own.
 */
export const preorderFormCopy = {
  labels: {
    parentName: "Your name",
    phone: "Indian WhatsApp number",
    email: "Email",
    childAge: "Your child’s age",
  },
  hints: {
    /* Question 2, option (a): the hint claims only the consent row and the published balance step. */
    phone: {
      token: "For messages about your order, including the link to pay the balance before dispatch.",
      full: "For messages about your order.",
    },
    email: "We email your confirmation here.",
    /* The age-band review, row 9: "made for children aged 3 to 7", and an example inside the band. */
    childAge: "Kheelu is made for children aged 3 to 7. Just the number is fine, like 4.",
  },
  consent: {
    lead: "I accept the",
    terms: "pre-order terms",
    join: "and the",
    refund: "refund policy",
    tail: ", and I am happy to hear about my own order on WhatsApp.",
  },
  newTabNote: navigation.labels.newTabNote,
  price: {
    token: offerCopy.sentence.token,
    /* The refund promise stays in the pay button's block in both modes (architecture §16.3, the JSX contract): in full
       mode, in the store FAQ's own full-mode words (store.md fold 5, faqs.ts "paying-today"). */
    full: `${offerCopy.sentence.full} Until we dispatch your Kheelu, all of it is refundable.`,
  },
} as const satisfies PreorderFormCopy;
