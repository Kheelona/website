import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import type { FaqSectionConfig } from "@/components/sections/FaqSection/faq-section.types";
import type { FilmsStripConfig } from "@/components/sections/FilmsStrip/films-strip.types";
import type { PayBesideConfig, StoreDetailsConfig } from "@/components/sections/store/StoreDetails/store-details.types";
import type { PaymentsLineConfig } from "@/components/sections/store/StorePaymentsLine/store-payments-line.types";
import type { StoreTopConfig } from "@/components/sections/store/StoreTop/store-top.types";
import type { Meta } from "@/content/types";
import type { FaqId } from "../faqs";
import { DEFAULT_OG } from "../organization";
import { seller } from "../seller";
import { TRUST_COMPACT, TRUST_FULL, trustItems } from "../trust";
import { paymentsLine } from "./payments-line";

/**
 * The store page, store.kheelona.com (task 5.15; structure §5 row store.html; wiki/site/pages/store.md). Token-mode
 * words are the approved mockup's (mockup/store.html, D046); full mode, which no mockup shows, is the copy page's.
 * Every amount is a `{price:…}` token: the page's own folds take them from the offer, and the checkout's (the form and
 * the agreement card) from the order the server priced (sections/store/StoreDetails/checkout-words.ts). Shared facts
 * are read by reference: the trust items (trust.ts), the help line (seller.ts), the payments line (payments-line.ts);
 * the FAQs (faqs.ts) and the films (films.ts) by the page; the D028 sentence, the Kheelona+ line (offer.ts) and the
 * new-tab note (navigation.ts) by the checkout's words modules.
 *
 * Restyle only (ADR-013, brief §4.4): field names, validation, the consent row, the payment flow and the pay button's
 * wording stay the form's own. The two parts the checkout reads live in words-only modules (task 4.8):
 * `preorderFormCopy` in preorder-form.ts and `orderSummaryCopy` in order-summary.ts, so the pre-order form's client
 * bundle carries neither this module nor its imports (seller.ts, organization.ts, trust.ts, the image's URL).
 */

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
  /* D042's store-footer line, shared with /thanks (payments-line.ts). */
  payments: paymentsLine,
  notConfigured: {
    title: "Pre-orders open here shortly.",
    body: "Our store is not switched on yet. Nothing is wrong at your end, and nothing has been charged.",
    action: "Message us on WhatsApp",
    note: "We will reserve one for you by hand in the meantime.",
  },
} as const satisfies StorePageContent;
