/// <reference types="next/image-types/global" />
import countingCarriages from "@ds/assets/Photo library/advik-01-counting-carriages-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * Screen time for a 3-year-old, and up to age 7: rewritten (task 5.17; copy page
 * story-how-much-screen-time-for-a-3-to-6-year-old.md, CMO review cmo-review-articles-5.17-2026-10-14.md; fixes of
 * task 5.20a, CMO M4 to M7 and M16, fix-pass review cmo-review-article-fixes-5.20a-2026-10-14.md). No mockup:
 * it renders through the article template, held to the approved articles' shared parts. Card words as the hub's
 * (stories.md fold 2), related links and dates as the stub held them (the main session's note for 5.17). One in-text
 * product link (fold 10).
 */
export const article = {
  slug: "how-much-screen-time-for-a-3-to-6-year-old",
  meta: {
    title: "Screen time for a 3-year-old, and up to age 7 · Kheelona",
    description: "Screen time for a 3-year-old: no more than an hour a day, say the WHO and the IAP. What changes up to age 7, and what to do at 6 pm.",
    og: DEFAULT_OG,
  },
  card: {
    title: "How much screen time is okay for a young child?",
    summary: "What the WHO, the Indian Academy of Pediatrics and the AAP say, age by age, and what to do at 6 pm.",
  },
  related: ["screen-free-does-not-mean-silent", "screen-time-and-tantrums", "the-gentle-way-off-the-phone"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "Screen time for a {nowrap:3-year-old,} and {hand:up to age 7}",
    lead: "What the WHO, the Indian Academy of Pediatrics and the AAP say, age by age, and what to do at 6 pm.",
    author: TEAM_BYLINE,
    readMinutes: 4,
    image: {
      src: countingCarriages,
      alt: "A smiling boy in a navy-and-white striped T-shirt sits cross-legged on a red floor, lining up a blue wooden train, with Kheelu sitting beside him in front of a low bookshelf.",
    },
  },
  /* Fold 2: the answer first (54 words), then two paragraphs that frame the rest of the page. */
  answer: {
    question: "How much screen time for a {nowrap:3-year-old}?",
    answer:
      "No more than an hour a day, and less is better. The World Health Organization and the Indian Academy of Pediatrics both say so for three and four year olds.[^1][^2] What the screen replaces matters too: talking, play, sleep and moving about. When your child does watch, sit with them and talk about it.",
    detail: [
      { kind: "p", text: "That hour is a ceiling, not a target." },
      { kind: "p", text: "Below: what changes at each age up to 7, and what to do when the evening gets hard." },
    ],
  },
  body: [
    /* Fold 3 */
    {
      kind: "part",
      title: "How much screen time for a {nowrap:4-year-old}?",
      blocks: [
        {
          kind: "p",
          text: "The same hour. The WHO and the IAP set it for four year olds too.[^1][^2] The American Academy of Pediatrics sets no more than an hour a day of high-quality programmes for children aged two to five, watched together.[^3]",
        },
        {
          kind: "p",
          text: "For three and four year olds, the IAP adds two details: no more than 20 to 30 minutes at a time, and a grown-up always supervising.[^2]",
        },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "How much screen time for a {nowrap:5-year-old}?",
      blocks: [
        {
          kind: "p",
          text: "Under two hours a day, says the IAP, from 5 until 10, and that includes time on a screen for homework. Less is better.[^2] The WHO’s guideline stops at 4.[^1]",
        },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "How much screen time at 6 and 7?",
      blocks: [
        {
          kind: "p",
          text: "The IAP’s limit of under two hours a day still applies, homework included.[^2] The AAP’s advice for children aged 5 to 18 sets no fixed number of hours: it asks families to place consistent limits on time and on the kinds of media used.[^4]",
        },
        { kind: "p", text: "Agree the limit with your child, keep it the same every day, and keep screens from crowding out sleep and play." },
      ],
    },
    /* Fold 6 */
    {
      kind: "part",
      title: "What if your child watches more than that?",
      blocks: [
        {
          kind: "p",
          text: "You are not alone. Across 10 studies from India, covering 2,857 children under five, children averaged about 2.2 hours of screen time a day. That is more than the guidelines advise.[^5]",
        },
        {
          kind: "p",
          text: "Cut back a little at a time, and have something ready to fill the gap. Our seven-day plan, [The gentle way off the phone](/stories/the-gentle-way-off-the-phone), shows one way to do it.",
        },
      ],
    },
    /* Fold 7 */
    {
      kind: "part",
      title: "What the hour leaves room for",
      blocks: [
        {
          kind: "p",
          text: "The AAP says the one-hour limit for young children is there to leave them “ample time to engage in other activities important to their health and development”.[^3] And when a young child is sitting still, the WHO encourages reading and storytelling with a caregiver.[^1]",
        },
        { kind: "p", text: "So look at the whole day, not just the minutes. Is there room for talking, playing, moving about and sleep?" },
      ],
    },
    /* Fold 8 */
    {
      kind: "part",
      title: "Does it matter what they watch?",
      blocks: [
        {
          kind: "p",
          text: "Yes. The AAP says well-designed programmes “can improve cognitive, literacy, and social outcomes for children 3 to 5 years of age”.[^3] It also asks parents to avoid three things: fast-paced programmes (young children do not understand them as well), apps with lots of distracting content, and anything violent.[^3]",
        },
        { kind: "p", text: "And it asks parents to watch with their children and help them understand what they are seeing.[^3]" },
        {
          kind: "callout",
          icon: "chat-circle-dots",
          lead: "Try this:",
          text: "after an episode, ask your child to tell you what happened, and which part they liked best.",
        },
      ],
    },
    /* Fold 9 */
    {
      kind: "part",
      title: "What about meals and bedtime?",
      blocks: [
        {
          kind: "p",
          text: "For children under five, the IAP and the AAP both say no screens at meals and none in the hour before sleep.[^2][^3] The AAP also asks families to keep bedrooms screen-free.[^3] The IAP adds car, bus and train journeys to the screen-free list.[^2]",
        },
        { kind: "p", text: "If your evening wind-down leans on a screen, move the screen earlier and put a bath, a story or a song in its place." },
      ],
    },
    /* Fold 10: habits for tonight, then the page's one in-text product link, then the tantrums guide */
    {
      kind: "part",
      title: "What do you do at 6 pm?",
      blocks: [
        { kind: "p", text: "Knowing the number does not cook dinner. A few habits worth trying:" },
        {
          kind: "list",
          variant: "tips",
          items: [
            { icon: "calendar-check", text: "Decide when screen time ends before it starts, and tell your child." },
            { icon: "pause", text: "End at a natural break, such as the end of an episode, not halfway through." },
            { icon: "smiley", text: "Put something your child enjoys straight after it, so the end is also a start." },
            { icon: "house", text: "Keep the screen in a room you share, not the bedroom." },
            { icon: "users-three", text: "Sit with them for a few minutes of it, and talk about what you see." },
          ],
        },
        {
          kind: "p",
          text: "Looking for something to follow the screen? [Kheelu](/products/kheelu) is one screen-free option: a plush toy for ages 3 to 7 that answers your child, then asks a question back. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.",
        },
        {
          kind: "p",
          text: "If switching off ends in tears most evenings, read [Screen time and tantrums: what is actually happening](/stories/screen-time-and-tantrums).",
        },
      ],
    },
  ],
  /* Fold 11 */
  sources: [
    {
      citation:
        "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
      href: "https://iris.who.int/handle/10665/311664",
    },
    {
      citation: "Indian Academy of Pediatrics, “Guidelines on Screen Time and Digital Wellness in Infants, Children and Adolescents”, Indian Pediatrics, 2022, p. 239.",
      href: "https://www.indianpediatrics.net/mar2022/235.pdf",
    },
    {
      citation:
        "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Preschool Media and Learning, Conclusions and Recommendations: Families.",
      href: "https://doi.org/10.1542/peds.2016-2591",
    },
    {
      citation:
        "American Academy of Pediatrics, Council on Communications and Media, “Media Use in School-Aged Children and Adolescents”, Pediatrics, 2016, Recommendations: Families.",
      href: "https://doi.org/10.1542/peds.2016-2592",
    },
    {
      citation:
        "Khobragade and Shenoy, AIIMS Raipur, “Screen Time Among Under-Five Children in India: A Systematic Review and Meta-Analysis”, Cureus, 2025, Results.",
      href: "https://doi.org/10.7759/cureus.85458",
    },
  ],
  close: "journal",
} satisfies Article;
