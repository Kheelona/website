import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { PreorderForm } from "@/features/preorder/components/PreorderForm";
import { DRAFT_KEY, DRAFT_TTL_MS } from "@/features/preorder/components/form-draft";
import { registerPostHog, resetPostHogForTests } from "@/lib/posthog";

/**
 * The pre-order form keeps the name, phone and email in this tab (D070 / B3; K-171).
 *
 * Drives the real `PreorderForm` with real typing, in jsdom, against jsdom's own `sessionStorage`. The helper's own
 * rules (shape, expiry, storage that throws) are proved in `preorder-form-draft.test.ts`; this file proves the form
 * uses it the way the founder approved: a stored draft fills the three fields and leaves the child's age empty, a
 * restore reports nothing to any tracker and counts as no change by the person, paying clears it before the page
 * moves on, and closing the payment window keeps it. `PreorderForm.test.tsx` is frozen (literal-only patches), so this
 * is a new file. Every expectation is a literal written from the spec, not computed by the code under test. Values are
 * obviously fake; nothing leaves the process (fetch is a stub, Razorpay is a fake window, the trackers are spies).
 */

const NOW = new Date("2026-11-24T10:00:00.000Z");
const MINUTE = 60 * 1000;

const DRAFT = { v: 1, savedAt: NOW.getTime(), parentName: "Asha Probe", phone: "9000000001", email: "asha@example.com" };

const label = (text: string) => screen.getByLabelText(text, { exact: false }) as HTMLInputElement;
const nameField = () => label("Your name");
const phoneField = () => label("WhatsApp number");
const emailField = () => label("Email");
const ageField = () => label("Your child’s age");
const tick = () => screen.getByRole("checkbox") as HTMLInputElement;

const seed = (draft: Record<string, unknown> = DRAFT) => sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
const stored = () => JSON.parse(sessionStorage.getItem(DRAFT_KEY)!) as Record<string, unknown>;

let gtag: ReturnType<typeof vi.fn>;
let fbq: ReturnType<typeof vi.fn>;
let capture: Mock<(event: string, properties?: Record<string, unknown>) => void>;

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  gtag = vi.fn();
  fbq = vi.fn();
  capture = vi.fn<(event: string, properties?: Record<string, unknown>) => void>();
  vi.stubGlobal("gtag", gtag);
  vi.stubGlobal("fbq", fbq);
  registerPostHog({ capture, startSessionRecording: () => {}, stopSessionRecording: () => {}, get_distinct_id: () => "probe" });
});

afterEach(() => {
  resetPostHogForTests();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** Everything any tracker was handed, as text, so a leaked value cannot hide in a property. */
const trackerTraffic = () => JSON.stringify([gtag.mock.calls, fbq.mock.calls, capture.mock.calls]);
const trackedNames = () => [...gtag.mock.calls.map((c) => c[1]), ...capture.mock.calls.map((c) => c[0])];

describe("a stored draft comes back when the form appears", () => {
  it("fills the name, phone and email, and leaves the child's age empty and the tick unticked", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    seed();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    expect(nameField().value).toBe("Asha Probe");
    expect(phoneField().value).toBe("9000000001");
    expect(emailField().value).toBe("asha@example.com");
    expect(ageField().value).toBe("");
    expect(tick().checked).toBe(false);
  });

  it("does not put back a child's age even if one is somehow in the stored value", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    seed({ ...DRAFT, childAge: "4", accepted: true });
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    expect(nameField().value).toBe("Asha Probe");
    expect(ageField().value).toBe("");
    expect(tick().checked).toBe(false);
  });

  it("is not a change by the person: nothing is sent to any tracker, and the first real keystroke still starts the form", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    seed();
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    // The restore itself: not one call to GA4, Meta or PostHog.
    expect(trackedNames()).toEqual([]);
    expect(fbq).not.toHaveBeenCalled();

    // The person's first keystroke: preorder_form_started, once, with the tier and nothing they typed.
    await user.type(ageField(), "3");
    expect(gtag.mock.calls.filter((c) => c[1] === "preorder_form_started")).toHaveLength(1);
    expect(gtag.mock.calls.find((c) => c[1] === "preorder_form_started")![2]).toEqual({ tier: "launch" });
    expect(capture.mock.calls.filter((c) => c[0] === "preorder_form_started")).toHaveLength(1);
  });

  it("does not mark any field invalid, and shows no alert", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    seed();
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);

    expect(container.querySelector("[aria-invalid='true']")).toBeNull();
    expect(container.querySelector("[role='alert']")).toBeNull();
  });

  it("restores nothing from a draft older than 30 minutes, and deletes it", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(NOW.getTime() + DRAFT_TTL_MS + MINUTE));
    seed();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    expect(nameField().value).toBe("");
    expect(phoneField().value).toBe("");
    expect(emailField().value).toBe("");
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it("keeps a value the browser already put in a field before the page woke up (autofill on a server-rendered form)", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    seed();
    // The store page is server-rendered, then hydrated: the HTML is on screen (and autofill may have filled it) first.
    const host = document.createElement("div");
    host.innerHTML = renderToString(<PreorderForm tier="launch" amountLabel="₹499" />);
    document.body.appendChild(host);
    (host.querySelector('[name="email"]') as HTMLInputElement).value = "autofill@example.com";

    const problems = vi.spyOn(console, "error").mockImplementation(() => {});
    let root!: Root;
    await act(async () => {
      root = hydrateRoot(host, <PreorderForm tier="launch" amountLabel="₹499" />);
    });

    const value = (name: string) => (host.querySelector(`[name="${name}"]`) as HTMLInputElement).value;
    expect(value("email")).toBe("autofill@example.com");
    expect(value("parentName")).toBe("Asha Probe");
    expect(value("phone")).toBe("9000000001");
    expect(value("childAge")).toBe("");
    expect(problems).not.toHaveBeenCalled(); // no hydration mismatch from the restore
    expect(trackedNames()).toEqual([]);

    act(() => root.unmount());
    host.remove();
  });
});

describe("the form saves the three fields as they are typed, and never the child's age", () => {
  it("writes one key with the name, phone and email, and no age and no tick", async () => {
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    await user.type(nameField(), "Asha Probe");
    await user.type(phoneField(), "9000000001");
    await user.type(emailField(), "asha@example.com");
    await user.type(ageField(), "2.5 years");
    await user.click(tick());

    expect(sessionStorage.length).toBe(1);
    expect(sessionStorage.key(0)).toBe("kh_preorder_draft");
    const draft = stored();
    expect(Object.keys(draft).sort()).toEqual(["email", "parentName", "phone", "savedAt", "v"]);
    expect(draft).toMatchObject({ v: 1, parentName: "Asha Probe", phone: "9000000001", email: "asha@example.com" });
    expect(sessionStorage.getItem(DRAFT_KEY)).not.toContain("2.5");
    expect(localStorage.length).toBe(0);
    expect(document.cookie).toBe("");
  });

  it("stores nothing when only the child's age is typed", async () => {
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    await user.type(ageField(), "3");
    await user.click(tick());

    expect(sessionStorage.length).toBe(0);
  });

  it("does not even look at the child's age: typing it neither rewrites the draft nor extends its 30 minutes", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    const tenMinutesAgo = NOW.getTime() - 10 * MINUTE;
    vi.setSystemTime(NOW);
    seed({ ...DRAFT, savedAt: tenMinutesAgo });
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    await user.type(ageField(), "3");
    expect(stored().savedAt).toBe(tenMinutesAgo);

    await user.type(nameField(), "!");
    expect(stored().savedAt).toBe(NOW.getTime()); // a change to the name does
    expect(stored().parentName).toBe("Asha Probe!");
  });

  it("drops the key again when the parent empties the three fields", async () => {
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    await user.type(nameField(), "Asha");
    expect(sessionStorage.getItem(DRAFT_KEY)).not.toBeNull();
    await user.clear(nameField());
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
  });

  it("gives back the three fields after a reload of the tab, with the age empty", async () => {
    const user = userEvent.setup();
    const first = render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await user.type(nameField(), "Asha Probe");
    await user.type(phoneField(), "9000000001");
    await user.type(emailField(), "asha@example.com");
    await user.type(ageField(), "2.5");
    first.unmount(); // the tab reloads: the DOM is gone, sessionStorage stays

    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    expect(nameField().value).toBe("Asha Probe");
    expect(phoneField().value).toBe("9000000001");
    expect(emailField().value).toBe("asha@example.com");
    expect(ageField().value).toBe("");
  });

  it("sends the typed values to no tracker (only the tier-only form_started goes out)", async () => {
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    await user.type(nameField(), "Asha Probe");
    await user.type(phoneField(), "9000000001");
    await user.type(emailField(), "asha@example.com");
    await user.type(ageField(), "2.5");

    expect(trackedNames()).toEqual(["preorder_form_started", "preorder_form_started"]);
    const traffic = trackerTraffic();
    for (const secret of ["Asha", "9000000001", "asha@example.com", "2.5", DRAFT_KEY]) expect(traffic).not.toContain(secret);
  });
});

/* ── The payment window: paying clears the draft, closing the window keeps it ─────────────────────────────────── */

const CREATED = {
  orderRef: "KH-A2B3-C4D5",
  razorpayOrderId: "order_PROBE0001",
  keyId: "rzp_test_probe",
  amountPaise: 49_900,
  addressToken: "1.probe-token",
  prefill: {},
};
const PAID = { razorpay_order_id: "order_PROBE0001", razorpay_payment_id: "pay_PROBE0001", razorpay_signature: "sig_probe_0001" };

type RazorpayOptions = { handler: (response: typeof PAID) => void; modal?: { ondismiss?: () => void } };
const win = window as unknown as { Razorpay?: unknown };

/** What the draft was at the moment the page was told to move on (and at the moment the confirm request went out). */
let draftWhenNavigating: string | null | undefined;
let draftWhenConfirming: string | null | undefined;

function fakePaymentWindow(outcome: "pays" | "is closed") {
  win.Razorpay = class {
    constructor(private readonly options: RazorpayOptions) {}
    on() {}
    open() {
      setTimeout(() => (outcome === "pays" ? this.options.handler(PAID) : this.options.modal?.ondismiss?.()), 0);
    }
  };
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      if (url === "/api/preorder/create-order") {
        return Promise.resolve(new Response(JSON.stringify(CREATED), { status: 200, headers: { "content-type": "application/json" } }));
      }
      if (url === "/api/preorder/confirm") {
        draftWhenConfirming = sessionStorage.getItem(DRAFT_KEY);
        return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } }));
      }
      throw new Error(`unexpected request to ${url}`);
    }),
  );
  const assign = vi.fn(() => {
    draftWhenNavigating = sessionStorage.getItem(DRAFT_KEY);
  });
  vi.stubGlobal("location", { ...window.location, assign });
  return assign;
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(nameField(), "Asha Probe");
  await user.type(phoneField(), "9187546483");
  await user.type(emailField(), "asha@example.com");
  await user.type(ageField(), "2.5");
  await user.click(tick());
  expect(sessionStorage.getItem(DRAFT_KEY)).not.toBeNull(); // there while the parent is paying
  await user.click(screen.getByRole("button", { name: /Pay ₹499/ }));
}

describe("the payment window", () => {
  beforeEach(() => {
    draftWhenNavigating = undefined;
    draftWhenConfirming = undefined;
  });
  afterEach(() => {
    delete win.Razorpay;
  });

  it("clears the draft when the payment succeeds, before the confirm request and before the move to /thanks", async () => {
    const assign = fakePaymentWindow("pays");
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    await fillAndSubmit(user);
    await waitFor(() => expect(assign).toHaveBeenCalledTimes(1));

    expect(draftWhenConfirming).toBeNull();
    expect(draftWhenNavigating).toBeNull();
    expect(sessionStorage.getItem(DRAFT_KEY)).toBeNull();
    expect(assign).toHaveBeenCalledWith("/thanks?ref=KH-A2B3-C4D5&t=1.probe-token");
  });

  it("keeps the draft when the parent closes the payment window: their details are still here", async () => {
    const assign = fakePaymentWindow("is closed");
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);

    await fillAndSubmit(user);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Your details are still here when you want to finish."));

    expect(assign).not.toHaveBeenCalled();
    expect(stored()).toMatchObject({ parentName: "Asha Probe", phone: "9187546483", email: "asha@example.com" });
    expect(nameField().value).toBe("Asha Probe");
  });
});

describe("storage that the browser refuses", () => {
  it("leaves the form working exactly as before: it renders, takes typing and reports the start", async () => {
    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    });
    const user = userEvent.setup();
    expect(() => render(<PreorderForm tier="launch" amountLabel="₹499" />)).not.toThrow();

    await user.type(nameField(), "Asha Probe");
    await user.type(emailField(), "asha@example.com");

    expect(nameField().value).toBe("Asha Probe");
    expect(emailField().value).toBe("asha@example.com");
    expect(gtag.mock.calls.filter((c) => c[1] === "preorder_form_started")).toHaveLength(1);
  });
});
