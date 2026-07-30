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
        /* Measured against the real form, not guessed: the live embed after
           the founder's 5-field edit (V4-a, 2026-07-31, hideTitle=1) is 827px
           tall — re-measured the day the fields changed, per this comment's
           own instruction. At the original 560px the SUBMIT BUTTON sat below
           the iframe's own fold, reachable only by scrolling inside the frame,
           on the one panel the whole site exists to convert. The headroom
           above 827px absorbs validation messages, which push fields down on
           a failed submit. Re-measure if fields change: open the embed URL
           directly and read documentElement.scrollHeight. */
        className="h-[900px] w-full"
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
