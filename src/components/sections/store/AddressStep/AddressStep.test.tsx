import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AddressForm } from "@/features/preorder";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { mockupFold, skeleton, words } from "../../../../../test/support/mockup-compare";
import { AddressStep } from "./AddressStep";

/* AddressStep (task 5.16): /thanks fold 3 (store-confirmation.html), the address step around the checkout's own
   AddressForm (restyled in the same task: DS Field and Select, the primary button; logic frozen, ADR-013). The fields'
   ids are the DS Field's generated ones, the labels following them; the mockup spells them by field name, so ids on
   fields are set aside on both sides before the comparison (the form takes no new attribute: its logic signature). */

function withoutFieldIds(el: Element): Element {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll("input[id], select[id]").forEach((field) => field.removeAttribute("id"));
  return copy;
}

const EXISTING = { line1: "12 Test Road", line2: "", city: "Bengaluru", state: "Karnataka", pincode: "560076" };

describe("AddressStep", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })));
  });

  it("markup and words equal store-confirmation.html fold 3 with no address yet", () => {
    const { container } = render(
      <AddressStep copy={confirmation.address.empty}>
        <AddressForm orderRef="KH-A2B3-C4D5" token="tok" />
      </AddressStep>,
    );
    const mockup = mockupFold("store-confirmation", "section#address");
    expect(skeleton(withoutFieldIds(container.firstElementChild!))).toBe(skeleton(withoutFieldIds(mockup)));
    /* The list's choices one by one: the mockup's source puts a line break between its <option>s, React none, and an
       option is inline text to words(). */
    expect(words(container.firstElementChild!, { skip: "option" })).toBe(words(mockup, { skip: "option" }));
    const options = (root: Element) => Array.from(root.querySelectorAll("option")).map((o) => o.textContent);
    expect(options(container)).toEqual(options(mockup));
  });

  it("is the #address section named by its h2 in the store's heading style", () => {
    render(
      <AddressStep copy={confirmation.address.empty}>
        <p>form</p>
      </AddressStep>,
    );
    const section = screen.getByRole("region", { name: "Where should it go?" });
    expect(section).toHaveAttribute("id", "address");
    expect(screen.getByRole("heading", { level: 2 }).className).toBe("kh-title ks-h2");
    expect(section.querySelector("p")!.className).toBe("kh-body ks-thanks__intro");
  });

  it("the form: DS fields with their labels, the state list after its instruction, a primary button that is not Chilli", () => {
    const { container } = render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    const form = container.querySelector("form")!;
    expect(form.className).toBe("ks-form ks-addr");
    expect(form.noValidate).toBe(true);
    expect(screen.getByLabelText("Landmark or area (optional)")).not.toBeRequired();
    expect(screen.getByLabelText("PIN code").closest(".ks-addr__pair")).not.toBeNull();
    const state = screen.getByLabelText("State") as HTMLSelectElement;
    expect(state.className).toBe("kh-field__input kh-select__input");
    expect(state.options[0]).toHaveTextContent("Choose your state");
    expect(state.options[0].disabled).toBe(true);
    expect(state.value).toBe("");
    const save = screen.getByRole("button", { name: "Save my address" });
    expect(save.className).toBe("kh-btn kh-btn--primary kh-btn--l kh-btn--block");
    expect(save.className).not.toMatch(/kh-btn--cta/);
    expect(form.lastElementChild!.className).toBe("kh-body-s ks-muted");
  });

  it("the form's failure is a DS danger alert, announced", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ message: "This link cannot be used any more." }), { status: 403 })));
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await user.type(screen.getByLabelText(/Flat or house/), "12 Test Road");
    await user.type(screen.getByLabelText("PIN code"), "560076");
    await user.type(screen.getByLabelText("City or town"), "Bengaluru");
    await user.selectOptions(screen.getByLabelText("State"), "Karnataka");
    await user.click(screen.getByRole("button", { name: "Save my address" }));
    const alert = await screen.findByRole("alert");
    expect(alert.className).toBe("kh-alert kh-alert--danger");
    expect(alert.textContent).toBe("This link cannot be used any more.");
  });

  it("a field error is the DS error line on its field", async () => {
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await user.click(screen.getByRole("button", { name: "Save my address" }));
    const line1 = screen.getByLabelText(/Flat or house/);
    expect(line1).toHaveAttribute("aria-invalid", "true");
    expect(line1.closest(".kh-field")!.className).toBe("kh-field kh-field--error");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("the saved state: a card with the address confirmed, the WhatsApp link and a way back to the form", async () => {
    const user = userEvent.setup();
    const { container } = render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" existing={EXISTING} />);
    const card = container.firstElementChild!;
    expect(card.className).toBe("kh-card ks-addr__saved");
    expect(screen.getByRole("heading", { level: 3, name: "We have your address." })).toBeInTheDocument();
    expect(card.querySelector(".kh-card__body")!.textContent).toBe(
      "That is everything we need. You can change it any time before dispatch: message us on WhatsApp and we will update it.",
    );
    expect(screen.getByRole("link", { name: "message us on WhatsApp" })).toHaveAttribute("href", "https://wa.me/919187546483");
    const change = screen.getByRole("button", { name: "Change it here instead" });
    expect(change.className).toBe("kh-btn kh-btn--secondary");
    await user.click(change);
    expect(screen.getByLabelText(/Flat or house/)).toHaveValue("12 Test Road");
  });

  it("the busy label while it saves", async () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})));
    const user = userEvent.setup();
    render(<AddressForm orderRef="KH-A2B3-C4D5" token="tok" />);
    await user.type(screen.getByLabelText(/Flat or house/), "12 Test Road");
    await user.type(screen.getByLabelText("PIN code"), "560076");
    await user.type(screen.getByLabelText("City or town"), "Bengaluru");
    await user.selectOptions(screen.getByLabelText("State"), "Karnataka");
    await user.click(screen.getByRole("button", { name: "Save my address" }));
    expect(await screen.findByRole("button", { name: "Saving…" })).toBeDisabled();
  });
});
