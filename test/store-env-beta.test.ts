import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import ts from "typescript";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listFiles, readRepoFile, tagText } from "./e2e/support/repo";
import { fakeClient, type QueryResult, type RecordedCall } from "./helpers/fake-supabase";
import { signAddressToken } from "@/lib/store/signing";
import { formatThanksSession } from "@/lib/store/thanks-session";

/**
 * The store accepts only the Razorpay mode, and the Supabase project, that fit its build (D071, K-182).
 *
 * This replaces D051 ("beta never takes a payment", 12 Oct 2026). The founder ruled on 24 Nov 2026 that the
 * test store (the `beta` build, betastore.kheelona.com) takes Razorpay TEST MODE payments, so that every store
 * change can be tried with real phones and no real money. The guard that keeps the two worlds apart lives in
 * `storeEnv()`, and the table is:
 *
 *   production         `rzp_live_` only
 *   beta               `rzp_test_` only
 *   preview, development   anything except `rzp_live_` (a local `rzp_placeholder` keeps working)
 *
 * A key the build refuses reads as absent: `storeEnv()` is null, `missingStoreEnv()` names RAZORPAY_KEY_ID, the
 * store shows "opening shortly", the API routes answer 503, one `console.error` line names the rule (the mode,
 * never a value). Email is off on beta whatever is set, and so is Meta's Conversions API.
 *
 * The test Supabase project's id lives in `src/config/test-store.ts` (empty until T1b): production refuses a URL
 * whose id is on the list, and beta, once the list is not empty, refuses a URL whose id is not on it.
 *
 * Production with a live key and its own Supabase project answers exactly as the tag archive/pre-reset-2026-10-10
 * did, and so does every other combination the table accepts: the truth table below runs the tag's own `env.ts`
 * beside today's on the same variables. Every key and URL in this file is made up.
 */

/* ── The variables ─────────────────────────────────────────────────────────────────────────── */

/** The six the store cannot run without, in the order `missingStoreEnv()` reports them. Typed out
 *  by hand: the expectation must not come from the module under test. */
const SIX = [
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STORE_SIGNING_SECRET",
];

type Vars = Record<string, string | undefined>;

/** Obviously fake keys, one of each kind a build may meet. Razorpay's real ones start `rzp_live_` and `rzp_test_`;
 *  a local run uses `rzp_placeholder`; the upper-case one is not a real key and no build may mistake it for a test key. */
const LIVE = "rzp_live_FAKE0000";
const TEST = "rzp_test_FAKE0000";
const PLACEHOLDER = "rzp_placeholder";
const LIVE_SHOUTING = "rzp_LIVE_FAKE0000";

/** A made-up Supabase project id (20 lower-case characters, the shape of a real one) and the URL it would have. */
const TEST_PROJECT = "abcdefghijklmnopqrst";
const OTHER_PROJECT = "zyxwvutsrqponmlkjihg";
const supabaseUrl = (id: string) => `https://${id}.supabase.co`;

/** The six, with the given Razorpay key and a Supabase URL that belongs to no list. All values are fake. */
const required = (keyId: string, url = "https://d071-probe.invalid"): Vars => ({
  RAZORPAY_KEY_ID: keyId,
  RAZORPAY_KEY_SECRET: "probe-key-secret",
  RAZORPAY_WEBHOOK_SECRET: "probe-webhook-secret",
  SUPABASE_URL: url,
  SUPABASE_SERVICE_ROLE_KEY: "probe-service-role",
  STORE_SIGNING_SECRET: "probe-signing-secret",
});
const OPTIONAL: Vars = {
  ORDER_ALERT_EMAIL: "alerts@example.com",
  RESEND_API_KEY: "re_probe",
  EMAIL_FROM: "Probe <probe@example.com>",
  META_CAPI_TOKEN: "EAAprobe",
  META_CAPI_TEST_CODE: "TEST123",
};
const everything = (keyId: string, url?: string): Vars => ({ ...required(keyId, url), ...OPTIONAL });

/** Live-looking on purpose: the worry is the production set reaching the test store. */
const REQUIRED = required(LIVE);
const EVERYTHING = everything(LIVE);
/** What the test store is given: a Test Mode key and the rest. */
const EVERYTHING_TEST = everything(TEST);
const ALL_NAMES = [...Object.keys(REQUIRED), ...Object.keys(OPTIONAL)];

/** Every store variable stubbed (set or removed), so nothing from the shell leaks in, and the build's
 *  site environment forced the way `next.config.ts` inlines it. Then a fresh copy of the modules.
 *  `refs` stands in for the list of test Supabase project ids in `src/config/test-store.ts`. */
async function under<T>(
  siteEnv: string | undefined,
  vars: Vars,
  load: () => Promise<T>,
  refs?: readonly string[],
): Promise<T> {
  vi.resetModules();
  vi.doUnmock("@/config/test-store");
  if (refs) vi.doMock("@/config/test-store", () => ({ TEST_SUPABASE_PROJECT_REFS: refs }));
  vi.stubEnv("KH_SITE_ENV", siteEnv);
  for (const name of ALL_NAMES) vi.stubEnv(name, vars[name]);
  return load();
}

/* ── The rest of the store, held still ─────────────────────────────────────────────────────── */

let calls: RecordedCall[] = [];
let results: Record<string, QueryResult> = {};
let cookieValue: string | undefined;
let errorSpy: ReturnType<typeof vi.spyOn>;

/* Any query at all is recorded: on a refused build there must be none. */
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieValue ? { name, value: cookieValue } : undefined),
  }),
}));

const REF = "KH-A2B3-C4D5";

beforeEach(() => {
  calls = [];
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  results = {
    "preorders.select": {
      count: 0,
      data: { order_ref: REF, tier: "launch", amount_paise: 49_900, status: "paid", email: "parent@example.com", address: null },
    },
  };
  /* A confirmation-page cookie that the probe signing secret really verifies, so where the keys are accepted
     they open the order and where they are refused the same cookie opens nothing. */
  cookieValue = formatThanksSession(REF, signAddressToken(REQUIRED.STORE_SIGNING_SECRET!, REF, Date.now() + 3_600_000))!;
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.doUnmock("@/config/test-store");
  vi.resetModules();
  vi.restoreAllMocks();
});

/* ── 1. storeEnv and missingStoreEnv ───────────────────────────────────────────────────────── */

type EnvApi = Pick<typeof import("@/lib/store/env"), "storeEnv" | "missingStoreEnv" | "storeReady">;
type Answer = { storeEnv: unknown; missing: string[]; ready: boolean };

const ask = (m: EnvApi): Answer => ({ storeEnv: m.storeEnv(), missing: m.missingStoreEnv(), ready: m.storeReady() });
const envModule = () => import("@/lib/store/env");

/** The tag's own `env.ts`, compiled and evaluated against the live `process.env`. It had no imports
 *  (the `SITE_ENV` import arrived with D048), so it runs on its own. */
function tagEnvModule(): EnvApi {
  const text = tagText("src/lib/store/env.ts");
  if (text === null) throw new Error("src/lib/store/env.ts is missing at the freeze tag");
  expect(text, "the tag's env.ts gained an import; this loader cannot evaluate it").not.toMatch(/^\s*import\s/m);
  const js = ts.transpileModule(text, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports: Record<string, unknown> = {};
  new Function("exports", "process", js)(exports, process);
  return exports as unknown as EnvApi;
}
const TAG = tagEnvModule();

/** Values the store reads as missing: absent, empty, blank, or a placeholder. */
const MISSING_FORMS: (string | undefined)[] = [undefined, "", "   ", "DUMMY", "rzp_test_DUMMY_KEY", "<paste the key>"];

/** The cases the tag's truth table runs, with the given Razorpay key in every one that sets the six. */
const casesFor = (keyId: string): [string, Vars][] => {
  const all = everything(keyId);
  return [
    ["nothing set", {}],
    ["the six required", required(keyId)],
    ["every variable", all],
    ["every variable, padded with spaces", Object.fromEntries(Object.entries(all).map(([k, v]) => [k, `  ${v}  `]))],
    [
      "the six, every optional a placeholder",
      { ...required(keyId), ORDER_ALERT_EMAIL: "DUMMY", RESEND_API_KEY: "<key>", EMAIL_FROM: "", META_CAPI_TOKEN: "DUMMY", META_CAPI_TEST_CODE: "  " },
    ],
    ...SIX.flatMap((name) =>
      MISSING_FORMS.map((form): [string, Vars] => [`${name}=${JSON.stringify(form)}`, { ...all, [name]: form }]),
    ),
  ];
};

/** The builds, and what each one's `KH_SITE_ENV` is. A local build with none set is development. */
const BUILDS: [label: string, siteEnv: string | undefined][] = [
  ["production", "production"],
  ["beta", "beta"],
  ["preview", "preview"],
  ["development", "development"],
  ["no KH_SITE_ENV (a local build)", undefined],
];

/** The spec's table, typed by hand: which keys each build accepts (every other key is refused). */
const ACCEPTS: Record<string, string[]> = {
  production: [LIVE],
  beta: [TEST],
  preview: [TEST, PLACEHOLDER],
  development: [TEST, PLACEHOLDER],
  "no KH_SITE_ENV (a local build)": [TEST, PLACEHOLDER],
};
const KEYS = [LIVE, TEST, PLACEHOLDER, LIVE_SHOUTING];

/** The one line each refusal logs: the rule and the mode, never a value. Typed by hand. */
const REFUSALS: [build: string, key: string, line: string][] = [
  ["production", TEST, "RAZORPAY_KEY_ID is a test key, which a production build refuses"],
  ["production", PLACEHOLDER, "RAZORPAY_KEY_ID is not a live key, which a production build refuses"],
  ["production", LIVE_SHOUTING, "RAZORPAY_KEY_ID is not a live key, which a production build refuses"],
  ["beta", LIVE, "RAZORPAY_KEY_ID is a live key, which a beta build refuses"],
  ["beta", PLACEHOLDER, "RAZORPAY_KEY_ID is not a test key, which a beta build refuses"],
  ["beta", LIVE_SHOUTING, "RAZORPAY_KEY_ID is not a test key, which a beta build refuses"],
  ["preview", LIVE, "RAZORPAY_KEY_ID is a live key, which a preview build refuses"],
  ["preview", LIVE_SHOUTING, "RAZORPAY_KEY_ID is a live key, which a preview build refuses"],
  ["development", LIVE, "RAZORPAY_KEY_ID is a live key, which a development build refuses"],
  ["development", LIVE_SHOUTING, "RAZORPAY_KEY_ID is a live key, which a development build refuses"],
  ["no KH_SITE_ENV (a local build)", LIVE, "RAZORPAY_KEY_ID is a live key, which a development build refuses"],
  ["no KH_SITE_ENV (a local build)", LIVE_SHOUTING, "RAZORPAY_KEY_ID is a live key, which a development build refuses"],
];

const loggedText = () => JSON.stringify(errorSpy.mock.calls);

describe("D071: each build accepts only the Razorpay key mode that fits it", () => {
  for (const [build, siteEnv] of BUILDS) {
    for (const key of KEYS) {
      if (ACCEPTS[build].includes(key)) {
        it(`${build} accepts ${key}: the store is configured and nothing is logged`, async () => {
          const answer = ask(await under(siteEnv, everything(key), envModule));
          expect(answer.ready).toBe(true);
          expect(answer.missing).toEqual([]);
          expect(answer.storeEnv).toMatchObject({ razorpayKeyId: key });
          expect(errorSpy).not.toHaveBeenCalled();
        });
      } else {
        it(`${build} refuses ${key}: not configured, RAZORPAY_KEY_ID named, one line logged, no value`, async () => {
          const vars = everything(key);
          const now = ask(await under(siteEnv, vars, envModule));
          expect(now).toEqual({ storeEnv: null, missing: ["RAZORPAY_KEY_ID"], ready: false });
          const line = REFUSALS.find(([b, k]) => b === build && k === key);
          expect(line, `no expected log line typed for ${build} + ${key}`).toBeDefined();
          /* Asked three ways above, logged once: a server asks on every request and must not flood its log. */
          expect(errorSpy.mock.calls).toEqual([[line![2]]]);
          for (const value of Object.values(vars)) expect(loggedText()).not.toContain(value!);
          /* Not vacuous: the tag opens the store with this very key. */
          expect(await under(siteEnv, vars, async () => ask(TAG).ready)).toBe(true);
        });
      }
    }
  }

  it("never throws: a refused key is the same not-configured state as a missing one", async () => {
    const refused = ask(await under("production", everything(TEST), envModule));
    const missing = ask(await under("production", { ...everything(TEST), RAZORPAY_KEY_ID: undefined }, envModule));
    expect(refused).toEqual(missing);
  });

  it("names a refused key beside whatever else is missing, in the usual order", async () => {
    const vars = { ...everything(TEST), STORE_SIGNING_SECRET: undefined, RAZORPAY_KEY_SECRET: "" };
    const answer = ask(await under("production", vars, envModule));
    expect(answer.missing).toEqual(["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "STORE_SIGNING_SECRET"]);
    expect(answer.storeEnv).toBeNull();
  });

  it("does not log a key that is missing anyway", async () => {
    for (const form of MISSING_FORMS) {
      ask(await under("production", { ...everything(TEST), RAZORPAY_KEY_ID: form }, envModule));
    }
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("judges the trimmed key: a padded live key is still a live key", async () => {
    const live = ask(await under("production", everything(`  ${LIVE}  `), envModule));
    expect(live.ready).toBe(true);
    expect(live.storeEnv).toMatchObject({ razorpayKeyId: LIVE });
    const test = ask(await under("production", everything(`  ${TEST}  `), envModule));
    expect(test.ready).toBe(false);
  });
});

describe("D071: every combination a build accepts answers exactly as the tag does", () => {
  for (const [build, siteEnv] of BUILDS) {
    for (const key of ACCEPTS[build]) {
      /* The test store differs from the tag in three places on purpose (below); everywhere else it is the tag. */
      const offOnBeta = (a: Answer): Answer =>
        build === "beta" && a.storeEnv
          ? { ...a, storeEnv: { ...(a.storeEnv as object), resendApiKey: null, metaCapiToken: null, metaCapiTestCode: null } }
          : a;

      it.each(casesFor(key))(`${build} with ${key}, %s: same answer as the tag${build === "beta" ? " (email and Meta's token off)" : ""}`, async (_label, vars) => {
        const now = await under(siteEnv, vars, envModule);
        expect(ask(now)).toEqual(offOnBeta(ask(TAG)));
      });
    }
  }

  it("is not vacuous: the tag opens the store when the six are set", async () => {
    const answer = await under("production", EVERYTHING, async () => ask(TAG));
    expect(answer.ready).toBe(true);
    expect(answer.missing).toEqual([]);
    expect(answer.storeEnv).toMatchObject({ razorpayKeyId: LIVE, metaCapiToken: "EAAprobe", resendApiKey: "re_probe" });
  });
});

describe("D071: the test store sends no email and no Meta event, whatever is set", () => {
  it("beta: resendApiKey, metaCapiToken and metaCapiTestCode are null; the alert address and from-line still read", async () => {
    const env = (await under("beta", EVERYTHING_TEST, envModule)).storeEnv() as Record<string, unknown>;
    expect(env).toMatchObject({
      resendApiKey: null,
      metaCapiToken: null,
      metaCapiTestCode: null,
      alertEmail: "alerts@example.com",
      emailFrom: "Probe <probe@example.com>",
    });
  });

  it.each(["production", "preview", "development", undefined])("%s: email and the Meta token are read as before", async (siteEnv) => {
    const key = siteEnv === "production" ? LIVE : TEST;
    const env = (await under(siteEnv, everything(key), envModule)).storeEnv() as Record<string, unknown>;
    expect(env).toMatchObject({ resendApiKey: "re_probe", metaCapiToken: "EAAprobe", metaCapiTestCode: "TEST123" });
  });
});

/* ── The Supabase project rule (T1b-ready) ─────────────────────────────────────────────────── */

const LISTED = [TEST_PROJECT];

describe("D071: production refuses the test Supabase project; the test store requires it once it is named", () => {
  const productionAccepts: [string, string][] = [
    ["another project", supabaseUrl(OTHER_PROJECT)],
    ["an id that merely contains the test id", supabaseUrl(`x${TEST_PROJECT}`)],
    ["the test id as a prefix of another host", `https://${TEST_PROJECT}.supabase.co.example.invalid`],
    ["a local stub", "http://127.0.0.1:54321"],
    ["a value that is not a URL (as the tag: it is only refused when the store tries to use it)", "not a url"],
  ];
  const productionRefuses: [string, string][] = [
    ["the test project", supabaseUrl(TEST_PROJECT)],
    ["the test project with a trailing slash", `${supabaseUrl(TEST_PROJECT)}/`],
    ["the test project with a path", `${supabaseUrl(TEST_PROJECT)}/rest/v1`],
    ["the test project in capitals", supabaseUrl(TEST_PROJECT.toUpperCase())],
    ["the test project with a port", `${supabaseUrl(TEST_PROJECT)}:443`],
  ];

  it.each(productionAccepts)("production accepts %s", async (_label, url) => {
    const vars = everything(LIVE, url);
    const answer = ask(await under("production", vars, envModule, LISTED));
    expect(answer.ready).toBe(true);
    expect(answer).toEqual(await under("production", vars, async () => ask(TAG)));
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it.each(productionRefuses)("production refuses %s: SUPABASE_URL is named, one line, no value", async (_label, url) => {
    const vars = everything(LIVE, url);
    const answer = ask(await under("production", vars, envModule, LISTED));
    expect(answer).toEqual({ storeEnv: null, missing: ["SUPABASE_URL"], ready: false });
    expect(errorSpy.mock.calls).toEqual([["SUPABASE_URL is a test project, which a production build refuses"]]);
    expect(loggedText()).not.toContain(TEST_PROJECT);
    expect(await under("production", vars, async () => ask(TAG).ready), "not vacuous: the tag opens it").toBe(true);
  });

  const betaAccepts: [string, string][] = [
    ["the test project", supabaseUrl(TEST_PROJECT)],
    ["the test project with a trailing slash", `${supabaseUrl(TEST_PROJECT)}/`],
    ["the test project in capitals", supabaseUrl(TEST_PROJECT.toUpperCase())],
  ];
  const betaRefuses: [string, string][] = [
    ["another project", supabaseUrl(OTHER_PROJECT)],
    ["a local stub", "http://127.0.0.1:54321"],
    ["the test id as a prefix of another host", `https://${TEST_PROJECT}.supabase.co.example.invalid`],
    ["an id that merely contains the test id", supabaseUrl(`x${TEST_PROJECT}`)],
    ["a value that is not a URL", "not a url"],
  ];

  it.each(betaAccepts)("beta accepts %s", async (_label, url) => {
    const answer = ask(await under("beta", everything(TEST, url), envModule, LISTED));
    expect(answer.ready).toBe(true);
    expect(answer.missing).toEqual([]);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it.each(betaRefuses)("beta refuses %s: SUPABASE_URL is named, one line, no value", async (_label, url) => {
    const vars = everything(TEST, url);
    const answer = ask(await under("beta", vars, envModule, LISTED));
    expect(answer).toEqual({ storeEnv: null, missing: ["SUPABASE_URL"], ready: false });
    expect(errorSpy.mock.calls).toEqual([["SUPABASE_URL is not the test project, which a beta build refuses"]]);
    for (const value of Object.values(vars)) expect(loggedText()).not.toContain(value!);
  });

  it("beta with an empty list has no Supabase rule yet (until T1b names the project)", async () => {
    for (const url of [supabaseUrl(TEST_PROJECT), supabaseUrl(OTHER_PROJECT), "http://127.0.0.1:54321"]) {
      const answer = ask(await under("beta", everything(TEST, url), envModule, []));
      expect(answer.ready, url).toBe(true);
    }
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("production with an empty list refuses no Supabase project", async () => {
    const answer = ask(await under("production", everything(LIVE, supabaseUrl(TEST_PROJECT)), envModule, []));
    expect(answer.ready).toBe(true);
  });

  it.each(["preview", "development", undefined])("%s has no Supabase rule: the test project, another project and a local stub all pass", async (siteEnv) => {
    for (const url of [supabaseUrl(TEST_PROJECT), supabaseUrl(OTHER_PROJECT), "http://127.0.0.1:54321"]) {
      const answer = ask(await under(siteEnv, everything(PLACEHOLDER, url), envModule, LISTED));
      expect(answer.ready, url).toBe(true);
    }
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("names both when both the key and the project are refused, one line each", async () => {
    const vars = everything(TEST, supabaseUrl(TEST_PROJECT));
    const answer = ask(await under("production", vars, envModule, LISTED));
    expect(answer).toEqual({ storeEnv: null, missing: ["RAZORPAY_KEY_ID", "SUPABASE_URL"], ready: false });
    expect(errorSpy.mock.calls).toEqual([
      ["RAZORPAY_KEY_ID is a test key, which a production build refuses"],
      ["SUPABASE_URL is a test project, which a production build refuses"],
    ]);
  });

  it("the committed list holds identifiers only: 20 lower-case letters or digits each (T1b adds the test project's here)", async () => {
    const { TEST_SUPABASE_PROJECT_REFS } = await import("@/config/test-store");
    expect(Array.isArray(TEST_SUPABASE_PROJECT_REFS)).toBe(true);
    for (const id of TEST_SUPABASE_PROJECT_REFS) expect(id).toMatch(/^[a-z0-9]{20}$/);
    expect(new Set(TEST_SUPABASE_PROJECT_REFS).size).toBe(TEST_SUPABASE_PROJECT_REFS.length);
  });
});

/* ── 2. The store pages: a refused build renders the no-keys state, and reads nothing ──────── */

type Page = (props?: unknown) => Promise<ReactElement>;
/* The Ideabaaz partner page left this list with its route (D054 item 7, task 6.6): /ideabaaz is a store dead end, which
   reads no store env. */
const PAGES: Record<string, { load: () => Promise<{ default: unknown }>; props: () => unknown }> = {
  "src/app/store/page.tsx": { load: () => import("@/app/store/page"), props: () => undefined },
  "src/app/store/e/[event]/page.tsx": {
    load: () => import("@/app/store/e/[event]/page"),
    props: () => ({ params: Promise.resolve({ event: "ideabaaz" }), searchParams: Promise.resolve({}) }),
  },
  "src/app/store/thanks/page.tsx": { load: () => import("@/app/store/thanks/page"), props: () => undefined },
};

async function renderPage(path: string, siteEnv: string | undefined, vars: Vars) {
  const entry = PAGES[path];
  const mod = await under(siteEnv, vars, entry.load);
  calls = [];
  const { container, unmount } = render(await (mod.default as Page)(entry.props()));
  const out = { html: container.innerHTML, forms: container.querySelectorAll("form").length, queries: calls.length };
  unmount();
  return out;
}

const callsStoreEnv = (p: string) => !/\.(test|stories)\.tsx?$/.test(p) && /\bstoreEnv\(/.test(readRepoFile(p));

describe("D071: a build that refuses the key renders every store page's not-configured state", () => {
  it("covers every store page that reads the store env", () => {
    const pages = listFiles(["src/app/store"]).filter((p) => p.endsWith(".tsx") && callsStoreEnv(p));
    expect(pages).toEqual(Object.keys(PAGES).sort());
  });

  it.each(Object.keys(PAGES))("%s", async (path) => {
    /* A live key on the test store: refused, so the page is what the page is with no keys at all. */
    const betaWithLiveKeys = await renderPage(path, "beta", EVERYTHING);
    const betaWithout = await renderPage(path, "beta", {});
    expect(betaWithLiveKeys.html, "beta with a live key must render what beta renders with none").toBe(betaWithout.html);
    expect(betaWithLiveKeys.queries, "a refused store page touched the database").toBe(0);
    expect(betaWithLiveKeys.forms, "a refused store page rendered a form").toBe(0);

    /* The same for a test key on production. */
    const productionWithTestKeys = await renderPage(path, "production", EVERYTHING_TEST);
    const productionWithout = await renderPage(path, "production", {});
    expect(productionWithTestKeys.html, "production with a test key must render what it renders with none").toBe(productionWithout.html);
    expect(productionWithTestKeys.queries).toBe(0);
    expect(productionWithTestKeys.forms).toBe(0);

    /* Control: where the key fits, the same page opens, so the comparisons above can fail. */
    const productionWithKeys = await renderPage(path, "production", EVERYTHING);
    expect(productionWithKeys.html).not.toBe(productionWithout.html);
    const betaWithTestKeys = await renderPage(path, "beta", EVERYTHING_TEST);
    expect(betaWithTestKeys.html, "beta with a Test Mode key must open the page").not.toBe(betaWithout.html);
  });

  it("shows the store page's 'opening shortly' screen, with no payment form", async () => {
    const page = await renderPage("src/app/store/page.tsx", "beta", EVERYTHING);
    expect(page.html).toContain("Pre-orders open here shortly.");
    expect(page.forms).toBe(0);
  });

  it("the test store with a Test Mode key shows the payment form, and production with a live key still does", async () => {
    const beta = await renderPage("src/app/store/page.tsx", "beta", EVERYTHING_TEST);
    expect(beta.forms).toBeGreaterThan(0);
    expect(beta.html).not.toContain("Pre-orders open here shortly.");
    const production = await renderPage("src/app/store/page.tsx", "production", EVERYTHING);
    expect(production.forms).toBeGreaterThan(0);
  });
});

/* ── 3. The store API routes: 503 where the key is refused, nothing reached ────────────────── */

const ROUTES: Record<string, () => Promise<Record<string, unknown>>> = {
  "src/app/api/health/route.ts": () => import("@/app/api/health/route"),
  "src/app/api/preorder/address/route.ts": () => import("@/app/api/preorder/address/route"),
  "src/app/api/preorder/confirm/route.ts": () => import("@/app/api/preorder/confirm/route"),
  "src/app/api/preorder/create-order/route.ts": () => import("@/app/api/preorder/create-order/route"),
  "src/app/api/razorpay/webhook/route.ts": () => import("@/app/api/razorpay/webhook/route"),
};
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

type Answered = { method: string; status: number; body: unknown };

/** Every exported handler of the route, called once with an empty JSON body. */
async function callRoute(path: string, siteEnv: string | undefined, vars: Vars) {
  const mod = await under(siteEnv, vars, ROUTES[path]);
  const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("no network in this test"));
  calls = [];
  const answers: Answered[] = [];
  for (const method of METHODS) {
    const handler = mod[method] as ((r: Request) => Promise<Response>) | undefined;
    if (!handler) continue;
    const response = await handler(
      new Request(`https://betastore.kheelona.com/${path}`, {
        method,
        headers: { "x-forwarded-for": "203.0.113.7", "content-type": "application/json" },
        body: method === "GET" ? undefined : "{}",
      }),
    );
    answers.push({ method, status: response.status, body: await response.json() });
  }
  const out = { answers, queries: calls.length, fetches: fetchSpy.mock.calls.length };
  fetchSpy.mockRestore();
  return out;
}

describe("D071: every store API route answers 503 where the key is refused", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("covers every API route that reads the store env", () => {
    const routes = listFiles(["src/app/api"]).filter((p) => p.endsWith("/route.ts") && /\bstoreEnv\(/.test(readRepoFile(p)));
    expect(routes).toEqual(Object.keys(ROUTES).sort());
  });

  it.each(Object.keys(ROUTES))("%s", async (path) => {
    const beta = await callRoute(path, "beta", EVERYTHING); // a live key on the test store
    expect(beta.answers.length, "the route exports no handler").toBeGreaterThan(0);
    for (const a of beta.answers) expect(a.status, `${a.method} on beta with a live key`).toBe(503);
    expect(beta.queries, "a refused route touched the database").toBe(0);
    expect(beta.fetches, "a refused route reached the network").toBe(0);
    /* The same answer as with no keys at all. /api/health alone differs, by design: it names what is missing (below). */
    const bare = (await callRoute(path, "beta", {})).answers;
    if (path === "src/app/api/health/route.ts") expect(beta.answers.map((a) => a.status)).toEqual(bare.map((a) => a.status));
    else expect(beta.answers, "beta with a live key must answer as beta with none").toEqual(bare);

    const production = await callRoute(path, "production", EVERYTHING_TEST); // a test key on production
    for (const a of production.answers) expect(a.status, `${a.method} in production with a test key`).toBe(503);
    expect(production.queries).toBe(0);
    expect(production.fetches).toBe(0);

    /* Controls: where the key fits, the same keys get past the not-configured check. */
    const live = await callRoute(path, "production", EVERYTHING);
    for (const a of live.answers) expect(a.status, `${a.method} in production with a live key`).not.toBe(503);
    const test = await callRoute(path, "beta", EVERYTHING_TEST);
    for (const a of test.answers) expect(a.status, `${a.method} on beta with a Test Mode key`).not.toBe(503);
  });

  it("/api/health names RAZORPAY_KEY_ID for a live key on the test store, never a value", async () => {
    const { answers } = await callRoute("src/app/api/health/route.ts", "beta", EVERYTHING);
    expect(answers).toEqual([{ method: "GET", status: 503, body: { ok: false, store: "not-configured", missing: ["RAZORPAY_KEY_ID"] } }]);
    const text = JSON.stringify(answers);
    for (const value of Object.values(EVERYTHING)) expect(text).not.toContain(value!);
  });

  it("/api/health on the test store with a Test Mode key reports razorpay: test, email missing, capi missing", async () => {
    const { answers } = await callRoute("src/app/api/health/route.ts", "beta", EVERYTHING_TEST);
    expect(answers).toHaveLength(1);
    expect(answers[0].status).toBe(200);
    expect(answers[0].body).toMatchObject({ ok: true, store: "ready", razorpay: "test", email: "missing", capi: "missing" });
  });

  it("/api/health on production with a live key reports razorpay: live, email and capi configured", async () => {
    const { answers } = await callRoute("src/app/api/health/route.ts", "production", EVERYTHING);
    expect(answers[0].body).toMatchObject({ ok: true, store: "ready", razorpay: "live", email: "configured", capi: "configured" });
  });
});
