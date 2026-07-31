import type { Metadata } from "next";
import { LegalDoc, type LegalSection } from "@/components/templates/LegalDoc";
import { CONTACT_EMAIL, SHIP_DATE_TEXT } from "@/config/site";

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
      /* V6 QA blocker B1: this list must mirror the LIVE Tally form
         (Y5XW7J, five fields since 2026-07-31) exactly — it previously
         described the retired six-field form (email + birth month), which
         the form no longer collects. */
      "When you reserve Lumi, we ask for your name, your child's age, your city, your WhatsApp number, and your consent before we contact you on WhatsApp.",
      "That is the whole list. We do not ask for payment details, because there is no payment.",
    ],
  },
  {
    h: "Why we ask for it",
    ps: [
      /* V6 D8a: the date is published (founder, 2026-07-31) — hedging it here
         while the finale card below states it read as a loophole. */
      `Your WhatsApp number lets us tell you about your reservation: the price hold, your place in line, and any change to the ${SHIP_DATE_TEXT} ship date.`,
      "Your child's age helps us plan for the right ages. Your city helps us plan delivery. Neither is ever used to profile your child.",
    ],
  },
  {
    h: "Where it lives",
    ps: [
      "Pre-order details are stored with Tally, the form service that runs our list, and are accessible only to the Kheelona team.",
    ],
  },
  {
    /* Added with Vercel Web Analytics (2026-07-28). The page promises plain
       words about what we collect, so measuring visits has to be stated here
       rather than left implicit. */
    h: "How we measure visits",
    ps: [
      "We count page views and visits so we can see which parts of this site actually help you decide. Three tools do it. Vercel Web Analytics and Ahrefs Web Analytics set no cookies and do not follow you to other sites. Google Analytics does set cookies, in your browser, to tell a returning visit from a new one.",
      "What these tools record is the page you looked at, your country, your browser, and where the visit came from. None of them ever sees your name, your email, or anything you type into the reservation form, because that form is run by Tally in a separate frame.",
      "If you would rather not be counted, your browser can block all three. Private browsing, an ad blocker, or turning off third party cookies all work, and none of them stop the site itself from working.",
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
      /* V6 QA blocker B1: the exit route must be one that exists — the form
         collects no email, so "reply to any email" was a door that opened
         onto a wall. */
      `You can leave the pre-order list anytime, and we will delete your details on request. Reply to any WhatsApp message we have sent you, or write to ${CONTACT_EMAIL}. That is all it takes.`,
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
      guide="bliss"
      /* GATED:kheelu-line — founder sign-off before merge to master */
      say="I'll wait here while you read the careful words."
    />
  );
}
