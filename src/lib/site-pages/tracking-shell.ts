import type { BeforeSendFn, PostHogConfig } from "posthog-js";
import { inject as injectVercelAnalytics } from "@vercel/analytics";
import { isBetaHost } from "@/config/env";
import {
  GA4_HOSTS,
  GA4_MEASUREMENT_ID,
  META_PIXEL_HOSTS,
  META_PIXEL_ID,
  POSTHOG_ASSET_PROXY_PATH,
  POSTHOG_KEY,
  POSTHOG_PROXY_PATH,
  POSTHOG_UI_HOST,
  replayAllowedOnPath,
  shouldLoadPostHog,
} from "@/config/site";
import { fbTrack, whenFbqReady } from "@/lib/fbq";
import { phSetReplay, registerPostHog } from "@/lib/posthog";
import { applyInternalFlag } from "@/lib/tracking/internal-flag";

/**
 * The tracking shell of the redesigned marketing pages (2026-10-22). Those pages are the redesign's own HTML, served by
 * route handlers (src/app/(site)), so the React gates in src/components/tracking cannot mount on them. This module is
 * the same measurement, for a page without React: scripts/site/prepare.mjs bundles it with esbuild (content-hashed,
 * PostHog in a lazily imported chunk) and transform.ts adds it last in <body>, after the page has parsed, as the gates
 * load `afterInteractive`. Every ID, host list, event and PostHog option comes from the same frozen modules the gates
 * use (config/site, lib/fbq, lib/posthog, lib/tracking/internal-flag); test/site-pages-tracking.test.ts holds the
 * PostHog options to the production fixture and every gate to its host list.
 *
 * - Vercel Web Analytics: every host, as <Analytics/> (its script answers on Vercel deployments only).
 * - GA4: GA4_HOSTS only; the same two scripts @next/third-parties' GoogleAnalytics writes.
 * - Meta Pixel: META_PIXEL_HOSTS only; Meta's base code, init and one PageView per page load (these pages are separate
 *   documents, so there is no client route change to count). No <noscript> pixel, as MetaPixel.tsx explains.
 * - ViewContent: when the page asks for it (`data-view-content-paise`, the live offer's headline, written on the
 *   server), with ViewContentTracker's payload, after fbq is ready.
 * - PostHog: POSTHOG_HOSTS only (production and the two beta hosts, which get the `env: "beta"` stamp through
 *   before_send); the gate's init options; replay by the page's path; the `?internal=` flag.
 * - Ahrefs is not here: it belongs in the server HTML's <head> (transform.ts), ungated except on beta, as the root
 *   layout writes it.
 */

/** D048 (architecture §15.3, QA review N3): PostHogGate's stamp, the same function. */
const stampBeta: BeforeSendFn = (event) =>
  event ? { ...event, properties: { ...event.properties, env: "beta" } } : event;

/** PostHogGate's options for `hostname`, key for key (test/site-pages-tracking.test.ts compares them with the
 *  production fixture, test/guards/fixtures/posthog-init). */
export function postHogOptions(hostname: string): Partial<PostHogConfig> {
  return {
    api_host: POSTHOG_PROXY_PATH,
    asset_host: POSTHOG_ASSET_PROXY_PATH,
    ui_host: POSTHOG_UI_HOST,
    custom_campaign_params: ["utm_id", "placement"],
    autocapture: true,
    capture_exceptions: true,
    disable_session_recording: true,
    session_recording: { maskAllInputs: true, maskTextSelector: ".ph-mask" },
    person_profiles: "identified_only",
    capture_pageview: "history_change",
    ...(isBetaHost(hostname) ? { before_send: stampBeta } : {}),
  };
}

const lower = (hostname: string) => hostname.toLowerCase();
export const shouldLoadGa4 = (hostname: string) => (GA4_HOSTS as readonly string[]).includes(lower(hostname));
export const shouldLoadMetaPixel = (hostname: string) =>
  (META_PIXEL_HOSTS as readonly string[]).includes(lower(hostname));

type Gtag = (...args: unknown[]) => void;

function addScript(src: string): void {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.body.appendChild(s);
}

/** @next/third-parties' GoogleAnalytics: the init script, then gtag.js. */
export function loadGa4(): void {
  const w = window as unknown as { dataLayer: unknown[]; gtag: Gtag };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- gtag queues the arguments object itself
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA4_MEASUREMENT_ID);
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`);
}

/** MetaPixel.tsx's base code, init and PageView. */
export function loadMetaPixel(): void {
  type Fbq = ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[];
    push: Fbq;
    loaded: boolean;
    version: string;
  };
  const w = window as unknown as { fbq?: Fbq; _fbq?: Fbq };
  if (!w.fbq) {
    /* Meta's own queue: the arguments object itself, applied later by fbevents.js. */
    const n = function (this: unknown) {
      // eslint-disable-next-line prefer-rest-params, prefer-spread
      if (n.callMethod) n.callMethod.apply(n, arguments as unknown as unknown[]);
      // eslint-disable-next-line prefer-rest-params
      else n.queue.push(arguments);
    } as unknown as Fbq;
    w.fbq = n;
    if (!w._fbq) w._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    addScript("https://connect.facebook.net/en_US/fbevents.js");
  }
  w.fbq("init", META_PIXEL_ID);
  w.fbq("track", "PageView");
}

/** ViewContentTracker's payload for the page's headline price. */
export function trackViewContent(valuePaise: number): () => void {
  return whenFbqReady(() =>
    fbTrack("ViewContent", {
      content_name: "Kheelu",
      content_ids: ["lumi"],
      content_type: "product",
      value: valuePaise / 100,
      currency: "INR",
    }),
  );
}

/** Resolves soon after PostHog's remote config (`<api_host>/array/<key>/config.js`) has loaded, which is when
 *  autocapture starts recording clicks (measured 2026-10-23: a click before it is not recorded), or after `capMs` at the
 *  latest. It watches the browser's own resource timing, so it needs nothing from the SDK's internals. */
export function remoteConfigLoaded(capMs = 1500, settleMs = 60): Promise<void> {
  return new Promise((resolve) => {
    const cap = setTimeout(resolve, capMs);
    if (typeof PerformanceObserver !== "function") return;
    const isConfig = (name: string) => name.includes(`${POSTHOG_PROXY_PATH}/array/`) && name.includes("config.js");
    const po = new PerformanceObserver((list) => {
      if (!list.getEntries().some((e) => isConfig(e.name))) return;
      po.disconnect();
      clearTimeout(cap);
      setTimeout(resolve, settleMs); // the script runs right after it loads
    });
    try { po.observe({ type: "resource", buffered: true }); } catch { /* resource timing unsupported: the cap releases */ }
  });
}

export async function loadPostHog(location: Pick<Location, "hostname" | "pathname" | "search">): Promise<void> {
  const { default: posthog } = await import("posthog-js");
  const configured = remoteConfigLoaded();
  posthog.init(POSTHOG_KEY, postHogOptions(location.hostname));
  registerPostHog(posthog);
  applyInternalFlag(posthog, location.search);
  // The replay recorder (about 67 KB) starts when the browser is next idle, not in the same task as the SDK.
  const replay = () => phSetReplay(replayAllowedOnPath(location.pathname));
  if (typeof requestIdleCallback === "function") requestIdleCallback(replay, { timeout: 2000 });
  else setTimeout(replay, 0);
  await configured;
}

/** Runs every tool this page's host allows. `config` is the shell's own <script data-kh-tracking> element. Resolves
 *  once PostHog records clicks (at once where PostHog doesn't load). */
export function boot(config: HTMLElement | null, location: Location = window.location): Promise<void> {
  injectVercelAnalytics({ framework: "next" });
  const host = location.hostname;
  if (shouldLoadGa4(host)) loadGa4();
  if (shouldLoadMetaPixel(host)) loadMetaPixel();
  const paise = Number(config?.dataset.viewContentPaise);
  if (Number.isFinite(paise) && paise > 0) trackViewContent(paise);
  return shouldLoadPostHog(host) ? loadPostHog(location).catch(() => {}) : Promise.resolve();
}

/** Lighthouse, 2026-10-23 (owner's reports: Total Blocking Time 510-790 ms, mostly the Meta Pixel, gtag and PostHog
 *  running while the first screen paints): the tools start on the visitor's first interaction (touch, click, key,
 *  scroll, wheel or mouse movement) or `delayMs` after the page has loaded, whichever comes first. Every event still
 *  fires, the same IDs and names, a moment later; only a visitor who leaves within those seconds without touching
 *  anything goes unseen. */
export const START_EVENTS = ["pointerdown", "touchstart", "keydown", "scroll", "wheel", "mousemove"] as const;
export function whenEngaged(start: () => void, delayMs = 4000, win: Window = window): void {
  let done = false, timer = 0;
  const opts = { passive: true, capture: true } as const;
  const go = () => {
    if (done) return;
    done = true;
    win.clearTimeout(timer);
    START_EVENTS.forEach((e) => win.removeEventListener(e, go, opts));
    start();
  };
  START_EVENTS.forEach((e) => win.addEventListener(e, go, opts));
  const arm = () => { timer = win.setTimeout(go, delayMs); };
  if (win.document.readyState === "complete") arm();
  else win.addEventListener("load", arm, { once: true });
}

/** A tap on a Pre-order link can come before PostHog has loaded (the tap is what starts it). That click is the CTA
 *  report (`cta` on $autocapture), so it waits for PostHog, at most `maxWaitMs`, and is then clicked again for
 *  autocapture to see; the store opens a moment later, as it would have. */
export function holdStoreClicks(ready: () => Promise<void> | null, maxWaitMs = 2000, doc: Document = document): void {
  let released = false;
  doc.addEventListener("click", (e) => {
    if (released || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="https://store.kheelona.com"]');
    const pending = link ? ready() : null;
    if (!link || !pending) return;
    e.preventDefault();
    const again = () => { released = true; link.click(); };
    Promise.race([pending, new Promise<void>((r) => setTimeout(r, maxWaitMs))]).then(again, again);
  }, true);
}

if (typeof document !== "undefined" && document.querySelector("script[data-kh-tracking]")) {
  const config = document.querySelector<HTMLElement>("script[data-kh-tracking]");
  let started: Promise<void> | null = null, loaded = false;
  const start = () => (started ??= boot(config).then(() => { loaded = true; }));
  whenEngaged(start);
  if (shouldLoadPostHog(window.location.hostname)) holdStoreClicks(() => (loaded ? null : start()));
}
