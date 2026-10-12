import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

/* Select (task 2.5): the DS Select (`kh-select`, a native <select> styled as the text field) as the approved
 * confirmation mockup's state picker uses it (mockup/store-confirmation.html fold 3). */

/** The built mockup's element: comments and whitespace-only text dropped, `mk-` classes renamed `ks-`, and an
 *  option's implicit value (its text, HTML's default) written out, as React writes every option's value. */
function mockupElement(page: string, selector: string): Element {
  const doc = new DOMParser().parseFromString(readFileSync(`mockup/${page}.html`, "utf8"), "text/html");
  const el = doc.querySelector(selector);
  if (!el) throw new Error(`${selector} is not in mockup/${page}.html`);
  const copy = tidy(el.cloneNode(true) as Element);
  copy.querySelectorAll("option:not([value])").forEach((o) => o.setAttribute("value", o.textContent ?? ""));
  return copy;
}

function tidy<T extends Node>(node: T): T {
  node.normalize();
  const walk = (n: Node) => {
    for (const child of [...n.childNodes]) {
      if (child.nodeType === 8 || (child.nodeType === 3 && !(child.textContent ?? "").trim())) child.remove();
      else if (child.nodeType === 1) walk(child);
    }
    if (n instanceof Element && n.hasAttribute("class")) n.setAttribute("class", n.getAttribute("class")!.replace(/\bmk-/g, "ks-"));
  };
  walk(node);
  return node;
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

  it("matches the approved mockup's state picker", () => {
    const html = readFileSync("mockup/store-confirmation.html", "utf8");
    const all = [...new DOMParser().parseFromString(html, "text/html").querySelectorAll("#state option:not([value])")].map(
      (o) => o.textContent ?? "",
    );
    expect(all).toHaveLength(36);
    const { container } = render(<Select id="state" label="State" name="state" placeholder="Choose your state" options={all} required />);
    const built = tidy(container.firstElementChild!.cloneNode(true) as Element);
    const mockup = mockupElement("store-confirmation", ".kh-field:has(#state)");
    expect(built.isEqualNode(mockup), `built:\n${built.outerHTML}\nmockup:\n${mockup.outerHTML}`).toBe(true);
  });
});
