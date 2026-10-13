/// <reference types="next/image-types/global" />
import paperCrown from "@ds/assets/Photo library/ira-04-paper-crown-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * How to build a 3-year-old's vocabulary: rewritten (task 5.18) from its copy page,
 * wiki/site/pages/story-how-children-collect-words.md, word for word (CMO review
 * wiki/qa/cmo-review-articles-5.18-2026-10-14.md). No mockup: the article template renders it. Card words, related
 * list and dates as the stub held them (stories.md fold 3; the live journal's ring and dates). No pitch: no product
 * link, no pre-order button (the keep-reading close), and Kheelu named only in D025's line under the answer; the two
 * in-text links go to other guides. Every statement about language carries a source marker (D025, D026). The copy page
 * leaves the tips' and the callout's icons to the builder: they are the CMO review's picks (M14).
 */
export const article = {
  slug: "how-children-collect-words",
  meta: {
    title: "How to build a 3-year-old’s vocabulary · Kheelona",
    description:
      "How to build a 3-year-old’s vocabulary at home: everyday habits, what research says about talking together, and why every language you speak counts.",
    og: DEFAULT_OG,
  },
  card: {
    title: "How children collect words",
    summary: "How children pick up words at home, in every language you speak, without a single worksheet.",
  },
  related: ["talking-late-or-talking-little", "a-toy-that-talks-vs-a-toy-that-listens", "talking-toys-and-late-talkers"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "How to build a {nowrap:3-year-old’s} {hand:vocabulary}",
    lead: "How children pick up words at home, in every language you speak, without a single worksheet.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: paperCrown,
      alt: "A laughing girl with a long braid holds a yellow paper crown on her head, beside a low table scattered with paper scraps and crayons.",
    },
  },
  /* Fold 2: the answer first (56 words), then D025's line, verbatim, directly under it. */
  answer: {
    question: "How can you build a {nowrap:3-year-old’s} vocabulary?",
    answer:
      "Talk with your child all through the day, and use real words, not only simple ones. Name what they point at, explain a new word as you use it (“this mango is ripe, so it’s soft”), read together, and wait for their answer. And count the words they know in every language you speak at home.[^1]",
    detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." }],
  },
  body: [
    /* Fold 3: the scene, an untitled part */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "Chances are nobody sat your child down to teach them “auto”, “gravy” or “cousin”. The words arrived anyway: from the kitchen, the market, the back seat and the family video call.",
        },
        { kind: "p", text: "Here is what the research says about talk and words, and what you can do at home today." },
      ],
    },
    /* Fold 4: the evidence behind "talk with your child", with its real ages and limits */
    {
      kind: "part",
      title: "What does the research say about talk and words?",
      blocks: [
        {
          kind: "p",
          text: "In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca’s area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. Turns also predicted the children’s language scores once family income and parents’ education were taken into account.[^2]",
        },
        {
          kind: "p",
          text: "In the study, a turn was an adult speaking and the child replying, or the other way round. The children were native English speakers, and the study shows a link, not cause and effect.[^2]",
        },
        {
          kind: "p",
          text: "Its authors suggest encouraging parents to talk with their children in “more interactive, back-and-forth conversation”.[^2] For words, that means saying the new word, then giving your child a reason to use it.",
        },
      ],
    },
    /* Fold 5: habits, advice only, no outcome promised */
    {
      kind: "part",
      title: "Everyday ways to build your child’s vocabulary",
      blocks: [
        {
          kind: "list",
          variant: "tips",
          items: [
            { icon: "chat-circle-dots", text: "Use your real words: “enormous” and “delicious”, not only “big” and “nice”." },
            { icon: "info", text: "Explain a new word in the same breath: “The dal is boiling. See the bubbles?”" },
            { icon: "eye", text: "Name what your child points at, then wait for them to try the word." },
            { icon: "question", text: "Hand a new word back as a question: “It was enormous? How enormous?”" },
            { icon: "book-open", text: "Read together, and talk about the pictures as well as the words." },
            { icon: "arrow-counter-clockwise", text: "Use a new word again over the next few days, somewhere new." },
            { icon: "users-three", text: "At meals, ask your child what they think, and let them finish." },
          ],
        },
        { kind: "p", text: "None of this needs flashcards or a worksheet. It needs talk, a pause, and someone who listens to the answer." },
        {
          kind: "callout",
          icon: "star",
          lead: "Try this:",
          text: "pick one new word from your day, like “drizzle” or “crowded”, and use it at dinner, at bath time and at bedtime.",
        },
      ],
    },
    /* Fold 6 */
    {
      kind: "part",
      title: "Any language counts",
      blocks: [
        {
          kind: "p",
          text: "Counting your child’s vocabulary? Count every language. A bilingual child may split their words across two languages. Counted together, the total should be about the same as for a child of the same age learning one language.[^1] Words collected in Telugu or Bangla count towards that total.[^1]",
        },
        {
          kind: "p",
          text: "A strong model in any language also helps build a foundation for learning others.[^3] So keep talking in the languages you know best, every day.",
        },
        { kind: "p", text: "For more on two languages at home, read [Raising a bilingual child in India](/stories/raising-a-bilingual-child-in-india)." },
      ],
    },
    /* Fold 7: a speech answer, on a page that carries D025's line (fold 2) */
    {
      kind: "part",
      title: "What if your child seems to have few words?",
      blocks: [
        {
          kind: "p",
          text: "Every child is different. As a general guide, if your child is 3 or older and other people still can’t understand them most of the time, or they lose words they used to have, talk to your paediatrician.[^4]",
        },
        {
          kind: "p",
          text: "Our guide [Late talker? What helps a child find their words](/stories/talking-toys-and-late-talkers) has the signs to look for, and what helps at home.",
        },
      ],
    },
  ],
  /* Fold 8 */
  sources: [
    {
      citation:
        "American Academy of Pediatrics and American Speech-Language-Hearing Association, “Young Children Learning Multiple Languages: Parent FAQs”, HealthyChildren.org, 2025 (updated 20 November).",
      href: "https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx",
    },
    {
      citation:
        "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract, Method, Results and Discussion.",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
    },
    {
      citation: "American Speech-Language-Hearing Association, “Late Language Emergence” (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations.",
      href: "https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/",
    },
    {
      citation: "US Centers for Disease Control and Prevention, “Learn the Signs. Act Early.”: milestones by 3 years, 2026 (reviewed 16 May), Language/Communication and “act early”.",
      href: "https://www.cdc.gov/act-early/milestones/3-years.html",
    },
  ],
  /* Fold 9: keep reading, no pre-order button */
  close: "keep",
} satisfies Article;
