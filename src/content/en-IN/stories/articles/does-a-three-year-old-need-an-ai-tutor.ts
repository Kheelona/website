/// <reference types="next/image-types/global" />
import drawingAtHome from "@ds/assets/Photo library/myra-04-drawing-at-home-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG } from "../../organization";

/**
 * Does a three-year-old need an AI tutor?: rewritten (task 5.19) from its approved copy page
 * (wiki/site/pages/story-does-a-three-year-old-need-an-ai-tutor.md; CMO review round 2). No mockup: the article
 * template renders it, as the three approved articles. Head and lead are the hub card's words (stories.md fold 4); the
 * related list and first-published date are the stub's. The answer is "no", with Harvard's serve-and-return line; the
 * brain lines sit in folds 2-3, three folds above the one product line (D016). Kheelu is never called a tutor. The
 * head photo shows no Kheelu (CMO M6). `updated` is the rewrite's date.
 */
export const article = {
  slug: "does-a-three-year-old-need-an-ai-tutor",
  meta: {
    title: "Does a 3-year-old need an AI tutor? · Kheelona",
    description: "Does a 3-year-old need an AI tutor? No. What help at 3 looks like, what the WHO and IAP say about screens, and what to look for instead.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Does a three-year-old need an AI tutor?",
    summary: "Tutoring apps promise homework help. Your child can’t do homework yet. What help at 3 should look like.",
  },
  related: ["should-kids-use-ai", "questions-parents-ask-about-ai-toys", "why-three-to-six-are-the-years-that-matter-most"],
  published: "2026-07-30",
  updated: "2026-10-13",
  head: {
    title: "Does a {nowrap:three-year-old} need an {hand:AI tutor?}",
    lead: "Tutoring apps promise homework help. Your child can’t do homework yet. What help at 3 should look like.",
    author: "Apoorva Sahu",
    readMinutes: 3,
    image: {
      src: drawingAtHome,
      alt: "A little girl in a red polka-dot frock, tongue out in concentration, scribbling with an orange crayon at a low table.",
    },
  },
  /* Fold 2: the answer first (59 words), with no product in it. */
  answer: {
    question: "Does a {nowrap:3-year-old} need an AI tutor?",
    answer:
      "No. A {nowrap:3-year-old} isn’t ready for homework yet. Help at 3 is simpler: someone who answers their questions, asks one back and waits for the reply. Harvard’s Center on the Developing Child says back-and-forth exchanges like these, with a caring adult, help build a young child’s brain and support early language.[^1] Look for play that invites talk, not drills.",
  },
  body: [
    /* Fold 3: what help looks like at 3, then one everyday exchange between a child and a parent */
    {
      kind: "part",
      title: "What does help look like at 3?",
      blocks: [
        {
          kind: "p",
          text: "A tutor, in the usual sense, helps a child keep up with school: homework, practice, tests. A {nowrap:3-year-old} doesn’t need any of those. What they have is questions.",
        },
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^1]",
        },
        { kind: "p", text: "At 3, the serve is often a question. A good return answers it, then asks one back:" },
        { kind: "p", lead: "Your child:", text: "Why is the dosa round?" },
        { kind: "p", lead: "You:", text: "Because we spread the batter round and round. What shape would you make?" },
        { kind: "p", lead: "Your child:", text: "A star!" },
        { kind: "p", lead: "You:", text: "How would we flip a star?" },
        {
          kind: "p",
          text: "Four turns, and your child did half the thinking. That is what help looks like at 3: a patient grown-up who answers the fourth “why” as kindly as the first.",
        },
        {
          kind: "callout",
          icon: "question",
          lead: "Try this:",
          text: "after your child’s next “why”, answer in a sentence, then ask, “What do you think?” Count to five before you say more.",
        },
      ],
    },
    /* Fold 4: a tutoring app on a tablet */
    {
      kind: "part",
      title: "What about a tutoring app on a tablet?",
      blocks: [
        { kind: "p", text: "A tutoring app on a phone or tablet is screen time." },
        {
          kind: "p",
          text: "For three and four year olds, the Indian Academy of Pediatrics says no more than an hour of screen time a day, for no more than 20 to 30 minutes at a time, always supervised by a caregiver.[^2] The World Health Organization’s limit for watching screens at this age is the same hour, and it adds that less is better.[^3]",
        },
        {
          kind: "p",
          text: "That hour covers every screen in the day, so a tutoring app shares it with everything else. From five to ten, the IAP’s limit is under two hours a day, and it counts screen time for schoolwork too.[^2]",
        },
        { kind: "p", text: "If a screen is part of your child’s day, sit with them and talk about what you see." },
      ],
    },
    /* Fold 5: AI that hands over the answers (one author's view, with its scope; no Kheelu in the fold) */
    {
      kind: "part",
      title: "What about AI that does the thinking for them?",
      blocks: [
        {
          kind: "p",
          text: "In a May 2026 commentary for the Brookings Institution, Rebecca Winthrop, who directs its Center for Universal Education, described one worry about children and AI as “cognitive stunting”: relying too heavily on AI “reduces children’s opportunities to engage in effortful thinking”.[^4]",
        },
        { kind: "p", text: "She calls the evidence emerging, and none of the findings she reports is about children as young as 3.[^4]" },
        {
          kind: "p",
          text: "Whatever that evidence shows in time, the habit is easy to keep at home: give your child time to think before anyone, or anything, gives the answer. That is the case for a question back. It hands the thinking to your child.",
        },
      ],
    },
    /* Fold 6: what to look for instead, then the page's one in-text product link */
    {
      kind: "part",
      title: "What to look for instead",
      blocks: [
        { kind: "p", text: "If you are weighing an AI toy or app for a young child, look for these:" },
        {
          kind: "list",
          variant: "checks",
          items: [
            "Talk, not taps: your child speaks and listens, with no screen to watch.",
            "It answers, then asks your child something back.",
            "It says when it doesn’t know, instead of guessing.",
            "It can’t browse the open internet.",
            "You can read every conversation.",
          ],
        },
        {
          kind: "p",
          text: "What child-safety groups advise about AI toys at this age, and our answer, is in our guide to [what to look for in a safe AI toy](/stories/what-to-look-for-in-a-safe-ai-toy).",
        },
        {
          kind: "p",
          text: "[Kheelu](/products/kheelu) is built around this list: a screen-free plush toy for ages 3 to 7 that answers your child, then asks a question back. It can’t browse the internet, it says when it doesn’t know, and you can read every conversation in the parent app. It is a toy, not a tutor, and it tells your child it’s a toy.",
        },
        { kind: "p", text: "It is not a toy for children under 3, and if your child is 3, keep a grown-up nearby while they play." },
      ],
    },
  ],
  /* Fold 7: note 4 names its second section by description (its title carries a banned phrase) */
  sources: [
    {
      citation:
        "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    },
    {
      citation: "Indian Academy of Pediatrics, “Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents”, Indian Pediatrics, 2022, p. 239.",
      href: "https://www.indianpediatrics.net/mar2022/235.pdf",
    },
    {
      citation:
        "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
      href: "https://iris.who.int/handle/10665/311664",
    },
    {
      citation: "Rebecca Winthrop, Brookings Institution, “Is it time to measure cognitive stunting?”, 2026, section “Cognitive stunting” and the section on early evidence.",
      href: "https://www.brookings.edu/articles/is-it-time-to-measure-cognitive-stunting/",
    },
  ],
  close: "journal",
} satisfies Article;
