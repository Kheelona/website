import { webcrypto } from "node:crypto";
import type { BackupConfig } from "../../supabase/functions/db-backup/env";
import type { DbRow } from "../../supabase/functions/db-backup/merge";

/* A pretend Supabase, Google (token + Sheets) and PostHog, in memory, for the db-backup tests. NOTHING here touches the
   network: the function's `fetch` is this simulator's `fetch`, and it records every call. Every value below is made up:
   the key is a throwaway RSA key generated at run time (never a file), and the "personal data" is obviously fake. */

export const SUPABASE_URL = "https://abcdefghijklmnopqrst.supabase.co";
export const TEST_SECRET_KEY = "sb_secret_FAKE_for_tests_only";
export const SHEET_ID = "FAKE_SHEET_ID_1234";
export const ACCESS_TOKEN = "fake-access-token-for-tests";
export const SERVICE_ACCOUNT_EMAIL = "backup-test@fake-project.iam.gserviceaccount.com";

export type Call = { method: string; url: string; host: string; path: string; query: URLSearchParams; headers: Record<string, string>; body: string };

/** A throwaway RSA key pair: the PKCS#8 PEM the key file would hold, and the public half to check signatures. */
export async function makeTestKey(): Promise<{ pem: string; publicKey: CryptoKey }> {
  const pair = (await webcrypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;
  const der = Buffer.from(await webcrypto.subtle.exportKey("pkcs8", pair.privateKey)).toString("base64");
  const pem = `-----BEGIN PRIVATE KEY-----\n${(der.match(/.{1,64}/g) ?? []).join("\n")}\n-----END PRIVATE KEY-----\n`;
  return { pem, publicKey: pair.publicKey };
}

export const keyFileJson = (pem: string): string =>
  JSON.stringify({ type: "service_account", client_email: SERVICE_ACCOUNT_EMAIL, private_key: pem, token_uri: "https://example.invalid/token" });

type Tab = { sheetId: number; rowCount: number; columnCount: number; cells: string[][]; frozenRowCount?: number };

export type World = {
  /** The pretend database: table name -> rows. */
  db: Record<string, DbRow[]>;
  /** The pretend spreadsheet. */
  tabs: Map<string, Tab>;
  calls: Call[];
  /** Pretend server-side row cap for the REST API (PostgREST's max-rows). */
  dbMaxRows: number;
  /** Make a matching request answer with this HTTP status (e.g. {match: "/rest/v1/preorders", status: 401}). */
  fail: { match: string; status: number; method?: string; times?: number }[];
  /** Make a matching request throw a network error. */
  throwOn: string[];
  /** The PostHog events received. */
  events: Record<string, unknown>[];
  /** The decoded claims of every assertion exchanged for a token. */
  assertions: { header: Record<string, unknown>; claims: Record<string, unknown>; signatureValid: boolean }[];
  publicKey?: CryptoKey;
  nextSheetId: number;
};

export const newWorld = (db: Record<string, DbRow[]> = {}): World => ({
  db,
  tabs: new Map(),
  calls: [],
  dbMaxRows: 1000,
  fail: [],
  throwOn: [],
  events: [],
  assertions: [],
  nextSheetId: 100,
});

const b64urlToBytes = (text: string): Uint8Array => new Uint8Array(Buffer.from(text.replace(/-/g, "+").replace(/_/g, "/"), "base64"));
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const colLetters = /^'([^']+)'(?:!A(\d+))?$/;

/** The simulator's `fetch`. Only the addresses the function is meant to call are answered; anything else is a test failure. */
export function makeFetch(world: World): (input: string, init?: RequestInit) => Promise<Response> {
  return async (input, init) => {
    const url = new URL(input);
    const method = (init?.method ?? "GET").toUpperCase();
    const headers = Object.fromEntries(Object.entries((init?.headers ?? {}) as Record<string, string>).map(([k, v]) => [k.toLowerCase(), v]));
    const body = typeof init?.body === "string" ? init.body : "";
    world.calls.push({ method, url: input, host: url.host, path: decodeURIComponent(url.pathname), query: url.searchParams, headers, body });
    if (world.throwOn.some((m) => input.includes(m))) throw new TypeError("network down (simulated)");
    const forced = world.fail.find((f) => input.includes(f.match) && (!f.method || f.method === method));
    if (forced) {
      if (forced.times !== undefined && --forced.times <= 0) world.fail.splice(world.fail.indexOf(forced), 1);
      return json({ error: { message: "simulated failure, text that must never be copied" } }, forced.status);
    }

    if (url.host === "oauth2.googleapis.com" && url.pathname === "/token" && method === "POST") {
      const form = new URLSearchParams(body);
      if (form.get("grant_type") !== "urn:ietf:params:oauth:grant-type:jwt-bearer") return json({ error: "bad grant" }, 400);
      const [h, c, s] = (form.get("assertion") ?? "").split(".");
      const header = JSON.parse(Buffer.from(h, "base64url").toString("utf8")) as Record<string, unknown>;
      const claims = JSON.parse(Buffer.from(c, "base64url").toString("utf8")) as Record<string, unknown>;
      const signatureValid = world.publicKey
        ? await webcrypto.subtle.verify("RSASSA-PKCS1-v1_5", world.publicKey, b64urlToBytes(s) as BufferSource, new TextEncoder().encode(`${h}.${c}`) as BufferSource)
        : false;
      world.assertions.push({ header, claims, signatureValid });
      return signatureValid ? json({ access_token: ACCESS_TOKEN, expires_in: 3600, token_type: "Bearer" }) : json({ error: "invalid_grant" }, 400);
    }

    if (url.host === "abcdefghijklmnopqrst.supabase.co" && url.pathname.startsWith("/rest/v1/")) {
      if (headers.apikey !== TEST_SECRET_KEY) return json({ message: "Invalid API key" }, 401);
      const table = url.pathname.slice("/rest/v1/".length);
      const rows = world.db[table];
      if (!rows) return json({ message: "relation does not exist" }, 404);
      if (method !== "GET") return json({ message: "this fake database is read-only" }, 405);
      // Like PostgREST: a bigint id orders as a number, a text id as text.
      const ordered = [...rows].sort((a, b) =>
        typeof a.id === "number" && typeof b.id === "number" ? a.id - b.id : String(a.id) < String(b.id) ? -1 : 1,
      );
      const limit = Math.min(Number(url.searchParams.get("limit") ?? 1000), world.dbMaxRows);
      const offset = Number(url.searchParams.get("offset") ?? 0);
      return json(ordered.slice(offset, offset + limit));
    }

    if (url.host === "sheets.googleapis.com" && url.pathname.startsWith(`/v4/spreadsheets/${SHEET_ID}`)) {
      if (headers.authorization !== `Bearer ${ACCESS_TOKEN}`) return json({ error: "unauthenticated" }, 401);
      const rest = decodeURIComponent(url.pathname.slice(`/v4/spreadsheets/${SHEET_ID}`.length));
      if (rest === "" && method === "GET") {
        return json({
          sheets: [...world.tabs.entries()].map(([title, t]) => ({
            properties: { sheetId: t.sheetId, title, gridProperties: { rowCount: t.rowCount, columnCount: t.columnCount } },
          })),
        });
      }
      if (rest === ":batchUpdate" && method === "POST") {
        const requests = (JSON.parse(body) as { requests: Record<string, unknown>[] }).requests;
        const replies: unknown[] = [];
        for (const r of requests) {
          if (r.addSheet) {
            const p = (r.addSheet as { properties: { title: string; gridProperties?: { rowCount: number; columnCount: number; frozenRowCount?: number } } }).properties;
            if (world.tabs.has(p.title)) return json({ error: "duplicate sheet name" }, 400);
            const sheetId = world.nextSheetId++;
            world.tabs.set(p.title, {
              sheetId,
              rowCount: p.gridProperties?.rowCount ?? 1000,
              columnCount: p.gridProperties?.columnCount ?? 26,
              cells: [],
              frozenRowCount: p.gridProperties?.frozenRowCount,
            });
            replies.push({ addSheet: { properties: { sheetId, title: p.title } } });
          } else if (r.updateSheetProperties) {
            const u = r.updateSheetProperties as { properties: { sheetId: number; gridProperties: { rowCount: number; columnCount: number } }; fields: string };
            const tab = [...world.tabs.values()].find((t) => t.sheetId === u.properties.sheetId);
            if (!tab) return json({ error: "no such sheet" }, 400);
            // A resize may only grow here: the function must never shrink a tab.
            if (u.properties.gridProperties.rowCount < tab.rowCount || u.properties.gridProperties.columnCount < tab.columnCount) {
              return json({ error: "this fake refuses to shrink" }, 400);
            }
            tab.rowCount = u.properties.gridProperties.rowCount;
            tab.columnCount = u.properties.gridProperties.columnCount;
            replies.push({});
          } else {
            return json({ error: "unexpected batchUpdate request" }, 400);
          }
        }
        return json({ replies });
      }
      if (rest.startsWith("/values/")) {
        const range = colLetters.exec(rest.slice("/values/".length));
        if (!range) return json({ error: "bad range" }, 400);
        const tab = world.tabs.get(range[1]);
        if (!tab) return json({ error: "Unable to parse range" }, 400);
        if (method === "GET") {
          const rows = tab.cells.map((row) => {
            const copy = [...row];
            while (copy.length && copy[copy.length - 1] === "") copy.pop();
            return copy;
          });
          while (rows.length && rows[rows.length - 1].length === 0) rows.pop();
          return json(rows.length ? { range: range[1], majorDimension: "ROWS", values: rows } : { range: range[1], majorDimension: "ROWS" });
        }
        if (method === "PUT") {
          if (url.searchParams.get("valueInputOption") !== "RAW") return json({ error: "valueInputOption must be RAW" }, 400);
          const values = (JSON.parse(body) as { values: string[][] }).values;
          const start = Number(range[2] ?? 1) - 1;
          const width = Math.max(...values.map((r) => r.length));
          if (start + values.length > tab.rowCount || width > tab.columnCount) {
            return json({ error: { message: `Range exceeds grid limits. Max rows: ${tab.rowCount}, max columns: ${tab.columnCount}` } }, 400);
          }
          values.forEach((row, i) => {
            tab.cells[start + i] = [...row];
          });
          for (let i = 0; i < tab.cells.length; i++) tab.cells[i] ??= [];
          return json({ updatedRows: values.length });
        }
      }
    }

    if (url.host === "us.i.posthog.com" && url.pathname === "/batch/" && method === "POST") {
      const parsed = JSON.parse(body) as { batch: Record<string, unknown>[] };
      world.events.push(...parsed.batch);
      return json({ status: 1 });
    }

    throw new Error(`the db-backup function called an address the simulator does not know: ${method} ${input}`);
  };
}

/** Everything the run needs, pointing at the simulator. */
export function testConfig(pem: string, over: Partial<BackupConfig> = {}): BackupConfig {
  return {
    supabaseUrl: SUPABASE_URL,
    dbKey: TEST_SECRET_KEY,
    sheetId: SHEET_ID,
    googleServiceAccountJson: keyFileJson(pem),
    ...over,
  };
}

/** A clock that returns the given moments in turn (the last one repeats). */
export function clock(...iso: string[]): () => Date {
  let i = 0;
  return () => new Date(iso[Math.min(i++, iso.length - 1)]);
}

/** The tab as the spreadsheet holds it, as header + rows (trailing empty cells trimmed, as Google returns them). */
export function tabValues(world: World, title: string): string[][] {
  const tab = world.tabs.get(title);
  return (tab?.cells ?? []).map((row) => {
    const copy = [...row];
    while (copy.length && copy[copy.length - 1] === "") copy.pop();
    return copy;
  });
}

/** Fixture rows. EVERY personal field is obviously fake; tests search the Status tab and the event for these strings. */
export const FAKE = {
  name: "Fakey McFakeface",
  phone: "+910000000099",
  email: "fakey.mcfakeface@example.invalid",
  address: "99 Nowhere Lane, Faketown 000000",
  childAge: "ages four and a half",
} as const;

export const preorderRow = (id: number, over: DbRow = {}): DbRow => ({
  id,
  order_ref: `KH-TEST-${String(id).padStart(4, "0")}`,
  tier: "launch",
  amount_paise: 49900,
  status: "paid",
  parent_name: FAKE.name,
  phone: FAKE.phone,
  email: FAKE.email,
  child_age: FAKE.childAge,
  wa_consent: true,
  terms_accepted_at: "2026-11-20T08:00:00+00:00",
  address: { line1: FAKE.address, pin: "000000" },
  rzp_order_id: `order_fake${id}`,
  rzp_payment_id: null,
  balance_status: "due",
  utm: { utm_source: "test" },
  created_at: `2026-11-20T08:${String(10 + id).padStart(2, "0")}:00+00:00`,
  paid_at: null,
  updated_at: "2026-11-20T08:00:00+00:00",
  fb_attrib: { fbp: "fb.1.0.fake" },
  ph_distinct_id: "device-fake",
  ph_session_id: null,
  ...over,
});

export const tierRow = (id: string, over: DbRow = {}): DbRow => ({
  id,
  label: `Tier ${id}`,
  amount_paise: 29900,
  cap: 50,
  expires_on: null,
  active: true,
  created_at: "2026-11-01T00:00:00+00:00",
  ...over,
});

export const webhookRow = (id: string, over: DbRow = {}): DbRow => ({
  id,
  event_type: "payment.captured",
  order_ref: "KH-TEST-0001",
  received_at: `2026-11-20T09:00:0${id.length % 10}+00:00`,
  payload: { event: "payment.captured", amount: 49900 },
  ...over,
});

export const standardDb = (): Record<string, DbRow[]> => ({
  preorders: [preorderRow(1), preorderRow(2), preorderRow(3, { status: "created", paid_at: null })],
  event_tiers: [tierRow("launch"), tierRow("booth")],
  webhook_events: [webhookRow("evt_1"), webhookRow("evt_22")],
});
