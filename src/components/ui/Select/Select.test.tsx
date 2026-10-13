import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { Field } from "@/components/ui/Field/Field";
import { asBuilt, canonical, mockupFold, mockupPage } from "../../../../test/support/mockup-compare";
import { Select } from "./Select";

/* Select (task 2.5): the DS Select (`kh-select`, a native <select> styled as the text field) as the approved
 * confirmation mockup's state picker uses it (mockup/store-confirmation.html fold 3). */

/** The built mockup's element as the build prints it, read and ported by the one mockup harness
 *  (test/support/mockup-compare.ts: `mk-` classes renamed `ks-`), with an option's implicit value (its text, HTML's
 *  default) written out, as React writes every option's value. */
function mockupElement(page: string, selector: string): Element {
  const copy = asBuilt(mockupFold(page, selector));
  copy.querySelectorAll("option:not([value])").forEach((o) => o.setAttribute("value", o.textContent ?? ""));
  return copy;
}

const STATES = ["Andhra Pradesh", "Karnataka", "Kerala"] as const;

describe("Select", () => {
  it("renders a native select inside the DS frame, labelled, with the caret as decoration", () => {
    const { container } = render(<Select label="State" name="state" options={STATES} />);
    const select = screen.getByLabelText("State");
    expect(select.tagName).toBe("SELECT");
    expect(select).toHaveClass("kh-field__input", "kh-select__input");
    expect(select.parentElement).toHaveClass("kh-select");
    expect(container.firstElementChild).toHaveClass("kh-field");
    const caret = container.querySelector(".kh-select__caret");
    expect(caret?.tagName.toLowerCase()).toBe("svg");
    expect(caret).toHaveAttribute("aria-hidden", "true");
    // Drawn through Glyph (task 3.6 item 4), with the DS icon markup exactly as the mockup's {{icon:}} injection writes it.
    expect(caret!.outerHTML).toBe(
      `<svg class="kh-icon kh-select__caret" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="${ICON_PATHS["caret-down"]}"></path></svg>`,
    );
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([...STATES]);
  });

  it("takes strings or { value, label, disabled } options", () => {
    render(
      <Select
        label="Age"
        name="age"
        options={["3", { value: "4", label: "Four" }, { value: "8", label: "Eight", disabled: true }]}
      />,
    );
    const options = screen.getAllByRole("option") as HTMLOptionElement[];
    expect(options.map((o) => [o.value, o.textContent, o.disabled])).toEqual([
      ["3", "3", false],
      ["4", "Four", false],
      ["8", "Eight", true],
    ]);
  });

  it("shows the placeholder as a disabled first option, chosen until the parent picks (never a default choice)", () => {
    render(<Select label="State" name="state" placeholder="Choose your state" options={STATES} required />);
    const select = screen.getByLabelText("State") as HTMLSelectElement;
    const first = select.options[0];
    expect(first.textContent).toBe("Choose your state");
    expect(first.value).toBe("");
    expect(first.disabled).toBe(true);
    expect(select.value).toBe("");
    expect(select).toBeRequired();
  });

  it("keeps a saved value over the placeholder, and forwards change handlers", async () => {
    const onChange = vi.fn();
    render(<Select label="State" name="state" placeholder="Choose your state" options={STATES} defaultValue="Kerala" onChange={onChange} />);
    const select = screen.getByLabelText("State") as HTMLSelectElement;
    expect(select.value).toBe("Kerala");
    await userEvent.setup().selectOptions(select, "Karnataka");
    expect(select.value).toBe("Karnataka");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("an undefined saved value still lands on the placeholder", () => {
    render(<Select label="State" name="state" placeholder="Choose your state" options={STATES} defaultValue={undefined} />);
    expect((screen.getByLabelText("State") as HTMLSelectElement).value).toBe("");
  });

  it("ties the hint by aria-describedby and announces an error in its place", () => {
    const { rerender, container } = render(<Select id="state" label="State" name="state" options={STATES} hint="Where we deliver." />);
    const select = screen.getByLabelText("State");
    expect(select).toHaveAttribute("aria-describedby", "state-d");
    expect(select).toHaveAccessibleDescription("Where we deliver.");
    rerender(<Select id="state" label="State" name="state" options={STATES} hint="Where we deliver." error="Choose your state." />);
    expect(container.firstElementChild).toHaveClass("kh-field--error");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Choose your state.");
    expect(select).toHaveAccessibleDescription("Choose your state.");
  });

  it("describes an error when there is no hint", () => {
    render(<Select id="state" label="State" name="state" placeholder="Choose your state" options={STATES} error="Choose your state." />);
    const select = screen.getByLabelText("State");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("aria-describedby", "state-d");
    expect(select).toHaveAccessibleDescription("Choose your state.");
  });

  it("takes focus from the keyboard in DOM order after a Field, as the address form has them", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Field label="City or town" name="city" />
        <Select label="State" name="state" options={STATES} placeholder="Choose your state" />
      </>,
    );
    await user.tab();
    expect(screen.getByLabelText("City or town")).toHaveFocus();
    await user.tab();
    expect(screen.getByLabelText("State")).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it("matches the approved mockup's state picker", () => {
    const all = [...mockupPage("store-confirmation").querySelectorAll("#state option:not([value])")].map((o) => o.textContent ?? "");
    expect(all).toHaveLength(36);
    const { container } = render(<Select id="state" label="State" name="state" placeholder="Choose your state" options={all} required />);
    expect(canonical(container.firstElementChild!)).toBe(canonical(mockupElement("store-confirmation", ".kh-field:has(#state)")));
  });
});
