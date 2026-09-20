import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PreorderForm } from "./PreorderForm";
import { registerPostHog, resetPostHogForTests } from "@/lib/posthog";

const startCheckout = vi.hoisted(() => vi.fn());
vi.mock("../lib/checkout", () => ({ startCheckout }));

/**
 * The form that takes money. Each test below is one way this could quietly cost
 * a real parent something.
 */
function fill(overrides: Partial<Record<string, string>> = {}) {
  return {
    "Your name": "Priya Menon",
    "WhatsApp number": "9187546483",
    Email: "priya@example.com",
    // free text since 2026-08-23: the dropdown could not take this answer
    "Your child's age": "2.5",
    ...overrides,
  };
}

async function completeForm(user: ReturnType<typeof userEvent.setup>) {
  for (const [label, value] of Object.entries(fill())) {
    await user.type(screen.getByLabelText(label, { exact: false }), value as string);
  }
  await user.click(screen.getByRole("checkbox"));
}

describe("PreorderForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    startCheckout.mockResolvedValue(true);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            orderRef: "KH-A2B3-C4D5",
            razorpayOrderId: "order_abc",
            keyId: "rzp_test_x",
            amountPaise: 49_900,
            addressToken: "tok",
            prefill: {},
          }),
          { status: 200 },
        ),
      ),
    );
  });

  it("asks for exactly the four things the founder chose, and one tick", () => {
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    for (const label of ["Your name", "WhatsApp number", "Email", "Your child's age"]) {
      expect(screen.getByLabelText(label, { exact: false })).toBeInTheDocument();
    }
    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
    // and nothing else: an address field here would be the flow-order mistake
    expect(screen.queryByLabelText(/PIN code/i)).toBeNull();
    expect(screen.queryByLabelText(/street/i)).toBeNull();
  });

  it("puts the amount on the button, so nobody taps a number they have not seen", () => {
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    expect(screen.getByRole("button", { name: /Pay ₹499 and reserve/ })).toBeInTheDocument();
  });

  it("refuses to call the server when the form is incomplete", async () => {
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByText("We need a name to put on the order.")).toBeInTheDocument();
    expect(
      screen.getByText("Please tick the box to accept the pre-order terms."),
    ).toBeInTheDocument();
  });

  /* THE test in this file. A form that posts its own price is a form that can be
     edited in a console to pay ₹1. The client sends the tier; the server decides
     what that costs. */
  it("never sends an amount to the server, only which tier", async () => {
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await completeForm(user);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string) as Record<string, unknown>;

    expect(body.tier).toBe("launch");
    expect(body).not.toHaveProperty("amount");
    expect(body).not.toHaveProperty("amountPaise");
    expect(body).not.toHaveProperty("price");
  });

  it("passes the event signature through when it has one", async () => {
    const user = userEvent.setup();
    render(<PreorderForm tier="blr-aug" signature="ieW9NcWgHmASN60o" amountLabel="₹99" />);
    await completeForm(user);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string) as Record<string, unknown>;
    expect(body.tier).toBe("blr-aug");
    expect(body.signature).toBe("ieW9NcWgHmASN60o");
  });

  it("opens the payment sheet with the amount the SERVER returned", async () => {
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await completeForm(user);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    await waitFor(() => expect(startCheckout).toHaveBeenCalled());
    expect(startCheckout.mock.calls[0][0]).toMatchObject({
      amountPaise: 49_900,
      razorpayOrderId: "order_abc",
      orderRef: "KH-A2B3-C4D5",
    });
  });

  /* Every failure path has to say "nothing was charged" in those words. A parent
     staring at a broken payment form assumes the worst, and they are right to. */
  it("says nothing was charged when the sheet will not open", async () => {
    startCheckout.mockResolvedValue(false);
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await completeForm(user);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/Nothing was charged/i);
  });

  it("says nothing was charged when the server refuses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ error: "closed", message: "Pre-order pricing has closed." }), {
          status: 409,
        }),
      ),
    );
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await completeForm(user);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    expect((await screen.findByRole("alert")).textContent).toContain("Pre-order pricing has closed.");
  });

  it("shows the server's own field errors, not a generic failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({ error: "invalid", errors: { email: "That inbox bounced." } }),
          { status: 422 },
        ),
      ),
    );
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    await completeForm(user);
    await user.click(screen.getByRole("button", { name: /Pay/ }));

    expect(await screen.findByText("That inbox bounced.")).toBeInTheDocument();
  });

  it("links the terms and the refund policy where the tick is", () => {
    render(<PreorderForm tier="launch" amountLabel="₹499" />);
    expect(screen.getByRole("link", { name: "pre-order terms" })).toHaveAttribute(
      "href",
      "https://kheelona.com/terms",
    );
    expect(screen.getByRole("link", { name: "refund policy" })).toHaveAttribute(
      "href",
      "https://kheelona.com/refund",
    );
  });

  it("captions the derived balance when an event page passes one (2026-08-23)", () => {
    /* A ₹99 Ideabaaz booking owes ₹4,900, and the caption under the pay button
       is one of the places a parent reads that promise. The caption text spans
       interpolation nodes, so the assertion reads the rendered text whole. */
    const { container } = render(
      <PreorderForm tier="ideabaaz" signature="sig" amountLabel="₹99" balanceLabel="₹4,900" />,
    );
    expect(container.textContent).toMatch(/₹4,900 when your Kheelu is ready to ship/);
    expect(container.textContent).not.toContain("₹4,500");
  });

  it("keeps the public ₹4,500 caption when no balance is passed", () => {
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);
    expect(container.textContent).toMatch(/₹4,500 when your Kheelu is ready to ship/);
  });
});

/** THE FIRST SIGNAL A REAL PERSON IS HERE (§8.40, 2026-09-20).
 *
 *  Before this, nothing fired until validation passed on submit, so a parent who
 *  typed their name and left was invisible to every tool. These drive the real
 *  component with real typing rather than calling the analytics body directly,
 *  because the contract test in `lib/analytics.test.ts` proves the function
 *  exists and proves nothing about whether the form ever calls it. */
describe("the form reports that somebody started filling it in", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    startCheckout.mockResolvedValue(true);
  });

  it("fires preorder_form_started on the first keystroke", async () => {
    const gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" />);

    expect(gtag.mock.calls.map((c) => c[1])).not.toContain("preorder_form_started");
    await user.type(screen.getByLabelText("Your name", { exact: false }), "P");
    expect(gtag.mock.calls.map((c) => c[1])).toContain("preorder_form_started");
  });

  /* Once per mount, not once per keystroke. A parent typing a name, a number,
     an email and an age would otherwise send dozens of identical events and
     make the funnel's first step meaningless. */
  it("fires exactly once however much is typed, and in whichever field", async () => {
    const gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" />);

    await user.type(screen.getByLabelText("Your name", { exact: false }), "Priya Menon");
    await user.type(screen.getByLabelText("Email", { exact: false }), "priya@example.com");
    await user.click(screen.getByRole("checkbox"));

    const started = gtag.mock.calls.filter((c) => c[1] === "preorder_form_started");
    expect(started).toHaveLength(1);
    expect(started[0][2]).toEqual({ tier: "launch" });
  });

  /* The listener sits on the <form>, so it covers every field that exists now
     and every field anyone adds later. Starting in the last field must count. */
  it("counts a start that begins in a field other than the first", async () => {
    const gtag = vi.fn();
    vi.stubGlobal("gtag", gtag);
    const user = userEvent.setup();
    render(<PreorderForm tier="launch" />);

    await user.type(screen.getByLabelText("Your child's age", { exact: false }), "3");
    expect(gtag.mock.calls.map((c) => c[1])).toContain("preorder_form_started");
  });

  /* Stitching. The order has to carry the browser's PostHog device id or the
     server-sent purchase_confirmed event has no funnel to join. */
  it("sends PostHog's device id with the order", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            orderRef: "KH-A2B3-C4D5",
            rzpOrderId: "order_x",
            keyId: "rzp_test_x",
            amountPaise: 49_900,
            addressToken: "1.abcdefgh12345678",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);
    registerPostHog({
      capture: () => {},
      startSessionRecording: () => {},
      stopSessionRecording: () => {},
      get_distinct_id: () => "0199-device",
      getSessionProperty: () => undefined,
    } as never);

    const user = userEvent.setup();
    render(<PreorderForm tier="launch" />);
    await completeForm(user);
    await user.click(screen.getByRole("button", { name: /pre-?order|pay|reserve/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(body.phDistinctId).toBe("0199-device");
  });

  /* 🔴 THE ATTRIBUTION FIX ITSELF. The store URL carries no campaign, because
     the CTA that crossed from kheelona.com dropped it. The session still knows,
     and that is the only reason the order row can record it. */
  it("takes the campaign from PostHog's session when the URL has none", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            orderRef: "KH-A2B3-C4D5",
            rzpOrderId: "order_x",
            keyId: "rzp_test_x",
            amountPaise: 49_900,
            addressToken: "1.abcdefgh12345678",
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const session: Record<string, string> = { utm_source: "meta", utm_campaign: "2026-09-launch" };
    registerPostHog({
      capture: () => {},
      startSessionRecording: () => {},
      stopSessionRecording: () => {},
      get_distinct_id: () => "0199-device",
      getSessionProperty: (k: string) => session[k],
    } as never);

    const user = userEvent.setup();
    render(<PreorderForm tier="launch" />);
    await completeForm(user);
    await user.click(screen.getByRole("button", { name: /pre-?order|pay|reserve/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(window.location.search).toBe("");
    expect(body.utm).toEqual({ utm_source: "meta", utm_campaign: "2026-09-launch" });
  });
});
