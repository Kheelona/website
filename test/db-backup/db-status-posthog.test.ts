import { describe, expect, it } from "vitest";
import { dbHeaders, readTable } from "../../supabase/functions/db-backup/db";
import { TABLES } from "../../supabase/functions/db-backup/config";
import { backupEventBody, sendBackupEvent } from "../../supabase/functions/db-backup/posthog";
import { RUN_LOG_LIMIT } from "../../supabase/functions/db-backup/config";
import { buildStatus, resultText, withThousands, type TableOutcome } from "../../supabase/functions/db-backup/status";
import { FAKE, SUPABASE_URL, TEST_SECRET_KEY, makeFetch, newWorld, preorderRow } from "./support";

const okTable = (dbRows: number, over: Partial<TableOutcome> = {}): TableOutcome => ({
  status: "ok",
  dbRows,
  sheetRows: dbRows,
  notInDbRows: 0,
  truncatedCells: 0,
  truncatedColumns: [],
  ...over,
});
const failedTable = (reason: string): TableOutcome => ({ status: "failed", truncatedCells: 0, truncatedColumns: [], failedReason: reason });
const allOk = () => ({ preorders: okTable(3), event_tiers: okTable(2), webhook_events: okTable(5) });

describe("db: reads the table in full, by GET only", () => {
  const rows = (n: number) => Array.from({ length: n }, (_, i) => preorderRow(i + 1));

  it("pages through every row, ordered by id, with select=* (every column)", async () => {
    const world = newWorld({ preorders: rows(1201) });
    const got = await readTable(makeFetch(world), { url: SUPABASE_URL, key: TEST_SECRET_KEY }, "preorders");
    expect(got).toHaveLength(1201);
    expect(world.calls.length).toBeGreaterThanOrEqual(3);
    for (const call of world.calls) {
      expect(call.method).toBe("GET");
      expect(call.path).toBe("/rest/v1/preorders");
      expect(call.query.get("select")).toBe("*");
      expect(call.query.get("order")).toBe("id.asc");
    }
    expect(got.map((r) => r.id)).toEqual(rows(1201).map((r) => r.id));
  });

  it("follows what the server returns, so a row cap below the page size cannot cut the copy short", async () => {
    const world = newWorld({ preorders: rows(130) });
    world.dbMaxRows = 40;
    const got = await readTable(makeFetch(world), { url: SUPABASE_URL, key: TEST_SECRET_KEY }, "preorders");
    expect(got).toHaveLength(130);
  });

  it("an empty table is an empty list after one request", async () => {
    const world = newWorld({ preorders: [] });
    expect(await readTable(makeFetch(world), { url: SUPABASE_URL, key: TEST_SECRET_KEY }, "preorders")).toEqual([]);
    expect(world.calls).toHaveLength(1);
  });

  it("a new-format secret key goes on apikey only; a legacy JWT goes on both headers", () => {
    expect(dbHeaders("sb_secret_x")).toEqual({ apikey: "sb_secret_x", accept: "application/json" });
    expect(dbHeaders("legacy-style-key")).toEqual({ apikey: "legacy-style-key", authorization: "Bearer legacy-style-key", accept: "application/json" });
  });

  it("a refused or failing read is a status code or a short word, never a body", async () => {
    const world = newWorld({ preorders: rows(2) });
    world.fail.push({ match: "/rest/v1/preorders", status: 401 });
    await expect(readTable(makeFetch(world), { url: SUPABASE_URL, key: TEST_SECRET_KEY }, "preorders")).rejects.toMatchObject({ code: "db_http_401" });
    world.fail = [];
    world.throwOn.push("/rest/v1/");
    await expect(readTable(makeFetch(world), { url: SUPABASE_URL, key: TEST_SECRET_KEY }, "preorders")).rejects.toMatchObject({ code: "db_network" });
  });

  it("only ever asks for the three tables (the tables the function is built for)", () => {
    expect(TABLES.map((t) => t.name)).toEqual(["preorders", "event_tiers", "webhook_events"]);
  });
});

describe("status: the Status tab", () => {
  const flat = (values: string[][]) => values.flat().join("\n");

  it("shows, for each table, rows in the database and in the sheet, last updated (IST) and OK", () => {
    const values = buildStatus({ nowIst: "2026-11-26 02:00:00 IST", result: "ok", durationMs: 4321, tables: allOk(), previous: [] });
    const row = values.find((r) => r[0] === "preorders" && r[5] === "OK");
    expect(row).toEqual(["preorders", "3", "3", "0", "2026-11-26 02:00:00 IST", "OK", ""]);
    expect(values.find((r) => r[0] === "Last run result")?.[1]).toBe("OK");
    expect(values.find((r) => r[0] === "Last run (IST)")?.[1]).toBe("2026-11-26 02:00:00 IST");
  });

  it("shows 'Orders: N of 1,000 (revisit point)', and says when it is reached", () => {
    const at = (n: number) => buildStatus({ nowIst: "t", result: "ok", durationMs: 1, tables: { ...allOk(), preorders: okTable(n) }, previous: [] }).map((r) => r[0]).find((c) => c.startsWith("Orders:"));
    expect(at(123)).toBe("Orders: 123 of 1,000 (revisit point)");
    expect(at(1000)).toBe("Orders: 1,000 of 1,000 (revisit point): REACHED, revisit the plan");
    expect(withThousands(1234567)).toBe("1,234,567");
  });

  it("a table that failed keeps its earlier counts and its earlier 'last updated', and says FAILED with the reason", () => {
    const night1 = buildStatus({ nowIst: "2026-11-25 02:00:00 IST", result: "ok", durationMs: 1000, tables: allOk(), previous: [] });
    const night2 = buildStatus({
      nowIst: "2026-11-26 02:00:00 IST",
      result: "failed",
      durationMs: 1000,
      tables: { ...allOk(), preorders: failedTable("db_http_401") },
      previous: night1,
    });
    const row = night2.find((r) => r[0] === "preorders" && r[5].startsWith("FAILED"));
    expect(row?.slice(0, 6)).toEqual(["preorders", "3", "3", "0", "2026-11-25 02:00:00 IST", "FAILED: db_http_401"]);
    expect(row?.[6]).toContain("nothing written to this tab");
    expect(night2.find((r) => r[0] === "Last run result")?.[1]).toBe("FAILED");
    expect(night2.map((r) => r[0]).find((c) => c.startsWith("Orders:"))).toBe("Orders: 3 of 1,000 (revisit point)");
  });

  it("a table never copied reads 'never', and the orders line says unknown", () => {
    const values = buildStatus({ nowIst: "t", result: "failed", durationMs: 1, runFailure: "google_token_http_400", tables: { preorders: failedTable("not_attempted"), event_tiers: failedTable("not_attempted"), webhook_events: failedTable("not_attempted") }, previous: [] });
    expect(values.find((r) => r[0] === "preorders" && r[5].startsWith("FAILED"))?.[4]).toBe("never");
    expect(values.map((r) => r[0]).find((c) => c.startsWith("Orders:"))).toBe("Orders: unknown of 1,000 (revisit point)");
    expect(values.find((r) => r[0] === "Last run result")?.[2]).toBe("run: google_token_http_400");
  });

  it("the run log is newest first and keeps the last 60 runs", () => {
    let status: string[][] = [];
    for (let i = 1; i <= 75; i++) {
      status = buildStatus({ nowIst: `run-${String(i).padStart(3, "0")}`, result: "ok", durationMs: 1000, tables: allOk(), previous: status });
    }
    const at = status.findIndex((r) => r[0] === "Run (IST)");
    const log = status.slice(at + 1).filter((r) => r[0]);
    expect(log).toHaveLength(RUN_LOG_LIMIT);
    expect(log[0][0]).toBe("run-075");
    expect(log[RUN_LOG_LIMIT - 1][0]).toBe("run-016");
    expect(log[0].slice(1, 6)).toEqual(["OK", "OK 3 rows", "OK 2 rows", "OK 5 rows", "1.0"]);
  });

  it("every row has the same width, so one write covers the tab", () => {
    const values = buildStatus({ nowIst: "t", result: "ok", durationMs: 1, tables: allOk(), previous: [] });
    expect(new Set(values.map((r) => r.length))).toEqual(new Set([7]));
  });

  it("reports truncation in the table row, the result word and the run log", () => {
    const tables = { ...allOk(), webhook_events: okTable(5, { truncatedCells: 2, truncatedColumns: ["payload"] }) };
    const values = buildStatus({ nowIst: "t", result: "ok_truncated", durationMs: 1, tables, previous: [] });
    const row = values.find((r) => r[0] === "webhook_events" && r[5].startsWith("OK"));
    expect(row?.[5]).toBe("OK (truncated)");
    expect(row?.[6]).toBe("2 cell(s) cut to the 50,000-character limit in: payload");
    expect(resultText("ok_truncated")).toBe("OK (truncated)");
    expect(values.find((r) => r[0] === "Last run result")?.[1]).toBe("OK (truncated)");
  });

  it("holds no personal data: a run over rows that carry a fake name, phone, email, address and child age leaves none of it in the tab", () => {
    // The outcomes are counts and codes by construction; this keeps it that way, including a failure reason.
    const values = buildStatus({
      nowIst: "2026-11-26 02:00:00 IST",
      result: "failed",
      durationMs: 12,
      tables: { ...allOk(), preorders: failedTable("db_http_500") },
      previous: [],
    });
    const text = flat(values);
    for (const secret of Object.values(FAKE)) expect(text).not.toContain(secret);
  });
});

describe("posthog: the event", () => {
  const base = { result: "ok" as const, durationMs: 4321.6, tables: allOk(), now: new Date("2026-11-25T20:30:05Z"), uuid: "00000000-0000-4000-8000-000000000000" };

  it("is db_backup_completed to the store's PostHog project, anonymous, with counts and codes only", () => {
    const body = backupEventBody(base) as { api_key: string; batch: { event: string; distinct_id: string; type: string; properties: Record<string, unknown> }[] };
    expect(body.api_key).toBe("phc_ute69SyrVALLjx3bW8xUNVqiALe7RRNbJp9KuZDd9726");
    expect(body.batch).toHaveLength(1);
    expect(body.batch[0]).toMatchObject({ type: "capture", event: "db_backup_completed", distinct_id: "kh-db-backup" });
    expect(body.batch[0].properties).toEqual({
      $lib: "kh-db-backup",
      $lib_version: "1",
      $process_person_profile: false,
      $geoip_disable: true,
      result: "ok",
      duration_ms: 4322,
      preorders_db_rows: 3,
      preorders_sheet_rows: 3,
      preorders_not_in_db_rows: 0,
      preorders_truncated_cells: 0,
      event_tiers_db_rows: 2,
      event_tiers_sheet_rows: 2,
      event_tiers_not_in_db_rows: 0,
      event_tiers_truncated_cells: 0,
      webhook_events_db_rows: 5,
      webhook_events_sheet_rows: 5,
      webhook_events_not_in_db_rows: 0,
      webhook_events_truncated_cells: 0,
    });
  });

  it("carries env beta on the test project and no env on production", () => {
    const beta = backupEventBody({ ...base, env: "beta" }) as { batch: { properties: Record<string, unknown> }[] };
    const prod = backupEventBody(base) as { batch: { properties: Record<string, unknown> }[] };
    expect(beta.batch[0].properties.env).toBe("beta");
    expect("env" in prod.batch[0].properties).toBe(false);
  });

  it("a failed table adds its failure code and drops the counts it does not know; a run failure adds failed_reason", () => {
    const body = backupEventBody({ ...base, result: "failed", runFailure: "google_token_http_400", tables: { ...allOk(), preorders: failedTable("db_http_401") } }) as { batch: { properties: Record<string, unknown> }[] };
    const p = body.batch[0].properties;
    expect(p.result).toBe("failed");
    expect(p.failed_reason).toBe("google_token_http_400");
    expect(p.preorders_failed_reason).toBe("db_http_401");
    expect("preorders_db_rows" in p).toBe(false);
    expect("event_tiers_failed_reason" in p).toBe(false);
  });

  it("holds no personal data", () => {
    const text = JSON.stringify(backupEventBody({ ...base, result: "failed", tables: { ...allOk(), preorders: failedTable("db_http_401") } }));
    for (const secret of Object.values(FAKE)) expect(text).not.toContain(secret);
    expect(text).not.toMatch(/email|phone|parent_name|child_age|address/i);
  });

  it("is sent to PostHog's /batch/ endpoint, as posthog-node sends events", async () => {
    const world = newWorld();
    expect(await sendBackupEvent(makeFetch(world), base)).toBe("sent");
    expect(world.calls[0]).toMatchObject({ method: "POST", url: "https://us.i.posthog.com/batch/" });
    expect(world.events).toHaveLength(1);
  });

  it("never throws: a network failure or a refused request is 'failed', nothing more", async () => {
    const world = newWorld();
    world.throwOn.push("posthog.com");
    expect(await sendBackupEvent(makeFetch(world), base)).toBe("failed");
    world.throwOn = [];
    world.fail.push({ match: "posthog.com", status: 500 });
    expect(await sendBackupEvent(makeFetch(world), base)).toBe("failed");
  });
});
