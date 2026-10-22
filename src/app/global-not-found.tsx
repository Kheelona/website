import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { headElements, splitDocument, toProps } from "@/lib/site-pages/document";
import { notFoundPageHtml } from "@/lib/site-pages/respond";

/*
 * The 404 for every URL that matches no route (2026-10-22): the redesign's own 404 page (redesign/dist/404.html), served
 * by Next's not-found handling, because that is what Next and Vercel's edge serve for an unmatched path: the
 * prerendered not-found output, status 404. `experimental.globalNotFound` (next.config.ts) lets it be a whole document
 * of its own, outside the root layout (whose DS stylesheet and React tracking gates belong to the store), so it renders
 * exactly as the redesign built it, through the same transform as every other page (robots noindex, store link, CTA
 * values, offer, tracking shell). Rendered on the server in full (test/not-found-ssr.test.ts). The store host never
 * reaches it: its dead ends are the store's own panel (src/app/store/[...rest]).
 *
 * The offer is the build's: this page is prerendered once, so after a sell-out it shows full mode's words from the
 * Redeploy the runbook already asks for (architecture §15.5 step 9), not within 300 s like the routed pages.
 */

/* The redesign's viewport (viewport-fit=cover for the dock's safe-area inset), written by Next. */
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

/* Next writes the noindex itself for a 404; the page's own title, description and robots come from its HTML. */
export const metadata: Metadata = {};

export default async function GlobalNotFound() {
  const html = await notFoundPageHtml();
  if (html === undefined) {
    return (
      <html lang="en-IN">
        <body>
          <h1>Page not found</h1>
          <p>
            <Link href="/">Kheelona home</Link>
          </p>
        </body>
      </html>
    );
  }
  const page = splitDocument(html);
  return (
    <html {...toProps(page.htmlAttrs)} suppressHydrationWarning>
      <head>{headElements(page.head)}</head>
      <body {...toProps(page.bodyAttrs)} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: page.body }} />
    </html>
  );
}
