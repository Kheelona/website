import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * Does a three-year-old need an AI tutor?: waits for its rewrite (task 5.19). Card words from the
 * approved hub (stories.html; stories.md fold 4). Related links from the live journal's ring
 * (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the
 * freeze tag).
 */
export const article = stubArticle({
  slug: "does-a-three-year-old-need-an-ai-tutor",
  card: {
    title: "Does a three-year-old need an AI tutor?",
    summary: "Tutoring apps promise homework help. Your child can’t do homework yet. What help at 3 should look like.",
  },
  related: ["should-kids-use-ai", "questions-parents-ask-about-ai-toys", "why-three-to-six-are-the-years-that-matter-most"],
  published: "2026-07-30",
  updated: "2026-09-05",
}) satisfies Article;
