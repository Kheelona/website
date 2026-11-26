import { POSTHOG_API_HOST, POSTHOG_DISTINCT_ID, POSTHOG_EVENT, POSTHOG_KEY, POSTHOG_LIB, TABLES } from "./config.ts";
import type { FetchLike } from "./http.ts";
import type { RunResult, TableOutcome } from "./status.ts";
import type { TableName } from "./config.ts";

export type BackupEventInput = {
  result: RunResult;
  durationMs: number;
  /** A run-level fault code, when the tables were not attempted. */
  runFailure?: string;
  tables: Record<TableName, TableOutcome>;
  /** "beta" when the function runs on the test project; nothing on production. */
  env?: "beta";
  now: Date;
  uuid: string;
};

/**
 * The one PostHog event a run sends, `db_backup_completed` (D076). NUMBERS AND CODES ONLY: the result word, how long it
 * took, and per table the row counts and a failure code. No name, phone, email, address, child's age, row value or free
 * text can reach it, because nothing but counts and codes is passed in. Anonymous: one fixed id, no person profile.
 * Same body shape as posthog-node's own capture (`{ api_key, batch: [message], sent_at }` to `/batch/`).
 */
export function backupEventBody(input: BackupEventInput): Record<string, unknown> {
  const properties: Record<string, unknown> = {
    $lib: POSTHOG_LIB,
    $lib_version: "1",
    $process_person_profile: false,
    $geoip_disable: true,
    result: input.result,
    duration_ms: Math.round(input.durationMs),
  };
  if (input.runFailure) properties.failed_reason = input.runFailure;
  for (const { name } of TABLES) {
    const o = input.tables[name];
    if (o.dbRows !== undefined) properties[`${name}_db_rows`] = o.dbRows;
    if (o.sheetRows !== undefined) properties[`${name}_sheet_rows`] = o.sheetRows;
    if (o.notInDbRows !== undefined) properties[`${name}_not_in_db_rows`] = o.notInDbRows;
    properties[`${name}_truncated_cells`] = o.truncatedCells;
    if (o.status === "failed") properties[`${name}_failed_reason`] = o.failedReason ?? "unexpected_error";
  }
  if (input.env) properties.env = input.env;
  return {
    api_key: POSTHOG_KEY,
    batch: [
      {
        type: "capture",
        event: POSTHOG_EVENT,
        distinct_id: POSTHOG_DISTINCT_ID,
        uuid: input.uuid,
        timestamp: input.now.toISOString(),
        properties,
      },
    ],
    sent_at: input.now.toISOString(),
  };
}

/** Sends it. Never throws and never fails the run: a PostHog outage must not turn a good copy into a bad one. */
export async function sendBackupEvent(http: FetchLike, input: BackupEventInput): Promise<"sent" | "failed"> {
  try {
    const response = await http(`${POSTHOG_API_HOST}/batch/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(backupEventBody(input)),
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
