import type { ReactNode } from "react";
import type { SectionHeading } from "@/components/sections/FeatureSplit/section-parts";
import type { Copy, ImageRef, Offer } from "@/content/types";

/* StickyScroll's configuration (task Q2.9; the D2C plan v2 §1.6 and §2 fold 5; D064 items 7 and 10): what Kheelu is and
 * what a child gets, as a few points read one after another. From 900 px the heading and a picture that changes with the
 * point being read stay in view beside the points, with a thin progress line under the picture; on phones the points
 * stack, each with its own small picture. */

/** A point's picture: a DS photo, a product cut-out or a real app screen. `contain` shows the whole image on the cream
 *  (the cut-outs and the phone screen); `cover` (default) fills the frame (the library photos). */
export interface StickyScrollPicture {
  readonly image: ImageRef;
  readonly fit?: "cover" | "contain";
}

/** One line of the small written example under a point: who says it, and the words in their quotation marks. */
export interface StickyScrollExampleLine {
  readonly who: string;
  readonly text: Copy;
}

/** A small written example under a point, always labelled above the exchange (DS 08-accessibility: snippets written by
 *  us are marked as illustrative). */
export interface StickyScrollExample {
  /** "Illustrative example, not a recording.": required, it also names the list. */
  readonly note: string;
  readonly lines: readonly [StickyScrollExampleLine, ...StickyScrollExampleLine[]];
}

export interface StickyScrollPoint {
  readonly title: Copy;
  readonly body: Copy;
  readonly picture: StickyScrollPicture;
  readonly example?: StickyScrollExample;
}

export interface StickyScrollConfig {
  /** The section's fragment (`asks`). */
  readonly id?: string;
  readonly band?: boolean;
  /** Eyebrow and h2 (one accent); its id names the section. */
  readonly heading: SectionHeading;
  /** At least two points, in reading order. */
  readonly points: readonly [StickyScrollPoint, StickyScrollPoint, ...StickyScrollPoint[]];
  /** One line under the points, not a heading. */
  readonly line?: Copy;
}

export interface StickyScrollSlots {
  readonly offer?: Offer;
  /** After the line: the page's CTA block (CtaBlock, composed by the section registry). */
  readonly cta?: ReactNode;
}

export type StickyScrollProps = StickyScrollConfig & StickyScrollSlots;
