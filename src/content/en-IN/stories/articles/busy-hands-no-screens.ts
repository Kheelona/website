import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * Busy hands, no screens: waits for its rewrite (task 5.17). Card words from the approved hub
 * (stories.html; stories.md fold 2). Related links from the live journal's ring (getRelatedStories
 * at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the freeze tag).
 */
export const article = stubArticle({
  slug: "busy-hands-no-screens",
  card: {
    title: "Busy hands, no screens",
    summary: "Screen-free ways to keep a young child busy at home, including on the days you have to work.",
  },
  related: ["the-gentle-way-off-the-phone", "screen-time-rules-parents-swear-by", "what-to-look-for-in-a-safe-ai-toy"],
  published: "2026-07-28",
  updated: "2026-07-31",
}) satisfies Article;
