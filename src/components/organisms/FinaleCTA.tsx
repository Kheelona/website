import { Button } from "@/components/atoms/Button";
import {
  PREORDER_HREF,
  RESERVE_LABEL,
  TOKEN_PRICE,
  SHIP_DATE_TEXT,
  WHATSAPP_SHARE_HREF,
} from "@/config/site";

/** "20 October", from SHIP_DATE_TEXT so the two can never disagree. */
export const SHIP_DAY_TEXT = SHIP_DATE_TEXT.replace(/\s\d{4}$/, "");

/** The closing ask on every marketing page: the mockup's accent `.final`
 *  band (redesign 2026-10). Its colours are fixed, so it reads the same in
 *  both themes. Every CTA reaches the store in one tap (§8.25-b). */
export function FinaleCTA({
  title = `Meet Kheelu on ${SHIP_DAY_TEXT}.`,
  line = `Reserve for ${TOKEN_PRICE} today. Fully refundable until it ships.`,
  share = true,
  track = "finale",
  bare = false,
}: {
  title?: string;
  line?: string;
  share?: boolean;
  track?: string;
  /** Just the band, for a caller that already owns the section. */
  bare?: boolean;
}) {
  const band = (
    <div className="kh-final">
      <h2 className="kh-h2">{title}</h2>
      <p className="text-[17px]">{line}</p>
      <div className="kh-cta-row justify-center">
        <Button href={PREORDER_HREF} variant="onDark" track={track}>
          {RESERVE_LABEL}
        </Button>
        {share ? (
          <Button href={WHATSAPP_SHARE_HREF} variant="ghostOnAccent">
            Share with a parent
          </Button>
        ) : null}
      </div>
    </div>
  );

  if (bare) return band;

  return (
    <section id="reserve" className="kh-sec">
      <div className="kh-wrap">{band}</div>
    </section>
  );
}
