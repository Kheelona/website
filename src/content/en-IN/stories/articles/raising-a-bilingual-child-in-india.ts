/// <reference types="next/image-types/global" />
import readingNook from "@ds/assets/Photo library/tara-04-reading-nook-web.webp";
import type { Article } from "@/content/types";
import { TEAM_BYLINE } from "../../organization";

/**
 * Raising a bilingual child in India: rewritten (task 5.18) from its copy page,
 * wiki/site/pages/story-raising-a-bilingual-child-in-india.md, word for word (CMO review
 * wiki/qa/cmo-review-articles-5.18-2026-10-14.md; copy fixes M13 in task 5.20b, CMO review
 * wiki/qa/cmo-review-article-fixes-5.20b-2026-10-14.md). No mockup: the article template renders it. Card words and
 * dates as the stub held them (stories.md fold 3; the live journal's dates); the related list from CMO built-page review
 * B's ring (finding m3, which folds in CMO 5.18 M6; task 7.1d; the copy page's fold 11), the get-talking and
 * learn-by-talking guides in place of the should-kids and AI-tutor guides. No pitch: no product
 * link, no pre-order button (the keep-reading close), and Kheelu named only in D025's line under the answer. Every
 * statement about speech or language carries a source marker (D025, D026); the review's count-each-idea-once method and
 * the AAP and ASHA's totals stay in separate paragraphs with their own markers (source verification C40). The read
 * time is the module's own words over 200, rounded (CMO review M11). The copy page leaves the tips' and the callout's
 * icons to the builder: they are the CMO review's picks (M14).
 */
export const article = {
  slug: "raising-a-bilingual-child-in-india",
  meta: {
    title: "Raising a bilingual child in India · Kheelona",
    description:
      "Raising a bilingual child in India: what the research says about two languages, why mixing words is normal, and what keeps a home language alive.",
    og: {
      image: "/og/tara-04-reading-nook.jpg",
      alt: "A girl with curly hair, in a coral kurta, sits cross-legged on a window seat and reads a picture book aloud, one finger on the page.",
    },
  },
  card: {
    title: "Raising a bilingual child in India",
    summary: "Does a bilingual home confuse a young child? What the research says, and what keeps a home language alive.",
  },
  related: ["talking-toys-and-late-talkers", "how-to-get-your-child-talking", "how-children-learn-by-talking"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "Raising a {hand:bilingual child} in India",
    lead: "What the research says about two languages at home, and what keeps a home language alive.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: readingNook,
      alt: "A girl with curly hair, in a coral kurta, sits cross-legged on a window seat and reads a picture book aloud, one finger on the page.",
    },
  },
  /* Fold 2: the answer first (50 words), then D025's line, verbatim, directly under it. */
  answer: {
    question: "Will a bilingual home confuse your child?",
    answer:
      "No. Growing up bilingual does not cause speech or language problems, and mixing two languages in one sentence is normal.[^1] Speaking your home language will not stop your child learning English.[^1] A strong model in any language helps build a foundation for learning others.[^2] So keep speaking yours every day.",
    detail: [{ kind: "disclaimer", text: "Kheelu is a toy, not a therapy or treatment. If you’re worried about your child’s speech, talk to your paediatrician." }],
  },
  body: [
    /* Fold 3: the scene, an untitled part */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "You may know this moment. You ask something in Kannada, and your child answers in English. Part of you is proud. Part of you wonders whether the home language is slipping away.",
        },
        {
          kind: "p",
          text: "Under it sits an older worry: are two languages too much for a young child? Here is what the research says, and what keeps a home language going.",
        },
      ],
    },
    /* Fold 4: the research answer, with its method and its limits */
    {
      kind: "part",
      title: "Does a second language confuse or delay a young child?",
      blocks: [
        {
          kind: "p",
          text: "No. A 2013 review of the research, written for parents by two researchers who study bilingual infants and children, says it plainly: bilingual children are not more likely than monolingual children to have difficulties with language, to show delays in learning, or to be diagnosed with a language disorder.[^3]",
        },
        {
          kind: "p",
          text: "They may know fewer words in each language on its own. Count the ideas they have a word for in either language, counting “paani” and “water” once, and the total is about the same as for a child growing up with one language.[^3] Most of the studies it draws on were done in North America and Europe.[^3]",
        },
        {
          kind: "p",
          text: "The American Academy of Pediatrics and the American Speech-Language-Hearing Association say the same in their advice for parents: “Speech or language problems are not caused by learning multiple languages.”[^1]",
        },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "Is mixing two languages a problem?",
      blocks: [
        {
          kind: "p",
          text: "No. Mixing words or grammar from two languages in one sentence is normal, and it isn’t confusion.[^1] Usually by age 3, children learning more than one language can keep them apart, and use the one that suits the person they’re talking to.[^1]",
        },
        { kind: "p", text: "So when your child answers your Tamil in English, answer back in Tamil, warmly." },
      ],
    },
    /* Fold 6 */
    {
      kind: "part",
      title: "Is the home language in the way of English?",
      blocks: [
        {
          kind: "p",
          text: "No. ASHA, the US association of speech and hearing professionals, says in its guidance for clinicians that a strong model in any language helps build a foundation for learning others.[^2]",
        },
        {
          kind: "p",
          text: "Jim Cummins, a University of Toronto researcher on bilingual education, argues that concepts learned in the mother tongue carry over to a second language. A child who can tell the time in one language, he writes, does not need to re-learn the concept in another, only the new labels for it.[^4] He was writing about children at school.[^4]",
        },
      ],
    },
    /* Fold 7 */
    {
      kind: "part",
      title: "What does India’s education policy say?",
      blocks: [
        {
          kind: "p",
          text: "India’s National Education Policy 2020 says that, wherever possible, children should be taught in their home language, mother tongue, or local or regional language until at least Grade 5, and preferably till Grade 8 and beyond.[^5] The policy gives its reason in the same paragraph: young children “learn and grasp nontrivial concepts more quickly in their home language/mother tongue”.[^5]",
        },
        { kind: "p", text: "It is a policy for schools, followed wherever possible, not a law." },
      ],
    },
    /* Fold 8: advice only, nothing claims a result */
    {
      kind: "part",
      title: "What keeps a home language alive?",
      blocks: [
        {
          kind: "list",
          variant: "tips",
          items: [
            { icon: "music-notes", text: "Give it jobs: the songs, the food words, the jokes and the stories one grandparent tells best." },
            { icon: "chat-circle-dots", text: "Speak it without apology, at home and outside." },
            { icon: "translate", text: "When your child answers in English, reply in your language, warmly." },
            { icon: "book-open", text: "Read in it, even if the books take some finding." },
            { icon: "users-three", text: "Keep calls with grandparents and cousins in their language." },
            { icon: "heart", text: "Let it carry the good moments, not only “eat your food” and “time for bed”." },
          ],
        },
        {
          kind: "callout",
          icon: "hand-heart",
          lead: "Try this:",
          text: "this week, ask a grandparent to tell your child one story in the home language, on a call or in person.",
        },
      ],
    },
    /* Fold 9 */
    {
      kind: "part",
      title: "Who speaks what, day to day?",
      blocks: [
        {
          kind: "p",
          text: "Families do this in different ways: one language for each parent, one language at home and English at school, or grandparents who keep the home language going. Pick a pattern your household can keep, and change it when life changes.",
        },
      ],
    },
  ],
  /* Fold 10 */
  sources: [
    {
      citation:
        "American Academy of Pediatrics and American Speech-Language-Hearing Association, “Young Children Learning Multiple Languages: Parent FAQs”, HealthyChildren.org, 2025 (updated 20 November).",
      href: "https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx",
    },
    {
      citation: "American Speech-Language-Hearing Association, “Late Language Emergence” (Practice Portal), undated, Assessment: Cultural and Linguistic Considerations.",
      href: "https://www.asha.org/practice-portal/clinical-topics/late-language-emergence/",
    },
    {
      citation: "Krista Byers-Heinlein and Casey Lew-Williams, “Bilingualism in the Early Years: What the Science Says”, LEARNing Landscapes, 2013, pp. 97 and 104.",
      href: "https://doi.org/10.36510/learnland.v7i1.632",
    },
    {
      citation: "Jim Cummins, “Bilingual Children’s Mother Tongue: Why is it important for education?”, Sprogforum 19, 2001, p. 18.",
      href: "https://web.archive.org/web/20120905180920/http://inet.dpb.dpu.dk/infodok/sprogforum/Espr19/CumminsENG.pdf",
    },
    {
      citation: "Ministry of Human Resource Development (now Ministry of Education), Government of India, “National Education Policy 2020”, 2020, chapter 4, para 4.11, p. 13.",
      href: "https://ncert.nic.in/pdf/nep/NEP_2020.pdf",
    },
  ],
  /* Fold 11: keep reading, no pre-order button */
  close: "keep",
} satisfies Article;
