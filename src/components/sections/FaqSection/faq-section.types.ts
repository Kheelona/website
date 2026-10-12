import type { ReactNode } from "react";
import type { Copy, FaqItem, ImageRef, Offer } from "@/content/types";
import type { SectionHeading, SectionLink } from "@/components/sections/FeatureSplit/section-parts";
import type { IconName } from "@/components/ui/Icon/Icon";
import type { SourceNoteItem } from "@/components/ui/SourceMarker/SourcesNote";

/* FaqSection's configuration (task 3.3; components §2): what a page's content gives the FAQ fold. Three layouts
 * from the approved mockup: `default` (Home and product fold 8: the heading column beside the questions), `photo`
 * (safety fold 7 and the buyer's guide fold 5: heading, photo and questions on a grid) and `store` (the store's
 * "Questions before you pay", inside the store column). FAQPage JSON-LD is the template's (4.1), from the same items. */

/** The fold's heading: the eyebrow and the title, whose id names the section (no lead in the approved folds). */
export type FaqHeading = Pick<SectionHeading, "eyebrow" | "title" | "id">;

/** The product fold's source note: its bold word ("Sources") and the sources in marker order. */
export interface FaqSources {
  readonly label: string;
  readonly items: readonly SourceNoteItem[];
}

/** A ghost link after the questions, with its arrow ("See all questions", `faq-more`). */
export type FaqLink = SectionLink;

/** The product page's help line under the questions ("Still have a question? WhatsApp or call …"). */
export interface FaqHelp {
  readonly icon?: IconName;
  readonly lead?: Copy;
  readonly contact: Copy;
}

/** The product page's D025 line under the questions: an icon and the words. */
export interface FaqDisclaimer {
  readonly icon: IconName;
  readonly text: Copy;
}

/** The photo of the `photo` layout. */
export interface FaqPhoto {
  readonly image: ImageRef;
  /** The photo's rendered width at each layout. */
  readonly sizes: string;
  /** 16:9 (safety); the DS 4:5 without it (the guide). */
  readonly variant?: "wide";
  /** At most 420 px wide from 720 to 899 px and 360 px from 900 (the guide's portrait photo). */
  readonly clamp?: boolean;
}

interface Base {
  readonly items: readonly FaqItem[];
  /** The fragment other pages link to; "faq" unless the page says otherwise. */
  readonly id?: string;
  /** The cream band (`kh-section--band`). */
  readonly band?: boolean;
  /** The word a `[^n]` marker in an answer reads with ("Source" makes "Source 1"); needed when an answer has one. */
  readonly sourceMarker?: string;
}

export type FaqSectionConfig =
  | (Base & {
      readonly variant?: "default";
      readonly heading: FaqHeading;
      readonly disclaimer?: FaqDisclaimer;
      /** The note the answers' markers point to, under the disclaimer (the photo layout takes its note in `notes`). */
      readonly sources?: FaqSources;
      readonly help?: FaqHelp;
      readonly more?: FaqLink;
    })
  | (Base & {
      readonly variant: "photo";
      readonly heading: FaqHeading;
      readonly photo: FaqPhoto;
      /** Opens the first answer at load (safety.html fold 7). */
      readonly firstOpen?: boolean;
      readonly more?: FaqLink;
    })
  | {
      readonly variant: "store";
      /** The store's section heading: the title only. */
      readonly heading: Pick<FaqHeading, "title" | "id">;
      readonly items: readonly FaqItem[];
    };

/** What the page passes besides the configuration. */
export interface FaqSectionSlots {
  /** The page's offer, for amounts and words that change with the mode. */
  readonly offer?: Offer;
  /** After the questions, inside their column: the inline sources (SourcesSection `inline`, task 3.4). */
  readonly notes?: ReactNode;
}

export type FaqSectionProps = FaqSectionConfig & FaqSectionSlots;
