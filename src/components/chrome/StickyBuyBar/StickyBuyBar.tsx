import { PreorderButton } from "@/components/ui/PreorderButton/PreorderButton";
import { offerWords } from "@/components/ui/PriceSentence/PriceSentence";
import type { Offer } from "@/content/types";
import { BuyBarController } from "./StickyBuyBar.client";

export interface StickyBuyBarProps {
  /** The live offer: the bar's two lines in the current mode (token: "₹499 today" and the refundable total; full:
   *  the full price and the delivery line). */
  offer: Offer;
  /** "Pre-order Kheelu" (content/en-IN/cta.ts): the button's words and, as in the mockup, the region's name. */
  label: string;
  /** The marketing paths that carry the bar. */
  paths: readonly string[];
}

/**
 * The phone sticky buy bar: the DS StickyBuyBar (`kh-buybar`) exactly as mockup/partials/buybar.html composes it, the
 * two price lines and the chilli button tracked `sticky-bar`. Position, the safe-area foot and the 900 px cut-off are
 * sticky-buy-bar.css; its slide is motion.css's (D049 pick 4); when it shows and steps aside is the client island
 * StickyBuyBar.client.tsx. Rendered by SiteShell after the footer, as the mockup places it.
 */
export function StickyBuyBar({ offer, label, paths }: StickyBuyBarProps) {
  return (
    <BuyBarController label={label} paths={paths}>
      <div className="kh-buybar__price">
        <span className="kh-buybar__big">{offerWords(offer.sticky.big, offer, "StickyBuyBar")}</span>
        <span className="kh-buybar__small">{offerWords(offer.sticky.small, offer, "StickyBuyBar")}</span>
      </div>
      <PreorderButton cta="sticky-bar" label={label} />
    </BuyBarController>
  );
}
