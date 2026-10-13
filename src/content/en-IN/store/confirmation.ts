import type { AddressFormCopy, AddressStepCopy } from "@/components/sections/store/AddressStep/address-step.types";
import type { ConfirmationHeadCopy } from "@/components/sections/store/ConfirmationHead/confirmation-head.types";
import type { ThanksStepCopy } from "@/components/sections/store/ConfirmationHead/slot-text";
import type { HelpBlockCopy } from "@/components/sections/store/HelpBlock/help-block.types";
import type { OrderRowsCopy } from "@/components/sections/store/OrderRows/order-rows.types";
import { SHIP_DATE_TEXT } from "@/config/site";
import type { HelpLineCopy, Meta, RichTextString } from "@/content/types";
import { DELIVERY_TEXT } from "../delivery";
import { DEFAULT_OG } from "../organization";
import { RETURN_DAYS } from "../policies";
import { seller } from "../seller";

/**
 * The store confirmation, `store.kheelona.com/thanks` (task 5.16; structure §3.3, §5; ADR-013). Words as the approved
 * mockup prints them (mockup/pages/store-confirmation.html: the paid state of a token order with no address yet), and
 * for the states it does not show, as the copy page gives them (wiki/site/pages/store-confirmation.md, "as live": the
 * page's words at the freeze tag; the link-needed help line with the call option, D032).
 *
 * Every amount and the email come from the order row, never from the store's current mode, so they are not `{price:…}`
 * tokens here: the words around them are slot text (`ConfirmationHead/slot-text.ts`) and the page fills the slots with
 * the values it derives from the row. Its title and description are the copy page's; the share card is the site's.
 */

/** The address form's words. Its own export, because the form is a client island and imports this alone: the page's
 *  other words (`confirmation` below) are left out of the browser bundle. This module's imports are not: the build keeps
 *  the seller facts and the organization node they read in the form's client chunk (public data, about 1-2 KB gzip),
 *  and every page that loads the `@/features/preorder` barrel's chunk carries them too. Only a words-only module for the
 *  form, importing types alone, would keep them out. */
export const addressForm = {
  labels: {
    line1: "Flat or house, and street",
    line2: "Landmark or area (optional)",
    pincode: "PIN code",
    city: "City or town",
    state: "State",
  },
  statePlaceholder: "Choose your state",
  save: "Save my address",
  saving: "Saving…",
  reassurance:
    "Your order is already safe. This can wait if you are in the middle of something, and the link in your email brings you straight back here.",
  saved: {
    title: "We have your address.",
    before: "That is everything we need. You can change it any time before dispatch: ",
    link: "message us on WhatsApp",
    after: " and we will update it.",
    change: "Change it here instead",
  },
} as const satisfies AddressFormCopy;

/** The shape of this module: a head per state, the order card, the address step, the next steps by tier, the help
 *  fold, and the two other states' words. */
export interface ConfirmationContent {
  readonly meta: Meta;
  readonly head: {
    readonly paid: ConfirmationHeadCopy;
    readonly created: ConfirmationHeadCopy;
    readonly linkNeeded: ConfirmationHeadCopy;
  };
  /** Under the link-needed lede: a person who can find the order. */
  readonly linkNeededHelp: HelpLineCopy;
  /** A signed link whose order will not load (the store's not-found panel). */
  readonly cannotOpen: { readonly title: string; readonly body: string };
  readonly order: OrderRowsCopy;
  readonly address: { readonly empty: AddressStepCopy; readonly saved: AddressStepCopy };
  readonly next: {
    readonly heading: { readonly title: RichTextString };
    /** A token order: the balance is paid before dispatch, so step 2 comes before step 3. */
    readonly token: readonly ThanksStepCopy[];
    readonly full: readonly ThanksStepCopy[];
  };
  readonly help: HelpBlockCopy;
}

const email = seller.support.email;
const checkEmail = { tone: "sun", title: "Check your email", body: ["Your confirmation has your order number and a link back to this page."] } as const;
const trackDelivery = { tone: "chilli", title: "Track your delivery", body: ["When it is dispatched, we send you the courier and tracking details."] } as const;

export const confirmation = {
  meta: {
    title: "Your Kheelu is reserved · Kheelona",
    description: "Your Kheelu pre-order: order number, what you paid, what is still due and where to deliver it.",
    og: DEFAULT_OG,
  },
  head: {
    paid: {
      icon: "check-circle",
      eyebrow: "Pre-order confirmed",
      heading: "Your Kheelu is reserved.",
      lede: [
        "We have your ",
        { slot: "amount" },
        ", and your place in the queue is held from the moment you paid. Your confirmation is on its way to ",
        { slot: "email" },
        ".",
      ],
    },
    created: {
      icon: "clock",
      eyebrow: "Confirming your payment",
      heading: "Thank you. We are confirming it now.",
      lede: [
        "Your payment is with our provider and we are waiting for their confirmation, which usually takes a few seconds. Nothing is lost if you refresh, and your order number is below either way.",
      ],
    },
    linkNeeded: {
      icon: "envelope-simple",
      eyebrow: "Your pre-order is safe",
      heading: "We need your link again.",
      lede: [
        "This page opens from the link in your confirmation email, and that link has either expired or was opened somewhere else. Open the most recent email from us and tap it again, and you will land back here.",
      ],
    },
  },
  linkNeededHelp: {
    lead: "Cannot find the email?",
    contact: `${seller.help.contact} and a person will pull up your order and add your address for you.`,
  },
  cannotOpen: {
    title: "We cannot open that order right now.",
    body: "Your link is fine. The order behind it did not load, which is ours to sort out and not yours.",
  },
  order: {
    heading: "Your order",
    number: "Order number",
    paid: "Paid today",
    due: {
      term: "Due before delivery",
      balance: [{ slot: "balance" }, ", of the ", { slot: "price" }, " price (incl. GST)"],
      nothing: "Nothing. You have paid in full",
    },
    delivery: {
      early: { term: "Ships from", value: SHIP_DATE_TEXT },
      current: { term: "Delivery", value: DELIVERY_TEXT },
    },
  },
  address: {
    empty: {
      heading: "Where should it go?",
      intro:
        "One last thing, and it takes under a minute. If you would rather do it later, the link in your email brings you straight back here.",
    },
    saved: {
      heading: "Your delivery address",
      intro: "This is where your Kheelu will go. Change it any time before dispatch.",
    },
  },
  next: {
    heading: { title: "What happens next" },
    token: [
      checkEmail,
      {
        tone: "blue",
        title: "Pay the balance",
        body: [
          "When your Kheelu is ready to leave us, we send a payment link for the ",
          { slot: "balance" },
          " balance on WhatsApp and by email.",
        ],
      },
      trackDelivery,
    ],
    full: [
      checkEmail,
      { tone: "blue", title: "Nothing more to pay", body: ["You have paid in full, so there is no balance link to wait for."] },
      trackDelivery,
    ],
  },
  help: {
    heading: "Need anything?",
    contact: `${seller.help.contact}, quoting your order number, or email [${email}](mailto:${email}).`,
    undo: `Changed your mind? Until we dispatch your Kheelu, message us with your order number and we refund everything you paid, with no fee and no reason needed. After delivery, you can still return it within ${RETURN_DAYS} days, no questions asked. Nothing is ever charged automatically.`,
    refund: { label: "Refunds and returns", href: "/refund" },
  },
} as const satisfies ConfirmationContent;
