/// <reference types="next/image-types/global" />
import drawingAtHome from "@ds/assets/Photo library/myra-04-drawing-at-home-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";
import { ARTICLE_PORT_PENDING } from "./stub";

/**
 * Learning toys for a 3-year-old, skill by skill: rewritten and approved (mockup
 * story-learning-toys-for-a-three-year-old.html; copy page of the same name). Head, byline, photo,
 * related guides and close as the mockup shows them; card words as the hub's (stories.md fold 5).
 * Its body, answer and sources are ported from the mockup by task 5.6 (the merged 2-year-old topic
 * is its #brain-development part, D041), which also stores the new `updated` date then.
 */
export const article = {
  slug: "learning-toys-for-a-three-year-old",
  meta: {
    title: "Learning toys for a 3-year-old, skill by skill · Kheelona",
    description:
      "Learning toys for a 3-year-old, skill by skill: language, turn-taking, pretend play, hands and numbers, plus what the WHO and IAP say about screens.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Learning toys for a 3-year-old, skill by skill",
    summary: "What a 3-year-old is working on, and which kinds of toys serve each part of it.",
  },
  related: ["what-actually-builds-a-sharp-brain", "a-toy-that-talks-vs-a-toy-that-listens", "how-much-screen-time-for-a-3-to-6-year-old"],
  published: "2026-09-11",
  updated: "2026-09-11",
  head: {
    title: "Learning toys for a {nowrap:3-year-old,} {hand:skill by skill}",
    lead: "What a {nowrap:3-year-old} is working on, and which kinds of toys serve each part of it, without the word “educational” doing all the work.",
    author: TEAM_BYLINE,
    readMinutes: 4,
    image: {
      src: drawingAtHome,
      alt: "A little girl in a red polka-dot frock, tongue out in concentration, scribbling with an orange crayon at a low table.",
    },
  },
  body: [{ kind: "part", blocks: [{ kind: "p", text: ARTICLE_PORT_PENDING }] }],
  sources: [],
  close: "journal",
} satisfies Article;
