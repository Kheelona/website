/**
 * OpenAI Ads Measurement Pixel, browser side (F6, D069).
 *
 * One loader for both hosts: the marketing tracking shell (src/lib/site-pages/tracking-shell.ts) calls it
 * from `boot()` after the visitor's first interaction, and the store mounts
 * src/components/tracking/OpenAiPixel.tsx, which calls it at idle. Both reach the same decisions through
 * the same functions, so the host list, the team-device rule, the cookie rules and the automatic
 * advanced matching guard cannot drift between the two.
 *
 * Nothing in here may throw into a page. Every DOM, storage and cookie access is guarded, and a failure
 * means the pixel does not run: measurement is never worth a broken page or a broken checkout.
 *
 * WHAT IS SENT. OpenAI's SDK sends `page_viewed` once per full page load (queued here), and the funnel
 * calls `oaiqMeasure` for `checkout_started` and `order_created` (src/features/preorder/lib/analytics.ts).
 * `init` is never given a `user` object: no email, phone or name goes from the browser.
 *
 * AUTOMATIC ADVANCED MATCHING (AAM) is the reason for the policy below. OpenAI's SDK reads this pixel's
 * remote configuration and, when `automatic_advanced_matching_enabled` is true, scans the page's form
 * inputs and text for email addresses, phone numbers, names and addresses and sends hashes of them. There
 * is no `init` option and no Ads Manager switch for it (read from SDK 0.1.104 and the Edit pixel dialog,
 * 2026-11-13). It was on for this pixel. Our pages show the company's support email and phone, so a
 * scanner reading them would report staff identifiers as if they were a buyer's, the same trap Meta's
 * automatic matching was (tracking-setup, A3/F4). Hence `OPENAI_AAM_POLICY`.
 */
import { META_PIXEL_HOSTS, POSTHOG_KEY } from "@/config/site";
import { internalFlagFrom } from "@/lib/tracking/internal-flag";
import {
  OPENAI_COOKIES,
  OPENAI_OPPREF_COOKIE,
  OPENAI_PIXEL_CONFIG_URL,
  OPENAI_PIXEL_ID,
  OPENAI_SDK_URL,
  validOppref,
} from "./openai-events";

/** How the loader keeps automatic advanced matching away from the support details on our pages.
 *
 *  - `"require-off"`: fetch the pixel's configuration first and load the SDK only if OpenAI reports
 *    `automatic_advanced_matching_enabled === false`. Anything else (true, missing, an error, a timeout)
 *    means the SDK is not loaded and one `console.warn` says why. Fails closed: when the founder or OpenAI
 *    changes the setting, the pixel follows on the next page load, with no deploy.
 *  - `"verified-pages"`: load the SDK only on the pages in `OPENAI_PIXEL_PAGES`, whatever the
 *    configuration says. Those pages were checked with a network probe: no staff identifier reached
 *    OpenAI from them while the scanner was on. */
export type OpenAiAamPolicy = "require-off" | "verified-pages";

/** The reviewed default: `verified-pages`, set from the AAM probe (spec F6, Test plan; D069). With the live SDK
 *  (0.1.104), automatic advanced matching forced on and every collector answered locally, the events from `/`,
 *  `/products/kheelu`, `/contact`, `/privacy`, `/terms`, `/team`, `/shipping` and the store's `/` carried no hash of
 *  any contact detail those pages show. On the store, once a parent types into the form, AAM adds the hashed email
 *  and phone of what was typed, which is buyer data only. `require-off` stays implemented and tested as the
 *  alternative: switching is this one line. */
export const OPENAI_AAM_POLICY: OpenAiAamPolicy = "verified-pages";

/** The pages `"verified-pages"` mode allows, as exact paths after trailing-slash normalisation. The ad
 *  lands on `/`, the product page is the next step, and the store's `/` is where the form,
 *  `checkout_started` and `order_created` are. Every other page (/contact, the legal pages, /team,
 *  /stories/**, the store's /thanks with its address form, 404s) gets no stub and no SDK. */
export const OPENAI_PIXEL_PAGES = {
  marketing: ["/", "/products/kheelu"],
  store: ["/"],
} as const;

const STORE_HOST = "store.kheelona.com";
/** The cookie domain both hosts share. Production only: see `shouldLoadOpenAiPixel`. */
const COOKIE_DOMAIN = ".kheelona.com";
/** Team switch, in `localStorage` on the device: console logs from the SDK, nothing else changes. */
const DEBUG_KEY = "kh_oaiq_debug";
const CONFIG_TIMEOUT_MS = 3000;

/** Should OpenAI's pixel (and our cookie) exist on this hostname at all? The same list the Meta Pixel and
 *  GA4 use, referenced rather than copied: beta hosts, `*.vercel.app` previews and localhost get nothing,
 *  so test traffic never reaches an ad account that spends real money against it. */
export function shouldLoadOpenAiPixel(hostname: string): boolean {
  return (META_PIXEL_HOSTS as readonly string[]).includes(hostname.toLowerCase());
}

/** `"/products/kheelu/"` and `"/products/kheelu"` are the same page. */
function normalisePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") || "/" : pathname || "/";
}

/** Is this page on the `"verified-pages"` list for its host? */
export function isOpenAiPixelPage(hostname: string, pathname: string): boolean {
  const pages: readonly string[] = hostname.toLowerCase() === STORE_HOST ? OPENAI_PIXEL_PAGES.store : OPENAI_PIXEL_PAGES.marketing;
  return pages.includes(normalisePath(pathname));
}

/** A team device: `?internal=1` in the URL, or the flag PostHog persisted on this host when the URL last
 *  said so. `?internal=0` wins over storage. Read straight from PostHog's own storage record so this
 *  works before PostHog has loaded, and in try/catch because storage can be blocked or malformed. */
export function isInternalDevice(
  location: Pick<Location, "search">,
  storage: Pick<Storage, "getItem"> | null,
): boolean {
  const flag = internalFlagFrom(location.search);
  if (flag === "set") return true;
  if (flag === "clear") return false;
  try {
    const raw = storage?.getItem(`ph_${POSTHOG_KEY}_posthog`);
    if (!raw) return false;
    return (JSON.parse(raw) as { internal?: unknown } | null)?.internal === true;
  } catch {
    return false;
  }
}

function safeStorage(win: Window): Storage | null {
  try {
    return win.localStorage;
  } catch {
    return null;
  }
}

function readCookie(doc: Pick<Document, "cookie">, name: string): string | null {
  try {
    const match = doc.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

/** The click reference to hand `init`: the URL's `oppref`, else the one we carried across hosts. */
export function currentOppref(location: Pick<Location, "search">, doc: Pick<Document, "cookie">): string | null {
  return (
    validOppref(new URLSearchParams(location.search).get("oppref")) ?? validOppref(readCookie(doc, OPENAI_OPPREF_COOKIE))
  );
}

/** Remember the ad click for the store. When the URL carries a valid `oppref`, write `kh_oppref` on
 *  `.kheelona.com` (a session cookie; the latest click wins, as OpenAI's own `__oppref` does). OpenAI's SDK
 *  writes its own cookies too, but only once it has loaded, and where it scopes them is undocumented, so
 *  the click is carried by a cookie we control. No network, no SDK. Returns the value written. */
export function rememberOppref(location: Pick<Location, "hostname" | "search">, doc: Pick<Document, "cookie">): string | null {
  try {
    if (!shouldLoadOpenAiPixel(location.hostname)) return null;
    const value = validOppref(new URLSearchParams(location.search).get("oppref"));
    if (!value) return null;
    doc.cookie = `${OPENAI_OPPREF_COOKIE}=${encodeURIComponent(value)}; Domain=${COOKIE_DOMAIN}; Path=/; Secure; SameSite=Lax`;
    return value;
  } catch {
    return null;
  }
}

/** On a team device: delete every cookie this feature owns or OpenAI's SDK may have written, on the shared
 *  domain and on the host itself, so a tester is never attributed to an ad. */
export function clearOpenAiCookies(doc: Pick<Document, "cookie">): void {
  try {
    for (const name of OPENAI_COOKIES) {
      doc.cookie = `${name}=; Max-Age=0; Path=/; Domain=${COOKIE_DOMAIN}`;
      doc.cookie = `${name}=; Max-Age=0; Path=/`;
    }
  } catch {
    /* cookies unavailable: nothing to clear */
  }
}

/** The part of the pixel that needs no SDK and no network, run as soon as a page's script evaluates:
 *  remember the ad click, or on a team device clear the cookies. Production hosts only. */
export function startOpenAiAttribution(win: Window = window): void {
  try {
    const { location, document: doc } = win;
    if (!shouldLoadOpenAiPixel(location.hostname)) return;
    if (isInternalDevice(location, safeStorage(win))) clearOpenAiCookies(doc);
    else rememberOppref(location, doc);
  } catch {
    /* never into the page */
  }
}

type OaiqFn = ((...args: unknown[]) => void) & { q?: unknown[] };
type OaiqWindow = Window & { oaiq?: OaiqFn };

/** OpenAI's documented queue stub: `oaiq(...)` pushes its `arguments` to `oaiq.q` until the SDK arrives
 *  and replays them. Idempotent, like the snippet's `if (w.oaiq) return`. */
function installStub(win: OaiqWindow): boolean {
  if (win.oaiq) return false;
  const queue: unknown[] = [];
  const oaiq = function () {
    // eslint-disable-next-line prefer-rest-params -- the SDK replays the arguments objects it finds in q
    queue.push(arguments);
  } as OaiqFn;
  oaiq.q = queue;
  win.oaiq = oaiq;
  return true;
}

export interface OpenAiLoadOptions {
  window?: Window;
  fetch?: typeof fetch;
  policy?: OpenAiAamPolicy;
  /** Where the part after the stub (configuration check, script insertion) runs. The store passes an
   *  idle-time scheduler; the shell is already past the visitor's first interaction and runs it at once. */
  schedule?: (run: () => void) => void;
  warn?: (message: string) => void;
  configTimeoutMs?: number;
}

export type OpenAiLoadResult =
  | "skipped" // not a production host
  | "internal" // a team device: cookies cleared, nothing loaded
  | "page-not-verified" // "verified-pages" mode, a page off the list
  | "refused" // "require-off" mode and AAM is not reported off
  | "loaded"; // the SDK script was inserted (or the pixel was already installed)

/** Does OpenAI report automatic advanced matching OFF for this pixel? Only a clean `false` counts. */
async function aamReportedOff(fetchImpl: typeof fetch, timeoutMs: number): Promise<boolean> {
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller?.abort();
        reject(new Error("timeout"));
      }, timeoutMs);
    });
    const request = (async () => {
      const response = await fetchImpl(OPENAI_PIXEL_CONFIG_URL, {
        credentials: "omit",
        mode: "cors",
        signal: controller?.signal,
      });
      if (!response.ok) return false;
      const config = (await response.json()) as { automatic_advanced_matching_enabled?: unknown } | null;
      return config?.automatic_advanced_matching_enabled === false;
    })();
    return await Promise.race([request, timeout]);
  } catch {
    return false;
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

function insertSdk(doc: Document): void {
  const script = doc.createElement("script");
  script.async = true;
  script.src = OPENAI_SDK_URL;
  (doc.body ?? doc.head).appendChild(script);
}

/** Install OpenAI's pixel on this page, if this page is allowed to have it. Never throws, never blocks.
 *
 *  Order: host, team device, page list (verified-pages mode); then the queue stub, `init` and one
 *  `page_viewed` (queued, so funnel calls made before the SDK arrives are queued too); then, per policy,
 *  the SDK script. If the guard refuses, the stub is removed and the queued calls are dropped, so
 *  `oaiqMeasure` becomes a no-op again. */
export async function loadOpenAiPixel(options: OpenAiLoadOptions = {}): Promise<OpenAiLoadResult> {
  try {
    const win = (options.window ?? window) as OaiqWindow;
    const { location, document: doc } = win;
    const policy = options.policy ?? OPENAI_AAM_POLICY;
    const warn = options.warn ?? ((message: string) => console.warn(message));

    if (!shouldLoadOpenAiPixel(location.hostname)) return "skipped";

    const storage = safeStorage(win);
    if (isInternalDevice(location, storage)) {
      clearOpenAiCookies(doc);
      return "internal";
    }

    if (policy === "verified-pages" && !isOpenAiPixelPage(location.hostname, location.pathname)) {
      return "page-not-verified";
    }

    if (win.oaiq) return "loaded"; // already installed on this page

    let debug = false;
    try {
      debug = storage?.getItem(DEBUG_KEY) === "1";
    } catch {
      /* the switch is a convenience */
    }
    const oppref = currentOppref(location, doc);

    installStub(win);
    /* `init` carries the pixel ID, the click reference and (for the team) debug. Never a `user`. */
    win.oaiq!("init", { pixelId: OPENAI_PIXEL_ID, ...(debug ? { debug: true } : {}), ...(oppref ? { oppref } : {}) });
    win.oaiq!("measure", "page_viewed", { type: "contents" });

    const schedule = options.schedule ?? ((run: () => void) => run());
    const fetchImpl = options.fetch ?? (typeof fetch === "function" ? fetch.bind(globalThis) : null);

    return await new Promise<OpenAiLoadResult>((resolve) => {
      schedule(() => {
        void (async () => {
          try {
            if (policy === "require-off") {
              const off = fetchImpl ? await aamReportedOff(fetchImpl, options.configTimeoutMs ?? CONFIG_TIMEOUT_MS) : false;
              if (!off) {
                delete win.oaiq;
                warn(
                  "[openai-pixel] not loaded: OpenAI does not report automatic advanced matching as off for this pixel (or its setting could not be read).",
                );
                resolve("refused");
                return;
              }
            }
            insertSdk(doc);
            resolve("loaded");
          } catch {
            delete win.oaiq;
            resolve("refused");
          }
        })();
      });
    });
  } catch {
    return "skipped";
  }
}

/** One OpenAI event from the funnel. A no-op when the pixel is not on this page (off a production host, a
 *  team device, a refused guard, a blocked script). `options.event_id` is the de-duplication key the
 *  server's Conversions API call shares. */
export function oaiqMeasure(event: string, data: object, options?: { event_id?: string }): void {
  try {
    if (typeof window === "undefined") return;
    const oaiq = (window as OaiqWindow).oaiq;
    if (typeof oaiq !== "function") return;
    if (options) oaiq("measure", event, data, options);
    else oaiq("measure", event, data);
  } catch {
    /* measurement must never break the checkout */
  }
}
