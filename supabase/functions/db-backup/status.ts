import { ORDERS_REVISIT_AT, RUN_LOG_LIMIT, TABLES, type TableName } from "./config.ts";

export type RunResult = "ok" | "ok_truncated" | "failed";

/** What one run did to one table. Counts and codes only: never a row, a value or a reason that quotes one. */
export type TableOutcome = {
  status: "ok" | "failed";
  dbRows?: number;
  sheetRows?: number;
  notInDbRows?: number;
  truncatedCells: number;
  truncatedColumns: string[];
  failedReason?: string;
};

export type StatusInput = {
  nowIst: string;
  result: RunResult;
  durationMs: number;
  /** A run-level fault (no token, no tab list): the tables were not attempted. */
  runFailure?: string;
  tables: Record<TableName, TableOutcome>;
  /** The Status tab as it was before this run (or `[]`). */
  previous: readonly (readonly string[])[];
};

const WIDTH = 7;
const TABLE_HEADER = ["Table", "Rows in database", "Rows in sheet", "Not in database now", "Last updated (IST)", "Result", "Notes"];
const LOG_TITLE = `Run log (newest first, last ${RUN_LOG_LIMIT} runs)`;
const LOG_HEADER = ["Run (IST)", "Result", ...TABLES.map((t) => t.name as string), "Duration (s)", "Notes"];

export const resultText = (result: RunResult): string =>
  result === "ok" ? "OK" : result === "ok_truncated" ? "OK (truncated)" : "FAILED";

const pad = (cells: readonly string[]): string[] =>
  [...cells, ...Array<string>(Math.max(0, WIDTH - cells.length)).fill("")].slice(0, WIDTH);

/** 1000 -> "1,000" (no locale: the same text on every machine). */
export const withThousands = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** The earlier run's per-table row, kept when this run could not copy that table. */
function previousTableRow(previous: readonly (readonly string[])[], table: string): string[] | undefined {
  const logAt = previous.findIndex((row) => row[0] === LOG_HEADER[0]);
  const rows = logAt < 0 ? previous : previous.slice(0, logAt);
  const row = rows.find((r) => r[0] === table);
  return row ? pad(row) : undefined;
}

/** The earlier run log rows, newest first, as they were written. */
function previousLog(previous: readonly (readonly string[])[]): string[][] {
  const at = previous.findIndex((row) => row[0] === LOG_HEADER[0]);
  if (at < 0) return [];
  const rows: string[][] = [];
  for (const row of previous.slice(at + 1)) {
    if (!row[0]) break;
    rows.push(pad(row));
  }
  return rows;
}

const tableNote = (o: TableOutcome): string => {
  if (o.status === "failed") return `nothing written to this tab; reason: ${o.failedReason ?? "unexpected_error"}`;
  if (o.truncatedCells > 0) {
    return `${o.truncatedCells} cell(s) cut to the 50,000-character limit in: ${o.truncatedColumns.join(", ")}`;
  }
  return "";
};

/**
 * The whole Status tab. It holds NO personal data: table names, row counts, times, result words, reason codes and column
 * names only. A table that failed this run keeps its earlier counts and its earlier "last updated" time, so the sheet
 * never claims a copy that did not happen.
 */
export function buildStatus(input: StatusInput): string[][] {
  const { nowIst, result, tables } = input;

  const tableRows = TABLES.map(({ name }) => {
    const o = tables[name];
    if (o.status === "ok") {
      return pad([
        name,
        String(o.dbRows ?? ""),
        String(o.sheetRows ?? ""),
        String(o.notInDbRows ?? ""),
        nowIst,
        o.truncatedCells > 0 ? "OK (truncated)" : "OK",
        tableNote(o),
      ]);
    }
    const before = previousTableRow(input.previous, name);
    return pad([
      name,
      before?.[1] ?? "",
      before?.[2] ?? "",
      before?.[3] ?? "",
      before?.[4] || "never",
      `FAILED: ${o.failedReason ?? "unexpected_error"}`,
      tableNote(o),
    ]);
  });

  const orders = tableRows[0];
  const ordersCount = Number(orders[1]);
  const revisit = withThousands(ORDERS_REVISIT_AT);
  const ordersLine =
    orders[1] === "" || Number.isNaN(ordersCount)
      ? `Orders: unknown of ${revisit} (revisit point)`
      : `Orders: ${withThousands(ordersCount)} of ${revisit} (revisit point)${ordersCount >= ORDERS_REVISIT_AT ? ": REACHED, revisit the plan" : ""}`;

  const cell = (name: TableName): string => {
    const o = tables[name];
    if (o.status === "failed") return `FAILED ${o.failedReason ?? "unexpected_error"}`;
    return `OK ${o.dbRows ?? 0} rows${o.truncatedCells > 0 ? " (truncated)" : ""}`;
  };
  const failures = TABLES.filter((t) => tables[t.name].status === "failed").map((t) => `${t.name}: ${tables[t.name].failedReason}`);
  const notes = [...(input.runFailure ? [`run: ${input.runFailure}`] : []), ...failures].join("; ");
  const logRow = pad([
    nowIst,
    resultText(result),
    ...TABLES.map((t) => cell(t.name)),
    (input.durationMs / 1000).toFixed(1),
    notes,
  ]);
  const log = [logRow, ...previousLog(input.previous)].slice(0, RUN_LOG_LIMIT);

  return [
    pad(["Kheelona store database backup: status"]),
    pad(["Last run (IST)", nowIst]),
    pad(["Last run result", resultText(result), input.runFailure ? `run: ${input.runFailure}` : ""]),
    pad([]),
    pad(TABLE_HEADER),
    ...tableRows,
    pad([]),
    pad([ordersLine]),
    pad([]),
    pad([LOG_TITLE]),
    pad(LOG_HEADER),
    ...log,
  ];
}
