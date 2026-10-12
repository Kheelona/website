import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * Why the early years matter most: waits for its rewrite (task 5.19). Card words from the approved
 * hub (stories.html; stories.md fold 5). Related links from the live journal's ring
 * (getRelatedStories at the freeze tag), except that the ring's
 * questions-parents-ask-about-ai-toys gives way to screen-free-does-not-mean-silent, which lost a
 * link when the learning-toys guide took its approved related list. Dates as the live article's
 * (src/lib/stories*.ts at the freeze tag).
 */
export const article = stubArticle({
  slug: "why-three-to-six-are-the-years-that-matter-most",
  card: {
    title: "Why the early years matter most",
    summary: "What the early years are for, and the ordinary things that fill them well: talk, play and sleep.",
  },
  related: ["screen-free-does-not-mean-silent", "how-children-learn-by-talking", "what-actually-builds-a-sharp-brain"],
  published: "2026-07-28",
  updated: "2026-09-05",
}) satisfies Article;
