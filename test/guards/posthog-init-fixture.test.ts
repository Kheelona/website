import { existsSync } from "node:fs";
import { join } from "node:path";
import { runInThisContext } from "node:vm";
import { gunzipSync } from "node:zlib";
import { render, waitFor } from "@testing-library/react";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import ts from "typescript";
import { afterAll, describe, expect, it, vi } from "vitest";
import * as envModule from "@/config/env";
import * as siteModule from "@/config/site";
import { POSTHOG_KEY } from "@/config/site";
import { STAMPED_PROPERTIES } from "@/lib/tracking/events";
import * as internalFlagModule from "@/lib/tracking/internal-flag";
import { FREEZE_TAG, ROOT, fixtureName, readRepoFile, tagText } from "../e2e/support/repo";

/* posthog-init-fixture (task 2.6; ADR-006; architecture §8.1, §15.3; QA review N3).
 *
 * 1. The fixture test/guards/fixtures/posthog-init/<gate path>.json holds the options the TAG's
 *    PostHogGate passes to posthog.init on a production host, and this guard re-derives them from
 *    the tag on every run (the tag's gate, evaluated with the tag's site.ts), so the fixture can
 *    never drift from production as it was.
 * 2. Today's gate passes exactly those options on every production host. Compared with
 *    toStrictEqual, so a key present with the value undefined (`before_send: undefined`) is a
 *    difference, not a match (task 2.6 review).
 * 3. On the two beta hosts the only addition is `before_send`, which stamps `env: "beta"` on every
 *    event and changes nothing else.
 * 4. NO posthog.register for env (N3): a registered super property persists in PostHog's storage
 *    and would follow a tester from beta to production. Proven with a control, against the REAL
 *    SDK and its real storage (lessons §5: a mock cannot tell you where a third party keeps its
 *    data): after a beta visit through today's gate, a production page reading the same storage,
 *    with /ingest blocked, holds no env and sends none; the same run with a planted
 *    register({ env: "beta" }) does carry env to production, so the instrument can see it.
 *
 * Both gates are evaluated by the same loader (TypeScript's transpiler, imports wired by name),
 * with posthog-js replaced by a recorder, so the tag and today are read by one instrument.
 */

const GATE = "src/components/tracking/PostHogGate.tsx";
const TAG_GATE = "src/components/molecules/PostHogGate.tsx";
const FIXTURE = `test/guards/fixtures/posthog-init/${fixtureName(GATE)}.json`;
const PRODUCTION_HOSTS = ["kheelona.com", "www.kheelona.com", "store.kheelona.com"];
const BETA_HOSTS = [...envModule.BETA_HOSTS];

type Options = Record<string, unknown>;
type InitCall = { key: string; options: Options };
type Fixture = { source: string; key: string; options: Options };

/* ── Instruments ──────────────────────────────────────────────────────────────────────────── */

type Jsdom = { reconfigure(o: { url: string }): void };
/** Moves the test document to `url`, keeping its cookie jar and storage (a stricter jar than a browser's). */
function goTo(url: string) {
  (globalThis as unknown as { jsdom: Jsdom }).jsdom.reconfigure({ url });
}

/** A module's source, transpiled to CommonJS and evaluated with its imports wired by name. */
function loadModule(label: string, source: string, imports: Record<string, unknown>): Record<string, unknown> {
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    fileName: label,
  });
  const loaded = { exports: {} as Record<string, unknown> };
  const wrapped = runInThisContext(`(function (module, exports, require) {\n${outputText}\n})`, {
    filename: label,
  }) as (m: typeof loaded, e: typeof loaded.exports, r: (id: string) => unknown) => void;
  wrapped(loaded, loaded.exports, (id) => {
    if (id in imports) return imports[id];
    throw new Error(`${label} imports ${id}, which this guard does not wire: wire it, or review why the gate needs it`);
  });
  return loaded.exports;
}

function recorderSdk() {
  const calls = { init: [] as InitCall[], register: [] as Options[], unregister: [] as string[] };
  const sdk = {
    init: (key: string, options: Options) => calls.init.push({ key, options }),
    register: (props: Options) => calls.register.push(props),
    unregister: (name: string) => calls.unregister.push(name),
    capture: () => {},
    startSessionRecording: () => {},
    stopSessionRecording: () => {},
    get_distinct_id: () => "test",
  };
  return { calls, posthogJs: { __esModule: true, default: sdk } };
}

const sharedImports = (posthogJs: unknown) => ({
  react: React,
  "react/jsx-runtime": jsxRuntime,
  "next/navigation": { usePathname: () => "/" },
  "@/lib/posthog": { registerPostHog: () => {}, phSetReplay: () => {} },
  "posthog-js": posthogJs,
});

/** Renders a gate (tag or today) at `url` and returns what it passed to posthog.init, register, unregister. */
async function runGate(which: "tag" | "today", url: string) {
  const { calls, posthogJs } = recorderSdk();
  const tagSite = loadModule(`${FREEZE_TAG}:src/config/site.ts`, tagText("src/config/site.ts") ?? "", {});
  const mod =
    which === "tag"
      ? loadModule(`${FREEZE_TAG}:${TAG_GATE}`, tagText(TAG_GATE) ?? "", { ...sharedImports(posthogJs), "@/config/site": tagSite })
      : loadModule(GATE, readRepoFile(GATE), {
          ...sharedImports(posthogJs),
          "@/config/site": siteModule,
          "@/config/env": envModule,
          "@/lib/tracking/internal-flag": internalFlagModule,
        });
  goTo(url);
  const Gate = mod.PostHogGate as React.FC;
  const view = render(React.createElement(Gate));
  const host = new URL(url).hostname;
  const opens = which === "tag" ? (tagSite.shouldLoadPostHog as (h: string) => boolean)(host) : siteModule.shouldLoadPostHog(host);
  if (opens) {
    await waitFor(() => expect(calls.init.length).toBe(1));
  } else {
    await new Promise((r) => setTimeout(r, 50));
  }
  view.unmount();
  return calls;
}

/** The JSON-shaped part of the options (functions dropped), for comparison with the fixture. */
const jsonPart = (o: Options): Options => JSON.parse(JSON.stringify(o)) as Options;

/* ── 1. The fixture is the tag's ──────────────────────────────────────────────────────────── */

describe(`posthog-init-fixture: the fixture is the production options at ${FREEZE_TAG}`, () => {
  it("exists", () => {
    expect(existsSync(join(ROOT, FIXTURE)), `${FIXTURE} is missing`).toBe(true);
  });

  it.each(PRODUCTION_HOSTS)("the tag's gate on %s passes exactly the fixture", async (host) => {
    const fixture = JSON.parse(readRepoFile(FIXTURE)) as Fixture;
    const calls = await runGate("tag", `https://${host}/`);
    expect(calls.init).toHaveLength(1);
    expect(calls.init[0].key).toBe(fixture.key);
    // The tag's options hold no function, so the JSON round trip loses nothing.
    expect(jsonPart(calls.init[0].options)).toStrictEqual(calls.init[0].options);
    expect(calls.init[0].options).toStrictEqual(fixture.options);
    expect(calls.register).toEqual([]);
  });

  it("names the tag file it was taken from", () => {
    const fixture = JSON.parse(readRepoFile(FIXTURE)) as Fixture;
    expect(fixture.source).toContain(`${FREEZE_TAG}:${TAG_GATE}`);
    expect(fixture.key).toBe(POSTHOG_KEY);
  });

  it("the instrument records: the tag's gate stays shut on localhost and on a beta host", async () => {
    expect((await runGate("tag", "http://localhost:3000/")).init).toEqual([]);
    expect((await runGate("tag", "https://betawebsite.kheelona.com/")).init).toEqual([]);
  });
});

/* ── 2. Today's gate on production ────────────────────────────────────────────────────────── */

describe("posthog-init-fixture: today's gate on the production hosts", () => {
  it.each(PRODUCTION_HOSTS)("%s: the init options deep-equal the fixture, and nothing is registered", async (host) => {
    const fixture = JSON.parse(readRepoFile(FIXTURE)) as Fixture;
    const calls = await runGate("today", `https://${host}/products/kheelu?utm_source=meta`);
    expect(calls.init).toHaveLength(1);
    expect(calls.init[0].key).toBe(fixture.key);
    expect(calls.init[0].options).toStrictEqual(fixture.options);
    expect(calls.register).toEqual([]);
    expect(calls.unregister).toEqual([]);
  });

  it("stays shut on localhost and on a Vercel preview", async () => {
    expect((await runGate("today", "http://localhost:3000/")).init).toEqual([]);
    expect((await runGate("today", "https://website-hdn2.vercel.app/")).init).toEqual([]);
  });
});

/* ── 3. Today's gate on beta ──────────────────────────────────────────────────────────────── */

describe("posthog-init-fixture: on the beta hosts the only addition is before_send stamping env beta", () => {
  const stamp = STAMPED_PROPERTIES.find((p) => p.name === "env");

  it("the registry records the stamp as before_send, never register (task 1.4)", () => {
    expect(stamp).toMatchObject({ destination: "posthog-browser", name: "env", value: "beta", status: "new" });
    expect(stamp!.how).toMatch(/before_send/);
  });

  it.each(BETA_HOSTS)("%s: the fixture plus before_send, nothing else", async (host) => {
    const fixture = JSON.parse(readRepoFile(FIXTURE)) as Fixture;
    const calls = await runGate("today", `https://${host}/`);
    expect(calls.init).toHaveLength(1);
    const { before_send: beforeSend, ...rest } = calls.init[0].options;
    expect(rest).toStrictEqual(fixture.options);
    expect(typeof beforeSend).toBe("function");
    expect(calls.register, "N3: nothing may be registered on a beta visit").toEqual([]);
  });

  it("before_send adds env: beta to the event's properties and changes nothing else", async () => {
    const calls = await runGate("today", "https://betastore.kheelona.com/");
    const beforeSend = calls.init[0].options.before_send as (e: unknown) => unknown;
    const event = { uuid: "u1", event: "$pageview", properties: { $host: "betastore.kheelona.com", cta: "hero" }, timestamp: new Date(0) };
    const copy = structuredClone(event);
    expect(beforeSend(event)).toEqual({ ...copy, properties: { ...copy.properties, env: stamp!.value } });
    expect(event, "before_send must not mutate the SDK's event").toEqual(copy);
    expect(beforeSend(null)).toBeNull();
  });

  it("a beta visit with ?internal=1 registers internal: true and still never env (B46, N3)", async () => {
    const set = await runGate("today", "https://betawebsite.kheelona.com/?internal=1");
    expect(set.register).toEqual([{ internal: true }]);
    const clear = await runGate("today", "https://betawebsite.kheelona.com/?internal=0");
    expect(clear.register).toEqual([]);
    expect(clear.unregister).toEqual(["internal"]);
  });

  it("the gate's source calls no register itself (only registerPostHog and the internal flag module)", () => {
    const code = readRepoFile(GATE).replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    expect(code).not.toMatch(/\.register\s*\(/);
    expect(code).not.toMatch(/\bregister_once\s*\(|\bregister_for_session\s*\(/);
  });
});

/* ── 4. The persistence control, against the real SDK ─────────────────────────────────────── */

type Sent = { url: string; events: { uuid?: string; event: string; properties: Record<string, unknown> }[] };

async function decodeBody(body: unknown): Promise<unknown> {
  let bytes: Buffer | null = null;
  if (body instanceof ArrayBuffer) bytes = Buffer.from(body);
  else if (ArrayBuffer.isView(body)) bytes = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
  else if (body instanceof Blob) bytes = Buffer.from(await body.arrayBuffer());
  else if (typeof body === "string") bytes = Buffer.from(body, "utf8");
  if (!bytes) throw new Error(`cannot decode a request body of type ${Object.prototype.toString.call(body)}`);
  const text = bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes).toString("utf8") : bytes.toString("utf8");
  return JSON.parse(text);
}

/** Every /ingest request is recorded and refused (nothing is delivered). */
function blockIngest() {
  const pending: Promise<void>[] = [];
  const sent: Sent[] = [];
  const record = (url: string, body: unknown) => {
    pending.push(
      decodeBody(body).then((json) => {
        const j = json as { batch?: Sent["events"] } & Sent["events"][number];
        sent.push({ url, events: j.batch ?? (Array.isArray(json) ? (json as Sent["events"]) : [j]) });
      }),
    );
  };
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: unknown, init?: { body?: unknown }) => {
      const url = String(input instanceof Request ? input.url : input);
      if (/\/ingest\/(e|i\/v0\/e|batch|s)\//.test(url) && init?.body !== undefined) record(url, init.body);
      throw new TypeError(`blocked by the test: ${url}`);
    }),
  );
  Object.defineProperty(navigator, "sendBeacon", {
    configurable: true,
    value: (url: string, body: unknown) => {
      record(url, body);
      return false;
    },
  });
  const sentEvent = (name: string) => sent.flatMap((s) => s.events).find((e) => e.event === name);
  /** Events by the host they were CAPTURED on ($host), once each: a refused batch is retried
   *  later, possibly after the test has moved to the other host, so the send-time host lies. */
  const eventsFrom = (host: string) => {
    const seen = new Set<unknown>();
    return sent
      .flatMap((s) => s.events)
      .filter((e) => e.properties.$host === host)
      .filter((e) => {
        const id = e.uuid;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
  };
  return { sent, sentEvent, eventsFrom, settle: () => Promise.all(pending) };
}

type PersistenceLike = { persistence?: { props?: Record<string, unknown> }; capture: (e: string, p?: Options) => void };

/** Every PostHog value stored for `key`, in the cookie jar and in localStorage, parsed. */
function stored(key: string): Record<string, unknown>[] {
  const name = `ph_${key}_posthog`;
  const out: Record<string, unknown>[] = [];
  for (const part of document.cookie.split(/;\s*/)) {
    if (part.startsWith(`${name}=`)) out.push(JSON.parse(decodeURIComponent(part.slice(name.length + 1))));
  }
  const ls = window.localStorage.getItem(name);
  if (ls) out.push(JSON.parse(ls));
  return out;
}

const hasEnv = (o: Record<string, unknown>) => Object.prototype.hasOwnProperty.call(o, "env");

describe("posthog-init-fixture: N3 control, real posthog-js, /ingest blocked", () => {
  const net = blockIngest();
  afterAll(() => vi.unstubAllGlobals());

  it(
    "after a beta visit through today's gate, the production page's storage holds no env and its events carry none",
    async () => {
      const fixture = JSON.parse(readRepoFile(FIXTURE)) as Fixture;
      const { default: posthog } = await import("posthog-js");

      // The beta visit: today's real gate module, real SDK (its dynamic import), on betawebsite.
      goTo("https://betawebsite.kheelona.com/?utm_source=qa");
      const { PostHogGate } = await import("@/components/tracking/PostHogGate");
      const view = render(React.createElement(PostHogGate));
      await waitFor(() => expect(posthog.__loaded).toBe(true));
      posthog.capture("qa_probe_beta");
      await waitFor(() => expect(net.sentEvent("qa_probe_beta")).toBeDefined(), { timeout: 8000 });
      await net.settle();
      const betaEvents = net.eventsFrom("betawebsite.kheelona.com");
      expect(betaEvents.map((e) => e.event)).toContain("qa_probe_beta");
      for (const e of betaEvents) expect(e.properties.env, `${e.event} on beta`).toBe("beta");
      expect(stored(POSTHOG_KEY).length, "the SDK stored nothing: the control would prove nothing").toBeGreaterThan(0);
      expect(stored(POSTHOG_KEY).filter(hasEnv), "env was persisted on the beta host").toEqual([]);
      view.unmount();

      // The production page: same cookie jar and storage, the production options (= the fixture, part 2).
      goTo("https://kheelona.com/");
      const prod = posthog.init(POSTHOG_KEY, fixture.options as never, "production_page") as unknown as PersistenceLike;
      prod.capture("qa_probe_production");
      await waitFor(() => expect(net.sentEvent("qa_probe_production")).toBeDefined(), { timeout: 8000 });
      await net.settle();
      expect(prod.persistence?.props && hasEnv(prod.persistence.props), "production persistence holds env").toBe(false);
      expect(stored(POSTHOG_KEY).filter(hasEnv)).toEqual([]);
      const prodEvents = net.eventsFrom("kheelona.com");
      expect(prodEvents.map((e) => e.event)).toContain("qa_probe_production");
      for (const e of prodEvents) expect(hasEnv(e.properties), `${e.event} on production carries env`).toBe(false);
    },
    30_000,
  );

  it(
    "control: a planted register({ env: 'beta' }) on beta DOES reach the production page, so the check above can see it",
    async () => {
      const fixture = JSON.parse(readRepoFile(FIXTURE)) as Fixture;
      const { default: posthog } = await import("posthog-js");
      const CONTROL_KEY = "phc_controlControlControlControlControlControl01";

      goTo("https://betawebsite.kheelona.com/");
      const beta = posthog.init(CONTROL_KEY, fixture.options as never, "control_beta") as unknown as PersistenceLike & {
        register: (p: Options) => void;
      };
      beta.register({ env: "beta" });
      expect(stored(CONTROL_KEY).some(hasEnv)).toBe(true);

      goTo("https://kheelona.com/");
      const prod = posthog.init(CONTROL_KEY, fixture.options as never, "control_production") as unknown as PersistenceLike;
      expect(prod.persistence?.props?.env, "the registered env followed the device to production").toBe("beta");
      prod.capture("qa_control_production");
      await waitFor(() => expect(net.sentEvent("qa_control_production")).toBeDefined(), { timeout: 8000 });
      await net.settle();
      expect(net.sentEvent("qa_control_production")?.properties.env).toBe("beta");
    },
    30_000,
  );
});
