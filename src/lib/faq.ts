import type { FaqEntry } from "@/components/molecules/Faq";
import {
  LAUNCH_PRICE,
  FULL_PRICE,
  TOKEN_PRICE,
  BALANCE_PRICE,
  CAP_UNITS_TEXT,
  SHIP_DATE_TEXT,
  LANGUAGES_LINE,
  KHEELONA_PLUS_LINE,
} from "@/config/site";

/** EVERY question the site answers in more than one place, answered ONCE
 *  (founder, 2026-10-04: "all pages in sync").
 *
 *  Before this, Home, /products/kheelu, /faq and /safety each kept their own
 *  copy of the same questions, and they had drifted: the cost answer, the
 *  refund answer, the ship-date answer, the internet answer, the languages
 *  answer, the ages answer and "what if it breaks" all differed from page to
 *  page, some in substance. Every page now builds its list from these entries,
 *  so a question asked on two pages has one answer by construction, and
 *  test/faq-sync.test.ts fails if a page ever answers a shared question in its
 *  own words again.
 *
 *  Home is the source of truth for wording. Every answer is visible copy, so
 *  FAQPage schema may describe it. */
export const QA = {
  whatIs: {
    q: "What is Kheelu?",
    /* SEO round 2026-08-12: carries "screen-free toy" and "interactive AI toy"
       exactly; "smart toy" is the category Kheelu is contrasted against. */
    a: "Kheelu is a screen-free toy that talks with children aged 3 and up: your child speaks to it and it answers, tells stories, sings, and asks questions back. It is an interactive AI toy with no screen at all, it cannot reach the open internet, and every conversation is readable by you in the parent app.",
  },
  /* V6 D7: opens with the same honest verdict as the /safety flagship answer. */
  safeSmallChild: {
    q: "Is an AI toy safe for a small child?",
    a: "Not all of them are, and what makes a safe toy is how it is built. Kheelu listens only for its wake word and records or sends nothing until it hears it, the first thinking happens on the toy, answers come from a closed library rather than the open internet, and you can read or delete every conversation.",
  },
  cost: {
    q: "How much does Kheelu cost in India?",
    a: `${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT}, and ${FULL_PRICE} once they are gone. A refundable ${TOKEN_PRICE} reserves your Kheelu now, and the ${BALANCE_PRICE} balance is due only when it is ready to ship. Every Kheelu includes 6 months of Kheelona+.`,
  },
  subscription: {
    q: "Is there a subscription?",
    a: `${KHEELONA_PLUS_LINE} Nothing renews without you.`,
  },
  refund: {
    q: `Can I get my ${TOKEN_PRICE} back?`,
    a: `Yes, in full, any time before we dispatch your Kheelu. It usually reaches you in 5 to 7 working days once we start the refund, and the ${BALANCE_PRICE} balance is due only when your Kheelu is ready to ship.`,
  },
  ship: {
    q: "When does Kheelu ship?",
    a: `Shipping starts ${SHIP_DATE_TEXT}. Reserving now holds the ${LAUNCH_PRICE} price and your place in line for a refundable ${TOKEN_PRICE}. Pre-orders are served first, in the order they were placed, and we message you before your Kheelu is dispatched.`,
  },
  /* V6 D4a (founder-licensed fact): mode-precise. */
  internet: {
    q: "Does Kheelu need the internet to work?",
    a: "For open conversation, yes: AI mode runs on your home WiFi. For everything else, no: Story-mode stories and lessons play offline, and Bluetooth music needs only a paired phone. On a train or anywhere without a signal, your child still has stories to interrupt, question, and be quizzed on.",
  },
  languages: {
    q: "Which languages does Kheelu speak?",
    a: `${LANGUAGES_LINE}, with up to ten languages at launch. Kheelu can switch mid-sentence, in the languages you speak at home.`,
  },
  /* SEO round 2026-08-12: the "5 6 year olds" keyword hangs off the family arc
     at the founder's direction. */
  ages: {
    q: "What ages is Kheelu for?",
    a: "Ages 3+. Kheelu meets your child where they are and grows with them: longer stories, bigger ideas, the next language. The family that follows brings learning toys for 5 and 6 year olds onward.",
  },
  /* THE RENAME, ANSWERED IN VISIBLE COPY (§8.36-a): "older listings still say
     Lumi" is the sentence an answer engine most needs to quote. */
  lumi: {
    q: "Is Kheelu the same as Lumi?",
    a: "Yes. Kheelu is the same toy. It was called Lumi until September 2026, when it was renamed Kheelu. Nothing else changed: same product, same price, same ship date. Older listings and articles still say Lumi, and they are describing this.",
  },
  /* From /refund, the published promise, rather than "warranty details land
     closer to launch", which the product page used to say on its own. */
  breaks: {
    q: "What if my child breaks it?",
    a: "A damaged or faulty Kheelu is our problem to fix, whatever the warranty terms end up saying. Those terms are published before your Kheelu is dispatched. Message us and we will make it right.",
  },
  /* Research-anchored (founder decision 4, 2026-10-04). */
  getOutOf: {
    q: "What will my child actually get out of Kheelu?",
    a: "More of the back-and-forth conversation that helps a young brain grow. Kheelu answers your child's questions, asks one back, and remembers the words they know, so each day picks up where the last one stopped: stories, numbers, thinking games, and the languages you speak at home. The parent app counts the new words for you.",
  },
  /* "It says it is a toy" is founder-confirmed (2026-10-04). Usage time in the
     app is NOT a published feature, so it is not claimed here. */
  attached: {
    q: "Will my child get too attached?",
    a: "Kheelu is a toy, and it tells your child so. It never asks your child to keep a secret from you, and quiet hours mean it sleeps when you say. You can read every conversation in the parent app.",
  },
  alwaysListening: {
    q: "Is Kheelu always listening?",
    a: "No. Kheelu listens only for its wake word. Until your child says it, nothing is recorded and nothing is sent. Every conversation after the wake word is readable in the parent app, where you can delete any of it.",
  },
  /* Founder-confirmed 2026-10-04: Kheelona's own servers, in India. */
  voice: {
    q: "Where does my child's voice go?",
    a: "Almost nowhere. The first thinking happens on the toy. What travels goes to Kheelona's own servers in India, and is never sold. Nothing is collected without your consent, and any conversation can be deleted in one tap from the parent app.",
  },
  openInternet: {
    q: "Can Kheelu reach the open internet?",
    a: "No. Kheelu cannot browse or search. Answers come from a closed library built for children, so there are no random videos, no endless detours, and no strangers.",
  },
  readConversations: {
    q: "Can I read the conversations?",
    a: "Yes. Every conversation, word for word, in the parent app. The log is private to you, and you can delete any of it with one tap.",
  },
  delivery: {
    q: "What does delivery cost?",
    a: "Nothing extra. Delivery is included anywhere in India, and all prices include GST.",
  },
  diwali: {
    q: "Will it arrive before Diwali?",
    a: `We start shipping on ${SHIP_DATE_TEXT}, in the order people reserved, so reserving earlier puts you earlier in line. We message you before your Kheelu is dispatched.`,
  },
  abroad: {
    q: "Can I buy it from outside India?",
    a: "Not yet. If you are abroad and want one, message us and we will tell you honestly whether we can help.",
  },
} as const satisfies Record<string, FaqEntry>;

/** Home: the eight questions parents ask first. */
export const HOME_FAQ: FaqEntry[] = [
  QA.whatIs,
  QA.safeSmallChild,
  QA.cost,
  QA.subscription,
  QA.refund,
  QA.ship,
  QA.internet,
  QA.languages,
];

/** /products/kheelu: the shared answers plus the product page's own SEO
 *  questions (keyword placements from the 2026-08-12 SEO round). */
export const PRODUCT_FAQ: FaqEntry[] = [
  QA.safeSmallChild,
  QA.internet,
  QA.languages,
  QA.ages,
  /* SEO round 2026-08-12, founder decision: "best" lives in the parents'-voice
     QUESTION only; the answer makes no best claim. */
  {
    q: "What are the best learning toys for 3-year-olds?",
    a: "Look for a toy that answers back. At 3, children learn through back-and-forth conversation: questions, stories they can interrupt, words that build on yesterday's words. Kheelu is an AI educational toy built around exactly that loop, and it grows with your child from 3 up.",
  },
  QA.readConversations,
  { q: "Do you sell our data?", a: "No. Never sold, never used to sell your child anything. That is the whole point." },
  QA.breaks,
  QA.ship,
  QA.cost,
  /* CORRECTED 2026-09-05: this once said reserving costs nothing; the retired
     wording is pinned as banned in test/preorder-copy.test.ts. */
  {
    q: "Do I have to pay anything now?",
    a: `Yes. A refundable ${TOKEN_PRICE} reserves your Kheelu and holds the ${LAUNCH_PRICE} price. The ${BALANCE_PRICE} balance is due only when your Kheelu is ready to ship, and the ${TOKEN_PRICE} comes back in full if you ask before we dispatch.`,
  },
  QA.lumi,
  {
    q: "What is PlayOS?",
    a: "The platform Kheelu runs on. It gives each character a voice and a personality, and keeps every answer right for your child's age.",
  },
  {
    q: "Can Kheelu play music?",
    a: "Yes. Pair a phone over Bluetooth and Kheelu becomes the speaker in the room, for your playlist, rhymes, or an audiobook. That is one of its three modes, alongside conversation and Story mode stories.",
  },
  QA.subscription,
  {
    q: "What is Kheelona+?",
    a: "The content and the controls: stories, lessons, language packs, and the parent app that shows you the learning. It is included free for the first 6 months with every Kheelu.",
  },
  {
    q: "Why reserve now?",
    a: `The price is ${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT} and ${FULL_PRICE} once they are gone. The ${TOKEN_PRICE} you pay today is fully refundable until we ship.`,
  },
  /* SEO round 2026-08-12, founder decision: the gendered gift keyword is
     neutralised; "unique" is grounded in one published mechanism. */
  {
    q: "Is Kheelu a good birthday gift?",
    a: `It is a unique birthday gift in one specific way: it keeps changing. Kheelu learns your child's words and grows with them, so the toy at 5 is not the toy they unwrapped at 3. Reserving now holds the ${LAUNCH_PRICE} price.`,
  },
];

export type FaqGroup = { title: string; items: readonly FaqEntry[] };

/** /faq: the mockup's four groups, every entry from QA. Questions the mockup
 *  asked that have no published answer yet are NOT here (MARKETING-TODO.md):
 *  whether Kheelu understands a 3-year-old first time, whether a child's voice
 *  trains the model, two children sharing one Kheelu, gifting, a delivery
 *  estimate by city. */
export const FAQ_GROUPS: readonly FaqGroup[] = [
  {
    title: "About Kheelu",
    items: [QA.whatIs, QA.ages, QA.languages, QA.getOutOf, QA.attached, QA.lumi],
  },
  {
    title: "Safety and privacy",
    items: [QA.alwaysListening, QA.voice, QA.openInternet, QA.internet],
  },
  {
    title: "Price and orders",
    items: [QA.cost, QA.subscription, QA.refund, QA.breaks],
  },
  {
    title: "Delivery",
    items: [QA.ship, QA.delivery, QA.diwali, QA.abroad],
  },
];
