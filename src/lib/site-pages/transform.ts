import type { SiteEnv } from "@/config/env";
import type { Offer } from "@/content/types";
import { applyOffer } from "./offer-swap";

/**
 * What a redesigned page becomes when it is served (2026-10-22): the redesign's static HTML (built once by
 * redesign/tools/build-site.sh) plus everything that depends on where and when it is served. Pure: the route handlers
 * (src/app/(site)/[[...path]]/route.ts, src/app/global-not-found.tsx) pass the build's environment, the store origin,
 * the live offer and the tracking shell's URL. The SEO engineer's markers say where things go; a page built without
 * them (a quick local build) gets the same result at the fallback places.
 *
 * 1. Robots (`<!--robots-->`): nothing on production, whose pages are indexable; `noindex` on every other environment
 *    (redesign/manifest.json; beta also sends X-Robots-Tag on every response, and the proxy sends it for any
 *    non-canonical host of a production build). The 404 page always says `noindex`. A prototype robots tag left in the
 *    HTML is removed.
 * 2. The store: links to https://store.kheelona.com stay on the live store in every environment (founder ruling 2026-10-22).
 * 3. CTA values (wiki/site/tracking-inventory.md; src/lib/tracking/cta.ts): the dock's button reports `sticky-bar` in the
 *    server HTML off Home (main.js does the same after load; a crawler or a no-JS check now reads the same value), and
 *    the footer's pre-order button reports `finale` on a page that has no other `finale`, so every pre-order button
 *    carries a value.
 * 4. The live offer (offer-swap.ts): the schema price, and full mode's words once the first 500 are gone.
 * 5. Tracking: Ahrefs in <head> (`<!--tracking-head-->`), ungated except on beta, as the root layout writes it; the
 *    tracking shell last in <body> (`<!--tracking-body-->`), with the ViewContent value on Home and the product page.
 */

export interface SitePageContext {
  /** The URL path the page is served at ("/", "/products/kheelu"); "/404" for the not-found page. */
  readonly path: string;
  readonly env: SiteEnv;
  /** STORE_ORIGIN for this build. */
  readonly storeOrigin: string;
  readonly offer: Offer;
  /** The tracking shell's URL (build/site/site.json), or null to leave tracking out (tests). */
  readonly trackingSrc: string | null;
  readonly ahrefsKey: string;
  readonly notFound?: boolean;
}

/** The production store origin as the redesign writes it. */
export const REDESIGN_STORE_ORIGIN = "https://store.kheelona.com";

/** The pages that send a Meta ViewContent (tracking inventory parity row 12; B9: Home too). */
export const VIEW_CONTENT_PATHS: readonly string[] = ["/", "/products/kheelu"];

/** Puts `insert` at the marker, or else before `fallback` (the last occurrence), or else appends it. */
function place(html: string, marker: string, insert: string, fallback: string): string {
  if (html.includes(marker)) return html.split(marker).join(insert);
  const at = html.lastIndexOf(fallback);
  return at < 0 ? html + insert : html.slice(0, at) + insert + html.slice(at);
}

export function robotsTag(env: SiteEnv, notFound = false): string {
  return env !== "production" || notFound ? '<meta name="robots" content="noindex">' : "";
}

function applyRobots(html: string, ctx: SitePageContext): string {
  const cleaned = html
    .replace(/\s*<!--\s*Prototype:[\s\S]*?-->/g, "")
    .replace(/\s*<meta\s+name="robots"[^>]*>/gi, "");
  const tag = robotsTag(ctx.env, ctx.notFound);
  if (cleaned.includes("<!--robots-->")) return cleaned.split("<!--robots-->").join(tag);
  if (!tag) return cleaned;
  return cleaned.replace(/(<link\s+rel="canonical")|(<\/head>)/i, (m) => `${tag}\n${m}`);
}

function applyStoreOrigin(html: string, storeOrigin: string): string {
  if (storeOrigin === REDESIGN_STORE_ORIGIN) return html;
  return html.replace(/(href=")https:\/\/store\.kheelona\.com(?=["/?#])/g, `$1${storeOrigin}`);
}

/** The anchors that open the store, with their position, whatever the build's store origin. */
function storeAnchors(html: string, storeOrigin: string): RegExpMatchArray[] {
  const origin = storeOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...html.matchAll(new RegExp(`<a\\b[^>]*href="${origin}[^"]*"[^>]*>`, "g"))];
}

function applyCtaValues(html: string, ctx: SitePageContext): string {
  let out = html;
  if (ctx.path !== "/") {
    out = out.replace(/<a\b[^>]*\bid="hero-cta"[^>]*>/, (tag) =>
      tag.replace('data-ph-capture-attribute-cta="hero"', 'data-ph-capture-attribute-cta="sticky-bar"'),
    );
  }
  /* Literal values only: test/guards/cta-registry.test.ts reads every write of the attribute (ADR-006). */
  const hasFinale = out.includes('data-ph-capture-attribute-cta="finale"');
  if (!hasFinale) {
    const footer = out.indexOf('class="footer__cta"');
    const anchor = storeAnchors(out, ctx.storeOrigin).find(
      (m) => (m.index ?? 0) > footer && footer >= 0 && !/\bdata-ph-capture-attribute-cta=/.test(m[0]),
    );
    if (anchor && anchor.index !== undefined) {
      const tagged = anchor[0].replace(/^<a\b/, '<a data-ph-capture-attribute-cta="finale"');
      out = out.slice(0, anchor.index) + tagged + out.slice(anchor.index + anchor[0].length);
    }
  }
  return out;
}

function applyTracking(html: string, ctx: SitePageContext): string {
  const cleaned = html.replace(/\s*<!--\s*Tracking \(unchanged at integration\)[\s\S]*?-->/g, "");
  const head =
    ctx.env === "beta"
      ? ""
      : `<script src="https://analytics.ahrefs.com/analytics.js" data-key="${ctx.ahrefsKey}" async></script>`;
  const withHead = place(cleaned, "<!--tracking-head-->", head, "</head>");
  if (!ctx.trackingSrc) return place(withHead, "<!--tracking-body-->", "", "</body>");
  const view =
    VIEW_CONTENT_PATHS.includes(ctx.path) && !ctx.notFound
      ? ` data-view-content-paise="${ctx.offer.headlinePaise}"`
      : "";
  const body = `<script type="module" src="${ctx.trackingSrc}" data-kh-tracking${view}></script>`;
  return place(withHead, "<!--tracking-body-->", body, "</body>");
}

/** The page as served. */
export function renderSitePage(html: string, ctx: SitePageContext): string {
  let out = applyRobots(html, ctx);
  out = applyStoreOrigin(out, ctx.storeOrigin);
  out = applyCtaValues(out, ctx);
  out = applyOffer(out, ctx.offer);
  return applyTracking(out, ctx);
}
