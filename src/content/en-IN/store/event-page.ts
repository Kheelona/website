import type { PayBesideConfig, StoreDetailsConfig } from "@/components/sections/store/StoreDetails/store-details.types";
import type { PaymentsLineConfig } from "@/components/sections/store/StorePaymentsLine/store-payments-line.types";
import type { StoreTopConfig } from "@/components/sections/store/StoreTop/store-top.types";
import type { Meta } from "@/content/types";
import { DEFAULT_OG } from "../organization";
import { notFoundPage } from "../pages/not-found";
import { storePage, type StorePageContent } from "./store-page";

/**
 * The event page, store.kheelona.com/e/<tier>?sig=…, and the store's dead end (task 6.1; structure §5 row "(no
 * mockup)"; architecture §16.1). Neither has a mockup: an event tier's checkout reuses the store page's folds and
 * words (wiki/site/pages/store.md), by reference; the event page's own lines and the dead end keep the live pages'
 * words (wiki/site/checkout.md "Variants" and "Failure and edge states"), checked against the freeze tag in
 * event-page.test.ts. The partner page (partner-page.ts) reads its checkout and its not-configured state from here.
 *
 * Every amount an event page shows is its tier's, priced on the server and filled into the store's `{price:…}`
 * tokens (app/store/_components/TierCheckout.tsx); none is typed here, and the meta names none, so a shared event
 * link never previews another price (D028).
 */

/** The words of a store panel (app/store/_components/NotFoundPanel.tsx): every store state that is not the form. */
export interface StorePanelCopy {
  /** The h1's id, which names the panel's section. */
  readonly titleId: string;
  readonly title: string;
  /** The line under the h1; a refused link's comes from the checkout (tiers.ts `tierRefusalMessage`) instead. */
  readonly body?: string;
  /** The button to the store's own page, "/", when the panel offers it. */
  readonly action: string;
  /** The WhatsApp line under it: "Or" and the link after the button; the link alone, capitalised, without one. */
  readonly help: { readonly or: string; readonly link: string; readonly linkAlone: string; readonly tail: string };
}

/** What an event tier's checkout shows (TierCheckout): the store page's folds, its h1 under the tier's price name. */
export interface TierCheckoutContent {
  /** StoreTop's words without the eyebrow: that is the tier's own price name ("Bangalore expo price"), from its row. */
  readonly top: Omit<StoreTopConfig, "eyebrow">;
  readonly details: StoreDetailsConfig;
  readonly beside: PayBesideConfig;
  readonly questions: StorePageContent["questions"];
  readonly payments: PaymentsLineConfig;
}

/** The live WhatsApp line of a refused event link (and of the ended partner page). */
const sortItOut = { or: "Or", link: "message us on WhatsApp", linkAlone: "Message us on WhatsApp", tail: "and a person will sort it out with you." };

const note = storePage.notConfigured.note;

export const eventPage = {
  meta: {
    /* The store's title, and the first sentence of its description: no amount, since the link sets its own price. */
    title: storePage.meta.title,
    description: "Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7.",
    og: DEFAULT_OG,
  },
  checkout: {
    /* The store's first screen but its eyebrow ("Ages 3 to 7"), whose place the tier's price name takes. */
    top: {
      title: storePage.top.title,
      titleId: storePage.top.titleId,
      image: storePage.top.image,
      priceId: storePage.top.priceId,
      trust: storePage.top.trust,
    },
    details: storePage.details,
    beside: storePage.beside,
    questions: storePage.questions,
    payments: storePage.payments,
  },
  /* A link the store refuses (bad signature, unknown or ended tier, allocation gone, a stale mode): the live words. */
  refused: {
    titleId: "store-title",
    title: "That link will not work.",
    action: "Pre-order at the usual price",
    help: sortItOut,
  },
  /* The store before its keys are in place, and on beta (D051): the store page's own state (store.md, Other states). A
     button to the store would lead to the same words, so the WhatsApp action and the note make one line. */
  notConfigured: {
    titleId: "store-title",
    title: storePage.notConfigured.title,
    body: storePage.notConfigured.body,
    action: "Pre-order at the usual price",
    help: { ...sortItOut, linkAlone: storePage.notConfigured.action, tail: `and ${note.charAt(0).toLowerCase()}${note.slice(1)}` },
  },
} as const satisfies {
  readonly meta: Meta;
  readonly checkout: TierCheckoutContent;
  readonly refused: StorePanelCopy;
  readonly notConfigured: StorePanelCopy;
};

/**
 * The store's dead end: what the store host shows for a path with no page behind it (the `[...rest]` catch-all, at
 * 200 in the store chrome: lib/store/host.ts) and at its not-found boundary. The panel's words are the live
 * NotFoundPanel's; it offers a person, because its reader may have paid and be looking for their own order.
 */
const deadEndBody =
  "The link may have expired, or it may never have been ours. If you were trying to reach an order you have already placed, we can open it for you.";

export const storeNotFound = {
  meta: {
    /* The site 404's title (wiki/site/pages/404.md), and the panel's own body. */
    title: notFoundPage.meta.title,
    description: deadEndBody,
    og: DEFAULT_OG,
  },
  panel: {
    titleId: "store-title",
    title: "That page is not here.",
    body: deadEndBody,
    action: "Go to the pre-order page",
    help: { or: "Or", link: "message us on WhatsApp", linkAlone: "Message us on WhatsApp", tail: "with your order number and a person will find it." },
  },
} as const satisfies { readonly meta: Meta; readonly panel: StorePanelCopy };
