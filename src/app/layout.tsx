import type { Metadata } from "next";
import { preload } from "react-dom";
import "@/styles/site.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalyticsGate } from "@/components/tracking/GoogleAnalyticsGate";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { PostHogGate } from "@/components/tracking/PostHogGate";
import { CANONICAL_ORIGIN, SITE_ENV } from "@/config/env";
import { AHREFS_ANALYTICS_KEY } from "@/config/site";
import { organization } from "@/content/en-IN/organization";
import { FONT_PRELOADS } from "@/styles/generated/fonts.generated";

/* The root layout (architecture §4.1, §9.1, §10, §15.3; structure §3.1): what the marketing site and the store share.
 * The page chrome is each host's shell (src/layouts/SiteShell for (site) and the 404, src/layouts/StoreShell for the
 * store), never this file.
 *
 * - One CSS entry, src/styles/site.css: DS tokens, DS fonts, bundle.css, type steps, motion presets, composition, then
 *   a layout-only Tailwind (ADR-002).
 * - Metadata: relative URLs resolve against the production origin in every environment (so a beta page never
 *   canonicalises to itself); noindex, nofollow on beta only. Pages never set `robots` (pageMeta cannot), because
 *   Next merges metadata key by key and a page's `robots` would replace this one (N15). The title template is for
 *   the legacy pages until wave 5; new pages give `{ absolute }` titles.
 * - `data-scroll-behavior="smooth"`: motion.css's hook for the mockup's smooth anchor scrolling; Next 16 resets it to
 *   `auto` during route changes only when the attribute is there (architecture §11.3).
 * - The three font preloads are the faces every hero uses (generated list, ≤ 130 KB; QA N17), given to React's
 *   `preload()` as Next's metadata guide says: React puts each `<link rel="preload">` in the head once (a `<link>`
 *   written into the head by hand comes out twice, once hoisted and once in place).
 * - `body.ks-has-float`: every page carries the WhatsApp bubble (D050), so the last content of every page keeps clear
 *   of it (whatsapp-float.css). `kh-page` and the light theme are the mockup's body.
 * - The five measurement tools, unchanged (tracking inventory; architecture §8): Ahrefs in the document head and in
 *   the server HTML, because its verifier fetches the page and looks for the tag, async so it never holds up the
 *   first paint; not on beta (D048, D051). Vercel Web Analytics, GA4, the Meta Pixel and PostHog last in the body, so
 *   none competes with the hero image; GA4 and Meta load on production hosts only and PostHog on production and
 *   beta (their gates). What each collects is stated on /privacy, which changes in the same commit as any tool.
 */

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_ORIGIN),
  title: { default: organization.name, template: `%s · ${organization.name}` },
  ...(SITE_ENV === "beta" ? { robots: { index: false, follow: false } } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  for (const font of FONT_PRELOADS) preload(font.href, { as: "font", type: font.type, crossOrigin: "anonymous" });
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {SITE_ENV !== "beta" && <script src="https://analytics.ahrefs.com/analytics.js" data-key={AHREFS_ANALYTICS_KEY} async />}
      </head>
      <body className="kh-page ks-has-float" data-theme="light">
        {children}
        <Analytics />
        <GoogleAnalyticsGate />
        <MetaPixel />
        <PostHogGate />
      </body>
    </html>
  );
}
