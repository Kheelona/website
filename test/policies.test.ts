import { existsSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { GSTIN } from "@/config/site";
import { REDIRECTS } from "@/config/redirects";
import { navigation } from "@/content/en-IN/navigation";
import { routes, type RouteEntry } from "@/content/en-IN/routes";
import type { LegalDoc } from "@/content/types";
import { absoluteUrl } from "@/lib/seo/urls";
import { ROOT, isTestOrStory, listFiles, readRepoFile } from "./e2e/support/repo";
import { isStillLegacy } from "./guards/legacy-paths";

/**
 * The policy layer a merchant has to publish (task 4.4; D029, D032, D042), data-driven over the URL plan's legal
 * routes (src/content/en-IN/routes.ts, kind "legal") and their content modules, so tasks 5.11-5.14 never edit it.
 *
 * Until 2026-08-22 /refund and /shipping were 301s to /terms, because pre-orders took no payment. A merchant that
 * redirects its refund policy away is the shape a payment gateway's review rejects. So, for every policy page:
 *   - a page serves it, no redirect rule takes it away, the sitemap lists it, and the footer of every marketing
 *     page and the store's policy links reach it;
 *   - its content module renders the shared seller block (rendered from seller.ts, never retyped) and never
 *     types the GSTIN; while the route is still served by its legacy page and the module is not written yet, the
 *     route prints "pending" (legacy-paths.ts); any other missing module fails;
 *   - and no shipped file types the GSTIN at all but src/config/site.ts, where the checkout reads it.
 */

const LEGAL = routes.filter((r) => r.kind === "legal");
const pageFile = (r: RouteEntry) => `src/app/(site)${r.path}/page.tsx`;
const moduleFile = (r: RouteEntry) => `src/content/en-IN/${r.module}.ts`;

/** A legal route's document: the export of its content module that carries `meta` and `parts`. */
const docs = new Map<string, LegalDoc | null>();
beforeAll(async () => {
  for (const r of LEGAL) {
    if (!existsSync(join(ROOT, moduleFile(r)))) {
      docs.set(r.path, null);
      continue;
    }
    const mod = (await import(/* @vite-ignore */ join(ROOT, moduleFile(r)))) as Record<string, unknown>;
    const doc = Object.values(mod).find((v) => typeof v === "object" && v !== null && "meta" in v && "parts" in v);
    docs.set(r.path, (doc as LegalDoc | undefined) ?? null);
  }
});

describe("the policy pages a merchant has to publish", () => {
  it("are the plan's legal routes, refund and shipping among them", () => {
    expect(LEGAL.length).toBeGreaterThanOrEqual(4);
    expect(LEGAL.map((r) => r.path)).toEqual(expect.arrayContaining(["/privacy", "/terms", "/refund", "/shipping"]));
  });

  it.each(LEGAL.map((r) => [r.path, r] as const))("%s is a real page", (_path, r) => {
    expect(existsSync(join(ROOT, pageFile(r))), pageFile(r)).toBe(true);
  });

  /* The failure this catches: a cleanup pass sees two legacy-looking rules and "restores" them. */
  it.each(LEGAL.map((r) => r.path))("%s is NOT redirected away", (path) => {
    expect(REDIRECTS.filter((rule) => rule.source === path)).toEqual([]);
  });

  it.each(LEGAL.map((r) => r.path))("%s is in the sitemap", (path) => {
    expect(sitemap().map((entry) => entry.url)).toContain(absoluteUrl(path));
  });

  it.each(LEGAL.map((r) => r.path))("%s is linked from the footer of every page and from the store's policy links", (path) => {
    expect(navigation.footer.columns.flatMap((c) => c.links.map((l) => l.href))).toContain(path);
    expect(navigation.policies.map((l) => l.href)).toContain(path);
  });
});

describe("the legal content modules", () => {
  it.each(LEGAL.map((r) => [r.path, r] as const))("%s renders the shared seller block and never types the GSTIN", (_path, r) => {
    const doc = docs.get(r.path);
    if (!doc) {
      // No module yet: only a route still served by its legacy page may wait (legacy-paths.ts, LEGACY_PATHS).
      expect(isStillLegacy(pageFile(r)), `${r.path}: ${moduleFile(r)} is missing and ${pageFile(r)} is no longer the legacy page`).toBe(true);
      console.log(`[policies] pending ${r.path}: served by the legacy page ${pageFile(r)} until ${moduleFile(r)} is written`);
      return;
    }
    const blocks = doc.parts.flatMap((part) => part.blocks);
    expect(blocks.filter((b) => b.kind === "seller"), `${r.path} does not render the shared seller block`).not.toEqual([]);
    expect(readRepoFile(moduleFile(r)), `${moduleFile(r)} types the GSTIN; the seller block renders it`).not.toContain(GSTIN);
  });
});

describe("the GSTIN", () => {
  it("is typed once, in src/config/site.ts, and every other shipped file reads it from there (seller.ts)", () => {
    const shipped = listFiles(["src"]).filter(
      (p) => /\.(?:tsx?|mjs|js|json|md|css)$/.test(p) && !isTestOrStory(p) && !/(?:__fixtures__|__snapshots__)\/|\.test-support\.ts$/.test(p),
    );
    expect(shipped.length).toBeGreaterThan(100);
    const typed = shipped.filter((p) => readRepoFile(p).includes(GSTIN));
    expect(typed).toEqual(["src/config/site.ts"]);
  });
});
