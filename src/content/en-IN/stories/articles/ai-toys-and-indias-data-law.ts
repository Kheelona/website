/// <reference types="next/image-types/global" />
import iraStory from "@ds/assets/Photo library/ira-01-story-on-the-bed-web.webp";
import type { Article } from "@/content/types";
import { RETENTION_LINE } from "../../policies";
import { seller } from "../../seller";

/**
 * What India’s data law asks of a toy that listens: rewritten (task 5.19) from its approved copy page
 * (wiki/site/pages/story-ai-toys-and-indias-data-law.md; CMO review round 2; head photo from the AI guides' pool, task
 * 5.20c: ira-01, 4:5, so the head takes its portrait layout). No mockup: the article template renders it, as the three
 * approved articles. Head and lead are the hub card's words (stories.md fold 4); the first-published date is the stub's,
 * the related list CMO built-page review B's ring (finding m3, task 7.1d; the copy page's fold 11), the should-kids and
 * AI-tutor guides in place of the get-talking guide (the legacy ring's) and the busy-hands guide (task 6.5's, for the
 * 3-6-9-12 guide the stub's swap had named, which left the journal, D053). Every statement about the law carries a marker and quotes the
 * official MeitY texts; the page says early that it is not legal advice, and never that Kheelu meets section 9. Fold 9
 * answers only what Kheelona can answer in confirmed facts (D018, D020's order, the retention line from policies.ts; as
 * narrowed by D058, task 8b.2a), with the page's one in-text product link and the help line from seller.ts. `updated`
 * is the rewrite's date; re-read the Gazette before Gate B (copy page, question 3).
 */
export const article = {
  slug: "ai-toys-and-indias-data-law",
  meta: {
    title: "DPDP Act: what India’s data law asks of AI toys · Kheelona",
    description:
      "The DPDP Act and children’s data, in plain words: what India’s law asks of a company from May 2027, and the questions to ask any AI toy maker.",
    og: {
      image: "/og/ira-01-story-on-the-bed.jpg",
      alt: "A laughing girl in a peach kurta sitting cross-legged on a block-print bedsheet, telling Kheelu a story with both hands.",
    },
  },
  card: {
    title: "What India’s data law asks of a toy that listens",
    summary: "India’s data law in plain words: what it asks of a company handling a child’s data, and what you can ask for.",
  },
  related: ["what-to-look-for-in-a-safe-ai-toy", "should-kids-use-ai", "does-a-three-year-old-need-an-ai-tutor"],
  published: "2026-09-11",
  updated: "2026-10-13",
  head: {
    title: "What India’s data law asks of {hand:a toy that listens}",
    lead: "India’s data law in plain words: what it asks of a company handling a child’s data, and what you can ask for.",
    author: "Apoorva Sahu",
    readMinutes: 3,
    image: {
      src: iraStory,
      alt: "A laughing girl in a peach kurta sitting cross-legged on a block-print bedsheet, telling Kheelu a story with both hands.",
    },
  },
  /* Fold 2: the answer first (59 words), each sentence sourced. */
  answer: {
    question: "What does the DPDP Act say about children’s data?",
    answer:
      "India’s Digital Personal Data Protection Act, 2023 (the DPDP Act) treats anyone under 18 as a child.[^1] Section 9 says a company must get a parent’s verifiable consent before processing a child’s personal data, and must not track children, monitor their behaviour or aim targeted advertising at them.[^1] Section 9 is due to come into force in May 2027.[^2]",
  },
  body: [
    /* Fold 3: who this is for (no heading); the page's one limit line */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "This guide is for the parent standing in front of a toy that talks. It covers the part of the DPDP Act about children: what it says, when it starts, and what you can ask any company. It puts the law’s own words into plain language. It is not legal advice.",
        },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "Who counts as a child?",
      blocks: [
        {
          kind: "p",
          text: "Anyone under 18. The Act defines a child as “an individual who has not completed the age of eighteen years”.[^1] So everything below applies to a {nowrap:3-year-old} and a teenager alike.",
        },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "Consent has to come from you",
      blocks: [
        {
          kind: "p",
          text: "Section 9 says a company must get “verifiable consent of the parent” before it processes any personal data of a child.[^1] The Digital Personal Data Protection Rules, 2025 add that the company must take “appropriate technical and organisational measures” to make sure it has that consent first.[^3]",
        },
        { kind: "p", text: "So, once section 9 is in force, the yes has to come from you, the parent, before your child’s data is used.[^1]" },
      ],
    },
    /* Fold 6 */
    {
      kind: "part",
      title: "What a company must not do",
      blocks: [
        {
          kind: "p",
          text: "Section 9 sets two more limits. A company must not process personal data in a way that is “likely to cause any detrimental effect on the well-being of a child”.[^1] And it “shall not undertake tracking or behavioural monitoring of children or targeted advertising directed at children”.[^1]",
        },
        {
          kind: "p",
          text: "The Rules list exceptions, such as a school tracking its pupils for their safety, or tracking a child’s real-time location to keep them safe.[^3]",
        },
        { kind: "p", text: "Whichever toy you choose, ask the company how it gets your consent, and whether it tracks your child or shows them ads." },
      ],
    },
    /* Fold 7 */
    {
      kind: "part",
      title: "When does it start?",
      blocks: [
        {
          kind: "p",
          text: "Not yet. The Act was published in August 2023, and the government is bringing it into force in stages.[^1][^2] Under its notification of November 2025, section 9 is due to come into force a year and a half later, in May 2027.[^2] The rule on a parent’s consent follows the same 18-month timetable.[^3]",
        },
        { kind: "p", text: "Until then, the questions below are yours to ask, of any company." },
      ],
    },
    /* Fold 8: questions a parent may ask, never rights (no legal advice) */
    {
      kind: "part",
      title: "What you can ask any company",
      blocks: [
        { kind: "p", text: "Ask before any toy that listens comes home, and expect a plain answer:" },
        {
          kind: "list",
          items: [
            "How do you get my consent, and how do you check it is me?",
            "Where is my child’s voice processed, and in which country?",
            "Do you track my child, or show them ads?",
            "Is my child’s data ever sold?",
            "Can I read what my child said, and delete it myself?",
            "How long do you keep it?",
          ],
        },
        { kind: "p", text: "A vague answer is an answer." },
      ],
    },
    /* Fold 9: where we stand, in confirmed facts only (never a compliance claim); the page's one in-text product link */
    {
      kind: "part",
      variant: "breakout",
      title: "Where we stand",
      blocks: [
        {
          kind: "p",
          text: "We sell [Kheelu](/products/kheelu), a toy that listens, so these questions are for us too. Here is where we stand today.",
        },
        {
          kind: "facts",
          items: [
            {
              icon: "microphone",
              title: "Listening.",
              body: "Kheelu’s microphone turns on only when someone presses the wake-up button, and a light shows whenever it’s listening.",
            },
            {
              icon: "lock-simple",
              title: "Your child’s voice.",
              body: "To understand and answer your child, Kheelu uses trusted speech and AI providers. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so.",
            },
            {
              icon: "eye",
              title: "Every conversation.",
              body: `You can read every conversation in the parent app. ${RETENTION_LINE} Delete them all sooner by deleting your account.`,
            },
            { icon: "hand-heart", title: "Your data.", body: "We don’t sell your data. Your child’s data is never used to advertise to them." },
          ],
        },
        {
          kind: "p",
          text: `Everything we collect, what we use it for and the choices you have are set out in our [privacy policy](/privacy). If any of it reads as less than clear, tell us: ${seller.help.contact}.`,
        },
      ],
    },
  ],
  /* Fold 10: the official MeitY texts only, never a mirror (C20 caveat 5) */
  sources: [
    {
      citation: "Government of India, “The Digital Personal Data Protection Act, 2023” (No. 22 of 2023), 2023, sections 1(2), 2(f) and 9.",
      href: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf",
    },
    {
      citation: "Ministry of Electronics and Information Technology, Government of India, Notification G.S.R. 843(E), 13 November 2025, clause (c).",
      href: "https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf",
    },
    {
      citation:
        "Ministry of Electronics and Information Technology, Government of India, “Digital Personal Data Protection Rules, 2025” (G.S.R. 846(E)), 2025, rules 1(4) and 10(1) and the Fourth Schedule.",
      href: "https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf",
    },
  ],
  close: "journal",
} satisfies Article;
