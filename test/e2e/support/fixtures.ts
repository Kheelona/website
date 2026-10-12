/* The Playwright harness every spec uses (task 1.1; ADR-011, test plan §2, lessons §5 and §7).
 *
 *   - Third-party requests are aborted: only the local server (or the two beta hosts), file: and
 *     data: URLs load, so no probe ever reaches a measurement host.
 *   - The protection-bypass header is added to requests for the two beta hosts only, by routing,
 *     never through extraHTTPHeaders, so the secret never reaches any other origin (N5).
 *   - Reduced motion is on unless a spec asks otherwise.
 *   - A route still served by a legacy page is skipped as "pending"; a route not listed as legacy
 *     must render the new design (legacy-paths.ts).
 */
import http from "node:http";
import https from "node:https";
import { test as base, expect, type Browser, type BrowserContext, type Page, type Response } from "@playwright/test";
import { BETA_HOSTS, BYPASS_SECRET, HOST_HEADERS, NODE_ORIGIN, ORIGINS, PARITY_TARGET, TARGET } from "./env";
import { REVIEW_TOOL_SELECTOR, type MockupSlug } from "./mockup-text";
import { isNewDesignHtml } from "./page-checks";
import { builtUrl, mayBeLegacy, mockupUrl, type Route } from "./routes";
import { contextFor, type Viewport } from "./viewports";

export { expect, ORIGINS };

const LOCAL_HOST = /^(?:localhost|127\.0\.0\.1|\[::1\]|[a-z0-9-]+\.localhost)$/i;

/** Aborts every request that is not local (or a beta host on a beta run). */
export async function guardNetwork(context: BrowserContext, extraAllowed: (url: URL) => boolean = () => false): Promise<void> {
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.protocol === "file:" || url.protocol === "data:" || url.protocol === "blob:") return route.continue();
    if (TARGET === "local" && LOCAL_HOST.test(url.hostname)) return route.continue();
    if (TARGET === "beta" && (BETA_HOSTS as readonly string[]).includes(url.hostname)) {
      const headers = { ...route.request().headers() };
      if (BYPASS_SECRET) {
        headers["x-vercel-protection-bypass"] = BYPASS_SECRET;
        headers["x-vercel-set-bypass-cookie"] = "true";
      }
      return route.continue({ headers });
    }
    if (extraAllowed(url)) return route.continue();
    return route.abort("blockedbyclient");
  });
}

export type OpenOptions = {
  reducedMotion?: "reduce" | "no-preference";
  javaScriptEnabled?: boolean;
  deviceScaleFactor?: number;
  userAgent?: string;
  /** Record every transition and animation as it starts, from before the first paint (motionStarted). */
  recordMotion?: boolean;
};

/** One started transition or animation, as recorded by recordMotion. */
export type MotionEvent = { type: string; name: string; target: string; duration: number };

declare global {
  interface Window {
    __khMotion?: MotionEvent[];
  }
}

/* Runs in the page before any of its scripts. transitionrun and animationstart bubble, so one
   capturing listener on the document sees them all, including a finite fade that has finished
   long before anyone asks what is still running. */
function installMotionRecorder(): void {
  const log: MotionEvent[] = [];
  window.__khMotion = log;
  const describe = (el: EventTarget | null): string => {
    if (!(el instanceof Element)) return "?";
    const cls = typeof el.className === "string" && el.className.trim() ? `.${el.className.trim().split(/\s+/).join(".")}` : "";
    return `<${el.tagName.toLowerCase()}${cls}>`;
  };
  document.addEventListener(
    "transitionrun",
    (e) => log.push({ type: "transition", name: e.propertyName, target: describe(e.target), duration: e.elapsedTime }),
    true,
  );
  document.addEventListener(
    "animationstart",
    (e) => log.push({ type: "animation", name: e.animationName, target: describe(e.target), duration: e.elapsedTime }),
    true,
  );
}

/** Every transition and animation that started since the page began loading (needs recordMotion). */
export async function motionStarted(page: Page): Promise<MotionEvent[]> {
  return page.evaluate(() => {
    if (!window.__khMotion) throw new Error("motionStarted: open the page with { recordMotion: true }");
    return window.__khMotion;
  });
}

export async function newGuardedContext(browser: Browser, vp: Viewport, opts: OpenOptions = {}): Promise<BrowserContext> {
  const context = await browser.newContext({
    ...contextFor(vp, opts.deviceScaleFactor ?? 1),
    reducedMotion: opts.reducedMotion ?? "reduce",
    javaScriptEnabled: opts.javaScriptEnabled ?? true,
    ...(opts.userAgent ? { userAgent: opts.userAgent } : {}),
  });
  await guardNetwork(context);
  if (opts.recordMotion) await context.addInitScript(installMotionRecorder);
  return context;
}

/** `KH_E2E_GATE=off` runs the page specs on legacy pages too: the before-picture, and the way to
 *  prove the server-side specs (perf bytes, links) record before any new page exists. */
const GATE_OFF = process.env.KH_E2E_GATE === "off";

/** Skips the current test as pending while the route is legacy; fails if it should not be. */
export function gateOnNewDesign(route: Route, isNew: boolean): void {
  if (isNew || GATE_OFF) return;
  if (mayBeLegacy(route)) test.skip(true, `pending: ${route.id} is still served by a legacy page (test/guards/legacy-paths.ts)`);
  expect(isNew, `${route.id} (${route.host} ${route.path}) is not in LEGACY_ROUTES, yet its <main> has no DS section`).toBe(true);
}

export type NodeResponse = { status: number; headers: Record<string, string | string[] | undefined>; body: string };

/** GET from Node with an explicit Host header (fetch() refuses to set one); redirects not followed. */
export function nodeGet(path: string, host: Route["host"], hostHeader?: string): Promise<NodeResponse> {
  const target = new URL(NODE_ORIGIN ? `${NODE_ORIGIN}${path}` : `${ORIGINS[host]}${path}`);
  const headers: Record<string, string> = { host: hostHeader ?? (NODE_ORIGIN ? HOST_HEADERS[host] : target.host) };
  if (TARGET === "beta" && BYPASS_SECRET) headers["x-vercel-protection-bypass"] = BYPASS_SECRET;
  const client = target.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.request(target, { method: "GET", headers }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c: string) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body }));
    });
    req.on("error", reject);
    req.end();
  });
}

/** Fetches the route's server HTML from Node (no browser) and checks for the new design: cheap, for
 *  beforeAll. A route that does not answer as a page (wrong status, a redirect, an error) fails
 *  here instead of being mistaken for a legacy page and skipped. */
export async function routeIsNewDesign(route: Route): Promise<boolean> {
  const res = await nodeGet(route.path, route.host);
  const expected = route.id === "404" ? 404 : 200;
  expect(res.status, `${route.id}: ${route.host} ${route.path} answered ${res.status}, expected ${expected}`).toBe(expected);
  return isNewDesignHtml(res.body);
}

/** Forces every motion to its end state: reveals shown, doodles drawn (architecture §11.3). */
export async function forceMotionEnd(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      .ks-doodle path, .ks-doodle [pathLength] { stroke-dashoffset: 0 !important; animation: none !important; }
      .ks-doodle__fill { opacity: 1 !important; animation: none !important; }
      [data-reveal] { opacity: 1 !important; transform: none !important; }`,
  });
  await page.evaluate(() => {
    document.querySelectorAll("[data-reveal], [data-draw]").forEach((el) => el.classList.add("is-in"));
  });
}

/** Hides the Gate A review tool (mockup only) and, for parity, the D050 bubble and its clearance. */
export async function hideForParity(page: Page): Promise<void> {
  await page.addStyleTag({ content: `${REVIEW_TOOL_SELECTOR}, .ks-wa { display: none !important; }` });
  await page.evaluate(() => document.body.classList.remove("ks-has-float"));
}

/** Waits for fonts, then scrolls through the page so lazy images load, then returns to the top. */
export async function settle(page: Page): Promise<void> {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = page.viewportSize()?.height ?? 800;
  for (let y = 0; y < height; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  // Only images that started loading are awaited, and never for more than 3 s (lessons §7).
  await page.evaluate(() =>
    Promise.race([
      Promise.all(
        Array.from(document.images)
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise<void>((done) => {
                img.addEventListener("load", () => done(), { once: true });
                img.addEventListener("error", () => done(), { once: true });
              }),
          ),
      ),
      new Promise((done) => setTimeout(done, 3000)),
    ]).then(() => undefined),
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

/* Planted violations for proving each spec red (lessons §7), on the mockup self-test or a build:
 *   KH_PARITY_TARGET=mockup KH_NO_SERVER=1 KH_E2E_PLANT=sideways npx playwright test test/e2e/no-sideways.spec.ts
 *   KH_E2E_GATE=off KH_E2E_PLANT=brokenlink npx playwright test test/e2e/links.spec.ts
 * Each runs after load in the page under test, so the mockup reference stays clean.
 * ("redirect" is read by redirects.spec.ts, which has no page.) */
const MAIN = `document.querySelector("main")`;
export const PLANTS: Record<string, string> = {
  brokenlink: `${MAIN}.insertAdjacentHTML("beforeend", '<a href="/kh-planted-broken-link">planted</a>');`,
  redirect: "",
  sideways: `${MAIN}.insertAdjacentHTML("beforeend", '<div style="width:200vw;height:2px"></div>');`,
  axe: `${MAIN}.insertAdjacentHTML("afterbegin", '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="40" height="40">');`,
  // The D050 bubble with its laptop label showing, white on WhatsApp green: the label is text, so
  // it is blocking (architecture §13 accepts only the icon link's glyph).
  walabel: `document.body.insertAdjacentHTML("beforeend", '<a class="ks-wa" href="https://wa.me/910000000000" aria-label="Chat on WhatsApp" style="position:fixed;right:16px;bottom:16px;z-index:5;display:flex;align-items:center;gap:8px;padding:12px;border-radius:999px;background:#25D366;color:#fff"><svg width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fff"/></svg><span class="ks-wa__label" style="font-size:14px">Chat on WhatsApp</span></a>');`,
  // An endless animation below the hero (motion.spec: nothing running after 6 s, nor under reduced motion).
  loop: `document.head.insertAdjacentHTML("beforeend", '<style>@keyframes kh-planted{to{transform:rotate(1turn)}} .kh-planted{animation:kh-planted 1s linear infinite}</style>'); ${MAIN}.insertAdjacentHTML("beforeend", '<div class="kh-planted">x</div>');`,
  // A reveal that fades in over 200 ms when scrolled into view, ignoring reduced motion: finite, so
  // it has finished long before any "still running?" check (motion.spec records it as it starts).
  fade: `document.head.insertAdjacentHTML("beforeend", '<style>.kh-planted-fade{opacity:0;transition:opacity .2s}.kh-planted-fade.is-in{opacity:1}</style>'); ${MAIN}.insertAdjacentHTML("beforeend", '<p class="kh-planted-fade">planted reveal</p>'); { const el = ${MAIN}.lastElementChild; new IntersectionObserver((entries, o) => { if (entries[0].isIntersecting) { el.classList.add("is-in"); o.disconnect(); } }).observe(el); }`,
  // A hero that is not still at first paint (motion.spec, D049 pick 2).
  hero: `${MAIN}.firstElementChild.style.opacity = "0.5";`,
  cta: `document.querySelector("[data-ph-capture-attribute-cta]").setAttribute("data-ph-capture-attribute-cta", "home-arc");`,
  content: `${MAIN}.insertAdjacentHTML("beforeend", '<p>No payment now. Made for ages 2 to 5.</p>');`,
  text: `${MAIN}.insertAdjacentHTML("beforeend", '<p>A planted sentence the approved mockup does not have.</p>');`,
  firstscreen: `${MAIN}.insertAdjacentHTML("afterbegin", '<div style="height:900px"></div>');`,
  // Pixels only: an overlay on the first screen that moves nothing, so the page height still
  // matches and only the per-chunk comparator can catch it.
  visual: `document.body.insertAdjacentHTML("beforeend", '<div style="position:absolute;top:0;left:0;width:240px;height:160px;background:#c00;z-index:2147483647"></div>');`,
  // Layout only: a block that pushes the page down, for the page-height check.
  height: `${MAIN}.insertAdjacentHTML("afterbegin", '<div style="height:400px"></div>');`,
};

type Harness = {
  /** Opens a built route in a fresh guarded context; skips (pending) or fails as gateOnNewDesign says. */
  open(route: Route, vp: Viewport, opts?: OpenOptions): Promise<{ page: Page; context: BrowserContext; response: Response | null }>;
  /** Opens an approved mockup page from disk in a fresh guarded context. */
  openMockup(slug: MockupSlug, vp: Viewport, opts?: OpenOptions): Promise<{ page: Page; context: BrowserContext }>;
  context(vp: Viewport, opts?: OpenOptions): Promise<BrowserContext>;
};

export const test = base.extend<{ harness: Harness }>({
  harness: async ({ browser }, provide) => {
    const contexts: BrowserContext[] = [];
    const make = async (vp: Viewport, opts?: OpenOptions) => {
      const c = await newGuardedContext(browser, vp, opts);
      contexts.push(c);
      return c;
    };
    await provide({
      context: make,
      async open(route, vp, opts) {
        const context = await make(vp, opts);
        const page = await context.newPage();
        // Prove a spec red: plant one violation into the page under test (never the reference),
        // after load, so a hydrating React tree cannot discard it. "text" plants only where
        // JavaScript runs, so the no-js spec sees a JavaScript-only sentence.
        const plant = process.env.KH_E2E_PLANT;
        if (plant && !(plant in PLANTS)) throw new Error(`KH_E2E_PLANT=${plant}: choose one of ${Object.keys(PLANTS).join(", ")}`);
        const applyPlant = async () => {
          if (!plant || !PLANTS[plant] || (plant === "text" && opts?.javaScriptEnabled === false)) return;
          await page.waitForTimeout(300);
          await page.evaluate(PLANTS[plant]);
        };
        if (PARITY_TARGET === "mockup") {
          // Harness self-test: every page spec runs on the approved mockup itself.
          test.skip(!route.mockup, `self-test: ${route.id} has no mockup`);
          await page.goto(mockupUrl(route.mockup!), { waitUntil: "load" });
          await applyPlant();
          return { page, context, response: null };
        }
        const response = await page.goto(builtUrl(route), { waitUntil: "load" });
        gateOnNewDesign(route, isNewDesignHtml(await page.content()));
        await applyPlant();
        return { page, context, response };
      },
      async openMockup(slug, vp, opts) {
        const context = await make(vp, opts);
        const page = await context.newPage();
        await page.goto(mockupUrl(slug), { waitUntil: "load" });
        return { page, context };
      },
    });
    for (const c of contexts) await c.close().catch(() => undefined);
  },
});

/** One gate per describe block: skips every test of a legacy route after a single cheap request.
 *  In the harness self-test (KH_PARITY_TARGET=mockup) the mockup is the page, so there is no gate. */
export function gateRouteGroup(route: Route): void {
  test.beforeAll(async () => {
    if (PARITY_TARGET === "mockup") {
      test.skip(!route.mockup, `self-test: ${route.id} has no mockup`);
      return;
    }
    gateOnNewDesign(route, await routeIsNewDesign(route));
  });
}

/** Specs that need the real server (bytes, links, redirects) skip in the mockup self-test. */
export function requiresServer(): void {
  test.skip(PARITY_TARGET === "mockup", "self-test on the mockup: this spec needs the built server");
}
