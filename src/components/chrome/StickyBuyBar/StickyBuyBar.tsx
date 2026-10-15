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
 * The small line's parts, split after each " · ": each part is an inline block, so on a narrow phone the line breaks
 * between its parts ("refundable ·" / "₹4,999 in total" at 360 px) and never inside one; a part wider than the bar's
 * price column still wraps inside itself, so nothing overflows (sticky-buy-bar.css). The words are unchanged.
 */
function parts(line: string) {
  const split = line.split(" · ");
  if (split.length === 1) return line;
  /* The space between parts sits outside them, so it shows between two parts on one line and goes at a break. */
  return split.flatMap((part, i) => [
    ...(i > 0 ? [" "] : []),
    <span key={i} className="ks-buybar__part">
      {i < split.length - 1 ? `${part} ·` : part}
    </span>,
  ]);
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
        <span className="kh-buybar__small">{parts(offerWords(offer.sticky.small, offer, "StickyBuyBar"))}</span>
      </div>
      <PreorderButton cta="sticky-bar" label={label} />
    </BuyBarController>
  );
}
