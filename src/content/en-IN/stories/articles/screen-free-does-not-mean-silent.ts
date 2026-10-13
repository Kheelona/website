/// <reference types="next/image-types/global" />
import countingCarriages from "@ds/assets/Photo library/advik-01-counting-carriages-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";

/**
 * Screen-free does not mean silent: rewritten (task 5.17; copy page story-screen-free-does-not-mean-silent.md, CMO
 * review cmo-review-articles-5.17-2026-10-14.md; the head photo of task 5.20a, CMO M17, fix-pass review
 * cmo-review-article-fixes-5.20a-2026-10-14.md). No mockup: it renders through the article template, held to the
 * approved articles' shared parts. Card words as the hub's (stories.md fold 2), related links and dates as the stub held
 * them (the main session's note for 5.17). The research line (fold 4) credits talk with an adult; the one in-text
 * product link sits four folds later (fold 8, D016).
 */
export const article = {
  slug: "screen-free-does-not-mean-silent",
  meta: {
    title: "Screen-free toys for a home full of talk · Kheelona",
    description:
      "Screen-free toys for 3 to 7 year olds: which ones get a child talking, a story box or a toy that talks back, and what a home full of talk looks like.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Screen-free does not mean silent",
    summary: "What a childhood full of talk looks like, without a single screen.",
  },
  related: ["learning-toys-for-a-three-year-old", "how-much-screen-time-for-a-3-to-6-year-old", "screen-time-and-tantrums"],
  published: "2026-07-28",
  updated: "2026-10-13",
  head: {
    title: "Screen-free {hand:does not mean silent}: a guide to screen-free toys",
    lead: "What a childhood full of talk looks like, without a single screen, and how to choose screen-free toys that add to it.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: countingCarriages,
      alt: "A smiling boy in a navy striped T-shirt sits cross-legged on a red-oxide floor by a low bookshelf, lining up the carriages of a blue wooden train, with Kheelu sitting beside it.",
    },
  },
  /* Fold 2: the answer first (57 words), with no product in it. */
  answer: {
    question: "What are screen-free toys?",
    answer:
      "Toys that keep a child busy without a display: blocks, puzzles, crayons and dough, pretend-play sets, picture books, puppets, and audio or talking toys. The best ones give your child something to do or say, not just something to watch. A simple test in the shop: will this toy wait for my child, or perform at them?",
  },
  body: [
    /* Fold 3: the scene, untitled */
    {
      kind: "part",
      blocks: [
        {
          kind: "p",
          text: "Take the tablet away and the first thing you notice is the noise. Not the TV kind. The good kind: questions, made-up songs, a running commentary on the ants.",
        },
        {
          kind: "p",
          text: "You may worry that screen-free means a quieter, duller childhood. It doesn’t have to. A screen mostly asks a child to watch. Play asks them to do things, and talk asks them to answer.",
        },
      ],
    },
    /* Fold 4 */
    {
      kind: "part",
      title: "What does a childhood full of talk look like?",
      blocks: [
        { kind: "p", text: "It sounds like turns: your child says something, you answer, they answer back." },
        {
          kind: "p",
          text: "Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain. They also support the early language and social skills that later, more complex thinking builds on.[^1]",
        },
        { kind: "p", text: "At home, that comes from small habits, not a curriculum:" },
        {
          kind: "list",
          variant: "tips",
          items: [
            { icon: "chat-circle-dots", text: "Say what you’re doing while you cook: “Onions first. Now the tomatoes. Smell that?”" },
            { icon: "question", text: "Ask questions with no wrong answer: “What would the cat say if it could talk?”" },
            { icon: "book-open", text: "Let the silly voice read the bedtime story." },
            { icon: "moon", text: "Now and then, answer a question with a question: “Why do you think the moon follows the car?”" },
            { icon: "music-notes", text: "Leave gaps in songs for your child to fill." },
          ],
        },
      ],
    },
    /* Fold 5 */
    {
      kind: "part",
      title: "Leave room for boredom",
      blocks: [
        {
          kind: "p",
          text: "When your child says “I’m bored”, wait a few minutes before you fix it. The floor may become lava. The sofa may become a ship.",
        },
        {
          kind: "p",
          text: "Screen-free does not mean silent, and it does not mean joyless. Often it means the sound in your home is your child thinking out loud.",
        },
      ],
    },
    /* Fold 6 */
    {
      kind: "part",
      title: "How do you choose screen-free toys?",
      blocks: [
        { kind: "p", text: "Ask one question in the shop: what will my child do with this, and what will they say?" },
        {
          kind: "list",
          items: [
            "Blocks and boxes: they build, then tell you what it is.",
            "Pretend-play sets: someone has to be the doctor, and someone has to say what’s wrong with teddy.",
            "Puppets: a second voice for a quiet child.",
            "Picture books: read together, then let them tell it back.",
            "Simple board games: “My go. Now yours.”",
          ],
        },
        { kind: "p", text: "A toy that plays the same recorded sentence at every press makes noise, but it can’t answer back." },
      ],
    },
    /* Fold 7 */
    {
      kind: "part",
      title: "Looking for a screen-free gift?",
      blocks: [
        {
          kind: "p",
          text: "Choose something your child can do, build or say, rather than watch: a box of blocks, a puppet, a book you’ll read together, crayons with a roll of paper. Then play with it together, the first time at least.",
        },
      ],
    },
    /* Fold 8: the page's one in-text product link (Story mode per D027; asking back in AI mode only) */
    {
      kind: "part",
      title: "Story box or a toy that talks back?",
      blocks: [
        {
          kind: "p",
          text: "They do different jobs. A story box or audio player plays stories your child listens to. A toy that talks back holds a conversation: your child asks, it answers, then it asks a question back.",
        },
        { kind: "p", text: "Both are screen-free. Choose by what you want more of at home: listening, or talking." },
        {
          kind: "p",
          text: "[Kheelu](/products/kheelu) does both. In Story mode it plays stories, poems and jingles, with no Wi-Fi needed. In AI mode it talks with your child on your home Wi-Fi: it answers your child, then asks a question back. It is made for ages 3 to 7, and it is not a toy for children under 3. If your child is 3, keep a grown-up nearby while they play.",
        },
      ],
    },
  ],
  /* Fold 9 */
  sources: [
    {
      citation:
        "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts), undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts.",
      href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
    },
  ],
  close: "journal",
} satisfies Article;
