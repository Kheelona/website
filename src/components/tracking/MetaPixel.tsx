"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { META_PIXEL_HOSTS, META_PIXEL_ID } from "@/config/site";
import "@/lib/fbq";

/** Should the Meta Pixel load on this hostname?
 *
 *  Exported so the decision is testable without a browser, exactly as
 *  `shouldLoadGa4` is. The stake is higher here than for GA4: a page view from
 *  a preview deploy does not just dirty a report, it joins a retargeting
 *  audience and feeds the conversion signal Meta spends the founder's ad budget
 *  against.
 *
 *  Case-insensitive because hostnames are, and port-free because
 *  `location.hostname` already excludes the port. */
export function shouldLoadMetaPixel(hostname: string): boolean {
  return (META_PIXEL_HOSTS as readonly string[]).includes(hostname.toLowerCase());
}

/** Fires PageView on client-side navigations, and only on those.
 *
 *  The init script below already fires the first PageView, so the first run of
 *  this effect must be skipped or every landing counts twice — which would
 *  quietly halve every conversion rate Meta reports.
 *
 *  `usePathname` alone, deliberately: `useSearchParams` would need a Suspense
 *  boundary and can bail pages out of static rendering, and it buys nothing
 *  here. A query string only changes on a full page load (an ad click landing
 *  with utm params, say), and a full load runs the init script, which fires
 *  PageView itself. */
function PageViewOnRouteChange() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}

/** Loads the Meta Pixel on production hosts only.
 *
 *  Same shape as GoogleAnalyticsGate, and for the same reason: the host check
 *  runs in an effect rather than during render, because reading `location`
 *  while rendering would either force the whole site dynamic or mismatch on
 *  hydration. This way the statically prerendered pages stay static and the tag
 *  appears a tick later on the hosts that should have it.
 *
 *  `afterInteractive` keeps it off the critical path: the hero image owns
 *  mobile LCP and nothing may compete with it (§8.19), which is also why this
 *  is mounted last in the body rather than in the head.
 *
 *  NO <noscript> FALLBACK, on purpose. The usual copy-paste snippet includes a
 *  tracking <img> for visitors without JavaScript. It cannot be host-gated,
 *  since gating it needs the JavaScript it exists to replace, so it would
 *  report every preview and local load straight into the ad account. It would
 *  buy a bare page view from visitors who cannot be retargeted anyway, on a
 *  site whose section reveals need JavaScript to appear at all.
 *
 *  What it collects is stated on /privacy, in the same commit that added it
 *  (§8.21-c, test/analytics-tags.test.ts). */
export function MetaPixel() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(shouldLoadMetaPixel(window.location.hostname));
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <PageViewOnRouteChange />
    </>
  );
}
