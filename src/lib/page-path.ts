import { usePathname } from "next/navigation";

/* The page path the shell components render from (task 8c.7). The site shell is a layout, so its client parts read the
 * page from usePathname(). On Vercel that path is not always the browser's: Vercel re-renders Home in its runtime (ISR)
 * under the route segments ["", "index"], so on the server usePathname() reads "/index" while the browser reads "/". A
 * component that renders from it then builds one tree in the server HTML and another in the browser, and React throws
 * hydration error #418 and rebuilds the page (beta's Home lost its buy bar from the server HTML; CMO wave 8c review m1).
 * A local build, even through a stub adapter, prerenders Home with "/", so only a Vercel runtime render shows it
 * (lessons §1). Every shell component that renders from the path reads it here. The Meta Pixel and the PostHog gate do
 * not: they read the browser's path in effects only (tracking parity). */

const INDEX = "/index";

/** The path with a trailing "/index" folded into its parent: "/index" is "/", "/stories/index" is "/stories". */
export function pagePath(pathname: string): string {
  if (pathname === INDEX) return "/";
  return pathname.endsWith(INDEX) ? pathname.slice(0, -INDEX.length) : pathname;
}

/** usePathname(), folded by `pagePath`: the same on the server and in the browser for every page of the site. */
export function usePagePath(): string {
  return pagePath(usePathname());
}
