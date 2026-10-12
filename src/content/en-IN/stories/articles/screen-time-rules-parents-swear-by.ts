import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * The 3-6-9-12 rule, and other screen rules parents swear by: waits for its rewrite (task 5.17).
 * Card words from the approved hub (stories.html; stories.md fold 2). Related links from the live
 * journal's ring (getRelatedStories at the freeze tag). Dates as the live article's
 * (src/lib/stories*.ts at the freeze tag).
 */
export const article = stubArticle({
  slug: "screen-time-rules-parents-swear-by",
  card: {
    title: "The 3-6-9-12 rule, and other screen rules parents swear by",
    summary: "Where the 3-6-9-12 rule comes from, whether it holds up, and what the WHO, the IAP and the AAP say.",
  },
  related: ["busy-hands-no-screens", "what-to-look-for-in-a-safe-ai-toy", "ai-toys-and-indias-data-law"],
  published: "2026-07-30",
  updated: "2026-09-05",
}) satisfies Article;
