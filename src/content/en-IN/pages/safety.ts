/// <reference types="next/image-types/global" />
import iraSticker from "@ds/assets/Cast/ira-sticker.png";
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import advikWhispering from "@ds/assets/Photo library/advik-02-whispering-to-kheelu-web.webp";
import eveningWithAmma from "@ds/assets/Photo library/tara-02-evening-with-amma-web.webp";
import starSun from "@ds/assets/Shapes/star-sun.svg";
import appPrivacy from "@/assets/app/app-privacy.webp";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { faqs } from "../faqs";
import { DEFAULT_OG } from "../organization";
import { RETENTION_LINE, RETENTION_MONTHS } from "../policies";
import { TRUST_COMPACT, trustItems } from "../trust";

/**
 * The safety page, `/safety` (task 5.3): the approved mockup `mockup/pages/safety.html` (D046), word for word, in its
 * fold order (structure §5); meta, alt texts and the full-mode price sentence as wiki/site/pages/safety.md words them.
 * The H1 is the copy page's recommended option B. Fold 2 keeps the founder's order (D020: button and light, providers,
 * reading the conversations, no sale) and joins the page's FAQPage with the two FAQ answers (wave-4 close; architecture
 * §9.2). Since task 8b.1 the claims follow the live team's code check (D058; safety.md "Changes after approval").
 * "Safe" appears only inside the two questions parents type. Certification is "applied for, not yet granted", with no
 * mark, standard or date (claims §6; legal requirements BIS-02). Shared words are read, never retyped: the FAQ answers
 * from faqs.ts, the retention line from policies.ts (D020), the trust pair from trust.ts; the price sentence, the CTA
 * label and the help line come from the offer, cta.ts and seller.ts through the page template.
 */

/** The FAQ photo's rendered width: the narrow (5 of 12) column of the fold's grid from 900 px, beside a 48 px gap
 *  (safety.css fold 7), in the container (16 px gutters, 48 from 1024, 1200 px wide from 1296); full width below. */
const FAQ_PHOTO_SIZES =
  "(min-width: 1296px) 480px, (min-width: 1024px) calc((100vw - 144px) * 5 / 12), (min-width: 900px) calc((100vw - 80px) * 5 / 12), calc(100vw - 32px)";

export const safetyPage = {
  meta: {
    title: "Are AI toys safe? How Kheelu works · Kheelona",
    description:
      "Are AI toys safe? Check Kheelu: its mic turns on only when someone presses its button, no camera, no internet browsing, and you read every conversation.",
    og: DEFAULT_OG,
  },
  sections: [
    /* Fold 1: the answer first, no CTA (the sticky bar shows from first paint). */
    {
      kind: "hero-section",
      config: {
        variant: "answer",
        heading: {
          id: "hero-title",
          eyebrow: "Safety",
          title: "Are AI toys safe? Check ours, {hand:fact by fact.}",
          lead: "Not all of them, so check before you buy one for a child aged 3 to 7. Ask when its microphone is on, how it understands your child, whether it can browse the internet, and whether you can read every conversation. Here’s how Kheelu answers each one, in plain words.",
        },
        media: {
          kind: "photo",
          image: { src: eveningWithAmma, alt: "A girl and her mother on a sofa in the evening lamp light, with Kheelu between them." },
          variant: "wide",
          xl: true,
        },
      },
    },
    /* Fold 2: the four facts in full, in the D020 order; each titled fact is a question of the page's FAQPage. */
    {
      kind: "trust-section",
      faq: true,
      config: {
        variant: "facts",
        id: "facts",
        band: true,
        heading: {
          id: "facts-title",
          eyebrow: "Four facts",
          title: "Is Kheelu safe for {hand:my child?}",
          lead: "Judge it by what it does. Here are the four facts that matter most, in full.",
        },
        items: [
          {
            icon: "microphone",
            title: "Is Kheelu always listening?",
            body: "No. Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after a couple of minutes of quiet. Until the next press, nothing is heard, recorded or sent. A light on Kheelu shows whenever it’s listening.",
          },
          {
            icon: "lock-simple",
            title: "How does Kheelu understand and answer my child?",
            body: "To understand and answer your child, Kheelu uses trusted speech and AI providers. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so.",
          },
          {
            icon: "eye",
            title: "Can I read every conversation?",
            body: "Yes, in the parent app, word for word, a few minutes after each one ends. Delete them all by deleting your account.",
          },
          {
            icon: "hand-heart",
            title: "Do you sell my child’s data?",
            body: "No. We don’t sell your data, and your child’s data is never used to advertise to them.",
          },
        ],
        photo: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
      },
    },
    /* Fold 3: what Kheelu never has or does; the guide link is internal, not a money CTA. */
    {
      kind: "trust-section",
      config: {
        variant: "never",
        heading: { id: "never-title", eyebrow: "Never", title: "What you {mark:won’t} find in Kheelu." },
        items: [
          { icon: "eye-slash", title: "No camera.", body: "It can’t see your child or your home." },
          { icon: "speaker-high", title: "No screen.", body: "Your child talks and listens instead of watching." },
          /* The live footer's words (D058 item 1; safety.md question 5): Kheelu does use the internet, on home Wi-Fi. */
          { icon: "wifi-slash", title: "No web browsing.", body: "It can’t browse or search the web." },
          { icon: "x", title: "No ads.", body: "Not in the toy, and not in the parent app." },
          { icon: "smiley", title: "No secrets.", body: "It never asks your child to keep one from you." },
        ],
        link: { label: "How to choose an AI toy: five checks", href: "/ai-toys-for-kids-in-india" },
      },
    },
    /* Fold 4: the parent controls beside the one real privacy screen (D044), never beside a cast photo. The controls are
       the app's as the live team's code check found them (D058 items 1 and 7; safety.md fold 4): no topics or quiet
       hours; the Save voice recordings switch. The screen's alt leaves out its "delete all chats" button, which hides
       chats on that phone, as Home's and the product page's alts do (D058 item 1; safety.md fold 4, task 8b.1b). */
    {
      kind: "feature-split",
      config: {
        variant: "app-screens",
        placement: "safety",
        band: true,
        heading: {
          id: "controls-title",
          eyebrow: "Parent controls",
          title: "The grown-up holds {hand:the keys.}",
          lead: "The parent app is where you set the rules.",
        },
        items: [
          {
            icon: "sliders-horizontal",
            title: "Your child’s age.",
            body: "Enter it when you set Kheelu up, and change it later if you need to. On every conversation, the AI model that answers your child is given that age and child-safety rules.",
          },
          { icon: "translate", title: "Languages.", body: "Pick the ones you speak at home." },
          {
            icon: "microphone-slash",
            title: "Voice recordings.",
            body: "Turn off Save voice recordings, and only the written record of each conversation is kept.",
          },
        ],
        screens: {
          images: [
            {
              src: appPrivacy,
              alt: `A real screen from the Kheelu parent app: the privacy centre. Chats are kept for ${RETENTION_MONTHS} months, with a button to download your child’s data.`,
            },
          ],
          caption: "The Kheelona app is live on Apple’s App Store and the Google Play Store.",
        },
        link: { label: "See what the app shows you", href: "/products/kheelu#app", icon: "eye" },
      },
    },
    /* Folds 5 and 6: retention (D020's line, then what removing a chat and deleting the account do, D058 item 1; next to
       the memory claim, D036) and certification (claims §6). */
    {
      kind: "feature-split",
      config: {
        variant: "pair",
        cards: [
          {
            heading: { id: "kept-title", eyebrow: "Retention", title: "How long conversations are {hand:kept.}" },
            copy: [
              RETENTION_LINE,
              "Removing a chat in the app hides it on that phone. Deleting your account deletes your child’s profile, conversations and recordings from our servers.",
              "Kheelu remembers earlier conversations with your child, and you can read every one of them.",
            ],
            link: { label: "Read our privacy policy", href: "/privacy" },
          },
          {
            heading: { id: "cert-title", eyebrow: "Certification", title: "Toy-safety certification: where it {hand:stands.}" },
            copy: [
              "We have applied for Kheelu’s BIS licence for toy safety. It has not been granted yet, so no toy-safety certificate has been issued to us so far. Until one is, you won’t see a mark or a badge from us.",
            ],
          },
        ],
      },
    },
    /* Fold 7: the two hard questions left, the first open; their sources under them. */
    {
      kind: "faq-section",
      config: {
        variant: "photo",
        band: true,
        heading: { id: "faq-title", eyebrow: "Questions", title: "Questions parents {hand:ask.}" },
        items: [faqs["age-three"], faqs["child-safety-groups"]],
        firstOpen: true,
        sourceMarker: "Source",
        photo: {
          image: {
            src: advikWhispering,
            alt: "A boy in a mustard shirt leaning close to whisper to Kheelu, on a cane chair by a tall window.",
          },
          sizes: FAQ_PHOTO_SIZES,
          variant: "wide",
        },
        more: { label: "How to choose an AI toy", href: "/ai-toys-for-kids-in-india" },
      },
      notes: {
        variant: "inline",
        label: "Sources",
        sources: [
          {
            citation:
              "Common Sense Media, “Common Sense Media Warns Against AI Toy Companions After Research Reveals Safety Risks” (press release), 2026, paragraph 1.",
            href: "https://www.commonsensemedia.org/press-releases/common-sense-media-warns-against-ai-toy-companions-after-research-reveals-safety-risks",
          },
          {
            citation: "Common Sense Media Youth AI Safety Institute, “AI Toys” (risk assessment), 2026, “What we found”.",
            href: "https://institute.commonsensemedia.org/risk-assessments/ai-toys",
          },
        ],
      },
    },
    /* Fold 8: the one action, the price sentence, delivery and returns beside it, and a person to ask. */
    {
      kind: "close-section",
      config: {
        variant: "split",
        heading: {
          eyebrow: "Pre-order",
          title: "Check it all for yourself, {hand:at home.}",
          lead: "The wake-up button, the light and every conversation in the parent app: you can check each one once it’s home.",
        },
        cta: { cta: "finale", arrow: true, block: true, trust: TRUST_COMPACT.map((id) => trustItems[id]), helpLine: true },
        art: {
          tone: "blue",
          label: "A laughing girl in a peach kurta beside Kheelu, the cream plush rabbit.",
          layers: [
            { image: { src: starSun, alt: "" }, left: 6, width: 28, top: 7 },
            { image: { src: iraSticker, alt: "" }, left: 38, width: 56, bottom: 0 },
            { image: { src: kheeluSticker, alt: "" }, left: 3, width: 42, bottom: 3, rotate: -5 },
            { doodle: { name: "chalk-heart" }, left: 84, width: 11, top: 8, rotate: 12 },
          ],
        },
        artClamp: true,
      },
    },
  ],
} as const satisfies PageContent;
