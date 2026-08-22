import { cn } from "@/lib/cn";
import { Footnote } from "@/components/molecules/FootnotesRow";
import { KHEELONA_PLUS_LINE } from "@/config/site";

/** The Kheelona+ band (V3) — the subscription, stated plainly.
 *
 *  This exists because of what the category taught us: Miko's own reviews say
 *  the toy "isn't as good" without the subscription, MyWonder meters talk-time
 *  at ₹1 a minute, and Oura hides pricing entirely. All three breed the same
 *  resentment. So we say the deal in one sentence, up front, next to the
 *  reassurance that nothing renews on its own.
 *
 *  HARD RULE (gate V3-b): the monthly price and what happens if the
 *  subscription lapses are founder-gated. Never render a ₹ amount here, and
 *  never claim post-lapse behaviour. The wording lives in `config/site` so a
 *  price cannot creep in through a call site.
 *
 *  Composition mirrors the /playos one-prompt band, deliberately: parents meet
 *  the same shape for "here is a thing you should know" on every page.
 *  `footnote` mounts the small-print marker on pages that render FootnotesRow
 *  (Home and /products/lumi). */
export function KheelonaPlusBand({
  footnote,
  className,
}: {
  footnote?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "items-center gap-8 rounded-(--radius-card-lg) border border-line-soft bg-white p-7 md:flex md:p-9",
        className,
      )}
    >
      <p className="mb-4 shrink-0 font-display text-[26px] font-extrabold leading-[1.15] text-ink-head md:mb-0">
        Kheelona<span className="text-orange-deep">+</span>
        {footnote ? <Footnote n={footnote} id="fn-kheelona-plus" /> : null}
      </p>
      <div>
        <p className="mb-3 max-w-[58ch] text-[17px]">{KHEELONA_PLUS_LINE}</p>
        {/* 2026-08-22: "You pay nothing today" led this line for a year and is
            now false. The half that mattered is the half that survives — a
            parent's real fear here is a silent renewal, not the first ₹499. */}
        <p className="max-w-[58ch] font-display text-[17px] font-bold text-ink-head">
          Nothing renews without you, ever.
        </p>
      </div>
    </div>
  );
}
