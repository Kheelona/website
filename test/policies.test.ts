import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SELLER_SECTION } from "@/lib/legal";
import {
  FOOTER_LINKS,
  LEGAL_ENTITY,
  GSTIN,
  SUPPORT_WHATSAPP_DISPLAY,
  REGISTERED_ADDRESS,
} from "@/config/site";

/**
 * The policy layer a merchant needs, guarded (§8.25-d).
 *
 * Until 2026-08-22 `/refund` and `/shipping` were 301s to `/terms`, with a
 * comment in next.config.ts explaining that there was nothing to refund or ship
 * because pre-orders took no payment. The moment the store began taking money
 * that stopped being true, and a merchant that redirects its refund policy to
 * its terms is the shape a payment gateway's review rejects.
 *
 * So this guards three separate ways the layer can rot: the pages can be
 * deleted, the redirects can be restored by someone tidying the config, and the
 * seller of record can quietly drift out of the shared section every policy
 * page renders.
 */

const ROOT = process.cwd();
const CONFIG = readFileSync(join(ROOT, "next.config.ts"), "utf8");
const redirectSources = [...CONFIG.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]);

const POLICY_ROUTES = ["/refund", "/shipping", "/terms", "/privacy"] as const;

describe("the policy layer a merchant has to publish", () => {
  it.each(POLICY_ROUTES)("%s is a real page", (route) => {
    expect(existsSync(join(ROOT, "src/app", route, "page.tsx"))).toBe(true);
  });

  /* The failure this catches: a future cleanup pass sees two legacy-looking
     entries and "restores" them, silently un-publishing the refund policy. */
  it.each(["/refund", "/shipping"])("%s is NOT redirected away", (route) => {
    expect(redirectSources).not.toContain(route);
  });

  it("reaches both new pages from the footer of every page", () => {
    const hrefs = FOOTER_LINKS.map((l) => l.href);
    expect(hrefs).toContain("/refund");
    expect(hrefs).toContain("/shipping");
  });

  it("lists both new pages in the sitemap", () => {
    const sitemap = readFileSync(join(ROOT, "src/app/sitemap.ts"), "utf8");
    expect(sitemap).toContain('"/refund"');
    expect(sitemap).toContain('"/shipping"');
  });

  it("names the seller of record, in full, in the shared section", () => {
    const text = SELLER_SECTION.ps.join(" ");
    expect(text).toContain(LEGAL_ENTITY);
    expect(text).toContain(GSTIN);
    expect(text).toContain(SUPPORT_WHATSAPP_DISPLAY);
    expect(text).toContain(REGISTERED_ADDRESS.pincode);
    /* A support number that does not take calls must never be printed as if it
       does. Every surface says WhatsApp, including the schema contactOption. */
    expect(text).toMatch(/WhatsApp/);
  });

  it("renders that one section on every policy page, rather than four copies", () => {
    for (const route of POLICY_ROUTES) {
      const src = readFileSync(join(ROOT, "src/app", route, "page.tsx"), "utf8");
      expect(src, `${route} does not render SELLER_SECTION`).toContain("SELLER_SECTION");
      // and never hardcodes what the section already says
      expect(src, `${route} hardcodes the GSTIN`).not.toContain(GSTIN);
    }
  });
});
