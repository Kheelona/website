import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * How children collect words: waits for its rewrite (task 5.18). Card words from the approved hub
 * (stories.html; stories.md fold 3). Related links from the live journal's ring (getRelatedStories
 * at the freeze tag). Dates as the live article's (src/lib/stories*.ts at the freeze tag).
 */
export const article = stubArticle({
  slug: "how-children-collect-words",
  card: {
    title: "How children collect words",
    summary: "How children pick up words at home, in every language you speak, without a single worksheet.",
  },
  related: ["talking-late-or-talking-little", "a-toy-that-talks-vs-a-toy-that-listens", "talking-toys-and-late-talkers"],
  published: "2026-07-28",
  updated: "2026-07-31",
}) satisfies Article;
