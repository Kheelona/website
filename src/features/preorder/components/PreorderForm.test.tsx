import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PreorderForm } from "./PreorderForm";

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
    expect(container.textContent).toMatch(/₹4,900 when your Lumi is ready to ship/);
    expect(container.textContent).not.toContain("₹4,500");
  });

  it("keeps the public ₹4,500 caption when no balance is passed", () => {
    const { container } = render(<PreorderForm tier="launch" amountLabel="₹499" />);
    expect(container.textContent).toMatch(/₹4,500 when your Lumi is ready to ship/);
  });
});
