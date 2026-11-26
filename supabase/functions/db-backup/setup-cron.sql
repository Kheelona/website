-- =====================================================================================================================
-- db-backup: the nightly schedule (D076, K-189).  Run by hand in the Supabase SQL editor. NOT a migration.
--
-- RUN THIS ONLY AFTER:
--   1. the Edge Function `db-backup` is deployed with JWT verification OFF,
--   2. its three Edge Function secrets are set (GOOGLE_SERVICE_ACCOUNT_JSON, BACKUP_SHEET_ID, BACKUP_CRON_SECRET), and
--   3. a first run by hand worked (see step 4 below).
-- Run it on the TEST project first, then on production. Run each numbered block on its own.
-- (26 Nov 2026: production was set up directly and the test round was skipped; see README.md, "As deployed".)
--
-- THIS FILE HOLDS NO SECRET AND MUST NEVER BE EDITED TO HOLD ONE. The two values the schedule needs go into Supabase Vault
-- through the dashboard's Vault screen (step 2), not through this editor: the SQL editor keeps a history of what you ran.
-- =====================================================================================================================

-- 1. Extensions (Dashboard > Database > Extensions does the same). Safe to run again.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

-- 2. Vault secrets. Create these two in the dashboard (Integrations > Vault > Secrets > Add new secret), NOT in this editor:
--      name  db_backup_url     value  https://<PROJECT-REF>.supabase.co/functions/v1/db-backup
--      name  db_backup_secret  value  <the same random string you saved as BACKUP_CRON_SECRET>
--    Paste each value with NO space or line break before or after it.
--    Then check both exist (this shows names only, never a value):
select name, created_at from vault.secrets where name in ('db_backup_url', 'db_backup_secret') order by name;
--    You should see exactly two rows.
--    Then check their lengths (this shows names and lengths only, never a value):
select name, length(decrypted_secret) from vault.decrypted_secrets where name in ('db_backup_url', 'db_backup_secret') order by name;
--    db_backup_url is 63 characters for any 20-character project ref; db_backup_secret is exactly as long as the string
--    you saved as BACKUP_CRON_SECRET. Any other length means a stray space or line break: on 26 Nov 2026 a URL pasted with
--    a leading space made step 4 fail with  invalid URL " https://..."  and would have stopped every nightly run.
--    The URL is not a secret, so it may be fixed here:
--      select vault.update_secret((select id from vault.secrets where name = 'db_backup_url'),
--                                 'https://<PROJECT-REF>.supabase.co/functions/v1/db-backup');
--    Fix db_backup_secret only in the Vault screen, never in this editor.

-- 3. Schedule it: every night at 20:30 UTC = 02:00 India time (IST is UTC+5:30). Safe to run again: it replaces the job.
select cron.schedule(
  'kheelona-db-backup',
  '30 20 * * *',
  $job$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'db_backup_url'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-backup-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'db_backup_secret')
    ),
    body := '{}'::jsonb,
    -- pg_net's default timeout is 2 seconds; the copy takes longer than that.
    timeout_milliseconds := 60000
  );
  $job$
);

-- 4. RUN IT NOW, by hand (use this for the first run, and before any risky change). It returns a request number.
select net.http_post(
  url := (select decrypted_secret from vault.decrypted_secrets where name = 'db_backup_url'),
  headers := jsonb_build_object(
    'Content-Type', 'application/json',
    'x-backup-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'db_backup_secret')
  ),
  body := '{}'::jsonb,
  timeout_milliseconds := 60000
);
--    Wait about 30 seconds, then read what the function answered (counts and codes only, no personal data):
select id, status_code, timed_out, left(content, 600) as answer, created
from net._http_response
order by created desc
limit 3;
--    status_code 200 and "result":"ok" means it worked. 401 = the secret in Vault differs from BACKUP_CRON_SECRET (or the
--    secret is missing); 500 = the run failed: the answer names the reason code. An error  invalid URL " https://..."
--    from the statement itself = db_backup_url has a stray space: see the length check in step 2.

-- 5. Check the schedule is listed, and read how the last runs went.
select jobid, jobname, schedule, active from cron.job where jobname = 'kheelona-db-backup';
select status, return_message, start_time
from cron.job_run_details
where jobid = (select jobid from cron.job where jobname = 'kheelona-db-backup')
order by start_time desc
limit 5;
--    "succeeded" here only means the request was SENT. Whether the copy worked is in the Status tab of the sheet.

-- ROLLBACK (stops the nightly copy; leaves the sheet and the function in place):
-- select cron.unschedule('kheelona-db-backup');
