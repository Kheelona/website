import { pageMeta } from "@/lib/seo";
import { LegalDoc, type LegalSection } from "@/components/templates/LegalDoc";
import { SELLER_SECTION } from "@/lib/legal";
import {
  TOKEN_PRICE,
  CONTACT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
  SHIP_DATE_TEXT,
} from "@/config/site";

export const metadata = pageMeta({
  title: "Refunds and cancellation",
  description:
    "The ₹499 you pay to pre-order Lumi is fully refundable until your Lumi is dispatched. How to ask for it back, and how long it takes.",
  path: "/refund",
});

/* TODO(counsel-review): plain-language draft. This page must be reviewed by
   counsel, and it is the page a payment dispute will be read against.
   FOUNDER GATE: the post-dispatch returns and warranty terms are NOT written
   yet, because nothing has shipped. The section below says so honestly rather
   than inventing a window. It must be replaced with the real terms before the
   first Lumi is dispatched (FOUNDER-TODO). */

const SECTIONS: readonly LegalSection[] = [
  {
    h: "The short version",
    ps: [
      `The ${TOKEN_PRICE} you pay to pre-order is fully refundable at any time before your Lumi is dispatched. Ask us and you get it back. There is no fee, no deduction, and no reason you have to give.`,
    ],
  },
  {
    h: "How to ask",
    ps: [
      `Message us on WhatsApp at ${SUPPORT_WHATSAPP_DISPLAY}, or write to ${CONTACT_EMAIL}, with the order number from your confirmation email.`,
      "We refund to the same card, UPI ID, or account you paid from, because that is the only place a payment can be reversed to. It usually reaches you in 5 to 7 working days once we start it, and that last part is your bank's timing rather than ours.",
    ],
  },
  {
    h: "If you decide not to pay the balance",
    ps: [
      /* The honest version of a dunning policy: a parent who goes quiet has
         cancelled, and pretending otherwise would let us sit on their money. */
      "That is a cancellation, and it is treated exactly like one. We will ask you twice over two weeks, and if we do not hear from you we release the unit and refund your token. Nothing is charged automatically, ever.",
    ],
  },
  {
    h: "If we cannot deliver",
    ps: [
      `If we cannot supply your Lumi, for any reason, you get back everything you have paid us. Not a credit, not a voucher, the money. If the ship date moves from ${SHIP_DATE_TEXT} you hear it from us first, and you can cancel for a full refund at that point even if you were happy to wait before.`,
    ],
  },
  {
    h: "After your Lumi is dispatched",
    ps: [
      /* Status-honest, in the pattern the safety page already uses for
         certification: say what does not exist yet rather than implying it
         does. Inventing a returns window here would be the exact kind of
         claim this site refuses to make. */
      "Once your Lumi is on its way to you, the pre-order is complete and delivery, returns, and warranty terms take over. Those are not written yet, because nothing has shipped yet. We will publish them on this page and send them to you before your Lumi is dispatched, so you will have read them before they apply to you.",
      "A damaged or faulty Lumi is our problem to fix, whatever those terms end up saying. Message us and we will make it right.",
    ],
  },
  {
    h: "What we never do",
    ps: [
      "We never keep part of your money as a cancellation charge. We never make you call a number to cancel something you did in two taps. We never move the goalposts on a refund we have already promised you.",
    ],
  },
  SELLER_SECTION,
];

export default function RefundPage() {
  return (
    <LegalDoc
      title="Refunds, in plain words."
      lede="You can change your mind. This page explains exactly how, and what happens to your money."
      sections={SECTIONS}
      guide="curious"
      /* Founder-approved 2026-08-22, with the contraction: Kheelu's quoted
         speech is the ONE sanctioned contraction zone on this site (his
         published card voice), and the de-contracted draft read stiffer than
         he does anywhere else. 33 characters. */
      say="Changed your mind? That's allowed."
    />
  );
}
