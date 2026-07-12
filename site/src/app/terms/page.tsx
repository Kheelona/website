import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/templates/LegalDoc";
import { LAUNCH_PRICE, LATER_PRICE } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "The terms of the Lumi pre-order reservation: what the price hold means, what you are committing to (nothing), and how the list works.",
  alternates: { canonical: "/terms" },
};

/* TODO(counsel-review): plain-language draft per prompt §5.2. This page MUST
   be reviewed by counsel before launch (launch checklist gate). */

const SECTIONS: readonly LegalSection[] = [
  {
    h: "What a reservation is",
    ps: [
      `Joining the pre-order list reserves your place in line and holds the launch price of ${LAUNCH_PRICE} for you. The price after launch is ${LATER_PRICE}.`,
      "A reservation is not a purchase. You pay nothing now, and nothing is charged automatically, ever.",
    ],
  },
  {
    h: "What you are committing to",
    ps: [
      "Nothing. When Lumi is ready to ship, we will contact you with the details, and you decide then whether to buy at your held price. If you say no, that is completely fine.",
    ],
  },
  {
    h: "The price hold",
    ps: [
      `The ${LAUNCH_PRICE} price is held for everyone who joins the list before launch. If our launch plans change in a way that affects the hold, we will tell you directly before anything else happens.`,
    ],
  },
  {
    h: "Leaving the list",
    ps: [
      "You can leave anytime. Your place goes to the next family and your details are deleted on request, as described on the Privacy page.",
    ],
  },
  {
    h: "The boring but honest part",
    ps: [
      "Lumi is still being finished. Dates, specifications, and availability can change while we complete testing and certification. We will communicate every change that affects your reservation.",
      "Full terms of sale, including delivery, returns, and warranty, will be published before anyone is asked to pay anything.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Reservation terms, in plain words."
      lede="A fair deal should survive being written clearly. Here is ours."
      sections={SECTIONS}
    />
  );
}
