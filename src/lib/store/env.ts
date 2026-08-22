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
  return required.filter(([, value]) => real(value) === null).map(([name]) => name);
}

/** The required set, or null when any of it is missing. */
export function storeEnv(): StoreEnv | null {
  const razorpayKeyId = real(process.env.RAZORPAY_KEY_ID);
  const razorpayKeySecret = real(process.env.RAZORPAY_KEY_SECRET);
  const razorpayWebhookSecret = real(process.env.RAZORPAY_WEBHOOK_SECRET);
  const supabaseUrl = real(process.env.SUPABASE_URL);
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
    resendApiKey: real(process.env.RESEND_API_KEY),
    emailFrom: real(process.env.EMAIL_FROM) ?? "Kheelona <hello@send.kheelona.com>",
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
