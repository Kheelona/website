import { CAP_UNITS_TEXT } from "@/config/site";
import type { LegalPage } from "@/content/types";
import { offerCopy } from "../offer";
import { DEFAULT_OG } from "../organization";
import {
  BANK_REFUND_WORKING_DAYS,
  FAULTY_REPORT_DAYS,
  NO_EXCHANGES,
  PAYMENT_METHODS,
  REFUND_AFTER_RETURN_WORKING_DAYS,
  REFUND_START_WORKING_DAYS,
  RETENTION_MONTHS,
  RETURN_DAYS,
  WARRANTY_MONTHS,
} from "../policies";
import { seller } from "../seller";

/**
 * The pre-order terms, `/terms` (task 5.12; structure §5 row terms.html): the approved mockup `mockup/pages/terms.html`
 * (D046) word for word, in its order, as wiki/site/pages/terms.md words it, rendered by LegalTemplate's `reference`
 * family. Approved: the founder approved the drafted legal pages as final on 2026-10-22 (D067, after D029), so no draft
 * note shows and the production build accepts the page.
 *
 * - **The offer's two modes** (terms.md "How to read this page"; G9): the mockup shows token mode; the copy page gives
 *   the full-mode words beside the lines that change, and those lines are written `{ token, full }` here, so the page
 *   renders the live one. The short version's first point is the price sentence beside every chilli button (D028, D041
 *   option (d)), read from offer.ts in both modes; its second point and the price section's first paragraph change with
 *   the mode; the price section's second paragraph and the two balance paragraphs (sections 5 and 6, "token mode only")
 *   have no full-mode words, so the template leaves them out.
 * - **Kheelona's own model** (D035): what trains (voice recordings and transcripts), whose model, on by default, and that a
 *   parent turns it off with a switch in the parent app (D055 item 11, as on /privacy).
 * - **The founder's page facts** (D055 items 7, 8, 10 and 11; task 6.7): "Last updated" is his date; GST says only what
 *   D024 confirms (prices include GST; a GST invoice), the documents-and-timing and price-breakup slots off the page; the
 *   complaint-reference line is the template's (legal/shared.ts).
 * - **AI-made images** (D041): disclosed here, not in the footer, beside the films' real pilot families (D040).
 * - **Shared facts are read, never retyped:** the entity, support number, WhatsApp address and email from seller.ts; the
 *   cap from the money block of config/site.ts; every policy number from policies.ts; every amount a `{price:…}` token and
 *   the delivery line `{delivery}`. The seller and grievance cards render from seller.ts through LegalTemplate
 *   (seller-lines.ts); the close's help line is the template's (seller.help).
 */

const { phone, tel, whatsapp, email } = seller.support;
/** The support links as the approved page prints them, the number kept whole on one line (`mk-nowrap`). */
const PHONE = `{nowrap:[${phone}](${tel})}`;
const EMAIL = `[${email}](mailto:${email})`;
const WHATSAPP = `[WhatsApp](${whatsapp})`;
/** The three pages these terms take in (sections 1, 6, 7, 8, 10). */
const PRIVACY = "[Privacy](/privacy)";
const REFUNDS = "[Refunds](/refund)";
const SHIPPING = "[Shipping](/shipping)";

export const termsPage = {
  slug: "terms",
  meta: {
    title: "Kheelu pre-order terms · Kheelona",
    /* Machine-read, so the total leads and the advance comes second (D028); no cap, so no snippet reads as an urgency
       line (terms.md "At a glance"). */
    description: {
      token:
        "Kheelu pre-order terms: {price:headline} (incl. GST), reserved with a refundable {price:token} advance. Paying, delivery, cancelling, returns and using Kheelu.",
      full: "Kheelu pre-order terms: {price:full} (incl. GST), paid in full when you order. Paying, delivery, cancelling, returns and using Kheelu and its app.",
    },
    og: DEFAULT_OG,
  },
  status: "approved",
  /* "Last updated", the founder's date (D055 item 8). Approved as final on 2026-10-22 (D067). */
  approvedOn: "2026-10-14",
  hero: {
    eyebrow: "Terms",
    title: "Pre-order terms, in {hand:plain words.}",
    lead: "What you pay and when, how to cancel, when Kheelu arrives, and the rules for using Kheelu and its parent app. A fair deal should survive being written clearly.",
  },
  /* Fold 2: eight numbered points in the Sunshine panel. */
  summary: {
    kind: "points",
    title: "The {hand:short version.}",
    points: [
      { lead: "What you pay.", text: offerCopy.sentence },
      {
        lead: "Changed your mind before dispatch?",
        text: {
          token: `Cancel any time for a full refund, no reason needed. We start it within ${REFUND_START_WORKING_DAYS} working days.`,
          full: `Cancel any time before dispatch for a full refund, no reason needed. We start it within ${REFUND_START_WORKING_DAYS} working days.`,
        },
      },
      { lead: "When it comes.", text: "{delivery}, anywhere in India. Delivery is included." },
      {
        lead: "After delivery.",
        text: `${RETURN_DAYS}-day returns, no questions asked, and a ${WARRANTY_MONTHS}-month warranty on manufacturing defects.`,
      },
      { lead: "Paying.", text: `${PAYMENT_METHODS}, through Razorpay. No payment fees. Nothing recurring.` },
      { lead: "Who it’s for.", text: "You must be 18 or over to pre-order. Kheelu is made for children aged 3 to 7." },
      { lead: "Our own model.", text: "Kheelona’s own model learns from your child’s conversations unless you turn it off." },
      { lead: "A toy, not a therapy.", text: "Indian law applies, and you can always file a consumer complaint where you live." },
    ],
  },
  /* Fold 3: the contents list's three headings and the document's eyebrows. */
  groups: [
    { label: "Your pre-order", eyebrow: "Part one · Your pre-order" },
    { label: "Using Kheelu", eyebrow: "Part two · Using Kheelu" },
    { label: "The legal part", eyebrow: "Part three · The legal part" },
  ],
  parts: [
    /* ── Part one · Your pre-order ── */
    {
      id: "scope",
      title: "What these terms cover.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: `These terms are an agreement between you and ${seller.legalName} (“Kheelona”, “we”). Part one covers a pre-order placed on our store at store.kheelona.com. Part two covers using Kheelu and its parent app. Our ${PRIVACY}, ${REFUNDS} and ${SHIPPING} pages are part of these terms too.`,
        },
        { kind: "p", text: "When you tick the box at checkout, you accept these terms and our refund policy." },
      ],
    },
    {
      id: "who-can",
      title: "Who can pre-order.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "You must be 18 or over to pre-order. You need an Indian mobile number for WhatsApp and a delivery address in India: we don’t ship outside India yet.",
        },
        {
          kind: "p",
          text: `Each pre-order is for one Kheelu. If you want more than one, for siblings or as a gift, message us on ${WHATSAPP} at ${PHONE} and we’ll sort it out with you.`,
        },
      ],
    },
    {
      id: "preorder",
      title: "What a pre-order is.",
      group: "Your pre-order",
      blocks: [
        { kind: "p", text: "A pre-order reserves one Kheelu for you. Pre-orders are served first, in the order they were placed." },
        /* D041's box contents; D058 item 3's Kheelona+ sentence (offer.ts `plus`), nothing after six months (D041 F7). */
        { kind: "p", text: `In the box: the Kheelu plush toy, a charger and a quick-start card. ${offerCopy.plus}` },
        {
          kind: "p",
          text: "When your payment goes through, you see a confirmation page, and we email you a confirmation with your order number.",
        },
      ],
    },
    {
      id: "price",
      title: "The price.",
      group: "Your pre-order",
      blocks: [
        /* Full mode: "the first two paragraphs become" one (terms.md section 4). */
        {
          kind: "p",
          text: {
            token: `While the ${CAP_UNITS_TEXT} last, counted by paid pre-orders, Kheelu costs {price:headline} in total (incl. GST). You reserve yours for {price:token} today, refundable until dispatch, and pay the remaining {price:balance} before delivery. The advance is part of the {price:headline}, not on top of it.`,
            full: "Kheelu costs {price:full} (incl. GST), paid in full when you order. There is no advance and no balance.",
          },
        },
        {
          kind: "p",
          text: {
            token: "After that, Kheelu costs {price:full} (incl. GST), paid in full when you order, with no advance and no balance.",
            full: "",
          },
        },
        { kind: "p", text: "Your price is fixed on the day you pre-order. It does not move afterwards, in either direction." },
        {
          kind: "p",
          text: "Prices include GST. Delivery anywhere in India is included, so the price is the whole cost of Kheelu arriving at your door. Nothing is collected at the door.",
        },
        /* Only what D024 confirms (D055 item 10): which GST documents and when (GST-01) and the price breakup (ECOM-08)
           wait on the CA, off the page. */
        { kind: "p", text: "Every order gets a GST invoice." },
      ],
    },
    {
      id: "payment",
      title: "Paying.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "You can pay by UPI, debit or credit card, or net banking. Razorpay takes the payment on its own secure form: your card number, UPI ID and bank details go to Razorpay, never to us.",
        },
        { kind: "p", text: "No payment fees. Nothing recurring. Nothing is ever charged automatically, and we don’t keep your card." },
        /* Token mode only. */
        {
          kind: "p",
          text: {
            token:
              "The {price:balance} balance is paid by a payment link we send you on WhatsApp and by email before dispatch. We dispatch a reserved Kheelu once the balance is paid.",
            full: "",
          },
        },
        {
          kind: "p",
          text: "If a payment goes wrong, tell us first and we’ll sort it out. You can also raise a dispute (a chargeback) with your bank or card issuer. Razorpay’s own help is at [razorpay.com/support](https://razorpay.com/support/).",
        },
      ],
    },
    {
      id: "cancel",
      title: "Cancelling before dispatch.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "You can cancel at any time before your Kheelu is dispatched, and we refund everything you’ve paid: the whole advance, or the whole price if you paid in full. No fee, no deduction, and you don’t have to tell us why.",
        },
        {
          kind: "p",
          text: `To cancel, message or call us on ${PHONE}, or email ${EMAIL}, with your order number. We start your refund within ${REFUND_START_WORKING_DAYS} working days of your request; your bank takes {nowrap:${BANK_REFUND_WORKING_DAYS}} working days. The money goes back to the card, UPI ID or account you paid from.`,
        },
        /* Token mode only. */
        {
          kind: "p",
          text: {
            token: "If you don’t pay the balance, we remind you twice over two weeks. After that, we release your Kheelu and refund your advance in full.",
            full: "",
          },
        },
        { kind: "p", text: `All the detail is on our ${REFUNDS} page.` },
      ],
    },
    {
      id: "delivery",
      title: "Delivery.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          text: "{delivery}. We deliver anywhere in India and send you a tracking link when your Kheelu ships. You can change your address any time before dispatch.",
        },
        {
          kind: "p",
          text: "If the delivery date moves, you hear it from us first, your price stays exactly as it is, and you can cancel for a full refund at that point, even if you were happy to wait before. If we cannot supply your Kheelu at all, you get back everything you’ve paid.",
        },
        {
          kind: "p",
          text: "Before dispatch, details such as specifications can still change while we finish testing and certification. Your price and your money can’t change without your say.",
        },
        { kind: "p", text: `All the detail is on our ${SHIPPING} page.` },
      ],
    },
    {
      id: "returns",
      title: "Returns, faulty units and warranty.",
      group: "Your pre-order",
      blocks: [
        {
          kind: "p",
          lead: "Changed your mind?",
          text: `Return Kheelu within ${RETURN_DAYS} days of delivery, no questions asked. Opened is fine. Just send back everything that came in the box, undamaged.`,
        },
        {
          kind: "p",
          lead: "Faulty, damaged or not as described?",
          text: `You can have a replacement or a full refund. If it arrives faulty, tell us within ${FAULTY_REPORT_DAYS} days of receiving it.`,
        },
        {
          kind: "p",
          lead: "Warranty.",
          text: `${WARRANTY_MONTHS}-month warranty on manufacturing defects. It doesn’t cover drops, water damage or misuse. If a defect shows up after the first ${FAULTY_REPORT_DAYS} days, we repair it, or replace it if the repair fails.`,
        },
        {
          kind: "p",
          text: `We arrange the pickup, free, for returns we accept, faulty units and warranty claims. Once your Kheelu reaches us and qualifies for return, your refund reaches you within ${REFUND_AFTER_RETURN_WORKING_DAYS} working days.`,
        },
        { kind: "p", text: NO_EXCHANGES },
        { kind: "p", text: `All the detail is on our ${REFUNDS} page.` },
      ],
    },

    /* ── Part two · Using Kheelu ── */
    {
      id: "ages",
      title: "Who Kheelu is for.",
      group: "Using Kheelu",
      blocks: [
        {
          kind: "p",
          text: "Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby.",
        },
        /* The mechanism in the live team's words (D058 item 1; terms.md section 9), after "You can change it later." so "it"
           still means the age. */
        {
          kind: "p",
          text: "When you set Kheelu up, you enter your child’s age in the parent app. You can change it later. The AI model that writes Kheelu’s replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top.",
        },
      ],
    },
    {
      id: "account",
      title: "The parent app.",
      group: "Using Kheelu",
      blocks: [
        /* The parent app's terms of the live /terms (#18, dd04e6d; map §1 T2-T7), in this page's voice (terms.md section 10;
           D058 items 1, 3, 8 and 9): what the app shows, free, the one-time code, home Wi-Fi, the misuse rule, deleting the
           account. No one-tap delete; "nothing is sold inside it" is not carried over (D058 item 3). */
        {
          kind: "p",
          text: "The parent app is for parents and guardians. The person who sets it up must be 18 or over and looks after the account. You’re responsible for how your child uses Kheelu.",
        },
        {
          kind: "p",
          text: `In the app, you can read every conversation word for word, a few minutes after it ends, with a daily summary, search, and a look back over the week or the month. Conversations are deleted automatically after ${RETENTION_MONTHS} months.`,
        },
        {
          kind: "p",
          text: "The parent app is free. You sign in with your phone number and a one-time code. Keep the code to yourself, and tell us if you think someone else is using your account.",
        },
        { kind: "p", text: "Conversations with Kheelu need your home Wi‑Fi. Stories and songs you’ve downloaded play without it." },
        {
          kind: "p",
          text: "Don’t try to break into our systems, copy the service, or use the app or Kheelu to harm anyone. If you do, we can close your account.",
        },
        {
          kind: "p",
          text: "You can stop using the app and delete your account at any time, in its privacy settings. That deletes the account, your child’s profile, and their conversations and voice recordings.",
        },
        { kind: "p", text: `How we handle your child’s data is on our ${PRIVACY} page, which is part of these terms.` },
      ],
    },
    {
      id: "training",
      title: "Conversations and Kheelona’s own model.",
      group: "Using Kheelu",
      blocks: [
        /* D035 (terms and privacy only, never on customer pages); D020's providers clause, scoped to the providers. */
        {
          kind: "p",
          text: "Kheelona’s own AI model learns from your child’s voice recordings and conversation transcripts. This is on by default, and you can turn it off at any time with a switch in the parent app. Our outside speech and AI providers never train on your child’s voice.",
        },
        {
          kind: "p",
          text: "The full detail, including what happens when you turn it off, is on our [Privacy](/privacy#training) page.",
        },
      ],
    },
    {
      id: "toy",
      title: "A toy, not a therapy.",
      group: "Using Kheelu",
      blocks: [
        /* D025's disclaimer, verbatim; then how the AI answers, in the live team's code-checked words (D058 item 1: no closed
           library, no age-graded layer; the live /terms' T4, "conversation, not advice"), and the limits. */
        {
          kind: "p",
          text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician.",
        },
        {
          kind: "p",
          text: "Kheelu uses AI to understand and answer your child. The AI model that writes its replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top. It cannot browse or search the web.",
        },
        /* Without the pre-launch test since task Q2.17: the founder ruled it not true (D066 item 6, G29); the rest of the
           sentence stays (D065 item 8). Approved as final with the legal pages (D067). */
        {
          kind: "p",
          text: "When it isn’t sure, it says it doesn’t know rather than guess. Even so, an answer can sometimes be wrong, so treat its replies as conversation, not advice. Kheelu doesn’t replace you: stay close, and read its conversations in the parent app.",
        },
      ],
    },
    {
      id: "images",
      title: "Images on this website.",
      group: "Using Kheelu",
      blocks: [
        /* D041: the AI-image disclosure lives on the Terms page, not in the footer; the films are D040's. */
        {
          kind: "p",
          text: "This website may use AI-generated images, including pictures of children and families. They are illustrations, not photos of our customers. Our films are different: they show real pilot families, filmed with their permission.",
        },
      ],
    },

    /* ── Part three · The legal part ── */
    {
      id: "law",
      title: "Your rights, the law and the courts.",
      group: "The legal part",
      blocks: [
        {
          kind: "p",
          text: "These terms are governed by Indian law, and the courts at Bengaluru have jurisdiction. This does not limit your right to file a consumer complaint where you live, under the Consumer Protection Act, 2019.",
        },
        {
          kind: "p",
          text: "Nothing in these terms takes away your rights as a consumer, or your right to complain to the Data Protection Board of India once the Digital Personal Data Protection Act’s duties apply in May 2027.",
        },
        {
          kind: "p",
          text: "If any part of this page is unclear enough to argue about, we will read it the way a careful parent would, not the way a lawyer would like us to.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms.",
      group: "The legal part",
      blocks: [
        {
          kind: "p",
          text: "When these terms change, we update the date at the top. A change never touches the price or the refund promise of an order you’ve already placed without your say. If a change affects your order, we tell you first.",
        },
      ],
    },
    {
      id: "contact",
      title: "Who you’re buying from, and complaints.",
      group: "The legal part",
      blocks: [
        { kind: "seller", lead: "Seller:" },
        { kind: "card", lead: "Customer care:", text: `${WHATSAPP} or call ${PHONE}, or email ${EMAIL}.` },
        { kind: "grievance" },
      ],
    },
  ],
  /* No pre-order button and no tracking value on a policy page (strategy §5 policy row); the help line is the
     template's (seller.help). */
  close: {
    actions: [{ label: "Meet Kheelu", href: "/products/kheelu" }],
    also: {
      label: "Also read:",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Refunds", href: "/refund" },
        { label: "Shipping", href: "/shipping" },
      ],
    },
  },
} satisfies LegalPage;
