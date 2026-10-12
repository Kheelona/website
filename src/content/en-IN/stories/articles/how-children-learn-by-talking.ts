import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * How children learn by talking: waits for its rewrite (task 5.18). Card words from the approved
 * hub (stories.html; stories.md fold 3). Related links from the live journal's ring
 * (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the
 * freeze tag).
 */
export const article = stubArticle({
  slug: "how-children-learn-by-talking",
  card: {
    title: "How children learn by talking",
    summary: "Serve and return, the back-and-forth between a young child and a caring adult, and how it looks at home.",
  },
  related: ["why-three-to-six-are-the-years-that-matter-most", "what-actually-builds-a-sharp-brain", "learning-toys-for-a-three-year-old"],
  published: "2026-07-28",
  updated: "2026-09-05",
}) satisfies Article;
