import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { PromiseMark } from "@/components/molecules/PromiseMark";
import {
  TOKEN_PRICE,
  BALANCE_PRICE,
  PREORDER_OFFER_LINE,
  PRICE_HOLD_LINE,
  PREORDER_LABEL,
  KHEELONA_PLUS_SHORT,
  WHATSAPP_SHARE_HREF,
  WHATSAPP_SHARE_LABEL,
  SHIP_DATE_TEXT,
  STORE_URL,
} from "@/config/site";

/** The three things a parent needs settled at the exact moment they decide
 *  (V5-2). Every one renders from a config constant, so none can drift from
 *  the rest of the site, and each is already published copy. They carry the
 *  promise marks, which is what those shapes are for (§8.23-3).
 *  Rewritten 2026-08-22: the reassurances a paid reservation needs are not the
 *  ones a free list needed. "No payment today" was the strongest card here and
 *  it is now false, so refundability takes its place — it is the honest answer
 *  to the same fear. */
const REASSURANCES = [
  {
    head: "Fully refundable",
    note: `Ask for your ${TOKEN_PRICE} back any time before your Lumi is dispatched.`,
  },
  {
    head: `${TOKEN_PRICE} now, ${BALANCE_PRICE} later`,
    note: "The balance is due only when your Lumi is ready to leave for you.",
  },
  {
    head: `Ships ${SHIP_DATE_TEXT}`,
    note: "Pre-orders are served first, in the order they were placed.",
  },
] as const;

/** The conversion finale, id="reserve" on every page.
 *  V4 (team feedback 2026-07-30, decisions D3/D5): the room is WHITE and the
 *  plush lineup is gone — nothing competes with the ask. The orange is on the
 *  button (D1).
 *
 *  2026-08-22 (§8.25): the Tally iframe is gone. Pre-orders are paid now, and
 *  payment lives on store.kheelona.com, so this room's job changed from
 *  "hold the form" to "settle the decision, then hand over cleanly". It is the
 *  ONLY place on the marketing site that links out to the store: every other
 *  CTA anchors here first, so a parent always reads the price, the refund
 *  promise and the ship date before a payment form can open.
 *
 *  `variant="full"` (Home, Lumi): big headline. `variant="compact"`: the ask at
 *  interior scale. */
export function FinaleCTA({
  variant = "full",
  bare = false,
  share = true,
}: {
  variant?: "full" | "compact";
  /** Revamp M2: content-only, for composition inside a Room (the Room then
   *  owns id="reserve"). */
  bare?: boolean;
  /** V3: the WhatsApp share line under the small print. */
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
          Pre-order Lumi before the price goes up.
        </h2>
        {/* V6 D11: exactly the offer line + the hold promise. Repetition builds
            trust only when it is verbatim — three paraphrases of one price
            read like three offers. */}
        <p className="mb-8 max-w-[50ch] text-[19px] font-bold text-ink-head md:text-[21px]">
          {PREORDER_OFFER_LINE} {PRICE_HOLD_LINE}
        </p>
      </Reveal>
      {/* V5-2: the reserve moment lost its weight when V4 turned the finale
          white — the most important section on the site became a blank page
          with a form on it. These three answers give it substance exactly
          where the decision happens. */}
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
        {/* V3: the deal on the subscription, said before the ask and not
            after the purchase (gate V3-b keeps the price out) */}
        <p className="mb-5 text-[15px] font-medium text-ink">{KHEELONA_PLUS_SHORT}</p>
        <Button href={STORE_URL}>{PREORDER_LABEL}</Button>
        {/* Leaving the domain is a real moment of doubt for a parent about to
            pay, so it is named rather than sprung on them. Razorpay is worth
            naming too: in India it is a trust signal, not jargon. */}
        <p className="mt-3 text-[15px] font-medium text-ink-muted">
          Pre-ordering opens our store, where Razorpay takes the payment
          securely. It takes about a minute.
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
