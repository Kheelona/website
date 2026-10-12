import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * Screen time and tantrums: what is actually happening: waits for its rewrite (task 5.17). Card
 * words from the approved hub (stories.html; stories.md fold 2). Related links from the live
 * journal's ring (getRelatedStories at the freeze tag). Dates as the live article's
 * (src/lib/stories*.ts at the freeze tag).
 */
export const article = stubArticle({
  slug: "screen-time-and-tantrums",
  card: {
    title: "Screen time and tantrums: what is actually happening",
    summary: "Why the meltdown lands the moment the screen goes off, and how to make switching off boring instead of explosive.",
  },
  related: ["how-much-screen-time-for-a-3-to-6-year-old", "the-gentle-way-off-the-phone", "busy-hands-no-screens"],
  published: "2026-07-28",
  updated: "2026-07-31",
}) satisfies Article;
