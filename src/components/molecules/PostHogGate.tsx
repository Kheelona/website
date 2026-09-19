"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  POSTHOG_API_HOST,
  POSTHOG_KEY,
  replayAllowedOnPath,
  shouldLoadPostHog,
} from "@/config/site";
import { phSetReplay, registerPostHog } from "@/lib/posthog";

/** Loads PostHog on production hosts only (2026-09-19).
 *
 *  The fifth measurement tool, and the widest: product analytics, session
 *  replay, error tracking, and autocapture ON (founder, 2026-09-19).
 *
 *  SAME SHAPE AS GoogleAnalyticsGate AND MetaPixel, for the same reasons. The
 *  host check runs in an effect rather than during render, because reading
 *  `location` while rendering would either force the whole site dynamic or
 *  mismatch on hydration; this way the statically prerendered pages stay static
 *  and the tag appears a tick later on the hosts that should have it. It is
 *  mounted last in the body so it never competes with the hero image, which
 *  owns mobile LCP (§8.19).
 *
 *  NOT `instrumentation-client.ts`, which this Next version offers and PostHog's
 *  own Next guide now prefers (node_modules/next/dist/docs/01-app/02-guides/analytics.md).
 *  That file runs before the application's frontend code on EVERY host, so it
 *  would still need this hostname gate, and it would put a ~60KB SDK plus a
 *  session recorder in front of first paint on a site whose standing law is that
 *  nothing competes with the hero image. The repo's existing pattern is both
 *  safer here and consistent with the four tools already in this layout.
 *
 *  THE IMPORT IS DYNAMIC, and that is load-bearing rather than stylistic. A
 *  static `import posthog from "posthog-js"` would put the SDK in the shared
 *  client bundle on every host, including localhost and every preview deploy
 *  where the gate is shut and it can never run. Importing it only after the host
 *  check passes means those hosts download none of it. */
export function PostHogGate() {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldLoadPostHog(window.location.hostname)) return;

    let cancelled = false;

    void import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;

      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_API_HOST,
        /* `ui_host` is deliberately NOT set. It was set to the asset host in a
           first draft, which was wrong and was caught by reading the SDK rather
           than the marketing docs: the router resolves `endpointFor("ui", …)`
           against `uiHost`, so that value is what PostHog builds deep links back
           to its own dashboard from (person URLs, recording URLs, and the tags
           attached to captured exceptions). Pointing it at a CDN would have
           silently produced dead links in the founder's inbox. It only needs
           setting when `api_host` is a reverse proxy, and ours is not.

           The asset origin needs no configuration either: for region `us` the
           router derives `https://us-assets.i.posthog.com` from `api_host`
           itself. POSTHOG_ASSET_HOST exists so the CSP and this file name the
           same origin, not because the SDK is told it. */

        /* Autocapture ON (founder, 2026-09-19): clicks, changes and submits
           sitewide with no per-element code. Note what this does NOT do —
           posthog-js never sends the VALUE of an input via autocapture. What it
           does send is the text of the element interacted with, which is why
           the nodes printing a parent's own details carry `ph-no-capture`. */
        autocapture: true,

        /* Error tracking (founder, 2026-09-19): uncaught exceptions and
           unhandled promise rejections. */
        capture_exceptions: true,

        /* NEVER START ON ITS OWN. Replay is turned on per route by the effect
           below, so a denied route never has a recorder running to leak from.
           Starting here and stopping later would mean the confirmation page is
           recorded for however long the stop takes to run. */
        disable_session_recording: true,

        session_recording: {
          /* Every value a parent types becomes asterisks in the recording and
             never leaves the browser. This is posthog-js's default; it is
             written out because inheriting a default on a page where someone
             types their phone number and address is not a decision anyone can
             later see was made. */
          maskAllInputs: true,
          /* Masking inputs covers what a parent TYPES. It does nothing for what
             we PRINT, which is this site's actual exposure: order summaries
             recite an email, an order number and a delivery address as text.
             `/store/thanks` is excluded from replay wholesale for that reason,
             and this selector is the defence in depth for every other place a
             detail is rendered back. */
          maskTextSelector: ".ph-mask",
        },

        /* Anonymous, on purpose, and no `identify()` call anywhere in this
           round. Funnels work on the anonymous distinct_id, so nothing is lost
           except a billable person profile per visitor — and a parent's order
           never gets welded to a browsing identity. */
        person_profiles: "identified_only",

        /* The SDK captures the first page view itself and follows client-side
           navigations through the History API, so this component does not need
           the skip-first-run pathname effect MetaPixel carries. Stated because
           the absence of that code looks like an omission beside its sibling. */
        capture_pageview: "history_change",
      });

      registerPostHog(posthog);
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  /* Replay follows the route, not the visit. Runs on every navigation once the
     SDK is up, including the first, so a visitor landing straight on a denied
     route never starts a recording. */
  useEffect(() => {
    if (!ready) return;
    phSetReplay(replayAllowedOnPath(pathname));
  }, [ready, pathname]);

  return null;
}
