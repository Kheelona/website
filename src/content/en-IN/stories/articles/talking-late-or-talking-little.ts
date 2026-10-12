import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * Talking late, or talking little?: waits for its rewrite (task 5.18). Card words from the
 * approved hub (stories.html; stories.md fold 3). Related links from the live journal's ring
 * (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the
 * freeze tag).
 */
export const article = stubArticle({
  slug: "talking-late-or-talking-little",
  card: {
    title: "Talking late, or talking little?",
    summary: "A calm guide for parents of quiet 3 and 4 year olds: what varies, what deserves a professional look, and what helps at home.",
  },
  related: ["how-to-get-your-child-talking", "how-children-collect-words", "a-toy-that-talks-vs-a-toy-that-listens"],
  published: "2026-07-28",
  updated: "2026-07-31",
}) satisfies Article;
