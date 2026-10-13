"use client";

import { useEffect, useRef } from "react";
import { fbTrack, whenFbqReady } from "@/lib/fbq";

/** Reports a Meta `ViewContent` for Kheelu, once per page view (§8.30-j).
 *
 *  This is the top of the advertising funnel: the people who read the product
 *  page are the retargeting audience worth spending on, and the gap between
 *  ViewContent and InitiateCheckout is where interest stops turning into
 *  intent. It renders nothing.
 *
 *  ⚑ THE VALUE IS THE HEADLINE UNIT PRICE, AND IT IS DELIBERATELY STALE-ABLE
 *  (founder, 2026-09-01). It reports what Kheelu costs, ₹4,999, not what the
 *  checkout collects (a ₹499 token) — the two answer different questions, and
 *  for a browsing event the product's own price is the honest one.
 *
 *  The catch the founder accepted with eyes open: this figure becomes WRONG the
 *  day the 500-unit cap fills and the price becomes ₹7,999. A client component
 *  cannot read that mode, because the live paid count never leaves the server
 *  (§8.26-a/b), and deriving it properly would make this statically prerendered
 *  page dynamic, which is a real LCP cost on the best marketing page we have.
 *  So it is a manual change, and the thing that stops it being a silent time
 *  bomb is that it rides an existing trigger: the standing sell-out copy sweep
 *  (§8.26-g), run the day /api/health first reports `preorder:"full"`. This
 *  component is named in that checklist in Technical-Todo.md. **If you are here
 *  doing that sweep: switch this to FULL_AMOUNT_PAISE.**
 *
 *  Sourced from `LAUNCH_AMOUNT_PAISE` rather than typed as 4999, so it cannot
 *  drift away from the price the page itself renders.
 *
 *  Note that Purchase reports something different on purpose — the amount
 *  actually collected — so the two events are not comparable as a ratio.
 *
 *  It waits for `fbq` rather than calling `fbTrack` directly, because the pixel
 *  is gated behind a hostname check in an effect and then loads
 *  `afterInteractive` — so at mount it is usually not there yet, and a direct
 *  call would be silently dropped. See `whenFbqReady`.
 *
 *  SINCE TASK 2.6 THE PAGE PASSES THE VALUE (B9, ADR-005): `valuePaise` is the
 *  offer's headline, read on the server where the live mode is known, so the
 *  staleness above ends for every page that passes it, and Home (B9) and the
 *  product page send the same payload. Since task 5.2 replaced the legacy
 *  product page, its one mount without a value, there is no default: every
 *  mount passes `valuePaise` (test/guards/tracking-parity.test.ts). */
export function ViewContentTracker({ valuePaise }: { valuePaise: number }) {
  const fired = useRef(false);

  useEffect(() => {
    /* Strict Mode double-invokes effects in development, and the ref is what
       keeps that from becoming two events. Production hosts are unaffected
       either way, but the guard makes the intent explicit. */
    if (fired.current) return;
    fired.current = true;

    return whenFbqReady(() =>
      fbTrack("ViewContent", {
        content_name: "Kheelu",
        content_ids: ["lumi"],
        content_type: "product",
        value: valuePaise / 100,
        currency: "INR",
      }),
    );
    /* `[]` as at the tag (task 2.6 review): the value at first render is this page view's
       value. Re-running on a new `valuePaise` would clear the wait for fbq and then stop at
       the fired ref, so the page view would send no ViewContent at all. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
