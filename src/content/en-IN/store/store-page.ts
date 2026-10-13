import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import type { FaqSectionConfig } from "@/components/sections/FaqSection/faq-section.types";
import type { FilmsStripConfig } from "@/components/sections/FilmsStrip/films-strip.types";
import type {
  OrderSummaryCopy,
  PayBesideConfig,
  PaymentsLineConfig,
  PreorderFormCopy,
  StoreDetailsConfig,
} from "@/components/sections/store/StoreDetails/store-details.types";
import type { StoreTopConfig } from "@/components/sections/store/StoreTop/store-top.types";
import { CAP_UNITS_TEXT } from "@/config/site";
import type { Meta } from "@/content/types";
import type { FaqId } from "../faqs";
import { navigation } from "../navigation";
import { offerCopy } from "../offer";
import { DEFAULT_OG } from "../organization";
import { seller } from "../seller";
import { TRUST_COMPACT, TRUST_FULL, trustItems } from "../trust";

/**
 * The store page, store.kheelona.com (task 5.15; structure §5 row store.html; wiki/site/pages/store.md). Token-mode
 * words are the approved mockup's (mockup/store.html, D046); full mode, which no mockup shows, is the copy page's.
 * Every amount is a `{price:…}` token: the page's own folds take them from the offer, and the checkout's (the form and
 * the agreement card) from the order the server priced (sections/store/StoreDetails/checkout-words.ts). Shared facts
 * are read by reference: the D028 sentence and the Kheelona+ line (offer.ts), the trust items (trust.ts), the help
 * line (seller.ts), the new-tab note (navigation.ts); the FAQs (faqs.ts) and the films (films.ts) by the page.
 *
 * Restyle only (ADR-013, brief §4.4): field names, validation, the consent row, the payment flow and the pay button's
 * wording stay the form's own. The two parts the checkout reads (`preorderFormCopy`, `orderSummaryCopy`) are their own
 * exports, so the pre-order form's client bundle drops `storePage`; it still carries this module's imports (seller.ts,
 * organization.ts, trust.ts and the image's URL), measured on the 5.15 review build. Moving the two exports to a module
 * that imports only offer.ts and navigation.ts is a follow-up for the wave-5 close's ruling on the store script budget.
 */

/** The pre-order form's words (store.md fold 3). */
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

/** The agreement card, "What you are agreeing to" (store.md fold 4). */
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

/** The store page's own folds. */
export interface StorePageContent {
  readonly meta: Meta;
  readonly top: StoreTopConfig;
  readonly details: StoreDetailsConfig;
  readonly beside: PayBesideConfig;
  readonly questions: { readonly heading: Extract<FaqSectionConfig, { variant: "store" }>["heading"]; readonly items: readonly FaqId[] };
  readonly films: Omit<FilmsStripConfig, "films" | "labels">;
  readonly payments: PaymentsLineConfig;
  /** The store before its keys are in place (and on beta, D051): it says "shortly" rather than failing. */
  readonly notConfigured: { readonly title: string; readonly body: string; readonly action: string; readonly note: string };
}

export const storePage = {
  meta: {
    title: "Pre-order Kheelu · Kheelona",
    description: {
      token:
        "Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7. {price:headline} (incl. GST); reserve yours today with a refundable {price:token}.",
      full: "Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7. {price:full} (incl. GST), with delivery anywhere in India included.",
    },
    og: DEFAULT_OG,
  },
  top: {
    eyebrow: "Ages 3 to 7",
    title: "Pre-order Kheelu.",
    titleId: "store-title",
    image: { src: kheeluFront, alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy." },
    priceId: "store-price",
    trust: TRUST_COMPACT.map((id) => trustItems[id]),
  },
  details: { id: "details", title: "Your details", titleId: "details-title" },
  beside: {
    trust: TRUST_FULL.map((id) => trustItems[id]),
    payment: "The button opens Razorpay’s payment window. We never see your card details, and nothing is ever charged automatically.",
    help: { lead: "Rather talk to a person?", contact: seller.help.contact },
  },
  questions: {
    heading: { title: "Questions before you pay", id: "faq-title" },
    items: ["paying-today", "change-my-mind", "store-arrival", "how-to-pay"],
  },
  films: {
    /* Home's heading and lede (D040: claim only what the films show; the live heading is banned, claims §4). */
    heading: { title: "See Kheelu {nowrap:{hand:ask},} in real homes.", lead: "Real children in real homes. Press play on any of them.", id: "ask-title" },
    proof: { text: "Kids doing the talking. Parents, in their own words.", size: "body-s" },
    posters: "lazy",
    link: { label: "Back to your details", href: "#details", iconEnd: "caret-up" },
  },
  payments: {
    /* D042's store-footer line; the chargeback how-to lives on /refund under #chargeback. */
    text: "No payment fees. Nothing recurring. Payments by Razorpay.",
    link: { label: "How to raise a chargeback with your bank", href: "/refund#chargeback" },
  },
  notConfigured: {
    title: "Pre-orders open here shortly.",
    body: "Our store is not switched on yet. Nothing is wrong at your end, and nothing has been charged.",
    action: "Message us on WhatsApp",
    note: "We will reserve one for you by hand in the meantime.",
  },
} as const satisfies StorePageContent;
