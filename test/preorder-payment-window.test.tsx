import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { PreorderForm } from "@/features/preorder/components/PreorderForm";
import { POSTHOG_KEY } from "@/config/site";
import { registerPostHog, resetPostHogForTests } from "@/lib/posthog";

/**
 * The payment sheet's two ways of ending without a payment (D070 / B7c; K-174).
 *
 * 1. The explicit close (x or Back in Razorpay) calls `modal.ondismiss`, and `preorder_dismissed` still reaches PostHog
 *    and GA4 once with `{ tier }`. That wiring is the frozen funnel (analytics.ts, checkout.ts) and is NOT changed by B7c;
 *    this proves it still stands.
 * 2. The parent who leaves the page with the sheet open (a UPI app, a locked phone, a closed in-app browser) fires no
 *    `ondismiss`. `preorder_payment_window_hidden` reports it: once per opened sheet, on the first `visibilitychange` to
 *    hidden, at once and by beacon, with `{ tier }`, to PostHog only; the listener goes away on paid, dismissed or unmount.
 *
 * It drives the real form and the real `startCheckout` against a fake Razorpay (it records its options, so the test can
 * "close" or "pay" the sheet) and stand-ins for gtag, fbq, PostHog, sendBeacon and fetch. Nothing leaves the process; there
 * is no network and no payment. Every expectation is a literal from the spec (output/2026-W48/engineering/B7c-spec.md).
 */

const CREATED = {
  orderRef: "KH-A2B3-C4D5",
  razorpayOrderId: "order_PROBE0001",
  keyId: "rzp_test_probe",
  amountPaise: 49_900,
  addressToken: "1.probe-token",
  prefill: {},
};
const PAID = { razorpay_order_id: "order_PROBE0001", razorpay_payment_id: "pay_PROBE0001", razorpay_signature: "sig_probe_0001" };

type RazorpayOptions = { handler: (response: typeof PAID) => void; modal: { ondismiss: () => void } };

/** The fake sheet: `open()` does nothing (the sheet is "up"); the test closes or pays it through the options. */
class FakeRazorpay {
  static last: RazorpayOptions | undefined;
  constructor(options: RazorpayOptions) {
    FakeRazorpay.last = options;
  }
  on() {}
  open() {}
}

class FakeBlob {
  constructor(
    readonly parts: string[],
    readonly options: { type: string },
  ) {}
}

const win = window as unknown as { Razorpay?: unknown; gtag?: unknown; fbq?: unknown };
const STORE = "store.kheelona.com";

let gtag: ReturnType<typeof vi.fn>;
let fbq: ReturnType<typeof vi.fn>;
let capture: Mock<(event: string, properties?: Record<string, unknown>) => void>;
let sendBeacon: ReturnType<typeof vi.fn>;
let fetchMock: ReturnType<typeof vi.fn>;
let beacons: { event: string; properties: Record<string, unknown>; url: string; apiKey: string }[];
let assign: ReturnType<typeof vi.fn>;
/** What create-order answers: a fresh Response per call (a body can be read once). */
let createOrder: () => Promise<Response>;
const created = () => new Response(JSON.stringify(CREATED), { status: 200, headers: { "content-type": "application/json" } });
let visibilityListeners: { added: number; removed: number };

function stubPage(host: string) {
  assign = vi.fn();
  vi.stubGlobal("location", {
    hostname: host,
    host,
    pathname: "/",
    search: "?utm_source=meta&email=a%40b.c",
    origin: `https://${host}`,
    href: `https://${host}/`,
    assign,
  });
}

beforeEach(() => {
  win.Razorpay = FakeRazorpay;
  FakeRazorpay.last = undefined;
  gtag = vi.fn();
  fbq = vi.fn();
  capture = vi.fn<(event: string, properties?: Record<string, unknown>) => void>();
  win.gtag = gtag;
  win.fbq = fbq;
  registerPostHog({ capture, startSessionRecording: vi.fn(), stopSessionRecording: vi.fn(), get_distinct_id: () => "live-device-id" });

  beacons = [];
  vi.stubGlobal("Blob", FakeBlob);
  sendBeacon = vi.fn((url: string, blob: FakeBlob) => {
    const payload = JSON.parse(Buffer.from(decodeURIComponent(blob.parts.join("").slice("data=".length)), "base64").toString("utf8"));
    beacons.push({ url, apiKey: payload.api_key, event: payload.batch[0].event, properties: payload.batch[0].properties });
    return true;
  });
  Object.defineProperty(navigator, "sendBeacon", { value: sendBeacon, configurable: true, writable: true });

  createOrder = () => Promise.resolve(created());
  fetchMock = vi.fn((url: string) => {
    if (url === "/api/preorder/create-order") return createOrder();
    if (url === "/api/preorder/confirm") return Promise.resolve(new Response("{}", { status: 200 }));
    throw new Error(`unexpected request to ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);

  visibilityListeners = { added: 0, removed: 0 };
  const add = document.addEventListener.bind(document);
  const remove = document.removeEventListener.bind(document);
  vi.spyOn(document, "addEventListener").mockImplementation(((type: string, ...rest: unknown[]) => {
    if (type === "visibilitychange") visibilityListeners.added++;
    return (add as (...a: unknown[]) => void)(type, ...rest);
  }) as typeof document.addEventListener);
  vi.spyOn(document, "removeEventListener").mockImplementation(((type: string, ...rest: unknown[]) => {
    if (type === "visibilitychange") visibilityListeners.removed++;
    return (remove as (...a: unknown[]) => void)(type, ...rest);
  }) as typeof document.removeEventListener);

  stubPage(STORE);
});

afterEach(() => {
  delete win.Razorpay;
  delete win.gtag;
  delete win.fbq;
  resetPostHogForTests();
  setVisibility("visible");
  delete (navigator as unknown as { sendBeacon?: unknown }).sendBeacon;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function setVisibility(state: "visible" | "hidden") {
  Object.defineProperty(document, "visibilityState", { value: state, configurable: true });
}
/** The page goes to the background (or comes back), as a phone does when a UPI app takes over. */
function visibilityChange(state: "visible" | "hidden") {
  setVisibility(state);
  document.dispatchEvent(new Event("visibilitychange"));
}

/** Types the details, ticks the consent and taps Pay; resolves once Razorpay's sheet is up (the fake recorded its options). */
async function openTheSheet() {
  const user = userEvent.setup();
  const view = render(<PreorderForm tier="launch" amountLabel="₹499" />);
  const values: Record<string, string> = { parentName: "QA Test Parent", phone: "9187546483", email: "qa@example.com", childAge: "2.5" };
  for (const [name, value] of Object.entries(values)) await user.type(view.container.querySelector(`[name="${name}"]`)!, value);
  await user.click(view.container.querySelector('[name="accepted"]')!);
  await user.click(view.container.querySelector('button[type="submit"]')!);
  await waitFor(() => expect(FakeRazorpay.last).toBeDefined());
  // `startCheckout` returns after open(); the form starts listening in the next microtask.
  await act(async () => {
    await Promise.resolve();
  });
  return view;
}

/** Razorpay's own callbacks, inside act() because the form sets state in them. */
const dismissSheet = () => act(() => FakeRazorpay.last!.modal.ondismiss());
const paySheet = () => act(() => FakeRazorpay.last!.handler(PAID));

const hiddenBeacons = () => beacons.filter((b) => b.event === "preorder_payment_window_hidden");
const calledWith = (mock: ReturnType<typeof vi.fn>, name: string) => mock.mock.calls.filter((c) => c.includes(name));

describe("preorder_dismissed still fires when the sheet is closed (the frozen funnel, unchanged by B7c)", () => {
  it("modal.ondismiss reaches PostHog and GA4 once each with { tier }, and not Meta", async () => {
    await openTheSheet();
    await dismissSheet();

    expect(capture.mock.calls.filter(([name]) => name === "preorder_dismissed")).toEqual([["preorder_dismissed", { tier: "launch" }]]);
    expect(gtag.mock.calls.filter(([, name]) => name === "preorder_dismissed")).toEqual([["event", "preorder_dismissed", { tier: "launch" }]]);
    expect(calledWith(fbq, "preorder_dismissed")).toEqual([]);
    // An explicit close is not "left the page": no beacon at all.
    expect(beacons).toEqual([]);
  });
});

describe("preorder_payment_window_hidden: the parent left the page with the sheet open (D070 / B7c)", () => {
  it("the first hide sends one beacon at once, with { tier }, to PostHog's proxy, and nothing else", async () => {
    await openTheSheet();
    expect(hiddenBeacons()).toEqual([]);
    expect(visibilityListeners.added).toBe(1);

    visibilityChange("hidden");

    expect(hiddenBeacons()).toHaveLength(1);
    const [one] = hiddenBeacons();
    expect(one.url).toBe("/ingest/e/?compression=base64");
    expect(one.apiKey).toBe(POSTHOG_KEY);
    expect(one.properties).toMatchObject({
      token: POSTHOG_KEY,
      distinct_id: "live-device-id",
      tier: "launch",
      $host: STORE,
      $pathname: "/",
      $current_url: "https://store.kheelona.com/?utm_source=meta",
      $lib: "kh-beacon",
      $process_person_profile: false,
    });
    // Not through the SDK's queue, GA4 or Meta, and no request other than the two the form itself makes.
    expect(calledWith(capture, "preorder_payment_window_hidden")).toEqual([]);
    expect(calledWith(gtag, "preorder_payment_window_hidden")).toEqual([]);
    expect(fbq).not.toHaveBeenCalledWith(expect.anything(), "preorder_payment_window_hidden", expect.anything());
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(["/api/preorder/create-order"]);
    // Nothing the parent typed is in the body.
    expect(JSON.stringify(one)).not.toMatch(/QA Test Parent|9187546483|qa@example\.com|2\.5|KH-A2B3|a%40b/);
    // The listener removed itself with the first hide.
    expect(visibilityListeners.removed).toBe(1);
  });

  it("is once per opened sheet: hiding, coming back and hiding again sends no second beacon", async () => {
    await openTheSheet();
    visibilityChange("hidden");
    visibilityChange("visible");
    visibilityChange("hidden");
    expect(hiddenBeacons()).toHaveLength(1);
  });

  it("coming back to the page (visible) is not a hide", async () => {
    await openTheSheet();
    visibilityChange("visible");
    expect(hiddenBeacons()).toEqual([]);
    expect(visibilityListeners.removed).toBe(0);
  });

  it("is not sent when the page is hidden before the sheet is up (while the order is being created)", async () => {
    let release!: () => void;
    createOrder = () =>
      new Promise<Response>((resolve) => {
        release = () => resolve(created());
      });
    const user = userEvent.setup();
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);
    for (const [name, value] of Object.entries({ parentName: "QA Test Parent", phone: "9187546483", email: "qa@example.com", childAge: "2.5" })) {
      await user.type(container.querySelector(`[name="${name}"]`)!, value);
    }
    await user.click(container.querySelector('[name="accepted"]')!);
    await user.click(container.querySelector('button[type="submit"]')!);
    visibilityChange("hidden");
    visibilityChange("visible");
    expect(hiddenBeacons()).toEqual([]);
    expect(visibilityListeners.added).toBe(0);
    release();
    await waitFor(() => expect(FakeRazorpay.last).toBeDefined());
    await act(async () => {
      await Promise.resolve();
    });
    // The sheet is up now: from here a hide counts.
    visibilityChange("hidden");
    expect(hiddenBeacons()).toHaveLength(1);
  });

  it("is not sent while Razorpay's script is still loading (the sheet is not up yet), only once it opens", async () => {
    // First visit to the store: Razorpay's script is fetched on the first Pay tap (checkout.ts), which can take a moment.
    delete win.Razorpay;
    const user = userEvent.setup();
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);
    for (const [name, value] of Object.entries({ parentName: "QA Test Parent", phone: "9187546483", email: "qa@example.com", childAge: "2.5" })) {
      await user.type(container.querySelector(`[name="${name}"]`)!, value);
    }
    await user.click(container.querySelector('[name="accepted"]')!);
    await user.click(container.querySelector('button[type="submit"]')!);
    const script = await waitFor(() => {
      const el = document.head.querySelector<HTMLScriptElement>('script[src*="checkout.razorpay.com"]');
      expect(el).not.toBeNull();
      return el!;
    });

    visibilityChange("hidden");
    visibilityChange("visible");
    expect(hiddenBeacons()).toEqual([]);
    expect(visibilityListeners.added).toBe(0);

    // The script arrives and the sheet opens.
    win.Razorpay = FakeRazorpay;
    await act(async () => {
      script.onload?.(new Event("load"));
    });
    await waitFor(() => expect(FakeRazorpay.last).toBeDefined());
    await act(async () => {
      await Promise.resolve();
    });
    expect(visibilityListeners.added).toBe(1);
    visibilityChange("hidden");
    expect(hiddenBeacons()).toHaveLength(1);
    script.remove();
  });

  it("stops listening when the sheet is dismissed: a later hide sends nothing", async () => {
    await openTheSheet();
    expect(visibilityListeners.added).toBe(1);
    await dismissSheet();
    expect(visibilityListeners.removed).toBe(1);
    visibilityChange("hidden");
    expect(hiddenBeacons()).toEqual([]);
  });

  it("stops listening when the payment succeeds: a hide on the way to /thanks sends nothing", async () => {
    await openTheSheet();
    expect(visibilityListeners.added).toBe(1);
    await paySheet();
    expect(visibilityListeners.removed).toBe(1);
    expect(assign).toHaveBeenCalledWith("/thanks?ref=KH-A2B3-C4D5&t=1.probe-token");
    visibilityChange("hidden");
    expect(hiddenBeacons()).toEqual([]);
  });

  it("stops listening when the form unmounts", async () => {
    const view = await openTheSheet();
    expect(visibilityListeners.added).toBe(1);
    view.unmount();
    expect(visibilityListeners.removed).toBe(1);
    visibilityChange("hidden");
    expect(hiddenBeacons()).toEqual([]);
  });

  it("a second sheet after a dismiss is watched again, once", async () => {
    const user = userEvent.setup();
    const { container } = await openTheSheet();
    await dismissSheet();
    FakeRazorpay.last = undefined;
    await user.click(container.querySelector('button[type="submit"]')!);
    await waitFor(() => expect(FakeRazorpay.last).toBeDefined());
    await act(async () => {
      await Promise.resolve();
    });
    expect(visibilityListeners.added).toBe(2);
    visibilityChange("hidden");
    visibilityChange("visible");
    visibilityChange("hidden");
    expect(hiddenBeacons()).toHaveLength(1);
  });

  it("sends nothing on a host PostHog does not load on (localhost, a preview), and the payment is unaffected", async () => {
    stubPage("website-hdn2.vercel.app");
    await openTheSheet();
    visibilityChange("hidden");
    expect(sendBeacon).not.toHaveBeenCalled();
    await paySheet();
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("a beacon that throws never reaches the payment: paying after a failed send still goes to /thanks", async () => {
    sendBeacon.mockImplementation(() => {
      throw new Error("beacon boom");
    });
    await openTheSheet();
    expect(() => visibilityChange("hidden")).not.toThrow();
    await paySheet();
    expect(assign).toHaveBeenCalledTimes(1);
  });
});
