import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { setupPage } from "@/content/en-IN/pages/setup";
import type { Offer } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { jsonLdMismatches } from "../../../../test/e2e/support/page-checks";

/* The /setup route (task 5.8; structure §3.1, §5): the page module through PageTemplate with the live offer, thin. The
 * module's own test (src/content/en-IN/pages/setup.test.tsx) compares the rendered page with the approved mockup fold by
 * fold; this file proves the route serves exactly that page, with the copy page's head. */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

/* The first import of the route compiles the page template and every section under it: load it once, under its own
 * time limit, so a busy machine cannot time out whichever test happens to import it first. */
beforeAll(async () => {
  await import("./page");
}, 60_000);

const SOURCE = readFileSync("src/app/(site)/setup/page.tsx", "utf8");
const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

async function renderRoute(offer: Offer) {
  getOffer.mockResolvedValue(offer);
  const { default: SetupPage } = await import("./page");
  return renderToStaticMarkup((await SetupPage()) as ReactElement);
}

describe("/setup: the route file", () => {
  it("takes its metadata from the page module through pageMeta, at its own path", async () => {
    const mod = await import("./page");
    expect(mod.metadata).toEqual(pageMeta({ ...setupPage.meta, path: "/setup" }));
  });

  it("gives the head its canonical, a complete Open Graph card and a large Twitter card, worded as the copy page (SPA 5)", async () => {
    const { metadata } = await import("./page");
    const title = "How to set up Kheelu on day one · Kheelona";
    const description =
      "How to set up Kheelu: charge it, connect it to your home Wi-Fi with the parent app, set your child’s age, and show your child the wake-up button.";
    expect(metadata.title).toEqual({ absolute: title });
    expect(metadata.description).toBe(description);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    expect(metadata.alternates).toEqual({ canonical: "/setup" });
    expect(metadata.openGraph).toMatchObject({ type: "website", url: "/setup", title, description, siteName: "Kheelona", locale: "en_IN" });
    expect(metadata.openGraph?.images).toEqual([expect.objectContaining({ url: expect.any(String), width: 1200, height: 630, alt: expect.any(String) })]);
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", title, description });
    expect("robots" in metadata).toBe(false);
  });

  /* The page shows no price and no buy bar, so it sets no revalidate of its own: the (site) layout's 300 s (the drawer
   * shows the price sentence on every marketing page) is the route's, the lowest across its segments. */
  it("sets no revalidate of its own: nothing on the page changes with the offer", async () => {
    expect("revalidate" in (await import("./page"))).toBe(false);
    expect(code).not.toMatch(/\brevalidate\b/);
  });

  it("is thin: no copy, price or outside address typed in it, only its own path (structure §3.1)", () => {
    const body = code.replace(/^import [^;]*;$/gm, "");
    expect([...body.matchAll(/"([^"]*)"/g)].map((m) => m[1])).toEqual(["/setup"]);
    expect(body).not.toMatch(/₹|https?:|`/);
    expect(body).not.toMatch(/\bnotFound\b/);
  });

  it("imports nothing of the legacy site (structure §1; task 6.3 deletes it)", () => {
    expect(SOURCE).not.toMatch(/@\/components\/(?:atoms|molecules|organisms|templates)\/|@\/lib\/(?:setup-steps|seo)"/);
  });
});

describe("/setup: what it serves", () => {
  it.each(["token", "full"] as const)("is the setup module through PageTemplate, at /setup, with the live offer (%s mode)", async (mode) => {
    const offer = buildOffer(mode);
    expect(await renderRoute(offer)).toBe(renderToStaticMarkup(<PageTemplate page={setupPage} offer={offer} path="/setup" />));
  });

  it("opens with the page's one h1 and carries its HowTo, which says only what the page shows", async () => {
    const html = `<!doctype html><html><body><main id="main">${await renderRoute(buildOffer("token"))}</main></body></html>`;
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect([...doc.querySelectorAll("h1")].map((h) => h.textContent)).toEqual(["How to set up Kheelu on day one."]);
    expect(html).toContain('"@type":"HowTo"');
    expect(jsonLdMismatches(html)).toEqual([]);
  });
});
