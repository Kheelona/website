import type { Answer } from "@/content/types";

/**
 * AnswerSection's configuration: the content's answer-first block (`Answer`, src/content/types.ts; architecture
 * §9.5), so test/guards/answer-length.test.ts holds its answer to 40-60 words wherever content sets one, and where it
 * sits:
 * - `article`: the tinted card first in an article's reading column (story-*.html fold 2), with optional detail
 *   blocks under the answer (paragraphs, the D025 line);
 * - `team`: the team page's own band, the question beside the answer from 900 px (team.html fold 2); one paragraph.
 */
export type AnswerSectionConfig = Answer & {
  /** The heading's id, which names the block: "answer-title" (articles) and "who-title" (team) by default. */
  readonly id?: string;
} & ({ readonly variant: "article" } | { readonly variant: "team"; readonly detail?: never });
