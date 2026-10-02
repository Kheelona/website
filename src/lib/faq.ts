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

export type FaqGroup = { title: string; items: readonly FaqEntry[] };

/** The /faq page (redesign 2026-10): the mockup's four groups, every answer
 *  taken from words the site already publishes (Home, /kheelu, /safety,
 *  /refund, /shipping). Questions the mockup asked that have no published
 *  answer yet are NOT here, and are listed in Technical-Todo.md: whether
 *  Kheelu understands a 3-year-old first time, whether a child's voice trains
 *  the model, two children sharing one Kheelu, gifting, and a delivery
 *  estimate by city. Content doc v7's wording for attachment, listening,
 *  WiFi, Diwali and outside India was incorporated on 2026-10-02.
 *  Every answer renders, so the FAQPage graph may describe all of them. */
export const FAQ_GROUPS: readonly FaqGroup[] = [
  {
    title: "About Kheelu",
    items: [
      {
        q: "What is Kheelu?",
        a: "Kheelu is a screen-free toy that talks with children aged 3 and up: your child speaks to it and it answers, tells stories, sings, and asks questions back. It is an interactive AI toy with no screen at all, it cannot reach the open internet, and every conversation is readable by you in the parent app.",
      },
      {
        q: "What ages is Kheelu for?",
        a: "Ages 3+. Kheelu meets your child where they are and grows with them: longer stories, bigger ideas, the next language.",
      },
      {
        q: "Which languages does Kheelu speak?",
        a: `${LANGUAGES_LINE}, with up to ten languages at launch. Kheelu can switch mid-sentence, in the languages you speak at home.`,
      },
      {
        q: "What will my child actually get out of Kheelu?",
        a: "A friend at 3, and a head start for school. Kheelu answers your child's questions, remembers the words they know, and builds on them the next day: stories, numbers, thinking games, and the languages you speak at home. The parent app counts the new words, so you see the growth, not just the play.",
      },
      {
        q: "Will my child get too attached?",
        a: "Kheelu is a toy and says so. It doesn't ask your child to keep secrets, and quiet hours mean it sleeps when you say. You can also see how long your child talks with it in the app.",
      },
      {
        q: "Is Kheelu the same as Lumi?",
        a: "Yes. Kheelu is the same toy. It was called Lumi until September 2026, when it took the name of the character who narrates this site. Nothing else changed: same product, same price, same ship date.",
      },
    ],
  },
  {
    title: "Safety and privacy",
    items: [
      {
        q: "Is it always listening?",
        a: "No. It listens only for its wake word. Nothing is recorded or sent until your child says it.",
      },
      {
        q: "Where does my child's voice go?",
        a: "Almost nowhere. The first thinking happens on the toy. What travels goes to Kheelona's own voice brain, stays in your region, and is never sold. Nothing is collected without your consent, and any conversation can be deleted in one tap from the parent app.",
      },
      {
        q: "Can Kheelu reach the open internet?",
        a: "No. Kheelu cannot browse or search. Answers come from a closed library built for children, so there are no random videos, no endless detours, and no strangers.",
      },
      {
        q: "Does it need WiFi?",
        a: "Only for open conversation. Stories work offline and music plays over Bluetooth.",
      },
    ],
  },
  {
    title: "Price and orders",
    items: [
      {
        q: "How much does Kheelu cost?",
        a: `${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT}, and ${FULL_PRICE} once they are gone. A refundable ${TOKEN_PRICE} reserves yours, and the ${BALANCE_PRICE} balance is due only when it ships.`,
      },
      {
        q: "Is there a subscription?",
        a: `${KHEELONA_PLUS_LINE} Nothing renews without you.`,
      },
      {
        q: `Can I get my ${TOKEN_PRICE} back?`,
        a: "Yes. Everything you pay to pre-order Kheelu is fully refundable until your Kheelu is dispatched. It usually reaches you in 5 to 7 working days once we start the refund.",
      },
      {
        q: "What if it breaks?",
        a: "A damaged or faulty Kheelu is our problem to fix, whatever the warranty terms end up saying. Those terms are published before your Kheelu is dispatched. Message us and we will make it right.",
      },
    ],
  },
  {
    title: "Delivery",
    items: [
      {
        q: "When will Kheelu ship?",
        a: `Shipping starts ${SHIP_DATE_TEXT}. Pre-orders are served first, in the order they were placed, and we message you before your Kheelu is dispatched.`,
      },
      {
        q: "What does delivery cost?",
        a: "Nothing extra. Delivery is included anywhere in India, and all prices include GST.",
      },
      {
        q: "Will it arrive before Diwali?",
        a: `We start shipping on ${SHIP_DATE_TEXT}, in the order people reserved.`,
      },
      {
        q: "Can I buy it from outside India?",
        a: "Not yet. If you are abroad and want one, message us and we will tell you honestly whether we can help.",
      },
    ],
  },
];
