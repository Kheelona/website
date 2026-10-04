import type { MetadataRoute } from "next";
import { STORIES } from "@/lib/stories";

const BASE = "https://kheelona.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1.0 },
    { path: "/products/kheelu", priority: 0.9 },
    { path: "/playos", priority: 0.8 },
    { path: "/safety", priority: 0.8 },
    /* The buyer's guide (2026-09-11). Priority matches /safety: it is a
       commercial answer page, not a journal piece. */
    { path: "/ai-toys-for-kids-in-india", priority: 0.8 },
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
  /* `lastModified` ONLY where a real per-page date exists (§8.35-a).
   *
   *  Journal articles carry it since 2026-09-05: each has `published` and
   *  `updated` dates taken from git history, so `lastmod` says exactly what it
   *  should, the day that article last changed in a way a reader can see. The
   *  twelve marketing routes still carry NO lastModified, for the reason
   *  recorded below. When one of them gains a real, tracked date, it joins.
   *
   *  Why the field was removed in the first place (2026-09-05, earlier the same day):
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
   *  Omitting the field is explicitly better than guessing it. At the time there
   *  was no trustworthy per-page date: articles carried month precision at best
   *  (the since-deleted JOURNAL_REVIEWED) and the marketing routes none at all.
   *  The rule stands: a real per-page timestamp goes here, and nothing else. */
  return [
    ...pages.map((p) => ({
      url: `${BASE}${p.path}`,
      priority: p.priority,
    })),
    ...STORIES.map((s) => ({
      url: `${BASE}/stories/${s.slug}`,
      lastModified: s.updated,
      priority: 0.6,
    })),
  ];
}
