import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";
import { RevealObserver } from "@/components/molecules/RevealObserver";
import { SiteBackdrop } from "@/components/atoms/SiteBackdrop";
import { KheeluGuide } from "@/components/organisms/KheeluGuide";

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
    default: "Lumi by Kheelona: the screen-free AI robot toy for ages 3 to 6",
    template: "%s · Kheelona",
  },
  description:
    "Lumi is a screen-free AI robot toy that listens first, then talks back, in all 10 languages you speak at home. Reserve at ₹4,999. No payment now.",
  openGraph: {
    siteName: "Kheelona",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kheelona",
  url: "https://kheelona.com",
  logo: "https://kheelona.com/brand/logo-mark.png",
  sameAs: ["https://kheelona.ai"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
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
      </body>
    </html>
  );
}
