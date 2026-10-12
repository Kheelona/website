import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * Raising a bilingual child in India: waits for its rewrite (task 5.18). Card words from the
 * approved hub (stories.html; stories.md fold 3). Related links from the live journal's ring
 * (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the
 * freeze tag).
 */
export const article = stubArticle({
  slug: "raising-a-bilingual-child-in-india",
  card: {
    title: "Raising a bilingual child in India",
    summary: "Does a bilingual home confuse a young child? What the research says, and what keeps a home language alive.",
  },
  related: ["talking-toys-and-late-talkers", "should-kids-use-ai", "does-a-three-year-old-need-an-ai-tutor"],
  published: "2026-07-28",
  updated: "2026-09-05",
}) satisfies Article;
