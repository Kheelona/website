import { isPostHogProxyPath } from "@/config/site";

/** The trailing-slash redirect Next used to do for us (2026-09-20, §8.39).
 *
 *  `next.config.ts` sets `skipTrailingSlashRedirect: true` so that PostHog keeps
 *  the trailing slashes it ingests on (`/e/`, `/s/`, `/i/`). That flag is
 *  SITE-WIDE, though, and left alone it would let `kheelona.com/team/` and
 *  `/team` both answer 200 — two URLs for one page, on a site whose SEO and
 *  answer-engine work depends on there being exactly one. So `src/proxy.ts`
 *  performs the redirect itself for everything except the proxied paths, which
 *  is the "some paths but not others" case the Next docs describe for the flag.
 *
 *  A pure function, so the rule is unit tested rather than verified by deploying
 *  and clicking — the same reasoning as `routeForHost` beside it.
 *
 *  Returns the path to redirect to, or null to leave the request alone. The
 *  query string is the caller's business: this answers about the path only. */
export function trailingSlashRedirectPath(pathname: string): string | null {
  /* The root IS a trailing slash, and stripping it would send the home page to
     the empty string. */
  if (pathname === "/") return null;
  if (!pathname.endsWith("/")) return null;
  /* The reason the flag is off in the first place. */
  if (isPostHogProxyPath(pathname)) return null;
  /* Every trailing slash in one hop. `"/team//"` must not redirect to
     `"/team/"`, which would redirect again and again. */
  const stripped = pathname.replace(/\/+$/, "");
  return stripped === "" ? null : stripped;
}
