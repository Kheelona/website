import { TOKEN_PRICE } from "@/config/site";

/** The journal (prompt §5.2 Stories): useful before we sell. Four seed pieces,
 *  keyword-mapped, voice-linted, each ending on a soft invite (never a hard sell). */

export type Story = {
  slug: string;
  title: string;
  description: string;
  theme: string;
  /** Byline (V3-f cleared 2026-07-31): one of the four people on /team. */
  author: string;
  minutes: number;
  pose: "curious" | "silly" | "joy" | "bliss" | "grumpy" | "sad";
  tint: string;
  /** optional illustrated header, path under /public */
  hero?: string;
  /** An age caveat, shown as an aside under the article.
   *
   *  Only for pieces whose SUBJECT is a child younger than Kheelu's band, where
   *  the closing invitation would otherwise read as "buy this for your
   *  two-year-old". Kheelu is 3+, and an article about two-year-olds that ends on
   *  a pre-order link and never says so is selling past its own audience.
   *  Flagged by the agency audit 2026-09-05 on the two pieces that do it. */
  ageNote?: string;
  heroAlt?: string;
  paragraphs: { h?: string; p: string }[];
};

const CORE: Story[] = [
  {
    slug: "why-three-to-six-are-the-years-that-matter-most",
    title: "Why the early years matter most",
    description:
      "A short, warm read on the window when a child's brain grows fastest, and what actually fills it.",
    theme: "How children grow",
    author: "Apoorva Sahu",
    minutes: 4,
    pose: "curious",
    tint: "bg-blue/15",
    hero: "/stories/why-three-to-six-are-the-years-that-matter-most.jpg",
    heroAlt:
      "A father with his daughter on his shoulders, both pointing at kites drifting over evening rooftops",
    paragraphs: [
      /* V6 D9b: the author's own observation (not a cited band), aligned to
         KHEELU_AGES; spelling normalized to en-IN. Slug deliberately unchanged. */
      { p: "Somewhere between the second and fifth birthday, your child becomes a person. Not a smaller version of one. The real thing: opinions, jokes, fears, favourite dinosaurs." },
      { p: "The science under that everyday miracle is simple to say and hard to overstate. In these years, a child's brain builds connections faster than it ever will again. What they hear, what they feel, and who they talk to shape everything that follows." },
      { h: "The window is not about flashcards", p: "It is tempting to fill the window with drills and apps, and the toy aisle is glad to help. But brain development toys and worksheets are not what the research keeps pointing at. It keeps pointing at conversation. Back and forth exchanges. Someone who answers the fourth why is the sky blue with the same patience as the first." },
      { p: "Every answered question teaches two things at once: the fact, and the deeper lesson that asking is worth it. Children who keep asking keep learning. That is the whole engine." },
      { h: "Feelings are the fast lane", p: "There is a second finding hiding in the first. Children learn fastest from exchanges that feel good. A child who feels heard stays in the conversation. A child who feels rushed leaves it. Understanding the heart is not the soft part of learning. It is the mechanism." },
      { p: "So the years that matter most do not ask for a classroom at home. They ask for talk. At dinner, in the car, at bedtime, and yes, in play." },
      { p: "That is the belief Kheelu is built on: a talking toy that keeps the conversation going when your hands are full, in the languages you speak at home. If that sounds like your house, you can hold a place in line for a refundable ₹499." },
    ],
  },
  {
    slug: "screen-free-does-not-mean-silent",
    title: "Screen-free does not mean silent",
    description:
      "What a rich, language-filled childhood actually looks like, without a single screen.",
    theme: "Screen-free living",
    author: "Ria Mangala Rewari",
    minutes: 4,
    pose: "silly",
    tint: "bg-yellow/15",
    hero: "/stories/screen-free-does-not-mean-silent.jpg",
    heroAlt:
      "Two children playing inside a blanket fort with steel pots, wooden blocks, and a paper crown",
    paragraphs: [
      { p: "Take the tablet away and the first thing you notice is the noise. Not the TV kind. The good kind: questions, made-up songs, a running commentary on ants." },
      { p: "Parents worry that screen-free means a quieter, duller childhood, and that a child without cartoons is a child missing out. The opposite is closer to the truth. Screens mostly ask children to watch. Language grows when children speak." },
      { h: "The talking house", p: "A language-filled childhood is built from small habits. Narrate what you are cooking. Ask questions with no wrong answers. Let the silly voice read the bedtime story. None of it needs a curriculum. All of it needs another voice in the room." },
      { p: "This is also where interactive toys earn their place, or fail to. A toy that beeps and plays jingles is a screen without the picture. A toy that listens and talks back is something else: another turn in the conversation." },
      { h: "Boredom is not the enemy", p: "One more secret from screen-free homes: a bored child invents. The floor becomes lava. The sofa becomes a ship. Boredom is where imagination clocks in for work." },
      { p: "So screen-free does not mean silent, and it does not mean joyless. It means the sound in your home is your child thinking out loud." },
      { p: `We are building Kheelu for exactly that home: a screen-free friend that listens first and talks back, ready when you need one more voice. If you want one, pre-orders are open, and a refundable ${TOKEN_PRICE} holds your place.` },
    ],
  },
  {
    slug: "how-children-learn-by-talking",
    title: "How children learn by talking",
    description:
      "The back and forth of conversation is the oldest learning technology in the world. Here is how it works.",
    theme: "How children grow",
    author: "Ria Mangala Rewari",
    minutes: 5,
    pose: "joy",
    tint: "bg-orange/15",
    hero: "/stories/how-children-learn-by-talking.jpg",
    heroAlt:
      "A grandmother and two children on a veranda at night, looking up at the full moon together",
    paragraphs: [
      { p: "Watch a child ask why the moon follows the car. Then watch what happens after the answer. The next question is never random. It builds. That building is learning, live and out loud." },
      { p: "Researchers call it serve and return. The child serves a question or an idea. Someone returns it with an answer and a new question. Every loop wires language, logic, and confidence together." },
      { h: "Why talking beats watching", p: "A video can show your child a volcano. But it cannot pause when their eyes go wide, ask what they think happens next, and wait. The waiting matters. Children learn to think in the space a listener gives them." },
      { h: "The mother tongue advantage", p: "The loop works best in the languages you speak at home. A child who can wonder in their own words wonders more. That is why a voice toy for kids should speak your language, not just English." },
      { p: "Vocabulary is the visible result. The invisible one is bigger: a child who expects to be heard. That expectation walks into every classroom with them." },
      { p: "You cannot be available for every loop, and you should not have to be. That is the gap Kheelu lives in: a cognitive development toy that keeps serve and return going, in up to 10 home languages, with you watching the whole exchange in the parent app." },
      { p: "If a house full of good questions sounds right to you, reserve a spot on the list. It is free, and it holds the launch price." },
    ],
  },
  {
    slug: "what-to-look-for-in-a-safe-ai-toy",
    title: "What to look for in a safe AI toy",
    description:
      "A parent's plain-words checklist for judging AI toys, including ours.",
    theme: "Safety",
    author: "Aman Soni",
    minutes: 5,
    pose: "bliss",
    tint: "bg-blue/15",
    hero: "/stories/what-to-look-for-in-a-safe-ai-toy.jpg",
    heroAlt:
      "A mother examines the underside of a small white toy robot by lamp light while her young son sits waiting beside the open box",
    paragraphs: [
      { p: "The first time your child asks a toy a question and the toy answers, your stomach does a small flip. Half wonder, half alarm. Both halves are correct, and the alarm half deserves a checklist. Here is ours, the one we would use on any smart toy, including our own." },
      { h: "One: when is the microphone on?", p: "The only good answer is: when your child invites it. Look for wake-word listening, and an honest explanation of what happens the rest of the time. Off should mean off." },
      { h: "Two: can it reach the open internet?", p: "A toy that can browse can stumble, and so can your child right behind it. A safe AI toy is a closed world: no search, no videos, no strangers." },
      { h: "Three: can you read everything?", p: "You would not leave your child with a babysitter who refuses to tell you what happened all afternoon. The same bar applies to a talking toy. Every conversation should be readable, and deletable, by you." },
      { h: "Four: where does the voice go?", p: "Ask where recordings live, who can see them, and whether they are ever sold. Vague answers are answers." },
      { h: "Five: is it built for your child's age?", p: "A toy sold for small children should filter every response for the age of the child holding it. Age-graded safety is the difference between a children's product and a gadget with a cute shell." },
      { p: "That is the bar we hold Kheelu to: wake-word listening, no open internet, a full conversation log in the parent app, voice data that stays in your region and is never sold, and an age-graded safety layer on every reply." },
      { p: "Hold us to it too. Read the Safety page, ask us the hard questions, and if the answers earn your trust, pre-orders are open." },
    ],
  },
];

import { EXPANSION } from "./stories-expansion";

export const STORIES: Story[] = [...CORE, ...EXPANSION];

export function getStory(slug: string) {
  return STORIES.find((s) => s.slug === slug);
}

/** The journal in reading order: grouped by theme, original order kept inside
 *  each group, themes in the order they first appear. Pure derivation of
 *  STORIES, so adding an article cannot make it drift. */
const BY_THEME: Story[] = (() => {
  const themes = [...new Set(STORIES.map((s) => s.theme))];
  return themes.flatMap((theme) => STORIES.filter((s) => s.theme === theme));
})();

/** The three articles to offer at the foot of a piece.
 *
 *  WHY THIS EXISTS (2026-08-12). Every article was a dead end. Fifteen of the
 *  nineteen had exactly ONE incoming internal link, all of them from /stories,
 *  and no article linked to any other — so crawl equity pooled on Home and
 *  never reached the pages the journal is written to rank. Ahrefs flagged it as
 *  "only one dofollow incoming internal link"; a crawl of the live sitemap
 *  confirmed the shape exactly.
 *
 *  It is a RING over the theme-sorted journal: each article offers the one
 *  before it and the next two after it, wrapping at the ends. That one decision
 *  buys three properties that matter more than they look:
 *
 *  1. **Even coverage, by construction.** If everyone offers three, everyone is
 *     offered by exactly three. No article can be starved, which is the whole
 *     defect. The obvious design — "same theme first, then fill" — was written
 *     first and FAILED here: articles in the four large themes filled all three
 *     slots from their own theme and never reached the fill, so "Safety" and
 *     "Languages at home", which hold one article each, ended up with ZERO
 *     incoming links. The guard in test/internal-links.test.ts caught it.
 *  2. **Theme relevance, without theme prisons.** Neighbours in a theme-sorted
 *     list are nearly always same-theme, so a reader who finished a screen-time
 *     piece is offered more screen-time pieces. Reaching BACKWARDS by one is
 *     what makes that hold at the edges: an article at the end of its theme
 *     group would otherwise look only forwards, into the next theme, and get no
 *     same-theme offer at all. With the backward step, every article in a theme
 *     of two or more always has at least one true neighbour. The crossings that
 *     remain are the feature that stops the journal fragmenting into six
 *     islands a crawler cannot get between.
 *  3. **One connected cycle.** Every article is reachable from every other by
 *     following the block, so a crawler that lands anywhere can walk the lot.
 *
 *  Deliberately no randomness. `Math.random` here would hand a different link
 *  graph to every build, so the internal linking a crawler saw last week would
 *  not be the one it sees today, and the guard could not prove anything. */
export function getRelatedStories(slug: string, count = 3): Story[] {
  const index = BY_THEME.findIndex((s) => s.slug === slug);
  if (index === -1) return [];

  const n = BY_THEME.length;
  const wanted = Math.min(count, n - 1);
  /* One step back, then forward. Every offset is used by every article, so each
     article is offered by exactly `wanted` others: the coverage guarantee is
     arithmetic, not a heuristic that happens to work on today's nineteen. */
  const offsets = [-1, ...Array.from({ length: wanted - 1 }, (_, i) => i + 1)];
  return offsets.slice(0, wanted).map((offset) => BY_THEME[(index + offset + n) % n]);
}
