# db-backup: nightly copy of the store database into a Google Sheet (D076, K-189)

A Supabase Edge Function. Every night at 02:00 India time (and whenever it is run by hand) it copies **every column of every
row** of the store's three tables (`preorders`, `event_tiers`, `webhook_events`) into one Google Sheet, so that a lost
database can be put back by hand. The store's Supabase project is on the Free plan, which has no backups.

**The sheet holds parents' and children's data** (names, phones, emails, delivery addresses, a child's age): the founder
approved that on 26 Nov 2026. It must stay private: shared only with its owner and the one service account.

## What it does, and what it never does

- Reads the three tables by GET only (`db.ts`). It cannot insert, update, delete or call a database function.
- Writes one Google Sheet, tabs `Status`, `preorders`, `event_tiers`, `webhook_events`. Row 1 of a table tab is the database
  column names, so the tab can be exported to CSV and imported back (see the restore runbook in the PR). Two extra columns
  at the end: `in_database` ("yes", or "no, since <date>") and `last_copied` (IST).
- **Never deletes a sheet row.** A row the database loses stays, marked "no, since <date>". Changed values are overwritten;
  Google's version history (File > Version history) keeps earlier versions of the whole sheet.
- **Safety rule:** if reading a table fails, or returns 0 rows while its tab holds rows, that tab is not written at all:
  `Status` says FAILED and why. The other tables still copy.
- A value over Google's 50,000-character cell limit is cut to fit, ends in `[TRUNCATED: n of m characters kept]`, and is
  counted in `Status` (the run reads "OK (truncated)").
- Values are written `RAW`: text that starts with `=`, `+` or `-` stays text and never becomes a formula.
- Sends one PostHog event, `db_backup_completed` (result, row counts, duration, failure codes; no personal data), so a
  missing or failed night shows up in the daily pulse without anyone opening the sheet.
- `Status` and the PostHog event hold **no personal data**: table names, counts, times, result words, reason codes.
  A reason is a code such as `db_http_401` or `sheets_write_http_403`: never a response body, a key, a URL or a value.

## Files

| File | What it is |
|---|---|
| `index.ts` | The only Deno-specific file: `Deno.serve`, the secret check, `EdgeRuntime.waitUntil`. |
| `backup.ts` | One run: token, tabs, per-table copy, Status, PostHog event. `fetch`, the clock and the config are injected. |
| `db.ts` | The only reader of the database (GET only, paged, ordered by `id`). |
| `merge.ts` | The union of a tab and the database (never drops a row). |
| `status.ts`, `cells.ts`, `ist.ts` | The Status tab, cell text and the 50,000-character cut, India time. |
| `google.ts`, `sheets.ts` | Service-account sign-in (RS256 JWT by WebCrypto) and the few Sheets API calls. |
| `posthog.ts`, `auth.ts`, `env.ts`, `http.ts`, `config.ts`, `errors.ts` | The event, the secret check, config reading, retries and time limits, constants, error codes. |
| `setup-cron.sql` | The nightly schedule (pg_cron + pg_net + Vault). Run by hand, after the function is deployed. NOT a migration. |

No npm or Deno-registry dependency: only web-standard code (`fetch`, WebCrypto), so the same files run in Deno (deployed)
and Node (the tests in `test/db-backup/`).

## Secrets (names only: the values are set by the founder in the Supabase dashboard and never leave it)

| Where | Name | What |
|---|---|---|
| Edge Function secret | `GOOGLE_SERVICE_ACCOUNT_JSON` | The whole JSON key file of the Google service account |
| Edge Function secret | `BACKUP_SHEET_ID` | The sheet's id (the test sheet on the test project; SupabaseDBBackup on production) |
| Edge Function secret | `BACKUP_CRON_SECRET` | A long random string; the caller must send it as `x-backup-secret` |
| Vault secret | `db_backup_url` | `https://<project ref>.supabase.co/functions/v1/db-backup` |
| Vault secret | `db_backup_secret` | The same random string as `BACKUP_CRON_SECRET` |

Supabase supplies `SUPABASE_URL` and the server key itself (`SUPABASE_SECRET_KEYS`, else `SUPABASE_SERVICE_ROLE_KEY`). The
function reads the key from its own environment; it never leaves Supabase.

## Deploy

JWT verification must be OFF for this function (the scheduler cannot send a user token), because the function checks its own
secret header instead. Deploy with `supabase functions deploy db-backup --no-verify-jwt` and check the toggle on the
function's Details tab after every deploy. Without the header, every request gets 401 and no work is done.

## Limits (Supabase Free, checked 26 Nov 2026)

150 s wall clock, 2 s CPU per request (waiting on the network is not CPU), 256 MB memory. A run with a few thousand rows
takes seconds. Every outgoing request has a 25 s limit; a rate limit or 5xx is retried twice. pg_net's own default
timeout is 2 s, so the schedule sets 60 s, and the copy runs inside `EdgeRuntime.waitUntil` so a caller that hangs up does
not stop it.

## If a table was emptied on purpose

By design a table that returns 0 rows while its tab still has rows is reported FAILED every night and the tab is left alone.
If you really emptied a table, delete that tab's data rows (keep row 1) by hand; the next night it is OK again.

## Rollback

`select cron.unschedule('kheelona-db-backup');`, delete the function, delete its three secrets and the two Vault secrets.
The sheet stays as a copy; the function never writes to the database.
