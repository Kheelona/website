/// <reference types="next/image-types/global" />
import paperCrown from "@ds/assets/Photo library/ira-04-paper-crown-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * How to get your child to talk more: rewritten (task 5.18) from its copy page,
 * wiki/site/pages/story-how-to-get-your-child-talking.md, word for word (CMO review
 * wiki/qa/cmo-review-articles-5.18-2026-10-14.md). No mockup: the article template renders it. Card words, related
 * list and dates as the stub held them (stories.md fold 3; the live journal's ring and dates). No pitch on the
 * talking-and-language guides: no product link, no pre-order button (the keep-reading close), and Kheelu named only
 * in D025's line under the answer; the one in-text link goes to another guide. Every statement about language
 * carries a source marker (D025, D026).
 */
export const article = {
  slug: "how-to-get-your-child-talking",
  meta: {
    title: "How to get your child to talk more · Kheelona",
    description:
      "How to get your child to talk more: better questions than “How was school?”, the follow-up that keeps it going, and games that get a child talking.",
    og: DEFAULT_OG,
  },
  card: {
    title: "How to get your child talking",
    summary: "Better questions than “How was school?”, and the small habits that turn one-word answers into conversations.",
  },
  related: ["ai-toys-and-indias-data-law", "talking-late-or-talking-little", "how-children-collect-words"],
  published: "2026-07-28",
  updated: "2026-09-05",
  head: {
    title: "How to get your child to {hand:talk more}",
    lead: "Better questions than “How was school?”, and the small habits that turn one-word answers into conversations.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: paperCrown,
      alt: "A laughing girl with a long braid holds a yellow paper crown on her head, beside a low table scattered with crayons and paper scraps.",
    },
  },
  /* Fold 2: the answer first (49 words), then D025's line, verbatim, directly under it. */
  answer: {
    question: "How can you get your child to talk more?",
    answer:
      "Ask small, specific questions, wait for the answer, and follow up on whatever comes back. Instead of “How was school?”, try “Who made you laugh today?” Harvard’s Center on the Developing Child says back-and-forth exchanges between a young child and a caring adult support early language and social skills.[^1]",
    detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." }],
  },
  body: [
    /* Fold 3: the scene, an untitled part */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "How was school? “Fine.” What did you do? “Nothing.” Two questions in, the conversation is over, and the child who once told you about every ant on the footpath now answers in one word.",
        },
        { kind: "p", text: "A whole day is a lot to sum up, and “fine” does the job. So ask about a smaller piece of it." },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "Conversation starters for after school",
      blocks: [
        { kind: "p", text: "Ask about one small, real moment instead of the whole day:" },
        {
          kind: "list",
          items: [
            "Who made you laugh today?",
            "What was the best thing in your tiffin? And the worst?",
            "Who did you sit next to? What did you talk about?",
            "What was the hardest thing you did today?",
            "What did you play outside? Who won?",
            "On a day at home: “What did you and Nani see at the market?”",
          ],
        },
        { kind: "p", text: "One question a day is plenty. Keep the rest for tomorrow." },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "Go first, then wait",
      blocks: [
        {
          kind: "p",
          text: "Start with your own answer: “The worst thing in my lunch today was cold upma. What was yours?” Now your child knows the kind of answer you mean.",
        },
        { kind: "p", text: "Then wait. Count to five in your head before you ask again or answer for them. It will feel long. Wait anyway." },
      ],
    },
    /* Fold 6: the follow-up, and the study behind turns with its real ages and limits */
    {
      kind: "part",
      title: "Follow up on whatever comes back",
      blocks: [
        {
          kind: "p",
          text: "Whatever your child says, take it one step further, out of curiosity, not as a quiz: “He fell off the bench? What did your teacher do? And then?”",
        },
        {
          kind: "p",
          text: "In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca’s area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. The study shows a link, not cause and effect.[^2]",
        },
        {
          kind: "p",
          text: "In the study, a turn was an adult speaking and the child replying, or the other way round.[^2] Its authors suggest encouraging parents to talk with their children in “more interactive, back-and-forth conversation”.[^2] Every follow-up is one more turn.",
        },
      ],
    },
    /* Fold 7 */
    {
      kind: "part",
      title: "Games that get a child talking",
      blocks: [
        { kind: "p", text: "In each of these, your child has to talk to take their turn." },
        {
          kind: "list",
          variant: "tips",
          items: [
            { icon: "eye", text: "Describe it, don’t point: “I spy something yellow that you peel before you eat it.” Then swap." },
            { icon: "currency-inr", text: "Play shop. Your child runs it, and you keep asking: “Do you have a smaller one? How much is it?”" },
            { icon: "book-open", text: "Read a picture book together, and pause once or twice to ask what your child thinks will happen next." },
            { icon: "chat-circle-dots", text: "Make up a story in turns: you say one line, your child says the next." },
            { icon: "music-notes", text: "Sing a rhyme and stop before the last word, so your child can fill it in." },
            { icon: "users-three", text: "On a call with a grandparent, let your child tell one thing from their day." },
          ],
        },
      ],
    },
    /* Fold 8: routes a worried parent to the guide that owns "when to ask" (an article, not a product link) */
    {
      kind: "part",
      title: "What if your child talks very little?",
      blocks: [
        {
          kind: "p",
          text: "If it’s everywhere, not only after school, read our guide on [what varies between children, and when to ask a professional](/stories/talking-late-or-talking-little).",
        },
      ],
    },
  ],
  /* Fold 9 */
  sources: [
    {
      citation: "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    },
    {
      citation:
        "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract, Method and Discussion.",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
    },
  ],
  /* Fold 10: keep reading, no pre-order button */
  close: "keep",
} satisfies Article;
