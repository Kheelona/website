import type { ArtBoardRef, ImageRef, TrustItem } from "@/content/types";
import type { CtaId } from "@/lib/tracking/cta";
import type { SellingContext, SellingHeading } from "../CtaBlock/cta-block.types";

interface OfferSectionBase {
  readonly heading: SellingHeading;
  /** The card's button: `finale` on Home, `product-offer` on the product page (architecture §8.3). */
  readonly cta: CtaId;
  /** The linked trust row under the card (Home: the full four; the product page: returns, warranty, payment). */
  readonly trust: readonly TrustItem[];
}

/**
 * - `close`: Home's close (home.html fold 9): section `#close`, the card a named region `#offer` with Home's perks,
 *   the Kheelona+ line under it (D041 F7), the art board beside;
 * - `photo`: the product page's offer (meet-kheelu.html fold 3): section `#offer`, a plain card with the product
 *   page's perks (Kheelona+ among them), the square photo beside.
 */
export type OfferSectionConfig = OfferSectionBase &
  (
    | {
        readonly variant: "close";
        /** The card's region name: "Kheelu offer". */
        readonly cardLabel: string;
        readonly art: ArtBoardRef;
      }
    | { readonly variant: "photo"; readonly photo: ImageRef }
  );

export type OfferSectionProps = OfferSectionConfig & SellingContext;
