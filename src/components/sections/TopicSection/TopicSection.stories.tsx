import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import planetBook from "@ds/assets/Photo library/kabir-04-planet-book-web.webp";
import drawingAtHome from "@ds/assets/Photo library/myra-04-drawing-at-home-web.webp";
import eveningWithAmma from "@ds/assets/Photo library/tara-02-evening-with-amma-web.webp";
import type { TopicSectionConfig } from "./topic-section.types";
import { TopicSection } from "./TopicSection";

/* TopicSection (task 3.4): one topic band of the stories hub (stories.html folds 2-5). The topics, cards and rows are
 * the approved copy, story and test data only (exported in capitals, left out of the story list); the hub page (task
 * 5.5) builds the same props from topics.ts, hub.ts and each article's own module. The guides not yet rewritten are
 * quiet rows that link nowhere, as approved. */

/** stories.html fold 2: no rewritten guide yet, so the rows run in two columns. Without the 3-6-9-12 guide's row, which
 *  left the journal after Gate A (D053, deviations.md V9; task 6.5), as the hub shows it. */
export const SCREEN_TIME_TOPIC: TopicSectionConfig = {
  topic: { id: "screen-time", title: "Screen time", lead: "How much, what the guidelines say, and what to do when the screen goes off." },
  items: [
    { title: "How much screen time is okay for a young child?", summary: "What the WHO, the Indian Academy of Pediatrics and the AAP say, age by age, and what to do at 6 pm." },
    { title: "Screen time and tantrums: what is actually happening", summary: "Why the meltdown lands the moment the screen goes off, and how to make switching off boring instead of explosive." },
    { title: "The gentle way off the phone: a seven-day plan", summary: "A week-long plan to cut a young child’s screen time without turning your home into a battlefield." },
    { title: "Busy hands, no screens", summary: "Screen-free ways to keep a young child busy at home, including on the days you have to work." },
    { title: "Screen-free does not mean silent", summary: "What a childhood full of talk looks like, without a single screen." },
  ],
};

/** stories.html fold 3: the rewritten guide as a card with its photo, then the rows. */
export const TALKING_TOPIC: TopicSectionConfig = {
  topic: { id: "talking", title: "Talking and language", lead: "Getting your child talking, late talkers, new words and two languages at home." },
  band: true,
  featured: {
    title: "Late talker? What helps a child find their words",
    summary: "What helps a 3 to 7 year old who talks later or less than others, and when to ask your child’s doctor.",
    href: "/stories/talking-toys-and-late-talkers",
    linkLabel: "Read the guide · 3 min read",
    image: {
      src: planetBook,
      alt: "A boy in round glasses and a mustard T-shirt lies on a striped rug, chin in his hands, wide-eyed over a picture book about planets.",
    },
  },
  items: [
    { title: "Talking late, or talking little?", summary: "A calm guide for parents of quiet 3 and 4 year olds: what varies, what deserves a professional look, and what helps at home." },
    { title: "How to get your child talking", summary: "Better questions than “How was school?”, and the small habits that turn one-word answers into conversations." },
    { title: "How children learn by talking", summary: "Serve and return, the back-and-forth between a young child and a caring adult, and how it looks at home." },
    { title: "How children collect words", summary: "How children pick up words at home, in every language you speak, without a single worksheet." },
    { title: "Raising a bilingual child in India", summary: "Does a bilingual home confuse a young child? What the research says, and what keeps a home language alive." },
    { title: "A toy that talks is not a toy that listens", summary: "Why a toy that repeats your child is a mirror, and how screens, speakers and talking toys compare." },
  ],
};

/** stories.html fold 4. */
export const AI_AND_SAFETY_TOPIC: TopicSectionConfig = {
  topic: { id: "ai-and-safety", title: "AI toys and safety", lead: "What to check before an AI toy comes home, and what the law asks of the company behind it." },
  featured: {
    title: "What to look for in a safe AI toy",
    summary: "What child-safety groups say about AI toys, the checks to make before one comes home, and how Kheelu measures up.",
    href: "/stories/what-to-look-for-in-a-safe-ai-toy",
    linkLabel: "Read the guide · 5 min read",
    image: {
      src: eveningWithAmma,
      alt: "A laughing girl holds Kheelu on the sofa while her mother, a steel tumbler in one hand and a phone in the other, laughs with her.",
    },
  },
  items: [
    { title: "The hard questions parents ask about AI toys", summary: "The questions parents ask before buying a talking toy, answered straight, including the uncomfortable ones." },
    {
      title: "Should kids use AI? An honest answer from people who build it",
      summary: "Where the line sits between AI built for adults and a toy built for young children, and how to judge any toy with AI inside.",
    },
    { title: "What India’s data law asks of a toy that listens", summary: "India’s data law in plain words: what it asks of a company handling a child’s data, and what you can ask for." },
    { title: "Does a three-year-old need an AI tutor?", summary: "Tutoring apps promise homework help. Your child can’t do homework yet. What help at 3 should look like." },
  ],
};

/** stories.html fold 5: a portrait photo in the 16:9 card frame, cropped to keep the child's face and hand in view. */
export const LEARNING_TOPIC: TopicSectionConfig = {
  topic: { id: "learning", title: "Learning and play", lead: "What a young child is working on, and the toys and habits that serve it." },
  band: true,
  featured: {
    title: "Learning toys for a 3-year-old, skill by skill",
    summary: "What a 3-year-old is working on, and which kinds of toys serve each part of it.",
    href: "/stories/learning-toys-for-a-three-year-old",
    linkLabel: "Read the guide · 4 min read",
    image: {
      src: drawingAtHome,
      alt: "A little girl in a red polka-dot frock, tongue out in concentration, scribbling with an orange crayon at a low table.",
    },
  },
  items: [
    { title: "What actually builds a sharp brain in the early years", summary: "Past the flashcards: the everyday things research points to, and how to get more of them at home." },
    { title: "Why the early years matter most", summary: "What the early years are for, and the ordinary things that fill them well: talk, play and sleep." },
  ],
};

const meta = {
  title: "Sections/TopicSection",
  component: TopicSection,
  excludeStories: /^[A-Z0-9_]+$/,
  args: TALKING_TOPIC,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopicSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Story args merge over the meta's, so each story states band and featured itself. */

/** A topic with its rewritten guide: the card (one tap) beside the rows from 900 px, on the band. */
export const WithGuide: Story = {};

/** A topic with no rewritten guide yet: the rows in two columns from 900 px, on the page surface. */
export const RowsOnly: Story = { args: { ...SCREEN_TIME_TOPIC, featured: undefined, band: false } };

/** A wide photo on the page surface. */
export const AiAndSafety: Story = { args: { ...AI_AND_SAFETY_TOPIC, band: false } };

/** A portrait photo in the card's 16:9 frame. */
export const PortraitPhoto: Story = { args: LEARNING_TOPIC };

/** Rows that link, once their guides are rewritten. */
export const LinkedRows: Story = {
  args: {
    ...SCREEN_TIME_TOPIC,
    featured: undefined,
    band: false,
    items: SCREEN_TIME_TOPIC.items.map((item) => ({ ...item, href: "/stories/busy-hands-no-screens" })),
  },
};
