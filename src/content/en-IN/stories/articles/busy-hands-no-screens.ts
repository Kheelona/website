/// <reference types="next/image-types/global" />
import paperCrown from "@ds/assets/Photo library/ira-04-paper-crown-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * Busy hands, no screens: rewritten (task 5.17; copy page story-busy-hands-no-screens.md, CMO review
 * cmo-review-articles-5.17-2026-10-14.md). No mockup: it renders through the article template, held to the approved
 * articles' shared parts. Card words as the hub's (stories.md fold 2), related links and dates as the stub held them
 * (the main session's note for 5.17). One in-text product link (fold 9).
 */
export const article = {
  slug: "busy-hands-no-screens",
  meta: {
    title: "Screen-free activities for kids at home · Kheelona",
    description:
      "Screen-free activities for kids at home: ten-second setups, real jobs and quiet play for 3 to 7 year olds, including on the days you have to work.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Busy hands, no screens",
    summary: "Screen-free ways to keep a young child busy at home, including on the days you have to work.",
  },
  related: ["the-gentle-way-off-the-phone", "screen-time-rules-parents-swear-by", "what-to-look-for-in-a-safe-ai-toy"],
  published: "2026-07-28",
  updated: "2026-07-31",
  head: {
    title: "{hand:Busy hands}, no screens: screen-free activities for kids at home",
    lead: "Screen-free ways to keep a young child busy at home, including on the days you have to work.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: paperCrown,
      alt: "A laughing girl in a sky-blue T-shirt puts on a yellow paper crown beside a craft table strewn with paper scraps, glue and crayons.",
    },
  },
  /* Fold 2: the answer first (55 words), then what the page holds. */
  answer: {
    question: "What are good screen-free activities for kids at home?",
    answer:
      "Ones that start in seconds and need no grown-up to run them: dough, crayons and paper, a blanket fort, a box of blocks, real jobs like matching socks or washing potatoes, and stories told or played aloud. Set them up in the room where you are, and keep a few ready on one low shelf.",
    detail: [{ kind: "p", text: "Below: ten-second setups, real jobs, ideas by age, and what to do on the days you have to work." }],
  },
  body: [
    /* Fold 3: the scene, untitled */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "It is 4 pm, your call starts in ten minutes, and a small person is circling your desk asking what they can do. The tablet would solve it in four seconds.",
        },
        {
          kind: "p",
          text: "Look at what the tablet offers: no setup, no grown-up needed, no way to get it wrong. An activity with the same three things has a fair chance against it.",
        },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "Ten-second setups",
      blocks: [
        { kind: "p", text: "Keep one low shelf of things that start at once and can stop anywhere:" },
        {
          kind: "list",
          items: [
            "a cup of water and a paintbrush, to “paint” the floor tiles",
            "steel dabbas and their lids, to match up",
            "old newspaper, to tear into the world’s biggest salad",
            "a bedsheet over two chairs: a house until dinner",
            "dough, a small rolling pin and a few cutters",
            "a cardboard box, which can be a car, a cave and a shop before lunch",
          ],
        },
        { kind: "p", text: "The plainer the thing, the more games it can be." },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "Give them a real job",
      blocks: [
        { kind: "p", text: "To a 4-year-old, matching every sock in the basket is not a chore. It is a promotion." },
        {
          kind: "p",
          text: "Name the job and hand it over: “You’re in charge of the potatoes.” Washing vegetables, sorting spoons, watering the plants, guarding the dough while it rises. Let it be done their way.",
        },
      ],
    },
    /* Fold 6 */
    {
      kind: "part",
      title: "Screen-free activities for a {nowrap:3-year-old} at home",
      blocks: [
        {
          kind: "p",
          text: "Keep it big, simple and close to you: chunky crayons on a roll of paper taped to the floor, dough, stacking steel tumblers, pouring water between two cups over a basin, and dancing to a song you sing together.",
        },
        { kind: "p", text: "Keep small things out of reach, and stay in the same room." },
      ],
    },
    /* Fold 7 */
    {
      kind: "part",
      title: "For a 5, 6 or {nowrap:7-year-old}: projects that last",
      blocks: [
        {
          kind: "p",
          text: "Try projects that can run all afternoon and wait for tomorrow: a cardboard-box city, a treasure hunt with picture clues, a comic about the family cat, a shop with price tags they draw or write themselves.",
        },
        { kind: "p", text: "Ask them to explain it to you at dinner. The telling is half the fun." },
      ],
    },
    /* Fold 8: the page's one sourced line */
    {
      kind: "part",
      title: "Quiet time: a story instead of a show",
      blocks: [
        { kind: "p", text: "Some moments call for sitting still: after lunch, before bed, at the end of a long day." },
        {
          kind: "p",
          text: "For three and four year olds, the World Health Organization says screen time spent sitting and watching should be no more than an hour a day, and less is better. When children are sitting still, it encourages “reading and storytelling with a caregiver”.[^1]",
        },
        {
          kind: "callout",
          icon: "book-open",
          lead: "Try this:",
          text: "read a picture book once, then hand it over and let your child tell it back to you from the pictures.",
        },
      ],
    },
    /* Fold 9: the page's one in-text product link */
    {
      kind: "part",
      title: "On the days you have to work",
      blocks: [
        {
          kind: "p",
          text: "For the stretches you can’t be interrupted, set the activity up in the room where you work, and add something that talks: a story, told or played aloud, in your home language, or a grandparent on a voice call.",
        },
        {
          kind: "p",
          text: "[Kheelu](/products/kheelu) is one more screen-free option: a plush toy for ages 3 to 7 that answers your child, then asks a question back. It is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.",
        },
        { kind: "p", text: "Most of this page needs no technology at all: a shelf, a basket of socks, a cardboard box." },
      ],
    },
  ],
  /* Fold 10 */
  sources: [
    {
      citation:
        "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
      href: "https://iris.who.int/handle/10665/311664",
    },
  ],
  close: "journal",
} satisfies Article;
