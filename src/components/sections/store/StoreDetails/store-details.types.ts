import type { CtaHelp } from "@/components/sections/CtaBlock/cta-block.types";
import type { Copy, IconRef, ModeVariant, RichTextString, SitePath, TrustItem } from "@/content/types";

/* The store's checkout words and StoreDetails' configuration (task 5.15; components §2; store.md folds 3, 4 and 7).
 * The content module (content/en-IN/store/store-page.ts) writes them; the restyled PreorderForm and OrderSummary read
 * their own part (ADR-013: markup, classes, copy and presentation imports only). Every amount is a `{price:…}` token,
 * filled from the order the server priced (checkout-words.ts). */

/** The pre-order form's words (store.md fold 3). Field names, types and autocomplete are the form's own, frozen. */
export interface PreorderFormCopy {
  readonly labels: {
    readonly parentName: string;
    /** "Indian WhatsApp number": the +91 shown inside the field is decoration, so the label says "Indian". */
    readonly phone: string;
    readonly email: string;
    readonly childAge: string;
  };
  readonly hints: {
    /** The phone hint claims only what the consent row and the balance step say (store.md question 2). */
    readonly phone: ModeVariant<string>;
    readonly email: string;
    readonly childAge: string;
  };
  /** The consent row, verbatim, around its two policy links: lead, the terms link, the join, the refund link, the tail. */
  readonly consent: {
    readonly lead: string;
    readonly terms: string;
    readonly join: string;
    readonly refund: string;
    readonly tail: string;
  };
  /** Read after each link that opens in a new tab: " (opens in a new tab)". */
  readonly newTabNote: string;
  /** The line beside the pay button, in the form's own block: the D028 sentence, which carries the refund promise
   *  ("refundable until dispatch"); in full mode the full-price sentence and the refund promise in the page's words. */
  readonly price: ModeVariant<RichTextString>;
}

/** One row of the agreement card: its DS icon, the bold head and the note under it. */
export interface CheckoutRow {
  readonly icon: IconRef;
  readonly head: RichTextString;
  readonly note: RichTextString;
}

/** The agreement card, "What you are agreeing to" (store.md fold 4; DS gap G-11, composed). */
export interface OrderSummaryCopy {
  readonly title: string;
  readonly titleId: string;
  /** Today, later, and the refund, per mode. */
  readonly rows: ModeVariant<readonly [CheckoutRow, CheckoutRow, CheckoutRow]>;
  /** The delivery row's icon and note; its head is the delivery line the page passes. */
  readonly delivery: { readonly icon: IconRef; readonly note: string };
  /** The small print under the rows: Kheelona+, the price for the first units, delivery and the GST invoice. */
  readonly fine: ModeVariant<RichTextString>;
}

/** What sits beside the pay button after the price sentence (store.md fold 3): the full trust row, the payment window
 *  line and the help line. */
export interface PayBesideConfig {
  /** Home's full row (TRUST_FULL), each item opening its terms in a new tab on the marketing site. */
  readonly trust: readonly TrustItem[];
  readonly payment: Copy;
  /** "Rather talk to a person?" and the WhatsApp and call links (seller.help). */
  readonly help: CtaHelp;
}

/** D042's payments line with its chargeback link (store.md fold 7), the last line of the store page's main
 *  (wiki/qa/deviations.md V1: the store layout's policy links are a frozen checkout contract). */
export interface PaymentsLineConfig {
  readonly text: string;
  readonly link: { readonly label: string; readonly href: SitePath };
}

/** StoreDetails' own words: the details section's heading (store.md fold 3). */
export interface StoreDetailsConfig {
  /** The section's fragment ("details": the films' "Back to your details" links to it). */
  readonly id: string;
  readonly title: string;
  readonly titleId: string;
}
