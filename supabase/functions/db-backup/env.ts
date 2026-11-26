import { ENV_NAMES, TEST_SUPABASE_PROJECT_REFS } from "./config.ts";

/** Reads one environment variable by name (the platform's reader in the function, a stub in the tests). */
export type EnvReader = (name: string) => string | undefined;

/**
 * The server-side key Supabase injects: `SUPABASE_SECRET_KEYS` (a JSON object of named keys; `default` first) in the
 * current API-key system, else the legacy `SUPABASE_SERVICE_ROLE_KEY`. Returned for use, never logged or echoed.
 */
export function pickDatabaseKey(read: EnvReader): string | undefined {
  const raw = read("SUPABASE_SECRET_KEYS");
  if (raw) {
    try {
      const keys = JSON.parse(raw) as Record<string, unknown>;
      const named = keys.default ?? Object.values(keys)[0];
      if (typeof named === "string" && named !== "") return named;
    } catch {
      // fall back to the legacy variable below
    }
  }
  return read("SUPABASE_SERVICE_ROLE_KEY") || undefined;
}

/** The project id at the start of `https://<id>.supabase.co`, or undefined for any other address. */
export function projectRef(url: string | undefined): string | undefined {
  const match = /^https:\/\/([a-z0-9]{20})\.supabase\.co\/?$/.exec(url ?? "");
  return match?.[1];
}

/** "beta" when the function runs on the test store's project, so its PostHog event can be filtered out; nothing on
 *  production (the same rule the store's own server events follow). */
export function envStamp(url: string | undefined): "beta" | undefined {
  const ref = projectRef(url);
  return ref !== undefined && TEST_SUPABASE_PROJECT_REFS.includes(ref) ? "beta" : undefined;
}

export type BackupConfig = {
  supabaseUrl: string;
  dbKey: string;
  sheetId: string;
  googleServiceAccountJson: string;
  env?: "beta";
};

/** Everything the run needs, from the environment. A missing value stays an empty string: the run then reports a code
 *  (never the value) instead of failing before it can say so. */
export function readConfig(read: EnvReader): BackupConfig {
  return {
    supabaseUrl: read("SUPABASE_URL") ?? "",
    dbKey: pickDatabaseKey(read) ?? "",
    sheetId: read(ENV_NAMES.sheetId) ?? "",
    googleServiceAccountJson: read(ENV_NAMES.googleKey) ?? "",
    env: envStamp(read("SUPABASE_URL")),
  };
}
