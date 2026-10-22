import { SITE_ENV, STORE_ORIGIN } from "@/config/env";
import { AHREFS_ANALYTICS_KEY } from "@/config/site";
import type { Offer } from "@/content/types";
import { getOffer } from "@/lib/offer/get-offer";
import { readMachineFile, readNotFoundPage, readSitePage, siteManifest } from "./files";
import { applyOffer } from "./offer-swap";
import { renderSitePage, type SitePageContext } from "./transform";

/** The serving context for this build: its environment and store, the live offer, the tracking shell. */
export function siteContext(path: string, offer: Offer, notFound = false): SitePageContext {
  return {
    path,
    env: SITE_ENV,
    storeOrigin: STORE_ORIGIN,
    offer,
    trackingSrc: siteManifest().tracking,
    ahrefsKey: AHREFS_ANALYTICS_KEY,
    notFound,
  };
}

/** A redesigned page as served, or undefined when the redesign has no page at `path`. */
export async function sitePageHtml(path: string): Promise<string | undefined> {
  const html = readSitePage(path);
  if (html === undefined) return undefined;
  return renderSitePage(html, siteContext(path, await getOffer()));
}

/** The 404 page as served (src/app/global-not-found.tsx), or undefined when the build has none. */
export async function notFoundPageHtml(): Promise<string | undefined> {
  const html = readNotFoundPage();
  if (html === undefined) return undefined;
  return renderSitePage(html, siteContext("/404", await getOffer(), true));
}

const TYPES: Readonly<Record<string, string>> = {
  "sitemap.xml": "application/xml; charset=utf-8",
  "robots.txt": "text/plain; charset=utf-8",
  "llms.txt": "text/plain; charset=utf-8",
  "pricing.md": "text/markdown; charset=utf-8",
};

/** A machine file as served: the redesign's own (one source of truth), the amounts in the live mode. 404 when the
 *  build has none (a quick local build; prepare.mjs refuses a production build without it). */
export async function machineFileResponse(name: keyof typeof TYPES & string): Promise<Response> {
  const body = readMachineFile(name);
  if (body === undefined) return new Response("Not found\n", { status: 404 });
  const text = name.endsWith(".txt") || name.endsWith(".md") ? applyOffer(body, await getOffer()) : body;
  return new Response(text, { headers: { "content-type": TYPES[name] } });
}
