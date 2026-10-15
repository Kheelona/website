import { CTAS, CTA_VALUES } from "@/lib/tracking/cta";
import { readRepoFile } from "./support/repo";
import { MOCKUP_SLUGS, type MockupSlug } from "./support/mockup-text";
import { mockupRoutes, sweepRoutes, type Route } from "./support/routes";
import { PARITY_TARGET, REAL_ORIGINS, TARGET } from "./support/env";
import { expect, gateRouteGroup, test } from "./support/fixtures";
import { VIEWPORTS } from "./support/viewports";

/* CTA values (task 1.1; architecture §8.3, test plan §4.1 and §7.1, tasks.md SPA 6).
 *
 * On every built page: every chilli link (a.kh-btn--cta) reads exactly "Pre-order Kheelu", goes
 * exactly to STORE_URL (https://store.kheelona.com on L; betastore on beta) in the same tab, and
 * carries data-ph-capture-attribute-cta with a registered value. The set of values on a page
 * equals the set its approved mockup carries, plus the values a founder placed after Gate A:
 * "whatsapp-float" (the D050 bubble, every page) and "share-whatsapp" (D061's share link under the
 * offer card, task 8c.2), each on the routes the registry (src/lib/tracking/cta.ts) places it.
 * The reserved values "home-arc" and "compare" appear nowhere. The store's pay button is a submit
 * button, not a link, and carries no value (inventory: not tagged). The phone buy bar's value,
 * "sticky-bar", is on exactly the routes whose `buybar` says so (task 4.9: articles by their close).
 *
 * Registered values: every value the approved mockup uses anywhere, plus the values a founder placed
 * after Gate A: whatsapp-float (D050) and share-whatsapp (D061); tracking inventory §6 lists them.
 * The registry itself (task 1.4) is checked against them by its own guards
 * (test/guards/tracking-registry.test.ts).
 */

const LABEL = "Pre-order Kheelu";
/** The mockup links its store page by file name; the build links STORE_URL. */
const STORE_URL = PARITY_TARGET === "mockup" ? "store.html" : TARGET === "beta" ? "https://betastore.kheelona.com" : REAL_ORIGINS.store;
const RESERVED = ["home-arc", "compare"];
const D050 = "whatsapp-float";
/** The share link under the offer cards (D061, task 8c.2). */
const D061 = "share-whatsapp";
/** The values a founder decision placed after Gate A (inventory §6, the second table): no approved mockup carries them. */
const AFTER_GATE_A: readonly string[] = [D050, D061];

function mockupValues(slug: MockupSlug): string[] {
  const html = readRepoFile(`mockup/${slug}.html`);
  return [...new Set([...html.matchAll(/data-ph-capture-attribute-cta="([^"]+)"/g)].map((m) => m[1]))].sort();
}
const MOCKUP_VALUES: ReadonlySet<string> = new Set(MOCKUP_SLUGS.flatMap(mockupValues));
const REGISTERED = new Set([...MOCKUP_VALUES, ...AFTER_GATE_A]);

/** The values placed after Gate A that a built route carries besides its mockup's: the D050 bubble on every page, and
 *  each other one where the registry places it on this path (share-whatsapp on / and /products/kheelu). The registry's
 *  paths are the marketing site's: the store's own "/" is not Home. */
function afterGateA(route: Pick<Route, "host" | "path">): string[] {
  return CTA_VALUES.filter((v) => {
    if (!AFTER_GATE_A.includes(v)) return false;
    if (v === D050) return true;
    const where: readonly string[] = CTAS[v].pages;
    return route.host === "marketing" && where.includes(route.path);
  });
}

test.describe("CTA values: the approved mockup (control)", () => {
  test("carries the six live existing values and neither reserved one (of the eight existing)", () => {
    for (const v of ["hero", "navbar", "navbar-mobile", "finale", "product-top", "product-foot"]) expect(REGISTERED.has(v)).toBe(true);
    for (const v of RESERVED) expect(REGISTERED.has(v), `${v} is reserved (A16)`).toBe(false);
  });

  test("carries none of the values placed after Gate A (D050, D061), each one in the registry", () => {
    for (const v of AFTER_GATE_A) {
      expect(MOCKUP_VALUES.has(v), `an approved mockup carries ${v}`).toBe(false);
      expect(CTA_VALUES, `${v} is not in src/lib/tracking/cta.ts`).toContain(v);
    }
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
      /* The phone buy bar (its button tracked sticky-bar) is in the page exactly where the route carries it: a mockup
         page's meta, an article's own close, so never on the seven keep-close guides (B5; routes.ts, task 4.9 item 6). */
      expect
        .soft(values.includes("sticky-bar"), `${route.id}: the phone buy bar (sticky-bar) is ${route.buybar ? "missing" : "on a page that has none"}`)
        .toBe(route.buybar);
      if (route.mockup && mockupRoutes().some((r) => r.id === route.id)) {
        // The values placed after Gate A (D050, D061): the mockup itself (self-test) carries none of them.
        const added = PARITY_TARGET === "mockup" ? [] : afterGateA(route);
        const expected = [...new Set([...mockupValues(route.mockup), ...added])].sort();
        expect(values, `${route.id}: the values on the page differ from its approved mockup plus ${added.join(", ")}`).toEqual(expected);
      } else {
        expect(values.every((v) => REGISTERED.has(v)), `${route.id}: unregistered values ${values.filter((v) => !REGISTERED.has(v))}`).toBe(true);
      }
    });
  });
}
