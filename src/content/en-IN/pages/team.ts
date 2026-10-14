/// <reference types="next/image-types/global" />
import kheeluSticker from "@ds/assets/Kheelu/kheelu-front-sticker.png";
import heartChilli from "@ds/assets/Shapes/heart-chilli.svg";
import type { ImageRef, SitePath } from "@/content/types";
import type { PageContent } from "@/layouts/PageTemplate/page-template.types";
import { DEFAULT_OG, organization } from "../organization";
import { seller } from "../seller";
import { TRUST_COMPACT, trustItems } from "../trust";

/**
 * The team page, `/team` (task 5.7): the approved mockup `mockup/pages/team.html` (D046), word for word, in its fold
 * order (structure §5); meta, alt texts and the full-mode price sentence as wiki/site/pages/team.md words them. The H1
 * is the copy page's recommended option A. What the plan changes on purpose:
 * - fold 1's lede is the CMO review's blocking fix M-T1 (wiki/qa/cmo-review-pages-help-2026-10-11.md), word for word:
 *   the first screen now says what Kheelu is, the age band and the page's search term ("Kheelona founders");
 * - the founder's answers of 2026-10-14 (D054 item 20, task 6.6; amends D038 for F11, G3, B24 and B25), word for word
 *   as the copy page's fold 3 and fold 5 (CMO review wiki/qa/cmo-review-team-6.6-2026-10-14.md): each founder's
 *   background line from the live bio, the live photos (public/team/*.jpg, the files at the tag
 *   archive/pre-reset-2026-10-10), and the "Recognised by." strip as live, three marks from public/recognition/ and
 *   Founders Inc as text, by name only (B26). Each is a placeholder in the mockup: resolved placeholders.
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

/** A live site file under public/ at its real size (assets.md: founder photos, recognition marks). */
const file = (src: SitePath, width: number, height: number, alt: string): ImageRef => ({ src, width, height, alt });

type Founder = (typeof organization.founders)[number];
/** A founder's card: the facts from organization.ts, the team page's words for the rest. The photo's alt is empty:
 *  the founder's name is printed beside it (DS Avatar README: alt="" next to a visible name, so the name is not read
 *  twice; team.md fold 3, main-session ruling at the 6.6 merge). */
const card = (founder: Founder, words: { initials: string; firstName: string; photo: SitePath; body: string; bio: string }) => ({
  name: founder.name,
  role: founder.role,
  anchor: founder.anchor,
  initials: words.initials,
  photo: file(words.photo, 480, 480, ""),
  body: words.body,
  bio: { text: words.bio },
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
    /* Fold 3: a face, a name, a job and a background for each founder, in the order of the live llms.txt (facts.md). */
    {
      kind: "founders-section",
      config: {
        title: "The Kheelona {hand:founders.}",
        founders: [
          card(apoorva, {
            initials: "AS",
            firstName: "Apoorva",
            photo: "/team/apoorva.jpg",
            body: "Apoorva leads Kheelona and owns the promise we make to your family.",
            bio: "He is a Chartered Accountant with 15 years in finance and company-building. He was the first student at his family’s pre-school, in 1994.",
          }),
          card(aman, {
            initials: "AS",
            firstName: "Aman",
            photo: "/team/aman.jpg",
            /* "The child-safety rules its AI is given": the live team's code-checked mechanism (D058 item 1; team.md fold 3). */
            body: "Aman builds the part your child talks to: how Kheelu listens and replies, and the child-safety rules its AI is given. He is also our grievance officer.",
            bio: "He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name.",
          }),
          card(kashyap, {
            initials: "KC",
            firstName: "Kashyap",
            photo: "/team/kashyap.jpg",
            body: "Kashyap builds the toy itself: the hardware inside the plush, and how it is powered and charged.",
            bio: "Over a decade in hardware, including years at Intel leading Thunderbolt 4 and 5 compliance, he took products from a blank page to certification.",
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
          /* No one-tap delete, no safety layer: the live team's code-checked words (D058 item 1; team.md fold 4). */
          "And you hold the keys. You can read every conversation in the parent app, and delete them all by deleting your account. You set your child’s age, and Kheelu’s AI is given child-safety rules and that age on every conversation.",
        ],
        subtitle: "No screen. No camera. It can’t browse the internet.",
        /* Apoorva's live photo in the quote's avatar (task 7.1a; CMO built-page review A, M10): the "AS" initials sat just
           under the founders' photo cards and read as a placeholder. The same file as his card's, alt empty beside his
           printed name (deviations.md V7). */
        quote: {
          text: "The hard part of AI for children is not the model. It is the trust. So we build that first, and everything else second.",
          name: apoorva.name,
          role: apoorva.role,
          photo: file("/team/apoorva.jpg", 480, 480, ""),
          tone: "sun",
        },
        link: { label: "See how we built safety in", href: "/safety", icon: "shield-check" },
      },
    },
    /* Fold 5: the live strip, in its order (team.md fold 5): the NVIDIA Inception and nasscom startups marks name their
       programmes (the words on each mark as its alt: "NVIDIA Inception Program" is the programme's own name, which the en-IN
       spelling guard lets through as that exact alt, team.md question 5); the Karnataka seal is decorative beside the
       words "Karnataka Elevate"; Founders Inc is text. Names only, no relationship (B26). */
    {
      kind: "recognition-strip",
      config: {
        title: "Recognised by.",
        items: [
          { name: "NVIDIA Inception Program", mark: file("/recognition/nvidia-inception.png", 575, 200, "NVIDIA Inception Program") },
          { name: "Karnataka Elevate", mark: file("/recognition/karnataka-seal.png", 240, 240, "") },
          { name: "nasscom startups", mark: file("/recognition/nasscom.png", 306, 126, "nasscom startups") },
          { name: "Founders Inc" },
        ],
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
