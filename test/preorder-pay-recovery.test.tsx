import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DRAFT_KEY } from "@/features/preorder/components/form-draft";
import { PENDING_KEY } from "@/features/preorder/components/pending-payment";
import { PreorderForm } from "@/features/preorder/components/PreorderForm";

/**
 * Recovery of the order this tab started, and the redirect option for in-app browsers (D070 / B2, K-172;
 * output/2026-W48/engineering/B2-spec.md acceptance 1 and 3). The real form and the real `startCheckout` against a fake Razorpay
 * and a stubbed fetch; no network, no payment. Every expectation is a literal written from the spec.
 */

const PENDING = { v: 1, orderRef: "KH-A2B3-C4D5", rzpOrderId: "order_PROBE000000001", tier: "launch", createdAt: Date.now() };
const PAID = { razorpay_order_id: "order_PROBE000000001", razorpay_payment_id: "pay_PROBE000000001", razorpay_signature: "sig_probe" };
const CREATED = {
  orderRef: "KH-NEW2-ORDR",
  razorpayOrderId: "order_NEWPROBE00001",
  keyId: "rzp_test_probe",
  amountPaise: 49_900,
  addressToken: "1.probe-token",
  prefill: {},
};
const NOTICE = "Your payment is still open.";

type Options = { order_id: string; key: string; amount: number; prefill: Record<string, unknown>; callback_url?: string; redirect?: boolean; handler: (r: typeof PAID) => void; modal: { ondismiss: () => void } };

class FakeRazorpay {
  static instances: FakeRazorpay[] = [];
  /** What sessionStorage held at the instant the window opened. */
  pendingAtOpen: string | null = null;
  constructor(readonly options: Options) {
    FakeRazorpay.instances.push(this);
  }
  on() {}
  open() {
    this.pendingAtOpen = sessionStorage.getItem(PENDING_KEY);
  }
}

const win = window as unknown as { Razorpay?: unknown };
let assign: ReturnType<typeof vi.fn>;
let fetchMock: ReturnType<typeof vi.fn>;
let statusAnswer: unknown;

function stubFetch() {
  fetchMock = vi.fn(async (url: string) => {
    if (url === "/pay/status") {
      if (statusAnswer instanceof Error) throw statusAnswer;
      return new Response(JSON.stringify(statusAnswer), { status: 200 });
    }
    if (url === "/api/preorder/create-order") return new Response(JSON.stringify(CREATED), { status: 200 });
    if (url === "/api/preorder/confirm") return new Response(JSON.stringify({ ok: true }), { status: 200 });
    throw new Error(`unexpected request to ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
}
const calls = (url: string) => fetchMock.mock.calls.filter(([u]) => u === url);

beforeEach(() => {
  FakeRazorpay.instances = [];
  win.Razorpay = FakeRazorpay;
  assign = vi.fn();
  vi.stubGlobal("location", { ...window.location, assign });
  statusAnswer = { status: "closed" };
  stubFetch();
});
afterEach(() => {
  delete win.Razorpay;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const seed = (over: Record<string, unknown> = {}) => sessionStorage.setItem(PENDING_KEY, JSON.stringify({ ...PENDING, ...over }));
const mount = (tier = "launch") => render(<PreorderForm tier={tier} amountLabel="₹499" />);
const payButton = () => screen.getByRole("button", { name: /^Pay ₹499 and reserve$/ });

describe("on arrival with a payment this tab started", () => {
  it("paid: goes to /thanks, clears the entry, and shows nothing", async () => {
    seed();
    statusAnswer = { status: "paid" };
    mount();
    await waitFor(() => expect(assign).toHaveBeenCalledWith("/thanks"));
    expect(assign).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
    expect(screen.queryByText(NOTICE)).toBeNull();
    // It asked about the pair this tab stored, and nothing else.
    const [, init] = calls("/pay/status")[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string)).toEqual({ orderRef: "KH-A2B3-C4D5", rzpOrderId: "order_PROBE000000001" });
  });

  it("open: shows the notice with Continue paying and Start again, above the pay button", async () => {
    seed();
    statusAnswer = { status: "open", keyId: "rzp_test_probe", amountPaise: 49_900 };
    mount();
    expect(await screen.findByText(NOTICE)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue paying" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start again" })).toBeInTheDocument();
    expect(assign).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(PENDING_KEY)).not.toBeNull();
    // above the pay button in the document order
    const notice = screen.getByText(NOTICE);
    expect(notice.compareDocumentPosition(payButton()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("closed: shows nothing new and clears the entry", async () => {
    seed();
    statusAnswer = { status: "closed" };
    mount();
    await waitFor(() => expect(sessionStorage.getItem(PENDING_KEY)).toBeNull());
    expect(screen.queryByText(NOTICE)).toBeNull();
    expect(assign).not.toHaveBeenCalled();
    expect(payButton()).toBeEnabled();
  });

  it("no entry: no request at all", async () => {
    mount();
    await act(async () => {});
    expect(calls("/pay/status")).toHaveLength(0);
    expect(screen.queryByText(NOTICE)).toBeNull();
  });

  it("an entry older than two hours is dropped without asking the server", async () => {
    seed({ createdAt: Date.now() - 3 * 60 * 60 * 1000 });
    mount();
    await act(async () => {});
    expect(calls("/pay/status")).toHaveLength(0);
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("a status request that fails changes nothing: no notice, the entry stays for next time", async () => {
    seed();
    statusAnswer = new TypeError("offline");
    mount();
    await waitFor(() => expect(calls("/pay/status")).toHaveLength(1));
    await act(async () => {});
    expect(screen.queryByText(NOTICE)).toBeNull();
    expect(sessionStorage.getItem(PENDING_KEY)).not.toBeNull();
    expect(assign).not.toHaveBeenCalled();
  });

  it("an open order of another tier is not offered on this page (and is left alone)", async () => {
    seed({ tier: "full" });
    statusAnswer = { status: "open", keyId: "rzp_test_probe", amountPaise: 49_900 };
    mount("launch");
    await waitFor(() => expect(calls("/pay/status")).toHaveLength(1));
    await act(async () => {});
    expect(screen.queryByText(NOTICE)).toBeNull();
    expect(sessionStorage.getItem(PENDING_KEY)).not.toBeNull();
  });

  it("Start again clears the entry and hides the notice; the form is used as today", async () => {
    seed();
    statusAnswer = { status: "open", keyId: "rzp_test_probe", amountPaise: 49_900 };
    mount();
    await screen.findByText(NOTICE);
    await userEvent.setup().click(screen.getByRole("button", { name: "Start again" }));
    expect(screen.queryByText(NOTICE)).toBeNull();
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
    expect(FakeRazorpay.instances).toHaveLength(0);
    expect(calls("/api/preorder/create-order")).toHaveLength(0);
    expect(payButton()).toBeEnabled();
  });

  it("a page restored from the back-forward cache is put back to idle and asked about again", async () => {
    seed();
    statusAnswer = { status: "open", keyId: "rzp_test_probe", amountPaise: 49_900 };
    mount();
    await screen.findByText(NOTICE);
    expect(calls("/pay/status")).toHaveLength(1);
    statusAnswer = { status: "paid" };
    act(() => {
      window.dispatchEvent(Object.assign(new Event("pageshow"), { persisted: true }));
    });
    await waitFor(() => expect(assign).toHaveBeenCalledWith("/thanks"));
    expect(calls("/pay/status")).toHaveLength(2);
    // an ordinary pageshow (not a cache restore) asks nothing
    act(() => {
      window.dispatchEvent(Object.assign(new Event("pageshow"), { persisted: false }));
    });
    expect(calls("/pay/status")).toHaveLength(2);
  });
});

describe("Continue paying", () => {
  async function openAndContinue() {
    seed();
    statusAnswer = { status: "open", keyId: "rzp_test_probe", amountPaise: 49_900 };
    const view = mount();
    await screen.findByText(NOTICE);
    // B3 would have put these back from the draft; the form's own fields are what the prefill reads.
    const user = userEvent.setup();
    await user.type(view.container.querySelector('[name="parentName"]')!, "QA Test Parent");
    await user.type(view.container.querySelector('[name="phone"]')!, "9187546483");
    await user.type(view.container.querySelector('[name="email"]')!, "QA@Example.com");
    await user.click(screen.getByRole("button", { name: "Continue paying" }));
    await waitFor(() => expect(FakeRazorpay.instances).toHaveLength(1));
    return { user, view };
  }

  it("reopens Razorpay for the SAME order, with the key and amount the server gave, and creates no new order", async () => {
    await openAndContinue();
    const { options } = FakeRazorpay.instances[0];
    expect(options.order_id).toBe("order_PROBE000000001");
    expect(options.key).toBe("rzp_test_probe");
    expect(options.amount).toBe(49_900);
    expect(options.prefill).toEqual({ name: "QA Test Parent", email: "qa@example.com", contact: "9187546483" });
    expect(calls("/api/preorder/create-order")).toHaveLength(0);
    expect("callback_url" in options).toBe(false);
    // the notice is gone while the window is up
    await waitFor(() => expect(screen.queryByText(NOTICE)).toBeNull());
  });

  it("closing the window again leaves the same choice (the order is still open) and no new words", async () => {
    await openAndContinue();
    act(() => FakeRazorpay.instances[0].options.modal.ondismiss());
    expect(await screen.findByText(NOTICE)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(sessionStorage.getItem(PENDING_KEY)).not.toBeNull();
  });

  it("a payment made in the window: confirm with keepalive, then the status, then a clean /thanks (no token in the page)", async () => {
    await openAndContinue();
    statusAnswer = { status: "paid" };
    act(() => FakeRazorpay.instances[0].options.handler(PAID));
    await waitFor(() => expect(assign).toHaveBeenCalledWith("/thanks"));
    const [, init] = calls("/api/preorder/confirm")[0] as unknown as [string, RequestInit];
    expect(init.keepalive).toBe(true);
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
    expect(assign).toHaveBeenCalledTimes(1);
  });

  it("inside an in-app browser it also asks for the redirect flow, to this host's /pay/return", async () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.30.2054",
    );
    await openAndContinue();
    const { options } = FakeRazorpay.instances[0];
    expect(options.callback_url).toBe(`${window.location.origin}/pay/return`);
    expect(options.redirect).toBe(true);
    expect(options.order_id).toBe("order_PROBE000000001");
  });
});

describe("a new payment from the form", () => {
  async function fillAndPay(user: ReturnType<typeof userEvent.setup>, container: HTMLElement) {
    const values: Record<string, string> = { parentName: "QA Test Parent", phone: "9187546483", email: "qa@example.com", childAge: "2.5" };
    for (const [name, value] of Object.entries(values)) await user.type(container.querySelector(`[name="${name}"]`)!, value);
    await user.click(container.querySelector('[name="accepted"]')!);
    await user.click(container.querySelector('button[type="submit"]')!);
    await waitFor(() => expect(FakeRazorpay.instances).toHaveLength(1));
  }

  it("writes the pending entry BEFORE the window opens: five fields, no token, no personal data, no amount", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    await fillAndPay(user, container);
    const atOpen = JSON.parse(FakeRazorpay.instances[0].pendingAtOpen!);
    expect(Object.keys(atOpen).sort()).toEqual(["createdAt", "orderRef", "rzpOrderId", "tier", "v"]);
    expect(atOpen).toMatchObject({ v: 1, orderRef: "KH-NEW2-ORDR", rzpOrderId: "order_NEWPROBE00001", tier: "launch" });
    const raw = sessionStorage.getItem(PENDING_KEY)!;
    for (const secret of ["probe-token", "QA Test Parent", "9187546483", "qa@example.com", "49900"]) expect(raw).not.toContain(secret);
    // a regular browser: no callback_url, the proven window and handler
    expect("callback_url" in FakeRazorpay.instances[0].options).toBe(false);
    expect("redirect" in FakeRazorpay.instances[0].options).toBe(false);
  });

  it("clears the entry when the window is closed (dismiss)", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    await fillAndPay(user, container);
    expect(sessionStorage.getItem(PENDING_KEY)).not.toBeNull();
    act(() => FakeRazorpay.instances[0].options.modal.ondismiss());
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
  });

  it("clears the entry (and B3's saved details) when paid, and goes to /thanks with the token as today", async () => {
    const user = userEvent.setup();
    const { container } = mount();
    await fillAndPay(user, container);
    expect(sessionStorage.getItem(DRAFT_KEY)).not.toBeNull();
    act(() => FakeRazorpay.instances[0].options.handler({ ...PAID, razorpay_order_id: "order_NEWPROBE00001" }));
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(assign).toHaveBeenCalledWith("/thanks?ref=KH-NEW2-ORDR&t=1.probe-token");
  });

  it("clears the entry when the window would not open", async () => {
    delete win.Razorpay;
    // a script that never defines window.Razorpay: loadCheckout resolves false once its onerror fires
    const append = vi.spyOn(document.head, "appendChild").mockImplementation((node) => {
      queueMicrotask(() => (node as HTMLScriptElement).onerror?.(new Event("error")));
      return node;
    });
    const user = userEvent.setup();
    const { container } = mount();
    const values: Record<string, string> = { parentName: "QA Test Parent", phone: "9187546483", email: "qa@example.com", childAge: "2.5" };
    for (const [name, value] of Object.entries(values)) await user.type(container.querySelector(`[name="${name}"]`)!, value);
    await user.click(container.querySelector('[name="accepted"]')!);
    await user.click(container.querySelector('button[type="submit"]')!);
    await screen.findByText(/payment window would not open/i);
    expect(sessionStorage.getItem(PENDING_KEY)).toBeNull();
    append.mockRestore();
  });

  it("in an in-app browser it asks for the redirect flow, to this host's /pay/return; Chrome does not", async () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
      "Mozilla/5.0 (Linux; Android 13; SM-A536E Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.163 Mobile Safari/537.36 Instagram 309.1.0.41.113 Android",
    );
    const user = userEvent.setup();
    const { container } = mount();
    await fillAndPay(user, container);
    expect(FakeRazorpay.instances[0].options.callback_url).toBe(`${window.location.origin}/pay/return`);
    expect(FakeRazorpay.instances[0].options.redirect).toBe(true);
  });

  it("a stale notice goes away when a new payment is started from the form", async () => {
    seed();
    statusAnswer = { status: "open", keyId: "rzp_test_probe", amountPaise: 49_900 };
    const user = userEvent.setup();
    const { container } = mount();
    await screen.findByText(NOTICE);
    await fillAndPay(user, container);
    expect(screen.queryByText(NOTICE)).toBeNull();
    expect(JSON.parse(sessionStorage.getItem(PENDING_KEY)!).orderRef).toBe("KH-NEW2-ORDR");
  });
});
