import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/ui/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What Kheelona collects when you join the Lumi pre-order list, what we do with it, and the promises we make about your child's data.",
  alternates: { canonical: "/privacy" },
};

/* TODO(counsel-review): plain-language draft per prompt §5.2. This page MUST
   be reviewed by counsel before launch (launch checklist gate). */

const SECTIONS: readonly LegalSection[] = [
  {
    h: "What we collect when you join the list",
    ps: [
      "When you reserve Lumi, we ask for your name, your email, your WhatsApp number, your child's birth month, and your city. We also ask for your consent before we contact you on WhatsApp.",
      "That is the whole list. We do not ask for payment details, because there is no payment.",
    ],
  },
  {
    h: "Why we ask for it",
    ps: [
      "Your email and WhatsApp number let us tell you about your reservation: the price hold, the ship date when it is announced, and your place in line.",
      "Your child's birth month helps us plan for the right ages. Your city helps us plan delivery. Neither is ever used to profile your child.",
    ],
  },
  {
    h: "Where it lives",
    ps: [
      "Pre-order details are stored with Tally, the form service that runs our list, and are accessible only to the Kheelona team.",
    ],
  },
  {
    h: "What we never do",
    ps: [
      "We never sell your data. We never sell your child's data. We do not run ads with it, trade it, or share it with anyone who is not helping us deliver Lumi to you.",
    ],
  },
  {
    h: "Leaving the list",
    ps: [
      "You can leave the pre-order list anytime, and we will delete your details on request. Reply to any email we have sent you and ask. That is all it takes.",
    ],
  },
  {
    h: "When Lumi ships",
    ps: [
      "The product itself follows stricter rules, explained in plain words on our Safety page: conversations stay in your region, nothing is collected without parent consent, any conversation can be deleted in one tap, and your child's voice data is never sold.",
      "A full product privacy policy will be published here before Lumi ships.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy, in plain words."
      lede="This page covers the pre-order list. It is written to be read, not skimmed past."
      sections={SECTIONS}
    />
  );
}
