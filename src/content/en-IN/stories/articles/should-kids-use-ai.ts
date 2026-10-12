import type { Article } from "@/content/types";
import { stubArticle } from "./stub";

/**
 * Should kids use AI? An honest answer from people who build it: waits for its rewrite (task
 * 5.19). Card words from the approved hub (stories.html; stories.md fold 4). Related links from
 * the live journal's ring (getRelatedStories at the freeze tag). Dates as the live article's
 * (src/lib/stories*.ts at the freeze tag). The live title is over the 60-character meta limit, so
 * the meta title is its first sentence.
 */
export const article = stubArticle({
  slug: "should-kids-use-ai",
  card: {
    title: "Should kids use AI? An honest answer from people who build it",
    summary: "Where the line sits between AI built for adults and a toy built for young children, and how to judge any toy with AI inside.",
  },
  metaTitle: "Should kids use AI?",
  related: ["raising-a-bilingual-child-in-india", "does-a-three-year-old-need-an-ai-tutor", "questions-parents-ask-about-ai-toys"],
  published: "2026-07-28",
  updated: "2026-09-05",
}) satisfies Article;
