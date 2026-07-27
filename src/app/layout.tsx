import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { RevealObserver } from "@/components/molecules/RevealObserver";
import { SiteBackdrop } from "@/components/atoms/SiteBackdrop";
import { KheeluGuide } from "@/components/organisms/KheeluGuide";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalyticsGate } from "@/components/molecules/GoogleAnalyticsGate";
import { graph } from "@/lib/seo";

const glory = localFont({
  // Upright faces only: italics are banned site-wide (R5 typography rule,
  // founder 2026-07-10), so italic font files would be dead preloaded bytes.
  src: [{ path: "./fonts/Glory.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-glory",
  display: "swap",
});

const instrumentSans = localFont({
  src: [{ path: "./fonts/InstrumentSans.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-instrument-sans",
  display: "swap",
});

// Instrument Serif retired 2026-07-24 (founder revamp decision: two fonts
// only — Glory + Instrument Sans). Human quotes now use the display face.

export const metadata: Metadata = {
  metadataBase: new URL("https://kheelona.com"),
  title: {
    default: "Lumi by Kheelona: the screen-free friend that learns with your child, ages 2 to 5",
    template: "%s · Kheelona",
  },
  description:
    "Lumi is a screen-free talking friend for ages 2 to 5. It listens first, then talks back, tells stories, and slips learning into the play, in up to 10 languages you speak at home. Reserve at ₹4,999. No payment now.",
  openGraph: {
    siteName: "Kheelona",
    type: "website",
    /* GEO: India-first, and stated. "AI toy India" style queries reward an
       explicit locale, and the offer (₹, WhatsApp, first 500 units) is only
       true here. */
    locale: "en_IN",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

/* The entity graph moved to lib/seo.ts in the V3 SEO pass: every page now
   emits the same Organization and WebSite nodes by @id, so an answer engine
   builds ONE picture of the company (with the founders' credentials, which is
   our strongest E-E-A-T signal) instead of a thin island per page. */
const ORG_JSON_LD = graph();

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      suppressHydrationWarning
      className={`${glory.variable} ${instrumentSans.variable}`}
    >
      <head>
        {/* Marks JS availability before first paint so reveal styles only apply
            when the observer will actually run (see globals.css). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        {/* Revamp M1: one warm CSS sky behind every route (theme B) */}
        <SiteBackdrop />
        <Navbar />
        <main>{children}</main>
        <Footer />
        {/* Revamp M1: the persistent narrator; its mobile dock ABSORBS the
            old StickyMobileCTA (same hide-at-#reserve contract) */}
        <KheeluGuide />
        <RevealObserver />
        {/* Vercel Web Analytics: page views and visitors, cookieless, no
            cross-site tracking and no fingerprinting. Last element in the body
            so its script never competes with the hero image, which owns mobile
            LCP (§8.19). It only reports from a Vercel deployment; locally it is
            a no-op. What it collects is stated on /privacy. */}
        <Analytics />
        {/* GA4 (gtag.js), manual install, production hosts only — see the
            component for why the host gate exists and why it is not GTM. */}
        <GoogleAnalyticsGate />
      </body>
    </html>
  );
}
