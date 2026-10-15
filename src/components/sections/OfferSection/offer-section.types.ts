import type { ArtBoardRef, Copy, ImageRef, TrustItem } from "@/content/types";
import type { CtaId } from "@/lib/tracking/cta";
import type { SellingContext, SellingHeading } from "../CtaBlock/cta-block.types";

interface OfferSectionBase {
  readonly heading: SellingHeading;
  /** The card's button: `home-offer` on Home, `product-offer` on the product page (architecture §8.3). */
  readonly cta: CtaId;
  /** The linked trust row under the card: the trust line, then the card's third row (the D2C plan v2 §1.1). */
  readonly trust: readonly TrustItem[];
  /** The small line in the card, after the perks and before the button (offer.ts `PLUS_NOTE`; task Q2.13, the D2C plan
   *  v2 §2 fold 7 and §3 fold 3: both cards). */
  readonly note: Copy;
}

/**
 * Both cards alike since task Q2.13 (the D2C plan v2 §2 fold 7 and §3 fold 3; the CMO's m9): the card with the one perk
 * list, the Kheelona+ note after the perks, the button and no fine print (its price block stands in for the price line,
 * so the price is printed once); under it the trust row with the card's third row, no help line (the closes and the
 * store carry it, plan §1.1), then the share link.
 * - `photo`: the product page's offer (meet-kheelu.html fold 3): section `#offer`, a plain card, the square photo beside;
 * - `home`: Home's offer since task Q2.9 (the selling update; the D2C plan v2 §2 fold 7), moved up to fold 7, so not the
 *   page's close: section `#offer`, the heading's lead, the card a named region (no id: the section holds `#offer`), the
 *   art board beside, top-aligned from 900 px.
 * Home's close (home.html fold 9, the `close` variant) left with task Q2.13: Home's close is a CloseSection since Q2.9.
 */
export type OfferSectionConfig = OfferSectionBase &
  (
    | { readonly variant: "photo"; readonly photo: ImageRef }
    | {
        readonly variant: "home";
        /** The card's region name: "Kheelu offer". */
        readonly cardLabel: string;
        readonly art: ArtBoardRef;
      }
  );

export type OfferSectionProps = OfferSectionConfig & SellingContext;
