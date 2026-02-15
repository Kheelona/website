import type { Metadata, Viewport } from "next";
import { Lato, Luckiest_Guy } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

// JSON-LD Structured Data with enhanced schema for SEO and GEO
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": "https://kheelona.com/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://kheelona.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shop",
          item: "https://kheelona.com/shop",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Blog",
          item: "https://kheelona.com/blog",
        },
      ],
    },
    {
      "@type": "Organization",
      "@id": "https://kheelona.com/#organization",
      name: "Kheelona Robotics",
      url: "https://kheelona.com",
      logo: {
        "@type": "ImageObject",
        url: "https://kheelona.com/images/logo.png",
        width: 164,
        height: 40,
      },
      sameAs: [
        "https://www.instagram.com/kheelona_robotics/",
        "https://www.linkedin.com/company/kheelona/",
        "https://www.facebook.com/kheelona/",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
        email: "hello@kheelona.com",
      },
      foundingDate: "2023",
      description:
        "Kheelona Robotics creates AI-powered educational toys that help children learn through play. Our flagship product, Lumi, is a screen-free talking companion that speaks 10+ languages.",
    },
    {
      "@type": "WebSite",
      "@id": "https://kheelona.com/#website",
      url: "https://kheelona.com",
      name: "Kheelona",
      description:
        "Kheelona creates AI-powered educational toys. Meet Lumi - the smartest playmate for brightest minds.",
      publisher: {
        "@id": "https://kheelona.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://kheelona.com/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://kheelona.com/#webpage",
      url: "https://kheelona.com",
      name: "Kheelona | Smartest Playmates for Brightest Minds",
      isPartOf: { "@id": "https://kheelona.com/#website" },
      about: { "@id": "https://kheelona.com/#organization" },
      description:
        "Meet Lumi - The most intelligent AI-powered talking toy for your child. Screen-free, educational, and speaks 10+ languages. Pre-order now!",
      breadcrumb: { "@id": "https://kheelona.com/#breadcrumb" },
      inLanguage: "en-US",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://kheelona.com/images/og-image.jpg",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://kheelona.com/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://kheelona.com",
        },
      ],
    },
    {
      "@type": "Product",
      "@id": "https://kheelona.com/#product",
      name: "Lumi - AI-Powered Talking Toy",
      description:
        "Lumi is an AI-powered talking toy designed for children aged 2-8 years. It provides screen-free entertainment, educational content, and speaks 10+ languages including Hindi and English. Lumi tells stories, plays games, teaches vocabulary, and becomes your child's best learning companion.",
      image: [
        "https://kheelona.com/images/products/lumi-blue/front.png",
        "https://kheelona.com/images/products/lumi-green/front.png",
        "https://kheelona.com/images/products/lumi-pink-2.png",
      ],
      brand: {
        "@type": "Brand",
        name: "Kheelona",
      },
      manufacturer: {
        "@id": "https://kheelona.com/#organization",
      },
      category: "Educational Toys",
      audience: {
        "@type": "PeopleAudience",
        suggestedMinAge: 2,
        suggestedMaxAge: 8,
      },
      offers: {
        "@type": "Offer",
        price: "2999",
        priceCurrency: "INR",
        availability: "https://schema.org/PreOrder",
        url: "https://kheelona.com",
        priceValidUntil: "2025-12-31",
        seller: {
          "@id": "https://kheelona.com/#organization",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        bestRating: "5",
        worstRating: "1",
        reviewCount: "50",
        ratingCount: "50",
      },
      review: [
        {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          author: {
            "@type": "Person",
            name: "Gaurav Guha",
          },
          reviewBody:
            "My child's best friend. She takes Lumi everywhere. It has become an essential part of our daily routine.",
        },
        {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          author: {
            "@type": "Person",
            name: "Shweta Kiran",
          },
          reviewBody:
            "As a working mom in Bangalore, I was honestly tired of feeling guilty about screen time. Lumi changed that for me. Thank you.",
        },
        {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          author: {
            "@type": "Person",
            name: "Rohit Mehra",
          },
          reviewBody:
            "Lumi is now part of our daily routine. My kid actually asks for it instead of screens.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://kheelona.com/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is Lumi?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lumi is an AI-powered talking toy designed for children aged 2-8 years. It provides screen-free educational entertainment, tells stories, plays games, and speaks 10+ languages including Hindi and English.",
          },
        },
        {
          "@type": "Question",
          name: "What age is Lumi suitable for?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lumi is designed for children aged 2-8 years. The AI adapts its responses based on the child's age and learning level.",
          },
        },
        {
          "@type": "Question",
          name: "How many languages does Lumi support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lumi supports 10+ languages including English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, and Punjabi.",
          },
        },
        {
          "@type": "Question",
          name: "Is Lumi screen-free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, Lumi is completely screen-free. It uses voice interaction to engage children, reducing screen time while providing educational entertainment.",
          },
        },
        {
          "@type": "Question",
          name: "What can Lumi do?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Lumi can tell bedtime stories, teach vocabulary, play interactive games, answer questions, help with emotional development, and become your child's learning companion. It adapts to each child's interests and learning pace.",
          },
        },
      ],
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

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EF762F" },
    { media: "(prefers-color-scheme: dark)", color: "#EF762F" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Kheelona | Smartest Playmates for Brightest Minds",
    template: "%s | Kheelona",
  },
  description:
    "Meet Lumi - The most intelligent AI-powered talking toy for your child. Screen-free, educational, and speaks 10+ languages. Pre-order now for INR 2,999!",
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
    "AI talking toy for kids",
    "best educational toy India",
    "screen-free learning",
    "interactive toy for toddlers",
    "multilingual toy",
    "Hindi speaking toy",
    "kids learning companion",
  ],
  authors: [{ name: "Kheelona Robotics", url: "https://kheelona.com" }],
  creator: "Kheelona Robotics",
  publisher: "Kheelona Robotics",
  metadataBase: new URL("https://kheelona.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "en-IN": "/",
      "hi-IN": "/", // Hindi (India)
      "x-default": "/",
    },
  },
  category: "Education",
  classification: "Educational Toys",
  applicationName: "Kheelona",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // PWA manifest
  manifest: "/manifest.json",
  // Favicons and app icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#EF762F" }],
  },
  // Apple-specific meta tags
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kheelona",
  },
  openGraph: {
    title: "Kheelona | Smartest Playmates for Brightest Minds",
    description:
      "Meet Lumi - The most intelligent AI-powered talking toy for your child. Screen-free, educational, and speaks 10+ languages.",
    url: "https://kheelona.com",
    siteName: "Kheelona",
    locale: "en_US",
    alternateLocale: ["en_IN", "hi_IN"],
    type: "website",
    countryName: "India",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lumi - AI-Powered Talking Toy by Kheelona - Screen-free educational companion for children",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kheelona | Smartest Playmates for Brightest Minds",
    description:
      "Meet Lumi - The most intelligent AI-powered talking toy for your child. Screen-free, educational, and speaks 10+ languages.",
    images: ["/images/og-image.jpg"],
    creator: "@kheelona_toys",
    site: "@kheelona_toys",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  other: {
    // GEO optimization tags for AI search engines
    "ai:description":
      "Lumi by Kheelona is an AI-powered talking toy for children aged 2-8. It is screen-free, speaks 10+ languages including Hindi and English, tells stories, plays educational games, and helps with vocabulary and emotional development. Price: INR 2,999.",
    "ai:keywords":
      "Lumi, Kheelona, AI toy, educational toy, talking toy, screen-free toy, Hindi speaking toy, children learning companion",
    "ai:content-type": "website",
    "ai:language": "en, hi",
    "ai:region": "IN",
    "ai:audience": "parents, children, educators",

    // Dublin Core metadata (ISO 15836)
    "DC.title": "Kheelona - Smartest Playmates for Brightest Minds",
    "DC.creator": "Kheelona Robotics",
    "DC.subject": "Educational Toys, AI Toys, Children's Products",
    "DC.description":
      "AI-powered educational talking toys for children aged 2-8. Screen-free learning with 10+ language support.",
    "DC.publisher": "Kheelona Robotics",
    "DC.type": "Service",
    "DC.format": "text/html",
    "DC.language": "en",
    "DC.coverage": "India",
    "DC.rights": "Copyright 2024 Kheelona Robotics",

    // Geographic metadata
    "geo.region": "IN",
    "geo.placename": "Bangalore, India",
    "geo.position": "12.9716;77.5946",
    ICBM: "12.9716, 77.5946",

    // Content language
    "content-language": "en-US, en-IN, hi-IN",

    // Mobile app meta
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Kheelona",

    // Microsoft / IE meta
    "msapplication-TileColor": "#EF762F",
    "msapplication-TileImage": "/icons/icon-144x144.png",
    "msapplication-config": "/browserconfig.xml",

    // Accessibility
    "accessibility:purpose": "commercial",
    "accessibility:hazard": "none",
    "accessibility:control": "fullKeyboardControl, fullMouseControl, fullTouchControl",

    // Commerce
    "product:price:amount": "2999",
    "product:price:currency": "INR",
    "product:availability": "preorder",
    "product:brand": "Kheelona",
    "product:category": "Educational Toys",

    // LLMs.txt reference
    "llms-txt": "/llms.txt",
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
        <CartProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
