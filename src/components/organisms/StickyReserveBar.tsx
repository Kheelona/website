import { Button } from "@/components/atoms/Button";
import { PREORDER_HREF, TOKEN_PRICE } from "@/config/site";

/** The mockup's mobile reserve bar (`.sbar`), redesign 2026-10. Replaces the
 *  mascot's mobile dock. Sticky at the bottom of the viewport below 900px;
 *  desktop keeps the header CTA instead. The ship date is the short form of
 *  SHIP_DATE_TEXT, which is why it reads from the ISO date. */
export function StickyReserveBar({ shipShort }: { shipShort: string }) {
  return (
    <div className="sticky bottom-0 z-40 flex items-center gap-3 border-t border-line bg-bg px-4 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2.5 min-[900px]:hidden">
      <p className="text-[13px] leading-[1.3] text-ink-muted">
        <b className="block text-[15px] text-ink-head">{TOKEN_PRICE} reserves Kheelu</b>
        Refundable. Ships {shipShort}.
      </p>
      <Button href={PREORDER_HREF} size="sm" track="sticky-bar" className="grow">
        Reserve
      </Button>
    </div>
  );
}
