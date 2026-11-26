---
title: "D076: a nightly copy of the store database into a private Google Sheet (Supabase Edge Function)"
type: decision
updated: 2026-11-26
sources: ["the founder's approval in chat, 2026-11-26 (explicit sign-off, including that the sheet holds parents' and children's data)", "growth-team decision 2026-11-26-store-db-stay-free-daily-sheet-backup", "supabase/functions/db-backup/ (README.md, setup-cron.sql)", "supabase/migrations/0001_preorders.sql to 0005_ph_session_id.sql (the three tables)", "src/lib/tracking/events.ts", "../site/tracking-inventory.md", "D074-refund-event.md (the precedent for an added server event)", "../../supabase/README.md"]
---

# D076: a nightly copy of the store database into a private Google Sheet (Supabase Edge Function)

**Context.** The store's Supabase project is on the Free plan, which includes no backups, and it holds every order and every
delivery address (the addresses exist nowhere else). A lost or corrupted database could not be recovered. On 26 November 2026
the founder chose to stay on the Free plan for now and to keep a daily copy in a Google Sheet, and to revisit Supabase Pro or
a move once orders pass 1,000 rows. Of three ways to do it, the founder picked a Supabase Edge Function run by Supabase Cron:
it runs next to the data, so the Supabase key that can read everything never leaves Supabase, and the only new secret is a
Google key that can open one sheet.

**Choice.**

| | |
|---|---|
| What | the Edge Function `db-backup` (`supabase/functions/db-backup/`) copies **every column of every row** of `preorders`, `event_tiers` and `webhook_events` into one Google Sheet, tabs `Status`, `preorders`, `event_tiers`, `webhook_events` |
| When | every night at 02:00 India time (20:30 UTC), by pg_cron + pg_net with the address and a shared secret read from Supabase Vault; and by hand ("run now") before any risky change |
| Data in the sheet | **parents' and children's data**: names, phones, emails, delivery addresses, a child's age, Meta and PostHog ids, and the webhook payloads. The founder approved this explicitly on 26 November 2026 ("it's a private sheet, only I have access to"). The sheet stays private: shared only with its owner and the one Google service account, never "anyone with the link" |
| Not in the sheet's `Status` tab or in PostHog | any personal data: `Status` holds table names, row counts, times, result words and reason codes; the PostHog event holds the same kind of numbers and codes |
| Read-only | the function can only read the three tables (GET through the project's REST API); it never writes to the database |
| Never deletes | a row the database loses stays in the sheet, marked `no, since <date>`; changed values are overwritten (Google's version history keeps earlier versions of the whole sheet) |
| Safety rule | if a table's read fails, or returns 0 rows while its tab holds rows, that tab is not written; `Status` says FAILED and why; the other tables still copy |
| Long values | a cell over Google's 50,000-character limit is cut to fit with a visible marker, counted in `Status`, and the run reads "OK (truncated)" |
| Google access | a service account in the company Google Cloud project, Sheets API only, no roles; its JSON key goes only into an Edge Function secret, pasted by the founder. It never goes into the repo, the workspace, chat or GitHub |
| Who can call it | the function is deployed with Supabase's JWT check off (the scheduler cannot send a user token) and checks its own secret header, `x-backup-secret`, against the Edge Function secret `BACKUP_CRON_SECRET`; anything else gets 401 and no work is done |
| Noticing a failure | each run sends one PostHog server event, `db_backup_completed` (result, row counts per table, duration, failure codes; no personal data). The daily pulse checks it; a missing or failed night is urgent; it also flags orders past 900 rows |

**The new PostHog event.** `db_backup_completed` is an **added** server event (the D074 pattern): sent by the function's own
code to the same PostHog project as `purchase_confirmed`, anonymous (one fixed distinct id, `$process_person_profile: false`,
`$geoip_disable: true`), with `env: "beta"` only when the function runs on the test store's project. It is registered in
`src/lib/tracking/events.ts` (`decision: "D076"`), tracking inventory §7 says so, and the tracking-registry guard has its own
section for it. Nothing about any existing event changes, and nothing goes to Meta, GA4 or OpenAI.

**Not built here, and why.** No Supabase Pro, no migration of the database, no fix for the dashboard's "Unhealthy" flag or the
Sydney slowness (separate, K-189). No website change: the website's output is byte-identical to `main`. The sheet is a
read-only copy; an edit made in it is overwritten the next night.

**How the repo changes.** One new folder, `supabase/functions/db-backup/` (the function, its README and `setup-cron.sql`),
and tests in `test/db-backup/`. `supabase/migrations/` stays frozen: the cron wiring is a hand-applied SQL file next to the
function, not a migration, and it holds placeholders only. No new dependency: the function uses only web-standard code
(`fetch` and WebCrypto) and no npm or Deno-registry import. `tsconfig.json` gains `allowImportingTsExtensions` because Deno
requires `.ts` in relative imports; nothing is emitted.

**Setup is by hand, test project first.** The founder creates the service account and the test sheet, deploys the function to
the test project, sets the secrets, runs it, checks the tabs, `Status` and the PostHog event, then does a restore drill (a
CSV of the `preorders` tab imported into an empty copy of the table, row counts compared) before the same steps on
production with the SupabaseDBBackup sheet. A backup is not real until a restore has worked. The step-by-step guide and the
restore runbook are in the pull request.

**Privacy.** Google now also holds parents' details and a child's age in a private sheet. Whether `/privacy` should mention
Google Workspace as a place order data is kept goes to the 30 November legal review (K-168; DPDP, K-18). The backup is not
blocked on it, and no page text changes here.

**Rollback.** `select cron.unschedule('kheelona-db-backup');`, delete the function and its secrets, revert the merge commit.
The sheet stays as a copy; the function never writes to the database.
