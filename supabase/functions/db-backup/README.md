# db-backup: nightly copy of the store database into a Google Sheet (D076, K-189)

A Supabase Edge Function. Every night at 02:00 India time (and whenever it is run by hand) it copies **every column of every
row** of the store's three tables (`preorders`, `event_tiers`, `webhook_events`) into one Google Sheet, so that a lost
database can be put back by hand. The store's Supabase project is on the Free plan, which has no backups.

**The sheet holds parents' and children's data** (names, phones, emails, delivery addresses, a child's age): the founder
approved that on 26 Nov 2026. It must stay private: shared only with its owner and the one service account.

## As deployed (26 Nov 2026)

- **Live on production since 26 Nov 2026, 19:24 IST.** The founder deployed it from a fresh clone of `main` (merge
  `4ca1d1b5`, PR #57) with Supabase CLI 3.4.0, set the three Edge Function secrets, ran it once by hand from the dashboard
  (Edge Functions > db-backup > Test: POST with the `x-backup-secret` header; OK in 6 s, every row of the three tables
  copied, 0 cut cells, `db_backup_completed` in PostHog with no `env`, i.e. production), added the two Vault secrets in the
  Vault screen and ran `setup-cron.sql` blocks 1 to 4. The cron job `kheelona-db-backup` runs `30 20 * * *` (02:00 IST).
- **The test round and the restore drill were skipped** (the founder's choice, an accepted risk). The test project has no
  copy of the function, and **no restore from the sheet has been tried**: the restore runbook (in PR #57's description) is
  unproven until a drill on the test project matches row for row.
- **Deploy and redeploy (CLI v3).** From the repo root of a clone of `main`:

  ```sh
  npx supabase@latest login            # on macOS, answer the Keychain prompt with "Always Allow"
  npx supabase@latest projects list    # find the project's 20-character reference id
  npx supabase@latest functions deploy db-backup --remote=<project-ref> --no-verify-jwt --use-api
  npx supabase@latest logout
  ```

  No `link` step and no `supabase/config.toml` are needed: `--remote` names the project (older guides say
  `link --project-ref`), and `--use-api` bundles on Supabase's side, so Docker is not needed.
- **Check JWT verification is off after every deploy:** a request without the secret,
  `curl -s -X POST https://<project-ref>.supabase.co/functions/v1/db-backup`, must answer `{"error":"unauthorised"}` (the
  function's own 401; no work is done). Any other 401 comes from Supabase's gateway, which means JWT verification is on:
  switch it off on the function's Details tab.
- **Vault values must have no space or line break before or after them.** On 26 Nov `db_backup_url` was pasted with a
  leading space, and block 4 failed with `invalid URL " https://…"`. Every nightly run would have failed the same way
  before reaching the function: no `Status` line and no PostHog event, so only a missing `db_backup_completed` would have
  shown it. `setup-cron.sql` block 2 now has a length check (names and lengths only, never a value):

  ```sql
  select name, length(decrypted_secret) from vault.decrypted_secrets where name in ('db_backup_url','db_backup_secret');
  ```

  `db_backup_url` is 63 characters for any 20-character project ref; `db_backup_secret` must be exactly as long as the
  string saved as `BACKUP_CRON_SECRET`. The URL is not a secret, so it may be fixed in the SQL editor:
  `select vault.update_secret((select id from vault.secrets where name = 'db_backup_url'), 'https://<project-ref>.supabase.co/functions/v1/db-backup');`.
  Fix `db_backup_secret` only in the Vault screen, never in the SQL editor (it keeps a history of what was run).
- **Stop it:** `select cron.unschedule('kheelona-db-backup');` in the SQL editor. The function and the sheet stay; run
  `setup-cron.sql` block 3 again to restart. To remove everything, see [Rollback](#rollback).
- The project's reference id and the sheet's id are not written in this public repo; they are in the founder's Supabase
  dashboard and Google Drive.

## What it does, and what it never does

- Reads the three tables by GET only (`db.ts`). It cannot insert, update, delete or call a database function.
- Writes one Google Sheet, tabs `Status`, `preorders`, `event_tiers`, `webhook_events`. Row 1 of a table tab is the database
  column names, so the tab can be exported to CSV and imported back (see the restore runbook in PR #57's description;
  not yet proven by a drill). Two extra columns
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
secret header instead. Deploy with `npx supabase@latest functions deploy db-backup --remote=<project-ref> --no-verify-jwt --use-api`
(Supabase CLI v3; see [As deployed](#as-deployed-26-nov-2026)) and check after every deploy that a request without the
header gets the function's own `{"error":"unauthorised"}`, or look at the toggle on the function's Details tab. Without
the header, every request gets 401 and no work is done.

## If a run says FAILED

The reason is a short code, the same in `Status`, in the function's answer and in the PostHog event.

| Code | Meaning | What to do |
|---|---|---|
| `google_key_missing`, `google_key_invalid` | `GOOGLE_SERVICE_ACCOUNT_JSON` is missing or not the whole key file | paste the whole `.json` key file again as the secret |
| `config_missing_sheet_id` | `BACKUP_SHEET_ID` is not set | set it |
| `google_token_http_400` (or another status) | Google refused the key (deleted key, or the service account was removed) | make a new key for the service account |
| `sheets_meta_http_403`, `sheets_meta_http_404` | the sheet is not shared with the service account, or the id is wrong | share the sheet with it as Editor; check the id |
| `db_http_401`, `db_config_missing` | the function could not read the database | check the project's server key (Supabase supplies it) |
| `db_zero_rows_sheet_has_rows` | a table returned no rows while its tab holds rows: nothing was written over the copy | **do not delete the sheet's rows**: data may have been lost (restore), or the table was emptied on purpose (below) |
| `sheet_header_invalid` | row 1 of a tab was changed | put the column names back from File > Version history |
| `sheets_…_http_…`, `…_network`, `status_…` | Google refused or did not answer | the next night retries; look again if it repeats |
| HTTP 401 from the function | the secret sent differs from `BACKUP_CRON_SECRET`, or JWT verification is on | check the Vault secret and the toggle |

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
