import { PromiseMark } from "@/components/molecules/PromiseMark";
import {
  LAUNCH_PRICE,
  BALANCE_PRICE,
  FULL_PRICE,
  CAP_UNITS_TEXT,
  SHIP_DATE_TEXT,
  KHEELONA_PLUS_SHORT,
  TAX_LINE,
} from "@/config/site";

/** What a parent is agreeing to, on the page where they agree to it (§8.25-u).
 *
 *  Server-rendered and static: this is the page's most important text and it must
 *  be in the HTML, not assembled by a script. It is also the answer to the
 *  question the marketing site cannot fully settle, because the marketing site
 *  is not where the money moves: what exactly leaves my account today, what
 *  leaves it later, and what happens if I change my mind.
 *
 *  Two shapes since §8.26. "token": ₹499 now, the balance by a link before
 *  dispatch. "full": the whole price now and nothing afterwards. The mode is
 *  decided by the server with the tier; this component only words it. Event
 *  pages always render the token shape — an event token is a token. */
export function OrderSummary({
  amountLabel,
  tierLabel,
  mode = "token",
  balanceLabel = BALANCE_PRICE,
}: {
  amountLabel: string;
  tierLabel: string;
  mode?: "token" | "full";
  /** What is still owed before dispatch, already formatted by the server.
   *  Defaults to the public ₹4,500; event pages pass the derived figure
   *  (₹4,999 minus the token actually paid), so a ₹99 booking honestly reads
   *  ₹4,900 (2026-08-23, the Ideabaaz page). Like `amountLabel`, this is a
   *  label decided server-side — it changes sentences, never charges. */
  balanceLabel?: string;
}) {
  const lines =
    mode === "token"
      ? [
          { head: `${amountLabel} today`, note: tierLabel, mark: 0 },
          {
            head: `${balanceLabel} on dispatch`,
            note: `The rest of the ${LAUNCH_PRICE} price, by a link we send you. Never automatic.`,
            mark: 1,
          },
          {
            head: "Refundable in full",
            note: "Ask any time before we dispatch your Lumi, and no reason needed.",
            mark: 2,
          },
          {
            head: `Ships ${SHIP_DATE_TEXT}`,
            note: "Pre-orders go out first, in the order they were placed.",
            mark: 0,
          },
        ]
      : [
          { head: `${amountLabel} today`, note: tierLabel, mark: 0 },
          {
            head: "Nothing due on dispatch",
            note: "You have paid the whole price. No balance link, and nothing automatic.",
            mark: 1,
          },
          {
            head: "Refundable in full",
            note: "Ask any time before we dispatch your Lumi, and no reason needed.",
            mark: 2,
          },
          {
            head: `Ships ${SHIP_DATE_TEXT}`,
            note: "Pre-orders go out first, in the order they were placed.",
            mark: 0,
          },
        ];

  return (
    <div className="rounded-(--radius-card-lg) border border-line bg-white p-6 md:p-7">
      <h2 className="mb-5 font-display text-[22px] font-extrabold text-ink-head">
        What you are agreeing to
      </h2>
      <ul className="grid gap-4">
        {lines.map((line) => (
          <li key={line.head} className="flex items-start gap-3">
            <PromiseMark index={line.mark} size="w-6" className="mt-0.5 shrink-0" />
            <div>
              <p className="font-display text-[17px] font-extrabold leading-snug text-ink-head">
                {line.head}
              </p>
              <p className="mt-0.5 text-[14.5px] leading-snug text-ink-muted">{line.note}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-5 border-t border-line pt-4 text-[14px] leading-[1.55] text-ink-muted">
        {KHEELONA_PLUS_SHORT}{" "}
        {mode === "token"
          ? `The price is ${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT}, and ${FULL_PRICE} once they are gone.`
          : `The ${CAP_UNITS_TEXT} at ${LAUNCH_PRICE} have been reserved, and this order is at the ${FULL_PRICE} price.`}{" "}
        {TAX_LINE} Delivery in India is included.
      </p>
    </div>
  );
}
