/// <reference types="next/image-types/global" />
import paperCrown from "@ds/assets/Photo library/ira-04-paper-crown-web.webp";
import type { Article } from "@/content/types";

/**
 * What actually builds a sharp brain in the early years: rewritten (task 5.19) from its approved copy page
 * (wiki/site/pages/story-what-actually-builds-a-sharp-brain.md; CMO review). No mockup: the article template renders
 * it, as the three approved articles. Head and lead are the hub card's words (stories.md fold 5); the related list and
 * first-published date are the stub's. "Brain development" is a searched topic, never what a toy does (D016): the four
 * things (talk, sleep, calm, play) each stand on their sources with something to do at home, and the one product line
 * sits in fold 7, which holds no brain line. The rewrite's title carries the brand (the stub's went without).
 * `updated` is the rewrite's date.
 */
export const article = {
  slug: "what-actually-builds-a-sharp-brain",
  meta: {
    title: "How to help your child’s brain develop · Kheelona",
    description:
      "How to help your child’s brain develop, past the flashcards: back-and-forth talk, enough sleep, calm and free play, and how to get more of each.",
    og: {
      image: "/og/ira-04-paper-crown.jpg",
      alt: "A laughing girl with a long braid holds a yellow paper crown on her head, beside a low table scattered with crayons and paper scraps.",
    },
  },
  card: {
    title: "What actually builds a sharp brain in the early years",
    summary: "Past the flashcards: the everyday things research points to, and how to get more of them at home.",
  },
  related: ["how-children-learn-by-talking", "learning-toys-for-a-three-year-old", "screen-free-does-not-mean-silent"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "What {hand:actually} builds a sharp brain in the early years",
    lead: "Past the flashcards: the everyday things research points to, and how to get more of them at home.",
    author: "Apoorva Sahu",
    readMinutes: 3,
    image: {
      src: paperCrown,
      alt: "A laughing girl with a long braid holds a yellow paper crown on her head, beside a low table scattered with crayons and paper scraps.",
    },
  },
  /* Fold 2: the answer first (58 words), then one paragraph that frames the four things. No product in the fold. */
  answer: {
    question: "How can you help your child’s brain develop?",
    answer:
      "Talk with your child, and let them answer. Harvard’s Center on the Developing Child says back-and-forth exchanges with a caring adult help build the connections in a young child’s brain.[^1] Add enough sleep, time to play with nothing planned, and a calm grown-up nearby on hard days. None of these is a flashcard, an app or a class.",
    detail: [
      {
        kind: "p",
        text: "This page skips the flashcards. What the sources below point to is older and plainer: talk, sleep, calm and play. Here is each one, and how to get more of it at home.",
      },
    ],
  },
  body: [
    /* Fold 3: conversation */
    {
      kind: "part",
      title: "Conversation: the back-and-forth kind",
      blocks: [
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child calls “serve and return”, the back and forth between young children and the significant adults in their lives, “one of the most essential experiences in shaping the architecture of the developing brain”.[^2] When your child reaches out with a sound, a look or a gesture and you respond, that is serve and return.[^2] By 3, that reaching out is often a question or a story.",
        },
        {
          kind: "p",
          text: "In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca’s area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. The study shows a link, not cause and effect.[^3]",
        },
        { kind: "p", text: "So aim for turns, not just words. A few ways to get more of them:" },
        {
          kind: "list",
          items: [
            "Answer a question, then ask one back: “What do you think?”",
            "Give your child time to answer before you fill the silence.",
            "Talk about what you’re doing while you cook, walk or fold the washing, and leave gaps for your child to add something.",
            "At bedtime, ask about the best and the hardest part of the day, and hear the whole answer.",
          ],
        },
      ],
    },
    /* Fold 4: sleep */
    {
      kind: "part",
      title: "Sleep: more of it than you might think",
      blocks: [
        {
          kind: "p",
          text: "Children aged 3 to 5 need 10 to 13 hours of sleep in every 24, naps included, and children aged 6 to 12 need 9 to 12 hours. Getting the recommended hours regularly goes with better attention, behaviour, learning and memory.[^4]",
        },
        {
          kind: "p",
          text: "In one small US study, preschoolers remembered more of a memory game they had learnt that morning after a nap than after staying awake.[^5]",
        },
        {
          kind: "p",
          text: "So protect bedtime. Keep it about the same most nights, keep the last hour before it screen-free, and end the day with a story or a chat.",
        },
      ],
    },
    /* Fold 5: calm (toxic stress in the source's own scope, then what a parent can do) */
    {
      kind: "part",
      title: "Calm: a grown-up who steadies the hard days",
      blocks: [
        {
          kind: "p",
          text: "Not all stress is bad. But serious, ongoing adversity, such as abuse, neglect, violence or the strain of family hardship, can disrupt how a young child’s brain develops when no caring adult is there to buffer it. Scientists call this toxic stress.[^6] Supportive relationships with caring adults help protect against it.[^6]",
        },
        {
          kind: "p",
          text: "So calm does not mean a silent house, or a child who never cries. It means a grown-up who notices, comforts and stays. On a hard day, that comes first.",
        },
      ],
    },
    /* Fold 6: play */
    {
      kind: "part",
      title: "Play: time with nothing planned",
      blocks: [
        { kind: "p", text: "India’s National Education Policy 2020 describes good early learning as “play-based, activity-based, and inquiry-based”.[^7]" },
        {
          kind: "p",
          text: "At home, that can be an afternoon with nothing on the calendar and a few open things within reach: blocks, a cardboard box, a dupatta that can be a cape or a river. Let your child decide what the game is, and join in when you’re invited.",
        },
      ],
    },
    /* Fold 7: the dinner-table test, with the page's one in-text product link (no brain line in the fold) */
    {
      kind: "part",
      title: "The dinner-table test",
      blocks: [
        {
          kind: "p",
          text: "A simple test for any toy, app or class: after ten minutes with it, does your child have something to tell you? Try it on what is already in your home: the blocks, the picture books, the cartoons.",
        },
        {
          kind: "p",
          text: "We make [Kheelu](/products/kheelu), a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back. Judge it by the same test.",
        },
        { kind: "p", text: "It is not a toy for children under 3, and if your child is 3, keep a grown-up nearby while they play." },
      ],
    },
  ],
  /* Fold 8 */
  sources: [
    {
      citation:
        "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    },
    {
      citation: "Center on the Developing Child at Harvard University, “Serve & Return Interaction Shapes Brain Circuitry”, 2011, page description.",
      href: "https://developingchild.harvard.edu/resources/videos/serve-return-interaction-shapes-brain-circuitry/",
    },
    {
      citation:
        "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract and Results.",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
    },
    {
      citation:
        "Paruthi and colleagues for the American Academy of Sleep Medicine, “Recommended Amount of Sleep for Pediatric Populations: A Consensus Statement of the American Academy of Sleep Medicine”, Journal of Clinical Sleep Medicine, 2016, Recommendations.",
      href: "https://doi.org/10.5664/jcsm.5866",
    },
    {
      citation: "Kurdziel, Duclos and Spencer, “Sleep spindles in midday naps enhance learning in preschool children”, PNAS, 2013, Abstract and Results.",
      href: "https://doi.org/10.1073/pnas.1306418110",
    },
    {
      citation: "Center on the Developing Child at Harvard University, “Toxic Stress” (Key Concepts), 2024, updated 2025, Key Takeaways and Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/toxic-stress/",
    },
    {
      citation: "Ministry of Human Resource Development (now Ministry of Education), Government of India, “National Education Policy 2020”, 2020, chapter 1, para 1.2, p. 7.",
      href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
    },
  ],
  close: "journal",
} satisfies Article;
