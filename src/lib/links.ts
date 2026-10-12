/**
 * A site path: one leading slash, then never a second slash or a backslash, which a browser reads as another site
 * (`//host/path` is protocol-relative, and `/\host/path` is read as `//host/path`). The one test of it (wave-3 close,
 * "One of each helper"): `Button`, `Logo` and `RichText` route only these through next/link, the rich-text parser
 * accepts only these as a link to the site, and `absoluteUrl` makes only these absolute.
 */
export function isSitePath(href: string): boolean {
  return /^\/(?![/\\])/.test(href);
}
