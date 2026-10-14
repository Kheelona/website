import type { Page } from "@playwright/test";
import { describeFindings, runAxe } from "./support/axe";
import { expect, forceMotionEnd, nodeGet, settle, test } from "./support/fixtures";
import type { Route } from "./support/routes";
import { STAND_IN_ON, STAND_IN_PENDING, ensureStandIn, signedEventRoute } from "./support/store-stand-in";
import { APPROVED_WIDTHS, AXE_TEMPLATE_EXTRA, AXE_VIEWPORTS, SIDEWAYS_VIEWPORTS, type Viewport } from "./support/viewports";

/* The store's secondary pages on the store host (task 6.1; architecture §16.1; tasks.md SPA 3, 4, 5, 9 for routes
 * with no mockup): the event page /e/<tier>, a dead end (any path with no page; also the doubled /store prefix, and
 * /ideabaaz, whose partner page is gone: D054 item 7, task 6.6), each at 200 in the store chrome with the store's
 * WhatsApp bubble.
 *
 * Per route: the server's HTML (status 200, store header and footer around <main>, noindex, nofollow, description,
 * Open Graph and Twitter, og:url only where the address is stable); at the three approved widths the one h1, the
 * payments line closing <main> and the bubble with the store's text; axe at 360, 390, 412, 1440 and 1920 (zero
 * critical or serious apart from the classified exceptions, support/axe.ts); no sideways scroll on the whole matrix
 * (320 px and test plan §3).
 *
 * The state a route shows depends on the server's store keys, and both are honest: with none (locally, in CI, on
 * beta, D051) the event page says "Pre-orders open here shortly."; with keys a link without a signature is refused.
 * The signed event page sells only with a store database, so its form is
 * checked against a local, read-only stand-in of the store's REST API (one tier, no orders; it refuses every write),
 * shared with axe.spec.ts since task 6.3: run the server with the environment in test/e2e/support/store-stand-in.ts
 * (fake values only, never a real key; nothing is submitted). Without it that block prints as pending.
 */

const store = (id: string, path: string): Route => ({
  id,
  host: "store",
  path,
  mockup: null,
  buybar: false,
  chrome: false,
  title: null,
  description: null,
  template: "store",
});

const SHORTLY = "Pre-orders open here shortly.";

type Expect = {
  route: Route;
  /** The h1 in each state the server may be in. */
  h1: readonly string[];
  description: readonly string[];
  /** og:url, or null where the page has none (the address is the link itself). */
  ogUrl: string | null;
};

const ROUTES: readonly Expect[] = [
  {
    route: store("store-dead-end", "/kh-e2e-no-such-page"),
    h1: ["That page is not here."],
    description: ["The link may have expired, or it may never have been ours. If you were trying to reach an order you have already placed, we can open it for you."],
    ogUrl: null,
  },
  {
    // The doubled prefix: /store on the store host becomes /store/store/…, which only the catch-all answers.
    route: store("store-doubled-prefix", "/store/kh-e2e"),
    h1: ["That page is not here."],
    description: ["The link may have expired, or it may never have been ours. If you were trying to reach an order you have already placed, we can open it for you."],
    ogUrl: null,
  },
  {
    route: store("event-unsigned", "/e/kh-e2e-event"),
    h1: ["That link will not work.", SHORTLY],
    description: ["Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7."],
    ogUrl: null,
  },
  {
    // The Ideabaaz partner page is gone (D054 item 7, task 6.6): its address, which printed QR codes carry, is a store
    // dead end, with no redirect, whatever the store's keys.
    route: store("partner-retired", "/ideabaaz"),
    h1: ["That page is not here."],
    description: ["The link may have expired, or it may never have been ours. If you were trying to reach an order you have already placed, we can open it for you."],
    ogUrl: null,
  },
];

/** Every viewport a route is opened at: the sideways matrix, axe's (with the template's 412) and the approved three. */
const MATRIX: readonly Viewport[] = [...new Map([...SIDEWAYS_VIEWPORTS, ...AXE_VIEWPORTS, AXE_TEMPLATE_EXTRA, ...APPROVED_WIDTHS].map((v) => [v.name, v])).values()];
const isAxe = (v: Viewport) => [...AXE_VIEWPORTS, AXE_TEMPLATE_EXTRA].some((a) => a.name === v.name);
const isApproved = (v: Viewport) => APPROVED_WIDTHS.some((a) => a.name === v.name);

async function sideways(page: Page): Promise<{ scrollWidth: number; clientWidth: number } | null> {
  const m = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  return m.scrollWidth > m.clientWidth ? m : null;
}

async function axe(page: Page, label: string): Promise<void> {
  const r = await runAxe(page);
  if (r.accepted.length) console.log(`[axe] ${label}: accepted exceptions\n${describeFindings(r.accepted)}`);
  if (r.apart.length) console.log(`[axe] ${label}: white on Kheelu Blue, printed apart until the founder rules\n${describeFindings(r.apart)}`);
  if (r.minor.length) console.log(`[axe] ${label}: moderate or minor\n${describeFindings(r.minor)}`);
  expect(r.blocking, `${label}: critical or serious axe violations\n${describeFindings(r.blocking)}`).toEqual([]);
}

/** The page as a store page: one h1 from the allowed states, the payments line closing <main>, the store's bubble. */
async function storePageChecks(page: Page, h1: readonly string[], label: string): Promise<string> {
  const headings = await page.locator("main h1").allTextContents();
  expect(headings, `${label}: one h1`).toHaveLength(1);
  expect(h1, `${label}: the h1 "${headings[0]}"`).toContain(headings[0]);
  const close = await page.evaluate(() => {
    const kids = Array.from(document.querySelector("main")!.children);
    return { last: kids.at(-1)?.matches("a.kh-iconbtn.kh-iconbtn--l.ks-wa") ?? false, beforeLast: kids.at(-2)?.className ?? "" };
  });
  expect(close, `${label}: the payments line, then the bubble, close <main>`).toEqual({ beforeLast: "ks-store-payments", last: true });
  const bubble = page.locator("main a.ks-wa");
  expect(decodeURIComponent((await bubble.getAttribute("href")) ?? "")).toBe("https://wa.me/919187546483?text=Hi Kheelona! I need help with my pre-order.");
  // Shown, unless a form's section crosses its band on a phone: then it steps aside, off the right edge and inert,
  // so it never covers a field (D050; WhatsAppFloat's STEP_ASIDE_FROM, task 4.7).
  if (await bubble.evaluate((a) => a.classList.contains("is-hidden"))) {
    expect(await page.locator("main #details form").count(), `${label}: the bubble steps aside only from the form`).toBe(1);
    expect(page.viewportSize()!.width).toBeLessThan(900);
    await expect(bubble).toHaveAttribute("inert", "");
  } else {
    await expect(bubble).toBeVisible();
  }
  await expect(page.locator("header.ks-store-head")).toHaveCount(1);
  await expect(page.locator("footer.ks-store-foot")).toHaveCount(1);
  // Not the marketing chrome: no site navigation, no buy bar (the store's own header and footer only).
  await expect(page.locator("nav.kh-nav, .kh-buybar")).toHaveCount(0);
  return headings[0];
}

const meta = (html: string, attr: "name" | "property", key: string): string | null => {
  const m = new RegExp(`<meta ${attr}="${key.replace(/[.:]/g, "\\$&")}" content="([^"]*)"`).exec(html);
  return m ? m[1].replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'") : null;
};

for (const { route, h1, description, ogUrl } of ROUTES) {
  test.describe(`store secondary page: ${route.id}`, () => {
    test("the server answers 200 in the store chrome: noindex, its description and share card", async () => {
      const res = await nodeGet(route.path, "store");
      expect(res.status, `${route.path} answered ${res.status}`).toBe(200);
      // Never a redirect (D054 item 7 for /ideabaaz; a dead end is answered where it was asked).
      expect(res.headers.location, `${route.path} redirected`).toBeUndefined();
      const html = res.body;
      const main = html.search(/<main\b/);
      expect(main).toBeGreaterThan(html.search(/class="kh-nav ks-store-head"/));
      expect(html.search(/class="kh-footer ks-store-foot"/)).toBeGreaterThan(main);
      expect(meta(html, "name", "robots")).toBe("noindex, nofollow");
      expect(description).toContain(meta(html, "name", "description"));
      expect(meta(html, "property", "og:title")).not.toBeNull();
      expect(meta(html, "property", "og:image")).not.toBeNull();
      expect(meta(html, "name", "twitter:card")).toBe("summary_large_image");
      expect(meta(html, "property", "og:url")).toBe(ogUrl);
      expect(html).not.toMatch(/__next_error__/);
      // Every site-relative link in <main> (the panel's way back to the pre-order page) answers on the store host.
      const body = html.slice(main, html.search(/<\/main>/));
      const local = [...new Set([...body.matchAll(/href="(\/(?!\/)[^"#]*)/g)].map((m) => m[1]))];
      for (const href of local) expect((await nodeGet(href, "store")).status, `${route.path}: link ${href}`).toBe(200);
    });

    for (const vp of MATRIX) {
      test(vp.name, async ({ harness }) => {
        const { page, response } = await harness.open(route, vp);
        expect(response?.status()).toBe(200);
        await forceMotionEnd(page);
        const label = `${route.id} ${vp.name}`;
        expect(await sideways(page), `${label}: the page scrolls sideways`).toBeNull();
        if (isApproved(vp)) {
          const state = await storePageChecks(page, h1, label);
          console.log(`[store] ${label}: "${state}"`);
        }
        if (isAxe(vp)) {
          await settle(page);
          await axe(page, label);
        }
      });
    }
  });
}

/* ── The signed event page, selling (needs the read-only database stand-in; see the header) ──────────────────────── */

test.describe("store secondary page: event-signed (the form)", () => {
  test.skip(!STAND_IN_ON, STAND_IN_PENDING);
  // The stand-in is shared with axe.spec.ts: reused when another worker's answers, never closed (store-stand-in.ts).
  test.beforeEach(() => ensureStandIn());

  for (const vp of MATRIX) {
    test(vp.name, async ({ harness }) => {
      const { page, response } = await harness.open(signedEventRoute(), vp);
      expect(response?.status()).toBe(200);
      await forceMotionEnd(page);
      const label = `event-signed ${vp.name}`;
      await expect(page.locator("main form")).toHaveCount(1);
      await expect(page.locator(".ks-store-top .kh-eyebrow")).toHaveText("Bangalore expo price");
      await expect(page.locator("main button[type=submit]")).toHaveText("Pay ₹99 and reserve");
      expect(await sideways(page), `${label}: the page scrolls sideways`).toBeNull();
      if (isApproved(vp)) {
        await storePageChecks(page, ["Pre-order Kheelu."], label);
        await expect(page.locator(".ks-store-top__price")).toHaveText(
          "Reserve yours for ₹99 today, refundable until dispatch, then pay ₹4,900 before delivery: ₹4,999 in total (incl. GST).",
        );
      }
      if (isAxe(vp)) {
        await settle(page);
        await axe(page, label);
        // Text fields at 16 px or more (iOS zooms the page on focus; architecture §16.2).
        const small = await page.evaluate(() =>
          Array.from(document.querySelectorAll<HTMLElement>("main input:not([type=checkbox]), main select, main textarea"))
            .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 16)
            .map((el) => el.getAttribute("name")),
        );
        expect(small, `${label}: text fields under 16 px`).toEqual([]);
        // The form submitted empty: its errors, checked too (the browser never reaches the server).
        await page.locator("main button[type=submit]").click();
        await expect(page.locator("main [aria-invalid='true']").first()).toBeVisible();
        await axe(page, `${label} with errors`);
      }
    });
  }
});
