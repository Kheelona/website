import type { PayBesideConfig, StoreDetailsConfig } from "@/components/sections/store/StoreDetails/store-details.types";
import type { PaymentsLineConfig } from "@/components/sections/store/StorePaymentsLine/store-payments-line.types";
import type { StoreTopConfig } from "@/components/sections/store/StoreTop/store-top.types";
import type { Meta, RichTextString } from "@/content/types";
import type { TierResult } from "@/lib/store/tiers";
import { DEFAULT_OG } from "../organization";
import { notFoundPage } from "../pages/not-found";
import { STORE_AGE_BAND, storePage, type StorePageContent } from "./store-page";

/**
 * The event page, store.kheelona.com/e/<tier>?sig=…, and the store's dead end (task 6.1; structure §5 row "(no
 * mockup)"; architecture §16.1). Neither has a mockup: an event tier's checkout reuses the store page's folds and
 * words (wiki/site/pages/store.md), by reference; the event page's own lines and the dead end keep the live pages'
 * words (wiki/site/checkout.md "Variants" and "Failure and edge states"), checked against the freeze tag in
 * event-page.test.ts. (The Ideabaaz partner page that also read them is gone: /ideabaaz is a store dead end, D054 item 7.)
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
  /** The line under the h1; a refused link has one per reason instead (`RefusedPanelCopy`). */
  readonly body?: string;
  /** The button to the store's own page, "/", when the panel offers it. */
  readonly action: string;
  /** The WhatsApp line under it: "Or" and the link after the button; the link alone, capitalised, without one. */
  readonly help: { readonly or: string; readonly link: string; readonly linkAlone: string; readonly tail: string };
}

/** Why the store refused a link: the checkout's own reasons (lib/store/tiers.ts, a type-only import). */
export type TierRefusal = Extract<TierResult, { ok: false }>["reason"];

/** A refused link's panel: the store panel's words, and the body for each refusal reason (store.md, "Event link
 *  refused"; CMO review C m1, task 7.1c), printed in place of the frozen `tierRefusalMessage` text, whose default line
 *  names the token amount with no total (D028) and says "on this page" of a button that leaves for the store. */
export interface RefusedPanelCopy extends StorePanelCopy {
  readonly reasons: Readonly<Record<TierRefusal, string>>;
}

/** What an event tier's checkout shows (TierCheckout): the store page's folds, its h1 under the tier's price name. */
export interface TierCheckoutContent {
  /** StoreTop's words without the eyebrow, which is composed per tier (`eyebrow`). */
  readonly top: Omit<StoreTopConfig, "eyebrow">;
  /** The first screen's eyebrow: the tier's own price name ("Bangalore expo price", from its row), then the store's
   *  age band, so the band stays on the first screen (CMO review C m2, task 7.1c). Inline syntax (the band no-wrap). */
  readonly eyebrow: (tierLabel: string) => RichTextString;
  readonly details: StoreDetailsConfig;
  readonly beside: PayBesideConfig;
  readonly questions: StorePageContent["questions"];
  readonly payments: PaymentsLineConfig;
}

/** The live WhatsApp line of a refused event link. */
const sortItOut = { or: "Or", link: "message us on WhatsApp", linkAlone: "Message us on WhatsApp", tail: "and a person will sort it out with you." };

const note = storePage.notConfigured.note;

/** The tail every refused link's body ends on (store.md, "Event link refused"): the live "…at the usual price on this
 *  page" with "on this page" replaced, since the button leaves for the store. */
const usualPrice = "at the usual price in our store.";
/** The two mode refusals share one line, with no amount and no count (D041): true in either mode. */
const notOnOffer = `The price on this link is not on offer right now. You can still pre-order ${usualPrice}`;

export const eventPage = {
  meta: {
    /* The store's title, and the first sentence of its description: no amount, since the link sets its own price. */
    title: storePage.meta.title,
    description: "Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7.",
    og: DEFAULT_OG,
  },
  checkout: {
    /* The store's first screen but its eyebrow, which is composed per tier below. */
    top: {
      title: storePage.top.title,
      titleId: storePage.top.titleId,
      image: storePage.top.image,
      priceId: storePage.top.priceId,
      trust: storePage.top.trust,
    },
    /* The tier's price name, then the store's own band ("Ages 3 to 7"): two approved words, no new copy. Beside the
       small Kheelu on a phone the eyebrow wraps (at 360 and 390 px), so the band is kept whole. The band alone, without
       the store's "Screen-free AI toy" (task Q2.12): an event page's words stay as they were. */
    eyebrow: (tierLabel: string) => `${tierLabel} · {nowrap:${STORE_AGE_BAND}}`,
    details: storePage.details,
    beside: storePage.beside,
    questions: storePage.questions,
    payments: storePage.payments,
  },
  /* A link the store refuses (bad signature, unknown or ended tier, allocation gone, a stale mode): the live heading,
     button and WhatsApp line, and one body per reason (store.md, "Event link refused"; task 7.1c). */
  refused: {
    titleId: "store-title",
    title: "That link will not work.",
    action: "Pre-order at the usual price",
    help: sortItOut,
    reasons: {
      expired: `This event link has expired. You can still pre-order ${usualPrice}`,
      full: `The allocation for this event has all gone. You can still pre-order ${usualPrice}`,
      /* A signed link with no live tier behind it (switched off, removed, or set without a real amount): its signature
         passed, so "not one of ours" would be false. */
      unknown: `The price on this event link is not available. You can still pre-order ${usualPrice}`,
      /* No signature, or one that does not match: forged, or a QR link cut short when forwarded, so the line says both
         (the founder, D057 item 4). */
      "bad-signature": `This link is incomplete, or not one of ours. You can pre-order ${usualPrice}`,
      "cap-reached": notOnOffer,
      "not-yet": notOnOffer,
    },
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
  readonly refused: RefusedPanelCopy;
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
