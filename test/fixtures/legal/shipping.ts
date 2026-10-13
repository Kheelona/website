import { DEFAULT_OG } from "@/content/en-IN/organization";
import { placeholder } from "@/lib/content/placeholder";
import kheeluFrontSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import type { LegalPage } from "@/layouts/LegalTemplate/legal-template.types";

/* Fixture content for the legal template's parity run (task 4.3; structure §1 "test/fixtures/legal/"): every word of
 * mockup/pages/shipping.html (the approved Gate A page, D046), copied into the content shape, so the template can be
 * compared with the mockup before the real shipping module exists (task 5.1x writes that from wiki/site/pages/shipping.md).
 * Never shipped: nothing in src/ imports it except the template's own test and story. */
export const shippingFixture = {
  slug: "shipping",
  meta: {
    title: "Kheelu shipping and delivery in India · Kheelona",
    description: "Kheelu delivery and shipping in India: deliveries start mid-November, delivery is included anywhere in India, and you get tracking at dispatch.",
    og: DEFAULT_OG,
  },
  status: "draft",
  approvedOn: placeholder(null, "the date the founder approves this page"),
  hero: {
    title: "Shipping and delivery, in {hand:plain words.}",
    lead: "How Kheelu delivery and shipping work: when it leaves, where it goes, and what it costs to get to you. Which is nothing extra.",
    art: {
      tone: "blue",
      layers: [
        {
          image: { src: starSun, alt: "" },
          right: 32,
          bottom: 8,
          width: 22,
          rotate: 10,
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
            name: "chalk-spark-lines",
          },
          left: 6,
          top: 9,
          width: 11,
          rotate: -24,
        },
      ],
      sticker: {
        tone: "sun",
        tilt: 4,
        variant: "hand",
        lines: [
          "I’ll help pack.",
          "Mostly by sitting",
          "in the box.",
        ],
      },
    },
  },
  summary: {
    kind: "trust",
    title: "The {hand:short version.}",
    items: [
      {
        icon: "truck",
        title: "{delivery}.",
        body: "Pre-orders are served first, in the order they were placed.",
      },
      {
        icon: "map-pin",
        title: "Anywhere in India, included.",
        body: "Delivery is in the price. Nothing to pay at the door.",
      },
      {
        icon: "package",
        title: "Tracking from dispatch.",
        body: "When your Kheelu leaves us, we send you the courier and the tracking details.",
      },
      {
        icon: "currency-inr",
        title: "Reserved with the refundable {price:token}?",
        body: "Before dispatch, we send a payment link for the remaining {price:balance} of the {price:launch} price (incl. GST).",
      },
      {
        icon: "arrow-counter-clockwise",
        title: "Refundable until dispatch.",
        body: "Change your mind before it leaves us, and you get back everything you’ve paid.",
      },
    ],
  },
  help: "Questions about delivery? Call or [message us on WhatsApp](https://wa.me/919187546483) at {nowrap:[+91 91875 46483](tel:+919187546483)}, or email [hello@kheelona.com](mailto:hello@kheelona.com).",
  parts: [
    {
      id: "when",
      title: "When your Kheelu ships.",
      blocks: [
        {
          kind: "p",
          text: "{delivery}. Pre-orders are served first, in the order they were placed.",
        },
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
          text: "If you reserved with the refundable {price:token} advance, the remaining {price:balance} of the {price:launch} price (incl. GST) is due before delivery. When your Kheelu is ready to leave us, we send you a payment link on WhatsApp and by email. Pay it by UPI, card or net banking, and your Kheelu is dispatched.",
        },
        {
          kind: "p",
          text: "If you paid the full price when you ordered, nothing more is due: your Kheelu just ships.",
        },
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
          text: "Tell us within 7 days of receiving it, and you can have a replacement or a full refund. We arrange the pickup, free.",
        },
        {
          kind: "p",
          lead: "If it doesn’t arrive.",
          text: "If the tracking stops moving or the parcel doesn’t reach you, call or message us with your order number. {ph:what we do if a parcel is lost in transit, for example “we send a replacement, or refund you in full if you’d rather” (no number of days)}",
        },
        {
          kind: "p",
          lead: "And once it arrives,",
          text: "you can still return it within 7 days of delivery, no questions asked ([see the refund policy](/refund#returns)).",
        },
      ],
    },
    {
      id: "seller",
      title: "Who you’re buying from, and complaints.",
      blocks: [
        {
          kind: "seller",
        },
        {
          kind: "p",
          text: "Customer care: call or [message us on WhatsApp](https://wa.me/919187546483) at {nowrap:[+91 91875 46483](tel:+919187546483)}, or email [hello@kheelona.com](mailto:hello@kheelona.com). You order on kheelona.com and pay on store.kheelona.com.",
        },
        {
          kind: "p",
          text: "If you’re unhappy with how we’ve handled your delivery, you can make a formal complaint to our grievance officer (also on the [contact page](/contact#grievance)).",
        },
        {
          kind: "grievance",
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
        cta: "shipping-learn",
      },
      {
        label: "Refunds, returns and warranty",
        href: "/refund",
      },
    ],
  },
} satisfies LegalPage;
