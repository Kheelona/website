/// <reference types="next/image-types/global" />
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import heartChilli from "@ds/assets/Shapes/heart-chilli.svg";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { placeholder } from "@/lib/content/placeholder";
import { DEFAULT_OG, organization } from "../organization";
import { seller } from "../seller";
import { TRUST_COMPACT, trustItems } from "../trust";

/**
 * The team page, `/team` (task 5.7): the approved mockup `mockup/pages/team.html` (D046), word for word, in its fold
 * order (structure §5); meta, alt texts and the full-mode price sentence as wiki/site/pages/team.md words them. The H1
 * is the copy page's recommended option A. What the plan changes on purpose:
 * - fold 1's lede is the CMO review's blocking fix M-T1 (wiki/qa/cmo-review-pages-help-2026-10-11.md), word for word:
 *   the first screen now says what Kheelu is, the age band and the page's search term ("Kheelona founders");
 * - the founders' background lines and the "Recognised by." programmes are proof-gated (D038, F11): gated slots that
 *   render nothing, on any environment, until each proof is filed in wiki/raw/. A gated background holds only the copy
 *   page's note of what waits, never the claim (the content model holds EXTERNAL items only, content-boundary.md); its
 *   words are written and signed off with the proof (team.md question 1), then the gate is deleted;
 * - the founder photos wait on B24: each card shows the mockup's photo placeholder (beta shows it; production refuses
 *   it until the founder supplies and approves the photos).
 * Shared facts are read, never retyped: the founders (names, roles, fragments, profiles) from organization.ts, the
 * company and the support line from seller.ts (D032), the trust pair from trust.ts; the price sentence, the CTA label
 * and the help line come from the offer, cta.ts and seller.ts through the page template. The AboutPage node is
 * described by fold 2's answer (task 4.5 item 5) and named as the live page named it (architecture §9.2).
 */

const [apoorva, aman, kashyap] = organization.founders;
const { support } = seller;
const names = organization.founders.map((f) => f.name);
/** The three names in one phrase ("A, B and C"), in organization.ts's order. */
const founderNames = `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;

/** The founder photo, until B24 is answered (team.md fold 3; assets.md: only if supplied and approved). */
const photo = placeholder("B24", "founder photo");
/** A background line waiting on its proof (D038, F11): never rendered while gated. */
const background = (firstName: string) => ({ text: `${firstName}’s background, shown once its proof is filed`, gated: { proof: "F11" } }) as const;
/** A programme of the recognition strip, by name only, waiting on its proof (D038, F11; B25: text only, no logo). */
const programme = (name: string) => ({ name, gated: { proof: "F11" } }) as const;
/** A founder's card: the facts from organization.ts, the team page's words for the rest. */
const card = (founder: (typeof organization.founders)[number], words: { initials: string; body: string; firstName: string }) => ({
  name: founder.name,
  role: founder.role,
  anchor: founder.anchor,
  initials: words.initials,
  photo,
  body: words.body,
  bio: background(words.firstName),
  link: { label: `${words.firstName} on LinkedIn`, href: founder.sameAs },
});

export const teamPage = {
  meta: {
    title: "Kheelona founders: the parents building Kheelu",
    description:
      "Meet the Kheelona founders, Apoorva Sahu, Aman Soni and Kashyap C.R: parents in Bengaluru building Kheelu, a screen-free plush toy for ages 3 to 7.",
    og: DEFAULT_OG,
  },
  sections: [
    /* Fold 1: whose page this is, no CTA (the sticky bar shows from first paint); the product-only board, no cast child
       (a cast photo beside the founders could read as their own children). */
    {
      kind: "hero-section",
      config: {
        variant: "answer",
        heading: {
          id: "hero-title",
          eyebrow: "Team",
          title: "The {hand:parents} building Kheelu.",
          lead: "Kheelona’s founders are parents in Bengaluru, building Kheelu: a screen-free plush toy that talks, for children aged 3 to 7. You’re trusting us near your child, so here is who we are.",
        },
        media: {
          kind: "art",
          stacked: true,
          art: {
            tone: "sun",
            label: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
            layers: [
              { image: { src: heartChilli, alt: "" }, left: 7, width: 30, top: 8 },
              { image: { src: kheeluSticker, alt: "" }, left: 24, width: 56, bottom: 4, rotate: -5 },
              { doodle: { name: "ink-spark-lines" }, left: 74, width: 16, top: 12, rotate: 12 },
            ],
          },
        },
      },
    },
    /* Fold 2: the answer-first block (50 words), which also describes the AboutPage node. */
    {
      kind: "answer-section",
      config: {
        variant: "team",
        id: "who-title",
        question: "Who makes Kheelu?",
        answer: `${seller.legalName}, a small company in Bengaluru, makes Kheelu. Its three co-founders are ${founderNames}. Kheelu is designed by parents in Bengaluru and made in India. You can reach the team on [WhatsApp](${support.whatsapp}) or by phone at {nowrap:[${support.phone}](${support.tel})}, or at [${support.email}](mailto:${support.email}).`,
      },
    },
    /* Fold 3: a face, a name and a job for each founder, in the order of the live llms.txt (facts.md). */
    {
      kind: "founders-section",
      config: {
        title: "The Kheelona {hand:founders.}",
        founders: [
          card(apoorva, { initials: "AS", firstName: "Apoorva", body: "Apoorva leads Kheelona and owns the promise we make to your family." }),
          card(aman, {
            initials: "AS",
            firstName: "Aman",
            body: "Aman builds the part your child talks to: how Kheelu listens and replies, and the safety layer every reply passes. He is also our grievance officer.",
          }),
          card(kashyap, {
            initials: "KC",
            firstName: "Kashyap",
            body: "Kashyap builds the toy itself: the hardware inside the plush, and how it is powered and charged.",
          }),
        ],
      },
    },
    /* Fold 4: the founders' reason in the product's own terms, beside Apoorva's published line (verbatim). */
    {
      kind: "feature-split",
      config: {
        variant: "quote",
        band: true,
        heading: { id: "why-title", title: "{mark:Why} we build Kheelu." },
        copy: [
          "We are parents who build. We watched our own children reach for screens.",
          "Most AI gives children answers. We built a toy that answers, then asks your child a question back, so they do the thinking.",
          "And you hold the keys. You can read every conversation in the parent app and delete any of them in one tap. You set your child’s age, and every reply passes a safety layer set to it.",
        ],
        subtitle: "No screen. No camera. It can’t browse the internet.",
        quote: {
          text: "The hard part of AI for children is not the model. It is the trust. So we build that first, and everything else second.",
          name: apoorva.name,
          role: apoorva.role,
          initials: "AS",
          tone: "sun",
        },
        link: { label: "See how we built safety in", href: "/safety", icon: "shield-check" },
      },
    },
    /* Fold 5: hidden until at least one proof is filed (D038). For Karnataka Elevate and Founders Inc the relationship
       is not known yet (B26), so their label may change before either goes live. */
    {
      kind: "recognition-strip",
      config: {
        title: "Recognised by.",
        items: [programme("NVIDIA Inception"), programme("Karnataka Elevate"), programme("nasscom startups"), programme("Founders Inc")],
      },
    },
    /* Fold 6: the one action, centred, with the price sentence, delivery and returns, and a person to ask. */
    {
      kind: "close-section",
      config: {
        variant: "center",
        heading: { title: "Bring Kheelu {hand:home.}" },
        cta: {
          cta: "finale",
          trust: TRUST_COMPACT.map((id) => trustItems[id]),
          helpLine: true,
          secondary: { label: "See how Kheelu works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" },
        },
      },
    },
  ],
  schema: [{ kind: "about-page", name: "The people who build Kheelona" }],
} as const satisfies PageContent;
