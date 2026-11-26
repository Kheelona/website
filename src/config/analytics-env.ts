import type { SiteEnv } from "./env";

/** Which BUILDS write the measurement tags (K-187, 2026-11-26).
 *
 *  The browser gates (`GA4_HOSTS`, `META_PIXEL_HOSTS`, `POSTHOG_HOSTS` in ./site.ts) decide by hostname, so a build
 *  served under a production hostname (a local check with mapped hosts) used to send to the live accounts. These two
 *  answers are made on the server, from the build's `SITE_ENV`, before any tag is written: a development or preview
 *  build never contains a tag, a beacon or a PostHog rewrite, whatever hostname it is opened under. The gates stay as
 *  they were; this only decides whether they are rendered at all.
 *
 *  🔴 RELATIVE TYPE IMPORT ONLY, no runtime import, nothing but erasable TypeScript: `next.config.ts` imports this file
 *  by relative path (Next resolves no `@/` alias in the config's own import graph), as it does ./env.ts. It is read by
 *  server code only (the root layout, the page transform, the store shell, the config): no client bundle imports it. */

/** Ahrefs, GA4, the Meta Pixel and OpenAI's pixel: production builds only (beta never had them). */
export const buildLoadsAdTags = (env: SiteEnv): boolean => env === "production";

/** PostHog, with everything that only exists for it (the marketing pages' tracking shell, the store's early `store_arrived`
 *  beacon, the `/ingest` and `/ingest-assets` rewrites): production, and beta (stamped `env: "beta"`). */
export const buildLoadsPostHog = (env: SiteEnv): boolean => env === "production" || env === "beta";
