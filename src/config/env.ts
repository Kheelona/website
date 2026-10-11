/** The one build-time site environment (D048, ADR-008, architecture §15.2).
 *
 *  Every cross-host link, the CAPI switch and the beta stamp on server events
 *  read `SITE_ENV`. It is resolved once, in `next.config.ts`, from Vercel's
 *  system variables, and inlined into every bundle through the config's `env`
 *  key, so a prerendered page and a server function always agree on it.
 *
 *  🔴 NO IMPORTS, AND NOTHING BUT ERASABLE TYPESCRIPT. `next.config.ts` imports
 *  this file by relative path (Next resolves no `@/` alias in the config's own
 *  import graph), and Node scripts such as the placeholder guard import it with
 *  plain type stripping. An import or an enum here breaks both, and
 *  `test/env.test.ts` fails first.
 *
 *  🔴 INSIDE `next.config.ts` THIS MODULE'S `SITE_ENV` READS "development": the
 *  inlining applies to the app bundles, not to the config's own imports. The
 *  config therefore calls `resolveSiteEnv(process.env)` itself wherever it
 *  needs the answer (QA review N1). */

export type SiteEnv = "production" | "beta" | "preview" | "development";

const SITE_ENVS: readonly string[] = ["production", "beta", "preview", "development"];

function isSiteEnv(value: string | undefined): value is SiteEnv {
  return value !== undefined && SITE_ENVS.includes(value);
}

/** Production when Vercel says so; beta when the branch is `beta`; preview for
 *  any other Vercel preview; development everywhere else. `KH_SITE_ENV`
 *  overrides all of it (tests, the local production check, the Gate B dry run);
 *  an unknown value is ignored rather than trusted. */
export function resolveSiteEnv(e: Record<string, string | undefined>): SiteEnv {
  const forced = e.KH_SITE_ENV;
  if (isSiteEnv(forced)) return forced;
  /* Without the system variables a Vercel build cannot tell beta from
     production, and a guess would ship a beta whose buttons open the
     production store. Refuse, and say where the switch is. */
  if (e.VERCEL === "1" && !e.VERCEL_ENV)
    throw new Error(
      "Vercel system environment variables are off: enable them in Settings → Environment Variables",
    );
  if (e.VERCEL_ENV === "production") return "production";
  if (e.VERCEL_GIT_COMMIT_REF === "beta") return "beta";
  if (e.VERCEL_ENV === "preview") return "preview";
  return "development";
}

/** Inlined at build: `next.config.ts` sets `env.KH_SITE_ENV`, and Next replaces
 *  the `process.env.KH_SITE_ENV` below with that literal in every bundle. Read
 *  through `resolveSiteEnv`, so anything outside a build (a test, a script)
 *  gets a valid value too. */
export const SITE_ENV: SiteEnv = resolveSiteEnv({ KH_SITE_ENV: process.env.KH_SITE_ENV });

/** Canonicals, JSON-LD and the sitemap: the production site, in every
 *  environment, so a beta page never canonicalises to itself. */
export const CANONICAL_ORIGIN = "https://kheelona.com";

export const HOSTS = {
  production: { marketing: "kheelona.com", store: "store.kheelona.com" },
  beta: { marketing: "betawebsite.kheelona.com", store: "betastore.kheelona.com" },
} as const;

const pair = SITE_ENV === "beta" ? HOSTS.beta : HOSTS.production;

/** Where links between the two hosts point in this build: the beta pair on
 *  beta, the production pair everywhere else. */
export const MARKETING_ORIGIN = `https://${pair.marketing}`;
export const STORE_ORIGIN = `https://${pair.store}`;

export const BETA_HOSTS = [HOSTS.beta.marketing, HOSTS.beta.store] as const;

/** Port-tolerant and case-tolerant, like `isIndexableHost` in `site.ts`. */
export const isBetaHost = (h: string) =>
  (BETA_HOSTS as readonly string[]).includes(h.split(":")[0].toLowerCase());
