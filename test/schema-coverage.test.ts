import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Every column the code reads must exist in a migration file.
 *
 * WHY THIS EXISTS. `preorders.fb_attrib` was created by hand in the Supabase SQL
 * editor on 2026-09-02 and lived in production for a day with no migration
 * recording it. Nothing failed, because production already had the column and
 * the tests use a fake client that ignores the schema entirely. The failure was
 * latent and total: rebuilding from this repo (disaster recovery, a staging
 * clone, a new project) would have produced a database where every pre-order
 * returns 500, because create-order inserts into a column that is not there.
 *
 * A hand-run migration is sometimes the right call in the moment. Not writing
 * the file afterwards is never one, and this is the thing that notices.
 */

const ROOT = process.cwd();
const DIR = join(ROOT, "supabase/migrations");

const sql = readdirSync(DIR)
  .filter((f) => f.endsWith(".sql"))
  .map((f) => readFileSync(join(DIR, f), "utf8"))
  .join("\n");

/** The columns PreorderRow declares, read from the type rather than retyped, so
 *  this cannot drift from what the code believes the row contains. */
function declaredColumns(): string[] {
  const db = readFileSync(join(ROOT, "src/lib/store/db.ts"), "utf8");
  const block = db.slice(db.indexOf("export type PreorderRow"), db.indexOf("export type PreorderAddress"));
  return [...block.matchAll(/^\s{2}([a-z_]+)\??:/gm)].map((m) => m[1]);
}

describe("the schema in this repo can rebuild the database", () => {
  it("has a migration for every column PreorderRow declares", () => {
    const missing = declaredColumns().filter((c) => !sql.includes(c));
    expect(missing, `columns with no migration: ${missing.join(", ")}`).toEqual([]);
  });

  it("found the columns at all, so an empty list cannot pass by accident", () => {
    const columns = declaredColumns();
    expect(columns.length).toBeGreaterThan(10);
    expect(columns).toContain("fb_attrib");
    expect(columns).toContain("order_ref");
  });

  /* The runbook is half the mechanism: a complete set of migrations that nobody
     is told to run is the same outage. */
  it("tells the operator to run every migration, not just the first", () => {
    const readme = readFileSync(join(ROOT, "supabase/README.md"), "utf8");
    expect(readme).toMatch(/every file in `migrations\/` in filename order/);
  });
});
