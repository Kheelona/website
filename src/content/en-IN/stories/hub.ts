import type { ArticleSlug } from "../routes";
import type { TopicId } from "./topics";

/**
 * The stories hub as slug lists only (architecture §6.1; mockup stories.html folds 2-5; stories.md
 * "Folds 2 to 5"): which guide each topic features and which it lists, in the approved order.
 * Titles, summaries, read times and photos are read from each article's own module, so rewriting
 * an article never edits this file. Topics and their words are topics.ts.
 */
export interface HubTopic {
  readonly topic: TopicId;
  /** The rewritten guide shown as a card with its photo; a topic with none leaves it out. */
  readonly featured?: ArticleSlug;
  /** The other guides, in the hub's order. */
  readonly slugs: readonly ArticleSlug[];
}

export const hubTopics: readonly HubTopic[] = [
  {
    topic: "screen-time",
    slugs: [
      "how-much-screen-time-for-a-3-to-6-year-old",
      "screen-time-rules-parents-swear-by",
      "screen-time-and-tantrums",
      "the-gentle-way-off-the-phone",
      "busy-hands-no-screens",
      "screen-free-does-not-mean-silent",
    ],
  },
  {
    topic: "talking",
    featured: "talking-toys-and-late-talkers",
    slugs: [
      "talking-late-or-talking-little",
      "how-to-get-your-child-talking",
      "how-children-learn-by-talking",
      "how-children-collect-words",
      "raising-a-bilingual-child-in-india",
      "a-toy-that-talks-vs-a-toy-that-listens",
    ],
  },
  {
    topic: "ai-and-safety",
    featured: "what-to-look-for-in-a-safe-ai-toy",
    slugs: [
      "questions-parents-ask-about-ai-toys",
      "should-kids-use-ai",
      "ai-toys-and-indias-data-law",
      "does-a-three-year-old-need-an-ai-tutor",
    ],
  },
  {
    topic: "learning",
    featured: "learning-toys-for-a-three-year-old",
    slugs: ["what-actually-builds-a-sharp-brain", "why-three-to-six-are-the-years-that-matter-most"],
  },
];
