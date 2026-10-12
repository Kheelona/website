import type { ReactNode } from "react";
import type { Copy, ImageRef, Offer } from "@/content/types";
import type { HeadingProps } from "@/components/ui/Heading/Heading";
import type { IconName } from "@/components/ui/Icon/Icon";
import type { CtaId } from "@/lib/tracking/cta";

/* TrustSection's configuration (task 3.3; components §2): the safety facts as a DS TrustList, in four layouts of the
 * approved mockup:
 * - `safety`: Home and product fold 6 (D020 order): the facts beside the parent app's privacy screen, the facts line,
 *   then the page's CTA block;
 * - `facts`: the safety page's four facts in full (fold 2, `#facts`), as an ordered list, the tummy unit beside the
 *   heading;
 * - `never`: the safety page's "What you won't find" (fold 3), five items, three then two from 1024 px;
 * - `meets`: the buyer's guide's answers to the five checks (fold 3), in the checks' order, then a pointer line. */

export type TrustHeading = Pick<HeadingProps, "eyebrow" | "title" | "lead"> & { readonly id: string };

/** One fact: the DS icon, an optional title, the words. */
export interface TrustItemCopy {
  readonly icon: IconName;
  readonly title?: Copy;
  readonly body: Copy;
}

/** A link after the list: a ghost link with its arrow, or a secondary button with its icon first (`icon`). */
export interface TrustLink {
  readonly label: string;
  readonly href: string;
  readonly cta?: CtaId;
  /** Makes the link a secondary button, the icon before the words ("See the full safety facts", shield). */
  readonly icon?: IconName;
}

interface Base {
  readonly heading: TrustHeading;
  readonly items: readonly TrustItemCopy[];
  /** The section's fragment (`safety` on the product page, `facts` on the safety page). */
  readonly id?: string;
  /** The cream band (`kh-section--band`). */
  readonly band?: boolean;
}

export type TrustSectionConfig =
  | (Base & {
      readonly variant: "safety";
      /** Home's fold (an even split, the phone in Home's frame) or the product page's (a 7:5 split, the phone
       *  standing alone and sticky beside the facts on laptops). */
      readonly placement: "home" | "product";
      /** The parent app's screen beside the facts, and its caption. */
      readonly screens: { readonly images: readonly [ImageRef]; readonly caption?: Copy };
      /** The checkable facts line under the split, unlinked ("No camera", …). */
      readonly facts: readonly { readonly icon: IconName; readonly text: Copy }[];
    })
  | (Base & {
      readonly variant: "facts";
      /** The square photo beside the heading (the tummy unit). */
      readonly photo: ImageRef;
    })
  | (Base & { readonly variant: "never"; readonly link?: TrustLink })
  | (Base & {
      readonly variant: "meets";
      /** The line after the answers, pointing to the safety page. */
      readonly pointer?: Copy;
      readonly link?: TrustLink;
    });

export interface TrustSectionSlots {
  readonly offer?: Offer;
  /** The page's CTA block (CtaBlock, task 3.2, composed by the section registry), last in the fold. */
  readonly cta?: ReactNode;
}

export type TrustSectionProps = TrustSectionConfig & TrustSectionSlots;
