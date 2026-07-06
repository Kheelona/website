import type { Metadata } from "next";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";

const glory = localFont({
  src: [
    { path: "./fonts/Glory.ttf", weight: "100 900", style: "normal" },
    { path: "./fonts/Glory-Italic.ttf", weight: "100 900", style: "italic" },
  ],
  variable: "--font-glory",
  display: "swap",
});

const instrumentSans = localFont({
  src: [{ path: "./fonts/InstrumentSans.ttf", weight: "100 900", style: "normal" }],
  variable: "--font-instrument-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kheelona.com"),
  title: {
    default: "Lumi by Kheelona: the screen-free AI robot toy for ages 3 to 6",
    template: "%s · Kheelona",
  },
  description:
    "Lumi is a screen-free AI robot toy that listens first, then talks back, in all 10 languages you speak at home. Reserve at ₹4,999. No payment now.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
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
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <StickyMobileCTA />
        <RevealObserver />
      </body>
    </html>
  );
}
