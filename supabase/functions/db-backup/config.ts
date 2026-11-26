/** Constants of the nightly store-database copy (D076, K-189). No secret value ever lives in this folder: secrets are
 *  read by NAME from the Edge Function's environment (see README.md). */

/** The three tables copied, in the order they are copied (orders first: they are the ones that cannot be remade).
 *  Every column of each is copied. `appendOrder` only orders NEW rows when they are appended to a tab. */
export const TABLES = [
  { name: "preorders", appendOrder: "created_at" },
  { name: "event_tiers", appendOrder: "created_at" },
  { name: "webhook_events", appendOrder: "received_at" },
] as const;
export type TableName = (typeof TABLES)[number]["name"];

/** The key every table is matched by (migrations 0001: `preorders.id` bigint, `webhook_events.id` and
 *  `event_tiers.id` text). */
export const KEY_COLUMN = "id";

/** Sheet tab names, in tab order. */
export const STATUS_TAB = "Status";
export const TAB_ORDER: readonly string[] = [STATUS_TAB, ...TABLES.map((t) => t.name)];

/** The two columns added at the end of every table tab. */
export const IN_DATABASE_COLUMN = "in_database";
export const LAST_COPIED_COLUMN = "last_copied";

/** Google Sheets' limit for one cell, in characters. A longer value is cut to fit, marked, and reported. */
export const MAX_CELL_CHARS = 50_000;
/** The run log keeps the last N runs, newest first. */
export const RUN_LOG_LIMIT = 60;
/** The row count at which the plan is revisited (Supabase Pro or a move), shown on the Status tab. */
export const ORDERS_REVISIT_AT = 1_000;

/** Rows asked for per database page. The loop follows what the server returns, so a lower server cap is harmless. */
export const DB_PAGE_SIZE = 500;
/** One Sheets write stays under about this many characters (Google recommends 2 MB per request). */
export const SHEET_WRITE_CHUNK_CHARS = 1_500_000;
/** Every outgoing request gives up after this long, so one hung call ends as FAILED instead of at the platform's kill. */
export const REQUEST_TIMEOUT_MS = 25_000;

/** Google. The scope is the one the Sheets API needs; the audience and the token address are Google's documented ones,
 *  fixed here (never taken from the key file, so a changed secret cannot send the signed assertion elsewhere). */
export const GOOGLE_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

/** PostHog: the project key and ingestion host the store's server events use (src/config/site.ts); a public client-side
 *  identifier, not a secret. test/db-backup/constants.test.ts fails if these drift from site.ts. */
export const POSTHOG_KEY = "phc_ute69SyrVALLjx3bW8xUNVqiALe7RRNbJp9KuZDd9726";
export const POSTHOG_API_HOST = "https://us.i.posthog.com";
export const POSTHOG_EVENT = "db_backup_completed";
/** One fixed id for every run: the event is about the system, never a person. */
export const POSTHOG_DISTINCT_ID = "kh-db-backup";
export const POSTHOG_LIB = "kh-db-backup";

/** The test store's Supabase project ids (src/config/test-store.ts). A run on one of them stamps `env: "beta"`. */
export const TEST_SUPABASE_PROJECT_REFS: readonly string[] = ["yiihxztphkuhxadmfrdb"];

/** The Edge Function secret and header that guard the endpoint, and the other secret names, by NAME only. */
export const SECRET_HEADER = "x-backup-secret";
export const ENV_NAMES = {
  cronSecret: "BACKUP_CRON_SECRET",
  sheetId: "BACKUP_SHEET_ID",
  googleKey: "GOOGLE_SERVICE_ACCOUNT_JSON",
} as const;
