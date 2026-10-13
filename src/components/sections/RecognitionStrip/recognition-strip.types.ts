import type { Copy, Gated, ImageRef } from "@/content/types";

/**
 * One programme of the strip, by name, with its mark where the founder shows one (D054 item 20: the live marks,
 * public/recognition/*.png). A mark whose alt names the programme (the words printed on it) stands alone; a mark with an
 * empty alt is decorative and the name shows beside it (the live strip's seal); with no mark the name shows as text.
 * Names only: the strip states no relationship (B26). `gated` hides it on every environment (D038).
 */
export interface RecognitionItem {
  readonly name: string;
  /** A site-path image at the file's real size. */
  readonly mark?: ImageRef;
}

/** RecognitionStrip's configuration: the heading ("Recognised by.", the DS's label) and the programmes, in order. */
export interface RecognitionStripConfig {
  readonly title: Copy;
  readonly items: readonly Gated<RecognitionItem>[];
  /** The heading's id, which names the section ("recognised-title" by default). */
  readonly id?: string;
}
