import type { ReactNode } from "react";
import type { ArtBoardRef, Copy, ImageRef, Offer } from "@/content/types";
import type { HeadingProps } from "@/components/ui/Heading/Heading";
import type { IconName } from "@/components/ui/Icon/Icon";

/* HeroSection's configuration (task 3.3; components §2): the first fold of a page, never revealed and with still
 * doodles (D049 pick 2). Layouts from the approved mockup:
 * - `art`: Home (D045), the hero heading and the CTA block beside the scrapbook board;
 * - `product`: the product page, the same with the word sticker moved clear of the child's face;
 * - `answer`: an answer-first heading beside a photo or a board (safety, the buyer's guide, team), or alone (setup);
 * - `contact`: the heading beside the three ways to reach the team;
 * - `hub`: the stories hub, on the band, with the byline and the topic links. */

/** The page's h1 heading: eyebrow, title (one Kalam accent), lead; the id names the section. */
export type HeroHeading = Pick<HeadingProps, "eyebrow" | "title" | "lead"> & { readonly id: string };

/** An answer hero's media, which is the page's LCP image. */
export type HeroMedia =
  | { readonly kind: "photo"; readonly image: ImageRef; readonly variant?: "wide" | "square"; readonly xl?: boolean }
  | {
      readonly kind: "art";
      readonly art: ArtBoardRef;
      /** At most 480 px wide between 720 and 899 px (the buyer's guide). */
      readonly clamp?: boolean;
      /** Keeps its gap under the words until the split begins at 900 px (team: `ks-team-board`). */
      readonly stacked?: boolean;
    };

/** One way to reach the team, as a secondary button: the words, the address and its DS icon, if any. */
export interface HeroWay {
  readonly label: string;
  readonly href: string;
  readonly icon?: IconName;
}

export type HeroSectionConfig =
  | { readonly variant: "art" | "product"; readonly heading: HeroHeading; readonly art: ArtBoardRef }
  | { readonly variant: "answer"; readonly heading: HeroHeading; readonly media?: HeroMedia }
  | { readonly variant: "contact"; readonly heading: HeroHeading; readonly ways: readonly HeroWay[] }
  | {
      readonly variant: "hub";
      readonly heading: HeroHeading;
      /** The byline under the heading ("Written by the Kheelona team in Bengaluru."). */
      readonly written?: Copy;
      /** The topic links, a navigation named by its visible label. */
      readonly topics: {
        readonly label: string;
        readonly id: string;
        readonly links: readonly { readonly label: string; readonly href: string }[];
      };
    };

export interface HeroSectionSlots {
  readonly offer?: Offer;
  /** `art` and `product`: the CTA block under the heading (CtaBlock, task 3.2, composed by the section registry). */
  readonly cta?: ReactNode;
}

export type HeroSectionProps = HeroSectionConfig & HeroSectionSlots;
