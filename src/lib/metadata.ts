/**
 * Centralized metadata generation for SEO consistency across all pages
 * Follows ISO/IEC 40500 (WCAG 2.1) and SEO best practices
 */

import type { Metadata } from "next";

const BASE_URL = "https://kheelona.com";
const SITE_NAME = "Kheelona";
const DEFAULT_OG_IMAGE = "/images/og-image.jpg";

export interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

/**
 * Generate consistent metadata for any page
 * Includes hreflang, OpenGraph, Twitter, and AI crawler meta tags
 */
export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    path,
    ogImage = DEFAULT_OG_IMAGE,
    ogType = "website",
    noIndex = false,
    publishedTime,
    modifiedTime,
    authors = ["Kheelona Robotics"],
  } = options;

  const fullUrl = `${BASE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  // Base keywords that apply to all pages
  const baseKeywords = ["Kheelona", "Lumi", "AI toy", "educational toy", "screen-free toy"];

  const allKeywords = [...new Set([...keywords, ...baseKeywords])];

  return {
    title,
    description,
    keywords: allKeywords,
    authors: authors.map((name) => ({ name, url: BASE_URL })),
    creator: "Kheelona Robotics",
    publisher: "Kheelona Robotics",
    metadataBase: new URL(BASE_URL),

    // Canonical and language alternates (hreflang)
    alternates: {
      canonical: path,
      languages: {
        "en-US": path,
        "en-IN": path,
        "hi-IN": path, // Hindi (India)
        "x-default": path,
      },
    },

    // OpenGraph metadata
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      alternateLocale: ["en_IN", "hi_IN"],
      type: ogType,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/jpeg",
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@kheelona_toys",
      site: "@kheelona_toys",
    },

    // Robots directives
    robots: {
      index: !noIndex,
      follow: true,
      nocache: false,
      googleBot: {
        index: !noIndex,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // AI/LLM specific meta tags
    other: {
      // Structured description for AI crawlers
      "ai:description": description,
      "ai:keywords": allKeywords.join(", "),
      "ai:content-type": ogType,
      "ai:language": "en",
      "ai:region": "IN",

      // Dublin Core metadata (ISO 15836)
      "DC.title": title,
      "DC.description": description,
      "DC.creator": "Kheelona Robotics",
      "DC.publisher": "Kheelona Robotics",
      "DC.language": "en",
      "DC.type": ogType === "article" ? "Text" : "Service",

      // Additional SEO meta tags
      "geo.region": "IN",
      "geo.placename": "India",
      "content-language": "en-US, en-IN, hi-IN",

      // Mobile app meta
      "mobile-web-app-capable": "yes",
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": SITE_NAME,

      // Microsoft/IE meta
      "msapplication-TileColor": "#EF762F",
      "msapplication-config": "/browserconfig.xml",
    },
  };
}

/**
 * Generate JSON-LD BreadcrumbList for a page
 */
export function generateBreadcrumbs(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate JSON-LD WebPage schema
 */
export function generateWebPageSchema(options: {
  name: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}${options.url}#webpage`,
    url: `${BASE_URL}${options.url}`,
    name: options.name,
    description: options.description,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "en-US",
    ...(options.breadcrumbs && {
      breadcrumb: generateBreadcrumbs(options.breadcrumbs),
    }),
  };
}
