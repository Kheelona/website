import { sitePagePaths } from "@/lib/site-pages/files";
import { sitePageHtml } from "@/lib/site-pages/respond";

/*
 * Every marketing page (2026-10-22): the redesign's own HTML, built by redesign/tools/build-site.sh and prepared by
 * prebuild step 40 (scripts/site/prepare.mjs), served as it is apart from what depends on the environment and the
 * moment: robots, the store link, the CTA values, the live offer and the tracking shell (src/lib/site-pages/transform.ts).
 *
 * - One route for every page, so the redesign's build is the one list of pages: a page it adds is served on the next
 *   build, a page it drops answers 404. The specific routes (the store's, /api, the machine files, the icons) win over
 *   this optional catch-all, and the proxy (src/proxy.ts) runs in front of it as before: the trailing-slash 308, the
 *   store host's rewrite, the attribution cookies and the noindex header on non-canonical hosts.
 * - Prerendered at build (generateStaticParams), then revalidated within the offer window (ADR-005), so a sell-out
 *   reaches every price on every page in about ten minutes, as on beta's React pages. A literal: Next reads it
 *   statically (OFFER_REVALIDATE_SECONDS).
 * - An unknown path never reaches GET (`dynamicParams = false`): the router answers it with the redesign's 404
 *   (src/app/global-not-found.tsx), status 404, rendered on the server (test/not-found-ssr.test.ts).
 */
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams(): { path: string[] }[] {
  return sitePagePaths().map((p) => ({ path: p === "/" ? [] : p.slice(1).split("/") }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const html = await sitePageHtml(`/${(path ?? []).join("/")}`);
  if (html === undefined) return new Response("Not found\n", { status: 404 });
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
