/** A tiny stand-in for the Supabase query builder.
 *
 *  Why not the real client: these tests are about our own logic (does the server
 *  decide the price, is the webhook idempotent, is a failure retried) and none of
 *  that needs Postgres to be present. A hosted database in the unit suite would
 *  make it slow, flaky and unable to run offline.
 *
 *  It works by recording the chain and resolving on `await`, keyed by
 *  "<table>.<first operation>" so a test can script exactly what each query
 *  returns. Every method used by the store is supported by construction: any
 *  unknown method simply continues the chain. */

export type QueryResult = { data?: unknown; error?: unknown; count?: number };
export type RecordedCall = { table: string; method: string; args: unknown[] };

export function fakeClient(
  results: Record<string, QueryResult>,
  calls: RecordedCall[] = [],
) {
  const builderFor = (table: string) => {
    let operation = "";
    const chain: Record<string, unknown> = {};

    const proxy: unknown = new Proxy(chain, {
      get(_target, property: string) {
        if (property === "then") {
          const key = `${table}.${operation}`;
          const result = results[key] ?? { data: null, error: null };
          const promise = Promise.resolve(result);
          return promise.then.bind(promise);
        }
        return (...args: unknown[]) => {
          if (!operation && ["insert", "update", "select", "delete", "upsert"].includes(property)) {
            operation = property;
          }
          calls.push({ table, method: property, args });
          return proxy;
        };
      },
    });

    return proxy;
  };

  return { from: (table: string) => builderFor(table) };
}

/** The first argument of the first call matching a table and method. */
export function firstArg(
  calls: RecordedCall[],
  table: string,
  method: string,
): Record<string, unknown> | undefined {
  const call = calls.find((c) => c.table === table && c.method === method);
  return call?.args[0] as Record<string, unknown> | undefined;
}

/** A complete StoreEnv with obviously fake values. */
export const fakeEnv = {
  razorpayKeyId: "rzp_test_fake",
  razorpayKeySecret: "secret_test",
  razorpayWebhookSecret: "whsec",
  supabaseUrl: "https://fake.supabase.co",
  supabaseServiceKey: "service-role-fake",
  signingSecret: "s3cret",
  alertEmail: "hello@kheelona.com",
  resendApiKey: null,
  emailFrom: "Kheelona <hello@send.kheelona.com>",
};
