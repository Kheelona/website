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
 *  4. **Named hosts are mapped to 127.0.0.1**, because the store lives on a
 *     subdomain and `localhost` does not resolve in this headless Chrome. Use
 *     `store.localhost` for Lighthouse, which hits an HSTS interstitial on the
 *     real kheelona.com. */
const HOST_MAP = "MAP store.kheelona.com 127.0.0.1,MAP kheelona.com 127.0.0.1,MAP www.kheelona.com 127.0.0.1";

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "store.localhost"]);

export async function openPage({ width = 1280, height = 900, scale = 1 } = {}) {
  const puppeteer = await import(puppeteerPath());
  const browser = await puppeteer.default.launch({
    executablePath: chromePath(),
    headless: true,
    args: ["--no-sandbox", `--host-resolver-rules=${HOST_MAP}`],
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: scale });

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = new URL(request.url());
    const ours = LOCAL_HOSTS.has(url.hostname) || url.hostname.endsWith("kheelona.com");
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
