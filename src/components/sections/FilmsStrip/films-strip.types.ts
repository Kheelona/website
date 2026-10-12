import type { ReactNode } from "react";
import type { Copy, Film, Offer } from "@/content/types";
import type { SectionHeading, SectionLink } from "@/components/sections/FeatureSplit/section-parts";

/* FilmsStrip's configuration (task 3.3; components §2; D040): the seven parent films on Home (fold 2), the product page
 * (fold 2) and the store (fold 6), each with its heading and proof line. The films and the strip's own labels are
 * content/en-IN/films.ts (`films`, `filmsStrip`); the page decides how the posters load. */

export type FilmsHeading = SectionHeading;

/** A film as the strip shows it: content's `Film` (its consent and caption flags are the content's own guarantee). */
export type FilmTile = Pick<Film, "id" | "chip" | "caption" | "duration" | "poster" | "video">;

/** The strip's words (content/en-IN/films.ts `filmsStrip`) and the position line's "of" ("1 of 7"). */
export interface FilmsStripLabels {
  /** The list's accessible name: "Seven films of families with Kheelu". */
  readonly listLabel: string;
  readonly previous: string;
  readonly next: string;
  /** Read before each length by screen readers only: "Length". */
  readonly length: string;
  /** The play button reads "{play} {chip}. {caption}": "Play:". */
  readonly play: string;
  /** The position line's word: "of". */
  readonly of: string;
}

export interface FilmsStripConfig {
  /** The section's fragment (`films` on the product page). */
  readonly id?: string;
  readonly heading: FilmsHeading;
  readonly films: readonly FilmTile[];
  readonly labels: FilmsStripLabels;
  /** The line under the strip, in the body-s style (Home, the store) or the caption style (the product page). */
  readonly proof?: { readonly text: Copy; readonly size: "body-s" | "caption" };
  /** `eager-low`: the first three posters load at once at low priority, never competing with the LCP image (Home,
   *  N19); `lazy`: every poster waits (the product page, the store). */
  readonly posters: "eager-low" | "lazy";
  /** A ghost link after the strip, with its icon after the words (the store's "Back to your details", `iconEnd`
   *  caret up). */
  readonly link?: SectionLink;
}

export interface FilmsStripSlots {
  readonly offer?: Offer;
  /** After the strip: the page's CTA block (CtaBlock, task 3.2, composed by the section registry; Home fold 2). */
  readonly after?: ReactNode;
}

export type FilmsStripProps = FilmsStripConfig & FilmsStripSlots;
