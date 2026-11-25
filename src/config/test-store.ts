/** The test store's database, named in the open (D071, K-182).
 *
 *  The test store (the `beta` build, betastore.kheelona.com) takes Razorpay Test Mode payments and writes to its OWN
 *  Supabase project, never production's. `storeEnv()` (src/lib/store/env.ts) uses this list to keep the two apart:
 *    - a production build refuses a `SUPABASE_URL` whose project is on the list,
 *    - a beta build, once the list is not empty, refuses a `SUPABASE_URL` whose project is not on it.
 *  With the list empty, neither rule applies and only Vercel's per-environment variables keep the databases apart.
 *  Since T1b (25 Nov 2026) it holds the test store's project.
 *
 *  Each entry is the id at the start of a test project's URL (`https://<id>.supabase.co`): 20 lower-case letters and
 *  digits. It is an identifier, not a key. It gives no access to anything and is safe to publish; the founder said
 *  so on 24 Nov 2026 (memory decision 2026-11-24-permanent-razorpay-test-environment, answer 4). Never put a URL, a
 *  key, a password or a token here. Adding the id is T1b: one line here and one line in test/store-env-beta.test.ts.
 *
 *  This file sits outside the frozen checkout folders on purpose (a new file inside `src/lib/store/` fails the
 *  checkout-freeze guard), and has no imports so that `env.ts` and any script can read it. */
export const TEST_SUPABASE_PROJECT_REFS: readonly string[] = ["yiihxztphkuhxadmfrdb"];
