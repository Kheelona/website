/// <reference types="next/image-types/global" />
import floorTrain from "@ds/assets/Photo library/advik-04-floor-train-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * 3-year-old not talking in sentences? What to do: rewritten (task 5.18) from its copy page,
 * wiki/site/pages/story-talking-late-or-talking-little.md, word for word (CMO review
 * wiki/qa/cmo-review-articles-5.18-2026-10-14.md). No mockup: the article template renders it. Card words, related
 * list and dates as the stub held them (stories.md fold 3; the live journal's ring and dates). No pitch (B5): no
 * product link, no pre-order button (the keep-reading close), and Kheelu named only in D025's line under the answer.
 * Every statement about speech or language carries a source marker (D025, D026).
 */
export const article = {
  slug: "talking-late-or-talking-little",
  meta: {
    title: "3-year-old not talking in sentences? What to do · Kheelona",
    description: "3-year-old not talking in sentences? What varies between children, the signs worth a doctor’s look, and what helps at home.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Talking late, or talking little?",
    summary: "A calm guide for parents of quiet 3 and 4 year olds: what varies, what deserves a professional look, and what helps at home.",
  },
  related: ["how-to-get-your-child-talking", "how-children-collect-words", "a-toy-that-talks-vs-a-toy-that-listens"],
  published: "2026-07-28",
  updated: "2026-07-31",
  head: {
    title: "{nowrap:3-year-old} not talking in sentences? {hand:What to do}",
    lead: "A calm guide for parents of quiet 3 and 4 year olds: what varies, what deserves a professional look, and what helps at home.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: floorTrain,
      alt: "A boy in a green T-shirt lying on a red floor, smiling as he pushes a blue wooden train.",
    },
  },
  /* Fold 2: the answer first (58 words), then D025's line, verbatim, directly under it. */
  answer: {
    question: "Should you worry if your {nowrap:3-year-old} is not talking in sentences?",
    answer:
      "Use milestones as a reason to ask, not to worry. Most children put two or more words together, like “Doggie run”, before they turn 3.[^1][^2] By 3, most hold a short back-and-forth conversation and are understood by others most of the time.[^2][^3] If your child isn’t doing these yet, or has lost words, talk to your child’s doctor.[^3]",
    detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." }],
  },
  body: [
    /* Fold 3: the scene, an untitled part */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "At every birthday party there is one parent doing sums in their head. That child is narrating a whole film. Mine points and says “come”. Is this fine? Or is it something?",
        },
        { kind: "p", text: "Here is what varies between children, what deserves a professional look, and what helps at home either way." },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "What varies from child to child?",
      blocks: [
        {
          kind: "p",
          text: "The milestones from the US Centers for Disease Control and Prevention (CDC) sit at the age by which at least 3 in 4 children reach each one.[^2] So they describe most children, not every child.",
        },
        {
          kind: "p",
          text: "The American Speech-Language-Hearing Association (ASHA) says its own milestone chart “is not a screening or diagnostic tool”. It is meant to start a conversation with your child’s doctor.[^4]",
        },
        { kind: "p", text: "And watch your child at home, where they are most at ease, not only at a party." },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "Two languages at home? Count every word",
      blocks: [
        {
          kind: "p",
          text: "Asked whether using more than one language can cause a speech or language disorder, the American Academy of Pediatrics and ASHA answer no: “Speech or language problems are not caused by learning multiple languages.”[^5]",
        },
        {
          kind: "p",
          text: "A child learning two languages may split their words across them. Counted together, the total should be about the same as for a child of the same age learning one language.[^5] So count the words in every language your child uses, and keep them all going.",
        },
      ],
    },
    /* Fold 6 */
    {
      kind: "part",
      title: "When is it worth a professional look?",
      blocks: [
        { kind: "p", text: "Talk to your child’s doctor if:" },
        {
          kind: "list",
          items: [
            "at 3, your child doesn’t yet put two or more words together, with one action word, like “Doggie run”;[^1]",
            "at 3, your child doesn’t yet keep up a short conversation with you, of at least two back-and-forth exchanges;[^3]",
            "at 3, other people still can’t understand your child most of the time;[^3]",
            "by 4, people can’t yet understand most of what your child says;[^6]",
            "at any age, your child loses words or skills they used to have.[^3]",
          ],
        },
        { kind: "p", text: "These are US guides, and every child is different. Missing one is a reason to ask, not a diagnosis." },
        {
          kind: "p",
          text: "The CDC suggests you share your concerns with your child’s doctor and ask about developmental screening.[^3] ASHA suggests an assessment by an audiologist, who checks hearing, or a speech-language pathologist if a child misses many of the milestones for their age.[^6]",
        },
        { kind: "p", variant: "gut", text: "If your gut says ask, ask." },
      ],
    },
    /* Fold 7: tips framed as ways to keep the back-and-forth going, never as treatments (D025) */
    {
      kind: "part",
      title: "What helps at home, either way",
      blocks: [
        {
          kind: "p",
          text: "Whatever the milestones say, keep the back-and-forth going. Harvard’s Center on the Developing Child says back-and-forth exchanges between a young child and a caring adult support early language and social skills.[^7]",
        },
        {
          kind: "list",
          variant: "tips",
          items: [
            { icon: "chat-circle-dots", text: "Say what you’re doing while you do it, in short sentences: “Shoes on. This foot. Now that one.”" },
            { icon: "question", text: "Offer a choice instead of a yes-or-no question: “Idli or dosa?” A choice asks for a word." },
            { icon: "plus", text: "When your child says a word, say it back with one more: “Bus.” “Big bus.”" },
            { icon: "clock", text: "After you ask, wait. Count to five in your head before you help." },
            { icon: "book-open", text: "Read the same book again, and stop before a word your child knows." },
            { icon: "music-notes", text: "Sing rhymes and leave the last word for your child." },
            { icon: "eye-slash", text: "Turn off the TV in the background while you talk and play." },
          ],
        },
        { kind: "p", text: "None of this needs a purchase. Grandparents, cousins and older children can all take a turn." },
      ],
    },
  ],
  /* Fold 8 */
  sources: [
    {
      citation: "US Centers for Disease Control and Prevention, “Learn the Signs. Act Early.”: milestones by 30 months, 2026 (reviewed 16 May), Language/Communication.",
      href: "https://www.cdc.gov/act-early/milestones/30-months.html",
    },
    {
      citation: "Zubler, Wiggins, Macias and colleagues, “Evidence-Informed Milestones for Developmental Surveillance Tools”, Pediatrics, 2022, Table 1 and Table 4.",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9680195/",
    },
    {
      citation: "US Centers for Disease Control and Prevention, “Learn the Signs. Act Early.”: milestones by 3 years, 2026 (reviewed 16 May), Language/Communication and “act early”.",
      href: "https://www.cdc.gov/act-early/milestones/3-years.html",
    },
    {
      citation: "American Speech-Language-Hearing Association, “ASHA’s Developmental Milestones: Birth to 5 Years”, undated page.",
      href: "https://www.asha.org/public/speech/development/chart/",
    },
    {
      citation:
        "American Academy of Pediatrics and American Speech-Language-Hearing Association, “Young Children Learning Multiple Languages: Parent FAQs”, HealthyChildren.org, 2025 (updated 20 November).",
      href: "https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx",
    },
    {
      citation: "American Speech-Language-Hearing Association, “Communication Milestones: 3 to 4 Years” and “Communication Milestones: 2 to 3 Years”, undated pages.",
      href: "https://www.asha.org/public/developmental-milestones/communication-milestones-3-to-4-years/",
    },
    {
      citation: "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    },
  ],
  /* Fold 9: keep reading, no pre-order button (B5) */
  close: "keep",
} satisfies Article;
