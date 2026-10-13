import { DEFAULT_OG } from "@/content/en-IN/organization";
import { placeholder } from "@/lib/content/placeholder";
import kheeluFrontSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import sunSun from "@ds/assets/Shapes/sun-sun.svg";
import type { LegalPage } from "@/layouts/LegalTemplate/legal-template.types";

/* Fixture content for the legal template's parity run (task 4.3; structure §1 "test/fixtures/legal/"): every word of
 * mockup/pages/refund.html (the approved Gate A page, D046), copied into the content shape, so the template can be
 * compared with the mockup before the real refund module exists (task 5.1x writes that from wiki/site/pages/refund.md).
 * Never shipped: nothing in src/ imports it except the template's own test and story. */
export const refundFixture = {
  slug: "refund",
  meta: {
    title: "Kheelu returns, refunds and warranty · Kheelona",
    description: "Kheelu refund policy: cancel before dispatch for a full refund, return it within 7 days of delivery, no questions asked, and a 6-month warranty.",
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
        {
          image: { src: sunSun, alt: "" },
          right: 30,
          bottom: 6,
          width: 24,
        },
        {
          image: { src: kheeluFrontSticker, alt: "" },
          left: 7,
          bottom: 0,
          width: 36,
          rotate: -5,
        },
        {
          doodle: {
            name: "chalk-heart",
          },
          left: 7,
          top: 8,
          width: 10,
          rotate: -12,
        },
      ],
      sticker: {
        tone: "sun",
        tilt: 4,
        variant: "hand",
        lines: [
          "Changed your mind?",
          "That’s allowed.",
        ],
      },
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
        title: "After delivery: 7 days to return.",
        body: "No questions asked. Opened is fine, if everything comes back undamaged. We arrange the pickup, free. {ph:confirm a change-of-mind return is refunded in full}",
      },
      {
        icon: "clock",
        title: "When your money comes back.",
        body: "After a cancellation, we start your refund within 2 working days. After a return, it’s processed within 7 working days of your Kheelu reaching us. Then your bank takes {nowrap:5-7} working days.",
      },
      {
        icon: "shield-check",
        title: "Faulty or not as described?",
        body: "You can have a replacement or a full refund.",
      },
      {
        icon: "calendar-check",
        title: "6-month warranty.",
        body: "On manufacturing defects. We repair it, or replace it if the repair doesn’t work. {ph:confirm a full refund if neither works}",
      },
      {
        icon: "currency-inr",
        title: "No exchanges. No payment fees.",
        body: "Nothing recurring, and nothing is ever charged automatically.",
      },
    ],
  },
  help: "To cancel, return or claim: call or [message us on WhatsApp](https://wa.me/919187546483) at {nowrap:[+91 91875 46483](tel:+919187546483)}, or email [hello@kheelona.com](mailto:hello@kheelona.com), with your order number.",
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
          text: "To cancel, call or [message us on WhatsApp](https://wa.me/919187546483) at {nowrap:[+91 91875 46483](tel:+919187546483)}, or email [hello@kheelona.com](mailto:hello@kheelona.com), with your order number (it starts with {nowrap:KH-}). A message or an email is enough: you never have to call. We start your refund within 2 working days of your request; your bank takes {nowrap:5-7} working days.",
        },
        {
          kind: "h3",
          text: "If you don’t pay the balance",
        },
        {
          kind: "p",
          text: "On a reservation, the remaining {price:balance} of the {price:launch} price (incl. GST) is due before delivery, by a payment link we send on WhatsApp and by email. Not paying it counts as a cancellation, and we treat it exactly like one: we ask you twice over two weeks, and if we don’t hear from you, we release your Kheelu and refund your {price:token} in full. Nothing is ever charged automatically.",
        },
        {
          kind: "h3",
          text: "If the date moves, or we can’t deliver",
        },
        {
          kind: "p",
          text: "{delivery}. If that date moves, you hear it from us first, and you can cancel for a full refund, even if you were happy to wait before. If we can’t supply your Kheelu for any reason, you get back everything you’ve paid: the money, not a credit or a voucher.",
        },
      ],
    },
    {
      id: "returns",
      title: "7-day returns, no questions asked.",
      blocks: [
        {
          kind: "p",
          text: "Changed your mind? Return your Kheelu within 7 days of delivery, no questions asked. Opened is fine. Just send back everything that came in the box, undamaged: the plush toy, the charger and the quick-start card, in their box.",
        },
        {
          kind: "h3",
          text: "How a return works",
        },
        {
          kind: "list",
          variant: "steps",
          items: [
            "Call or message us on WhatsApp, or email us, within 7 days of delivery, with your order number.",
            "We arrange the pickup from your address, free.",
            "Once your Kheelu reaches us and qualifies for return, your refund is processed within 7 working days. {ph:confirm how much comes back, for example “a full refund of everything you paid”}",
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
        {
          kind: "callout",
          icon: "shield-check",
          tone: "sun",
          lead: "Faulty or not as described? You can have a replacement or a full refund.",
        },
        {
          kind: "h3",
          text: "In the first 7 days",
        },
        {
          kind: "p",
          text: "If your Kheelu arrives damaged or faulty, or isn’t what we described, tell us within 7 days of receiving it, and you can have a replacement or a full refund. The conditions in [section 2](#returns) (undamaged, complete, in the box) are for change-of-mind returns only: they don’t apply to a faulty, damaged or not-as-described Kheelu.",
        },
        {
          kind: "h3",
          text: "The 6-month warranty",
        },
        {
          kind: "p",
          text: "Kheelu has a 6-month warranty on manufacturing defects, from the day it’s delivered. {ph:confirm the warranty starts on the delivery date} If a defect shows up after the first 7 days, we repair it, or replace it if the repair doesn’t work. {ph:confirm this line: “If a repair and a replacement don’t put it right, you get a full refund.”} The warranty doesn’t cover drops, water damage or misuse.",
        },
        {
          kind: "h3",
          text: "Pickup and timing",
        },
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
          text: "No exchanges: return it within 7 days and order again. If your Kheelu is faulty or not as described, that isn’t an exchange: [section 3](#faulty) gives you a replacement or a full refund.",
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
            {
              lead: "Cancelled before dispatch:",
              text: "we start your refund within 2 working days of your request.",
            },
            {
              lead: "Returned, faulty or not as described:",
              text: "your refund is processed within 7 working days of your Kheelu reaching us. {ph:confirm whether the 7 working days is when we start the refund, before your bank’s 5-7, or when the money reaches you}",
            },
            {
              lead: "Then your bank:",
              text: "once we’ve started it, your bank takes {nowrap:5-7} working days.",
            },
          ],
        },
      ],
    },
    {
      id: "payments",
      title: "Payments, fees and chargebacks.",
      blocks: [
        {
          kind: "p",
          lead: "No payment fees. Nothing recurring. Payments by Razorpay.",
        },
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
        {
          kind: "grievance",
        },
      ],
    },
    {
      id: "seller",
      title: "Who you’re buying from.",
      blocks: [
        {
          kind: "seller",
        },
        {
          kind: "p",
          text: "Customer care: call or [message us on WhatsApp](https://wa.me/919187546483) at {nowrap:[+91 91875 46483](tel:+919187546483)}, or email [hello@kheelona.com](mailto:hello@kheelona.com). You order on kheelona.com and pay on store.kheelona.com.",
        },
      ],
    },
  ],
  close: {
    title: "Still {hand:deciding?}",
    lead: "See what Kheelu does, what you get and what you pay.",
    actions: [
      {
        label: "Meet Kheelu",
        href: "/products/kheelu",
        cta: "refund-learn",
      },
      {
        label: "Shipping and delivery",
        href: "/shipping",
      },
    ],
  },
} satisfies LegalPage;
