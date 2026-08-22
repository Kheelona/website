import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AddressForm } from "./AddressForm";

const existing = {
  line1: "Flat 4B, Sunrise Apartments",
  line2: "Near the park",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560041",
};

async function completeAddress(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Flat or house/i), existing.line1);
  await user.type(screen.getByLabelText(/PIN code/i), existing.pincode);
  await user.type(screen.getByLabelText(/City or town/i), existing.city);
  await user.selectOptions(screen.getByLabelText("State", { exact: false }), "Karnataka");
}

describe("AddressForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })));
  });

  it("treats the landmark as optional and everything else as required", () => {
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    expect(screen.getByLabelText(/Landmark or area/i)).not.toBeRequired();
    for (const label of [/Flat or house/i, /PIN code/i, /City or town/i]) {
      expect(screen.getByLabelText(label)).toBeRequired();
    }
  });

  it("offers states as a list, so a courier can read the answer", () => {
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    expect(screen.getByRole("option", { name: "Karnataka" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Tamil Nadu" })).toBeInTheDocument();
  });

  it("catches a bad PIN code before it reaches the server", async () => {
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await user.type(screen.getByLabelText(/Flat or house/i), existing.line1);
    await user.type(screen.getByLabelText(/PIN code/i), "56004");
    await user.type(screen.getByLabelText(/City or town/i), existing.city);
    await user.selectOptions(screen.getByLabelText("State", { exact: false }), "Karnataka");
    await user.click(screen.getByRole("button", { name: /Save my address/ }));

    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByText(/six digits, and never starts with a zero/i)).toBeInTheDocument();
  });

  it("sends the order reference and the token with the address", async () => {
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await completeAddress(user);
    await user.click(screen.getByRole("button", { name: /Save my address/ }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const [, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse((init as RequestInit).body as string) as Record<string, unknown>;
    expect(body).toMatchObject({
      orderRef: "KH-A2B3-C4D5",
      token: "tok",
      pincode: "560041",
      state: "Karnataka",
    });
  });

  it("confirms, then still lets them change it", async () => {
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await completeAddress(user);
    await user.click(screen.getByRole("button", { name: /Save my address/ }));

    expect(await screen.findByText("We have your address.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Change it here instead/ }));
    expect(screen.getByLabelText(/Flat or house/i)).toBeInTheDocument();
  });

  it("opens in the saved state when an address already exists, prefilled", async () => {
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" existing={existing} />);
    expect(screen.getByText("We have your address.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Change it here instead/ }));
    expect(screen.getByLabelText(/Flat or house/i)).toHaveValue(existing.line1);
    expect(screen.getByLabelText("State", { exact: false })).toHaveValue("Karnataka");
  });

  /* An address step that fails must never read as "your order failed". The money
     is already ours by this point, and a parent should be told so. */
  it("reassures that the order is safe when saving fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ error: "forbidden", message: "This link cannot be used any more." }), {
          status: 403,
        }),
      ),
    );
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await completeAddress(user);
    await user.click(screen.getByRole("button", { name: /Save my address/ }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "This link cannot be used any more.",
    );
  });

  it("tells them it can wait, because it can", () => {
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    expect(screen.getByText(/Your order is already safe/i)).toBeInTheDocument();
  });
});
