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
      <div className="rounded-(--radius-card-lg) border-[1.5px] border-dashed border-line bg-white p-8 text-center">
        <p className="text-[13px] font-bold uppercase tracking-wider text-orange-deep">
          Pre-order form pending
        </p>
        <p className="mx-auto mt-2 max-w-[40ch] text-[15px] text-ink-muted">
          The reservation form connects here. We hold the price, you hold your
          place.
        </p>
      </div>
    );
  }

  const embedUrl = `${FORM_URL}${FORM_URL.includes("?") ? "&" : "?"}transparentBackground=1&hideTitle=1`;

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
        onLoad={() => setLoaded(true)}
      />
      <p className="px-6 pb-4 text-center text-[14px] text-ink-muted">
        Form not loading?{" "}
        <a href={FORM_URL} className="font-semibold text-blue underline">
          Open it in a new tab
        </a>
      </p>
    </div>
  );
}
