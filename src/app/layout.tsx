import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalyticsGate } from "@/components/molecules/GoogleAnalyticsGate";
import { MetaPixel } from "@/components/molecules/MetaPixel";
import { AHREFS_ANALYTICS_KEY } from "@/config/site";

/* All three faces are subsets of the v3 design system's TTFs
   (Design/Kheelona-Design-System-v3/fonts, SIL OFL — licences alongside the
   woff2 files) since CS3 Phase A, 2026-08-23. Glory and Instrument Sans stay
   upright-only; the serif ships ITALIC ONLY, because that is its entire v3
   role. */
const glory = localFont({
  src: [{ path: "./fonts/Glory.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-glory",
  display: "swap",
});

const instrumentSans = localFont({
  src: [{ path: "./fonts/InstrumentSans.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-instrument-sans",
  display: "swap",
});

/* Instrument Serif, REINSTATED by founder order 2026-08-23 (decision #11,
   migration-to-new-dsx.md), reversing the 2026-07-24 retirement and the
   zero-italics law with it — but only this far: v3's editorial accent is
   italic serif for section titles and pull-quotes, used sparingly, one per
   composition (v3 guidelines/typography.md §1). Body copy and UI never
   take italics; JONY specs each placement page by page in Phase B. */
const instrumentSerif = localFont({
  src: [{ path: "./fonts/InstrumentSerifItalic.woff2", weight: "400", style: "italic" }],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kheelona.com"),
  title: {
    default: "Kheelu by Kheelona: the screen-free friend that grows with your child, ages 3+",
    template: "%s · Kheelona",
  },
  description:
    "Kheelu is a screen-free talking friend for ages 3+. It listens first, then talks back, tells stories, and slips learning into the play, in up to 10 languages you speak at home. Pre-order at ₹4,999 with a refundable ₹499.",
  openGraph: {
    siteName: "Kheelona",
    type: "website",
    /* GEO: India-first, and stated. "AI toy India" style queries reward an
       explicit locale, and the offer (₹, WhatsApp, the refundable token) is only
       true here. */
    locale: "en_IN",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

/* 2026-08-22 (§8.25-z): the marketing chrome and the Organization graph moved
   OUT of this file into components/templates/SiteChrome, rendered by the
   (site) route group. This layout is now only what BOTH kinds of page share:
   the html element, the fonts, and the three measurement tags. The store gets
   its own chrome, and no longer inherits a navbar whose CTA points at an
   anchor it does not have. */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${glory.variable} ${instrumentSans.variable} ${instrumentSerif.variable}`}
    >
      <head>
        {/* Marks JS availability before first paint so reveal styles only apply
            when the observer will actually run (see globals.css). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {/* Ahrefs Web Analytics. In the <head> and in the SSR HTML on purpose:
            Ahrefs verifies by fetching the page and looking for this tag, so the
            deferred client-side pattern GA4 uses would fail its check. `async`
            keeps it off the parser's critical path, so the hero image still owns
            LCP. What it collects is stated on /privacy. */}
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key={AHREFS_ANALYTICS_KEY}
          async
        />
      </head>
      <body>
        {children}
        {/* Vercel Web Analytics: page views and visitors, cookieless, no
            cross-site tracking and no fingerprinting. Last element in the body
            so its script never competes with the hero image, which owns mobile
            LCP (§8.19). It only reports from a Vercel deployment; locally it is
            a no-op. What it collects is stated on /privacy. */}
        <Analytics />
        {/* GA4 (gtag.js), manual install, production hosts only — see the
            component for why the host gate exists and why it is not GTM. */}
        <GoogleAnalyticsGate />
        {/* Meta Pixel (2026-09-01), for Facebook and Instagram advertising.
            Production hosts only, like GA4, and last in the body for the same
            LCP reason. Unlike the three tools above it, this one sets a cookie
            (_fbp) and follows a visitor to other sites, which is its purpose
            and is why /privacy had to be rewritten rather than extended. */}
        <MetaPixel />
      </body>
    </html>
  );
}
