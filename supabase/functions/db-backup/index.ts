/**
 * Edge Function `db-backup` (D076, K-189): the nightly copy of the store's three tables into a Google Sheet.
 *
 * This is the only Deno-specific file. Everything it calls is web-standard code that the tests run under Node.
 * Deployed with Supabase's JWT check OFF (the scheduler cannot send a user token), so the secret header below is the gate.
 * See README.md for the secrets (by name) and setup-cron.sql for the nightly schedule.
 */
import { isAuthorised } from "./auth.ts";
import { runBackup } from "./backup.ts";
import { ENV_NAMES, SECRET_HEADER } from "./config.ts";
import { readConfig } from "./env.ts";

// The two globals the Supabase runtime provides, declared so this file type-checks under the repo's Node types.
declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): unknown;
};
declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void } | undefined;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

Deno.serve(async (request) => {
  const secret = Deno.env.get(ENV_NAMES.cronSecret);
  if (!secret) console.error(`[db-backup] ${ENV_NAMES.cronSecret} is not set: every request is refused`);
  if (!(await isAuthorised(request.headers.get(SECRET_HEADER), secret, crypto.subtle))) {
    return json({ error: "unauthorised" }, 401);
  }
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const run = runBackup({
    fetch: (input, init) => fetch(input, init),
    now: () => new Date(),
    subtle: crypto.subtle,
    uuid: () => crypto.randomUUID(),
    config: readConfig((name) => Deno.env.get(name)),
  });
  // Keep the worker alive until the copy is done even if the caller (pg_net) hangs up first.
  if (typeof EdgeRuntime !== "undefined") EdgeRuntime.waitUntil(run);
  const outcome = await run;

  // Counts and codes only: nothing in this line or in the response is a row, a key or a value.
  console.log(
    `[db-backup] result=${outcome.result} duration_ms=${outcome.durationMs} event=${outcome.event}` +
      (outcome.failedReason ? ` failed_reason=${outcome.failedReason}` : "") +
      Object.entries(outcome.tables)
        .map(([name, t]) => ` ${name}=${t.status}:${t.dbRows ?? "-"}${t.failedReason ? `:${t.failedReason}` : ""}`)
        .join(""),
  );
  return json(
    {
      result: outcome.result,
      started_at_ist: outcome.startedAtIst,
      duration_ms: outcome.durationMs,
      failed_reason: outcome.failedReason ?? null,
      posthog_event: outcome.event,
      tables: outcome.tables,
    },
    outcome.result === "failed" ? 500 : 200,
  );
});
