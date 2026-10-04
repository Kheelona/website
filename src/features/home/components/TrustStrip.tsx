import { CalendarDays, MapPin, MessageCircle, RotateCcw } from "lucide-react";
import { PRESS_TINT } from "@/lib/interactions";
import { SHIP_DATE_TEXT, SUPPORT_WHATSAPP_HREF } from "@/config/site";

const CHIP =
  "flex min-h-11 items-center gap-2.5 text-[15px] font-semibold text-ink-head";
const ICON = "h-[18px] w-[18px] shrink-0 text-orange-ink";

/** The mockup's trust strip (CMO merge, 2026-10-04): four things a parent
 *  wants settled before scrolling on, each already published elsewhere on the
 *  site. It sits directly above the "Recognised by" logos, which the site
 *  keeps in that wording rather than the mockup's "Supported by": "Backed by"
 *  was ruled out as an investment claim, and "Supported" reads like one.
 *
 *  The WhatsApp chip is the only tappable one, so it is the only one carrying
 *  the press contract (§8.23-1). */
export function TrustStrip() {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
      <li className={CHIP}>
        <MapPin className={ICON} aria-hidden="true" />
        Team based in Bengaluru
      </li>
      <li className={CHIP}>
        <RotateCcw className={ICON} aria-hidden="true" />
        Refundable until we ship
      </li>
      <li>
        <a
          href={SUPPORT_WHATSAPP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={`${CHIP} rounded underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 ${PRESS_TINT}`}
        >
          <MessageCircle className={ICON} aria-hidden="true" />
          A real person on WhatsApp
        </a>
      </li>
      <li className={CHIP}>
        <CalendarDays className={ICON} aria-hidden="true" />
        Ships {SHIP_DATE_TEXT}
      </li>
    </ul>
  );
}
