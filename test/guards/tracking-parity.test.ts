import { render } from "@testing-library/react";
import * as React from "react";
import ts from "typescript";
import { afterEach, beforeEach, describe, expect, expectTypeOf, it } from "vitest";
import { shouldLoadGa4 } from "@/components/tracking/GoogleAnalyticsGate";
import { shouldLoadMetaPixel } from "@/components/tracking/MetaPixel";
import { ViewContentTracker } from "@/components/tracking/ViewContentTracker";
import { BETA_HOSTS } from "@/config/env";
import { FULL_AMOUNT_PAISE, LAUNCH_AMOUNT_PAISE, shouldLoadPostHog } from "@/config/site";
import { preorderAnalytics } from "@/features/preorder/lib/analytics";
import { purchaseEventId } from "@/lib/fbq";
import { registerPostHog, resetPostHogForTests } from "@/lib/posthog";
import type { DestinationKey } from "@/lib/tracking/destinations";
import { EVENTS, type NewEventName, type TrackedEvent } from "@/lib/tracking/events";
import { track, type NewEventParams } from "@/lib/tracking/track";
import { isTestOrStory, listFiles, readRepoFile } from "../e2e/support/repo";
import { parseSource } from "../e2e/support/source";
import { isStillLegacy } from "./legacy-paths";

/* tracking-parity (task 2.6; ADR-006; architecture §8.2; tracking inventory parity rows 4-12, "New").
 *
 * The registry (src/lib/tracking/events.ts, proven equal to the inventory by tracking-registry)
 * says what each browser destination receives. This guard runs the code that sends and records
 * what each tool actually receives, through spies on window.gtag, window.fbq and the PostHog
 * instance, then compares the two in both directions:
 *
 * - every preorderAnalytics call (the frozen funnel) emits exactly the registry's names,
 *   destinations and parameters, in order, with values in rupees and the Purchase eventID
 *   purchase_<ref>; every funnel call the registry names exists and no other does;
 * - ViewContentTracker emits exactly the registry's ViewContent payload, its value from the page;
 * - track() sends each new event only to the registry's destinations, never to Meta, with exactly
 *   the registry's parameters, and its parameter types are the registry's (compile-time checks);
 * - GA4 and the Meta Pixel stay shut on both beta hosts, PostHog opens there (D048);
 * - every ViewContentTracker mount outside the legacy code passes valuePaise (B9, ADR-005); since task 5.2 the prop has
 *   no default, so a mount without it does not compile either.
 */

type Emission = { destination: DestinationKey; name: string; params: Record<string, unknown>; eventId?: string };

let emitted: Emission[] = [];
const win = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

beforeEach(() => {
  emitted = [];
  win.gtag = (...a: unknown[]) => {
    if (a[0] === "event") emitted.push({ destination: "ga4", name: a[1] as string, params: (a[2] ?? {}) as Record<string, unknown> });
  };
  /* Every fbq call is recorded. The frozen funnel only ever uses "track" (src/lib/fbq.ts), so any
     other command (trackCustom, or trackSingle* with the pixel id first) is recorded under
     "<command>:<event>", a name no registry row has, and fails the comparison. */
  win.fbq = (...a: unknown[]) => {
    const command = String(a[0]);
    const single = command === "trackSingle" || command === "trackSingleCustom";
    const [event, params, opts] = (single ? a.slice(2) : a.slice(1)) as [unknown, unknown, { eventID?: string } | undefined];
    emitted.push({
      destination: "meta-pixel",
      name: command === "track" ? String(event) : `${command}:${String(event)}`,
      params: (params ?? {}) as Record<string, unknown>,
      ...(opts?.eventID ? { eventId: opts.eventID } : {}),
    });
  };
  registerPostHog({
    capture: (name, params) => emitted.push({ destination: "posthog-browser", name, params: params ?? {} }),
    startSessionRecording: () => {},
    stopSessionRecording: () => {},
    get_distinct_id: () => "d",
  });
});

afterEach(() => {
  delete win.gtag;
  delete win.fbq;
  resetPostHogForTests();
});

/* The spies must see every way a tool can be reached, or a guard built on them is blind. */
describe("tracking-parity instruments", () => {
  it("records every fbq command, not only track: a custom or single-pixel send is a send to Meta", () => {
    win.fbq?.("track", "PageView");
    win.fbq?.("trackCustom", "preorder_form_rejected", { tier: "launch" });
    win.fbq?.("trackSingle", "1051265191046395", "Lead", { value: 1 });
    win.fbq?.("trackSingleCustom", "1051265191046395", "preorder_payment_failed", {});
    expect(emitted.map((e) => pair(e.destination, e.name))).toEqual([
      "meta-pixel PageView",
      "meta-pixel trackCustom:preorder_form_rejected",
      "meta-pixel trackSingle:Lead",
      "meta-pixel trackSingleCustom:preorder_payment_failed",
    ]);
  });
});

/* ── Comparing what was sent with the registry ────────────────────────────────────────────── */

const BROWSER: readonly DestinationKey[] = ["ga4", "meta-pixel", "posthog-browser"];
const pair = (destination: string, name: string) => `${destination} ${name}`;

/** Every (destination, name) the registry rows send to a browser tool. */
function expectedPairs(rows: readonly TrackedEvent[]): string[] {
  return rows.flatMap((r) => r.destinations.filter((d) => BROWSER.includes(d)).map((d) => pair(d, r.name))).sort();
}

function rowFor(e: Emission): TrackedEvent {
  const rows = EVENTS.filter((r) => r.name === e.name && r.destinations.includes(e.destination));
  expect(rows, `the registry has no single row for ${pair(e.destination, e.name)}`).toHaveLength(1);
  return rows[0];
}

/** Parameters exactly the row's, in its order, with its fixed values. */
function expectParamsOf(e: Emission, row: TrackedEvent) {
  expect(Object.keys(e.params), `${pair(e.destination, e.name)}: parameter names or order`).toEqual([...row.params]);
  for (const [key, value] of Object.entries(row.fixed ?? {})) {
    expect(e.params[key], `${pair(e.destination, e.name)}: fixed ${key}`).toEqual(value);
  }
}

/* ── The frozen funnel ────────────────────────────────────────────────────────────────────── */

const ORDER_REF = "KH-A2B3-C4D5";
const PAISE = 49_900;
const TIER = "launch";

/** One sample call per funnel method; the registry's firedBy names the method. */
const FUNNEL_CALLS: Record<keyof typeof preorderAnalytics, () => void> = {
  formStarted: () => preorderAnalytics.formStarted(TIER),
  start: () => preorderAnalytics.start(TIER),
  beginCheckout: () => preorderAnalytics.beginCheckout(PAISE, TIER),
  purchase: () => preorderAnalytics.purchase(ORDER_REF, PAISE, TIER),
  addressSaved: () => preorderAnalytics.addressSaved(ORDER_REF),
  dismissed: () => preorderAnalytics.dismissed(TIER),
};

const funnelRows = (call: string) =>
  EVENTS.filter((r) => r.firedBy === `preorderAnalytics.${call} (src/features/preorder/lib/analytics.ts)`);

describe("tracking-parity: every preorderAnalytics call emits exactly the registry's events", () => {
  it("the registry names exactly the funnel's methods, no more and no fewer", () => {
    const named = new Set(
      EVENTS.map((r) => /^preorderAnalytics\.(\w+) \(/.exec(r.firedBy)?.[1]).filter((c): c is string => Boolean(c)),
    );
    expect([...named].sort()).toEqual(Object.keys(preorderAnalytics).sort());
    expect(Object.keys(FUNNEL_CALLS).sort()).toEqual(Object.keys(preorderAnalytics).sort());
  });

  it.each(Object.keys(FUNNEL_CALLS))("%s", (call) => {
    FUNNEL_CALLS[call as keyof typeof FUNNEL_CALLS]();
    const rows = funnelRows(call);
    expect(rows.length, `no registry row is fired by preorderAnalytics.${call}`).toBeGreaterThan(0);
    expect(emitted.map((e) => pair(e.destination, e.name)).sort()).toEqual(expectedPairs(rows));

    for (const e of emitted) {
      const row = rowFor(e);
      expect(row.status, `${pair(e.destination, e.name)} is an existing event`).toBe("existing");
      expectParamsOf(e, row);
      // Every amount leaves in rupees (paise / 100), never paise (parity row 7).
      if ("value" in e.params) expect(e.params.value).toBe(PAISE / 100);
      if ("tier" in e.params) expect(e.params.tier).toBe(TIER);
      if ("content_category" in e.params) expect(e.params.content_category).toBe(TIER);
      if ("transaction_id" in e.params) expect(e.params.transaction_id).toBe(ORDER_REF);
      if ("order_id" in e.params) expect(e.params.order_id).toBe(ORDER_REF);
      // The dedup key: exactly where the registry has one, shaped as the registry says (parity row 8).
      if (row.eventId) {
        expect(e.eventId).toBe(purchaseEventId(ORDER_REF));
        expect(e.eventId).toBe(row.eventId.replace("<order ref>", ORDER_REF));
      } else {
        expect(e.eventId, `${pair(e.destination, e.name)} carries no eventID`).toBeUndefined();
      }
    }
  });

  it("GA4 and PostHog receive the same names and payloads from every call (inventory §6)", () => {
    for (const fire of Object.values(FUNNEL_CALLS)) fire();
    const strip = (d: DestinationKey) =>
      emitted.filter((e) => e.destination === d).map((e) => JSON.stringify([e.name, e.params]));
    expect(strip("posthog-browser")).toEqual(strip("ga4"));
  });
});

/* ── ViewContentTracker ───────────────────────────────────────────────────────────────────── */

describe("tracking-parity: ViewContentTracker emits the registry's ViewContent", () => {
  const row = EVENTS.find((r) => r.name === "ViewContent")!;

  it.each([
    ["token mode headline", LAUNCH_AMOUNT_PAISE],
    ["full mode headline", FULL_AMOUNT_PAISE],
  ])("%s: exactly the registry's names, order and fixed values; value from valuePaise", (_label, paise) => {
    render(React.createElement(ViewContentTracker, { valuePaise: paise }));
    expect(emitted.map((e) => pair(e.destination, e.name))).toEqual(expectedPairs([row]));
    expectParamsOf(emitted[0], row);
    expect(emitted[0].params.value).toBe(paise / 100);
    expect(emitted[0].eventId).toBeUndefined();
  });

  /* Task 5.2: the legacy product page, the one mount that sent the tag's 4999 by default, is gone, and the default with
     it: every mount passes the offer's headline (4999 in token mode, the two cases above), or it does not compile. */
  it("takes no default value since the legacy product page went (task 5.2)", () => {
    expectTypeOf<Parameters<typeof ViewContentTracker>[0]>().toEqualTypeOf<{ valuePaise: number }>();
  });
});

/* ── track(): the new events ──────────────────────────────────────────────────────────────── */

const NEW_SAMPLES: { [N in NewEventName]: NewEventParams[N] } = {
  preorder_payment_window_opened: { tier: TIER },
  preorder_payment_failed: { tier: TIER, reason_code: "BAD_REQUEST_ERROR", reason: "payment_failed" },
  preorder_form_rejected: { tier: TIER, fields: "phone,pincode" },
};

describe("tracking-parity: track() sends each new event only where the registry says, never to Meta", () => {
  const newRows = EVENTS.filter((r) => r.status === "new");

  it("covers every new event of the registry", () => {
    expect(Object.keys(NEW_SAMPLES).sort()).toEqual(newRows.map((r) => r.name).sort());
  });

  it.each(newRows.map((r) => [r.name, r] as const))("%s", (name, row) => {
    // The sample has exactly the parameter type's keys (an excess or missing key fails to compile),
    // so this proves the type's keys are the registry's.
    expect(Object.keys(NEW_SAMPLES[name as NewEventName])).toEqual([...row.params]);
    track(name as NewEventName, NEW_SAMPLES[name as NewEventName] as never);
    expect(emitted.map((e) => pair(e.destination, e.name)).sort()).toEqual(
      expectedPairs([{ ...row, destinations: row.destinations.filter((d) => d !== "meta-pixel") }]),
    );
    for (const e of emitted) expectParamsOf(e, row);
  });

  it("Meta never receives a new name, from track() or anywhere in the registry", () => {
    for (const [name, params] of Object.entries(NEW_SAMPLES)) track(name as NewEventName, params as never);
    expect(emitted.filter((e) => e.destination === "meta-pixel")).toEqual([]);
    expect(newRows.filter((r) => r.destinations.includes("meta-pixel"))).toEqual([]);
  });

  it("refuses every existing event name, so the funnel can never drift through the dispatcher", () => {
    for (const r of EVENTS.filter((e) => e.status === "existing")) track(r.name as never, { tier: TIER } as never);
    expect(emitted).toEqual([]);
  });
});

/** Compile-time contract (typechecked by tsconfig.guards.json; never run). */
export function trackTypeContract(): void {
  // @ts-expect-error an existing funnel name is not a dispatcher event
  track("purchase", { tier: TIER });
  // @ts-expect-error a registry parameter is missing
  track("preorder_form_rejected", { tier: TIER });
  // @ts-expect-error a parameter the registry does not list
  track("preorder_payment_window_opened", { tier: TIER, email: "parent@example.com" });
}

/* ── The gates on beta (D048) ─────────────────────────────────────────────────────────────── */

describe("tracking-parity: on the beta hosts only PostHog loads (D048, architecture §15.1)", () => {
  it.each([...BETA_HOSTS])("%s: GA4 off, Meta Pixel off, PostHog on", (host) => {
    expect(shouldLoadGa4(host)).toBe(false);
    expect(shouldLoadMetaPixel(host)).toBe(false);
    expect(shouldLoadPostHog(host)).toBe(true);
  });
});

/* ── Every new ViewContentTracker mount passes the offer's value ──────────────────────────── */

/** Lines of `<ViewContentTracker …>` elements without a valuePaise attribute. */
function mountsWithoutValue(path: string, text: string): number[] {
  const sf = parseSource(path, text);
  const out: number[] = [];
  const visit = (node: ts.Node) => {
    if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(sf) === "ViewContentTracker") {
      const has = node.attributes.properties.some(
        (p) => ts.isJsxSpreadAttribute(p) || (ts.isJsxAttribute(p) && p.name.getText(sf) === "valuePaise"),
      );
      if (!has) out.push(sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

describe("tracking-parity: ViewContentTracker mounts pass valuePaise (B9, ADR-005)", () => {
  it("records: finds a mount without the prop and accepts one with it", () => {
    expect(mountsWithoutValue("x.tsx", "const a = <ViewContentTracker />;\nconst b = <ViewContentTracker valuePaise={offer.headlinePaise} />;")).toEqual([1]);
  });

  it("every mount outside the unchanged legacy code passes valuePaise", () => {
    const files = listFiles(["src"]).filter((p) => p.endsWith(".tsx") && !isTestOrStory(p));
    const legacy: string[] = [];
    const problems: string[] = [];
    for (const path of files) {
      const lines = mountsWithoutValue(path, readRepoFile(path));
      if (lines.length === 0) continue;
      if (isStillLegacy(path)) legacy.push(path);
      else problems.push(...lines.map((l) => `${path}:${l}`));
    }
    console.log(`[tracking-parity] legacy mounts without valuePaise (none since 5.2): ${legacy.join(", ") || "none"}`);
    expect(problems, `ViewContentTracker without valuePaise: ${problems.join(", ")}`).toEqual([]);
  });
});
