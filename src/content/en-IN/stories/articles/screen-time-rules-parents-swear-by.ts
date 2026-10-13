/// <reference types="next/image-types/global" />
import floorTrain from "@ds/assets/Photo library/advik-04-floor-train-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * The 3-6-9-12 rule, and other screen rules parents swear by: rewritten (task 5.17; copy page
 * story-screen-time-rules-parents-swear-by.md, CMO review cmo-review-articles-5.17-2026-10-14.md; fixes of task 5.20a,
 * CMO M1 and M2, fix-pass review cmo-review-article-fixes-5.20a-2026-10-14.md). No mockup: it renders through the
 * article template, held to the approved articles' shared parts (a wide head photo, as the safe-AI-toy guide's). Card
 * words as the hub's (stories.md fold 2), related links and dates as the stub held them (the main session's note for
 * 5.17). No in-text product link: open question P25's working default names Tisseron's AI markers in full (fold 3) and
 * drops fold 7's product line, as on the talking guides; the close stays the journal's until the main session rules
 * (the copy page's question 4).
 */
export const article = {
  slug: "screen-time-rules-parents-swear-by",
  meta: {
    title: "The 3-6-9-12 rule and other screen-time rules · Kheelona",
    description:
      "The 3-6-9-12 rule says no screens before 3. Where it comes from, how it compares with WHO, IAP and AAP advice, and which screen rules to keep.",
    og: DEFAULT_OG,
  },
  card: {
    title: "The 3-6-9-12 rule, and other screen rules parents swear by",
    summary: "Where the 3-6-9-12 rule comes from, whether it holds up, and what the WHO, the IAP and the AAP say.",
  },
  related: ["busy-hands-no-screens", "what-to-look-for-in-a-safe-ai-toy", "ai-toys-and-indias-data-law"],
  published: "2026-07-30",
  updated: "2026-10-13",
  head: {
    title: "The {nowrap:3-6-9-12 rule,} and other screen rules {hand:parents swear by}",
    lead: "Where the 3-6-9-12 rule comes from, whether it holds up, and what the WHO, the IAP and the AAP say.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: { src: floorTrain, alt: "A boy in a green T-shirt lying on a red floor, smiling as he pushes a blue wooden train." },
  },
  /* Fold 2: the answer first (51 words), then one paragraph that frames the rest of the page. */
  answer: {
    question: "What is the {nowrap:3-6-9-12} rule?",
    answer:
      "It is a set of four age markers for screens, set out in 2008 by the psychiatrist Serge Tisseron: no screens before 3, no device or games console of their own before 6, the internet with an adult from 9, and alone from 12.[^1] It is a framework, not a study.",
    detail: [
      {
        kind: "p",
        text: "Below: where it comes from, how it compares with the WHO, the IAP and the AAP for children aged 3 to 7, and which other screen rules have a source behind them.",
      },
    ],
  },
  body: [
    /* Fold 3 */
    {
      kind: "part",
      title: "Where does the {nowrap:3-6-9-12} rule come from?",
      blocks: [
        {
          kind: "p",
          text: "Serge Tisseron set out the markers in 2008 to help parents know at what age, and how, to bring screens into their child’s life.[^1] The 3-6-9-12 association’s site explains them, in French.",
        },
        {
          kind: "p",
          text: "The marker at 6 is about owning a device, not using one. A child may use a family tablet or games console if you allow it, but should not have their own, because a device of their own becomes very hard to limit.[^1]",
        },
        /* Tisseron's AI markers, all four, never a selection (source verification 2026-10-14 §1a; P25's working default) */
        {
          kind: "p",
          text: "In 2020, he added a second set of markers, 3-6-13-18, for artificial intelligence.[^1] For young children, they say no digital tool before 3 and no connected toys before 6: AI listens, but it does not understand the child, and may impose ways of thinking and values that are not the parents’.[^2]",
        },
        {
          kind: "p",
          text: "The later markers are no internet or general-purpose chatbots before 12, except used with an adult, and no digital companion before 18.[^2]",
        },
        {
          kind: "p",
          text: "If you are weighing an AI toy, our guide to [what to look for in a safe AI toy](/stories/what-to-look-for-in-a-safe-ai-toy) sets out what to check first.",
        },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "Does the {nowrap:3-6-9-12} rule hold up?",
      blocks: [
        {
          kind: "p",
          text: "As a place to start, yes, with two differences worth knowing. Its first marker, no screens before 3, is stricter than the medical bodies. The World Health Organization, the Indian Academy of Pediatrics and the American Academy of Pediatrics each set a ceiling of one hour a day from age two until five.[^3][^4][^5]",
        },
        {
          kind: "p",
          text: "For ages three to six, Tisseron’s markers set a daily limit that rises from half an hour at 3 to an hour at most at 6, and treat screen time as time shared with a parent.[^1]",
        },
        { kind: "p", text: "Its later markers, at 6, 9 and 12, are about owning a device and going online.[^1]" },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "What do the WHO, the IAP and the AAP say?",
      blocks: [
        {
          kind: "p",
          text: "At 3 and 4, the WHO and the IAP both say no more than an hour of screen time a day, and less is better.[^3][^4] The AAP sets the same hour for children aged two to five, of high-quality programmes, watched together.[^5]",
        },
        {
          kind: "p",
          text: "From 5 to 10, the IAP says under two hours a day, homework on a screen included.[^4] For children aged 5 to 18, the AAP sets no fixed number of hours: it asks families to place consistent limits on time and on the kinds of media used.[^6]",
        },
        {
          kind: "p",
          text: "Our guide to [how much screen time is okay for a young child](/stories/how-much-screen-time-for-a-3-to-6-year-old) goes through it age by age.",
        },
      ],
    },
    /* Fold 6: only the rules a public body states, each with its source */
    {
      kind: "part",
      title: "Which screen time rules have a source behind them?",
      blocks: [
        { kind: "p", text: "Beyond the hour, the IAP and the AAP each add a few habits for children under five. Each rule below carries its source:" },
        {
          kind: "list",
          variant: "checks",
          items: [
            "No screens at meals.[^4][^5]",
            "No screens in the hour before sleep.[^4][^5]",
            "No screens in the bedroom.[^5]",
            "Watch together, and talk about what you see.[^4][^5]",
            "No more than 20 to 30 minutes at a time.[^4]",
            "No screens on car, bus or train journeys.[^4]",
            "Skip fast-paced programmes and apps full of distractions.[^5]",
          ],
        },
        { kind: "p", text: "When a new rule turns up in the family group chat, check it against this list." },
      ],
    },
    /* Fold 7: house lines only; no product line (P25's working default, task 5.20a) */
    {
      kind: "part",
      title: "So which rule should your family keep?",
      blocks: [
        { kind: "p", text: "The one you can hold. A loose rule kept for a year beats a strict one dropped by Thursday." },
        { kind: "p", text: "Start with the hour and one habit from the list. Add another when the first one sticks." },
      ],
    },
  ],
  /* Fold 8 */
  sources: [
    {
      citation:
        "Serge Tisseron, association 3-6-9-12, “Les balises 3-6-9-12+” (in French), undated page, opening paragraph and sections “Les repères 3-6-9-12 en 2008” and “De 3 à 6 ans”.",
      href: "https://www.3-6-9-12.org/les-balises-3-6-9-12/",
    },
    {
      citation: "Serge Tisseron, association 3-6-9-12, “Les balises 3-6-13-18 et l’IA” (in French), undated page, the four markers.",
      href: "https://www.3-6-9-12.org/les-balises-3-6-13-18/",
    },
    {
      citation:
        "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
      href: "https://iris.who.int/handle/10665/311664",
    },
    {
      citation: "Indian Academy of Pediatrics, “Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents”, Indian Pediatrics, 2022, p. 239.",
      href: "https://www.indianpediatrics.net/mar2022/235.pdf",
    },
    {
      citation: "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
      href: "https://doi.org/10.1542/peds.2016-2591",
    },
    {
      citation:
        "American Academy of Pediatrics, Council on Communications and Media, “Media Use in School-Aged Children and Adolescents”, Pediatrics, 2016, Recommendations: Families.",
      href: "https://doi.org/10.1542/peds.2016-2592",
    },
  ],
  close: "journal",
} satisfies Article;
