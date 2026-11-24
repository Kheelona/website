import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PreorderForm } from "@/features/preorder/components/PreorderForm";

/**
 * The browser's "payment done" request must outlive the page (D070 / B4; K-170).
 *
 * `onPaid` fires `POST /api/preorder/confirm` and navigates to /thanks in the same tick. Without `keepalive: true` the
 * navigation cancels the request: iOS Safari logs "TypeError: Load failed" (order 1, 24 Nov) and only the Razorpay
 * webhook confirms the order. `PreorderForm.tsx` and its checkout tests are frozen (ADR-013: a frozen test file takes
 * literal-only patches), so this proof is a new file. It drives the real form and the real `startCheckout` against a fake
 * Razorpay whose payment window "pays" by calling the `handler` the form handed over, and records every fetch and every
 * navigation. Nothing leaves the process: fetch is a stub, there is no network and no payment.
 *
 * Every expectation is a literal written from the spec (output/2026-W48/engineering/B4-spec.md), not computed by the
 * code under test.
 */

const CREATED = {
  orderRef: "KH-A2B3-C4D5",
  razorpayOrderId: "order_PROBE0001",
  keyId: "rzp_test_probe",
  amountPaise: 49_900,
  addressToken: "1.probe-token",
  prefill: {},
};

/** What Razorpay's own script hands `handler` after a successful payment: obviously fake values. */
const PAID = {
  razorpay_order_id: "order_PROBE0001",
  razorpay_payment_id: "pay_PROBE0001",
  razorpay_signature: "sig_probe_0001",
};

type RazorpayOptions = { handler: (response: typeof PAID) => void };

/** The fake payment window: `open()` returns at once, and a moment later the parent "pays". */
class FakeRazorpay {
  constructor(private readonly options: RazorpayOptions) {}
  on() {}
  open() {
    setTimeout(() => this.options.handler(PAID), 0);
  }
}

const win = window as unknown as { Razorpay?: unknown };
let assign: ReturnType<typeof vi.fn>;
let fetchMock: ReturnType<typeof vi.fn>;

/** `confirm` answers like the server, or never (a request that is still in flight when the page goes). */
function stubFetch(confirm: "answers" | "never") {
  fetchMock = vi.fn((url: string) => {
    if (url === "/api/preorder/create-order") {
      return Promise.resolve(new Response(JSON.stringify(CREATED), { status: 200, headers: { "content-type": "application/json" } }));
    }
    if (url === "/api/preorder/confirm") {
      return confirm === "never"
        ? new Promise<Response>(() => {})
        : Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } }));
    }
    throw new Error(`unexpected request to ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
}

beforeEach(() => {
  win.Razorpay = FakeRazorpay;
  /* jsdom's location.assign cannot be spied on (it is unforgeable), so the global is replaced by a copy that records it. */
  assign = vi.fn();
  vi.stubGlobal("location", { ...window.location, assign });
});

afterEach(() => {
  delete win.Razorpay;
  vi.unstubAllGlobals();
});

async function payThroughTheForm() {
  const user = userEvent.setup();
  const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);
  const values: Record<string, string> = {
    parentName: "QA Test Parent",
    phone: "9187546483",
    email: "qa@example.com",
    childAge: "2.5",
  };
  for (const [name, value] of Object.entries(values)) await user.type(container.querySelector(`[name="${name}"]`)!, value);
  await user.click(container.querySelector('[name="accepted"]')!);
  await user.click(container.querySelector('button[type="submit"]')!);
  await waitFor(() => expect(assign).toHaveBeenCalled());
}

const confirmCalls = () => fetchMock.mock.calls.filter(([url]) => url === "/api/preorder/confirm");

describe("PreorderForm: the confirm request survives the move to /thanks (D070 / B4)", () => {
  it("sends /api/preorder/confirm with keepalive: true, then goes to /thanks exactly once", async () => {
    stubFetch("answers");
    await payThroughTheForm();

    const calls = confirmCalls();
    expect(calls).toHaveLength(1);
    const [, init] = calls[0] as [string, RequestInit];
    expect(init.keepalive).toBe(true);
    // The request is otherwise what it was: a POST of the three Razorpay values, as JSON.
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "content-type": "application/json" });
    expect(JSON.parse(init.body as string)).toEqual({
      razorpayOrderId: "order_PROBE0001",
      razorpayPaymentId: "pay_PROBE0001",
      razorpaySignature: "sig_probe_0001",
    });

    // One navigation, to /thanks with the order reference and the address token, after the confirm request was sent.
    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith("/thanks?ref=KH-A2B3-C4D5&t=1.probe-token");
    const confirmAt = fetchMock.mock.invocationCallOrder[fetchMock.mock.calls.findIndex(([url]) => url === "/api/preorder/confirm")];
    expect(confirmAt).toBeLessThan(assign.mock.invocationCallOrder[0]);
  });

  it("still does not wait for the confirm answer: the parent moves on at once (the webhook covers us)", async () => {
    stubFetch("never");
    await payThroughTheForm();

    expect(confirmCalls()).toHaveLength(1);
    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith("/thanks?ref=KH-A2B3-C4D5&t=1.probe-token");
  });
});
