import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ts from "typescript";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { privacyPage } from "@/content/en-IN/legal/privacy";
import type { LegalPart } from "@/content/types";
import { PreorderForm } from "@/features/preorder/components/PreorderForm";
import { startCheckout, type StartCheckoutInput } from "@/features/preorder/lib/checkout";
import { toPlainText } from "@/lib/content/plain-text";
import { registerPostHog, resetPostHogForTests } from "@/lib/posthog";
import { tagText } from "./e2e/support/repo";

/**
 * The three new checkout events (B11, task 6.2; architecture §8.2; ADR-013).
 *
 * Working default B11 (wiki/site/gate-a-open-items.md §3, confirmed by the main session 2026-10-14): three new events,
 * to GA4 and PostHog only, no database change:
 *   - preorder_payment_window_opened { tier }, right after Razorpay's checkout.open() in checkout.ts;
 *   - preorder_payment_failed { tier, reason_code, reason }, from checkout.on("payment.failed"), registered before open():
 *     Razorpay's error.code and error.reason only, never its description (free text) or its payment and order ids;
 *   - preorder_form_rejected { tier, fields }, from PreorderForm on a submit its validation refuses: the comma-joined
 *     names of the refused fields, never what was typed.
 *
 * What each tool receives is recorded through spies on window.gtag, window.fbq and the PostHog instance, the same
 * instruments as test/guards/tracking-parity.test.ts, and Razorpay is a fake constructor on window.Razorpay that logs
 * each call in the same timeline. checkout.ts and its folder are frozen (ADR-013), so this test lives here, and it
 * also runs the TAG's checkout.ts beside today's: what Razorpay is handed must not change.
 *
 * Every expectation below is a literal written from architecture §8.2 and the tag's funnel
 * (wiki/site/tracking-inventory.md §3), never computed by the code under test.
 */

type Emission = { to: "ga4" | "meta-pixel" | "posthog-browser"; name: string; params: Record<string, unknown>; eventId?: string };

let timeline: string[] = [];
let emitted: Emission[] = [];
const win = window as unknown as {
  gtag?: (...a: unknown[]) => void;
  fbq?: (...a: unknown[]) => void;
  Razorpay?: unknown;
};

function emit(e: Emission) {
  emitted.push(e);
  timeline.push(`${e.to} ${e.name}`);
}

/* ── A fake Razorpay Checkout: the surface checkout.ts uses (constructor, on, open) ─────────── */

type RazorpayHandler = (response: unknown) => void;

class FakeRazorpay {
  static instances: FakeRazorpay[] = [];
  readonly options: Record<string, unknown>;
  readonly handlers = new Map<string, RazorpayHandler[]>();
  opened = 0;
  constructor(options: Record<string, unknown>) {
    this.options = options;
    FakeRazorpay.instances.push(this);
  }
  on(event: string, cb: RazorpayHandler) {
    timeline.push(`razorpay on:${event}`);
    this.handlers.set(event, [...(this.handlers.get(event) ?? []), cb]);
  }
  open() {
    this.opened += 1;
    timeline.push("razorpay open");
  }
  /** What Razorpay's own script does when a payment attempt fails inside the open window. */
  fail(response: unknown) {
    for (const cb of this.handlers.get("payment.failed") ?? []) cb(response);
  }
}
const lastRazorpay = () => FakeRazorpay.instances[FakeRazorpay.instances.length - 1];

/** A failure as Razorpay Checkout reports it (docs: "Handle payment failure"), with every field filled, so a test can
 *  prove which ones leave. The description is free text and the metadata carries the gateway's ids. */
const RAZORPAY_FAILURE = {
  error: {
    code: "BAD_REQUEST_ERROR",
    description: "Your payment could not be completed as this business accepts domestic (Indian) card payments only.",
    source: "customer",
    step: "payment_authentication",
    reason: "payment_failed",
    metadata: { order_id: "order_FAILPROBE0001", payment_id: "pay_FAILPROBE0001" },
  },
};

beforeEach(() => {
  timeline = [];
  emitted = [];
  FakeRazorpay.instances = [];
  win.gtag = (...a: unknown[]) => {
    if (a[0] === "event") emit({ to: "ga4", name: a[1] as string, params: (a[2] ?? {}) as Record<string, unknown> });
  };
  /* Every fbq command is recorded, as tracking-parity does: a custom or single-pixel send is a send to Meta. */
  win.fbq = (...a: unknown[]) => {
    const command = String(a[0]);
    const single = command === "trackSingle" || command === "trackSingleCustom";
    const [event, params, opts] = (single ? a.slice(2) : a.slice(1)) as [unknown, unknown, { eventID?: string } | undefined];
    emit({
      to: "meta-pixel",
      name: command === "track" ? String(event) : `${command}:${String(event)}`,
      params: (params ?? {}) as Record<string, unknown>,
      ...(opts?.eventID ? { eventId: opts.eventID } : {}),
    });
  };
  registerPostHog({
    capture: (name, params) => emit({ to: "posthog-browser", name, params: params ?? {} }),
    startSessionRecording: () => {},
    stopSessionRecording: () => {},
    get_distinct_id: () => "0199-probe-device",
  });
  win.Razorpay = FakeRazorpay;
});

afterEach(() => {
  delete win.gtag;
  delete win.fbq;
  delete win.Razorpay;
  resetPostHogForTests();
  vi.unstubAllGlobals();
});

const INPUT = (): StartCheckoutInput => ({
  keyId: "rzp_test_probe",
  razorpayOrderId: "order_PROBE0001",
  amountPaise: 49_900,
  orderRef: "KH-A2B3-C4D5",
  prefill: { name: "QA Test Parent", email: "qa@example.com", contact: "+919187546483" },
  onPaid: () => {},
  onDismiss: () => {},
  tier: "launch",
});

/** Every emission, serialised, to search for a value that must never leave. */
const everything = () => JSON.stringify(emitted);

/* ── checkout.ts: the payment window ───────────────────────────────────────────────────────── */

describe("checkout.ts reports the payment window to GA4 and PostHog (B11)", () => {
  it("registers payment.failed before it opens the window, and reports the window right after open()", async () => {
    await expect(startCheckout(INPUT())).resolves.toBe(true);
    expect(timeline).toEqual([
      "razorpay on:payment.failed",
      "razorpay open",
      "ga4 preorder_payment_window_opened",
      "posthog-browser preorder_payment_window_opened",
    ]);
    expect(emitted.map((e) => [e.to, e.name, e.params])).toEqual([
      ["ga4", "preorder_payment_window_opened", { tier: "launch" }],
      ["posthog-browser", "preorder_payment_window_opened", { tier: "launch" }],
    ]);
  });

  it("reports a failed payment with Razorpay's error code and reason, and nothing else of the failure", async () => {
    await startCheckout(INPUT());
    emitted = [];
    lastRazorpay().fail(RAZORPAY_FAILURE);
    expect(emitted.map((e) => [e.to, e.name, e.params])).toEqual([
      ["ga4", "preorder_payment_failed", { tier: "launch", reason_code: "BAD_REQUEST_ERROR", reason: "payment_failed" }],
      ["posthog-browser", "preorder_payment_failed", { tier: "launch", reason_code: "BAD_REQUEST_ERROR", reason: "payment_failed" }],
    ]);
    for (const value of ["domestic", "customer", "payment_authentication", "order_FAILPROBE0001", "pay_FAILPROBE0001"]) {
      expect(everything(), `${value} left with the failure event`).not.toContain(value);
    }
  });

  it("reports each failed attempt in the same open window (Razorpay lets the parent retry)", async () => {
    await startCheckout(INPUT());
    emitted = [];
    lastRazorpay().fail(RAZORPAY_FAILURE);
    lastRazorpay().fail({ error: { code: "GATEWAY_ERROR", reason: "payment_cancelled" } });
    expect(emitted.filter((e) => e.to === "ga4").map((e) => e.params)).toEqual([
      { tier: "launch", reason_code: "BAD_REQUEST_ERROR", reason: "payment_failed" },
      { tier: "launch", reason_code: "GATEWAY_ERROR", reason: "payment_cancelled" },
    ]);
  });

  it.each([
    ["no error object", undefined, { reason_code: "unknown", reason: "unknown" }],
    ["an empty error", { error: {} }, { reason_code: "unknown", reason: "unknown" }],
    ["sentences instead of codes", { error: { code: "Card declined for priya@example.com", reason: "call 9187546483" } }, { reason_code: "unknown", reason: "unknown" }],
    ["numbers instead of strings", { error: { code: 502, reason: { why: "x" } } }, { reason_code: "unknown", reason: "unknown" }],
    ["one code and one sentence", { error: { code: "SERVER_ERROR", reason: "a parent typed this" } }, { reason_code: "SERVER_ERROR", reason: "unknown" }],
    /* Review of 6.2: a single token is not yet a code. Razorpay's codes are upper-case words joined by underscores
       (BAD_REQUEST_ERROR) and its reasons lower-case ones (payment_failed); a bare number or one word could be a
       phone number or a name, so it is sent as "unknown". */
    ["a bare number as the code (a phone number)", { error: { code: "9187546483" } }, { reason_code: "unknown", reason: "unknown" }],
    ["one word as the reason (a first name)", { error: { reason: "Priya" } }, { reason_code: "unknown", reason: "unknown" }],
    ["a name joined by an underscore", { error: { code: "Priya_Menon", reason: "Priya_Menon" } }, { reason_code: "unknown", reason: "unknown" }],
    ["a code of the right shape but too long", { error: { code: `${"A".repeat(40)}_${"B".repeat(40)}` } }, { reason_code: "unknown", reason: "unknown" }],
  ])("sends only plain codes: %s", async (_label, response, expected) => {
    await startCheckout(INPUT());
    emitted = [];
    lastRazorpay().fail(response);
    expect(emitted.map((e) => [e.to, e.params])).toEqual([
      ["ga4", { tier: "launch", ...expected }],
      ["posthog-browser", { tier: "launch", ...expected }],
    ]);
    expect(everything()).not.toMatch(/priya|9187546483|typed/i);
  });

  it("never sends either event to Meta", async () => {
    await startCheckout(INPUT());
    lastRazorpay().fail(RAZORPAY_FAILURE);
    expect(emitted.length).toBeGreaterThan(0);
    expect(emitted.filter((e) => e.to === "meta-pixel")).toEqual([]);
  });

  it("reports nothing when Razorpay's script cannot load, and answers false as before", async () => {
    delete win.Razorpay;
    const answer = startCheckout(INPUT());
    const script = [...document.head.querySelectorAll("script")].find((s) => s.src.includes("checkout.razorpay.com"));
    expect(script, "loadCheckout appends Razorpay's script").toBeDefined();
    script!.dispatchEvent(new Event("error"));
    await expect(answer).resolves.toBe(false);
    script!.remove();
    expect(timeline).toEqual([]);
  });

  it("answers true with the window open even when a measuring tool throws", async () => {
    win.gtag = () => {
      throw new Error("a tool broke");
    };
    await expect(startCheckout(INPUT())).resolves.toBe(true);
    expect(lastRazorpay().opened).toBe(1);
    expect(() => lastRazorpay().fail(RAZORPAY_FAILURE)).not.toThrow();
  });
});

/* ── checkout.ts: Razorpay is handed exactly what the tag handed it ────────────────────────── */

type CheckoutApi = { startCheckout: (input: StartCheckoutInput) => Promise<boolean> };

/** The tag's own checkout.ts, compiled and evaluated in this window (it has no imports). */
function tagCheckout(): CheckoutApi {
  const text = tagText("src/features/preorder/lib/checkout.ts");
  if (text === null) throw new Error("src/features/preorder/lib/checkout.ts is missing at the freeze tag");
  expect(text, "the tag's checkout.ts gained an import; this loader cannot evaluate it").not.toMatch(/^\s*import\s/m);
  const js = ts.transpileModule(text, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports: Record<string, unknown> = {};
  new Function("exports", js)(exports);
  return exports as unknown as CheckoutApi;
}

describe("checkout.ts hands Razorpay what the tag's checkout.ts handed it (ADR-013)", () => {
  it("the same options, the same handlers, one open, the same answer; the tier never reaches Razorpay", async () => {
    const input = INPUT();
    const thenAnswer = await tagCheckout().startCheckout(input);
    const then = lastRazorpay();
    const nowAnswer = await startCheckout(input);
    const now = lastRazorpay();
    expect(now).not.toBe(then);
    expect(nowAnswer).toBe(thenAnswer);
    expect(now.options).toEqual(then.options);
    expect(now.options.handler).toBe(input.onPaid);
    expect((now.options.modal as { ondismiss: unknown }).ondismiss).toBe(input.onDismiss);
    expect([then.opened, now.opened]).toEqual([1, 1]);
    expect(JSON.stringify(now.options)).not.toContain("launch");
    // Literals from the tag (tracking inventory §10; architecture §16.3: the theme colour stays).
    expect(now.options).toMatchObject({
      key: "rzp_test_probe",
      order_id: "order_PROBE0001",
      amount: 49_900,
      currency: "INR",
      name: "Kheelona",
      description: "Kheelu pre-order KH-A2B3-C4D5",
      notes: { order_ref: "KH-A2B3-C4D5" },
      theme: { color: "#EF762F" },
    });
  });
});

/* ── PreorderForm: a refused submit ───────────────────────────────────────────────────────── */

const CREATED = {
  orderRef: "KH-A2B3-C4D5",
  razorpayOrderId: "order_PROBE0001",
  keyId: "rzp_test_probe",
  amountPaise: 49_900,
  addressToken: "1.probe-token",
  prefill: {},
};

function stubCreateOrder() {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(CREATED), { status: 200, headers: { "content-type": "application/json" } }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function type(container: HTMLElement, user: ReturnType<typeof userEvent.setup>, values: Record<string, string>) {
  for (const [name, value] of Object.entries(values)) await user.type(container.querySelector(`[name="${name}"]`)!, value);
}

async function submit(container: HTMLElement) {
  await act(async () => {
    container.querySelector("form")!.requestSubmit();
  });
}

describe("PreorderForm reports a refused submit by field name only (B11)", () => {
  it("an empty submit names every field, in the form's order, to GA4 and PostHog, and calls no server", async () => {
    const fetchMock = stubCreateOrder();
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await submit(container);
    expect(emitted.map((e) => [e.to, e.name, e.params])).toEqual([
      ["ga4", "preorder_form_rejected", { tier: "launch", fields: "parentName,phone,email,childAge,accepted" }],
      ["posthog-browser", "preorder_form_rejected", { tier: "launch", fields: "parentName,phone,email,childAge,accepted" }],
    ]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("names only the refused fields, and never what the parent typed", async () => {
    stubCreateOrder();
    const user = userEvent.setup();
    const { container } = render(<PreorderForm tier="blr-aug" signature="sig" amountLabel="₹99" />);
    await type(container, user, { parentName: "Priya Menon", phone: "12345", email: "priya@example.com", childAge: "4" });
    emitted = [];
    await submit(container);
    expect(emitted.map((e) => [e.to, e.name, e.params])).toEqual([
      ["ga4", "preorder_form_rejected", { tier: "blr-aug", fields: "phone,accepted" }],
      ["posthog-browser", "preorder_form_rejected", { tier: "blr-aug", fields: "phone,accepted" }],
    ]);
    expect(everything()).not.toMatch(/Priya|Menon|12345|priya@example\.com|sig/);
  });

  it("reports nothing as rejected when the submit is valid", async () => {
    stubCreateOrder();
    const user = userEvent.setup();
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await type(container, user, { parentName: "Priya Menon", phone: "9187546483", email: "priya@example.com", childAge: "4" });
    await user.click(container.querySelector('[name="accepted"]')!);
    await submit(container);
    await waitFor(() => expect(lastRazorpay()?.opened).toBe(1));
    expect(emitted.map((e) => e.name)).not.toContain("preorder_form_rejected");
  });
});

/* ── /privacy: a tracking change ships with its disclosure (tracking inventory, "must not change" 13) ── */

describe("/privacy names the new steps in the blocks of the two tools that receive them (B11)", () => {
  /** The parts as the content shape types them (the module's literal types are narrower, part by part). */
  const parts: readonly LegalPart[] = privacyPage.parts;
  const toolText = (name: string) => {
    const block = parts
      .flatMap((p) => p.blocks)
      .flatMap((b) => (b.kind === "tools" ? b.tools : []))
      .find((t) => toPlainText(t.name) === name);
    expect(block, `/privacy has no block for ${name}`).toBeDefined();
    return JSON.stringify(block!.blocks).replace(/[’‘]/g, "'");
  };

  it("Google Analytics: a refused answer (which, never what was typed) and a failed payment with Razorpay's code", () => {
    const ga4 = toolText("Google Analytics");
    expect(ga4).toContain("being asked to correct an answer (which answers, never what you typed)");
    expect(ga4).toContain("opening and closing the payment window");
    expect(ga4).toContain("a payment that fails (with Razorpay's code for why)");
  });

  it("PostHog: the same steps as Google Analytics", () => {
    expect(toolText("PostHog")).toContain("It is told the same steps of a pre-order as Google Analytics.");
  });

  it("the Meta blocks gain none of them (Meta receives no new event)", () => {
    for (const name of ["Meta Pixel", "Meta Conversions API"]) {
      expect(toolText(name)).not.toMatch(/correct an answer|payment that fails|payment window/);
    }
  });
});

/* ── The whole journey: the existing funnel is unchanged around the new events ────────────────── */

describe("tracking parity across a whole pre-order journey (B11; brief §9.4)", () => {
  it("the tag's events, names, payloads and order, with the three new events in their places and none to Meta", async () => {
    stubCreateOrder();
    const user = userEvent.setup();
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);

    await type(container, user, { parentName: "Priya Menon" }); // preorder_form_started, once
    await submit(container); // refused: four fields still to fill
    await type(container, user, { phone: "9187546483", email: "priya@example.com", childAge: "4" });
    await user.click(container.querySelector('[name="accepted"]')!);
    await submit(container); // valid: create-order, then the window
    await waitFor(() => expect(lastRazorpay()?.opened).toBe(1));
    act(() => lastRazorpay().fail(RAZORPAY_FAILURE)); // an attempt fails inside the window
    act(() => (lastRazorpay().options.modal as { ondismiss: () => void }).ondismiss()); // the parent closes it

    const journey = emitted.map((e) => [e.to, e.name, e.params, e.eventId ?? null]);
    const NEW = ["preorder_payment_window_opened", "preorder_payment_failed", "preorder_form_rejected"];

    // The tag's funnel (inventory §3, §4, §6), untouched: drop the three new names and nothing else differs.
    expect(journey.filter(([, name]) => !NEW.includes(name as string))).toEqual([
      ["ga4", "preorder_form_started", { tier: "launch" }, null],
      ["posthog-browser", "preorder_form_started", { tier: "launch" }, null],
      ["ga4", "preorder_start", { tier: "launch" }, null],
      ["posthog-browser", "preorder_start", { tier: "launch" }, null],
      ["ga4", "begin_checkout", { currency: "INR", value: 499, tier: "launch" }, null],
      ["meta-pixel", "InitiateCheckout", { currency: "INR", value: 499, content_category: "launch" }, null],
      ["posthog-browser", "begin_checkout", { currency: "INR", value: 499, tier: "launch" }, null],
      ["ga4", "preorder_dismissed", { tier: "launch" }, null],
      ["posthog-browser", "preorder_dismissed", { tier: "launch" }, null],
    ]);

    // And the whole journey, the new events where architecture §8.2 places them.
    expect(journey.map(([to, name]) => `${to} ${name}`)).toEqual([
      "ga4 preorder_form_started",
      "posthog-browser preorder_form_started",
      "ga4 preorder_form_rejected",
      "posthog-browser preorder_form_rejected",
      "ga4 preorder_start",
      "posthog-browser preorder_start",
      "ga4 begin_checkout",
      "meta-pixel InitiateCheckout",
      "posthog-browser begin_checkout",
      "ga4 preorder_payment_window_opened",
      "posthog-browser preorder_payment_window_opened",
      "ga4 preorder_payment_failed",
      "posthog-browser preorder_payment_failed",
      "ga4 preorder_dismissed",
      "posthog-browser preorder_dismissed",
    ]);
    expect(journey.filter(([to, name]) => to === "meta-pixel" && NEW.includes(name as string))).toEqual([]);
    expect(everything()).not.toMatch(/Priya|Menon|9187546483|priya@example\.com|domestic|pay_FAILPROBE0001/);
  });
});
