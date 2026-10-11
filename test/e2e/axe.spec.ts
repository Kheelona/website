import type { Page } from "@playwright/test";
import { describeFindings, runAxe } from "./support/axe";
import { expect, forceMotionEnd, gateRouteGroup, settle, test } from "./support/fixtures";
import { sweepRoutes } from "./support/routes";
import { AXE_TEMPLATE_EXTRA, AXE_VIEWPORTS } from "./support/viewports";

/* Accessibility (task 1.1; architecture §13, test plan §4.5, tasks.md SPA 3).
 *
 * axe-core 4.12.1 (the baseline's engine), WCAG 2.0, 2.1 and 2.2 A and AA plus best practice, on
 * every built route at 360, 390, 1440 and 1920 (templates also 412), with reveals forced, doodles
 * drawn, reduced motion on and a 1.5 s settle (axe skips opacity 0). States: the page as loaded,
 * the phone drawer open, and the first FAQ answer open. Zero critical or serious violations, apart
 * from the classified exceptions (support/axe.ts), which are printed on every run.
 */

async function check(page: Page, label: string): Promise<void> {
  await page.waitForTimeout(1500);
  const r = await runAxe(page);
  if (r.accepted.length) console.log(`[axe] ${label}: accepted exceptions\n${describeFindings(r.accepted)}`);
  if (r.apart.length) console.log(`[axe] ${label}: white on Kheelu Blue, printed apart until the founder rules\n${describeFindings(r.apart)}`);
  if (r.minor.length) console.log(`[axe] ${label}: moderate or minor\n${describeFindings(r.minor)}`);
  expect(r.blocking, `${label}: critical or serious axe violations\n${describeFindings(r.blocking)}`).toEqual([]);
}

for (const route of sweepRoutes()) {
  const viewports = route.template === "article" || route.template === "legal" ? [...AXE_VIEWPORTS, AXE_TEMPLATE_EXTRA] : AXE_VIEWPORTS;
  test.describe(`axe: ${route.id}`, () => {
    gateRouteGroup(route);

    for (const vp of viewports) {
      test(vp.name, async ({ harness }) => {
        const { page } = await harness.open(route, vp);
        await forceMotionEnd(page);
        await settle(page);
        await check(page, `${route.id} ${vp.name}`);

        const menu = page.locator("[data-open-menu], button[aria-controls][aria-expanded]").first();
        if (vp.isMobile && (await menu.isVisible().catch(() => false))) {
          await menu.click();
          await check(page, `${route.id} ${vp.name} drawer open`);
          await page.keyboard.press("Escape");
        }

        const faq = page.locator("main details > summary").first();
        if (await faq.count()) {
          await faq.scrollIntoViewIfNeeded();
          await faq.click();
          await check(page, `${route.id} ${vp.name} FAQ open`);
        }
      });
    }
  });
}
