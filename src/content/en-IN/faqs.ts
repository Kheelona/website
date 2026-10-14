import { CAP_UNITS_TEXT, PREORDER_CAP_UNITS } from "@/config/site";
import type { FaqItem } from "@/content/types";
import {
  BANK_REFUND_WORKING_DAYS,
  FAULTY_REPORT_DAYS,
  REFUND_AFTER_RETURN_WORKING_DAYS,
  REFUND_START_WORKING_DAYS,
  RETURN_DAYS,
  WARRANTY_MONTHS,
} from "./policies";

/**
 * Every FAQ item the site shows, once, by stable id (architecture §6.1): pages list ids, so the
 * same answer never exists twice and FAQPage JSON-LD reads the very words on the page.
 *
 * Token-mode wording is the approved mockup's, word for word (home, meet-kheelu, safety,
 * ai-toys-for-kids-in-india and store pages); the full-mode variants, which no mockup shows, are
 * the copy pages' (home.md and meet-kheelu.md fold 8, ai-toys-for-kids-in-india.md questions,
 * store.md fold 5). Amounts are `{price:…}` tokens, the delivery line `{delivery}`, policy numbers
 * from policies.ts and the first-500 term from the checkout's own constant.
 */

/** Home's full-mode price answer, which the guide's price question also takes (ai-toys… copy). */
const FULL_PRICE_ANSWER = `Kheelu is {price:full} (incl. GST), paid in full when you order, with delivery anywhere in India included. You can pay by UPI, card or net banking, and you get a GST invoice. {delivery}. If it isn’t right for your family, you can return it within ${RETURN_DAYS} days of delivery, no questions asked.`;

/** The store's delivery answer; full mode drops its last sentence (store.md fold 5). */
const STORE_ARRIVAL = `{delivery}. Pre-orders go out first, in the order they were placed, and we send you a tracking link when yours leaves us. Delivery anywhere in India is included, with nothing to pay at the door. We don’t ship outside India.`;

export const faqs = {
  /* ── Home (fold 8) ── */
  "think-less": {
    id: "think-less",
    question: "Won’t an AI toy make my child think less?",
    answer:
      "That’s exactly what Kheelu is designed against. Most AI gives answers. Kheelu answers your child, then asks them a question back, so they do the thinking. It can’t browse the internet, and when it doesn’t know something, it says so instead of guessing. You can read every conversation in the parent app.",
  },
  "what-ages": {
    id: "what-ages",
    question: "What ages is Kheelu for?",
    answer:
      "Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby. When you set it up, you enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age. You can change it later.",
  },
  "price-and-advance": {
    id: "price-and-advance",
    question: { token: "How much is Kheelu, and how does the advance work?", full: "How much is Kheelu?" },
    answer: {
      token: `Kheelu is {price:headline} (incl. GST) for the ${CAP_UNITS_TEXT}, with delivery anywhere in India included. Its MRP is {price:mrp} (incl. of all taxes). A refundable {price:token} advance reserves yours today, and the remaining {price:balance} is due before delivery. You can pay by UPI, card or net banking, and you get a GST invoice.`,
      full: FULL_PRICE_ANSWER,
    },
  },
  "not-right-for-us": {
    id: "not-right-for-us",
    question: "What if it isn’t right for us?",
    answer: `Return it within ${RETURN_DAYS} days of delivery, no questions asked. Opened is fine: just send back everything that came in the box, undamaged. We arrange the pickup, free. Once it reaches us and qualifies for return, your refund reaches you within ${REFUND_AFTER_RETURN_WORKING_DAYS} working days. Until we dispatch it, everything you’ve paid is refundable in full.`,
  },
  "when-arrive": {
    id: "when-arrive",
    question: "When will my Kheelu arrive?",
    answer:
      "{delivery}. Pre-orders are served first, in the order they were placed, and you get a tracking link when it leaves us. Delivery is included anywhere in India, with nothing to pay at the door. We don’t ship outside India. A reserved Kheelu is sent once the rest of the price is paid.",
  },
  "same-as-lumi": {
    id: "same-as-lumi",
    question: "Is Kheelu the same as Lumi?",
    answer:
      "Yes. Kheelu is the toy that was called Lumi until 5 September 2026: the same product from Kheelona, with a new name. You may still see the old name on some older listings. A toy sold as Lumi by any other company is a different product, and Kheelona does not make it.",
  },

  /* ── Product page (fold 8) ── */
  "do-the-thinking": {
    id: "do-the-thinking",
    question: "Will Kheelu do the thinking for my child?",
    answer:
      "No. That is what it is built against. Most AI gives answers. Kheelu answers your child, then asks a question back, so they do the thinking. When it doesn’t know something, it says so instead of guessing. It can’t browse the internet, and you can read every conversation in the parent app.",
  },
  "talks-back": {
    id: "talks-back",
    question: "What is the difference between a talking toy and a toy that talks back?",
    answer:
      "Many talking toys play recorded phrases or repeat what your child says. A toy that talks back replies to what your child says, so a conversation can go back and forth. Kheelu is a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back.",
  },
  "right-for-a-three-year-old": {
    id: "right-for-a-three-year-old",
    question: "Is Kheelu right for a 3‑year‑old?",
    answer:
      "Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. At 3, play with a grown-up nearby. When you set it up, you enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age. You can change it later.",
  },
  "cost-and-advance": {
    id: "cost-and-advance",
    question: { token: "What does Kheelu cost, and what is the advance for?", full: "What does Kheelu cost?" },
    answer: {
      token: `Kheelu is {price:headline} (incl. GST) for the ${CAP_UNITS_TEXT}, with delivery anywhere in India included. The {price:token} is a refundable advance to reserve yours; the remaining {price:balance} is due before delivery. After the first ${PREORDER_CAP_UNITS}, it is {price:full} (incl. GST), paid in full. Pay by UPI, card or net banking, with no payment fees, and get a GST invoice.`,
      full: `Kheelu is {price:full} (incl. GST), paid in full when you order, with delivery anywhere in India included. Pay by UPI, card or net banking, with no payment fees, and get a GST invoice. {delivery}. If it isn’t right for your family, return it within ${RETURN_DAYS} days of delivery, no questions asked.`,
    },
  },
  "delivery-start": {
    id: "delivery-start",
    question: "When does delivery start?",
    answer:
      "{delivery}. Orders are sent in the order they were placed, and you get a tracking link when yours leaves us. Delivery is included anywhere in India, with nothing to pay at the door; we don’t ship outside India. A reserved Kheelu is sent once the rest of the price is paid.",
  },
  "returns-and-warranty": {
    id: "returns-and-warranty",
    question: "What if it isn’t right for us, or stops working?",
    answer: `Return it within ${RETURN_DAYS} days of delivery, no questions asked; opened is fine if it comes back undamaged and complete. Pickup is free. Arrived faulty? Tell us within ${FAULTY_REPORT_DAYS} days for a replacement or a full refund. The ${WARRANTY_MONTHS}-month warranty covers manufacturing defects, not drops, water damage or misuse: we repair it, or replace it if the repair doesn’t work.`,
  },
  "after-the-first-week": {
    id: "after-the-first-week",
    question: "Will my child still play with it after the first week?",
    answer:
      "No toy can promise that. Kheelu remembers earlier conversations, so it can pick up where your child stopped instead of starting over. Story mode adds stories, poems and jingles, with no Wi‑Fi needed. You can read or delete any conversation in the parent app.",
  },
  speech: {
    id: "speech",
    question: "Can Kheelu help my child’s speech?",
    answer:
      "Kheelu is a toy, not a therapy or treatment. Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult support early language and social skills.[^1] Kheelu doesn’t replace that time with you. If you’re worried about your child’s speech, talk to your paediatrician.",
  },

  /* ── Safety ── */
  "age-three": {
    id: "age-three",
    question: "Is Kheelu OK for a 3-year-old?",
    answer:
      "Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play. Common Sense Media advises against AI toys at this age. Its advice in full, and our answer, are in the next question.",
  },
  "child-safety-groups": {
    id: "child-safety-groups",
    question: "What do child-safety groups say about AI toys?",
    answer:
      "In January 2026, Common Sense Media advised parents not to give AI toys, which it describes as “smart toys with voice-based interactions”, to children aged 5 and under, and to use extreme caution before buying them for children aged 6 to 12.[^1] We make Kheelu for ages 3 to 7, so you should hear this from us.",
    detail: [
      {
        kind: "p",
        text: "When it tested three AI toys, it rated 27% of their replies as not appropriate for kids. It also raised concerns about toys designed to create emotional attachment, the data they collect and how reliably they work.[^2]",
      },
      { kind: "p", text: "Here is what Kheelu does about each concern:" },
      {
        kind: "list",
        items: [
          {
            lead: "Replies:",
            text: "its answers come from a curated, closed content library, and every reply passes an age-graded safety layer. When it doesn’t know something, it says so. Before launch, we test it by trying to make it say things it shouldn’t. You can read every conversation.",
          },
          { lead: "Attachment:", text: "Kheelu tells your child it’s a toy, and it never asks them to keep a secret from you." },
          { lead: "Data:", text: "[the four facts at the top of this page](#facts). We don’t sell your data." },
          {
            lead: "How well it works:",
            text: `if it isn’t right for your family, return it within ${RETURN_DAYS} days of delivery, no questions asked.`,
          },
          { lead: "At 3:", text: "keep a grown-up nearby while they play." },
        ],
      },
    ],
  },

  /* ── The buyer's guide (/ai-toys-for-kids-in-india) ── */
  "what-is-an-ai-toy": {
    id: "what-is-an-ai-toy",
    question: "What is an AI toy?",
    answer:
      "An AI toy uses artificial intelligence to talk with your child, so it can reply to what your child says instead of playing fixed, recorded phrases. Kheelu is one: a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back, so they do the thinking.",
  },
  "ai-toy-or-tablet": {
    id: "ai-toy-or-tablet",
    question: "Is an AI toy better than a tablet for a young child?",
    answer:
      "They do different things. A tablet gives your child something to watch, and both the WHO and the AAP put a ceiling on it: no more than an hour a day from age two until five.[^1][^2] Kheelu has no screen at all: it answers your child, then asks a question back, so your child talks instead of watching.",
  },
  "ai-toy-age": {
    id: "ai-toy-age",
    question: "What age is an AI toy for?",
    answer:
      "Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. At 3, we advise play with a grown-up nearby. You enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age. What child-safety groups advise is on our [safety page](/safety).",
  },
  wifi: {
    id: "wifi",
    question: "Does Kheelu need Wi-Fi?",
    answer:
      "Only for open conversation in AI mode, which uses your home Wi‑Fi. Story mode’s stories, poems and jingles need no Wi‑Fi, and Bluetooth mode needs only a paired phone. So Kheelu still plays on a train or at a grandparent’s home with no Wi‑Fi.",
  },
  "how-much": {
    id: "how-much",
    question: "How much is Kheelu?",
    answer: {
      token: `Kheelu is {price:headline} (incl. GST) for the ${CAP_UNITS_TEXT}, with delivery anywhere in India included. A refundable {price:token} advance reserves yours today, and the remaining {price:balance} is due before delivery. After the first ${PREORDER_CAP_UNITS}, it is {price:full} (incl. GST), paid in full. You can pay by UPI, card or net banking, and you get a GST invoice.`,
      full: FULL_PRICE_ANSWER,
    },
  },

  /* ── The store (fold 5) ── */
  "paying-today": {
    id: "paying-today",
    question: "What am I paying today?",
    answer: {
      token:
        "A refundable {price:token} today reserves your Kheelu, and it is part of the {price:headline} price (incl. GST), not an extra fee. The remaining {price:balance} is due before delivery, by a payment link we send on WhatsApp and by email. Nothing is ever charged automatically.",
      full: "The whole price: {price:full} (incl. GST), with delivery anywhere in India included. There is nothing more to pay before dispatch: no balance link, and nothing charged automatically. Until we dispatch your Kheelu, all of it is refundable.",
    },
  },
  "change-my-mind": {
    id: "change-my-mind",
    question: "What if I change my mind?",
    answer: `Until we dispatch your Kheelu, message us with your order number and you get all of your money back, with no fee and no reason needed. We start your refund within ${REFUND_START_WORKING_DAYS} working days of your request; your bank takes ${BANK_REFUND_WORKING_DAYS} working days. After delivery, you can still return it within ${RETURN_DAYS} days, no questions asked.`,
  },
  "store-arrival": {
    id: "store-arrival",
    question: "When will my Kheelu arrive?",
    answer: {
      token: `${STORE_ARRIVAL} A reserved Kheelu is dispatched once the balance is paid.`,
      full: STORE_ARRIVAL,
    },
  },
  "how-to-pay": {
    id: "how-to-pay",
    question: "How can I pay?",
    answer:
      "By UPI, debit or credit card, or net banking, in Razorpay’s payment window. There are no payment fees and nothing recurring. Your card number, UPI ID and bank details go to Razorpay, not to us, and every order comes with a GST invoice.",
  },
} as const satisfies Readonly<Record<string, FaqItem>>;

export type FaqId = keyof typeof faqs;

/** A page's FAQ items, in the order it lists their ids. */
export function pickFaqs(ids: readonly FaqId[]): FaqItem[] {
  return ids.map((id) => faqs[id]);
}
