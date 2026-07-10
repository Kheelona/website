"use client";

import { useState } from "react";

const FORM_URL = process.env.NEXT_PUBLIC_TALLY_FORM_URL ?? "";
const isConfigured = FORM_URL.startsWith("https://tally.so/") && !FORM_URL.includes("DUMMY");

/** Pre-order capture adapter (blueprint §8.6). Tally owns storage, confirmation
 *  email, and the price hold. Fields are configured in Tally itself: parent name,
 *  email, WhatsApp number, WhatsApp consent, child's birth month, city.
 *  TODO(tally-form-url): placeholder panel renders until the founder provides
 *  NEXT_PUBLIC_TALLY_FORM_URL. Launch gate requires zero placeholders. */
export function TallyEmbed() {
  const [loaded, setLoaded] = useState(false);

  if (!isConfigured) {
    return (
      <div className="rounded-(--radius-card-lg) bg-white p-8 text-center">
        <p className="font-display text-[22px] font-extrabold text-ink-head">
          The pre-order list opens here soon.
        </p>
        <p className="mx-auto mt-2 max-w-[42ch] text-[16px] text-ink">
          ₹4,999 held for you, no payment now. We hold the price, you hold
          your place.
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
        title="Join the Lumi pre-order list"
        className="h-[560px] w-full"
        onLoad={() => { setLoaded(true); track("preorder_view"); }}
      />
      <p className="px-6 pb-4 text-center text-[14px] text-ink-muted">
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
