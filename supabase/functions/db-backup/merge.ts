import { fitCell, toCellText } from "./cells.ts";
import { IN_DATABASE_COLUMN, KEY_COLUMN, LAST_COPIED_COLUMN } from "./config.ts";
import { BackupError } from "./errors.ts";

/** One database row exactly as PostgREST returns it (every column). */
export type DbRow = Record<string, unknown>;

export type MergeInput = {
  /** The tab as it is now: row 0 is the header (empty for a tab that has never been written). */
  existing: readonly (readonly string[])[];
  /** Every row of the table, read in full. */
  dbRows: readonly DbRow[];
  /** The column that orders NEW rows when they are appended (created_at, received_at). */
  appendOrder: string;
  /** The run's moment as written in `last_copied`, e.g. "2026-11-26 02:00:03 IST". */
  nowIst: string;
  /** The run's IST calendar day, for "no, since <date>". */
  today: string;
};

export type MergeResult = {
  /** The whole tab to write: the header, then every row, all the same width. */
  values: string[][];
  dbRows: number;
  /** Data rows in the new tab (the header is not counted). */
  sheetRows: number;
  /** Rows the database no longer has (marked "no, since <date>"). */
  notInDbRows: number;
  /** Rows the tab did not have before. */
  newRows: number;
  /** Cells cut to fit the 50,000-character limit this run, and which columns they were in. */
  truncatedCells: number;
  truncatedColumns: string[];
  /** Sheet rows whose id repeats an earlier row's id (kept, never deleted, treated as not in the database). */
  duplicateSheetIds: number;
};

const NO_PREFIX = "no, since ";
const isMarker = (name: string) => name === IN_DATABASE_COLUMN || name === LAST_COPIED_COLUMN;

const isBlankRow = (row: readonly string[]) => row.every((cell) => cell === "");

/** The data rows of a tab as read: every row after the header that holds something. */
export function dataRowsOf(existing: readonly (readonly string[])[]): (readonly string[])[] {
  return existing.slice(1).filter((row) => !isBlankRow(row));
}

/** The tab's own columns (without the two marker columns), refusing a header that cannot be matched safely. */
function sheetColumnsOf(header: readonly string[], hasData: boolean): string[] {
  const names = header.filter((name) => !isMarker(name));
  if (names.length === 0 && !hasData) return [];
  if (new Set(names).size !== names.length || names.some((name) => name === "")) {
    throw new BackupError("sheet_header_invalid");
  }
  if (hasData && !names.includes(KEY_COLUMN)) throw new BackupError("sheet_header_invalid");
  return names;
}

/** The columns of the database rows in database order: the first row's keys, then any key a later row adds. */
function dbColumnsOf(rows: readonly DbRow[]): string[] {
  const columns: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }
  return columns;
}

const compareText = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The new content of one table tab: the UNION of what the tab holds and what the database holds. Nothing is ever dropped.
 *
 *  - A database row replaces its sheet row (matched by `id`): `in_database` "yes", `last_copied` now.
 *  - A sheet row the database no longer has keeps every value and becomes `in_database` "no, since <date>" (the first date
 *    is kept on later nights); its `last_copied` stays the last time it WAS copied.
 *  - A database row the tab does not have is appended (ordered by `appendOrder`, then id).
 *  - Columns: the database's, in database order; then any column only the sheet still has (a dropped column's history
 *    stays); then `in_database` and `last_copied`.
 * The result is never smaller than the tab it replaces, so writing it back can only add and change, never delete.
 */
export function mergeTab(input: MergeInput): MergeResult {
  const { existing, dbRows, nowIst, today } = input;
  const header = existing[0] ?? [];
  const sheetRows = dataRowsOf(existing);
  const sheetColumns = sheetColumnsOf(header, sheetRows.length > 0);

  const dbColumns = dbColumnsOf(dbRows);
  const columns = [...dbColumns, ...sheetColumns.filter((name) => !dbColumns.includes(name))];
  const sheetIndex = new Map(header.map((name, i) => [name, i] as const));
  const idIndex = sheetIndex.get(KEY_COLUMN);
  const inDbIndex = sheetIndex.get(IN_DATABASE_COLUMN);
  const lastIndex = sheetIndex.get(LAST_COPIED_COLUMN);

  const dbById = new Map<string, DbRow>();
  for (const row of dbRows) {
    const id = toCellText(row[KEY_COLUMN]);
    if (id === "") throw new BackupError("db_row_without_id");
    dbById.set(id, row);
  }

  let truncatedCells = 0;
  const truncatedColumns = new Set<string>();
  const dbCell = (row: DbRow, column: string): string => {
    const fitted = fitCell(toCellText(row[column]));
    if (fitted.truncated) {
      truncatedCells += 1;
      truncatedColumns.add(column);
    }
    return fitted.text;
  };

  const out: string[][] = [];
  const seenIds = new Set<string>();
  let notInDbRows = 0;
  let duplicateSheetIds = 0;

  for (const old of sheetRows) {
    const cellOf = (column: string): string => {
      const at = sheetIndex.get(column);
      return at === undefined ? "" : (old[at] ?? "");
    };
    const id = idIndex === undefined ? "" : (old[idIndex] ?? "");
    const duplicate = id !== "" && seenIds.has(id);
    if (duplicate) duplicateSheetIds += 1;
    if (id !== "") seenIds.add(id);
    const match = !duplicate && id !== "" ? dbById.get(id) : undefined;

    const cells = columns.map((column) => (match && dbColumns.includes(column) ? dbCell(match, column) : cellOf(column)));
    if (match) {
      cells.push("yes", nowIst);
    } else {
      const was = inDbIndex === undefined ? "" : (old[inDbIndex] ?? "");
      cells.push(was.startsWith(NO_PREFIX) ? was : `${NO_PREFIX}${today}`, lastIndex === undefined ? "" : (old[lastIndex] ?? ""));
      notInDbRows += 1;
    }
    out.push(cells);
  }

  const fresh = dbRows
    .filter((row) => !seenIds.has(toCellText(row[KEY_COLUMN])))
    .sort(
      (a, b) =>
        compareText(toCellText(a[input.appendOrder]), toCellText(b[input.appendOrder])) ||
        compareText(toCellText(a[KEY_COLUMN]), toCellText(b[KEY_COLUMN])),
    );
  for (const row of fresh) out.push([...columns.map((column) => (dbColumns.includes(column) ? dbCell(row, column) : "")), "yes", nowIst]);

  return {
    values: [[...columns, IN_DATABASE_COLUMN, LAST_COPIED_COLUMN], ...out],
    dbRows: dbRows.length,
    sheetRows: out.length,
    notInDbRows,
    newRows: fresh.length,
    truncatedCells,
    truncatedColumns: [...truncatedColumns],
    duplicateSheetIds,
  };
}
