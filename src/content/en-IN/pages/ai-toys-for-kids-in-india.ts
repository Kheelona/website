/// <reference types="next/image-types/global" />
import kabirSticker from "@ds/assets/Cast/kabir-sticker.png";
import myraSticker from "@ds/assets/Cast/myra-sticker.png";
import kheeluFront from "@ds/assets/Kheelu/kheelu-front.webp";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import iraStory from "@ds/assets/Photo library/ira-01-story-on-the-bed-web.webp";
import cloudBlue from "@ds/assets/Shapes/cloud-blue.svg";
import heartChilli from "@ds/assets/Shapes/heart-chilli.svg";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { pickFaqs } from "../faqs";
import { DEFAULT_OG } from "../organization";
import { product } from "../products/kheelu/product";
import { TRUST_COMPACT, trustItems } from "../trust";

/**
 * The buyer's guide, `/ai-toys-for-kids-in-india` (task 5.4; structure §5): the approved mockup
 * `mockup/pages/ai-toys-for-kids-in-india.html` (D046), word for word, in its fold order; meta, the alt texts and the
 * full-mode words as wiki/site/pages/ai-toys-for-kids-in-india.md gives them. The H1 is the copy page's recommended
 * option B. Answer-first: the hero's lead is the whole answer (five questions to put to any maker), so the hero carries
 * no CTA and the phone buy bar shows from first paint. No competitor is named and no competitor price appears (B14):
 * the checks are neutral questions, and the robot-or-plush answer describes kinds of toys, never brands.
 * The board labels name the outfits the cast stickers show (the copy page asks the builder to confirm them against the
 * files: Myra's mustard floral frock, Kabir's glasses and rust T-shirt, as the mockup words them).
 * Shared words are read, never retyped: the five answers from faqs.ts (the page's FAQPage, with the two sources their
 * markers point to), the languages from the product facts, the trust pair from trust.ts; the price sentence, the CTA
 * label and the help line come from the offer, cta.ts and seller.ts through the page template.
 */

/** The languages answer: the product's languages by name and its launch ceiling (product.ts). */
const LANGUAGE_NAMES = product.languages.map((l) => l.name);
const LANGUAGES_ANSWER = `Eight today: ${LANGUAGE_NAMES.slice(0, -1).join(", ")} and ${LANGUAGE_NAMES.at(-1)}, with up to ${product.languageCeiling} at launch. It can switch between them mid-sentence.`;

/** The FAQ photo's rendered width: the full container below 720 px (16 px gutters), at most 420 px from 720 px, and
 *  from 900 px the narrow (5 of 12) column of the fold's grid beside its 48 px gap, at most 360 px (faq-section.css,
 *  `ks-faq-photo__photo--clamp`; the column reaches 360 px at 1024 px, where the gutters grow to 48 px). */
const FAQ_PHOTO_SIZES = "(min-width: 1024px) 360px, (min-width: 900px) calc((100vw - 80px) * 5 / 12), (min-width: 720px) 420px, calc(100vw - 32px)";

export const aiToysPage = {
  meta: {
    title: "AI toys for kids in India: how to choose one · Kheelona",
    description: {
      token:
        "AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7. {price:headline} (incl. GST); reserve with a refundable {price:token}.",
      full: "AI toys for kids in India: five checks to make before you buy, and how Kheelu meets each. Ages 3 to 7. {price:full} (incl. GST), delivered anywhere in India.",
    },
    og: DEFAULT_OG,
  },
  sections: [
    /* Fold 1: the answer first, no CTA (the sticky bar shows from first paint); the board's doodle stays still. */
    {
      kind: "hero-section",
      config: {
        variant: "answer",
        heading: {
          id: "hero-title",
          eyebrow: "A guide for parents",
          title: "AI toys for kids in India: five checks {hand:before you buy.}",
          lead: "Before you buy an AI toy in India, put five questions to its maker. Does it have a screen or a camera? When is its microphone on? Can it reach the open internet? Can you read every conversation? Does it speak your family’s languages? A good AI toy for a 3 to 7 year old answers all five plainly.",
        },
        media: {
          kind: "art",
          clamp: true,
          art: {
            tone: "sun",
            label: "A little girl in a mustard floral frock beside Kheelu, the cream plush rabbit.",
            layers: [
              { image: { src: cloudBlue, alt: "" }, left: 52, width: 40, top: 7 },
              { image: { src: myraSticker, alt: "" }, left: 42, width: 50, bottom: 0 },
              { image: { src: kheeluSticker, alt: "" }, left: 4, width: 44, bottom: 3, rotate: -5 },
              { doodle: { name: "ink-question-mark" }, left: 44, width: 11, top: 14, rotate: -10 },
            ],
          },
        },
      },
    },
    /* Fold 2: the five checks, neutral questions a parent can put to any maker; the article link is not a money CTA. */
    {
      kind: "steps-section",
      config: {
        variant: "checks",
        band: true,
        heading: {
          id: "checks-title",
          eyebrow: "The five checks",
          title: "Five things to {mark:check} before you buy an AI toy.",
          lead: "Each one is a question a maker should answer in a sentence. If the answer is vague, ask again.",
        },
        steps: [
          { title: "Does it have a screen or a camera?", body: "A screen gives your child something to watch. A camera can see your child and your home." },
          { title: "When is the microphone on?", body: "Ask what turns it on, how you can tell it’s listening, and when it switches off." },
          {
            title: "Can it reach the open internet?",
            body: "A toy that can browse can land on things you’d never choose for your child. Ask where its answers come from.",
          },
          {
            title: "Can you read every conversation?",
            body: "A summary shows you what the maker chose to show. Ask whether you can read every word, and delete it yourself.",
          },
          { title: "Does it speak your family’s languages?", body: "Ask which languages it speaks today, not which ones are coming." },
        ],
        action: { label: "Read more: what to look for in a safe AI toy", href: "/stories/what-to-look-for-in-a-safe-ai-toy" },
      },
    },
    /* Fold 3: Kheelu's answers, confirmed facts only, in the checks' order; the voice path is the safety page's (D035). */
    {
      kind: "trust-section",
      config: {
        variant: "meets",
        heading: {
          id: "answers-title",
          eyebrow: "Kheelu’s answers",
          title: "How Kheelu meets {hand:each check.}",
          lead: "Kheelu by Kheelona is a screen-free plush toy for children aged 3 to 7. Its answers, in the same order:",
        },
        items: [
          { icon: "eye-slash", title: "Screen or camera", body: "Neither. No screen and no camera." },
          {
            icon: "microphone",
            title: "Microphone",
            body: "On only after someone presses the wake-up button. A light shows whenever it’s listening, and it switches itself off after about a minute of quiet.",
          },
          {
            icon: "wifi-slash",
            title: "Open internet",
            body: "It can’t browse the internet. Its answers come from a curated, closed content library, and when it doesn’t know something, it says so.",
          },
          { icon: "eye", title: "Every conversation", body: "Yes, in the parent app, word for word. Delete any of them in one tap." },
          { icon: "translate", title: "Languages", body: LANGUAGES_ANSWER },
        ],
        pointer: "How Kheelu understands and answers your child, and how long conversations are kept, are on our safety page.",
        link: { label: "See the full safety facts", href: "/safety", icon: "shield-check" },
      },
    },
    /* Fold 4: robot or plush, by kind of toy (no brand); the page's in-text product link. */
    {
      kind: "feature-split",
      config: {
        variant: "photo",
        split: "start",
        band: true,
        heading: { id: "plush-title", eyebrow: "Plush or robot", title: "AI robot or {hand:AI plush?}" },
        text: "It depends on what you want your child to do. A robot toy with a screen often shows faces, games and videos, so your child watches. A plush toy that talks has no screen, so your child talks and listens instead. Kheelu is a soft plush rabbit, not a robot, with a speaker in its tummy.",
        media: {
          kind: "art",
          plush: true,
          art: {
            tone: "blue",
            layers: [
              { image: { src: starSun, alt: "" }, left: 6, width: 26, top: 7 },
              { image: { src: kheeluFront, alt: "Kheelu, the soft cream plush rabbit with rainbow ears and a speaker in its tummy." }, left: 22, width: 56, bottom: 4 },
            ],
          },
        },
        link: { label: "See what Kheelu does", href: "/products/kheelu" },
      },
    },
    /* Fold 5: the five answers from faqs.ts, all closed (the page's FAQPage), Ira's photo, the two sources inline. */
    {
      kind: "faq-section",
      config: {
        variant: "photo",
        heading: { id: "faq-title", eyebrow: "Questions", title: "Questions parents {hand:ask.}" },
        items: pickFaqs(["what-is-an-ai-toy", "ai-toy-or-tablet", "ai-toy-age", "wifi", "how-much"]),
        sourceMarker: "Source",
        photo: {
          image: {
            src: iraStory,
            alt: "A laughing girl in a peach kurta sitting cross-legged on a block-print bedsheet, telling Kheelu a story with both hands.",
          },
          sizes: FAQ_PHOTO_SIZES,
          clamp: true,
        },
      },
      notes: {
        variant: "inline",
        label: "Sources",
        sources: [
          {
            citation:
              "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
            href: "https://iris.who.int/handle/10665/311664",
          },
          {
            citation: "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
            href: "https://doi.org/10.1542/peds.2016-2591",
          },
        ],
      },
    },
    /* Fold 6: the one action in a tinted card, the price sentence, delivery and returns beside it, and a person to ask. */
    {
      kind: "close-section",
      config: {
        variant: "guide",
        tone: "blue",
        heading: {
          eyebrow: "Pre-order",
          title: "Five checks, answered. Now {hand:meet Kheelu.}",
          lead: "Bring it home and check all five answers for yourself.",
        },
        cta: { cta: "finale", arrow: true, block: true, trust: TRUST_COMPACT.map((id) => trustItems[id]), helpLine: true },
        art: {
          tone: "sun",
          label: "A boy in glasses and a rust T-shirt beside Kheelu, the cream plush rabbit.",
          layers: [
            { image: { src: heartChilli, alt: "" }, left: 6, width: 26, top: 8 },
            { image: { src: kabirSticker, alt: "" }, left: 40, width: 54, bottom: 0 },
            { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
            { doodle: { name: "ink-star" }, left: 82, width: 11, top: 9, rotate: 14 },
          ],
        },
      },
    },
  ],
} as const satisfies PageContent;
