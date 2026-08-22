import { pageMeta } from "@/lib/seo";
import { LegalDoc, type LegalSection } from "@/components/templates/LegalDoc";
import { SELLER_SECTION } from "@/lib/legal";
import {
  TOKEN_PRICE,
  BALANCE_PRICE,
  LAUNCH_PRICE,
  SHIP_DATE_TEXT,
  SUPPORT_WHATSAPP_DISPLAY,
  TAX_LINE,
} from "@/config/site";

export const metadata = pageMeta({
  title: "Shipping and delivery",
  description:
    "When Lumi ships, where we deliver, what delivery costs, and how the balance is collected before your Lumi leaves us.",
  path: "/shipping",
});

/* TODO(counsel-review): plain-language draft, same gate as /terms.
   FOUNDER-CONFIRMED 2026-08-22: delivery anywhere in India is INCLUDED, and
   every published price is GST-inclusive. Both are now settled facts rather
   than assumptions. If a delivery charge is ever added, this page and the
   store's price panel change in the SAME commit: a surprise charge at the
   balance step is the fastest way to lose a parent who has already paid us. */

const SECTIONS: readonly LegalSection[] = [
  {
    h: "When your Lumi ships",
    ps: [
      `Shipping starts ${SHIP_DATE_TEXT}. Pre-orders are served first, in the order they were placed, so the earlier you pre-ordered the earlier your Lumi leaves us.`,
      "We message you before your Lumi is dispatched. You will never wake up to an unexpected delivery, and you will never have to guess where yours is.",
    ],
  },
  {
    h: "Where we deliver",
    ps: [
      `Anywhere in India, to the address you give us. Delivery is included. ${TAX_LINE} So the amount you see is the amount you pay, with nothing added at the door and nothing to settle with the courier.`,
      "We do not ship outside India yet. If you are abroad and want one, message us and we will tell you honestly whether we can help.",
    ],
  },
  {
    h: "The balance, before dispatch",
    ps: [
      `You pay ${TOKEN_PRICE} to pre-order. The remaining ${BALANCE_PRICE} of the ${LAUNCH_PRICE} price is due when your Lumi is ready to leave for you, and we send you a payment link on WhatsApp and by email when that moment comes.`,
      "Your Lumi is dispatched once the balance is paid. Nothing is ever charged automatically, and we never hold a card on file.",
    ],
  },
  {
    h: "How long it takes to reach you",
    ps: [
      /* No invented transit numbers: we have not shipped one unit yet, so any
         "3 to 5 days" here would be a claim we cannot stand behind. */
      "Once your Lumi is dispatched we send you the courier and the tracking details, and how long it takes from there depends on where you are. We would rather send you a real tracking link than a promise about days we have not tested yet.",
    ],
  },
  {
    h: "Changing your address",
    ps: [
      `You can change your delivery address any time before dispatch. Use the link in your confirmation email, or message us on WhatsApp at ${SUPPORT_WHATSAPP_DISPLAY}. If you have moved since you pre-ordered, tell us before you pay the balance.`,
    ],
  },
  SELLER_SECTION,
];

export default function ShippingPage() {
  return (
    <LegalDoc
      title="Shipping, in plain words."
      lede="Where Lumi goes, when it leaves, and what it costs to get to you. Which is nothing extra."
      sections={SECTIONS}
      guide="joy"
      /* Founder-approved 2026-08-22, same contraction exemption as /refund.
         44 characters, inside the 48-character dock limit. */
      say="I'll help pack. Mostly by sitting in the box."
    />
  );
}
