import type { Source } from "@/content/types";

/**
 * SourcesSection's configuration: a page's numbered sources (`Source`, src/content/types.ts; D026), source n answering
 * the `[^n]` markers in its text, and where they sit:
 * - `article`: the notes at the foot of an article's reading column under their own subtitle (story-*.html), each
 *   address printed in full;
 * - `inline`: the buyer's guide's captions under its questions (ai-toys-for-kids-in-india.html fold 5), each linked by
 *   the site's name (ui/SourcesNote).
 */
export interface SourcesSectionConfig {
  readonly variant: "article" | "inline";
  /** "Sources": the article's subtitle, or the bold word that opens the guide's note. */
  readonly label: string;
  readonly sources: readonly Source[];
  /** The article heading's id, which names the section ("sources-title" by default). */
  readonly id?: string;
}
