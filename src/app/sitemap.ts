import { MetadataRoute } from "next";

const BASE_URL = "https://kheelona.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Blog posts (would be dynamic in production)
  const blogPosts: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog/screen-time-alternatives-for-toddlers`,
      lastModified: new Date("2024-12-15"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/multilingual-children-benefits`,
      lastModified: new Date("2024-12-10"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/ai-toys-future-of-learning`,
      lastModified: new Date("2024-12-05"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/bedtime-stories-importance`,
      lastModified: new Date("2024-11-28"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/emotional-intelligence-children`,
      lastModified: new Date("2024-11-20"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/blog/choosing-educational-toys`,
      lastModified: new Date("2024-11-15"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Product pages (would be dynamic in production)
  const productPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/shop/lumi-sky-blue`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shop/lumi-mint-green`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/shop/lumi-coral-pink`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  return [...mainPages, ...productPages, ...blogPosts];
}
