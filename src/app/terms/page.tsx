import { pageMeta } from "@/lib/seo";
import { LegalDoc, type LegalSection } from "@/components/templates/LegalDoc";
import { SELLER_SECTION } from "@/lib/legal";
import {
  LAUNCH_PRICE,
  LATER_PRICE,
  TOKEN_PRICE,
  BALANCE_PRICE,
  PREORDER_DEADLINE_TEXT,
  SHIP_DATE_TEXT,
  SUPPORT_WHATSAPP_DISPLAY,
} from "@/config/site";

export const metadata = pageMeta({
  title: "Terms",
  description:
    "The terms of a Lumi pre-order: what the ₹499 buys, what you owe and when, how the price hold works, and how to walk away.",
  path: "/terms",
});

/* TODO(counsel-review): plain-language draft per prompt §5.2. This page MUST
   be reviewed by counsel. It changed shape on 2026-08-22: it used to describe a
   free list where nothing was owed by anyone, and it now describes a paid
   contract. Every clause below states a real obligation on one side or the
   other, which is the standard it should be reviewed against. */

const SECTIONS: readonly LegalSection[] = [
  {
    h: "What a pre-order is",
    ps: [
      `A pre-order reserves one Lumi for you at ${LAUNCH_PRICE} and puts you in the queue at the point you joined it. You pay ${TOKEN_PRICE} today.`,
      `That ${TOKEN_PRICE} is part of the price, not on top of it. The remaining ${BALANCE_PRICE} is due when your Lumi is ready to be dispatched to you, by a payment link we send. Nothing is ever charged automatically, and we do not keep your card.`,
    ],
  },
  {
    h: "The price and the date",
    ps: [
      `${LAUNCH_PRICE} is the price for pre-orders placed on or before ${PREORDER_DEADLINE_TEXT}. After that the price is ${LATER_PRICE}. Your price is fixed on the day you pre-order, and it does not move afterwards, in either direction.`,
      `Shipping starts ${SHIP_DATE_TEXT}, and pre-orders are served in the order they were placed.`,
    ],
  },
  {
    h: "One Lumi per pre-order",
    ps: [
      `Each pre-order is for one Lumi. If you want more than one, for siblings or as a gift, message us on WhatsApp at ${SUPPORT_WHATSAPP_DISPLAY} and we will sort it out with you directly.`,
    ],
  },
  {
    h: "Changing your mind",
    ps: [
      /* The refund promise is stated here and detailed on /refund. Both pages
         must say the same thing: "before dispatch, in full, no reason". */
      "You can cancel at any time before your Lumi is dispatched and we refund the whole token. No fee, no deduction, and you do not have to tell us why. The full detail, including how long a refund takes to reach you, is on the Refunds page.",
    ],
  },
  {
    h: "What can still change, and what cannot",
    ps: [
      /* V6 D8b, updated for money: the honesty about an unfinished product now
         has to be paired with what the parent gets if it moves, because they
         have paid us. */
      "Lumi is still being finished. Specifications and availability can move while we complete testing and certification, and we will not pretend otherwise on a page you are reading before you pay us.",
      `What cannot change without your say: your price, and your money. If the ship date moves from ${SHIP_DATE_TEXT}, you hear it from us first, your ${LAUNCH_PRICE} hold stays exactly as it is, and you can cancel for a full refund at that point even if you were happy to wait before. If we cannot supply your Lumi at all, you get back everything you have paid us.`,
    ],
  },
  {
    h: "Delivery, refunds, and your data",
    ps: [
      "Three things have their own pages, because burying them here would be a way of hiding them: how and when your Lumi reaches you is on the Shipping page, how to get your money back is on the Refunds page, and what we hold about you is on the Privacy page. All three are part of these terms.",
    ],
  },
  {
    h: "The boring but honest part",
    ps: [
      "These terms cover your pre-order. Indian law applies to them, and the courts at Bengaluru have jurisdiction.",
      "If any part of this page turns out to be unclear enough to argue about, we will read it the way a careful parent would read it, not the way a lawyer would like us to.",
    ],
  },
  SELLER_SECTION,
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Pre-order terms, in plain words."
      lede="A fair deal should survive being written clearly. Here is ours, now that real money is involved."
      sections={SECTIONS}
      guide="curious"
      /* GATED:kheelu-line — founder sign-off before merge to master */
      say="Short version: be kind, we will be too."
    />
  );
}
