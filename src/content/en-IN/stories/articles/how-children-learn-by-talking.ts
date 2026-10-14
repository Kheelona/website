/// <reference types="next/image-types/global" />
import planetBook from "@ds/assets/Photo library/kabir-04-planet-book-web.webp";
import type { Article } from "@/content/types";
import { TEAM_BYLINE } from "../../organization";

/**
 * Serve and return: how children learn by talking: rewritten (task 5.18) from its copy page,
 * wiki/site/pages/story-how-children-learn-by-talking.md, word for word (CMO review
 * wiki/qa/cmo-review-articles-5.18-2026-10-14.md; copy fixes M7 and M13 in task 5.20b, CMO review
 * wiki/qa/cmo-review-article-fixes-5.20b-2026-10-14.md). No mockup: the article template renders it. Card words, related
 * list and dates as the stub held them (stories.md fold 3; the live journal's ring and dates). No pitch: the subject
 * is the caring adult, Kheelu's loop is never called serve and return (C07), and Kheelu is named only in D025's line
 * under the answer; no product link, no pre-order button (the keep-reading close). Every statement about language or
 * the brain carries a source marker and credits the exchange with a caring adult, never a toy (D016, D025, D026).
 */
export const article = {
  slug: "how-children-learn-by-talking",
  meta: {
    title: "Serve and return: how children learn by talking · Kheelona",
    description: "Serve and return is the back-and-forth between a young child and a caring adult. What the research says, and how it looks at home.",
    og: {
      image: "/og/kabir-04-planet-book.jpg",
      alt: "A boy in round glasses and a mustard T-shirt lies on a striped rug, chin in his hands, wide-eyed over a picture book about planets.",
    },
  },
  card: {
    title: "How children learn by talking",
    summary: "Serve and return, the back-and-forth between a young child and a caring adult, and how it looks at home.",
  },
  related: ["why-three-to-six-are-the-years-that-matter-most", "what-actually-builds-a-sharp-brain", "learning-toys-for-a-three-year-old"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "Serve and return: how children {hand:learn by talking}",
    lead: "What happens when your child asks and you answer, what the research says about it, and how it looks at home.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: planetBook,
      alt: "A boy in round glasses and a mustard T-shirt lies on a striped rug, chin in his hands, wide-eyed over a picture book about planets.",
    },
  },
  /* Fold 2: the answer first (57 words), then D025's line, verbatim, as its own block directly under it. */
  answer: {
    question: "What is serve and return?",
    answer:
      "Serve and return is the back-and-forth between a young child and a caring adult.[^1] Your child serves with a look, a word or a question. You return it with attention and a reply. Harvard’s Center on the Developing Child says these exchanges help build neural connections in the child’s brain and support early language and social skills.[^1]",
    detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." }],
  },
  body: [
    /* Fold 3: the scene, an untitled part */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "Your child asks why the moon follows the car. You answer, and before you’ve finished, the next question is on its way: “Then why doesn’t it follow the bus?”",
        },
        { kind: "p", text: "Your child served. You returned. They served again. It happens all day: at breakfast, in the auto, at bath time." },
      ],
    },
    /* Fold 4: Harvard's words, then one study about turns with its ages and limits */
    {
      kind: "part",
      title: "What does the research say?",
      blocks: [
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child also calls serve and return, the back-and-forth between young children and the significant adults in their lives, “one of the most essential experiences in shaping the architecture of the developing brain”.[^2]",
        },
        {
          kind: "p",
          text: "In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca’s area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link. Turns also predicted the children’s language scores once family income and parents’ education were taken into account.[^3]",
        },
        { kind: "p", text: "The study shows a link, not cause and effect.[^3] In the study, a turn was an adult speaking and the child replying, or the other way round.[^3] A turn needs both of you." },
      ],
    },
    /* Fold 5: four everyday moments, examples not norms */
    {
      kind: "part",
      title: "What does it look like at home?",
      blocks: [
        {
          kind: "list",
          items: [
            { lead: "At breakfast.", text: "Your child holds up a half-eaten dosa: “It’s a moon!” You: “A half moon. What else on your plate is round?”" },
            { lead: "In the auto.", text: "“Why is he honking?” You: “What do you think?” Wait for the answer, then add one thing you know." },
            { lead: "At bath time.", text: "Your child pours water from cup to cup. You: “Full. Now empty.” They say it back, and you wait for what comes next." },
            { lead: "At bedtime.", text: "Before you turn the page: “What do you think she’ll do?”" },
          ],
        },
        { kind: "p", text: "You can do it anywhere: answer your child, then ask one back." },
      ],
    },
    /* Fold 6 */
    {
      kind: "part",
      title: "Three habits that keep it going",
      blocks: [
        {
          kind: "list",
          variant: "tips",
          items: [
            { icon: "eye", text: "Notice the serve. It can be a point, a question or a tug at your sleeve. Turn towards it when you can." },
            { icon: "clock", text: "Wait. Give your child time to take their turn before you take yours." },
            { icon: "eye-slash", text: "Put your phone face down while you talk." },
          ],
        },
      ],
    },
    /* Fold 7: the caring adult widened to the whole family, in any language */
    {
      kind: "part",
      title: "Who can return a serve?",
      blocks: [
        {
          kind: "p",
          text: "Anyone who cares for your child. Harvard’s Center describes this back-and-forth as a relationship “between children and their parents and other caregivers in the family or community”.[^4] In your home, that might be a long list: Nani, Dada, an older cousin, the auntie next door.",
        },
        {
          kind: "p",
          text: "Each of them can talk in the language they know best. ASHA, the US association of speech and hearing professionals, says a strong model in any language helps build a foundation for learning others.[^5]",
        },
        { kind: "p", text: "No toy or screen replaces the people who talk with your child every day." },
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
        "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract, Method and Results.",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
    },
    {
      citation: "Center on the Developing Child at Harvard University, “InBrief: The Science of Early Childhood Development”, 2007, p. 1, point 2.",
      href: "https://developingchild.harvard.edu/resources/inbriefs/inbrief-science-of-ecd/",
    },
    {
      citation: "American Speech-Language-Hearing Association, “Late Language Emergence” (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations.",
      href: "https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/",
    },
  ],
  /* Fold 9: keep reading, no pre-order button */
  close: "keep",
} satisfies Article;
