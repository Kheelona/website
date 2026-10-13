/// <reference types="next/image-types/global" />
import paperCrown from "@ds/assets/Photo library/ira-04-paper-crown-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * Toys for language development: talk or listen?: rewritten (task 5.18) from its copy page,
 * wiki/site/pages/story-a-toy-that-talks-vs-a-toy-that-listens.md, word for word (CMO review
 * wiki/qa/cmo-review-articles-5.18-2026-10-14.md; copy fixes M12 and M13 in task 5.20b, CMO review
 * wiki/qa/cmo-review-article-fixes-5.20b-2026-10-14.md). No mockup: the article template renders it. Card words, related
 * list and dates as the stub held them (stories.md fold 3; the live journal's ring and dates); the card's title is the
 * fold 4 heading. No pitch: no product link, no pre-order button (the keep-reading close), and Kheelu named only in
 * D025's line under the answer; AI toys are routed to the safe-AI-toy guide, which quotes Common Sense Media in full
 * with the signed answer (B3). Every statement about language carries a source marker (D016, D025, D026). The copy page
 * leaves the callout's icon to the builder: it is the CMO review's pick (M14).
 */
export const article = {
  slug: "a-toy-that-talks-vs-a-toy-that-listens",
  meta: {
    title: "Toys for language development: talk or listen? · Kheelona",
    description:
      "Toys for language development: why a toy that repeats is a mirror, what research says about back-and-forth talk, and how screens and speakers compare.",
    og: DEFAULT_OG,
  },
  card: {
    title: "A toy that talks is not a toy that listens",
    summary: "Why a toy that repeats your child is a mirror, and how screens, speakers and talking toys compare.",
  },
  related: ["how-children-collect-words", "talking-toys-and-late-talkers", "raising-a-bilingual-child-in-india"],
  published: "2026-07-30",
  updated: "2026-10-13",
  head: {
    title: "Toys for language development: {hand:talk or listen?}",
    lead: "Why a toy that repeats your child is a mirror, and how screens, speakers and talking toys compare.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: paperCrown,
      alt: "A laughing girl with a long braid holds a yellow paper crown on her head, beside a low table scattered with crayons and paper scraps.",
    },
  },
  /* Fold 2: the answer first (58 words; CMO review M12 opens it with a direct answer), then D025's line, verbatim, directly under it. */
  answer: {
    question: "Are talking toys good for a young child’s language?",
    answer:
      "Not on their own: a toy can’t do the talking for you. Harvard’s Center on the Developing Child says back-and-forth exchanges between a young child and a caring adult support early language skills.[^1] A toy that plays recordings or repeats your child’s words can’t take a real turn. Choose toys that give you both something to talk about.",
    detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." }],
  },
  body: [
    /* Fold 3: the scene, an untitled part */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "Walk down a toy aisle and the talking toys line up: phones with phrase buttons, dolls with a handful of sentences, plush toys that sing when squeezed, a cactus that repeats whatever your child says.",
        },
        { kind: "p", text: "They all talk. Listening is a different thing." },
      ],
    },
    /* Fold 4: the hub card's title as the heading */
    {
      kind: "part",
      title: "A toy that talks is not a toy that listens",
      blocks: [
        {
          kind: "p",
          text: "A toy that talks plays sounds at your child: a recorded phrase, a song, or your child’s own words played back. A toy that listens has to understand what your child said, and answer it.",
        },
        {
          kind: "p",
          text: "A toy that repeats is a mirror. It can be funny, but it can’t answer a question, and it never asks one of its own. A toy with a handful of sentences has nothing new to say once your child has heard them all.",
        },
      ],
    },
    /* Fold 5: what the research credits, and its limit: it is about people */
    {
      kind: "part",
      title: "What helps language development?",
      blocks: [
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^1]",
        },
        {
          kind: "p",
          text: "In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca’s area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. The study shows a link, not cause and effect.[^2]",
        },
        {
          kind: "p",
          text: "Both are about adults talking with children; neither tested a toy.[^1][^2] So ask one thing of any toy: will it get your child talking, and give the two of you more to talk about?",
        },
      ],
    },
    /* Fold 6: the kinds compared, checks instead of claims */
    {
      kind: "part",
      title: "Screens, speakers and talking toys: how do they compare?",
      blocks: [
        { kind: "h3", text: "Videos and cartoons" },
        {
          kind: "p",
          text: "A video plays on whether your child answers or not. The American Academy of Pediatrics asks parents to watch with their children and help them understand what they are seeing.[^3] The talking about it is the part that’s yours.",
        },
        { kind: "h3", text: "Smart speakers" },
        {
          kind: "p",
          text: "A smart speaker answers questions, which a button toy can’t. Before your child talks to one alone, check its settings: what it can search, what it can play, and what it keeps of your child’s voice.",
        },
        { kind: "h3", text: "Talking toys that repeat or play phrases" },
        {
          kind: "p",
          text: "They can’t answer a question they’ve never heard, so a conversation stops after one line. Keep them for the giggle, and do the talking yourself.",
        },
        { kind: "h3", text: "Toys that use AI to answer" },
        {
          kind: "p",
          text: "Some newer toys use AI to understand your child and reply. They raise questions a button toy never did: when the microphone is on, where your child’s voice goes, and whether you can read every conversation. Before one comes home, read [What to look for in a safe AI toy](/stories/what-to-look-for-in-a-safe-ai-toy).",
        },
      ],
    },
    /* Fold 7: checks only, no claims */
    {
      kind: "part",
      title: "A short checklist for any talking toy",
      blocks: [
        {
          kind: "list",
          variant: "checks",
          items: [
            "Does it reply, or only repeat?",
            "Does it ask your child something back, and wait for the answer?",
            "Does it speak the language you speak at home?",
            "Can you see afterwards what it said?",
            "Does it work without a screen?",
            "Does it leave room for you to join in?",
          ],
        },
        { kind: "p", text: "Whatever you choose, no toy replaces the people who talk with your child every day." },
        { kind: "callout", icon: "question", lead: "Try this:", text: "when a toy talks, pause it and ask your child what it should say next." },
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
      citation:
        "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract, Results and Discussion.",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
    },
    {
      citation: "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
      href: "https://doi.org/10.1542/peds.2016-2591",
    },
  ],
  /* Fold 9: keep reading, no pre-order button */
  close: "keep",
} satisfies Article;
