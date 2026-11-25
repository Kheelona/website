/** Server-only configuration for the pre-order store (§8.25).
 *
 *  Every value here is a real secret and none may ever be given a
 *  `NEXT_PUBLIC_` name, which is the opposite of how this repo treats its other
 *  identifiers: the GA4 measurement id, the Ahrefs site key and the Tally form
 *  URL were all hardcoded in `config/site.ts` precisely because they are public.
 *  A payment key is not, and `test/store-secrets.test.ts` guards the distinction
 *  so the wrong lesson cannot be learned from those three.
 *
 *  READINESS, not crashing. The store must be deployable before the founder has
 *  filled the dashboards in: with keys missing the store page renders an honest
 *  "opening shortly" state and the API routes answer 503, rather than a build
 *  failing or a parent meeting a stack trace. */

import { SITE_ENV } from "@/config/env";
import { TEST_SUPABASE_PROJECT_REFS } from "@/config/test-store";

export type StoreEnv = {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;
  supabaseUrl: string;
  supabaseServiceKey: string;
  /** One secret, two uses, separated by a label inside the HMAC (see signing.ts).
   *  Separate keys would mean two more values for the founder to paste and lose. */
  signingSecret: string;
  /** Optional: where the internal "new order" alert goes. */
  alertEmail: string;
  /** Optional: without it the acknowledgement email is skipped and logged, and
   *  the order is still recorded. Losing an email must never lose an order. */
  resendApiKey: string | null;
  emailFrom: string;
  /** Optional: the Meta Conversions API token (§8.30-l). Without it the
   *  server-side Purchase is skipped and the browser pixel carries on alone,
   *  which is exactly the state the store shipped in. A REAL SECRET, so it may
   *  never take a `NEXT_PUBLIC_` name — unlike the pixel ID itself, which is
   *  public and hardcoded in config/site.ts. */
  metaCapiToken: string | null;
  /** Optional, development only: Meta's Test Events code. Set it locally to
   *  watch server events arrive in Events Manager; it must never be set in
   *  production, where it would divert real conversions into the test stream. */
  metaCapiTestCode: string | null;
};

/** A value counts as missing if it is absent, empty, or still a placeholder.
 *  The DUMMY convention comes from this repo's `.env.example`, and V4 taught
 *  that a placeholder which passes a truthiness check is worse than no value:
 *  the Tally form silently rendered a placeholder card in production. */
function real(value: string | undefined): string | null {
  if (!value) return null;
  const v = value.trim();
  if (!v || v.includes("DUMMY") || v.startsWith("<")) return null;
  return v;
}

/** D071 (K-182): the Razorpay mode and the Supabase project must fit the build. Supersedes D051, which blanked every
 *  value on beta. The test store (the `beta` build) takes Test Mode payments and writes to its own test database, and
 *  nothing else may touch either:
 *    - production:         `rzp_live_` keys only, and never a project on TEST_SUPABASE_PROJECT_REFS;
 *    - beta (test store):  `rzp_test_` keys only, and, once that list is not empty, only a project on it;
 *    - preview, development: anything but `rzp_live_` (a local `rzp_placeholder` keeps working), no Supabase rule.
 *  A refused value reads as absent: `storeEnv()` is null, `missingStoreEnv()` names it, the store shows "opening
 *  shortly" and the routes answer 503. Never a throw, so a wrong key can never crash a page. One log line names the
 *  rule and the mode, never a value. */
const said = new Set<string>();

function refuse(reason: string): null {
  /* A server asks on every request: say it once per process, not once per call. */
  if (!said.has(reason)) {
    said.add(reason);
    console.error(reason);
  }
  return null;
}

/** The id at the start of a `https://<id>.supabase.co` URL, lower-cased; null for any other host or a value that is
 *  not a URL. */
function supabaseProjectId(url: string): string | null {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const id = host.endsWith(".supabase.co") ? host.slice(0, -".supabase.co".length) : "";
    return id && !id.includes(".") ? id : null;
  } catch {
    return null;
  }
}

/** The value for `name` if this build accepts it, else null (and one line said why). Only `RAZORPAY_KEY_ID` and
 *  `SUPABASE_URL` have a rule; every other name is `real()` and nothing more. */
function accepted(name: string, value: string | undefined): string | null {
  const v = real(value);
  if (v === null) return null;

  if (name === "RAZORPAY_KEY_ID") {
    const live = v.startsWith("rzp_live_");
    const test = v.startsWith("rzp_test_");
    if (SITE_ENV === "production") {
      return live ? v : refuse(`RAZORPAY_KEY_ID is ${test ? "a test key" : "not a live key"}, which a production build refuses`);
    }
    if (SITE_ENV === "beta") {
      return test ? v : refuse(`RAZORPAY_KEY_ID is ${live ? "a live key" : "not a test key"}, which a beta build refuses`);
    }
    /* Elsewhere (a preview, a local build) only a live key is refused, and for that one the match ignores case: the one
       thing a build that is not production must never take. */
    return /^rzp_live_/i.test(v) ? refuse(`RAZORPAY_KEY_ID is a live key, which a ${SITE_ENV} build refuses`) : v;
  }

  if (name === "SUPABASE_URL") {
    const id = supabaseProjectId(v);
    const tests = TEST_SUPABASE_PROJECT_REFS.map((ref) => ref.toLowerCase());
    if (SITE_ENV === "production" && id !== null && tests.includes(id)) {
      return refuse("SUPABASE_URL is a test project, which a production build refuses");
    }
    if (SITE_ENV === "beta" && tests.length > 0 && (id === null || !tests.includes(id))) {
      return refuse("SUPABASE_URL is not the test project, which a beta build refuses");
    }
  }
  return v;
}

/** Which required variables are absent, BY NAME. Never values.
 *
 *  Added during go-live (2026-08-22): `/api/health` reported "not-configured"
 *  without saying which of six values was missing, which turns switching the
 *  store on into paste-redeploy-guess. The names are already public in
 *  `.env.example` and in the runbook, so listing them leaks nothing that a
 *  reader of this repo does not already know, and it converts a guessing loop
 *  into a single request. */
export function missingStoreEnv(): string[] {
  const required: [string, string | undefined][] = [
    ["RAZORPAY_KEY_ID", process.env.RAZORPAY_KEY_ID],
    ["RAZORPAY_KEY_SECRET", process.env.RAZORPAY_KEY_SECRET],
    ["RAZORPAY_WEBHOOK_SECRET", process.env.RAZORPAY_WEBHOOK_SECRET],
    ["SUPABASE_URL", process.env.SUPABASE_URL],
    ["SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY],
    ["STORE_SIGNING_SECRET", process.env.STORE_SIGNING_SECRET],
  ];
  return required.filter(([name, value]) => accepted(name, value) === null).map(([name]) => name);
}

/** The required set, or null when any of it is missing. */
export function storeEnv(): StoreEnv | null {
  const razorpayKeyId = accepted("RAZORPAY_KEY_ID", process.env.RAZORPAY_KEY_ID);
  const razorpayKeySecret = real(process.env.RAZORPAY_KEY_SECRET);
  const razorpayWebhookSecret = real(process.env.RAZORPAY_WEBHOOK_SECRET);
  const supabaseUrl = accepted("SUPABASE_URL", process.env.SUPABASE_URL);
  const supabaseServiceKey = real(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const signingSecret = real(process.env.STORE_SIGNING_SECRET);

  if (
    !razorpayKeyId ||
    !razorpayKeySecret ||
    !razorpayWebhookSecret ||
    !supabaseUrl ||
    !supabaseServiceKey ||
    !signingSecret
  ) {
    return null;
  }

  return {
    razorpayKeyId,
    razorpayKeySecret,
    razorpayWebhookSecret,
    supabaseUrl,
    supabaseServiceKey,
    signingSecret,
    alertEmail: real(process.env.ORDER_ALERT_EMAIL) ?? "hello@kheelona.com",
    resendApiKey: SITE_ENV === "beta" ? null : real(process.env.RESEND_API_KEY),
    emailFrom: real(process.env.EMAIL_FROM) ?? "Kheelona <hello@send.kheelona.com>",
    metaCapiToken: SITE_ENV === "beta" ? null : real(process.env.META_CAPI_TOKEN),
    metaCapiTestCode: SITE_ENV === "beta" ? null : real(process.env.META_CAPI_TEST_CODE),
  };
}

/** True when the store can actually take a payment. Pages ask this before
 *  rendering a form that would fail on submit. */
export function storeReady(): boolean {
  return storeEnv() !== null;
}

/** Razorpay keys are prefixed `rzp_test_` and `rzp_live_`. Worth surfacing: a
 *  test key on the live host means the store is quietly taking fake money, and
 *  a live key on a preview deploy means a test is taking real money. */
export function razorpayMode(keyId: string): "test" | "live" | "unknown" {
  if (keyId.startsWith("rzp_test_")) return "test";
  if (keyId.startsWith("rzp_live_")) return "live";
  return "unknown";
}
