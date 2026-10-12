import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * A toy that talks is not a toy that listens: waits for its rewrite (task 5.18). Card words from
 * the approved hub (stories.html; stories.md fold 3). Related links from the live journal's ring
 * (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the
 * freeze tag).
 */
export const article = stubArticle({
  slug: "a-toy-that-talks-vs-a-toy-that-listens",
  card: {
    title: "A toy that talks is not a toy that listens",
    summary: "Why a toy that repeats your child is a mirror, and how screens, speakers and talking toys compare.",
  },
  related: ["how-children-collect-words", "talking-toys-and-late-talkers", "raising-a-bilingual-child-in-india"],
  published: "2026-07-30",
  updated: "2026-09-05",
}) satisfies Article;
