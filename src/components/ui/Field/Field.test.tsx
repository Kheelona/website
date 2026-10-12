import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";

/* Field (task 2.5): the DS TextField (`kh-field`) as the approved store and confirmation mockups use it
 * (mockup/store.html fold 3, mockup/store-confirmation.html fold 3), with the `tel-in` variant (`ks-tel`,
 * from `mk-tel`) that shows +91 as decoration only. */

/** The built mockup's element, comments and whitespace-only text dropped, `mk-` classes renamed `ks-`
 *  (components §7). */
function mockupElement(page: string, selector: string): Element {
  const doc = new DOMParser().parseFromString(readFileSync(`mockup/${page}.html`, "utf8"), "text/html");
  const el = doc.querySelector(selector);
  if (!el) throw new Error(`${selector} is not in mockup/${page}.html`);
  return tidy(el.cloneNode(true) as Element);
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

function expectSameMarkup(actual: Element, expected: Element) {
  const a = tidy(actual.cloneNode(true) as Element);
  expect(a.isEqualNode(expected), `built:\n${a.outerHTML}\nmockup:\n${expected.outerHTML}`).toBe(true);
}

describe("Field", () => {
  it("renders the DS text field: a visible label tied to its input", () => {
    render(<Field label="Your name" name="parentName" />);
    const input = screen.getByLabelText("Your name");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveClass("kh-field__input");
    const label = screen.getByText("Your name");
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveClass("kh-field__label");
    expect(label).toHaveAttribute("for", input.id);
    expect(input.closest(".kh-field")).not.toBeNull();
  });

  it("forwards name, type, inputMode, autoComplete, maxLength and required unchanged", () => {
    render(
      <Field label="Indian WhatsApp number" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={14} required />,
    );
    const input = screen.getByLabelText("Indian WhatsApp number");
    expect(input).toHaveAttribute("name", "phone");
    expect(input).toHaveAttribute("type", "tel");
    expect(input).toHaveAttribute("inputmode", "tel");
    expect(input).toHaveAttribute("autocomplete", "tel");
    expect(input).toHaveAttribute("maxlength", "14");
    expect(input).toBeRequired();
  });

  it("adds no attribute the caller did not give (no default type, no required, no maxlength)", () => {
    render(<Field label="Landmark or area (optional)" name="line2" />);
    const input = screen.getByLabelText("Landmark or area (optional)");
    expect(input).not.toHaveAttribute("type");
    expect(input).not.toHaveAttribute("inputmode");
    expect(input).not.toHaveAttribute("autocomplete");
    expect(input).not.toHaveAttribute("maxlength");
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("ties the hint to the input by aria-describedby, with the mockup's id (`<id>-d`)", () => {
    render(<Field id="email" label="Email" name="email" hint="We email your confirmation here." />);
    const input = screen.getByLabelText("Email");
    const hint = screen.getByText("We email your confirmation here.");
    expect(hint).toHaveClass("kh-field__hint");
    expect(hint).toHaveAttribute("id", "email-d");
    expect(input).toHaveAttribute("aria-describedby", "email-d");
    expect(input).toHaveAccessibleDescription("We email your confirmation here.");
  });

  it("announces an error: it replaces the hint, is described, invalid and in an alert", () => {
    const { container } = render(
      <Field id="parentName" label="Your name" name="parentName" hint="As on your order." error="We need a name to put on the order." />,
    );
    const input = screen.getByLabelText("Your name");
    expect(container.querySelector(".kh-field")).toHaveClass("kh-field--error");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("kh-field__error");
    expect(alert).toHaveAttribute("id", "parentName-d");
    expect(alert).toHaveTextContent("We need a name to put on the order.");
    expect(input).toHaveAccessibleDescription("We need a name to put on the order.");
    expect(screen.queryByText("As on your order.")).toBeNull();
    // The DS error icon (warning-circle) is decoration.
    const icon = alert.querySelector("svg");
    expect(icon).toHaveClass("kh-icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("mounts a fresh alert when an error appears, so screen readers announce it", () => {
    const { rerender } = render(<Field id="phone" label="Phone" name="phone" hint="For messages about your order." />);
    const hint = screen.getByText("For messages about your order.");
    rerender(<Field id="phone" label="Phone" name="phone" hint="For messages about your order." error="Check the number." />);
    const alert = screen.getByRole("alert");
    expect(alert).not.toBe(hint);
    expect(hint.isConnected).toBe(false);
  });

  it("keeps a description the caller passes, after its own", () => {
    render(<><p id="note">Note</p><Field id="city" label="City or town" name="city" hint="Hint" aria-describedby="note" /></>);
    expect(screen.getByLabelText("City or town")).toHaveAttribute("aria-describedby", "city-d note");
  });

  it("tel-in: +91 sits before the digits as decoration only, never in the value or the name", () => {
    const { container } = render(<Field id="phone" variant="tel-in" label="Indian WhatsApp number" name="phone" type="tel" />);
    const wrap = container.querySelector(".ks-tel");
    expect(wrap).not.toBeNull();
    const cc = wrap!.querySelector(".ks-tel__cc");
    expect(cc).toHaveTextContent("+91");
    expect(cc).toHaveAttribute("aria-hidden", "true");
    const input = screen.getByLabelText("Indian WhatsApp number") as HTMLInputElement;
    expect(input.parentElement).toBe(wrap);
    expect(cc!.nextElementSibling).toBe(input);
    expect(input.value).toBe("");
    expect(input).toHaveAccessibleName("Indian WhatsApp number");
  });

  it("passes a className to the wrapper only", () => {
    const { container } = render(<Field label="PIN code" name="pincode" className="ks-x" />);
    expect(container.firstElementChild).toHaveClass("kh-field", "ks-x");
    expect(screen.getByLabelText("PIN code")).not.toHaveClass("ks-x");
  });

  describe("matches the approved mockup's markup", () => {
    it("store: your name", () => {
      const { container } = render(
        <Field id="parentName" label="Your name" name="parentName" type="text" maxLength={80} autoComplete="name" required />,
      );
      expectSameMarkup(container.firstElementChild!, mockupElement("store", ".kh-field:has(#parentName)"));
    });

    it("store: the phone field (tel-in, with its hint)", () => {
      const { container } = render(
        <Field
          id="phone"
          variant="tel-in"
          label="Indian WhatsApp number"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          hint="For messages about your order, including the link to pay the balance before dispatch."
        />,
      );
      expectSameMarkup(container.firstElementChild!, mockupElement("store", ".kh-field:has(#phone)"));
    });

    it("store: email and the child's age", () => {
      const email = render(
        <Field id="email" label="Email" name="email" type="email" inputMode="email" autoComplete="email" required hint="We email your confirmation here." />,
      );
      expectSameMarkup(email.container.firstElementChild!, mockupElement("store", ".kh-field:has(#email)"));
      const age = render(
        <Field
          id="childAge"
          label="Your child’s age"
          name="childAge"
          type="text"
          maxLength={20}
          required
          hint="Kheelu is made for children aged 3 to 7. Just the number is fine, like 4."
        />,
      );
      expectSameMarkup(age.container.firstElementChild!, mockupElement("store", ".kh-field:has(#childAge)"));
    });

    it("confirmation: the address lines and the PIN code", () => {
      const line2 = render(
        <Field id="line2" label="Landmark or area (optional)" name="line2" type="text" maxLength={120} autoComplete="address-line2" />,
      );
      expectSameMarkup(line2.container.firstElementChild!, mockupElement("store-confirmation", ".kh-field:has(#line2)"));
      const pin = render(
        <Field id="pincode" label="PIN code" name="pincode" type="text" inputMode="numeric" maxLength={6} autoComplete="postal-code" required />,
      );
      expectSameMarkup(pin.container.firstElementChild!, mockupElement("store-confirmation", ".kh-field:has(#pincode)"));
    });
  });

  describe("inputs are at least 16 px (iOS zooms the page on a smaller focused field)", () => {
    it("the DS input class sets 16/24 and the Field CSS never resizes it", () => {
      const bundle = readFileSync("design-system/project/components/bundle.css", "utf8");
      const rule = /\.kh-field__input\s*\{([^}]*)\}/.exec(bundle)?.[1] ?? "";
      expect(rule).toMatch(/font:\s*400 16px\/24px var\(--font-body\)/);
      const own = readFileSync("src/components/ui/Field/field.css", "utf8");
      expect(own).not.toMatch(/font(?:-size)?\s*:/);
    });
  });
});
