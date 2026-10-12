import type { Copy, Gated } from "@/content/types";

/**
 * RecognitionStrip's configuration: the heading ("Recognised by.", the DS's label) and the programmes, each by name
 * only and proof-gated (D038, F11: `gated` until its acceptance email or listing is filed in wiki/raw/). Text only:
 * no logos (B25).
 */
export interface RecognitionStripConfig {
  readonly title: Copy;
  readonly items: readonly Gated<{ readonly name: string }>[];
  /** The heading's id, which names the section ("recognised-title" by default). */
  readonly id?: string;
}
