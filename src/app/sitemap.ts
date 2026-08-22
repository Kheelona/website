import type { MetadataRoute } from "next";
import { STORIES } from "@/lib/stories";

const BASE = "https://kheelona.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1.0 },
    { path: "/products/lumi", priority: 0.9 },
    { path: "/playos", priority: 0.8 },
    { path: "/safety", priority: 0.8 },
    { path: "/team", priority: 0.6 },
    { path: "/stories", priority: 0.7 },
    { path: "/setup", priority: 0.5 },
    { path: "/contact", priority: 0.4 },
    { path: "/privacy", priority: 0.3 },
    { path: "/terms", priority: 0.3 },
    /* Policy pages carry real weight now that money changes hands: a parent
       looks for the refund terms before paying, and Razorpay's review looks
       for them too. */
    { path: "/refund", priority: 0.3 },
    { path: "/shipping", priority: 0.3 },
  ];
  return [
    ...pages.map((p) => ({
      url: `${BASE}${p.path}`,
      lastModified: new Date(),
      priority: p.priority,
    })),
    ...STORIES.map((s) => ({
      url: `${BASE}/stories/${s.slug}`,
      lastModified: new Date(),
      priority: 0.6,
    })),
  ];
}
