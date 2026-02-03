import type { Metadata } from "next";
import { Lato, Luckiest_Guy } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import "./globals.css";

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://kheelona.com/#organization",
      name: "Kheelona Robotics",
      url: "https://kheelona.com",
      logo: {
        "@type": "ImageObject",
        url: "https://kheelona.com/images/logos/kheelona-logo.png",
      },
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://kheelona.com/#website",
      url: "https://kheelona.com",
      name: "Kheelona",
      description: "Smartest Playmates for Brightest Minds",
      publisher: {
        "@id": "https://kheelona.com/#organization",
      },
    },
    {
      "@type": "Product",
      "@id": "https://kheelona.com/#product",
      name: "Lumi - AI-Powered Talking Toy",
      description:
        "The most intelligent AI-powered talking toy for children. Screen-free, educational, and speaks 10+ languages.",
      image: "https://kheelona.com/images/products/lumi-blue/front.png",
      brand: {
        "@type": "Brand",
        name: "Kheelona",
      },
      offers: {
        "@type": "Offer",
        price: "2999",
        priceCurrency: "INR",
        availability: "https://schema.org/PreOrder",
        url: "https://kheelona.com/product",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "50",
      },
    },
  ],
};

export const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
  preload: true,
});

const luckiestGuy = Luckiest_Guy({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-luckiest-guy",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Kheelona | Smartest Playmates for Brightest Minds",
  description:
    "Meet Lumi - The most intelligent AI-powered talking toy for your child. Screen-free, educational, and speaks 10+ languages. Pre-order now!",
  keywords: [
    "AI toy",
    "educational toy",
    "talking toy",
    "Lumi",
    "Kheelona",
    "children toy",
    "screen-free toy",
    "learning toy",
    "smart toy",
  ],
  authors: [{ name: "Kheelona Robotics" }],
  creator: "Kheelona Robotics",
  publisher: "Kheelona Robotics",
  metadataBase: new URL("https://kheelona.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kheelona | Smartest Playmates for Brightest Minds",
    description:
      "Meet Lumi - The most intelligent AI-powered talking toy for your child. Screen-free, educational, and speaks 10+ languages.",
    url: "https://kheelona.com",
    siteName: "Kheelona",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/lifestyle/all-colors-group-1.jpg",
        width: 1200,
        height: 630,
        alt: "Lumi - AI-Powered Talking Toys in Pink, Blue, and Green",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kheelona | Smartest Playmates for Brightest Minds",
    description: "Meet Lumi - The most intelligent AI-powered talking toy for your child.",
    images: ["/images/lifestyle/all-colors-group-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lato.variable} ${luckiestGuy.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary>{children}</ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
