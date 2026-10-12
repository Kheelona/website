import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * What India’s data law asks of a toy that listens: waits for its rewrite (task 5.19). Card words
 * from the approved hub (stories.html; stories.md fold 4). Related links from the live journal's
 * ring (getRelatedStories at the freeze tag), except that the ring's
 * talking-late-or-talking-little gives way to screen-time-rules-parents-swear-by, which lost a
 * link when the safe-AI-toy guide took its approved related list. Dates as the live article's
 * (src/lib/stories*.ts at the freeze tag).
 */
export const article = stubArticle({
  slug: "ai-toys-and-indias-data-law",
  card: {
    title: "What India’s data law asks of a toy that listens",
    summary: "India’s data law in plain words: what it asks of a company handling a child’s data, and what you can ask for.",
  },
  related: ["what-to-look-for-in-a-safe-ai-toy", "how-to-get-your-child-talking", "screen-time-rules-parents-swear-by"],
  published: "2026-09-11",
  updated: "2026-09-11",
}) satisfies Article;
