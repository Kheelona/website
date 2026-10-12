import type { ReactNode } from "react";
import type { ArtBoardRef, Copy, ImageRef, Offer, Tone } from "@/content/types";
import type { IconName } from "@/components/ui/Icon/Icon";
import type { DoodleLayer } from "@/components/ui/ImaginationFrame/ImaginationFrame";
import type { MediaRatio } from "@/components/ui/Photo/Photo";
import type { SourceNoteItem } from "@/components/ui/SourceMarker/SourcesNote";
import type { SectionHeading, SectionLink } from "./section-parts";

/* FeatureSplit's configuration (task 3.3; components §2): words beside media, in the layouts of the approved mockup:
 * - `imagination`: Home fold 3, the sourced words and the Kheelu card beside the imagination frame;
 * - `app-screens`: the parent app beside its real screens (D044, D046): Home fold 5, product fold 5 (skills and the
 *   Kheelona+ note), safety fold 4 (the parent controls and the one privacy screen);
 * - `photo`: words beside a photo or an art board, or beside nothing (setup folds 4-6, the guide's plush or robot);
 * - `ticks`: the setup page's checklist under its heading (fold 2);
 * - `pair`: two short folds as cards side by side (safety folds 5 and 6);
 * - `quote`: why we build, beside the founder's quote (team fold 4). */

export type FeatureHeading = SectionHeading;

/** A link in the fold: a ghost link with its arrow, or, with `icon`, a secondary button with the icon first. */
export type FeatureLink = SectionLink;

/** One line of a DS trust list: the icon, an optional title, the words. */
export interface FeatureItem {
  readonly icon: IconName;
  readonly title?: Copy;
  readonly body: Copy;
}

export interface FeatureCard {
  readonly tone: Tone;
  readonly tint?: boolean;
  readonly icon: IconName;
  readonly title: Copy;
  readonly body: Copy;
}

/** A section's sources: the note's word ("Sources"), the markers' word ("Source"), the sources in marker order. */
export interface FeatureSources {
  readonly label: string;
  readonly marker: string;
  readonly items: readonly SourceNoteItem[];
}

/** The parent app's real screens and their caption. */
export interface FeatureScreens {
  readonly images: readonly [ImageRef] | readonly [ImageRef, ImageRef];
  readonly caption?: Copy;
}

/** The `photo` layout's media: a DS photo (setup), or an art board (the guide's plush board, `plush`). */
export type FeatureMedia =
  | {
      readonly kind: "photo";
      readonly image: ImageRef;
      readonly variant?: "wide" | "square";
      /** Any other ratio, the DS --kh-ratio (the activity screenshot at its own 576 / 1209). */
      readonly ratio?: MediaRatio;
      readonly caption?: Copy;
      /** `belly`: never wider than the 384 px crop; `shot`: a phone screenshot at 288 px with a hairline and shadow. */
      readonly fit?: "belly" | "shot";
    }
  | {
      readonly kind: "art";
      readonly art: ArtBoardRef;
      /** The guide's plush board: 4:3 on phones, 1:1 from 900 px, at most 480 px wide on tablets. */
      readonly plush?: boolean;
    };

interface Base {
  /** The section's fragment (`app` on Home and the product page). */
  readonly id?: string;
  /** The cream band (`kh-section--band`). */
  readonly band?: boolean;
}

interface Headed extends Base {
  readonly heading: FeatureHeading;
  readonly link?: FeatureLink;
}

/** The `photo` layout's words, with or without media. */
interface PhotoWords {
  /** The wider column from 900 px (7 : 5); even without it. */
  readonly split?: "start" | "end";
  /** Paragraphs under the heading (`ks-feature-copy`), or … */
  readonly copy?: readonly Copy[];
  /** … the guide's single measured paragraph (`ks-gd-plush-text`). */
  readonly text?: Copy;
}

export type FeatureSplitConfig =
  | (Headed & {
      readonly variant: "imagination";
      /** The sourced paragraph (`kh-body-l`, its marker `[^1]`). */
      readonly text: Copy;
      readonly card: FeatureCard;
      /** The small line under the card. */
      readonly aside?: Copy;
      readonly frame: {
        readonly photo: ImageRef;
        readonly doodles?: readonly DoodleLayer[];
        readonly question?: Copy;
        readonly zoom?: boolean;
      };
      readonly sources?: FeatureSources;
    })
  | (Headed & {
      readonly variant: "app-screens";
      /** Home fold 5, the product page's fold 5, or the safety page's parent controls (one screen). */
      readonly placement: "home" | "product" | "safety";
      readonly items?: readonly FeatureItem[];
      /** The product page's skills, a named chip list. */
      readonly skills?: { readonly label: string; readonly items: readonly string[] };
      /** The product page's Kheelona+ line. */
      readonly note?: Copy;
      readonly screens: FeatureScreens;
    })
  | (Headed &
      PhotoWords & {
        readonly variant: "photo";
        readonly media: FeatureMedia;
      })
  | (Base &
      PhotoWords & {
        readonly variant: "photo";
        readonly heading: FeatureHeading;
        /** Without media (setup folds 4-6, `ks-setup-split`) the heading sits beside the words, and the mockup gives a
         *  link no place: none is taken (it would never be drawn). */
        readonly media?: undefined;
        readonly link?: never;
      })
  | (Base & {
      readonly variant: "ticks";
      readonly heading: FeatureHeading;
      readonly items: readonly FeatureItem[];
    })
  | (Base & {
      readonly variant: "pair";
      readonly cards: readonly { readonly heading: FeatureHeading; readonly copy: readonly Copy[]; readonly link?: FeatureLink }[];
    })
  | (Headed & {
      readonly variant: "quote";
      readonly copy: readonly Copy[];
      /** The line in the subtitle style after the paragraphs. */
      readonly subtitle?: Copy;
      readonly quote: {
        readonly text: Copy;
        readonly name: Copy;
        readonly role?: Copy;
        readonly initials?: string;
        readonly tone?: Tone;
      };
    });

export interface FeatureSplitSlots {
  readonly offer?: Offer;
  /** `ticks`: anything after the checklist, inside the fold (the setup page's Wi-Fi tip). */
  readonly after?: ReactNode;
}

export type FeatureSplitProps = FeatureSplitConfig & FeatureSplitSlots;
