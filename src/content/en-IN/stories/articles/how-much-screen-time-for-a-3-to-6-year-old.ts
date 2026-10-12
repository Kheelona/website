import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * How much screen time is okay for a young child?: waits for its rewrite (task 5.17). Card words
 * from the approved hub (stories.html; stories.md fold 2). Related links from the live journal's
 * ring (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at
 * the freeze tag).
 */
export const article = stubArticle({
  slug: "how-much-screen-time-for-a-3-to-6-year-old",
  card: {
    title: "How much screen time is okay for a young child?",
    summary: "What the WHO, the Indian Academy of Pediatrics and the AAP say, age by age, and what to do at 6 pm.",
  },
  related: ["screen-free-does-not-mean-silent", "screen-time-and-tantrums", "the-gentle-way-off-the-phone"],
  published: "2026-07-28",
  updated: "2026-09-05",
}) satisfies Article;
