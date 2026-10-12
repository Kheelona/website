import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * The hard questions parents ask about AI toys: waits for its rewrite (task 5.19). Card words from
 * the approved hub (stories.html; stories.md fold 4). Related links from the live journal's ring
 * (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the
 * freeze tag).
 */
export const article = stubArticle({
  slug: "questions-parents-ask-about-ai-toys",
  card: {
    title: "The hard questions parents ask about AI toys",
    summary: "The questions parents ask before buying a talking toy, answered straight, including the uncomfortable ones.",
  },
  related: ["does-a-three-year-old-need-an-ai-tutor", "why-three-to-six-are-the-years-that-matter-most", "how-children-learn-by-talking"],
  published: "2026-09-11",
  updated: "2026-09-11",
}) satisfies Article;
