import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * The gentle way off the phone: a seven-day plan: waits for its rewrite (task 5.17). Card words
 * from the approved hub (stories.html; stories.md fold 2). Related links from the live journal's
 * ring (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at
 * the freeze tag).
 */
export const article = stubArticle({
  slug: "the-gentle-way-off-the-phone",
  card: {
    title: "The gentle way off the phone: a seven-day plan",
    summary: "A week-long plan to cut a young child’s screen time without turning your home into a battlefield.",
  },
  related: ["screen-time-and-tantrums", "busy-hands-no-screens", "screen-time-rules-parents-swear-by"],
  published: "2026-07-28",
  updated: "2026-07-31",
}) satisfies Article;
