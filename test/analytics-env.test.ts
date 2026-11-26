import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildLoadsAdTags, buildLoadsPostHog } from "@/config/analytics-env";
import type { SiteEnv } from "@/config/env";

/* Which BUILDS write the measurement tags (K-187, 2026-11-26): the server decides from the build's SITE_ENV, so a development
 * or preview build contains no tag, beacon or PostHog rewrite whatever hostname it is opened under. The consumers' own
 * tests: src/app/layout-analytics-env.test.tsx (root layout), test/site-pages.test.ts (marketing pages),
 * src/layouts/StoreShell/StoreShell.test.tsx (early beacon), test/posthog-proxy.test.ts (rewrites). */

const ENVS: readonly SiteEnv[] = ["production", "beta", "preview", "development"];

describe("analytics-env: the two answers", () => {
  it("ad tags (Ahrefs, GA4, Meta, OpenAI): production only", () => {
    expect(ENVS.filter(buildLoadsAdTags)).toEqual(["production"]);
  });

  it("PostHog and what only exists for it (shell, early beacon, /ingest rewrites): production and beta only", () => {
    expect(ENVS.filter(buildLoadsPostHog)).toEqual(["production", "beta"]);
  });
});

/* The answer is for the server. A client bundle that imported it would change the shared client chunks, and the
 * production output has to stay byte-identical; so only server modules, tests and the config import it. */
describe("analytics-env: server code only", () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(name)) files.push(full);
    }
  };
  walk(join(process.cwd(), "src"));

  it("is imported by no module that starts with the \"use client\" directive", () => {
    const importers = files.filter((f) => /analytics-env/.test(readFileSync(f, "utf8")) && !f.endsWith("analytics-env.ts"));
    expect(importers.length).toBeGreaterThan(0);
    for (const file of importers) {
      expect(readFileSync(file, "utf8").trimStart(), file).not.toMatch(/^(["'])use client\1/);
    }
  });
});
