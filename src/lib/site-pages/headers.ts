/**
 * Response headers for the redesigned marketing site (2026-10-22), composed in next.config.ts. Relative imports only:
 * Next resolves no `@/` alias in the config's own import graph (structure §2).
 */
import { JOURNAL_IMAGES, VIDEO_STILLS } from "../../config/journal";
import type { HeaderPair } from "../security-headers";

/** Images the redesign's stories load straight from another origin: a dashboard upload from the API's public image
 *  folder (the redesign shows uploads without an optimiser) and a YouTube still before a video is pressed. */
export const SITE_IMAGE_ORIGINS: readonly string[] = [new URL(JOURNAL_IMAGES).origin, new URL(VIDEO_STILLS).origin];

/**
 * The frozen policy (src/lib/security-headers.ts, ADR-013) with the redesign's two image origins added to `img-src`: a
 * reviewed superset of the old header string (tracking inventory parity row 25), every other directive unchanged.
 */
export function withSiteImageOrigins(headers: readonly HeaderPair[]): HeaderPair[] {
  return headers.map((h) =>
    /^Content-Security-Policy/.test(h.key)
      ? {
          ...h,
          value: h.value.replace(/(^|;\s*)img-src ([^;]*)/, (_m, lead: string, list: string) => {
            const have = new Set(list.split(/\s+/));
            const add = SITE_IMAGE_ORIGINS.filter((o) => !have.has(o));
            return `${lead}img-src ${[list, ...add].join(" ")}`;
          }),
        }
      : { ...h },
  );
}

/** One year, immutable: a content-hashed file never changes under its name. */
export const IMMUTABLE = "public, max-age=31536000, immutable";

/**
 * The content-hashed files, as Next header sources (path-to-regexp, matched on the URL before any rewrite). They are
 * redesign/dist/asset-manifest.json's `cache.immutable` rule (`^/assets/.+\.[0-9a-f]{10}\.[a-z0-9]+$` and
 * `^/assets/js/m/.+\.[A-Z0-9]{8}\.js$`; test/site-pages.test.ts holds the two equal over every built file), the same
 * under /_site/ where they are stored, and the tracking shell's esbuild chunks (`[name]-[hash]`). Everything else keeps
 * the default `public, max-age=0, must-revalidate`.
 */
export const IMMUTABLE_SOURCES: readonly string[] = [
  "/assets/:file(.+\\.[0-9a-f]{10}\\.[a-z0-9]+)",
  "/assets/js/m/:file(.+\\.[A-Z0-9]{8}\\.js)",
  "/_site/assets/:file(.+\\.[0-9a-f]{10}\\.[a-z0-9]+)",
  "/_site/assets/js/m/:file(.+\\.[A-Z0-9]{8}\\.js)",
  "/_site/_kh/:file([a-z]+-[A-Z0-9]{8}\\.js)",
];
