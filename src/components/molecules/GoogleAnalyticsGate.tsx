"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA4_HOSTS, GA4_MEASUREMENT_ID } from "@/config/site";

/** Should GA4 load on this hostname?
 *
 *  Exported so the decision is testable without a browser. Everything about
 *  this component that could go wrong quietly lives in this one function: too
 *  loose and the founder's property fills with our own localhost and preview
 *  traffic, too tight and production measures nothing.
 *
 *  Case-insensitive because hostnames are, and port-free because
 *  `location.hostname` already excludes the port. */
export function shouldLoadGa4(hostname: string): boolean {
  return (GA4_HOSTS as readonly string[]).includes(hostname.toLowerCase());
}

/** Loads the Google tag (gtag.js) on production hosts only.
 *
 *  Manual install rather than Tag Manager (founder decision 2026-07-28, and
 *  what Google's own dialog recommends): GTM would ship a container runtime
 *  three times the size of gtag to solve a problem this repo does not have,
 *  since there is one deploy path and no marketer waiting on a release.
 *
 *  `@next/third-parties/google` is the approach this Next version documents
 *  (see node_modules/next/dist/docs/01-app/02-guides/third-party-libraries.md).
 *  It emits the same `gtag('config', ...)` as the copy-paste snippet but loads
 *  after hydration instead of blocking in `<head>`, which matters here: the
 *  hero image owns mobile LCP and nothing may compete with it (§8.19).
 *
 *  The host check runs in an effect, not during render, because the layout is
 *  statically generated. Reading `location` while rendering would either force
 *  the whole site dynamic or mismatch on hydration; this way the 31 static
 *  pages stay static and the tag simply appears a tick later on the hosts that
 *  should have it. */
export function GoogleAnalyticsGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(shouldLoadGa4(window.location.hostname));
  }, []);

  if (!enabled) return null;
  return <GoogleAnalytics gaId={GA4_MEASUREMENT_ID} />;
}
