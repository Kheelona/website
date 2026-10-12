/// <reference types="next/image-types/global" />
import eveningWithAmma from "@ds/assets/Photo library/tara-02-evening-with-amma-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG } from "../../organization";
import { ARTICLE_PORT_PENDING } from "./stub";

/**
 * What to look for in a safe AI toy: rewritten and approved (mockup
 * story-what-to-look-for-in-a-safe-ai-toy.html; copy page of the same name). Head, byline (its
 * author is named on /team), photo, related guides and close as the mockup shows them; card words
 * as the hub's (stories.md fold 4). Its body, answer and sources are ported from the mockup by
 * task 5.6, which also stores the new `updated` date then.
 */
export const article = {
  slug: "what-to-look-for-in-a-safe-ai-toy",
  meta: {
    title: "What to look for in a safe AI toy · Kheelona",
    description:
      "What to look for in a safe AI toy: what Common Sense Media and Fairplay advise, the checks to make before one comes home, and how Kheelu measures up.",
    og: DEFAULT_OG,
  },
  card: {
    title: "What to look for in a safe AI toy",
    summary: "What child-safety groups say about AI toys, the checks to make before one comes home, and how Kheelu measures up.",
  },
  related: ["questions-parents-ask-about-ai-toys", "should-kids-use-ai", "ai-toys-and-indias-data-law"],
  published: "2026-07-28",
  updated: "2026-09-05",
  head: {
    title: "What to {hand:look for} in a safe AI toy",
    lead: "What child-safety groups say about AI toys, the checks to make before one comes home, and how Kheelu measures up.",
    author: "Aman Soni",
    readMinutes: 5,
    image: {
      src: eveningWithAmma,
      alt: "A laughing girl holds Kheelu on the sofa while her mother, a steel tumbler in one hand and a phone in the other, laughs with her.",
    },
  },
  body: [{ kind: "part", blocks: [{ kind: "p", text: ARTICLE_PORT_PENDING }] }],
  sources: [],
  close: "journal",
} satisfies Article;
