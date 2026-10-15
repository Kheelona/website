import type { SectionHeading } from "@/components/sections/FeatureSplit/section-parts";
import type { IconName } from "@/components/ui/Icon/Icon";
import type { Copy, ImageRef, Tone } from "@/content/types";

/* DayTimeline's configuration (task Q2.9; the D2C plan v2 §2 fold 9): "When would we use it?" as a few moments of one
 * day, each with its DS icon, its line and the mode it uses, then a closing line, beside one real parent-app screen. */

/** One moment of the day. */
export interface DayMoment {
  /** The DS icon in the moment's circle. */
  readonly icon: IconName;
  /** The circle's DS tone. */
  readonly tone: Tone;
  /** "Breakfast": the moment, as the item's heading. */
  readonly when: Copy;
  readonly line: Copy;
  /** "AI mode · home Wi‑Fi": the mode the moment uses, as a DS chip. */
  readonly mode: string;
}

export interface DayTimelineConfig {
  /** The section's fragment (`day`). */
  readonly id?: string;
  readonly band?: boolean;
  /** Eyebrow, the h2 (one accent) and the lead; its id names the section. */
  readonly heading: SectionHeading;
  /** In the day's order: at least two. */
  readonly moments: readonly [DayMoment, DayMoment, ...DayMoment[]];
  /** The line under the moments. */
  readonly closing?: Copy;
  /** One real parent-app screen (D044) beside the moments, with its caption. */
  readonly screen: { readonly image: ImageRef; readonly caption?: Copy };
}
