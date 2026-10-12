import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * How to get your child talking: waits for its rewrite (task 5.18). Card words from the approved
 * hub (stories.html; stories.md fold 3). Related links from the live journal's ring
 * (getRelatedStories at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the
 * freeze tag).
 */
export const article = stubArticle({
  slug: "how-to-get-your-child-talking",
  card: {
    title: "How to get your child talking",
    summary: "Better questions than “How was school?”, and the small habits that turn one-word answers into conversations.",
  },
  related: ["ai-toys-and-indias-data-law", "talking-late-or-talking-little", "how-children-collect-words"],
  published: "2026-07-28",
  updated: "2026-09-05",
}) satisfies Article;
