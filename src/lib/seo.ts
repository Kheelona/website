/**
 * SEO utilities for generating meta tags, OpenGraph, and structured data
 */

import type { Metadata } from "next";

export interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
  canonicalUrl?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Generate base Metadata object for pages
 */
export function generateMetadata(seo: SeoMeta, baseUrl: string = "https://kheelona.com"): Metadata {
  const title = seo.title || "Kheelona | Smartest Playmates for Brightest Minds";
  const description =
    seo.description ||
    "Meet Lumi - The most intelligent AI-powered talking toy for your child. Screen-free, educational, and speaks 10+ languages.";
  const ogImage = seo.ogImage || "/images/lifestyle/all-colors-group-1.jpg";
  const ogUrl = seo.ogUrl || baseUrl;

  return {
    title,
    description,
    keywords: seo.keywords,
    authors: seo.author ? [{ name: seo.author }] : undefined,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: seo.canonicalUrl || ogUrl,
    },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: ogUrl,
      siteName: "Kheelona",
      locale: "en_US",
      type: seo.ogType || "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: seo.ogTitle || title,
        },
      ],
    },
    twitter: {
      card: seo.twitterCard || "summary_large_image",
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      images: [ogImage],
    },
  };
}

/**
 * Generate JSON-LD Product schema
 */
export interface ProductSchemaData {
  name: string;
  description: string;
  image: string | string[];
  url: string;
  price: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued";
  rating?: number;
  reviewCount?: number;
  brand?: string;
  sku?: string;
}

export function generateProductSchema(product: ProductSchemaData) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url,
    brand: {
      "@type": "Brand",
      name: product.brand || "Kheelona",
    },
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: product.currency || "INR",
      availability: `https://schema.org/${product.availability || "InStock"}`,
      url: product.url,
    },
    ...(product.rating &&
      product.reviewCount && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating.toString(),
          reviewCount: product.reviewCount.toString(),
        },
      }),
    ...(product.sku && { sku: product.sku }),
  };
}

/**
 * Generate JSON-LD BreadcrumbList schema
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(baseUrl: string, breadcrumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Generate JSON-LD FAQPage schema
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export function generateFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
