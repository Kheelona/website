import type { NextConfig } from "next";
import { securityHeaders } from "./src/lib/security-headers";
import {
  POSTHOG_API_HOST,
  POSTHOG_ASSET_HOST,
  POSTHOG_ASSET_PROXY_PATH,
  POSTHOG_PROXY_PATH,
} from "./src/config/site";
/* Relative paths only: Next resolves no `@/` alias in this file's own import
   graph (structure §2). */
import { resolveSiteEnv } from "./src/config/env";
import { JOURNAL_IMAGES, VIDEO_STILLS } from "./src/config/journal";
import { REDIRECTS } from "./src/config/redirects";
import { IMMUTABLE, IMMUTABLE_SOURCES, withSiteImageOrigins } from "./src/lib/site-pages/headers";
import { siteOverrideRewrites } from "./src/lib/site-pages/overrides";

const nextConfig: NextConfig = {
  /* THE ONE SITE ENVIRONMENT (D048, ADR-008, architecture §15.2). Resolved
     here from Vercel's system variables (production, the `beta` branch, other
     previews, local) and inlined into every bundle, so a prerendered page and a
     server function agree on which store a button opens. On Vercel with the
     system variables switched off this throws and the build stops, rather than
     guessing. `KH_SITE_ENV` forces it for tests and the Gate B dry run. */
  env: { KH_SITE_ENV: resolveSiteEnv(process.env) },
  images: {
    // AVIF preferred, WebP fallback (AVIF is opt-in on this Next build).
    formats: ["image/avif", "image/webp"],
    /* THE JOURNAL'S TWO REMOTE IMAGE SOURCES (ADR-014, journal-pipeline §6):
       an uploaded cover or body image from the dashboard's image folder, and
       a YouTube still for a video, which our optimiser fetches so the reader's
       browser contacts YouTube only after a press. A `URL` pattern keeps its
       empty search, so no query string passes; nothing else remote is ever
       optimised (test/guards/next-config.test.ts, with Next's own matcher). */
    remotePatterns: [new URL(`${JOURNAL_IMAGES}**`), new URL(`${VIDEO_STILLS}**`)],
    /* The optimiser follows a redirect from a remote image WITHOUT checking
       remotePatterns again (Next's image docs, maximumRedirects): none is
       followed, so an allowed address can never hand over another host. */
    maximumRedirects: 0,
  },
  /* Nothing gains from telling the world which framework serves this (F-08). */
  poweredByHeader: false,

  /* THE REDESIGN IS THE MARKETING SITE (2026-10-22). Its 404 is a whole document of its own
     (src/app/global-not-found.tsx), outside the root layout, which stays the store's. */
  experimental: { globalNotFound: true },
  /* The pages, the 404 and the machine files are read from build/site/ (prebuild step 40) when a route renders, and an
     ISR revalidation renders again inside a Vercel function: every function that reads them carries them. */
  outputFileTracingIncludes: Object.fromEntries(
    ["/[[...path]]", "/sitemap.xml", "/robots.txt", "/llms.txt", "/pricing.md", "/_not-found", "/_global-not-found"].map(
      (route) => [route.replace(/[[\]]/g, "\\$&"), ["./build/site/**/*"]],
    ),
  ),

  /* 🔴 GLOBAL FLAG, NARROWED BACK IN `src/proxy.ts` (2026-09-20, §8.39).
     PostHog ingests on `/e/`, `/s/` and `/i/`, all WITH a trailing slash — read
     out of the installed SDK, not its docs. Next's default 308s those away, and
     a redirect on a beacon fired during page unload is a lost event.

     But this flag is SITE-WIDE, and switching it on alone would let
     `kheelona.com/team/` and `/team` both answer 200 on a site in the middle of
     an SEO and answer-engine programme. So `src/proxy.ts` performs the redirect
     Next is no longer doing, for every path except PostHog's. Net observable
     behaviour for a visitor and for a crawler is unchanged; this is exactly the
     "maintain the trailing slash for some paths but not others" case the Next
     docs describe for this flag. */
  skipTrailingSlashRedirect: true,

  async rewrites() {
    /* THE REVERSE PROXY. PostHog's Installation Health flags a missing one, and
       routing these requests through our own domain is what stops an ad blocker
       dropping them. The founder took that trade on 2026-09-20 knowing it makes
       an ad blocker ineffective against PostHog, which is why `/privacy` was
       rewritten in the same round (§8.21-c).

       `beforeFiles` so these never reach the filesystem or a dynamic route.
       TWO NON-OVERLAPPING PREFIXES, which is the one design decision here: the
       Next docs say `beforeFiles` rules keep being evaluated after a match, so
       overlapping sources leave it undecided which destination wins. PostHog's
       own guide nests assets under the ingestion prefix and would need exactly
       that overlap; if the ingestion rule won a `/static/` path the recorder
       would 404 and session replay would SILENTLY never start, which is §8.38-b
       over again. Prefixes that cannot both match remove the question.

       🔴 THIS CANNOT BE VERIFIED LOCALLY (§8.34-f): `next start` is not the
       deployment target, and an external rewrite is resolved by Vercel's edge.
       It is verified on production after deploy, WITH ITS CONTROL — the
       recorder must load on store.kheelona.com/ and NOT on /thanks, because a
       change that killed replay everywhere would pass the negative check alone.
       The other production check is geography: PostHog reads the visitor's
       country from the request IP, which it now sees via `x-forwarded-for`. */
    return {
      /* THE REDESIGN'S STATIC FILES (2026-10-22). prebuild step 40 copies everything of redesign/dist that is not a
         page into public/_site/, so no file of it can collide with public/ or an app route. A request for a file
         (a path with an extension) that neither public/ nor a route answers is looked up there, under its own URL:
         /assets/css/site.<hash>.css, /og/kheelu.jpg, /icon-192.png. After the filesystem, so public/, the icons and
         the machine files keep their URLs; before the page routes, which never have an extension. */
      afterFiles: [{ source: "/:file(.+\\.[A-Za-z0-9]+)", destination: "/_site/:file" }],
      beforeFiles: [
        /* Where the redesign has its own version of a file the app also serves (/og.png, /og/kheelu.jpg), the
           redesign's wins: one exact rule per file, listed by prebuild step 40 (src/lib/site-pages/overrides.ts). */
        ...siteOverrideRewrites(),
        {
          source: `${POSTHOG_ASSET_PROXY_PATH}/:path*`,
          destination: `${POSTHOG_ASSET_HOST}/:path*`,
        },
        {
          source: `${POSTHOG_PROXY_PATH}/:path*`,
          destination: `${POSTHOG_API_HOST}/:path*`,
        },
      ],
    };
  },
  async headers() {
    /* One policy for every HTML response on both hosts (F-03). The reasoning,
       including why script-src carries 'unsafe-inline' and what that does and
       does not cost, is in src/lib/security-headers.ts. The CSP ships
       Report-Only first and is flipped to enforcing in a separate deploy, once
       real traffic has said what it would have broken. */
    return [
      {
        /* Everything except Next's own build output, which is same-origin
           static files that no policy here protects. */
        source: "/((?!_next/static|_next/image).*)",
        /* The frozen policy plus the redesign's image origins in img-src (src/lib/site-pages/headers.ts). */
        headers: withSiteImageOrigins(securityHeaders(process.env.NODE_ENV === "development")),
      },
      /* The redesign's content-hashed files, cached for a year (redesign/dist/asset-manifest.json `cache`). */
      ...IMMUTABLE_SOURCES.map((source) => ({ source, headers: [{ key: "Cache-Control", value: IMMUTABLE }] })),
      /* BETA IS NOINDEX ON EVERY RESPONSE (D048, QA review N1). The proxy
         already says noindex on HTML routes for any host outside
         INDEXABLE_HOSTS, but its matcher skips every path with a dot
         (src/proxy.ts:203): /llms.txt, /pricing.md, /sitemap.xml, images and
         films. This covers all of them, on a beta build only.

         `resolveSiteEnv(process.env)`, called here and not the inlined
         `SITE_ENV`: inside this file and its imports that one still reads
         "development", because the `env` inlining applies to the app bundles. */
      ...(resolveSiteEnv(process.env) === "beta"
        ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]
        : []),
    ];
  },
  async redirects() {
    /* One table (ADR-012): the 24 rules the site had at the reset, unchanged,
       the reset's own, the `www` twins and the `www` catch-all, with the
       reasoning for each beside it. Fresh objects, so nothing Next does to a
       route can reach the shared table. */
    return REDIRECTS.map((rule) => ({ ...rule }));
  },
};

export default nextConfig;
