import { webcrypto } from "node:crypto";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { runBackup, type BackupDeps } from "../../supabase/functions/db-backup/backup";
import { MAX_CELL_CHARS, TABLES } from "../../supabase/functions/db-backup/config";
import { resilientFetch } from "../../supabase/functions/db-backup/http";
import {
  ACCESS_TOKEN,
  FAKE,
  SHEET_ID,
  SUPABASE_URL,
  TEST_SECRET_KEY,
  clock,
  keyFileJson,
  makeFetch,
  makeTestKey,
  newWorld,
  preorderRow,
  standardDb,
  tabValues,
  testConfig,
  webhookRow,
  type World,
} from "./support";

const subtle = webcrypto.subtle as SubtleCrypto;
let pem = "";
let publicKey: CryptoKey;
beforeAll(async () => {
  const key = await makeTestKey();
  pem = key.pem;
  publicKey = key.publicKey;
});

const NIGHT1 = "2026-11-25T20:30:00Z"; // 02:00 IST, 26 Nov
const NIGHT2 = "2026-11-26T20:30:00Z";

function deps(world: World, over: Partial<BackupDeps> = {}, moments: string[] = [NIGHT1, "2026-11-25T20:30:04Z"]): BackupDeps {
  world.publicKey = publicKey;
  return {
    fetch: makeFetch(world),
    now: clock(...moments),
    sleep: async () => {},
    subtle,
    uuid: () => "11111111-1111-4111-8111-111111111111",
    config: testConfig(pem),
    ...over,
  };
}

const statusRow = (world: World, table: string) => tabValues(world, "Status").find((r) => r[0] === table && r.length > 3);
const puts = (world: World, tab: string) => world.calls.filter((c) => c.method === "PUT" && c.path.includes(`/values/'${tab}'`));

describe("runBackup: the first night", () => {
  it("creates Status, preorders, event_tiers and webhook_events in that order, and copies every column of every row", async () => {
    const world = newWorld(standardDb());
    const result = await runBackup(deps(world));
    expect(result.result).toBe("ok");
    expect([...world.tabs.keys()]).toEqual(["Status", "preorders", "event_tiers", "webhook_events"]);
    for (const tab of world.tabs.values()) expect(tab.frozenRowCount).toBe(1);

    const orders = tabValues(world, "preorders");
    const columns = Object.keys(preorderRow(1));
    expect(orders[0]).toEqual([...columns, "in_database", "last_copied"]);
    expect(orders).toHaveLength(4);
    const first = Object.fromEntries(orders[0].map((name, i) => [name, orders[1][i] ?? ""]));
    expect(first.id).toBe("1");
    expect(first.parent_name).toBe(FAKE.name);
    expect(first.wa_consent).toBe("true");
    expect(first.amount_paise).toBe("49900");
    expect(first.rzp_payment_id).toBe("");
    expect(first.ph_session_id).toBe("");
    expect(JSON.parse(first.address)).toEqual({ line1: FAKE.address, pin: "000000" });
    expect(JSON.parse(first.fb_attrib)).toEqual({ fbp: "fb.1.0.fake" });
    expect(first.in_database).toBe("yes");
    expect(first.last_copied).toBe("2026-11-26 02:00:00 IST");
    expect(tabValues(world, "event_tiers")).toHaveLength(3);
    const hooks = tabValues(world, "webhook_events");
    expect(hooks[0]).toEqual(["id", "event_type", "order_ref", "received_at", "payload", "in_database", "last_copied"]);
    expect(JSON.parse(hooks[1][4])).toEqual({ event: "payment.captured", amount: 49900 });
  });

  it("writes Status: per-table counts and last updated, the orders line, the run log", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    expect(statusRow(world, "preorders")).toEqual(["preorders", "3", "3", "0", "2026-11-26 02:00:00 IST", "OK"]);
    expect(statusRow(world, "event_tiers")?.slice(1, 3)).toEqual(["2", "2"]);
    expect(statusRow(world, "webhook_events")?.slice(1, 3)).toEqual(["2", "2"]);
    const status = tabValues(world, "Status");
    expect(status.find((r) => r[0]?.startsWith("Orders:"))?.[0]).toBe("Orders: 3 of 1,000 (revisit point)");
    const log = status.slice(status.findIndex((r) => r[0] === "Run (IST)") + 1);
    expect(log).toEqual([["2026-11-26 02:00:00 IST", "OK", "OK 3 rows", "OK 2 rows", "OK 2 rows", "4.0"]]);
  });

  it("sends one db_backup_completed event, anonymous, with the counts and the duration", async () => {
    const world = newWorld(standardDb());
    const result = await runBackup(deps(world));
    expect(result.event).toBe("sent");
    expect(world.events).toHaveLength(1);
    const e = world.events[0] as { event: string; distinct_id: string; properties: Record<string, unknown> };
    expect(e.event).toBe("db_backup_completed");
    expect(e.distinct_id).toBe("kh-db-backup");
    expect(e.properties).toMatchObject({ result: "ok", duration_ms: 4000, preorders_db_rows: 3, webhook_events_db_rows: 2, $process_person_profile: false });
    expect("env" in e.properties).toBe(false);
  });

  it("stamps env beta on the test project's event", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world, { config: testConfig(pem, { env: "beta" }) }));
    expect((world.events[0] as { properties: Record<string, unknown> }).properties.env).toBe("beta");
  });
});

describe("runBackup: read-only on the database, secrets only where they belong", () => {
  it("every request to the database is a GET of /rest/v1/<one of the three tables>, and nothing is ever deleted or cleared", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    const toDb = world.calls.filter((c) => c.host === new URL(SUPABASE_URL).host);
    expect(toDb.length).toBeGreaterThanOrEqual(3);
    for (const call of toDb) {
      expect(call.method).toBe("GET");
      expect(call.path).toMatch(/^\/rest\/v1\/(preorders|event_tiers|webhook_events)$/);
      expect(call.body).toBe("");
    }
    expect(world.calls.filter((c) => !["GET", "POST", "PUT"].includes(c.method))).toEqual([]);
    expect(world.calls.filter((c) => /:clear|deleteDimension|deleteSheet|:batchClear/.test(c.url + c.body))).toEqual([]);
    // The simulator's database refuses every other method; if the function had tried one, a table would have failed.
    expect(world.db.preorders).toEqual(standardDb().preorders);
  });

  it("the only POSTs are the Google token, a Sheets batchUpdate and the PostHog event", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    const posts = world.calls.filter((c) => c.method === "POST").map((c) => `${c.host}${c.path.replace(SHEET_ID, "<sheet>")}`);
    expect(new Set(posts)).toEqual(new Set(["oauth2.googleapis.com/token", "sheets.googleapis.com/v4/spreadsheets/<sheet>:batchUpdate", "us.i.posthog.com/batch/"]));
  });

  it("each secret goes only to its own host: the database key to Supabase, the access token to Sheets, the private key nowhere", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    for (const call of world.calls) {
      const everything = JSON.stringify(call.headers) + call.url + call.body;
      expect(everything, `${call.host}: private key text`).not.toContain("PRIVATE KEY");
      expect(everything).not.toContain(pem.replace(/\n/g, "").slice(40, 80));
      if (call.host !== new URL(SUPABASE_URL).host) expect(everything, `${call.host}: database key`).not.toContain(TEST_SECRET_KEY);
      if (call.host !== "sheets.googleapis.com") expect(everything, `${call.host}: access token`).not.toContain(ACCESS_TOKEN);
    }
    const posthog = world.calls.filter((c) => c.host === "us.i.posthog.com");
    expect(posthog.every((c) => !("authorization" in c.headers))).toBe(true);
  });

  it("writes every value RAW, so text that looks like a formula stays text", async () => {
    const db = standardDb();
    db.preorders = [preorderRow(1, { parent_name: "=HYPERLINK(\"http://x.invalid\",\"click\")", child_age: "+5", phone: "-1", email: "@x" })];
    const world = newWorld(db);
    await runBackup(deps(world));
    const writes = world.calls.filter((c) => c.method === "PUT");
    expect(writes.length).toBeGreaterThanOrEqual(4);
    for (const w of writes) expect(w.query.get("valueInputOption")).toBe("RAW");
    const orders = tabValues(world, "preorders");
    const at = (name: string) => orders[1][orders[0].indexOf(name)];
    expect([at("parent_name"), at("child_age"), at("phone"), at("email")]).toEqual(["=HYPERLINK(\"http://x.invalid\",\"click\")", "+5", "-1", "@x"]);
  });
});

describe("runBackup: later nights", () => {
  it("copies again without changing anything when nothing changed (apart from last_copied)", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    const before = tabValues(world, "preorders").map((r) => r.slice(0, -1));
    await runBackup(deps(world, {}, [NIGHT2, "2026-11-26T20:30:03Z"]));
    expect(tabValues(world, "preorders").map((r) => r.slice(0, -1))).toEqual(before);
    expect(tabValues(world, "preorders")[1].at(-1)).toBe("2026-11-27 02:00:00 IST");
  });

  it("overwrites a changed value, appends a new row, and keeps a vanished row, marked 'no, since <date>'", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    world.db.preorders = [preorderRow(1, { status: "refunded" }), preorderRow(3, { status: "created" }), preorderRow(4)];
    const second = await runBackup(deps(world, {}, [NIGHT2, "2026-11-26T20:30:03Z"]));
    expect(second.result).toBe("ok");
    const orders = tabValues(world, "preorders");
    const col = (name: string) => orders[0].indexOf(name);
    expect(orders.map((r) => r[0])).toEqual(["id", "1", "2", "3", "4"]);
    expect(orders[1][col("status")]).toBe("refunded");
    expect(orders[2][col("in_database")]).toBe("no, since 2026-11-27");
    expect(orders[2][col("parent_name")]).toBe(FAKE.name);
    expect(orders[2][col("last_copied")]).toBe("2026-11-26 02:00:00 IST");
    expect(orders[4][col("in_database")]).toBe("yes");
    expect(statusRow(world, "preorders")?.slice(1, 4)).toEqual(["3", "4", "1"]);
  });

  it("keeps the run log, newest first, across nights", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    await runBackup(deps(world, {}, [NIGHT2, "2026-11-26T20:30:03Z"]));
    const status = tabValues(world, "Status");
    const log = status.slice(status.findIndex((r) => r[0] === "Run (IST)") + 1);
    expect(log.map((r) => r[0])).toEqual(["2026-11-27 02:00:00 IST", "2026-11-26 02:00:00 IST"]);
  });
});

describe("runBackup: the safety rule, per table", () => {
  async function afterFirstNight() {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    return world;
  }

  it("a database that returns 0 rows while the tab holds rows is never written over the tab: Status says FAILED, the other tables still copy", async () => {
    const world = await afterFirstNight();
    const orders = tabValues(world, "preorders");
    world.db.preorders = [];
    world.db.event_tiers = [...standardDb().event_tiers, { id: "new-tier", label: "N", amount_paise: 1, cap: null, expires_on: null, active: true, created_at: "2026-11-26T00:00:00+00:00" }];
    world.calls.length = 0;
    const second = await runBackup(deps(world, {}, [NIGHT2, "2026-11-26T20:30:03Z"]));
    expect(second.result).toBe("failed");
    expect(second.tables.preorders).toMatchObject({ status: "failed", failedReason: "db_zero_rows_sheet_has_rows" });
    expect(puts(world, "preorders")).toEqual([]);
    expect(tabValues(world, "preorders")).toEqual(orders);
    expect(tabValues(world, "event_tiers")).toHaveLength(4);
    const row = statusRow(world, "preorders");
    expect(row?.slice(1, 6)).toEqual(["3", "3", "0", "2026-11-26 02:00:00 IST", "FAILED: db_zero_rows_sheet_has_rows"]);
    expect(statusRow(world, "event_tiers")?.[5]).toBe("OK");
    const event = world.events.at(-1) as { properties: Record<string, unknown> };
    expect(event.properties).toMatchObject({ result: "failed", preorders_failed_reason: "db_zero_rows_sheet_has_rows" });
  });

  it("a failed database read writes nothing to that tab, records the status code, and the other tables still copy", async () => {
    const world = await afterFirstNight();
    const hooks = tabValues(world, "webhook_events");
    world.fail.push({ match: "/rest/v1/webhook_events", status: 500 });
    world.db.preorders.push(preorderRow(9));
    world.calls.length = 0;
    const second = await runBackup(deps(world, {}, [NIGHT2, "2026-11-26T20:30:03Z"]));
    expect(second.result).toBe("failed");
    expect(second.tables.webhook_events.failedReason).toBe("db_http_500");
    expect(puts(world, "webhook_events")).toEqual([]);
    expect(tabValues(world, "webhook_events")).toEqual(hooks);
    expect(tabValues(world, "preorders")).toHaveLength(5);
    expect(statusRow(world, "webhook_events")?.[5]).toBe("FAILED: db_http_500");
  });

  it("an empty table and an empty tab is fine: OK, 0 rows, nothing written to that tab", async () => {
    const db = standardDb();
    db.event_tiers = [];
    const world = newWorld(db);
    const result = await runBackup(deps(world));
    expect(result.result).toBe("ok");
    expect(result.tables.event_tiers).toMatchObject({ status: "ok", dbRows: 0, sheetRows: 0 });
    expect(puts(world, "event_tiers")).toEqual([]);
  });

  it("a damaged tab header stops that table only (nothing written), with a code", async () => {
    const world = await afterFirstNight();
    world.tabs.get("event_tiers")!.cells[0] = ["label", "label", "in_database", "last_copied"];
    const second = await runBackup(deps(world, {}, [NIGHT2, "2026-11-26T20:30:03Z"]));
    expect(second.tables.event_tiers).toMatchObject({ status: "failed", failedReason: "sheet_header_invalid" });
    expect(second.tables.preorders.status).toBe("ok");
  });

  it("a missing database key fails every table with a code, and Status still says so", async () => {
    const world = newWorld(standardDb());
    const result = await runBackup(deps(world, { config: testConfig(pem, { dbKey: "" }) }));
    expect(result.result).toBe("failed");
    expect(TABLES.every((t) => result.tables[t.name].failedReason === "db_config_missing")).toBe(true);
    expect(statusRow(world, "preorders")?.[5]).toBe("FAILED: db_config_missing");
    expect(world.calls.some((c) => c.host === new URL(SUPABASE_URL).host)).toBe(false);
  });
});

describe("runBackup: cells over 50,000 characters", () => {
  it("cuts the cell with a visible marker, counts it per table and column, and the run is 'ok (truncated)', not silently OK", async () => {
    const db = standardDb();
    db.webhook_events = [webhookRow("evt_long", { payload: "x".repeat(MAX_CELL_CHARS + 500) }), webhookRow("evt_short")];
    const world = newWorld(db);
    const result = await runBackup(deps(world));
    expect(result.result).toBe("ok_truncated");
    expect(result.tables.webhook_events).toMatchObject({ truncatedCells: 1, truncatedColumns: ["payload"] });
    const hooks = tabValues(world, "webhook_events");
    const cut = hooks.find((r) => r[0] === "evt_long")![4];
    expect(cut.length).toBeLessThanOrEqual(MAX_CELL_CHARS);
    expect(cut).toContain("[TRUNCATED:");
    expect(statusRow(world, "webhook_events")?.[5]).toBe("OK (truncated)");
    expect(statusRow(world, "webhook_events")?.[6]).toContain("payload");
    expect(tabValues(world, "Status").find((r) => r[0] === "Last run result")?.[1]).toBe("OK (truncated)");
    expect((world.events[0] as { properties: Record<string, unknown> }).properties).toMatchObject({ result: "ok_truncated", webhook_events_truncated_cells: 1 });
  });
});

describe("runBackup: tab size and big writes", () => {
  it("grows a tab before writing past its grid, and writes a large table in chunks that are all stored", async () => {
    const db = standardDb();
    db.preorders = Array.from({ length: 1500 }, (_, i) => preorderRow(i + 1));
    const world = newWorld(db);
    const result = await runBackup(deps(world));
    expect(result.result).toBe("ok");
    expect(tabValues(world, "preorders")).toHaveLength(1501);
    expect(world.tabs.get("preorders")!.rowCount).toBeGreaterThanOrEqual(1501);
    expect(world.calls.some((c) => c.path.endsWith(":batchUpdate") && c.body.includes("updateSheetProperties"))).toBe(true);
  });

  it("splits a very large write into several requests of about 1.5 MB at most, and nothing is lost", async () => {
    const db = standardDb();
    const big = "q".repeat(49_000);
    db.webhook_events = Array.from({ length: 80 }, (_, i) => webhookRow(`evt_${String(i).padStart(3, "0")}`, { payload: big }));
    const world = newWorld(db);
    const result = await runBackup(deps(world));
    expect(result.result).toBe("ok");
    const hookPuts = puts(world, "webhook_events");
    expect(hookPuts.length).toBeGreaterThan(2);
    for (const p of hookPuts) expect(p.body.length).toBeLessThan(1_700_000);
    expect(tabValues(world, "webhook_events")).toHaveLength(81);
    expect(tabValues(world, "webhook_events")[80][4]).toBe(big);
  });

  it("never shrinks a tab: the resize call only grows it", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    world.tabs.get("preorders")!.rowCount = 5000; // a human made it bigger
    await runBackup(deps(world, {}, [NIGHT2, "2026-11-26T20:30:03Z"]));
    expect(world.tabs.get("preorders")!.rowCount).toBe(5000);
  });
});

describe("runBackup: when Google or the configuration fails", () => {
  it("a refused Google token stops the run with the status code, does not touch the database, and still sends the event as failed", async () => {
    const world = newWorld(standardDb());
    world.fail.push({ match: "oauth2.googleapis.com", status: 400 });
    const result = await runBackup(deps(world));
    expect(result).toMatchObject({ result: "failed", failedReason: "google_token_http_400", event: "sent" });
    expect(world.calls.some((c) => c.host === new URL(SUPABASE_URL).host || c.host === "sheets.googleapis.com")).toBe(false);
    expect(world.events[0]).toMatchObject({ properties: { result: "failed", failed_reason: "google_token_http_400" } });
  });

  it("a sheet that is not shared with the service account (403) fails with the code and writes nothing", async () => {
    const world = newWorld(standardDb());
    world.fail.push({ match: "sheets.googleapis.com", status: 403 });
    const result = await runBackup(deps(world));
    expect(result.failedReason).toBe("sheets_meta_http_403");
    expect(world.calls.some((c) => c.method === "PUT")).toBe(false);
  });

  it("a Status write that fails fails the run, with its own code", async () => {
    const world = newWorld(standardDb());
    world.fail.push({ match: "values/'Status'", status: 500, method: "PUT" });
    const result = await runBackup(deps(world));
    expect(result.result).toBe("failed");
    expect(result.failedReason).toBe("status_write_sheets_write_http_500");
    expect(tabValues(world, "preorders")).toHaveLength(4);
  });

  it("missing sheet id, key file and invalid key each end the run with a code and no request to Google", async () => {
    for (const [over, code] of [
      [{ sheetId: "" }, "config_missing_sheet_id"],
      [{ googleServiceAccountJson: "" }, "google_key_missing"],
      [{ googleServiceAccountJson: "{not json" }, "google_key_invalid"],
    ] as const) {
      const world = newWorld(standardDb());
      const result = await runBackup(deps(world, { config: testConfig(pem, over) }));
      expect(result.failedReason).toBe(code);
      expect(world.calls.filter((c) => c.host !== "us.i.posthog.com")).toEqual([]);
      expect(result.event).toBe("sent");
    }
  });

  it("retries a rate limit or a server hiccup, then carries on", async () => {
    const world = newWorld(standardDb());
    world.fail.push({ match: "sheets.googleapis.com", status: 503, method: "GET", times: 1 });
    world.fail.push({ match: "/rest/v1/event_tiers", status: 429, times: 1 });
    const sleep = vi.fn(async () => {});
    const result = await runBackup(deps(world, { sleep }));
    expect(result.result).toBe("ok");
    expect(sleep).toHaveBeenCalled();
  });

  it("a PostHog outage does not fail a good copy", async () => {
    const world = newWorld(standardDb());
    world.throwOn.push("posthog.com");
    const result = await runBackup(deps(world));
    expect(result.result).toBe("ok");
    expect(result.event).toBe("failed");
    expect(tabValues(world, "preorders")).toHaveLength(4);
  });

  it("never throws, and no fault text from Google, Supabase or the sheet reaches the Status tab or the event", async () => {
    const world = newWorld(standardDb());
    world.fail.push({ match: "/rest/v1/preorders", status: 500 }, { match: "values/'event_tiers'", status: 403, method: "PUT" });
    const result = await runBackup(deps(world));
    expect(result.result).toBe("failed");
    const everything = JSON.stringify(tabValues(world, "Status")) + JSON.stringify(world.events);
    expect(everything).not.toContain("simulated failure");
    expect(everything).not.toContain("must never be copied");
  });
});

describe("runBackup: the sheet holds personal data, Status and PostHog do not", () => {
  it("copies the fake name, phone, email, address and child age into the preorders tab, and into no other tab, request body or event", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    const orders = JSON.stringify(tabValues(world, "preorders"));
    for (const value of Object.values(FAKE)) expect(orders).toContain(value.slice(0, 12));
    for (const tab of ["Status", "event_tiers", "webhook_events"]) {
      for (const value of Object.values(FAKE)) expect(JSON.stringify(tabValues(world, tab)), `${tab} holds ${value}`).not.toContain(value.slice(0, 12));
    }
    for (const call of world.calls.filter((c) => c.host === "us.i.posthog.com" || c.host === "oauth2.googleapis.com")) {
      for (const value of Object.values(FAKE)) expect(call.body, `${call.host} body`).not.toContain(value.slice(0, 12));
    }
    for (const event of world.events) for (const value of Object.values(FAKE)) expect(JSON.stringify(event)).not.toContain(value.slice(0, 12));
  });

  it("keeps Status and the event free of personal data on the worst night too (everything failing, with fixture rows present)", async () => {
    const world = newWorld(standardDb());
    await runBackup(deps(world));
    world.db.preorders = [];
    world.fail.push({ match: "/rest/v1/webhook_events", status: 401 });
    await runBackup(deps(world, {}, [NIGHT2, "2026-11-26T20:30:03Z"]));
    const text = JSON.stringify(tabValues(world, "Status")) + JSON.stringify(world.events);
    for (const value of Object.values(FAKE)) expect(text).not.toContain(value.slice(0, 12));
  });
});

describe("resilientFetch", () => {
  const respond = (status: number) => new Response("{}", { status });

  it("gives every attempt a time limit and returns a good answer at once", async () => {
    const inner = vi.fn(async (_url: string, init?: RequestInit) => {
      expect(init?.signal).toBeDefined();
      return respond(200);
    });
    expect((await resilientFetch(inner, async () => {})("https://x.invalid")).status).toBe(200);
    expect(inner).toHaveBeenCalledTimes(1);
  });

  it("retries 429, 500, 502, 503, 504 and network errors, and gives up after three attempts", async () => {
    for (const status of [429, 500, 502, 503, 504]) {
      const inner = vi.fn(async () => respond(status));
      const response = await resilientFetch(inner, async () => {})("https://x.invalid");
      expect(response.status).toBe(status);
      expect(inner).toHaveBeenCalledTimes(3);
    }
    const down = vi.fn(async () => {
      throw new TypeError("offline");
    });
    await expect(resilientFetch(down, async () => {})("https://x.invalid")).rejects.toThrow("offline");
    expect(down).toHaveBeenCalledTimes(3);
  });

  it("does not retry a refusal such as 401, 403 or 404", async () => {
    for (const status of [400, 401, 403, 404]) {
      const inner = vi.fn(async () => respond(status));
      expect((await resilientFetch(inner, async () => {})("https://x.invalid")).status).toBe(status);
      expect(inner).toHaveBeenCalledTimes(1);
    }
  });

  it("recovers when a retry succeeds, waiting between attempts", async () => {
    const statuses = [503, 200];
    const inner = vi.fn(async () => respond(statuses.shift() ?? 200));
    const sleep = vi.fn(async () => {});
    expect((await resilientFetch(inner, sleep)("https://x.invalid")).status).toBe(200);
    expect(sleep).toHaveBeenCalledTimes(1);
  });
});

describe("the key file in the test is a throwaway", () => {
  it("is generated here at run time, and is not any file in the repository", () => {
    expect(keyFileJson(pem)).toContain("BEGIN PRIVATE KEY");
    expect(keyFileJson(pem)).toContain("fake-project.iam.gserviceaccount.com");
  });
});
