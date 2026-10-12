import type { Copy, ImageRef, Offer, Tone } from "@/content/types";
import type { SectionHeading, SectionLink } from "@/components/sections/FeatureSplit/section-parts";
import type { IconName } from "@/components/ui/Icon/Icon";
import type { LanguageChip } from "@/components/ui/LanguageChips/LanguageChips";

/* ModesSection's configuration (task 3.3; components §2): the three modes and the languages, on Home (fold 4, "What
 * is Kheelu?") and the product page (fold 4, "How it works", with compact mode rows on phones and the Good to know
 * card). */

export type ModesHeading = SectionHeading;

export interface ModeCardCopy {
  /** A fragment other pages link to, on the card's title: Story mode's `story-mode`. */
  readonly id?: string;
  readonly tone: Tone;
  /** The quiet tinted card (`kh-card--tint`), as Story mode on Sunshine. */
  readonly tint?: boolean;
  readonly icon: IconName;
  readonly title: Copy;
  readonly body: Copy;
}

export interface ModesLanguages {
  /** "Up to 10 languages at launch". */
  readonly title: Copy;
  readonly items: readonly LanguageChip[];
  /** "It can switch between them mid-sentence." */
  readonly note?: Copy;
}

/** The product page's Good to know card: its title (with the id that names the card), the lines, the photo beside them. */
export interface ModesKnow {
  readonly title: Copy;
  readonly id: string;
  readonly items: readonly { readonly icon: IconName; readonly text: Copy }[];
  readonly image: ImageRef;
}

export interface ModesSectionConfig {
  /** `home` (Home fold 4) or `product` (product fold 4: compact rows on phones, the Good to know card). */
  readonly variant: "home" | "product";
  /** The section's fragment; "modes" unless the page says otherwise. */
  readonly id?: string;
  readonly heading: ModesHeading;
  /** Beside the heading: a 4:5 photo (Home) or a 16:9 one (`wide`, the product page). */
  readonly photo: { readonly image: ImageRef; readonly wide?: boolean };
  readonly modes: readonly ModeCardCopy[];
  readonly languages: ModesLanguages;
  readonly know?: ModesKnow;
  /** The ghost link that closes the fold, with its arrow. */
  readonly link?: SectionLink;
}

export interface ModesSectionProps extends ModesSectionConfig {
  readonly offer?: Offer;
}
