import { DB_PAGE_SIZE, KEY_COLUMN, type TableName } from "./config.ts";
import { BackupError } from "./errors.ts";
import type { FetchLike } from "./http.ts";
import type { DbRow } from "./merge.ts";

export type DbConfig = {
  /** The project's address, `https://<ref>.supabase.co`. */
  url: string;
  /** The server-side key Supabase injects into the function; it never leaves the function. */
  key: string;
};

/** The headers PostgREST needs. A new-format secret key (`sb_secret_…`) is not a JWT and goes on `apikey` ONLY; a legacy
 *  service-role JWT goes on both, as supabase-js sends it (Supabase API-keys docs, 26 Nov 2026). */
export function dbHeaders(key: string): Record<string, string> {
  return key.startsWith("sb_") ? { apikey: key, accept: "application/json" } : { apikey: key, authorization: `Bearer ${key}`, accept: "application/json" };
}

/**
 * Every row of one table, every column, by the project's REST API.
 *
 * READ-ONLY, and this is the only place the function talks to the database: each request is a GET of
 * `/rest/v1/<table>?select=*`. It cannot insert, update, delete or call a function. Pages are ordered by `id` (unique) and
 * followed by what the server RETURNS, so a server-side row cap smaller than the page size cannot end the read early; it
 * ends on an empty page.
 */
export async function readTable(http: FetchLike, config: DbConfig, table: TableName): Promise<DbRow[]> {
  const base = config.url.replace(/\/+$/, "");
  const rows: DbRow[] = [];
  for (let page = 0; page < 5_000; page++) {
    const url = `${base}/rest/v1/${table}?select=*&order=${KEY_COLUMN}.asc&limit=${DB_PAGE_SIZE}&offset=${rows.length}`;
    let response: Response;
    try {
      response = await http(url, { method: "GET", headers: dbHeaders(config.key) });
    } catch {
      throw new BackupError("db_network");
    }
    if (!response.ok) throw new BackupError(`db_http_${response.status}`);
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new BackupError("db_bad_response");
    }
    if (!Array.isArray(body)) throw new BackupError("db_bad_response");
    if (body.length === 0) return rows;
    for (const row of body) {
      if (row === null || typeof row !== "object" || Array.isArray(row)) throw new BackupError("db_bad_response");
      rows.push(row as DbRow);
    }
  }
  throw new BackupError("db_too_many_pages");
}
