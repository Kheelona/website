import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AddressForm } from "@/features/preorder/components/AddressForm";

/* D072 (K-184 B8), seen from the parent's side: the form takes any house/street and city, and a PIN code that belongs to
   another state is stopped under the PIN field, before anything is sent. The frozen AddressForm.test.tsx takes
   literal-only patches, so these assertions live in a new file. */

const MISMATCH = "This PIN code belongs to a different state. Please check your PIN code and state.";

const fetchMock = vi.fn<typeof fetch>();

async function fill(
  user: ReturnType<typeof userEvent.setup>,
  address: { line1: string; pincode: string; city: string; state: string },
) {
  await user.type(screen.getByLabelText(/Flat or house/i), address.line1);
  await user.type(screen.getByLabelText(/PIN code/i), address.pincode);
  await user.type(screen.getByLabelText(/City or town/i), address.city);
  await user.selectOptions(screen.getByLabelText("State", { exact: false }), address.state);
}

describe("AddressForm, PIN code against the state (D072)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    // jsdom has no scrollIntoView, and a blocked submit scrolls to the first invalid field
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    delete (Element.prototype as { scrollIntoView?: unknown }).scrollIntoView;
  });

  it("stops a Karnataka PIN against Kerala, under the PIN field, and sends nothing", async () => {
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await fill(user, { line1: "Flat 4B, Sunrise Apartments", pincode: "560001", city: "Kochi", state: "Kerala" });
    await user.click(screen.getByRole("button", { name: /Save my address/ }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText(MISMATCH)).toBeInTheDocument();
    const pin = screen.getByLabelText(/PIN code/i);
    expect(pin).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/Flat or house/i)).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/City or town/i)).not.toHaveAttribute("aria-invalid", "true");
  });

  it("saves once the parent fixes the state", async () => {
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await fill(user, { line1: "Flat 4B, Sunrise Apartments", pincode: "560001", city: "Bengaluru", state: "Kerala" });
    await user.click(screen.getByRole("button", { name: /Save my address/ }));
    expect(screen.getByText(MISMATCH)).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("State", { exact: false }), "Karnataka");
    await user.click(screen.getByRole("button", { name: /Save my address/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByText("We have your address.")).toBeInTheDocument();
  });

  it("posts a house or flat of just '10' for a valid Karnataka address", async () => {
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await fill(user, { line1: "10", pincode: "560041", city: "Bengaluru", state: "Karnataka" });
    await user.click(screen.getByRole("button", { name: /Save my address/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(init.body as string)).toMatchObject({
      orderRef: "KH-A2B3-C4D5",
      line1: "10",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560041",
    });
  });

  it("posts a one-letter city too", async () => {
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await fill(user, { line1: "10", pincode: "560041", city: "X", state: "Karnataka" });
    await user.click(screen.getByRole("button", { name: /Save my address/ }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });
});
