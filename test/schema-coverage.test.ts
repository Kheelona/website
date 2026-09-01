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

/** The migrations as SQL, with comments stripped.
 *
 *  BOTH HALVES MATTER, and the first version of this test had neither. It
 *  searched the raw concatenated text for the column name as a plain substring,
 *  so `dispatch` was "found" by the words "dispatch queue" inside a comment, and
 *  `payment_id` was "found" inside `rzp_payment_id`. A guard that answers yes to
 *  a column nobody declared is not a guard: the outage it exists to prevent
 *  (a hand-added column, a rebuild, every pre-order 500ing) would sail past it
 *  under any of those names. */
const sql = readdirSync(DIR)
  .filter((f) => f.endsWith(".sql"))
  .map((f) => readFileSync(join(DIR, f), "utf8"))
  .join("\n")
  .replace(/--[^\n]*/g, " ");

/** Word-boundary match, so `payment_id` does not match inside `rzp_payment_id`.
 *  Underscore is a word character, which is exactly what makes `\b` correct
 *  here: there is no boundary between `rzp_` and `payment_id`. */
function declaredInSql(column: string): boolean {
  return new RegExp(`\\b${column}\\b`).test(sql);
}

/** The columns PreorderRow declares, read from the type rather than retyped, so
 *  this cannot drift from what the code believes the row contains. */
function declaredColumns(): string[] {
  const db = readFileSync(join(ROOT, "src/lib/store/db.ts"), "utf8");
  const block = db.slice(db.indexOf("export type PreorderRow"), db.indexOf("export type PreorderAddress"));
  return [...block.matchAll(/^\s{2}([a-z_]+)\??:/gm)].map((m) => m[1]);
}

describe("the schema in this repo can rebuild the database", () => {
  it("has a migration for every column PreorderRow declares", () => {
    const missing = declaredColumns().filter((c) => !declaredInSql(c));
    expect(missing, `columns with no migration: ${missing.join(", ")}`).toEqual([]);
  });

  it("found the columns at all, so an empty list cannot pass by accident", () => {
    const columns = declaredColumns();
    expect(columns.length).toBeGreaterThan(10);
    expect(columns).toContain("fb_attrib");
    expect(columns).toContain("order_ref");
  });

  /* The two false-positive shapes the first version of this test let through,
     pinned so the matching cannot quietly regress to a substring search. */
  it("does not accept a column name that only appears inside a comment", () => {
    expect(declaredInSql("dispatch"), "matched the words 'dispatch queue' in a comment").toBe(false);
  });

  it("does not accept a column name that is a substring of another column", () => {
    expect(declaredInSql("payment_id"), "matched inside rzp_payment_id").toBe(false);
    expect(declaredInSql("rzp_payment_id")).toBe(true);
  });

  /* The runbook is half the mechanism: a complete set of migrations that nobody
     is told to run is the same outage. */
  it("tells the operator to run every migration, not just the first", () => {
    const readme = readFileSync(join(ROOT, "supabase/README.md"), "utf8");
    expect(readme).toMatch(/every file in `migrations\/` in filename order/);
  });
});
