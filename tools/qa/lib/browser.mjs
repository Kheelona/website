import { puppeteerPath, chromePath } from "./resolve.mjs";

/** The shared browser setup for every visual and a11y check (§8.23, §8.25-bb).
 *
 *  Four hard-won behaviours are baked in here rather than remembered:
 *
 *  1. **Never the Chrome extension.** Its window is locked around 390px and its
 *     tab runs hidden, which freezes IntersectionObserver reveals and defers
 *     image painting. A screenshot from it is not evidence.
 *  2. **Third-party requests are ABORTED.** The Ahrefs tag is on every page and
 *     never resolves offline, so `waitUntil: "networkidle0"` waits forever. We
 *     wait on the DOM and block anything not ours.
 *  3. **Reveals are FORCED and given time to settle.** axe cannot see an
 *     un-revealed room, and a pass run before the DOM settles reports clean for
 *     the wrong reason (§8.24-5e).
 *  4. **Named hosts are mapped to 127.0.0.1 ONLY for local targets**, because the
 *     store lives on a subdomain and `localhost` does not resolve in this
 *     headless Chrome. The mapping is derived from the URL: map for a local
 *     target, never for a real one. Mapping unconditionally is a bug that was
 *     shipped and caught the same hour, when a production sweep returned 30
 *     CONNECTION_REFUSED because kheelona.com was being pointed at localhost.
 *     For Lighthouse use `store.localhost`, which avoids the HSTS interstitial
 *     the real kheelona.com serves. */
const HOST_MAP = "MAP store.kheelona.com 127.0.0.1,MAP kheelona.com 127.0.0.1,MAP www.kheelona.com 127.0.0.1";

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "store.localhost"]);

/** Is this target a local dev server? Decides whether to fake DNS for the
 *  kheelona hostnames. A real https:// origin must always resolve for real.
 *
 *  ANY explicit port means local. It used to name 3456, which is the port the
 *  runbook uses, and that silently broke the moment a second server was needed
 *  on 3457: the store shot spent 45 seconds trying to reach the real
 *  store.kheelona.com on a port nothing serves. Production URLs carry no port. */
export function looksLocal(url) {
  try {
    const { hostname, port } = new URL(url);
    return LOCAL_HOSTS.has(hostname) || hostname.endsWith(".localhost") || port !== "";
  } catch {
    return false;
  }
}

/** Open a page. `allow` names third-party host suffixes to let through, and
 *  defaults to none, which is what behaviour 2 above is about.
 *
 *  Pass it ONLY when the third party is the thing under test. The payment probe
 *  passes Razorpay, because a payment sheet that cannot load is the finding.
 *  Do not pass a measurement host: those tags report to the founder's real
 *  properties, and a QA run has no business appearing in them. */
export async function openPage({
  width = 1280,
  height = 900,
  scale = 1,
  local = true,
  allow = [],
} = {}) {
  const puppeteer = await import(puppeteerPath());
  const browser = await puppeteer.default.launch({
    executablePath: chromePath(),
    headless: true,
    args: ["--no-sandbox", ...(local ? [`--host-resolver-rules=${HOST_MAP}`] : [])],
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: scale });

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = new URL(request.url());
    const ours =
      LOCAL_HOSTS.has(url.hostname) ||
      url.hostname.endsWith("kheelona.com") ||
      allow.some((suffix) => url.hostname === suffix || url.hostname.endsWith(`.${suffix}`));
    if (ours || url.protocol === "data:" || url.protocol === "blob:") request.continue();
    else request.abort();
  });

  return { browser, page };
}

/** Load, force every reveal open, and let it settle. */
export async function loadSettled(page, url, { settleMs = 1500 } = {}) {
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.evaluate(() => {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("reveal-in"));
  });
  await new Promise((resolve) => setTimeout(resolve, settleMs));
  return response;
}
