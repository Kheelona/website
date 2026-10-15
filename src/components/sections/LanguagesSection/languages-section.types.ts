import type { SectionHeading } from "@/components/sections/FeatureSplit/section-parts";
import type { ClipFilm } from "@/components/sections/FilmsStrip/films-strip.types";
import type { LanguageChip } from "@/components/ui/LanguageChips/LanguageChips";
import type { Copy } from "@/content/types";

/* LanguagesSection's configuration (task Q2.9; the D2C plan v2 §2 fold 4, D064 item 9): Home's answer to "Does it speak
 * ours?". The page's content gives the heading, the languages (product.ts, each in its own script) and the one film that
 * shows the switching (films.ts: film 6, its chip, play words and caption). */

/** The film beside the languages: one real phone recording, played in place, with its caption under it. */
export type LanguagesFilm = ClipFilm & {
  /** Under the frame, visible before the tap: what happens in the film. */
  readonly caption: Copy;
};

export interface LanguagesSectionConfig {
  /** The section's fragment (`languages`). */
  readonly id?: string;
  /** The cream band. */
  readonly band?: boolean;
  /** Eyebrow, the h2 (one accent) and the lead; its id names the section. */
  readonly heading: SectionHeading;
  /** Each language in its own script (DS LanguageChips). */
  readonly languages: readonly LanguageChip[];
  readonly film: LanguagesFilm;
}
