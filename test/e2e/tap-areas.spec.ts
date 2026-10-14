import type { Page } from "@playwright/test";
import { expect, gateRouteGroup, requiresServer, test } from "./support/fixtures";
import { sweepRoutes, type Route } from "./support/routes";
import { STAND_IN_ON, ensureStandIn, signedEventRoute } from "./support/store-stand-in";
import { APPROVED_WIDTHS } from "./support/viewports";

/* A tap lands on the link under the finger (task 7.1a; CMO built-page review A, B1, 2026-10-14).
 *
 * The trust and help lines give their links an invisible ::before tap area. Where those areas overlapped (the help line
 * a few pixels under the trust line; the help line's two links wrapped onto two lines at 360 px; /setup's "Stuck?"
 * paragraph), a tap on "7-day returns, no questions asked" opened WhatsApp or a phone call, and counted as a call or
 * chat click. Since 7.1a a help line sits 24 px (two tap extensions, --space-5) under a trust line, and links inside a
 * sentence (every help line, /setup's paragraph) carry no extension (WCAG 2.5.8's inline exception; their 28 px link
 * box keeps axe's target size).
 *
 * The rule, on every built route at the three approved widths (360 x 640, 390 x 844, 1440 x 900): the words of a link
 * are its own. Nine points across each line of a link's text (a quarter, half and three quarters of the way, both
 * ways) must each find that link (or something inside it) with elementFromPoint:
 *   - every link on the first screen, as the page opens (the phone screens a parent lands on from an ad);
 *   - every link of a trust line or a help line anywhere on the page, each scrolled into the middle of the screen (the
 *     closes, Home's close, /setup's "Stuck?" paragraph, the laptop hero).
 * The bubble and the bar float over the page and have their own specs (chrome.spec.ts), so both are out of the hit
 * test here; a point outside the screen or outside a scrolling box that clips the link is not a tap. The approved mockup
 * has the defect (mockup/mockup.css:29-31, frozen, D046), so this spec runs on the build only; the pixels it moves are
 * the tap-area row of wiki/qa/deviations.md (V23) (test/e2e/support/deviations.ts TAP_AREA_HIDDEN).
 */

requiresServer();
// The store's routes sell only against the read-only stand-in when the server runs with its environment (shared with
// the other store specs: reused when another worker's answers, never closed).
test.beforeEach(async () => {
  if (STAND_IN_ON) await ensureStandIn();
});

/** A link whose words another element answers for: the link, then what answered at those points. */
type Taken = { link: string; by: string[] };

/** In the page: every link the scope selects, its text hit-tested at nine points per line; returns the links whose
 *  points find something else. `scroll` brings each one to the middle of the screen first; without it only what is on
 *  the screen now is tested. Self-contained (it runs in the browser). */
function takenLinks({ selector, scroll }: { selector: string; scroll: boolean }): Taken[] {
  const style = document.createElement("style");
  style.textContent = ".ks-wa, .kh-buybar { visibility: hidden !important; }";
  document.head.append(style);
  const name = (el: Element | null): string => {
    if (!el) return "nothing";
    const target = el.closest("a[href], button, summary");
    if (target) return `${target.tagName.toLowerCase()} "${(target.textContent || target.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 48)}"`;
    return `<${el.tagName.toLowerCase()}${typeof el.className === "string" && el.className.trim() ? `.${el.className.trim().split(/\s+/).join(".")}` : ""}>`;
  };
  /** The part of the screen a link can be tapped in: the viewport, narrowed by every ancestor that clips. */
  const clipOf = (el: Element) => {
    // The page's own viewport: without a laptop's scrollbar, whose points belong to no element.
    const box = { left: 0, top: 0, right: document.documentElement.clientWidth, bottom: document.documentElement.clientHeight };
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.overflowX === "visible" && s.overflowY === "visible") continue;
      const r = p.getBoundingClientRect();
      box.left = Math.max(box.left, r.left);
      box.top = Math.max(box.top, r.top);
      box.right = Math.min(box.right, r.right);
      box.bottom = Math.min(box.bottom, r.bottom);
    }
    return box;
  };
  const out: Taken[] = [];
  for (const link of Array.from(document.querySelectorAll<HTMLAnchorElement>(selector))) {
    if (!link.checkVisibility({ visibilityProperty: true }) || link.closest("dialog:not([open])")) continue;
    // Each line of the link's words, and its icon. Words in a visually hidden note ("(opens in a new tab)", kh-sr: a
    // 1 x 1 px clipped box whose text still lays out past it) are nobody's to tap, so they are left out.
    const shown = (node: Node) => {
      for (let el = node.parentElement; el && el !== link.parentElement; el = el.parentElement) {
        const r = el.getBoundingClientRect();
        if (r.width <= 1 || r.height <= 1) return false;
      }
      return true;
    };
    const lines = () => {
      const rects: DOMRect[] = [];
      const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.nodeValue?.trim() || !shown(node)) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        rects.push(...Array.from(range.getClientRects()));
      }
      for (const icon of Array.from(link.querySelectorAll("svg"))) if (shown(icon.firstChild ?? icon)) rects.push(icon.getBoundingClientRect());
      return rects.filter((r) => r.width > 1 && r.height > 1);
    };
    if (lines().length === 0) continue;
    if (scroll) link.scrollIntoView({ block: "center", inline: "nearest", behavior: "instant" });
    const clip = clipOf(link);
    const by = new Set<string>();
    for (const r of lines()) {
      for (const fy of [0.25, 0.5, 0.75]) {
        for (const fx of [0.25, 0.5, 0.75]) {
          const x = r.left + r.width * fx;
          const y = r.top + r.height * fy;
          // A point on or past the far edge is outside the screen (elementFromPoint answers null there).
          if (x < clip.left || x >= clip.right || y < clip.top || y >= clip.bottom) continue;
          const hit = document.elementFromPoint(x, y);
          if (hit && (hit === link || link.contains(hit))) continue;
          by.add(name(hit));
        }
      }
    }
    if (by.size > 0) out.push({ link: name(link), by: [...by] });
  }
  style.remove();
  return out;
}

/** The source markers ("[1]" after a sourced line; SourceMarker, task 2.2): inline links whose ::before tap area
 *  (source-marker.css) reached 12 px above and below and 8 px each side, so where two markers sat side by side or on
 *  consecutive lines of an article one took the other's taps (task 7.1a found it; the main session's ruling at the wave 8
 *  merge cut the area to 4 px above and below). Every marker on the page, scrolled to, must answer for its own words. */
const SOURCE_MARKER = ".ks-src";

/** Every link on the first screen as the page opens, then every trust and help link, top to bottom. */
async function checkTapAreas(page: Page, label: string): Promise<void> {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const firstScreen = await page.evaluate(takenLinks, { selector: `a[href]:not(${SOURCE_MARKER})`, scroll: false });
  expect(firstScreen, `${label}: on the first screen, a tap on these words opens another link`).toEqual([]);
  const lines = await page.evaluate(takenLinks, { selector: ".ks-trust a[href], .ks-help a[href]", scroll: true });
  expect(lines, `${label}: in a trust or help line, a tap on these words opens another link`).toEqual([]);
  const markers = await page.evaluate(takenLinks, { selector: `a[href]${SOURCE_MARKER}`, scroll: true });
  expect(markers, `${label}: a tap on these source markers opens another link`).toEqual([]);
}

for (const route of sweepRoutes()) {
  test.describe(`tap areas: ${route.id}`, () => {
    gateRouteGroup(route);
    for (const vp of APPROVED_WIDTHS) {
      test(vp.name, async ({ harness }) => {
        const { page } = await harness.open(route, vp);
        await checkTapAreas(page, `${route.id} ${vp.name}`);
      });
    }
  });
}

test.describe("tap areas: the signed event page (the store's folds, its own route)", () => {
  test.skip(!STAND_IN_ON, "pending: the signed event page sells only with the read-only store stand-in (test/e2e/support/store-stand-in.ts)");
  for (const vp of APPROVED_WIDTHS) {
    test(vp.name, async ({ harness }) => {
      const route: Route = signedEventRoute();
      const { page } = await harness.open(route, vp);
      await checkTapAreas(page, `event ${vp.name}`);
    });
  }
});
