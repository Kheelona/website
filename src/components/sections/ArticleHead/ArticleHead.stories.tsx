import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import planetBook from "@ds/assets/Photo library/kabir-04-planet-book-web.webp";
import drawingAtHome from "@ds/assets/Photo library/myra-04-drawing-at-home-web.webp";
import eveningWithAmma from "@ds/assets/Photo library/tara-02-evening-with-amma-web.webp";
import type { ArticleHeadConfig } from "./article-head.types";
import { ArticleHead } from "./ArticleHead";

/* ArticleHead (task 3.4): the article mockups' fold 1 (story-*.html): crumbs, the h1 and its lead, the byline, the
 * photo. The heads are the approved copy, story and test data only (exported in capitals, left out of the story list).
 * The template (task 4.2) builds the same props from the article module and the hub's topic. */

const LABELS = { breadcrumb: "Breadcrumb", published: "First published" } as const;
const hub = { name: "Stories", path: "/stories" } as const;

/** story-learning-toys-for-a-three-year-old.html fold 1: a 4:5 photo beside the wider words. */
export const LEARNING_TOYS_HEAD: ArticleHeadConfig = {
  head: {
    title: "Learning toys for a {nowrap:3-year-old,} {hand:skill by skill}",
    lead: "What a {nowrap:3-year-old} is working on, and which kinds of toys serve each part of it, without the word “educational” doing all the work.",
    author: "The Kheelona team",
    image: {
      src: drawingAtHome,
      alt: "A little girl in a red polka-dot frock, tongue out in concentration, scribbling with an orange crayon at a low table.",
    },
  },
  published: "2026-09-11",
  trail: [hub, { name: "Learning and play", path: "/stories#learning" }],
  labels: { ...LABELS, readTime: "4 min read" },
};

/** story-what-to-look-for-in-a-safe-ai-toy.html fold 1: a 16:9 photo, two even columns. */
export const SAFE_AI_TOY_HEAD: ArticleHeadConfig = {
  head: {
    title: "What to {hand:look for} in a safe AI toy",
    lead: "What child-safety groups say about AI toys, the checks to make before one comes home, and how Kheelu measures up.",
    author: "Aman Soni",
    image: {
      src: eveningWithAmma,
      alt: "A laughing girl holds Kheelu on the sofa while her mother, a steel tumbler in one hand and a phone in the other, laughs with her.",
    },
  },
  published: "2026-07-28",
  trail: [hub, { name: "AI toys and safety", path: "/stories#ai-and-safety" }],
  labels: { ...LABELS, readTime: "5 min read" },
};

/** story-talking-toys-and-late-talkers.html fold 1. */
export const LATE_TALKERS_HEAD: ArticleHeadConfig = {
  head: {
    title: "Late talker? What helps a child {hand:find their words}",
    lead: "What helps a 3 to 7 year old who talks later or less than others, and when to ask your child’s doctor.",
    author: "The Kheelona team",
    image: {
      src: planetBook,
      alt: "A boy in round glasses and a mustard T-shirt lies on a striped rug, chin in his hands, wide-eyed over a picture book about planets.",
    },
  },
  published: "2026-07-30",
  trail: [hub, { name: "Talking and language", path: "/stories#talking" }],
  labels: { ...LABELS, readTime: "3 min read" },
};

const meta = {
  title: "Sections/ArticleHead",
  component: ArticleHead,
  excludeStories: /^[A-Z0-9_]+$/,
  args: LEARNING_TOYS_HEAD,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ArticleHead>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A portrait photo: the words take the wider column, the photo stays inside a laptop screen. */
export const PortraitPhoto: Story = {};

/** A wide photo: two even columns, centred. */
export const WidePhoto: Story = { args: SAFE_AI_TOY_HEAD };

/** The late-talker head. */
export const LateTalkers: Story = { args: LATE_TALKERS_HEAD };

/** An article waiting for its rewrite: no photo, no read time, the words alone. */
export const NoPhoto: Story = {
  args: {
    head: { title: "Busy hands, no screens", author: "The Kheelona team" },
    published: "2025-11-02",
    trail: [hub, { name: "Screen time", path: "/stories#screen-time" }],
    labels: LABELS,
  },
};
