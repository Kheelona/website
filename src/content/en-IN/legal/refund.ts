import kheeluFrontSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import sunSun from "@ds/assets/Shapes/sun-sun.svg";
import type { LegalPage } from "@/content/types";
import { placeholder } from "@/lib/content/placeholder";
import { DEFAULT_OG } from "../organization";
import {
  BANK_REFUND_WORKING_DAYS,
  FAULTY_REPORT_DAYS,
  NO_EXCHANGES,
  PAYMENT_TERMS,
  REFUND_AFTER_RETURN_WORKING_DAYS,
  REFUND_START_WORKING_DAYS,
  RETURN_DAYS,
  WARRANTY_MONTHS,
} from "../policies";
import { seller } from "../seller";

/**
 * The refund page, `/refund` (task 5.13): the approved mockup `mockup/pages/refund.html` (D046), word for word, in the
 * shape LegalTemplate renders in its `notice` family (structure §5); meta as wiki/site/pages/refund.md words it, with the
 * legal review of 2026-10-11 applied. A draft until the founder approves it as legal text (D029): the template shows the
 * draft note, and the production build refuses a draft (ADR-004).
 *
 * - Fold 1: the recommended H1 with its Hand accent, the lede, and Kheelu's note on a board from 900 px (founder
 *   question 7, kept as recommended).
 * - Fold 2: the short version (six items) and the help line under it.
 * - Fold 4: the eight numbered parts with the copy page's ids. D042's three lines: the exchange line (part 4), the
 *   payment terms as part 6's bold lead, and the refund start before dispatch (part 1). Part 6's chargeback paragraph
 *   is `#chargeback`, where the store page's payments line links (legal review must-fix 1; deviation V1).
 * - The grievance card (D032 verbatim, with the complaint-reference note) and the seller line come from seller.ts
 *   through the template (src/lib/content/seller-lines.ts, its phrases kept together in this family), never retyped.
 * - Fold 5: "Still deciding?" with Meet Kheelu (`refund-learn`) and the shipping page; no pre-order button (strategy §5).
 *
 * Shared facts are read, never retyped: the number, WhatsApp, call and email links from seller.ts, every policy number
 * and D042 line from policies.ts, every amount from the offer (`{price:…}`), the delivery line from `{delivery}`.
 */

const { phone, tel, whatsapp, email } = seller.support;

/** The ways to reach a person, linked, as the page names them three times (the help line, part 1, part 8). */
const REACH = `call or [message us on WhatsApp](${whatsapp}) at {nowrap:[${phone}](${tel})}, or email [${email}](mailto:${email})`;

/** The bank's own time after we start a refund (D042), the range kept on one line. */
const BANK = `your bank takes {nowrap:${BANK_REFUND_WORKING_DAYS}} working days`;

/** D033's Rule 7(4) line: the short version's item and part 3's lead say it in the same words. */
const FAULTY = { question: "Faulty or not as described?", answer: "You can have a replacement or a full refund." } as const;

/**
 * Part 1's balance paragraph. A reservation's total is the launch price (refund.md section 1, `LAUNCH_PRICE`), which
 * `{price:headline}` names only while reservations are open; once the store sells at the full price, existing
 * reservations still owe their balance, so that mode leaves the total out rather than name the full price as it.
 */
const BALANCE_TERMS =
  "is due before delivery, by a payment link we send on WhatsApp and by email. Not paying it counts as a cancellation, and we treat it exactly like one: we ask you twice over two weeks, and if we don’t hear from you, we release your Kheelu and refund your {price:token} in full. Nothing is ever charged automatically.";

export const refundPage = {
  slug: "refund",
  meta: {
    title: "Kheelu returns, refunds and warranty · Kheelona",
    description: `Kheelu refund policy: cancel before dispatch for a full refund, return it within ${RETURN_DAYS} days of delivery, no questions asked, and a ${WARRANTY_MONTHS}-month warranty.`,
    og: DEFAULT_OG,
  },
  status: "draft",
  approvedOn: placeholder(null, "the date the founder approves this page"),
  hero: {
    title: "Refunds, returns and warranty, in {hand:plain words.}",
    lead: "Kheelu’s refund policy: you can change your mind. This page explains exactly how, and what happens to your money.",
    art: {
      tone: "blue",
      layers: [
        { image: { src: sunSun, alt: "" }, right: 30, bottom: 6, width: 24 },
        { image: { src: kheeluFrontSticker, alt: "" }, left: 7, bottom: 0, width: 36, rotate: -5 },
        { doodle: { name: "chalk-heart" }, left: 7, top: 8, width: 10, rotate: -12 },
      ],
      sticker: { tone: "sun", tilt: 4, variant: "hand", lines: ["Changed your mind?", "That’s allowed."] },
    },
  },
  summary: {
    kind: "trust",
    title: "The {hand:short version.}",
    items: [
      {
        icon: "arrow-counter-clockwise",
        title: "Before dispatch: a full refund.",
        body: "Cancel any time before your Kheelu leaves us and get back everything you’ve paid. No fee, no reason needed.",
      },
      {
        icon: "package",
        title: `After delivery: ${RETURN_DAYS} days to return.`,
        body: "No questions asked. Opened is fine, if everything comes back undamaged. We arrange the pickup, free. {ph:confirm a change-of-mind return is refunded in full}",
      },
      {
        icon: "clock",
        title: "When your money comes back.",
        body: `After a cancellation, we start your refund within ${REFUND_START_WORKING_DAYS} working days. After a return, it’s processed within ${REFUND_AFTER_RETURN_WORKING_DAYS} working days of your Kheelu reaching us. Then ${BANK}.`,
      },
      { icon: "shield-check", title: FAULTY.question, body: FAULTY.answer },
      {
        icon: "calendar-check",
        title: `${WARRANTY_MONTHS}-month warranty.`,
        body: "On manufacturing defects. We repair it, or replace it if the repair doesn’t work. {ph:confirm a full refund if neither works}",
      },
      {
        icon: "currency-inr",
        title: "No exchanges. No payment fees.",
        body: "Nothing recurring, and nothing is ever charged automatically.",
      },
    ],
  },
  help: `To cancel, return or claim: ${REACH}, with your order number.`,
  parts: [
    {
      id: "before-dispatch",
      title: "Cancelling before dispatch.",
      blocks: [
        {
          kind: "p",
          text: "Everything you’ve paid to pre-order is refundable in full at any time before your Kheelu is dispatched: the refundable {price:token} advance, or the whole price if you paid in full. There is no fee, no deduction, and no reason you have to give.",
        },
        {
          kind: "p",
          text: `To cancel, ${REACH}, with your order number (it starts with {nowrap:KH-}). A message or an email is enough: you never have to call. We start your refund within ${REFUND_START_WORKING_DAYS} working days of your request; ${BANK}.`,
        },
        { kind: "h3", text: "If you don’t pay the balance" },
        {
          kind: "p",
          text: {
            token: `On a reservation, the remaining {price:balance} of the {price:headline} price (incl. GST) ${BALANCE_TERMS}`,
            full: `On a reservation, the remaining {price:balance} (incl. GST) ${BALANCE_TERMS}`,
          },
        },
        { kind: "h3", text: "If the date moves, or we can’t deliver" },
        {
          kind: "p",
          text: "{delivery}. If that date moves, you hear it from us first, and you can cancel for a full refund, even if you were happy to wait before. If we can’t supply your Kheelu for any reason, you get back everything you’ve paid: the money, not a credit or a voucher.",
        },
      ],
    },
    {
      id: "returns",
      title: `${RETURN_DAYS}-day returns, no questions asked.`,
      blocks: [
        {
          kind: "p",
          text: `Changed your mind? Return your Kheelu within ${RETURN_DAYS} days of delivery, no questions asked. Opened is fine. Just send back everything that came in the box, undamaged: the plush toy, the charger and the quick-start card, in their box.`,
        },
        { kind: "h3", text: "How a return works" },
        {
          kind: "list",
          variant: "steps",
          items: [
            `Call or message us on WhatsApp, or email us, within ${RETURN_DAYS} days of delivery, with your order number.`,
            "We arrange the pickup from your address, free.",
            `Once your Kheelu reaches us and qualifies for return, your refund is processed within ${REFUND_AFTER_RETURN_WORKING_DAYS} working days. {ph:confirm how much comes back, for example “a full refund of everything you paid”}`,
          ],
        },
        {
          kind: "p",
          text: "{ph:what happens if a returned Kheelu comes back damaged or with something missing, and what counts as damage on a plush toy a child has played with for a few days}",
        },
      ],
    },
    {
      id: "faulty",
      title: "Faulty, damaged or not as described.",
      blocks: [
        { kind: "callout", icon: "shield-check", tone: "sun", lead: `${FAULTY.question} ${FAULTY.answer}` },
        { kind: "h3", text: `In the first ${FAULTY_REPORT_DAYS} days` },
        {
          kind: "p",
          text: `If your Kheelu arrives damaged or faulty, or isn’t what we described, tell us within ${FAULTY_REPORT_DAYS} days of receiving it, and you can have a replacement or a full refund. The conditions in [section 2](#returns) (undamaged, complete, in the box) are for change-of-mind returns only: they don’t apply to a faulty, damaged or not-as-described Kheelu.`,
        },
        { kind: "h3", text: `The ${WARRANTY_MONTHS}-month warranty` },
        {
          kind: "p",
          text: `Kheelu has a ${WARRANTY_MONTHS}-month warranty on manufacturing defects, from the day it’s delivered. {ph:confirm the warranty starts on the delivery date} If a defect shows up after the first ${FAULTY_REPORT_DAYS} days, we repair it, or replace it if the repair doesn’t work. {ph:confirm this line: “If a repair and a replacement don’t put it right, you get a full refund.”} The warranty doesn’t cover drops, water damage or misuse.`,
        },
        { kind: "h3", text: "Pickup and timing" },
        {
          kind: "p",
          text: "Pickup is free for every faulty unit and every warranty claim. {ph:confirm that sending the repaired or replacement Kheelu back to you is free too} How long a repair or a replacement takes depends on where in India you are, so we don’t promise a number of days. To claim, call or message us on WhatsApp, or email us, with your order number and what’s wrong.",
        },
      ],
    },
    {
      id: "exchanges",
      title: "Exchanges.",
      blocks: [
        {
          kind: "p",
          text: `${NO_EXCHANGES} If your Kheelu is faulty or not as described, that isn’t an exchange: [section 3](#faulty) gives you a replacement or a full refund.`,
        },
      ],
    },
    {
      id: "refund-timing",
      title: "How and when your money comes back.",
      blocks: [
        {
          kind: "p",
          text: "Every refund goes back to the card, UPI ID or bank account you paid from, because that’s the only place a payment can be reversed to.",
        },
        {
          kind: "list",
          items: [
            { lead: "Cancelled before dispatch:", text: `we start your refund within ${REFUND_START_WORKING_DAYS} working days of your request.` },
            {
              lead: "Returned, faulty or not as described:",
              text: `your refund is processed within ${REFUND_AFTER_RETURN_WORKING_DAYS} working days of your Kheelu reaching us. {ph:confirm whether the ${REFUND_AFTER_RETURN_WORKING_DAYS} working days is when we start the refund, before your bank’s ${BANK_REFUND_WORKING_DAYS}, or when the money reaches you}`,
            },
            { lead: "Then your bank:", text: `once we’ve started it, ${BANK}.` },
          ],
        },
      ],
    },
    {
      id: "payments",
      title: "Payments, fees and chargebacks.",
      blocks: [
        { kind: "p", lead: PAYMENT_TERMS },
        {
          kind: "p",
          text: "You can pay by UPI, debit or credit card, or net banking. Prices include GST, and every order comes with a GST invoice. Your card number, UPI ID and bank details go to Razorpay, not to us, and nothing is ever charged automatically.",
        },
        {
          kind: "p",
          id: "chargeback",
          text: "If a payment goes wrong, call or message us with your order number. You can also raise a dispute (a chargeback) with your bank or card issuer. Razorpay’s own customer support is at [razorpay.com/support](https://razorpay.com/support/): choose “Customer”.",
        },
      ],
    },
    {
      id: "complaints",
      title: "Complaints.",
      blocks: [
        {
          kind: "p",
          text: "If you’re unhappy with how we’ve handled a refund, a return or a repair, you can make a formal complaint to our grievance officer.",
        },
        { kind: "grievance" },
      ],
    },
    {
      id: "seller",
      title: "Who you’re buying from.",
      blocks: [
        { kind: "seller" },
        { kind: "p", text: `Customer care: ${REACH}. You order on kheelona.com and pay on store.kheelona.com.` },
      ],
    },
  ],
  close: {
    title: "Still {hand:deciding?}",
    lead: "See what Kheelu does, what you get and what you pay.",
    actions: [
      { label: "Meet Kheelu", href: "/products/kheelu", cta: "refund-learn" },
      { label: "Shipping and delivery", href: "/shipping" },
    ],
  },
} satisfies LegalPage;
