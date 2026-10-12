import { NOT_FOUND_PATH, sweepRoutes, type Route } from "./support/routes";
import { expect, gateRouteGroup, nodeGet, requiresServer, test } from "./support/fixtures";
import { VIEWPORTS } from "./support/viewports";

/* Internal links resolve (task 1.1; architecture §9.4, test plan §4.2, tasks.md SPA 5).
 *
 * Every internal link on every built route answers 200, or one permanent redirect to a URL that
 * answers 200 (never a chain, never a 404). Links to https://kheelona.com and
 * https://store.kheelona.com count as internal and are checked on the local server under the
 * right host. A fragment link (#faq) must name an element on its page. External links (WhatsApp,
 * tel:, mailto:, sources) are not requested: no probe reaches a third party.
 */

type Target = { host: Route["host"]; path: string; fragment: string };

function internal(href: string, from: Route): Target | null {
  if (/^(?:mailto|tel|sms|javascript):/i.test(href)) return null;
  const base = from.host === "store" ? "https://store.kheelona.com" : "https://kheelona.com";
  let url: URL;
  try {
    url = new URL(href, `${base}${from.path === NOT_FOUND_PATH ? "/" : from.path}`);
  } catch {
    return null;
  }
  const host = /^(?:www\.)?kheelona\.com$|^localhost$|^betawebsite\.kheelona\.com$/.test(url.hostname)
    ? "marketing"
    : /^(?:store|betastore)\.kheelona\.com$|^store\.localhost$/.test(url.hostname)
      ? "store"
      : null;
  return host ? { host, path: `${url.pathname}${url.search}`, fragment: url.hash.slice(1) } : null;
}

for (const route of sweepRoutes()) {
  test.describe(`links: ${route.id}`, () => {
    requiresServer();
    gateRouteGroup(route);

    test("every internal link resolves in at most one redirect", async ({ harness }) => {
      const { page } = await harness.open(route, VIEWPORTS[0]);
      const hrefs = await page.evaluate(() => Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href")!));
      const ids = new Set(await page.evaluate(() => Array.from(document.querySelectorAll("[id]")).map((e) => e.id)));
      const seen = new Map<string, string>();
      const problems: string[] = [];
      for (const href of hrefs) {
        const t = internal(href, route);
        if (!t) continue;
        if (t.path === route.path && t.host === route.host && t.fragment) {
          if (!ids.has(t.fragment)) problems.push(`${href}: no element with id "${t.fragment}" on this page`);
          continue;
        }
        const key = `${t.host} ${t.path}`;
        if (seen.has(key)) continue;
        const first = await nodeGet(t.path, t.host);
        let verdict = `${first.status}`;
        if ([301, 308].includes(first.status)) {
          const next = internal(String(first.headers.location ?? ""), { ...route, host: t.host, path: t.path });
          const second = next ? await nodeGet(next.path, next.host) : null;
          verdict = second ? `${first.status} → ${second.status}` : `${first.status} → (external)`;
          if (second && second.status !== 200) problems.push(`${href}: ${verdict} (a redirect chain or a dead target)`);
        } else if (first.status !== 200) {
          problems.push(`${href}: ${first.status}`);
        }
        seen.set(key, verdict);
      }
      console.log(`[links] ${route.id}: ${seen.size} internal URL(s) checked.`);
      expect(problems, `${route.id}: broken internal links`).toEqual([]);
    });
  });
}
