import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * What actually builds a sharp brain in the early years: waits for its rewrite (task 5.19). Card
 * words from the approved hub (stories.html; stories.md fold 5). Related links from the live
 * journal's ring (getRelatedStories at the freeze tag). Dates as the live article's
 * (src/lib/stories*.ts at the freeze tag).
 */
export const article = stubArticle({
  slug: "what-actually-builds-a-sharp-brain",
  card: {
    title: "What actually builds a sharp brain in the early years",
    summary: "Past the flashcards: the everyday things research points to, and how to get more of them at home.",
  },
  related: ["how-children-learn-by-talking", "learning-toys-for-a-three-year-old", "screen-free-does-not-mean-silent"],
  published: "2026-07-28",
  updated: "2026-07-31",
}) satisfies Article;
