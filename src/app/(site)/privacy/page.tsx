import { pageMeta } from "@/lib/seo";
import { LegalDoc, type LegalSection } from "@/components/templates/LegalDoc";
import { SELLER_SECTION } from "@/lib/legal";
import { CONTACT_EMAIL, SUPPORT_WHATSAPP_DISPLAY, SHIP_DATE_TEXT } from "@/config/site";

export const metadata = pageMeta({
  title: "Privacy",
  description:
    "What Kheelona collects when you pre-order Lumi, who processes it, what we never do with it, and the promises we make about your child's data.",
  path: "/privacy",
});

/* TODO(counsel-review): plain-language draft per prompt §5.2. This page MUST be
   reviewed by counsel.
   STANDING LAW (§8.21-c, enforced by test/analytics-tags.test.ts): a tool that
   runs on this site and the sentence describing it ship in the SAME commit.
   That now covers the payment stack too, not only the analytics tags: Razorpay,
   Supabase and Resend all appear below because all three touch a parent's
   details. Adding or removing any of them means editing this page. */

const SECTIONS: readonly LegalSection[] = [
  {
    h: "What we collect when you pre-order",
    ps: [
      /* This list must mirror the LIVE store form exactly. It described the
         retired six-field Tally form once (V6 QA blocker B1) and that must not
         happen again: the form is now ours, in this repo, so there is no excuse
         for the two to drift. */
      "Your name, your WhatsApp number, your email address, and your child's age, before you pay. Your delivery address, after you pay.",
      "That is the whole list. We ask your child's age because Lumi is built for a narrow band of ages and we want to send you the right thing. We do not ask for your child's name, their school, their photograph, or anything else about them.",
    ],
  },
  {
    h: "We never see your payment details",
    ps: [
      "Your payment is taken by Razorpay, an Indian payment company, on their own secure form. Your card number, your UPI ID, and your bank details go to them and never to us. We receive a payment reference and the amount, which is all we need to know that your pre-order is real.",
      "Razorpay's form sets its own cookies while you are paying, which is how a payment page keeps track of a payment in progress. That is theirs, not ours.",
    ],
  },
  {
    h: "Why we ask for each thing",
    ps: [
      `Your WhatsApp number and your email are how we tell you about your own order: the confirmation, the balance payment link, and any change to the ${SHIP_DATE_TEXT} ship date. Your address is how your Lumi reaches you. Your child's age helps us plan production for the right ages.`,
      /* Narrowed 2026-09-01. The old sentence said none of this is used to
         advertise to you, which the Meta Pixel makes untrue as a blanket
         claim. What stays true, and is the part a parent cares about, is that
         the FIELDS on the form are never sent to an advertiser: the pixel is
         told that a pre-order happened and what it cost, never who made it. */
      "None of it is ever used to profile your child. When you pre-order, one-way codes derived from the details you enter are shared with Meta so we can tell whether our advertising worked, and that is explained further below. The details themselves are never shared in readable form.",
    ],
  },
  {
    h: "Where it lives, and who else touches it",
    ps: [
      "Your order is stored in a database run by Supabase, and only the Kheelona team can read it. Our confirmation emails are delivered by Resend. This website is hosted by Vercel. Those three, plus Razorpay for the payment, are everyone who touches your details, and each one is doing a job we could not do ourselves.",
      "If you have paid us, we have to keep the order record for our tax accounts, even after a refund, because Indian tax law requires it of any company. We delete everything we are not required to keep, on request.",
    ],
  },
  {
    /* Added with Vercel Web Analytics (2026-07-28). The page promises plain
       words about what we collect, so measuring visits has to be stated here
       rather than left implicit.
       REWRITTEN 2026-09-01 for the Meta Pixel, and rewritten rather than
       extended on purpose. The three tools before it could honestly be
       described in one breath as counting visits without following anyone. The
       Meta Pixel does follow you, to other sites, so that we can advertise to
       you, and saying so plainly is the whole point of this page. */
    h: "How we measure visits",
    ps: [
      "We count page views and visits so we can see which parts of this site actually help you decide. Four tools do it, on this site and on our store. Vercel Web Analytics and Ahrefs Web Analytics set no cookies and do not follow you to other sites. Google Analytics does set cookies, in your browser, to tell a returning visit from a new one.",
      "The fourth is different, and we would rather say so than bury it. The Meta Pixel, from the company that runs Facebook, Instagram and WhatsApp, sets a cookie and does follow you to other sites. It is how we know whether an advertisement we paid for actually brought somebody here, and it is how you may later see a Kheelona advertisement on Facebook or Instagram. Meta receives the page you looked at, and whether you pre-ordered and for how much.",
      "What these tools record is the page you looked at, your country, your browser, and where the visit came from. Three of the four are never given anything more than that.",
      /* Added 2026-09-02 with the Conversions API (§8.30-l/n). The previous
         version of this paragraph promised that no tool is ever sent a name,
         phone number or email, and the Conversions API made that untrue the day
         it shipped: it sends a SHA-256 of the email, the phone and the first
         name so Meta can match a sale to an advertisement. "One-way code" is
         the plainest honest description of a hash for a parent reading this;
         what it must not claim is that nothing was sent. */
      "The Meta Pixel is the exception. When you use our order forms, details you enter can be included with what it reports, always as a one-way code and never in readable form. A one-way code lets Meta check whether you match somebody they already know; it is not the details themselves. That is how we can tell that the person who pre-ordered is the person who saw our advertisement.",
      "Which details are included is determined by Meta's own measurement script rather than chosen by us field by field. We never use any of it to profile your child, we never sell it, and we never trade it.",
      "If you would rather not be counted, your browser can block all four. Private browsing, an ad blocker, or turning off third party cookies all work, and none of them stop the site or the store from working. You can also turn off personalised advertising inside your own Facebook or Instagram settings.",
    ],
  },
  {
    h: "What we never do",
    ps: [
      /* Amended 2026-09-01 with the Meta Pixel. The old blanket line about not
         running advertising off this data could no longer stand, so it is
         replaced by the narrower thing that is actually true, and the
         advertising we DO run is stated in the sentence after it rather than
         quietly dropped. (The retired wording is pinned as banned in
         test/analytics-tags.test.ts, so it is deliberately not quoted here.) */
      "We never sell your data. We never sell your child's data. We never trade what you typed into the pre-order form, and we never hand it to anyone who is not helping us deliver Lumi to you.",
      "We do advertise on Facebook and Instagram, and the Meta Pixel described above is how we measure that. Details you enter on our forms can be included with what it reports, as one-way codes and never in readable form, so a sale can be matched to an advertisement. We do not use any of it to profile your child.",
    ],
  },
  {
    h: "Leaving, and deleting",
    ps: [
      `You can ask us to delete your details at any time. Message us on WhatsApp at ${SUPPORT_WHATSAPP_DISPLAY}, reply to any email we have sent you, or write to ${CONTACT_EMAIL}. If you have an open pre-order, deleting your details means cancelling it, so we will refund you at the same time.`,
    ],
  },
  {
    h: "When Lumi ships",
    ps: [
      "The product itself follows stricter rules, explained in plain words on our Safety page: conversations stay in your region, nothing is collected without parent consent, any conversation can be deleted in one tap, and your child's voice data is never sold.",
      "A full product privacy policy will be published here before Lumi ships.",
    ],
  },
  SELLER_SECTION,
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy, in plain words."
      lede="This page covers your pre-order. It is written to be read, not skimmed past."
      sections={SECTIONS}
      guide="bliss"
      /* GATED:kheelu-line — founder sign-off before merge to master */
      say="I'll wait here while you read the careful words."
    />
  );
}
