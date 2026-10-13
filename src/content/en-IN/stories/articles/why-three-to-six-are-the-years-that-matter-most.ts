/// <reference types="next/image-types/global" />
import readingNook from "@ds/assets/Photo library/tara-04-reading-nook-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG } from "../../organization";

/**
 * Why the early years matter most: rewritten (task 5.19) from its approved copy page
 * (wiki/site/pages/story-why-three-to-six-are-the-years-that-matter-most.md; CMO review round 2). No mockup: the
 * article template renders it, as the three approved articles. Head and lead are the hub card's words (stories.md
 * fold 5); the related list (with the stub's swap) and first-published date are the stub's; the slug stays (copy page,
 * question 3). Harvard's and the NCF's lines describe busy years, never a deadline; NEP's 85% line is left out
 * (question 2). The one product line sits in fold 7, three folds below the last brain line (D016). `updated` is the
 * rewrite's date.
 */
export const article = {
  slug: "why-three-to-six-are-the-years-that-matter-most",
  meta: {
    title: "Why the early years matter most for your child · Kheelona",
    description:
      "Why the early years matter most: what Harvard’s Center on the Developing Child says about the young brain, and why talk, play and sleep fill them well.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Why the early years matter most",
    summary: "What the early years are for, and the ordinary things that fill them well: talk, play and sleep.",
  },
  related: ["screen-free-does-not-mean-silent", "how-children-learn-by-talking", "what-actually-builds-a-sharp-brain"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "Why the early years {hand:matter most}",
    lead: "What the early years are for, and the ordinary things that fill them well: talk, play and sleep.",
    author: "Apoorva Sahu",
    readMinutes: 3,
    image: {
      src: readingNook,
      alt: "A girl with curly hair, in a coral kurta, sits cross-legged on a window seat and reads a picture book aloud, one finger on the page.",
    },
  },
  /* Fold 2: the answer first (56 words), then one paragraph that frames the page. No product in the fold. */
  answer: {
    question: "Why do the early years matter so much?",
    answer:
      "Because so much is built in them. Harvard’s Center on the Developing Child calls the early years the most active period for building connections in the brain,[^1] and says back-and-forth exchanges with a caring adult help build them.[^2] What fills these years well is ordinary: talk, play and sleep, with the people who love your child.",
    detail: [
      { kind: "p", text: "None of it needs a class or a kit. Here is what is being built, and the three ordinary things that fill these years well." },
    ],
  },
  body: [
    /* Fold 3: what is being built (busy years, not a deadline) */
    {
      kind: "part",
      title: "What happens in a young child’s brain?",
      blocks: [
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child estimates that more than a million new connections form in the brain every second in the first few years of life.[^1] The early years are the most active period for building those connections, but new connections can form throughout life.[^1]",
        },
        {
          kind: "p",
          text: "India’s National Curriculum Framework for the Foundational Stage says brain development is most rapid in the first eight years of a child’s life.[^3] So if your child is between 3 and 7, they are still inside those years.",
        },
        { kind: "p", text: "Both describe how busy these years are. Neither is a deadline." },
      ],
    },
    /* Fold 4: talk, with the link to the how-to guide */
    {
      kind: "part",
      title: "Talk: answer, then ask one back",
      blocks: [
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^2]",
        },
        {
          kind: "p",
          text: "Between 3 and 7, a serve is often a question, a story or a complaint about a sibling. Your return is your attention and a reply. Try ending it with a question back, then wait.",
        },
        {
          kind: "p",
          text: "For more ways to do this every day, read our guide to [what actually builds a sharp brain](/stories/what-actually-builds-a-sharp-brain).",
        },
      ],
    },
    /* Fold 5: play */
    {
      kind: "part",
      title: "Play, and plenty of it",
      blocks: [
        {
          kind: "p",
          text: "India’s National Education Policy 2020 treats ages 3 to 8 as the Foundational Stage of school education: three years of Anganwadi or pre-school, then Grades 1 and 2.[^4] It describes those five years as “flexible, multilevel, play/activity-based learning”.[^4]",
        },
        {
          kind: "p",
          text: "At home, play needs very little: a pretend shop, a cardboard box that becomes a bus, a tower built only to be knocked down. Let your child lead, and join in when you’re asked.",
        },
      ],
    },
    /* Fold 6: sleep */
    {
      kind: "part",
      title: "Sleep, the part that’s easiest to cut",
      blocks: [
        {
          kind: "p",
          text: "Children aged 3 to 5 need 10 to 13 hours of sleep in every 24, naps included, and children aged 6 to 12 need 9 to 12 hours.[^5]",
        },
        { kind: "p", text: "Late dinners, family functions and screens all eat into it. So keep bedtime steady, most nights." },
      ],
    },
    /* Fold 7: what these years don't need, with the page's one in-text product link (no brain line in the fold) */
    {
      kind: "part",
      title: "What these years don’t need",
      blocks: [
        { kind: "p", text: "A packed timetable. Flashcards before breakfast. The worry that you have already missed something." },
        { kind: "p", text: "What fills these years well is ordinary: talk, play and sleep, most days, with the people who love your child." },
        {
          kind: "p",
          text: "[Kheelu](/products/kheelu) is built around the first of those: a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back. No toy replaces the people who talk with your child every day, ours included.",
        },
        { kind: "p", text: "It is not a toy for children under 3, and if your child is 3, keep a grown-up nearby while they play." },
      ],
    },
  ],
  /* Fold 8 */
  sources: [
    {
      citation: "Center on the Developing Child at Harvard University, “Brain Architecture” (Key Concepts), 2024, updated 2026, Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/brain-architecture/",
    },
    {
      citation:
        "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    },
    {
      citation:
        "National Steering Committee for National Curriculum Frameworks, “National Curriculum Framework for Foundational Stage 2022”, 2022, section 1.1.3, p. 17.",
      href: "https://ncert.nic.in/pdf/NCF_for_Foundational_Stage_20_October_2022.pdf",
    },
    {
      citation: "Ministry of Human Resource Development (now Ministry of Education), Government of India, “National Education Policy 2020”, 2020, chapter 4, paras 4.1 and 4.2, p. 11.",
      href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
    },
    {
      citation:
        "Paruthi and colleagues for the American Academy of Sleep Medicine, “Recommended Amount of Sleep for Pediatric Populations: A Consensus Statement of the American Academy of Sleep Medicine”, Journal of Clinical Sleep Medicine, 2016, Recommendations.",
      href: "https://doi.org/10.5664/jcsm.5866",
    },
  ],
  close: "journal",
} satisfies Article;
