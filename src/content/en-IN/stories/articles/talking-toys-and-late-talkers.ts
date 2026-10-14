/// <reference types="next/image-types/global" />
import planetBook from "@ds/assets/Photo library/kabir-04-planet-book-web.webp";
import type { Article } from "@/content/types";
import { TEAM_BYLINE } from "../../organization";

/**
 * Late talker? What helps a child find their words: rewritten and approved (mockup
 * story-talking-toys-and-late-talkers.html; copy page of the same name). Head, byline, photo, answer
 * with the D025 line under it, body, sources, related guides and the keep-reading close as the mockup
 * shows them; card words as the hub's (stories.md fold 3). No pitch (B5): no product link, no
 * pre-order button, and Kheelu named only in the D025 line. Every statement about speech or
 * language carries a source marker (D025, D026). `updated` is the rewrite's date (task 5.6).
 */
export const article = {
  slug: "talking-toys-and-late-talkers",
  meta: {
    title: "Late talker? What helps a child find their words · Kheelona",
    description:
      "Late talker at 3 or older? What helps at home, what the research says about back-and-forth talk, and when to ask your child's doctor.",
    og: {
      image: "/og/kabir-04-planet-book.jpg",
      alt: "A boy in round glasses and a mustard T-shirt lies on a striped rug, chin in his hands, wide-eyed over a picture book about planets.",
    },
  },
  card: {
    title: "Late talker? What helps a child find their words",
    summary: "What helps a 3 to 7 year old who talks later or less than others, and when to ask your child’s doctor.",
  },
  related: ["talking-late-or-talking-little", "how-to-get-your-child-talking", "raising-a-bilingual-child-in-india"],
  published: "2026-07-30",
  updated: "2026-10-12",
  head: {
    title: "Late talker? What helps a child {hand:find their words}",
    lead: "What helps a 3 to 7 year old who talks later or less than others, and when to ask your child’s doctor.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: planetBook,
      alt: "A boy in round glasses and a mustard T-shirt lies on a striped rug, chin in his hands, wide-eyed over a picture book about planets.",
    },
  },
  /* Fold 2: the answer first (54 words), then D025's line, verbatim, directly under it. */
  answer: {
    question: "What helps a late talker?",
    answer:
      "Talk with your child, wait, and follow their lead. Name what they look at, add one word to what they say, and give them time to answer before you fill the silence. If your child is 3 or older and other people still can’t understand them most of the time, talk to your paediatrician.[^1]",
    detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." }],
  },
  body: [
    /* Fold 3: the scene, an untitled part */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "Few silences are louder than a 3-year-old who says less than the cousins. The family group chat fills with advice, most of it confident and some of it wrong.",
        },
        { kind: "p", text: "Here is what public guidance says, and what you can do at home today." },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "When should you ask a professional?",
      blocks: [
        { kind: "p", text: "As a general guide, talk to your child’s doctor if:" },
        {
          kind: "list",
          items: [
            "at 3, other people still can’t understand your child most of the time;[^1]",
            "at 3, your child doesn’t yet keep up a short conversation with you, of at least two back-and-forth exchanges;[^1]",
            "by 4, people can’t yet understand most of what your child says;[^2]",
            "at any age, your child loses words or skills they used to have.[^1]",
          ],
        },
        { kind: "p", text: "These are US guides, and every child is different. Missing one is a reason to ask, not a diagnosis." },
        {
          kind: "p",
          text: "The US Centers for Disease Control and Prevention suggest you talk with your child’s doctor, share your concerns and ask about developmental screening.[^1] ASHA, the US association of speech and hearing professionals, suggests an assessment by an audiologist or a speech-language pathologist if a child misses many of the milestones for their age.[^2]",
        },
        { kind: "p", variant: "gut", text: "If your gut says ask, ask." },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "What does the research say helps?",
      blocks: [
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^3]",
        },
        {
          kind: "p",
          text: "In a 2018 study of 36 children aged 4 to 6, children who had more back-and-forth conversational turns with adults showed more activity in Broca’s area, a language region of the brain, while listening to a story. The number of adult words they heard showed no such link.[^4] The children were typically developing, not late talkers, and the study shows a link, not cause and effect.[^4]",
        },
        {
          kind: "p",
          text: "Its authors suggest encouraging parents to talk with their children in “more interactive, back-and-forth conversation”.[^4] A turn can be tiny: your child points, you name the thing, they try the word, you smile and add one more.",
        },
      ],
    },
    /* Fold 6: tips framed as ways to have that back-and-forth, never as treatments (D025) */
    {
      kind: "part",
      title: "What helps at home, every day",
      blocks: [
        {
          kind: "list",
          variant: "tips",
          items: [
            { icon: "chat-circle-dots", text: "Talk about what you’re doing, in short sentences: “The dal is boiling. Now the cooker. One whistle, two.”" },
            { icon: "clock", text: "After you ask something, wait longer than feels natural. Count to five in your head." },
            { icon: "question", text: "Offer choices out loud: “The red cup or the blue cup?” A choice asks for a word." },
            { icon: "plus", text: "Answer every try as if it were a full sentence, then add one word: “Ball? Yes, a big ball.”" },
            { icon: "book-open", text: "Read the same book again, and pause before a word your child knows so they can say it." },
            { icon: "music-notes", text: "Sing together, and leave gaps for your child to fill." },
            { icon: "eye-slash", text: "Turn off the TV in the background while you play and talk." },
          ],
        },
        {
          kind: "p",
          text: "None of this needs a programme or a purchase. It needs turns, and anyone who loves your child can give them: parents, grandparents, cousins, the auntie next door.",
        },
      ],
    },
    /* Fold 7 */
    {
      kind: "part",
      title: "Two myths worth dropping",
      blocks: [
        { kind: "h3", text: "Myth 1: a second home language causes speech delay." },
        {
          kind: "p",
          text: "Asked whether using more than one language can cause a speech or language disorder, the American Academy of Pediatrics and the American Speech-Language-Hearing Association answer no: “Speech or language problems are not caused by learning multiple languages.”[^5] A bilingual child may split their words across two languages. Counted together, the total should be about the same as for a child of the same age learning one language.[^5] And a strong model in any language helps build a foundation for learning others.[^6] Keep both languages.",
        },
        { kind: "h3", text: "Myth 2: a talking toy will teach your child to talk." },
        {
          kind: "p",
          text: "A toy that plays recorded phrases or repeats your child’s words gives them nothing new to answer. No toy replaces the people who talk with your child every day.",
        },
      ],
    },
  ],
  /* Fold 8 */
  sources: [
    {
      citation: "US Centers for Disease Control and Prevention, “Learn the Signs. Act Early.”: milestones by 3 years, 2026 (reviewed 16 May), Language/Communication and “act early”.",
      href: "https://www.cdc.gov/act-early/milestones/3-years.html",
    },
    {
      citation: "American Speech-Language-Hearing Association, “Communication Milestones: 3 to 4 Years” and “Communication Milestones: 2 to 3 Years”, undated pages.",
      href: "https://www.asha.org/public/developmental-milestones/communication-milestones-3-to-4-years/",
    },
    {
      citation:
        "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    },
    {
      citation:
        "Romeo, Leonard, Robinson, West, Mackey, Rowe and Gabrieli, “Beyond the 30-Million-Word Gap: Children’s Conversational Exposure Is Associated With Language-Related Brain Function”, Psychological Science, 2018, Abstract, Method and Discussion.",
      href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
    },
    {
      citation:
        "American Academy of Pediatrics and American Speech-Language-Hearing Association, “Young Children Learning Multiple Languages: Parent FAQs”, HealthyChildren.org, 2025 (updated 20 November).",
      href: "https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx",
    },
    {
      citation: "American Speech-Language-Hearing Association, “Late Language Emergence” (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations.",
      href: "https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/",
    },
  ],
  close: "keep",
} satisfies Article;
