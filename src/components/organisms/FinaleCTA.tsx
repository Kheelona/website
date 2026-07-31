import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { TallyEmbed } from "@/components/molecules/TallyEmbed";
import { PromiseMark } from "@/components/molecules/PromiseMark";
import {
  LAUNCH_PRICE,
  LATER_PRICE,
  CAP_LINE,
  PRICE_HOLD_LINE,
  KHEELONA_PLUS_SHORT,
  WHATSAPP_SHARE_HREF,
  WHATSAPP_SHARE_LABEL,
  SHIP_DATE_TEXT,
} from "@/config/site";

/** The three things a parent needs settled at the exact moment they decide
 *  (V5-2). Every one renders from a config constant, so none can drift from
 *  the rest of the site, and each is already published copy. They carry the
 *  promise marks, which is what those shapes are for (§8.23-3). */
const REASSURANCES = [
  { head: "No payment today", note: "Reserving holds your price and your place. Nothing is charged." },
  { head: `First 500 at ${LAUNCH_PRICE}`, note: `${LATER_PRICE} after launch. The cap is real, not a countdown.` },
  { head: `Ships ${SHIP_DATE_TEXT}`, note: "Everyone on the list is served first, in the order they reserved." },
] as const;

/** The conversion finale, id="reserve" on every page.
 *  V4 (team feedback 2026-07-30, decisions D3/D5): the room is WHITE and the
 *  plush lineup is gone — the form is the moment, nothing competes with it.
 *  The orange moved onto the buttons (D1). Copy verbatim except the R9 cap
 *  line (founder-supplied "first 500 units").
 *  `variant="full"` (Home, Lumi): big headline. `variant="compact"`: the ask
 *  + the form at interior scale.
 *  The consent caption stays accurate for both the live 6-field Tally form
 *  and the coming 5-field one (D3): WhatsApp number + consent exist in both. */
export function FinaleCTA({
  variant = "full",
  bare = false,
  share = true,
}: {
  variant?: "full" | "compact";
  /** Revamp M2: content-only, for composition inside a Room (the Room then
   *  owns id="reserve"). */
  bare?: boolean;
  /** V3: the WhatsApp share line under the consent print. */
  share?: boolean;
}) {
  const content = (
    <>
      <Reveal>
        <h2
          className={
            variant === "full"
              ? "mb-4 max-w-[16ch] font-display text-[clamp(36px,4.6vw,60px)] font-extrabold leading-[1.05] text-ink-head"
              : "mb-4 max-w-[22ch] font-display text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.1] text-ink-head"
          }
        >
          Reserve Lumi before the price goes up.
        </h2>
        {/* V6 D11: exactly CAP_LINE + the hold promise. Repetition builds
            trust only when it is verbatim — three paraphrases of one price
            read like three offers. */}
        <p className="mb-8 max-w-[50ch] text-[19px] font-bold text-ink-head md:text-[21px]">
          {CAP_LINE} {PRICE_HOLD_LINE}
        </p>
      </Reveal>
      {/* V5-2: the reserve moment lost its weight when V4 turned the finale
          white — the most important section on the site became an unbranded
          third-party embed on a blank page. These three answers give it
          substance instead of padding, exactly where the decision happens. */}
      <Reveal className="mb-9 grid max-w-[880px] gap-4 sm:grid-cols-3">
        {REASSURANCES.map((r, i) => (
          <div
            key={r.head}
            className="rounded-(--radius-card) border border-line-soft bg-white p-5"
          >
            <PromiseMark index={i} size="w-7" className="mb-2.5" />
            <p className="font-display text-[17px] font-extrabold leading-snug text-ink-head">
              {r.head}
            </p>
            <p className="mt-1 text-[14.5px] leading-snug text-ink-muted">{r.note}</p>
          </div>
        ))}
      </Reveal>
      <Reveal className="max-w-[680px] text-left">
        {/* V3: the deal on the subscription, said before the form and not
            after the purchase (gate V3-b keeps the price out) */}
        <p className="mb-4 text-[15px] font-medium text-ink">
          {KHEELONA_PLUS_SHORT}
        </p>
        <TallyEmbed />
        {/* Founder to confirm wording matches the Tally consent copy. */}
        <p className="mt-3 text-[15px] font-medium text-ink-muted">
          Your WhatsApp number is only for updates about your reservation. You
          can leave the list anytime.
        </p>
        {/* V3: the one growth loop a pre-launch site can honestly run —
            WhatsApp is where Indian parents already pass things along, and it
            needs no backend, no counter, and no invented numbers. */}
        {share && (
          <p className="mt-5 text-[15px] font-medium text-ink">
            <a
              href={WHATSAPP_SHARE_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              {WHATSAPP_SHARE_LABEL}
            </a>
          </p>
        )}
      </Reveal>
    </>
  );

  if (bare) return content;

  return (
    <Section wash="white" id="reserve" className="overflow-x-clip">
      <Container
        className={variant === "full" ? "pt-10 md:pt-14" : "pb-16 pt-8 md:pb-20"}
      >
        {content}
      </Container>
    </Section>
  );
}
