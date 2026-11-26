import { TABLES, TAB_ORDER, STATUS_TAB, type TableName } from "./config.ts";
import { readTable } from "./db.ts";
import type { BackupConfig } from "./env.ts";
import { BackupError, codeOf } from "./errors.ts";
import { fetchAccessToken, parseServiceAccount } from "./google.ts";
import { realSleep, resilientFetch, type FetchLike, type Sleep } from "./http.ts";
import { formatIst, istDate } from "./ist.ts";
import { dataRowsOf, mergeTab } from "./merge.ts";
import { sendBackupEvent } from "./posthog.ts";
import { SheetsClient } from "./sheets.ts";
import { buildStatus, type RunResult, type TableOutcome } from "./status.ts";

export type BackupDeps = {
  /** The real `fetch` in the function; a recording fake in the tests. Every outgoing request goes through it. */
  fetch: FetchLike;
  now: () => Date;
  sleep?: Sleep;
  subtle: SubtleCrypto;
  uuid: () => string;
  config: BackupConfig;
};

export type BackupResult = {
  result: RunResult;
  startedAtIst: string;
  durationMs: number;
  /** Set when a step before the tables (config, Google token, tab list, Status) failed. */
  failedReason?: string;
  tables: Record<TableName, TableOutcome>;
  event: "sent" | "failed";
};

const untouched = (): TableOutcome => ({ status: "failed", truncatedCells: 0, truncatedColumns: [], failedReason: "not_attempted" });

/** What a run is called: FAILED if anything failed, "truncated" if a cell had to be cut, else OK. */
function overall(tables: Record<TableName, TableOutcome>, runFailure: string | undefined): RunResult {
  const outcomes = TABLES.map((t) => tables[t.name]);
  if (runFailure || outcomes.some((o) => o.status === "failed")) return "failed";
  return outcomes.some((o) => o.truncatedCells > 0) ? "ok_truncated" : "ok";
}

/**
 * One nightly copy of the three store tables into the Google Sheet, and one PostHog event about it.
 *
 *  - READ-ONLY on the database (see db.ts): the function can only GET rows.
 *  - NEVER deletes from the sheet (see merge.ts): a row the database lost stays, marked "no, since <date>".
 *  - SAFETY RULE, per table: if the database read fails, or returns 0 rows while the tab holds data rows, that tab is not
 *    written at all; the Status tab says FAILED and why. The other tables still copy.
 *  - Every fault is a CODE (`db_http_401`, `sheets_write_http_403`, …), never a body, a key, a URL or a value.
 * It does not throw: whatever happens, the result says so.
 */
export async function runBackup(deps: BackupDeps): Promise<BackupResult> {
  const started = deps.now();
  const nowIst = formatIst(started);
  const today = istDate(started);
  const http = resilientFetch(deps.fetch, deps.sleep ?? realSleep);
  const { config } = deps;
  const tables = Object.fromEntries(TABLES.map((t) => [t.name, untouched()])) as Record<TableName, TableOutcome>;
  let runFailure: string | undefined;
  let durationMs = 0;

  try {
    const account = parseServiceAccount(config.googleServiceAccountJson);
    if (!config.sheetId) throw new BackupError("config_missing_sheet_id");
    const token = await fetchAccessToken(http, account, Math.floor(started.getTime() / 1000), deps.subtle);
    const sheets = new SheetsClient(http, token, config.sheetId);
    await sheets.ensureTabs(TAB_ORDER);
    const previousStatus = await sheets.readTab(STATUS_TAB).catch((error) => {
      throw new BackupError(`status_${codeOf(error)}`);
    });

    for (const table of TABLES) {
      tables[table.name] = await copyTable(http, sheets, config, table, nowIst, today);
    }

    durationMs = deps.now().getTime() - started.getTime();
    const result = overall(tables, undefined);
    const status = buildStatus({ nowIst, result, durationMs, tables, previous: previousStatus });
    try {
      await sheets.ensureGrid(STATUS_TAB, status.length, status[0].length);
      await sheets.writeTab(STATUS_TAB, status);
    } catch (error) {
      runFailure = `status_write_${codeOf(error)}`;
    }
  } catch (error) {
    runFailure = codeOf(error);
    durationMs = deps.now().getTime() - started.getTime();
  }

  const result = overall(tables, runFailure);
  const event = await sendBackupEvent(http, {
    result,
    durationMs,
    runFailure,
    tables,
    env: config.env,
    now: deps.now(),
    uuid: deps.uuid(),
  });
  return { result, startedAtIst: nowIst, durationMs, failedReason: runFailure, tables, event };
}

/** One table: read the database, read the tab, merge, write. Never throws; a failure writes nothing to this tab. */
async function copyTable(
  http: FetchLike,
  sheets: SheetsClient,
  config: BackupConfig,
  table: (typeof TABLES)[number],
  nowIst: string,
  today: string,
): Promise<TableOutcome> {
  const failed = (reason: string): TableOutcome => ({ status: "failed", truncatedCells: 0, truncatedColumns: [], failedReason: reason });
  try {
    if (!config.supabaseUrl || !config.dbKey) return failed("db_config_missing");
    const dbRows = await readTable(http, { url: config.supabaseUrl, key: config.dbKey }, table.name);
    const existing = await sheets.readTab(table.name);
    const sheetData = dataRowsOf(existing).length;
    // The safety rule: an empty answer from the database must never be allowed to look like "everything was deleted".
    if (dbRows.length === 0 && sheetData > 0) return failed("db_zero_rows_sheet_has_rows");
    if (dbRows.length === 0) return { status: "ok", dbRows: 0, sheetRows: 0, notInDbRows: 0, truncatedCells: 0, truncatedColumns: [] };

    const merged = mergeTab({ existing, dbRows, appendOrder: table.appendOrder, nowIst, today });
    await sheets.ensureGrid(table.name, merged.values.length, merged.values[0].length);
    await sheets.writeTab(table.name, merged.values);
    return {
      status: "ok",
      dbRows: merged.dbRows,
      sheetRows: merged.sheetRows,
      notInDbRows: merged.notInDbRows,
      truncatedCells: merged.truncatedCells,
      truncatedColumns: merged.truncatedColumns,
    };
  } catch (error) {
    return failed(codeOf(error));
  }
}
