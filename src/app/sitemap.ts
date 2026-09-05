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
  /* NO `lastModified`, deliberately (2026-09-05).
   *
   *  Every entry used to carry `new Date()`, evaluated at build time. That told
   *  Google all 31 URLs — including nineteen journal articles nobody had
   *  touched — changed on every single deploy. Verified in the live sitemap on
   *  2026-09-05: 31 lastmod values, one distinct timestamp between them.
   *
   *  A lastmod that always says "just now" is not a weak signal, it is a
   *  discredited one: a crawler that learns the field is noise stops weighting
   *  it, and we lose the ability to say "this page really did change" on the day
   *  it matters — the sell-out copy sweep, or a price move.
   *
   *  Omitting the field is explicitly better than guessing it. We have no
   *  trustworthy per-page modification date: articles carry month precision at
   *  best (JOURNAL_REVIEWED), and the marketing routes have none at all. When a
   *  real per-page timestamp exists, it goes here and not before. */
  return [
    ...pages.map((p) => ({
      url: `${BASE}${p.path}`,
      priority: p.priority,
    })),
    ...STORIES.map((s) => ({
      url: `${BASE}/stories/${s.slug}`,
      priority: 0.6,
    })),
  ];
}
