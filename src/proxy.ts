import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeForHost, isStoreHost } from "@/lib/store/host";

/** Host routing (§8.25-a).
 *
 *  Next 16 renamed middleware to `proxy.ts`; the file is otherwise the same one
 *  file per project, at the same level as `app`
 *  (node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md).
 *
 *  All the decisions live in `lib/store/host.ts` as a pure function, so they are
 *  unit tested rather than verified by deploying and clicking. This file is the
 *  adapter, plus one header the pure function cannot set.
 *
 *  That header: the store is `noindex`. It is a transactional endpoint, not a
 *  content property, and letting it into the index would put a thin checkout page
 *  in competition with /products/lumi, which is the page a year of SEO work went
 *  into. The store's job is to convert traffic the marketing site already earned. */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const { pathname, search } = request.nextUrl;
  const route = routeForHost(host, pathname, search);

  if (route.kind === "redirect") {
    return NextResponse.redirect(route.url, 308);
  }

  if (route.kind === "rewrite") {
    const response = NextResponse.rewrite(new URL(route.path, request.url));
    response.headers.set("x-robots-tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  /* Everything except Next's own assets, the API (same handlers serve both
     hosts, and the store's fetches are same-origin either way), and any path
     with a dot in it, which is a file: /favicon.ico, /og.png, /llms.txt.
     Rewriting a file request would break the very assets the store renders. */
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};

/** Re-exported for the guard test, which asserts the store host never reaches a
 *  marketing route and the apex never serves a store one. */
export { isStoreHost };
