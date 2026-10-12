import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * Screen-free does not mean silent: waits for its rewrite (task 5.17). Card words from the
 * approved hub (stories.html; stories.md fold 2). Related links from the live journal's ring
 * (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the
 * freeze tag).
 */
export const article = stubArticle({
  slug: "screen-free-does-not-mean-silent",
  card: {
    title: "Screen-free does not mean silent",
    summary: "What a childhood full of talk looks like, without a single screen.",
  },
  related: ["learning-toys-for-a-three-year-old", "how-much-screen-time-for-a-3-to-6-year-old", "screen-time-and-tantrums"],
  published: "2026-07-28",
  updated: "2026-09-05",
}) satisfies Article;
