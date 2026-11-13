"use client";

import { useEffect } from "react";
import { loadOpenAiPixel, shouldLoadOpenAiPixel, startOpenAiAttribution } from "@/lib/ads/openai-pixel";

/** Run `run` when the browser is next idle, at most 2 s from now (the same budget the replay recorder gets in
 *  tracking-shell.ts), so the SDK never competes with the first paint. */
function whenIdle(run: () => void): void {
  if (typeof requestIdleCallback === "function") requestIdleCallback(run, { timeout: 2000 });
  else setTimeout(run, 200);
}

/** OpenAI's Ads Measurement Pixel on the store, and on any React-rendered page of kheelona.com (F6, D069).
 *
 *  Same shape as MetaPixel and GoogleAnalyticsGate, and for the same reason: the host check runs in an effect, not
 *  during render, so statically prerendered pages stay static and the tag appears a tick later on the hosts that
 *  should have it. The decisions themselves (host list, team device, the automatic-advanced-matching guard, the page
 *  list) are in src/lib/ads/openai-pixel.ts, shared with the marketing tracking shell.
 *
 *  The queue stub goes in at once, so the funnel's `checkout_started` and `order_created` (preorderAnalytics) are
 *  queued even if the visitor is quicker than the browser's idle time; the configuration check and the SDK script wait
 *  for idle. `page_viewed` is sent once per full page load: the store is effectively one page, so there is no
 *  route-change counterpart to PageViewOnRouteChange.
 *
 *  Renders nothing. What this tool collects is stated on /privacy; that page is a founder-approved legal page and its
 *  wording is proposed in the F6 spec, not changed here (D067). */
export function OpenAiPixel() {
  useEffect(() => {
    if (!shouldLoadOpenAiPixel(window.location.hostname)) return;
    startOpenAiAttribution();
    void loadOpenAiPixel({ schedule: whenIdle });
  }, []);

  return null;
}
