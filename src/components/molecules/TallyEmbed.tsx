"use client";

import { useState } from "react";
import { LAUNCH_PRICE, TALLY_FORM_URL } from "@/config/site";

/* V4-a (2026-07-31): the form URL now defaults to the public constant in
   config/site so the preview and local builds render the REAL form (the env
   var was production-scoped, which kept the founder from reviewing the form
   on the demo site). A valid env value still wins; a DUMMY one falls through
   to the constant. */
const ENV_URL = process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "";
const envValid = ENV_URL.startsWith("https://tally.so/") && !ENV_URL.includes("DUMMY");
const FORM_URL = envValid ? ENV_URL : TALLY_FORM_URL;
const isConfigured = FORM_URL.startsWith("https://tally.so/") && !FORM_URL.includes("DUMMY");

/** Pre-order capture adapter (blueprint §8.6). Tally owns storage, confirmation
 *  email, and the price hold. Fields are configured in Tally itself — 5 as of
 *  2026-07-31 (founder edit, V4-a): parent name, kid's age, city, WhatsApp
 *  number, WhatsApp consent. The placeholder branch survives only as the
 *  graceful state if the constant is ever blanked. */
export function TallyEmbed() {
  const [loaded, setLoaded] = useState(false);

  if (!isConfigured) {
    return (
      <div className="rounded-(--radius-card-lg) bg-white p-8">
        <p className="font-display text-[22px] font-extrabold text-ink-head">
          The pre-order list opens here soon.
        </p>
        <p className="mt-2 max-w-[42ch] text-[16px] text-ink">
          {LAUNCH_PRICE} held for you, no payment now. We hold the price, you
          hold your place.
        </p>
      </div>
    );
  }

  const embedUrl = `${FORM_URL}${FORM_URL.includes("?") ? "&" : "?"}transparentBackground=1&hideTitle=1`;

  // Analytics stub: real GA4 wiring lands in the pre-order sprint.
  const track = (event: string) => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", event);
  };

  return (
    <div className="relative overflow-hidden rounded-(--radius-card-lg) bg-white">
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center text-ink-muted" aria-hidden="true">
          Loading the form…
        </div>
      )}
      <iframe
        src={embedUrl}
        title="Reserve Lumi: the pre-order form"
        /* MEASURED, never guessed (§8.23-2) — and measured INSIDE THIS IFRAME,
           which is the part that is easy to get wrong. Loading the Tally URL
           standalone renders the form in a 700px-wide centred layout and
           reports ~721px; inside our ~680px iframe the same form is 609px. Two
           readings of "the same" form, 112px apart. Measure where it ships.
           As of the 5-field form (2026-07-31), submit bottom sits at:
             609px in the 680px desktop iframe
             627px in the 290px mobile iframe  ← TALLER, because a narrow frame
             wraps labels and fields onto more lines. Mobile therefore needs the
             taller frame, which is the opposite of the obvious guess.
           The previous flat 900px left 191px of dead white on desktop and 93px
           on mobile with Tally's badge floating alone in it — the "excessive
           white space" the review flagged, on the one panel the whole site
           exists to convert. Heights below keep ~100px (mobile) / ~80px
           (desktop) of headroom, because a failed submit adds roughly 24px per
           errored field.
           RE-MEASURE whenever the fields change: scratchpad/iframe-measure.mjs
           reads the submit button's bottom from inside the live frame. */
        className="h-[730px] w-full sm:h-[690px]"
        onLoad={() => { setLoaded(true); track("preorder_view"); }}
      />
      <p className="px-6 pb-4 text-[14px] text-ink-muted">
        Form not loading?{" "}
        <a
          href={FORM_URL}
          onClick={() => track("preorder_open_fallback")}
          className="font-semibold text-ink-head underline"
        >
          Open it in a new tab
        </a>
      </p>
    </div>
  );
}
