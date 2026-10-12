/// <reference types="next/image-types/global" />
import planetBook from "@ds/assets/Photo library/kabir-04-planet-book-web.webp";
import type { Article } from "@/content/types";
import { DEFAULT_OG, TEAM_BYLINE } from "../../organization";
import { ARTICLE_PORT_PENDING } from "./stub";

/**
 * Late talker? What helps a child find their words: rewritten and approved (mockup
 * story-talking-toys-and-late-talkers.html; copy page of the same name). Head, byline, photo,
 * related guides and the keep-reading close (no pre-order button on this page, B5) as the mockup
 * shows them; card words as the hub's (stories.md fold 3). Its body, answer (with the D025
 * disclaimer) and sources are ported from the mockup by task 5.6, which also stores the new
 * `updated` date then.
 */
export const article = {
  slug: "talking-toys-and-late-talkers",
  meta: {
    title: "Late talker? What helps a child find their words · Kheelona",
    description:
      "Late talker at 3 or older? What helps at home, what the research says about back-and-forth talk, and when to ask your child's doctor.",
    og: DEFAULT_OG,
  },
  card: {
    title: "Late talker? What helps a child find their words",
    summary: "What helps a 3 to 7 year old who talks later or less than others, and when to ask your child’s doctor.",
  },
  related: ["talking-late-or-talking-little", "how-to-get-your-child-talking", "raising-a-bilingual-child-in-india"],
  published: "2026-07-30",
  updated: "2026-09-05",
  head: {
    title: "Late talker? What helps a child {hand:find their words}",
    lead: "What helps a 3 to 7 year old who talks later or less than others, and when to ask your child’s doctor.",
    author: TEAM_BYLINE,
    readMinutes: 3,
    image: {
      src: planetBook,
      alt: "A boy in round glasses and a mustard T-shirt lies on a striped rug, chin in his hands, wide-eyed over a picture book about planets.",
    },
  },
  body: [{ kind: "part", blocks: [{ kind: "p", text: ARTICLE_PORT_PENDING }] }],
  sources: [],
  close: "keep",
} satisfies Article;
