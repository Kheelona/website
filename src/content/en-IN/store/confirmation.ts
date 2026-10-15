import type { AddressStepCopy } from "@/components/sections/store/AddressStep/address-step.types";
import type { ConfirmationHeadCopy } from "@/components/sections/store/ConfirmationHead/confirmation-head.types";
import type { ThanksStepCopy } from "@/components/sections/store/ConfirmationHead/slot-text";
import type { HelpBlockCopy } from "@/components/sections/store/HelpBlock/help-block.types";
import type { OrderRowsCopy } from "@/components/sections/store/OrderRows/order-rows.types";
import type { PaymentsLineConfig } from "@/components/sections/store/StorePaymentsLine/store-payments-line.types";
import { SHIP_DATE_TEXT } from "@/config/site";
import type { HelpLineCopy, Meta, RichTextString } from "@/content/types";
import { DELIVERY_TEXT } from "../delivery";
import { DEFAULT_OG } from "../organization";
import { RETURN_DAYS } from "../policies";
import { seller } from "../seller";
import { storeNotFound } from "./event-page";
import { paymentsLine } from "./payments-line";

/**
 * The store confirmation, `store.kheelona.com/thanks` (task 5.16; structure §3.3, §5; ADR-013). Words as the approved
 * mockup prints them (mockup/pages/store-confirmation.html: the paid state of a token order with no address yet), and
 * for the states it does not show, as the copy page gives them (wiki/site/pages/store-confirmation.md, "as live": the
 * page's words at the freeze tag; the link-needed help line with the call option, D032), the number and the call off
 * since D063 item 2 (D064 item 11; task Q2.3): WhatsApp and the email stay.
 *
 * Every amount and the email come from the order row, never from the store's current mode, so they are not `{price:…}`
 * tokens here: the words around them are slot text (`ConfirmationHead/slot-text.ts`) and the page fills the slots with
 * the values it derives from the row. Its title and description are the copy page's; the share card is the site's.
 * The address form's words are a words-only module of their own (address-form.ts, task 4.8): the form is a client
 * island, and this module's imports (the seller facts, the organisation node) stay out of its browser chunk.
 */

/** The shape of this module: a head per state, the order card, the address step, the next steps by tier, the help
 *  fold, the two other states' words, and the payments line that closes main. */
export interface ConfirmationContent {
  readonly meta: Meta;
  /** The browser tab per state (store-confirmation.md, At a glance; CMO review C m5, task 7.1c): "reserved" only once
   *  the payment is confirmed; the confirming, link-needed and cannot-open states take the other. */
  readonly titles: { readonly paid: string; readonly other: string };
  readonly head: {
    readonly paid: ConfirmationHeadCopy;
    readonly created: ConfirmationHeadCopy;
    readonly linkNeeded: ConfirmationHeadCopy;
  };
  /** Under the link-needed lede: a person who can find the order. */
  readonly linkNeededHelp: HelpLineCopy;
  /** A signed link whose order will not load (the store's not-found panel): its title and body, then a WhatsApp button
   *  and the line under it (CMO review C m4, task 7.1c), by email since D063 item 2 took the call off the store. */
  readonly cannotOpen: { readonly title: string; readonly body: string; readonly action: string; readonly call: RichTextString };
  readonly order: OrderRowsCopy;
  readonly address: { readonly empty: AddressStepCopy; readonly saved: AddressStepCopy };
  readonly next: {
    readonly heading: { readonly title: RichTextString };
    /** A token order: the balance is paid before dispatch, so step 2 comes before step 3. */
    readonly token: readonly ThanksStepCopy[];
    readonly full: readonly ThanksStepCopy[];
  };
  readonly help: HelpBlockCopy;
  /** The store footer's payments line, the last line of main in every state (wiki/qa/deviations.md V1; task 4.8): the
   *  store page's own, read from payments-line.ts. */
  readonly payments: PaymentsLineConfig;
}

const email = seller.support.email;
/** The mockup's title (the paid state): the share card's too. */
const reservedTitle = "Your Kheelu is reserved · Kheelona";
/** The store's dead end's words, which this state printed as its muted line until task 7.1c. */
const deadEndHelp = storeNotFound.panel.help;
const checkEmail = { tone: "sun", title: "Check your email", body: ["Your confirmation has your order number and a link back to this page."] } as const;
const trackDelivery = { tone: "chilli", title: "Track your delivery", body: ["When it is dispatched, we send you the courier and tracking details."] } as const;

export const confirmation = {
  meta: {
    title: reservedTitle,
    description: "Your Kheelu pre-order: order number, what you paid, what is still due and where to deliver it.",
    og: DEFAULT_OG,
  },
  titles: { paid: reservedTitle, other: "Your Kheelu pre-order · Kheelona" },
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
    contact: `${seller.support.message} and a person will pull up your order and add your address for you.`,
  },
  cannotOpen: {
    title: "We cannot open that order right now.",
    body: "Your link is fine. The order behind it did not load, which is ours to sort out and not yours.",
    /* The store's not-switched-on button (store-page.ts notConfigured.action), the same words as the dead end's link. */
    action: deadEndHelp.linkAlone,
    /* "Or", the second way to reach a person, then the live tail: a person who can find the order. The email since the
       call came off the store (D063 item 2, D064 item 11; task Q2.3); the key keeps its name for the frozen page. */
    call: `${deadEndHelp.or} email [${email}](mailto:${email}) ${deadEndHelp.tail}`,
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
    contact: `${seller.support.message}, quoting your order number, or email [${email}](mailto:${email}).`,
    undo: `Changed your mind? Until we dispatch your Kheelu, message us with your order number and we refund everything you paid, with no fee and no reason needed. After delivery, you can still return it within ${RETURN_DAYS} days, no questions asked. Nothing is ever charged automatically.`,
    refund: { label: "Refunds and returns", href: "/refund" },
  },
  payments: paymentsLine,
} as const satisfies ConfirmationContent;
