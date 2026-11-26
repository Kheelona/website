import { webcrypto } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { isAuthorised } from "../../supabase/functions/db-backup/auth";
import { GOOGLE_SCOPE, GOOGLE_TOKEN_URL } from "../../supabase/functions/db-backup/config";
import { envStamp, pickDatabaseKey, projectRef, readConfig } from "../../supabase/functions/db-backup/env";
import { BackupError } from "../../supabase/functions/db-backup/errors";
import { fetchAccessToken, parseServiceAccount, signAssertion } from "../../supabase/functions/db-backup/google";
import { ACCESS_TOKEN, SERVICE_ACCOUNT_EMAIL, keyFileJson, makeFetch, makeTestKey, newWorld, type World } from "./support";

const subtle = webcrypto.subtle as SubtleCrypto;

describe("auth: only the caller that knows BACKUP_CRON_SECRET gets in", () => {
  const SECRET = "fake-long-random-secret-for-tests";
  it("accepts the right secret", async () => {
    expect(await isAuthorised(SECRET, SECRET, subtle)).toBe(true);
  });
  it("refuses a missing, empty, wrong, shorter, longer or prefix-only secret", async () => {
    for (const received of [null, "", "wrong", SECRET.slice(0, -1), `${SECRET}x`, SECRET.toUpperCase(), ` ${SECRET}`]) {
      expect(await isAuthorised(received, SECRET, subtle), String(received)).toBe(false);
    }
  });
  it("admits nobody when the secret is not configured (unset or empty), even a caller that sends nothing or an empty value", async () => {
    for (const expected of [undefined, ""]) {
      for (const received of [null, "", "anything"]) expect(await isAuthorised(received, expected, subtle)).toBe(false);
    }
  });
  it("compares fixed-size digests of both sides, with no early exit on the first difference", async () => {
    const source = (await import("node:fs")).readFileSync("supabase/functions/db-backup/auth.ts", "utf8");
    expect(source).toContain("SHA-256");
    expect(source).toMatch(/difference \|= a\[i\] \^ b\[i\]/);
    expect(source).not.toMatch(/received\s*===\s*expected|expected\s*===\s*received/);
  });
});

describe("google: the service account's key file", () => {
  let key: Awaited<ReturnType<typeof makeTestKey>>;
  let world: World;
  beforeAll(async () => {
    key = await makeTestKey();
  });

  it("reads the email and the PKCS#8 key from the JSON", () => {
    expect(parseServiceAccount(keyFileJson(key.pem))).toEqual({ email: SERVICE_ACCOUNT_EMAIL, privateKey: key.pem });
  });

  it("reports a code only, never the text, for a missing or broken key", () => {
    const codes = [undefined, "", "not json", "{}", JSON.stringify({ client_email: "a@b", private_key: "SECRET-LOOKING-VALUE-xyz" }), JSON.stringify({ client_email: 5, private_key: key.pem })].map((value) => {
      try {
        parseServiceAccount(value);
        return "no error";
      } catch (error) {
        expect(error).toBeInstanceOf(BackupError);
        expect((error as Error).message).not.toContain("SECRET-LOOKING-VALUE");
        return (error as BackupError).code;
      }
    });
    expect(codes).toEqual(["google_key_missing", "google_key_missing", "google_key_invalid", "google_key_invalid", "google_key_invalid", "google_key_invalid"]);
  });

  it("signs an RS256 assertion whose claims name the service account, the Sheets scope only, Google's token address and a one-hour life", async () => {
    const account = parseServiceAccount(keyFileJson(key.pem));
    const jwt = await signAssertion(account, 1_700_000_000, subtle);
    const [h, c, s] = jwt.split(".");
    expect(JSON.parse(Buffer.from(h, "base64url").toString())).toEqual({ alg: "RS256", typ: "JWT" });
    expect(JSON.parse(Buffer.from(c, "base64url").toString())).toEqual({
      iss: SERVICE_ACCOUNT_EMAIL,
      scope: GOOGLE_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      iat: 1_700_000_000,
      exp: 1_700_003_600,
    });
    expect(GOOGLE_SCOPE).toBe("https://www.googleapis.com/auth/spreadsheets");
    const ok = await subtle.verify("RSASSA-PKCS1-v1_5", key.publicKey, Buffer.from(s, "base64url") as BufferSource, new TextEncoder().encode(`${h}.${c}`) as BufferSource);
    expect(ok).toBe(true);
    expect(jwt).not.toContain("PRIVATE KEY");
  });

  it("exchanges it at Google's token address by the JWT-bearer grant, and ignores the key file's own token_uri", async () => {
    world = newWorld();
    world.publicKey = key.publicKey;
    const token = await fetchAccessToken(makeFetch(world), parseServiceAccount(keyFileJson(key.pem)), 1_700_000_000, subtle);
    expect(token).toBe(ACCESS_TOKEN);
    expect(world.calls).toHaveLength(1);
    expect(world.calls[0].url).toBe(GOOGLE_TOKEN_URL);
    expect(world.calls[0].method).toBe("POST");
    expect(world.calls[0].headers["content-type"]).toBe("application/x-www-form-urlencoded");
    expect(world.assertions[0].signatureValid).toBe(true);
  });

  it("a refused token request is a status code, nothing else", async () => {
    world = newWorld();
    world.publicKey = key.publicKey;
    world.fail.push({ match: "oauth2.googleapis.com", status: 400 });
    await expect(fetchAccessToken(makeFetch(world), parseServiceAccount(keyFileJson(key.pem)), 1, subtle)).rejects.toMatchObject({ code: "google_token_http_400" });
    world.fail = [];
    world.throwOn.push("oauth2.googleapis.com");
    await expect(fetchAccessToken(makeFetch(world), parseServiceAccount(keyFileJson(key.pem)), 1, subtle)).rejects.toMatchObject({ code: "google_token_network" });
  });
});

describe("env: keys and project, read by name", () => {
  const reader = (vars: Record<string, string>) => (name: string) => vars[name];

  it("prefers the new SUPABASE_SECRET_KEYS (the 'default' key), then any key in it, then the legacy variable", () => {
    expect(pickDatabaseKey(reader({ SUPABASE_SECRET_KEYS: JSON.stringify({ default: "sb_secret_a", other: "sb_secret_b" }), SUPABASE_SERVICE_ROLE_KEY: "legacy" }))).toBe("sb_secret_a");
    expect(pickDatabaseKey(reader({ SUPABASE_SECRET_KEYS: JSON.stringify({ only: "sb_secret_c" }) }))).toBe("sb_secret_c");
    expect(pickDatabaseKey(reader({ SUPABASE_SERVICE_ROLE_KEY: "legacy" }))).toBe("legacy");
    expect(pickDatabaseKey(reader({ SUPABASE_SECRET_KEYS: "not json", SUPABASE_SERVICE_ROLE_KEY: "legacy" }))).toBe("legacy");
    expect(pickDatabaseKey(reader({ SUPABASE_SECRET_KEYS: "{}" }))).toBeUndefined();
    expect(pickDatabaseKey(reader({}))).toBeUndefined();
  });

  it("finds the project id in the address, and nothing in any other address", () => {
    expect(projectRef("https://yiihxztphkuhxadmfrdb.supabase.co")).toBe("yiihxztphkuhxadmfrdb");
    expect(projectRef("https://yiihxztphkuhxadmfrdb.supabase.co/")).toBe("yiihxztphkuhxadmfrdb");
    for (const other of [undefined, "", "http://127.0.0.1:54321", "https://evil.example/yiihxztphkuhxadmfrdb.supabase.co", "https://short.supabase.co"]) {
      expect(projectRef(other)).toBeUndefined();
    }
  });

  it("stamps env beta on the test project and nothing on production", () => {
    expect(envStamp("https://yiihxztphkuhxadmfrdb.supabase.co")).toBe("beta");
    expect(envStamp("https://abcdefghijklmnopqrst.supabase.co")).toBeUndefined();
    expect(envStamp(undefined)).toBeUndefined();
  });

  it("reads the whole configuration; a missing value is '' (the run then reports a code)", () => {
    expect(readConfig(reader({ SUPABASE_URL: "https://abcdefghijklmnopqrst.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "k", BACKUP_SHEET_ID: "s", GOOGLE_SERVICE_ACCOUNT_JSON: "{}" }))).toEqual({
      supabaseUrl: "https://abcdefghijklmnopqrst.supabase.co",
      dbKey: "k",
      sheetId: "s",
      googleServiceAccountJson: "{}",
      env: undefined,
    });
    expect(readConfig(reader({}))).toEqual({ supabaseUrl: "", dbKey: "", sheetId: "", googleServiceAccountJson: "", env: undefined });
  });
});
