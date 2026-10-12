import { ArtBoard } from "@/components/ui/ArtBoard/ArtBoard";
import type { MediaRatio } from "@/components/ui/Photo/Photo";
import { Sticker } from "@/components/ui/Sticker/Sticker";
import type { ArtBoardRef } from "@/content/types";

/**
 * The rendered width of one column of an even DS split (bundle.css:1122-1138): the container less its 16 px
 * gutters on phones; from 900 px half of it less half the 48 px gap; from 1024 px the gutters are 48 px; from
 * 1296 px the container stops at --content-max, so a column is (1200 − 48) / 2 = 576 px.
 */
export const SPLIT_COLUMN_SIZES = "(min-width: 1296px) 576px, (min-width: 1024px) calc(50vw - 72px), (min-width: 900px) calc(50vw - 40px), calc(100vw - 32px)";

/** The same column with ArtBoard's tablet clamp: at most 480 px between 720 and 899 px (mockup-css-mapping §6.7). */
export const CLAMPED_SPLIT_COLUMN_SIZES =
  "(min-width: 1296px) 576px, (min-width: 1024px) calc(50vw - 72px), (min-width: 900px) calc(50vw - 40px), (min-width: 720px) 480px, calc(100vw - 32px)";

export interface CloseArtProps {
  readonly art: ArtBoardRef;
  /** ArtBoard's 480 px tablet clamp (the safety and guide closes). */
  readonly clamp?: boolean;
  readonly ratio?: MediaRatio;
  readonly className?: string;
}

/**
 * A close's art board, beside its words in the second column of a split: below the first screen, so its doodle draws
 * (D049 pick 3) and its images load lazily; never revealed, because the mockup reveals no close (the closes hold a
 * chilli button and the price, architecture §11.2). Home's offer close and every CloseSection with art use it.
 */
export function CloseArt({ art, clamp, ratio, className }: CloseArtProps) {
  return (
    <ArtBoard
      tone={art.tone}
      label={art.label}
      layers={art.layers}
      sizes={clamp ? CLAMPED_SPLIT_COLUMN_SIZES : SPLIT_COLUMN_SIZES}
      sticker={art.sticker && <Sticker {...art.sticker} />}
      clamp={clamp}
      ratio={ratio}
      className={className}
    />
  );
}
