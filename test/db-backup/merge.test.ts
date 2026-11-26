import { describe, expect, it } from "vitest";
import { MAX_CELL_CHARS } from "../../supabase/functions/db-backup/config";
import { mergeTab, type DbRow } from "../../supabase/functions/db-backup/merge";
import { BackupError } from "../../supabase/functions/db-backup/errors";

const NOW = "2026-11-26 02:00:00 IST";
const TODAY = "2026-11-26";
const HEADER = ["id", "label", "created_at", "in_database", "last_copied"];

const run = (existing: string[][], dbRows: DbRow[], over: Partial<Parameters<typeof mergeTab>[0]> = {}) =>
  mergeTab({ existing, dbRows, appendOrder: "created_at", nowIst: NOW, today: TODAY, ...over });
const row = (id: string, label: string, created = "2026-11-01"): DbRow => ({ id, label, created_at: created });

describe("mergeTab: a tab that has never been written", () => {
  it("writes the database's columns (database order), every row, then in_database and last_copied", () => {
    const merged = run([], [row("a", "A"), row("b", "B")]);
    expect(merged.values).toEqual([
      ["id", "label", "created_at", "in_database", "last_copied"],
      ["a", "A", "2026-11-01", "yes", NOW],
      ["b", "B", "2026-11-01", "yes", NOW],
    ]);
    expect(merged).toMatchObject({ dbRows: 2, sheetRows: 2, notInDbRows: 0, newRows: 2, truncatedCells: 0 });
  });
});

describe("mergeTab: the union, never a deletion", () => {
  const before = [
    HEADER,
    ["a", "old A", "2026-11-01", "yes", "2026-11-25 02:00:00 IST"],
    ["b", "B", "2026-11-02", "yes", "2026-11-25 02:00:00 IST"],
  ];

  it("a changed value is overwritten by the database's, and last_copied moves to now", () => {
    const merged = run(before, [row("a", "new A", "2026-11-01"), row("b", "B", "2026-11-02")]);
    expect(merged.values[1]).toEqual(["a", "new A", "2026-11-01", "yes", NOW]);
    expect(merged.values[2]).toEqual(["b", "B", "2026-11-02", "yes", NOW]);
  });

  it("a row the database no longer has stays with every value, marked 'no, since <date>', and keeps its last_copied", () => {
    const merged = run(before, [row("a", "A")]);
    expect(merged.values).toHaveLength(3);
    expect(merged.values[2]).toEqual(["b", "B", "2026-11-02", `no, since ${TODAY}`, "2026-11-25 02:00:00 IST"]);
    expect(merged.notInDbRows).toBe(1);
    expect(merged.sheetRows).toBe(2);
  });

  it("the first 'no, since' date is kept on later nights", () => {
    const night1 = run(before, [row("a", "A")]);
    const night2 = mergeTab({ existing: night1.values, dbRows: [row("a", "A")], appendOrder: "created_at", nowIst: "2026-11-27 02:00:00 IST", today: "2026-11-27" });
    expect(night2.values[2][3]).toBe("no, since 2026-11-26");
    expect(night2.values[2][4]).toBe("2026-11-25 02:00:00 IST");
  });

  it("a row that comes back is 'yes' again with the database's values", () => {
    const gone = run(before, [row("a", "A")]);
    const back = run(gone.values, [row("a", "A"), row("b", "B returned", "2026-11-02")]);
    expect(back.values[2]).toEqual(["b", "B returned", "2026-11-02", "yes", NOW]);
    expect(back.notInDbRows).toBe(0);
  });

  it("new database rows are appended after the existing ones, oldest first (created_at, then id)", () => {
    const merged = run(before, [row("a", "A"), row("b", "B"), row("d", "D", "2026-11-05"), row("c", "C", "2026-11-05"), row("e", "E", "2026-11-04")]);
    expect(merged.values.map((r) => r[0])).toEqual(["id", "a", "b", "e", "c", "d"]);
    expect(merged.newRows).toBe(3);
  });

  it("existing row order is kept, even when the database orders them differently", () => {
    const merged = run(before, [row("b", "B", "2026-11-02"), row("a", "A", "2026-11-01")]);
    expect(merged.values.map((r) => r[0])).toEqual(["id", "a", "b"]);
  });

  it("the result is never shorter than the tab it replaces, whatever the database returns", () => {
    for (const db of [[], [row("zzz", "only one")], [row("a", "A"), row("b", "B"), row("c", "C")]]) {
      const merged = run(before, db);
      expect(merged.values.length).toBeGreaterThanOrEqual(before.length);
      const ids = new Set(merged.values.map((r) => r[0]));
      expect(ids.has("a") && ids.has("b")).toBe(true);
    }
  });
});

describe("mergeTab: columns", () => {
  it("a column the database no longer has stays (its history is kept); a new database column is added", () => {
    const existing = [["id", "label", "legacy", "in_database", "last_copied"], ["a", "A", "old-note", "yes", "t"]];
    const merged = run(existing, [{ id: "a", label: "A2", extra: "new" }]);
    expect(merged.values[0]).toEqual(["id", "label", "extra", "legacy", "in_database", "last_copied"]);
    expect(merged.values[1]).toEqual(["a", "A2", "new", "old-note", "yes", NOW]);
  });

  it("rows are padded to the full width, and a new row gets '' for a sheet-only column", () => {
    const existing = [["id", "legacy", "in_database", "last_copied"], ["a", "kept", "yes", "t"]];
    const merged = run(existing, [{ id: "a" }, { id: "b" }]);
    expect(merged.values[2]).toEqual(["b", "", "yes", NOW]);
    expect(new Set(merged.values.map((r) => r.length)).size).toBe(1);
  });

  it("refuses a header it cannot match safely (duplicate or blank names, or no id) rather than guess", () => {
    expect(() => run([["id", "id", "in_database", "last_copied"], ["a", "b", "yes", "t"]], [row("a", "A")])).toThrow(BackupError);
    expect(() => run([["id", "", "in_database", "last_copied"], ["a", "b", "yes", "t"]], [row("a", "A")])).toThrow(BackupError);
    expect(() => run([["label", "in_database", "last_copied"], ["A", "yes", "t"]], [row("a", "A")])).toThrow(/sheet_header_invalid/);
  });
});

describe("mergeTab: odd sheet rows are kept, never dropped", () => {
  it("a repeated id is kept as a separate row, treated as not in the database, and counted", () => {
    const existing = [HEADER, ["a", "A", "c", "yes", "t"], ["a", "A copy", "c", "yes", "t"]];
    const merged = run(existing, [row("a", "A")]);
    expect(merged.values).toHaveLength(3);
    expect(merged.values[1][3]).toBe("yes");
    expect(merged.values[2][3]).toBe(`no, since ${TODAY}`);
    expect(merged.duplicateSheetIds).toBe(1);
  });

  it("a row with no id is kept as it is, as not in the database; a fully blank row is not a row", () => {
    const existing = [HEADER, ["", "typed by hand", "", "", ""], ["", "", "", "", ""], ["a", "A", "c", "yes", "t"]];
    const merged = run(existing, [row("a", "A")]);
    expect(merged.values).toHaveLength(3);
    expect(merged.values[1].slice(0, 2)).toEqual(["", "typed by hand"]);
    expect(merged.values[1][3]).toBe(`no, since ${TODAY}`);
  });

  it("a database row with no id stops the table (the sheet could not match it)", () => {
    expect(() => run([], [{ label: "no id" }])).toThrow(/db_row_without_id/);
  });
});

describe("mergeTab: the 50,000-character limit", () => {
  const long = (n: number) => "p".repeat(MAX_CELL_CHARS + n);
  it("cuts a cell that is too long, marks it, and reports how many and where", () => {
    const merged = run([], [{ id: "evt", payload: long(10) }, { id: "evt2", payload: "short" }]);
    const cell = merged.values[1][1];
    expect(cell.length).toBeLessThanOrEqual(MAX_CELL_CHARS);
    expect(cell).toContain("[TRUNCATED:");
    expect(merged.values[2][1]).toBe("short");
    expect(merged.truncatedCells).toBe(1);
    expect(merged.truncatedColumns).toEqual(["payload"]);
  });
  it("counts every cell cut, in every row, each run", () => {
    const merged = run([], [{ id: "1", a: long(1), b: long(2) }, { id: "2", a: long(3) }]);
    expect(merged.truncatedCells).toBe(3);
    expect([...merged.truncatedColumns].sort()).toEqual(["a", "b"]);
  });
});
