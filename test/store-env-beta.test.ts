import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import ts from "typescript";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { listFiles, readRepoFile, tagText } from "./e2e/support/repo";
import { fakeClient, type QueryResult, type RecordedCall } from "./helpers/fake-supabase";
import { signAddressToken } from "@/lib/store/signing";
import { formatThanksSession } from "@/lib/store/thanks-session";

/**
 * Beta never takes a payment (D051, task 2.10).
 *
 * The founder ruled that the beta runs without Supabase, Razorpay or email. Vercel may still hand the
 * beta build the production keys (a variable scoped to "Preview" reaches every preview branch), so the
 * code refuses them: on a beta build every store variable reads as absent. `storeEnv()` is null,
 * `missingStoreEnv()` names all six required variables, the store pages render exactly what they
 * render with no keys at all, and every store API route answers 503 without touching the database or
 * the network. `/api/health` reports `store: not-configured`.
 *
 * Production, preview and development behave exactly as the tag archive/pre-reset-2026-10-10 did:
 * the truth table below runs the tag's own `env.ts` beside today's on the same variables.
 *
 * (Before D051 this file proved the opposite for D048: that beta kept every store value so the
 * founder could take a test payment there, with only the Conversions API token switched off. That
 * switch is still in `storeEnv()`, now behind the D051 one.)
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

/** Live-looking on purpose: D051's worry is the production set reaching beta. All values are fake. */
const REQUIRED: Vars = {
  RAZORPAY_KEY_ID: "rzp_live_D051probe",
  RAZORPAY_KEY_SECRET: "probe-key-secret",
  RAZORPAY_WEBHOOK_SECRET: "probe-webhook-secret",
  SUPABASE_URL: "https://d051-probe.invalid",
  SUPABASE_SERVICE_ROLE_KEY: "probe-service-role",
  STORE_SIGNING_SECRET: "probe-signing-secret",
};
const OPTIONAL: Vars = {
  ORDER_ALERT_EMAIL: "alerts@example.com",
  RESEND_API_KEY: "re_probe",
  EMAIL_FROM: "Probe <probe@example.com>",
  META_CAPI_TOKEN: "EAAprobe",
  META_CAPI_TEST_CODE: "TEST123",
};
const ALL_NAMES = [...Object.keys(REQUIRED), ...Object.keys(OPTIONAL)];
const EVERYTHING: Vars = { ...REQUIRED, ...OPTIONAL };

/** Every store variable stubbed (set or removed), so nothing from the shell leaks in, and the build's
 *  site environment forced the way `next.config.ts` inlines it. Then a fresh copy of the modules. */
async function under<T>(siteEnv: string | undefined, vars: Vars, load: () => Promise<T>): Promise<T> {
  vi.resetModules();
  vi.stubEnv("KH_SITE_ENV", siteEnv);
  for (const name of ALL_NAMES) vi.stubEnv(name, vars[name]);
  return load();
}

/* ── The rest of the store, held still ─────────────────────────────────────────────────────── */

let calls: RecordedCall[] = [];
let results: Record<string, QueryResult> = {};
let cookieValue: string | undefined;

/* Any query at all is recorded: on beta there must be none. */
vi.mock("@/lib/store/db", () => ({ db: () => fakeClient(results, calls) }));
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieValue ? { name, value: cookieValue } : undefined),
  }),
}));

const REF = "KH-A2B3-C4D5";

beforeEach(() => {
  calls = [];
  results = {
    "preorders.select": {
      count: 0,
      data: { order_ref: REF, tier: "launch", amount_paise: 49_900, status: "paid", email: "parent@example.com", address: null },
    },
  };
  /* A confirmation-page cookie that the probe signing secret really verifies, so outside beta the
     keys open the order and on beta the same cookie opens nothing. */
  cookieValue = formatThanksSession(REF, signAddressToken(REQUIRED.STORE_SIGNING_SECRET!, REF, Date.now() + 3_600_000))!;
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.restoreAllMocks();
});

/* ── 1. storeEnv and missingStoreEnv: beta refuses, everything else equals the tag ─────────── */

type EnvApi = Pick<typeof import("@/lib/store/env"), "storeEnv" | "missingStoreEnv" | "storeReady">;
type Answer = { storeEnv: unknown; missing: string[]; ready: boolean };

const ask = (m: EnvApi): Answer => ({ storeEnv: m.storeEnv(), missing: m.missingStoreEnv(), ready: m.storeReady() });

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

const CASES: [string, Vars][] = [
  ["nothing set", {}],
  ["the six required with a test key", { ...REQUIRED, RAZORPAY_KEY_ID: "rzp_test_D051probe" }],
  ["the six required with a live key", REQUIRED],
  ["every variable", EVERYTHING],
  ["every variable, padded with spaces", Object.fromEntries(Object.entries(EVERYTHING).map(([k, v]) => [k, `  ${v}  `]))],
  [
    "the six, every optional a placeholder",
    { ...REQUIRED, ORDER_ALERT_EMAIL: "DUMMY", RESEND_API_KEY: "<key>", EMAIL_FROM: "", META_CAPI_TOKEN: "DUMMY", META_CAPI_TEST_CODE: "  " },
  ],
  ...SIX.flatMap((name) =>
    MISSING_FORMS.map((form): [string, Vars] => [`${name}=${JSON.stringify(form)}`, { ...EVERYTHING, [name]: form }]),
  ),
];

const NOT_BETA = [undefined, "production", "preview", "development"];

describe("D051: on a beta build the store is not configured, whatever variables reach it", () => {
  it.each(CASES)("%s: storeEnv() is null and missingStoreEnv() names all six", async (_label, vars) => {
    const answer = ask(await under("beta", vars, () => import("@/lib/store/env")));
    expect(answer).toEqual({ storeEnv: null, missing: SIX, ready: false });
  });

  it("answers exactly as the tag does with no store variables at all", async () => {
    const empty = await under(undefined, {}, async () => ask(TAG));
    const beta = ask(await under("beta", EVERYTHING, () => import("@/lib/store/env")));
    expect(empty).toEqual({ storeEnv: null, missing: SIX, ready: false });
    expect(beta).toEqual(empty);
  });
});

describe("production, preview and development: truth table against the tag", () => {
  for (const siteEnv of NOT_BETA) {
    it.each(CASES)(`KH_SITE_ENV=${siteEnv}, %s: same answer as the tag`, async (_label, vars) => {
      const now = await under(siteEnv, vars, () => import("@/lib/store/env"));
      expect(ask(now)).toEqual(ask(TAG));
    });
  }

  it("is not vacuous: the tag opens the store when the six are set", async () => {
    const answer = await under("production", EVERYTHING, async () => ask(TAG));
    expect(answer.ready).toBe(true);
    expect(answer.missing).toEqual([]);
    expect(answer.storeEnv).toMatchObject({ razorpayKeyId: "rzp_live_D051probe", metaCapiToken: "EAAprobe" });
  });
});

/* ── 2. The store pages: beta renders the no-keys state, and reads nothing ─────────────────── */

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

describe("D051: every store page renders its not-configured state on beta", () => {
  it("covers every store page that reads the store env", () => {
    const pages = listFiles(["src/app/store"]).filter((p) => p.endsWith(".tsx") && callsStoreEnv(p));
    expect(pages).toEqual(Object.keys(PAGES).sort());
  });

  it.each(Object.keys(PAGES))("%s", async (path) => {
    const betaWithKeys = await renderPage(path, "beta", EVERYTHING);
    const betaWithout = await renderPage(path, "beta", {});
    expect(betaWithKeys.html, "beta with keys must render what beta renders with none").toBe(betaWithout.html);
    expect(betaWithKeys.queries, "a beta store page touched the database").toBe(0);
    expect(betaWithKeys.forms, "a beta store page rendered a form").toBe(0);

    /* Control: outside beta the same keys open the page, so the comparison above can fail. */
    const productionWithKeys = await renderPage(path, "production", EVERYTHING);
    const productionWithout = await renderPage(path, "production", {});
    expect(productionWithKeys.html).not.toBe(productionWithout.html);
  });

  it("shows the store page's 'opening shortly' screen, with no payment form", async () => {
    const page = await renderPage("src/app/store/page.tsx", "beta", EVERYTHING);
    expect(page.html).toContain("Pre-orders open here shortly.");
    expect(page.forms).toBe(0);
  });
});

/* ── 3. The store API routes: 503 on beta, nothing reached ─────────────────────────────────── */

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

describe("D051: every store API route answers 503 on beta", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("covers every API route that reads the store env", () => {
    const routes = listFiles(["src/app/api"]).filter((p) => p.endsWith("/route.ts") && /\bstoreEnv\(/.test(readRepoFile(p)));
    expect(routes).toEqual(Object.keys(ROUTES).sort());
  });

  it.each(Object.keys(ROUTES))("%s", async (path) => {
    const beta = await callRoute(path, "beta", EVERYTHING);
    expect(beta.answers.length, "the route exports no handler").toBeGreaterThan(0);
    for (const a of beta.answers) expect(a.status, `${a.method} on beta`).toBe(503);
    expect(beta.queries, "a beta route touched the database").toBe(0);
    expect(beta.fetches, "a beta route reached the network").toBe(0);
    expect(beta.answers, "beta with keys must answer as beta with none").toEqual((await callRoute(path, "beta", {})).answers);

    /* Control: outside beta the same keys get past the not-configured check. */
    const production = await callRoute(path, "production", EVERYTHING);
    for (const a of production.answers) expect(a.status, `${a.method} in production`).not.toBe(503);
  });

  it("/api/health reports store: not-configured and names the six, never a value", async () => {
    const { answers } = await callRoute("src/app/api/health/route.ts", "beta", EVERYTHING);
    expect(answers).toEqual([{ method: "GET", status: 503, body: { ok: false, store: "not-configured", missing: SIX } }]);
    const text = JSON.stringify(answers);
    for (const value of Object.values(EVERYTHING)) expect(text).not.toContain(value);
  });
});
