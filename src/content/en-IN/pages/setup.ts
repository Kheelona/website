/// <reference types="next/image-types/global" />
import bellyModule from "@ds/assets/Kheelu/kheelu-belly-module.png";
import appActivity from "@/assets/app/app-activity.webp";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { DEFAULT_OG } from "../organization";
import { seller } from "../seller";

/**
 * The setup page, `/setup` (task 5.8): the approved mockup `mockup/pages/setup.html` (D046), word for word, in the fold
 * order of structure §5's corrected setup row (the Wi-Fi tip closes the "Before you start" fold, above the steps); meta
 * and alt texts as wiki/site/pages/setup.md words them, H1 option A. No chilli button and no buy bar (setup.md question
 * 4; the CMO view: as built): the page closes on a person to ask and a link to the product page.
 *
 * One line differs from the mockup: step 2 takes the CMO review's values (cmo-review-pages-help-2026-10-11, M-S1). The
 * mockup's "button on Kheelu's back" and "pulsing blue" were the app's own bracketed placeholders, so the step names no
 * place and no colour until the founder answers (setup.md question 1). The wake-up button fold keeps D018's words and no
 * wake-word phrase (A10). The activity screen is the D044 round-2 file (task 1.5b: no "Games"), with its caption saying
 * its content is example data. The four steps are the page's HowTo (architecture §9.2). The support line is read from
 * seller.ts, never retyped.
 */

const { phone, tel, whatsapp, email } = seller.support;

/** Fold 3's heading, which also names the HowTo of its four steps. */
const CONNECT_TITLE = "Connect Kheelu to your {hand:home Wi‑Fi.}";

export const setupPage = {
  meta: {
    title: "How to set up Kheelu on day one · Kheelona",
    description:
      "How to set up Kheelu: charge it, connect it to your home Wi-Fi with the parent app, set your child’s age, and show your child the wake-up button.",
    og: DEFAULT_OG,
  },
  sections: [
    /* Fold 1: the whole of day one in one answer, words only (the steps carry the page). */
    {
      kind: "hero-section",
      config: {
        variant: "answer",
        heading: {
          id: "hero-title",
          eyebrow: "Day one with Kheelu",
          title: "How to set up Kheelu on {hand:day one.}",
          lead: "Charge Kheelu, then open the parent app on your phone. The app connects Kheelu to your home Wi‑Fi and asks for your child’s age. Then show your child the wake-up button: one press starts a conversation. Afterwards, you can read every word of it in the app.",
        },
      },
    },
    /* Fold 2: what the app asks a parent to have ready, then the 2.4 GHz tip. */
    {
      kind: "feature-split",
      config: {
        variant: "ticks",
        band: true,
        heading: { id: "before-title", title: "Before you start." },
        items: [
          { icon: "battery-charging", body: "Charge Kheelu with the charger in the box. {ph:F4 the charger type, and how long a full charge takes}" },
          { icon: "lock-simple", body: "Have your home Wi‑Fi password ready." },
          { icon: "wifi-high", body: "Stay close to your Wi‑Fi router." },
          {
            icon: "download-simple",
            body: "Keep your phone with you, with the parent app installed. {ph:C6 where to get the parent app: App Store and Google Play links, and the listing name}",
          },
        ],
      },
      tip: "Kheelu connects to 2.4 GHz Wi‑Fi. If your router shows two network names, choose the 2.4 GHz one.",
    },
    /* Fold 3: the four steps of the connection, in the app's order; step 2 as the CMO review words it (M-S1). */
    {
      kind: "steps-section",
      config: {
        variant: "four",
        id: "connect",
        heading: { id: "connect-title", title: CONNECT_TITLE },
        steps: [
          { tone: "sun", title: "Open the parent app.", body: "Follow the steps on screen. The app walks you through the rest." },
          {
            tone: "blue",
            title: "Press and hold Kheelu’s setup button. {ph:which button and where; the app’s own screen still shows “[back]”}",
            body: "Hold it for 3 seconds, until its light starts pulsing.",
          },
          { tone: "chilli", title: "Join Kheelu’s own Wi‑Fi.", body: "When the app asks, connect your phone to Kheelu’s own small Wi‑Fi network." },
          { tone: "sun", title: "Add your home Wi‑Fi.", body: "Finish in the app with your home Wi‑Fi password. Kheelu then joins your home network." },
        ],
      },
      howTo: { name: CONNECT_TITLE },
    },
    /* Fold 4: the one setting that changes what Kheelu says, and the other choices in the app; no media. */
    {
      kind: "feature-split",
      config: {
        variant: "photo",
        split: "end",
        band: true,
        heading: { id: "age-title", title: "Tell the app {hand:your child’s age.}" },
        copy: [
          "You enter your child’s age in the parent app. Every reply Kheelu gives passes a safety layer set to that age.",
          "You can change it later. Kheelu picks up the change the next time it’s online.",
          "Kheelu is made for children aged 3 to 7. If your child is 3, keep a grown-up nearby while they talk.",
          "While you’re in the app, you can also choose your family’s languages, pick which topics are open and set quiet hours.",
        ],
      },
    },
    /* Fold 5: the one thing the child needs to know (D018), beside the tummy unit. */
    {
      kind: "feature-split",
      config: {
        variant: "photo",
        heading: { id: "button-title", title: "Show your child the {hand:wake-up button.}" },
        copy: [
          "Kheelu only listens when someone presses its wake-up button. {ph:where the wake-up button sits on Kheelu}",
          "One press starts a conversation. A light on Kheelu shows whenever it’s listening. After about a minute of quiet, it switches itself off, so the next chat starts with another press.",
        ],
        media: {
          kind: "photo",
          image: { src: bellyModule, alt: "Kheelu’s tummy unit up close, with its speaker, light ring and buttons." },
          variant: "square",
          fit: "belly",
        },
      },
    },
    /* Fold 6: day one handed to the child, and where the conversation will wait (the real screen, example content). */
    {
      kind: "feature-split",
      config: {
        variant: "photo",
        split: "start",
        band: true,
        heading: { id: "talk-title", title: "Then {hand:let them talk.}" },
        copy: [
          "The first conversation is your child’s. Kheelu answers, then asks a question back.",
          "Later, open the parent app to read every word of it. You can delete any conversation in one tap.",
          "No Wi‑Fi for a while? Story mode’s stories, poems and jingles still play. AI mode needs your home Wi‑Fi, and Bluetooth mode needs only your paired phone.",
        ],
        media: {
          kind: "photo",
          image: { src: appActivity, alt: "The parent app’s activity screen on a phone, showing example activity for one child." },
          ratio: "576 / 1209",
          caption: "The parent app’s activity screen. The child’s name and the activity shown are examples.",
          fit: "shot",
        },
      },
    },
    /* Fold 7: a person to ask, and the product page for anyone still deciding; no chilli button. */
    {
      kind: "close-section",
      config: {
        variant: "links",
        heading: { title: "Stuck? {hand:We’ll help.}" },
        contact: `[WhatsApp](${whatsapp}) or [call us on {nowrap:${phone}}](${tel}), or email [${email}](mailto:${email}). Tell us your order number, and what you see on Kheelu and in the app.`,
        action: { label: "All the ways to reach us", href: "/contact", variant: "secondary", icon: "chat-circle-dots" },
        meet: { lead: "Don’t have Kheelu yet?", link: "[Meet Kheelu](/products/kheelu)" },
      },
    },
  ],
} as const satisfies PageContent;
