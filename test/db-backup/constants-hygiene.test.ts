import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { POSTHOG_API_HOST, POSTHOG_KEY, TABLES, TEST_SUPABASE_PROJECT_REFS } from "../../supabase/functions/db-backup/config";
import { POSTHOG_API_HOST as SITE_HOST, POSTHOG_KEY as SITE_KEY } from "@/config/site";
import { TEST_SUPABASE_PROJECT_REFS as SITE_TEST_REFS } from "@/config/test-store";

const ROOT = process.cwd();
const DIR = join(ROOT, "supabase/functions/db-backup");
const files = readdirSync(DIR).filter((f) => f.endsWith(".ts"));
const read = (f: string) => readFileSync(join(DIR, f), "utf8");

describe("constants copied into the function folder cannot drift", () => {
  it("the PostHog key and host are the store's (src/config/site.ts)", () => {
    expect(POSTHOG_KEY).toBe(SITE_KEY);
    expect(POSTHOG_API_HOST).toBe(SITE_HOST);
  });
  it("the test project ids are the test store's (src/config/test-store.ts)", () => {
    expect([...TEST_SUPABASE_PROJECT_REFS]).toEqual([...SITE_TEST_REFS]);
  });
  it("the tables copied are exactly the tables the migrations create (a new table needs a decision to join the copy)", () => {
    const migrations = readdirSync(join(ROOT, "supabase/migrations")).filter((f) => f.endsWith(".sql"));
    const created = new Set<string>();
    for (const m of migrations) {
      for (const hit of readFileSync(join(ROOT, "supabase/migrations", m), "utf8").matchAll(/create table(?: if not exists)? public\.(\w+)/gi)) created.add(hit[1]);
    }
    expect([...created].sort()).toEqual(TABLES.map((t) => t.name as string).sort());
  });
});

describe("the function folder holds no secret, no third-party import and no write path to the database", () => {
  it("has the files the README names", () => {
    expect(readdirSync(DIR)).toEqual(expect.arrayContaining(["index.ts", "backup.ts", "README.md", "setup-cron.sql"]));
  });
  it("holds no key, token or JWT text anywhere (only names of secrets)", () => {
    for (const f of readdirSync(DIR)) {
      const text = read(f);
      expect(text, `${f}: PEM`).not.toMatch(/-----BEGIN [A-Z ]*PRIVATE KEY-----\s*[A-Za-z0-9+/=]{20,}/);
      expect(text, `${f}: sb_secret key`).not.toMatch(/sb_secret_[A-Za-z0-9_-]{10,}/);
      expect(text, `${f}: JWT`).not.toMatch(/eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\./);
      expect(text, `${f}: service-account email`).not.toMatch(/[a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com/);
      expect(text, `${f}: a sheet id`).not.toMatch(/spreadsheets\/d\/[A-Za-z0-9_-]{20,}/);
    }
  });
  it("imports only its own files (no npm, jsr, https or node: import): web-standard code that runs in Deno and Node alike", () => {
    for (const f of files) {
      for (const hit of read(f).matchAll(/^\s*(?:import|export)\s[^;]*?from\s+["']([^"']+)["']/gm)) {
        expect(hit[1], `${f} imports ${hit[1]}`).toMatch(/^\.\/[a-z-]+\.ts$/);
      }
      expect(read(f), `${f}: dynamic import`).not.toMatch(/\bimport\(/);
    }
  });
  it("only db.ts talks to the REST API, and only with GET", () => {
    for (const f of files) {
      if (f === "db.ts") continue;
      expect(read(f), `${f} reaches the REST API`).not.toContain("/rest/v1");
      expect(read(f), `${f} builds a request to the project`).not.toMatch(/supabaseUrl\s*[}+]|config\.url/);
    }
    const db = read("db.ts");
    expect(db).toContain('method: "GET"');
    expect(db).not.toMatch(/method:\s*["'](POST|PUT|PATCH|DELETE)/i);
    expect(db).not.toMatch(/\.(insert|update|upsert|delete|rpc)\(/);
    expect(db).not.toMatch(/Prefer:|prefer:/);
  });
  it("only index.ts knows about Deno", () => {
    for (const f of files) if (f !== "index.ts") expect(read(f), f).not.toMatch(/\bDeno\b|\bEdgeRuntime\b/);
  });
});
