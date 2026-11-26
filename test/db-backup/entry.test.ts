import { webcrypto } from "node:crypto";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { FAKE, ACCESS_TOKEN, SHEET_ID, TEST_SECRET_KEY, makeFetch, makeTestKey, keyFileJson, newWorld, standardDb, type World } from "./support";

/* The Deno entry (index.ts) run under Node: `Deno`, `EdgeRuntime`, `fetch` and `crypto` are stood in for, so the real
   handler runs against the in-memory Supabase/Google/PostHog of support.ts. */

const CRON_SECRET = "fake-cron-secret-for-tests-only";
let pem = "";
let publicKey: CryptoKey;
beforeAll(async () => {
  const key = await makeTestKey();
  pem = key.pem;
  publicKey = key.publicKey;
});

type Handler = (request: Request) => Response | Promise<Response>;
let world: World;
let handler: Handler;
let waitUntil: ReturnType<typeof vi.fn>;
let env: Record<string, string | undefined>;

async function load(): Promise<void> {
  vi.resetModules();
  let captured: Handler | undefined;
  vi.stubGlobal("Deno", { env: { get: (name: string) => env[name] }, serve: (h: Handler) => (captured = h) });
  waitUntil = vi.fn();
  vi.stubGlobal("EdgeRuntime", { waitUntil });
  vi.stubGlobal("fetch", makeFetch(world));
  vi.stubGlobal("crypto", webcrypto);
  await import("../../supabase/functions/db-backup/index");
  handler = captured as Handler;
  expect(handler).toBeTypeOf("function");
}

const post = (headers: Record<string, string> = {}, method = "POST") =>
  handler(new Request("https://abcdefghijklmnopqrst.supabase.co/functions/v1/db-backup", { method, headers }));

beforeEach(async () => {
  world = newWorld(standardDb());
  world.publicKey = publicKey;
  env = {
    BACKUP_CRON_SECRET: CRON_SECRET,
    BACKUP_SHEET_ID: SHEET_ID,
    GOOGLE_SERVICE_ACCOUNT_JSON: keyFileJson(pem),
    SUPABASE_URL: "https://abcdefghijklmnopqrst.supabase.co",
    SUPABASE_SECRET_KEYS: JSON.stringify({ default: TEST_SECRET_KEY }),
  };
  await load();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("index.ts: the endpoint", () => {
  it("refuses a request with no secret header, or a wrong one, with 401 and does no work at all", async () => {
    const attempts: Record<string, string>[] = [{}, { "x-backup-secret": "" }, { "x-backup-secret": "wrong" }, { "x-backup-secret": `${CRON_SECRET}!` }, { authorization: `Bearer ${TEST_SECRET_KEY}` }, { apikey: TEST_SECRET_KEY }];
    for (const headers of attempts) {
      const response = await post(headers);
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: "unauthorised" });
    }
    expect(world.calls).toEqual([]);
    expect(waitUntil).not.toHaveBeenCalled();
  });

  it("refuses everything when BACKUP_CRON_SECRET is not set, even an empty header", async () => {
    env.BACKUP_CRON_SECRET = undefined;
    const attempts: Record<string, string>[] = [{}, { "x-backup-secret": "" }, { "x-backup-secret": "undefined" }];
    for (const headers of attempts) expect((await post(headers)).status).toBe(401);
    expect(world.calls).toEqual([]);
  });

  it("with the right secret, a GET is refused (405) and nothing runs", async () => {
    const response = await handler(new Request("https://x.invalid/functions/v1/db-backup", { method: "GET", headers: { "x-backup-secret": CRON_SECRET } }));
    expect(response.status).toBe(405);
    expect(world.calls).toEqual([]);
  });

  it("with the right secret, a POST runs the copy inside waitUntil, answers 200 with counts and codes only", async () => {
    const response = await post({ "x-backup-secret": CRON_SECRET });
    expect(response.status).toBe(200);
    expect(waitUntil).toHaveBeenCalledTimes(1);
    expect(waitUntil.mock.calls[0][0]).toBeInstanceOf(Promise);
    const body = await response.json();
    expect(body).toMatchObject({ result: "ok", failed_reason: null, posthog_event: "sent" });
    expect(body.tables.preorders).toMatchObject({ status: "ok", dbRows: 3, sheetRows: 3 });
    const text = JSON.stringify(body);
    for (const value of Object.values(FAKE)) expect(text).not.toContain(value.slice(0, 12));
    for (const secret of [CRON_SECRET, TEST_SECRET_KEY, ACCESS_TOKEN, "PRIVATE KEY"]) expect(text).not.toContain(secret);
    expect(world.tabs.size).toBe(4);
  });

  it("answers 500 when the run failed, so the Edge Function log and the pg_net response show it", async () => {
    world.fail.push({ match: "oauth2.googleapis.com", status: 400 });
    const response = await post({ "x-backup-secret": CRON_SECRET });
    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ result: "failed", failed_reason: "google_token_http_400" });
  });

  it("logs counts and codes only", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await post({ "x-backup-secret": CRON_SECRET });
    const lines = log.mock.calls.map((c) => c.join(" ")).join("\n");
    log.mockRestore();
    expect(lines).toContain("[db-backup] result=ok");
    for (const value of [...Object.values(FAKE), CRON_SECRET, TEST_SECRET_KEY, "PRIVATE KEY"]) expect(lines).not.toContain(value.slice(0, 12));
  });

  it("takes the database key from SUPABASE_SECRET_KEYS, else the legacy SUPABASE_SERVICE_ROLE_KEY", async () => {
    env.SUPABASE_SECRET_KEYS = undefined;
    env.SUPABASE_SERVICE_ROLE_KEY = TEST_SECRET_KEY;
    await load();
    const response = await post({ "x-backup-secret": CRON_SECRET });
    expect(response.status).toBe(200);
  });
});
