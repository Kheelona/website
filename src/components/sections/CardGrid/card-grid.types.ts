import type { Copy, Offer, Tone } from "@/content/types";
import type { SectionHeading } from "@/components/sections/FeatureSplit/section-parts";
import type { IconName } from "@/components/ui/Icon/Icon";

/* CardGrid's configuration (task 3.3; components §2): a heading and a grid of DS feature cards. Layouts from the
 * approved mockup: `guides` (Home fold 7b, D046: three topic cards, one link each, as a list that reveals), `routes`
 * (contact fold 2: five cards, three then two from 1024 px, each with its row of links) and `plain` (DS columns). */

/** The fold's heading; `align: "center"` as Home's guides. */
export type CardGridHeading = SectionHeading;

/** A card's link: the words, the address and, where the copy gives one, its own accessible name. The arrow is the
 *  card link's own. */
export interface CardGridLink {
  readonly label: string;
  readonly href: string;
  readonly ariaLabel?: string;
}

export interface CardGridItem {
  readonly tone?: Tone;
  readonly icon?: IconName;
  readonly title: Copy;
  readonly body?: Copy;
  /** `guides`: exactly one; `routes`: one or two, in a row at the card's foot. */
  readonly links?: readonly CardGridLink[];
}

export interface CardGridConfig {
  readonly variant: "guides" | "routes" | "plain";
  readonly heading: CardGridHeading;
  readonly items: readonly CardGridItem[];
  /** The cream band (`kh-section--band`). */
  readonly band?: boolean;
  /** `plain` only: DS columns from 720 px (one column without it). */
  readonly columns?: 2 | 3 | 4;
}

export interface CardGridProps extends CardGridConfig {
  readonly offer?: Offer;
}
