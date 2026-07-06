/** The journal (prompt §5.2 Stories): useful before we sell. Four seed pieces,
 *  keyword-mapped, voice-linted, each ending on a soft invite (never a hard sell). */

export type Story = {
  slug: string;
  title: string;
  description: string;
  theme: string;
  minutes: number;
  pose: "curious" | "silly" | "joy" | "bliss" | "grumpy" | "sad";
  tint: string;
  /** optional illustrated header, path under /public */
  hero?: string;
  heroAlt?: string;
  paragraphs: { h?: string; p: string }[];
};

const CORE: Story[] = [
  {
    slug: "why-three-to-six-are-the-years-that-matter-most",
    title: "Why three to six are the years that matter most",
    description:
      "A short, warm read on the window when a child's brain grows fastest, and what actually fills it.",
    theme: "How children grow",
    minutes: 4,
    pose: "curious",
    tint: "bg-blue/15",
    hero: "/stories/why-three-to-six-are-the-years-that-matter-most.jpg",
    heroAlt:
      "A father with his daughter on his shoulders, both pointing at kites drifting over evening rooftops",
    paragraphs: [
      { p: "Somewhere between the third and sixth birthday, your child becomes a person. Not a smaller version of one. The real thing: opinions, jokes, fears, favorite dinosaurs." },
      { p: "The science under that everyday miracle is simple to say and hard to overstate. In these years, a child's brain builds connections faster than it ever will again. What they hear, what they feel, and who they talk to shape everything that follows." },
      { h: "The window is not about flashcards", p: "It is tempting to fill the window with drills and apps, and the toy aisle is glad to help. But brain development toys and worksheets are not what the research keeps pointing at. It keeps pointing at conversation. Back and forth exchanges. Someone who answers the fourth why is the sky blue with the same patience as the first." },
      { p: "Every answered question teaches two things at once: the fact, and the deeper lesson that asking is worth it. Children who keep asking keep learning. That is the whole engine." },
      { h: "Feelings are the fast lane", p: "There is a second finding hiding in the first. Children learn fastest from exchanges that feel good. A child who feels heard stays in the conversation. A child who feels rushed leaves it. Understanding the heart is not the soft part of learning. It is the mechanism." },
      { p: "So the years that matter most do not ask for a classroom at home. They ask for talk. At dinner, in the car, at bedtime, and yes, in play." },
      { p: "That is the belief Lumi is built on: a talking toy that keeps the conversation going when your hands are full, in the languages you speak at home. If that sounds like your house, you can hold a place in line. No payment, no pressure." },
    ],
  },
  {
    slug: "screen-free-does-not-mean-silent",
    title: "Screen-free does not mean silent",
    description:
      "What a rich, language-filled childhood actually looks like, without a single screen.",
    theme: "Screen-free living",
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
      { p: "We are building Lumi for exactly that home: a screen-free friend that listens first and talks back, ready when you need one more voice. If you want one, the pre-order list is open, and joining costs nothing." },
    ],
  },
  {
    slug: "how-children-learn-by-talking",
    title: "How children learn by talking",
    description:
      "The back and forth of conversation is the oldest learning technology in the world. Here is how it works.",
    theme: "How children grow",
    minutes: 5,
    pose: "joy",
    tint: "bg-teal/15",
    hero: "/stories/how-children-learn-by-talking.jpg",
    heroAlt:
      "A grandmother and two children on a veranda at night, looking up at the full moon together",
    paragraphs: [
      { p: "Watch a child ask why the moon follows the car. Then watch what happens after the answer. The next question is never random. It builds. That building is learning, live and out loud." },
      { p: "Researchers call it serve and return. The child serves a question or an idea. Someone returns it with an answer and a new question. Every loop wires language, logic, and confidence together." },
      { h: "Why talking beats watching", p: "A video can show your child a volcano. But it cannot pause when their eyes go wide, ask what they think happens next, and wait. The waiting matters. Children learn to think in the space a listener gives them." },
      { h: "The mother tongue advantage", p: "The loop works best in the languages you speak at home. A child who can wonder in their own words wonders more. That is why a voice toy for kids should speak your language, not just English." },
      { p: "Vocabulary is the visible result. The invisible one is bigger: a child who expects to be heard. That expectation walks into every classroom with them." },
      { p: "You cannot be available for every loop, and you should not have to be. That is the gap Lumi lives in: a cognitive development toy that keeps serve and return going, in 10 home languages, with you watching the whole exchange in the parent app." },
      { p: "If a house full of good questions sounds right to you, reserve a spot on the list. It is free, and it holds the launch price." },
    ],
  },
  {
    slug: "what-to-look-for-in-a-safe-ai-toy",
    title: "What to look for in a safe AI toy",
    description:
      "A parent's plain-words checklist for judging AI toys, including ours.",
    theme: "Safety",
    minutes: 5,
    pose: "bliss",
    tint: "bg-purple/15",
    paragraphs: [
      { p: "The first time your child asks a toy a question and the toy answers, your stomach does a small flip. Half wonder, half alarm. Both halves are correct, and the alarm half deserves a checklist. Here is ours, the one we would use on any smart toy, including our own." },
      { h: "One: when is the microphone on?", p: "The only good answer is: when your child invites it. Look for wake-word listening, and an honest explanation of what happens the rest of the time. Off should mean off." },
      { h: "Two: can it reach the open internet?", p: "A toy that can browse can stumble, and so can your child right behind it. A safe AI toy is a closed world: no search, no videos, no strangers." },
      { h: "Three: can you read everything?", p: "You would not leave your child with a babysitter who refuses to tell you what happened all afternoon. The same bar applies to a talking toy. Every conversation should be readable, and deletable, by you." },
      { h: "Four: where does the voice go?", p: "Ask where recordings live, who can see them, and whether they are ever sold. Vague answers are answers." },
      { h: "Five: is it built for your child's age?", p: "A toy for ages 3 to 6 should filter every response for ages 3 to 6. Age-graded safety is the difference between a children's product and a gadget with a cute shell." },
      { p: "That is the bar we hold Lumi to: wake-word listening, no open internet, a full conversation log in the parent app, voice data that stays in your region and is never sold, and an age-graded safety layer on every reply." },
      { p: "Hold us to it too. Read the Safety page, ask us the hard questions, and if the answers earn your trust, the pre-order list is open." },
    ],
  },
];

import { EXPANSION } from "./stories-expansion";

export const STORIES: Story[] = [...CORE, ...EXPANSION];

export function getStory(slug: string) {
  return STORIES.find((s) => s.slug === slug);
}
