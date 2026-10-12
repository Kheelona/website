import { readRepoFile } from "./support/repo";
import { MOCKUP_SLUGS, type MockupSlug } from "./support/mockup-text";
import { mockupRoutes, sweepRoutes } from "./support/routes";
import { PARITY_TARGET, REAL_ORIGINS, TARGET } from "./support/env";
import { expect, gateRouteGroup, test } from "./support/fixtures";
import { VIEWPORTS } from "./support/viewports";

/* CTA values (task 1.1; architecture §8.3, test plan §4.1 and §7.1, tasks.md SPA 6).
 *
 * On every built page: every chilli link (a.kh-btn--cta) reads exactly "Pre-order Kheelu", goes
 * exactly to STORE_URL (https://store.kheelona.com on L; betastore on beta) in the same tab, and
 * carries data-ph-capture-attribute-cta with a registered value. The set of values on a page
 * equals the set its approved mockup carries, plus "whatsapp-float" (the D050 bubble, every page).
 * The reserved values "home-arc" and "compare" appear nowhere. The store's pay button is a submit
 * button, not a link, and carries no value (inventory: not tagged).
 *
 * Registered values: every value the approved mockup uses anywhere, plus "whatsapp-float". The
 * registry itself (src/lib/tracking/cta.ts, task 1.4) is checked against them by its own guards.
 */

const LABEL = "Pre-order Kheelu";
/** The mockup links its store page by file name; the build links STORE_URL. */
const STORE_URL = PARITY_TARGET === "mockup" ? "store.html" : TARGET === "beta" ? "https://betastore.kheelona.com" : REAL_ORIGINS.store;
const RESERVED = ["home-arc", "compare"];
const D050 = "whatsapp-float";

function mockupValues(slug: MockupSlug): string[] {
  const html = readRepoFile(`mockup/${slug}.html`);
  return [...new Set([...html.matchAll(/data-ph-capture-attribute-cta="([^"]+)"/g)].map((m) => m[1]))].sort();
}
const REGISTERED = new Set([...MOCKUP_SLUGS.flatMap(mockupValues), D050]);

test.describe("CTA values: the approved mockup (control)", () => {
  test("carries the six live existing values and neither reserved one (of the eight existing)", () => {
    for (const v of ["hero", "navbar", "navbar-mobile", "finale", "product-top", "product-foot"]) expect(REGISTERED.has(v)).toBe(true);
    for (const v of RESERVED) expect(REGISTERED.has(v), `${v} is reserved (A16)`).toBe(false);
  });
});

for (const route of sweepRoutes()) {
  test.describe(`CTA values: ${route.id}`, () => {
    gateRouteGroup(route);

    test("chilli links, labels, destination and values", async ({ harness }) => {
      const { page } = await harness.open(route, VIEWPORTS[0]);
      const ctas = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLAnchorElement>("a.kh-btn--cta")).map((a) => ({
          text: (a.textContent ?? "").replace(/\s+/g, " ").trim(),
          href: a.getAttribute("href"),
          target: a.getAttribute("target"),
          cta: a.getAttribute("data-ph-capture-attribute-cta"),
        })),
      );
      for (const c of ctas) {
        expect.soft(c.text, `${route.id}: chilli link label`).toBe(LABEL);
        expect.soft(c.href, `${route.id}: chilli link "${c.cta}" destination`).toBe(STORE_URL);
        expect.soft(c.target, `${route.id}: chilli link "${c.cta}" opens in the same tab`).toBeNull();
        expect.soft(c.cta && REGISTERED.has(c.cta), `${route.id}: chilli link value "${c.cta}" is not registered`).toBe(true);
      }
      const values = [
        ...new Set(
          await page.evaluate(() =>
            Array.from(document.querySelectorAll("[data-ph-capture-attribute-cta]")).map((e) => e.getAttribute("data-ph-capture-attribute-cta")!),
          ),
        ),
      ].sort();
      for (const v of RESERVED) expect.soft(values, `${route.id}: reserved value ${v} is in use`).not.toContain(v);
      if (route.mockup && mockupRoutes().some((r) => r.id === route.id)) {
        // The D050 bubble came after Gate A: the mockup itself (self-test) does not carry it.
        const expected = [...new Set([...mockupValues(route.mockup), ...(PARITY_TARGET === "mockup" ? [] : [D050])])].sort();
        expect(values, `${route.id}: the values on the page differ from its approved mockup plus ${D050}`).toEqual(expected);
      } else {
        expect(values.every((v) => REGISTERED.has(v)), `${route.id}: unregistered values ${values.filter((v) => !REGISTERED.has(v))}`).toBe(true);
      }
    });
  });
}
