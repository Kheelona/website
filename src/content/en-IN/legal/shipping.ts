import kheeluFrontSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import type { LegalPage, RichTextString } from "@/content/types";
import { placeholder } from "@/lib/content/placeholder";
import { DELIVERY_TEXT } from "../delivery";
import { DEFAULT_OG } from "../organization";
import { FAULTY_REPORT_DAYS, PAYMENT_METHODS, RETURN_DAYS } from "../policies";
import { seller } from "../seller";

/**
 * The shipping and delivery policy, `/shipping` (task 5.14): the approved mockup `mockup/pages/shipping.html` (D046),
 * word for word, as wiki/site/pages/shipping.md words it after the legal review; rendered by LegalTemplate's notice
 * family (refund and shipping) from `src/app/(site)/shipping/page.tsx`.
 *
 * - A draft until the founder approves it after the independent review (D029): the draft note shows, the "Last updated"
 *   date is a placeholder, and the production build refuses the page (ADR-004).
 * - The delivery line is the one delivery value (D023): `{delivery}` in the page, and the meta description's words built
 *   from the same `DELIVERY_TEXT` (shipping.md "Notes for the build"). Never an arrival date, a transit time or the
 *   schema date (D022, D037).
 * - Amounts only as `{price:…}` tokens (D028); the balance lines are conditional, so they hold in both offer modes.
 * - The seller line and the grievance card are the template's, from seller.ts through src/lib/content/seller-lines.ts
 *   with their phrases kept together (task 4.3); the number, email and WhatsApp address of the help and customer-care
 *   lines from seller.ts; the payment methods and the 7-day windows from policies.ts. Nothing retyped.
 * - Placeholders exactly the copy page's: the approval date and the parcel lost in transit (founder question 1); the
 *   complaint reference under the grievance card is the template's (legal/shared.ts).
 * - The close links to Meet Kheelu with `shipping-learn` (architecture §8.3) and to the refund page; no pre-order
 *   button and no buy bar (strategy §5 policy row; the mockup's meta `"buybar": false`).
 */

const { phone, tel, whatsapp, email } = seller.support;

/** "message us on WhatsApp at <number>, or email <address>": the help line and customer care say it alike. */
const reachUs: RichTextString = `[message us on WhatsApp](${whatsapp}) at {nowrap:[${phone}](${tel})}, or email [${email}](mailto:${email})`;

/** The delivery line inside a sentence of the meta description ("…in India: deliveries start mid-November, …"). */
const deliveryInSentence = `${DELIVERY_TEXT.charAt(0).toLowerCase()}${DELIVERY_TEXT.slice(1)}`;

export const shippingPage = {
  slug: "shipping",
  meta: {
    title: "Kheelu shipping and delivery in India · Kheelona",
    description: `Kheelu delivery and shipping in India: ${deliveryInSentence}, delivery is included anywhere in India, and you get tracking at dispatch.`,
    og: DEFAULT_OG,
  },
  status: "draft",
  approvedOn: placeholder(null, "the date the founder approves this page"),
  /* Fold 0 and 1. Kheelu's note: the live line, founder-approved 2026-08-22; the board shows from 900 px only, so on
   * phones the short version starts in the first screen (legal review, should-fix 6). */
  hero: {
    title: "Shipping and delivery, in {hand:plain words.}",
    lead: "How Kheelu delivery and shipping work: when it leaves, where it goes, and what it costs to get to you. Which is nothing extra.",
    art: {
      tone: "blue",
      layers: [
        { image: { src: starSun, alt: "" }, right: 32, bottom: 8, width: 22, rotate: 10 },
        { image: { src: kheeluFrontSticker, alt: "" }, left: 7, bottom: 0, width: 36, rotate: -5 },
        { doodle: { name: "chalk-spark-lines" }, left: 6, top: 9, width: 11, rotate: -24 },
      ],
      sticker: { tone: "sun", tilt: 4, variant: "hand", lines: ["I’ll help pack.", "Mostly by sitting", "in the box."] },
    },
  },
  /* Fold 2: the plain-English summary in five lines, then the delivery help line. */
  summary: {
    kind: "trust",
    title: "The {hand:short version.}",
    items: [
      { icon: "truck", title: "{delivery}.", body: "Pre-orders are served first, in the order they were placed." },
      { icon: "map-pin", title: "Anywhere in India, included.", body: "Delivery is in the price. Nothing to pay at the door." },
      { icon: "package", title: "Tracking from dispatch.", body: "When your Kheelu leaves us, we send you the courier and the tracking details." },
      {
        icon: "currency-inr",
        title: "Reserved with the refundable {price:token}?",
        body: "Before dispatch, we send a payment link for the remaining {price:balance} of the {price:headline} price (incl. GST).",
      },
      {
        icon: "arrow-counter-clockwise",
        title: "Refundable until dispatch.",
        body: "Change your mind before it leaves us, and you get back everything you’ve paid.",
      },
    ],
  },
  help: `Questions about delivery? Call or ${reachUs}.`,
  /* Folds 3 and 4: the contents list and the seven sections. */
  parts: [
    {
      id: "when",
      title: "When your Kheelu ships.",
      blocks: [
        { kind: "p", text: "{delivery}. Pre-orders are served first, in the order they were placed." },
        {
          kind: "p",
          text: "We can’t promise an arrival date, because how long delivery takes depends on where you are. If you need it by a particular date, call or message us before you pre-order.",
        },
      ],
    },
    {
      id: "where",
      title: "Where we deliver, and what it costs.",
      blocks: [
        {
          kind: "p",
          text: "Anywhere in India, to the address you give us. Delivery is included in the price, and prices include GST, so the amount you see is the amount you pay: nothing added at the door, and nothing to settle with the courier.",
        },
        {
          kind: "p",
          text: "Every order is paid online, so there’s no cash on delivery. We don’t ship outside India: your delivery address needs to be in India.",
        },
      ],
    },
    {
      id: "balance",
      title: "The balance, before dispatch.",
      blocks: [
        {
          kind: "p",
          text: `If you reserved with the refundable {price:token} advance, the remaining {price:balance} of the {price:headline} price (incl. GST) is due before delivery. When your Kheelu is ready to leave us, we send you a payment link on WhatsApp and by email. Pay it by ${PAYMENT_METHODS}, and your Kheelu is dispatched.`,
        },
        { kind: "p", text: "If you paid the full price when you ordered, nothing more is due: your Kheelu just ships." },
        {
          kind: "p",
          text: "Nothing is ever charged automatically, and we never keep a card on file. If you decide not to pay the balance, that counts as a cancellation and your {price:token} is refunded in full ([see the refund policy](/refund#before-dispatch)).",
        },
      ],
    },
    {
      id: "tracking",
      title: "Dispatch and tracking.",
      blocks: [
        {
          kind: "p",
          text: "We message you before your Kheelu is dispatched, so a delivery never turns up out of the blue. Once it’s on its way, we send you the courier and the tracking details.",
        },
        {
          kind: "p",
          text: "We don’t promise a number of days in transit. It depends on where you are, and we’d rather send you a real tracking link than a promise about days.",
        },
      ],
    },
    {
      id: "address",
      title: "Your delivery address.",
      blocks: [
        {
          kind: "p",
          text: "You add your delivery address on the confirmation page, right after you pay. You can change it any time before dispatch: use the address link in your order email, or call or message us on WhatsApp, or email us, with your order number. If you’ve moved since you pre-ordered, tell us before you pay the balance.",
        },
      ],
    },
    {
      id: "problems",
      title: "If delivery is late, or something goes wrong.",
      /* Bold leads, not subheadings, so the five cases scan as one list on a phone. A parcel lost after dispatch is
       * covered by no ruling yet (founder question 1): a placeholder that keeps the refund option and names no days. */
      blocks: [
        {
          kind: "p",
          lead: "If the date moves.",
          text: "If deliveries can’t start when we said, you hear it from us first, and you can cancel for a full refund, even if you were happy to wait before.",
        },
        {
          kind: "p",
          lead: "If we can’t deliver.",
          text: "If we can’t supply your Kheelu for any reason, you get back everything you’ve paid: the money, not a credit or a voucher.",
        },
        {
          kind: "p",
          lead: "If it arrives damaged.",
          text: `Tell us within ${FAULTY_REPORT_DAYS} days of receiving it, and you can have a replacement or a full refund. We arrange the pickup, free.`,
        },
        {
          kind: "p",
          lead: "If it doesn’t arrive.",
          text: "If the tracking stops moving or the parcel doesn’t reach you, call or message us with your order number. {ph:what we do if a parcel is lost in transit, for example “we send a replacement, or refund you in full if you’d rather” (no number of days)}",
        },
        {
          kind: "p",
          lead: "And once it arrives,",
          text: `you can still return it within ${RETURN_DAYS} days of delivery, no questions asked ([see the refund policy](/refund#returns)).`,
        },
      ],
    },
    {
      id: "seller",
      title: "Who you’re buying from, and complaints.",
      blocks: [
        { kind: "seller" },
        { kind: "p", text: `Customer care: call or ${reachUs}. You order on kheelona.com and pay on store.kheelona.com.` },
        {
          kind: "p",
          text: "If you’re unhappy with how we’ve handled your delivery, you can make a formal complaint to our grievance officer (also on the [contact page](/contact#grievance)).",
        },
        { kind: "grievance" },
      ],
    },
  ],
  /* Fold 5: no pre-order button on a policy page. */
  close: {
    title: "Still {hand:deciding?}",
    lead: "See what Kheelu does, what you get and what you pay.",
    actions: [
      { label: "Meet Kheelu", href: "/products/kheelu", cta: "shipping-learn" },
      { label: "Refunds, returns and warranty", href: "/refund" },
    ],
  },
} satisfies LegalPage;
