import { readFileSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { Checkbox } from "./Checkbox";

/* Checkbox (task 2.5): the DS Checkbox (`kh-check`) as the approved store mockup's consent row uses it
 * (mockup/store.html fold 3, `kh-check mk-consent`, ported as the `consent` variant `ks-consent`). */

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

/** The consent sentence as the mockup words and links it (the store page passes its own, from content). */
function ConsentLabel() {
  return (
    <>
      I accept the{" "}
      <a href="terms.html" target="_blank" rel="noopener">
        pre-order terms<span className="kh-sr"> (opens in a new tab)</span>
      </a>{" "}
      and the{" "}
      <a href="refund.html" target="_blank" rel="noopener">
        refund policy<span className="kh-sr"> (opens in a new tab)</span>
      </a>
      , and I am happy to hear about my own order on WhatsApp.
    </>
  );
}

describe("Checkbox", () => {
  it("renders the DS checkbox: a real input, then the label with the box and the text", () => {
    const { container } = render(<Checkbox label="Send me updates" name="updates" />);
    const input = screen.getByRole("checkbox", { name: "Send me updates" });
    expect(input).toHaveClass("kh-check__input");
    expect(container.firstElementChild).toHaveClass("kh-check");
    const label = container.querySelector("label.kh-check__label");
    expect(label).toHaveAttribute("for", input.id);
    expect(input.nextElementSibling).toBe(label);
    const box = label!.querySelector(".kh-check__box");
    expect(box).toHaveAttribute("aria-hidden", "true");
    // Drawn through Glyph (task 3.6 item 4), with the DS icon markup exactly as the mockup's {{icon:}} injection writes it.
    expect(box!.querySelector("svg.kh-check__tick")!.outerHTML).toBe(
      `<svg class="kh-icon kh-check__tick" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="${ICON_PATHS.check}"></path></svg>`,
    );
    expect(box!.querySelector(".kh-check__dash")).not.toBeNull();
    expect(label!.querySelector(".kh-check__text > span")).toHaveTextContent("Send me updates");
  });

  it("forwards input attributes unchanged and is never pre-ticked unless asked", async () => {
    render(<Checkbox label="I accept" name="accepted" required />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input).toHaveAttribute("name", "accepted");
    expect(input).toHaveAttribute("type", "checkbox");
    expect(input).toBeRequired();
    expect(input.checked).toBe(false);
    await userEvent.setup().click(screen.getByText("I accept"));
    expect(input.checked).toBe(true);
  });

  it("is reachable by Tab although visually hidden, Space ticks and unticks it, and the sentence's links follow", async () => {
    const user = userEvent.setup();
    render(<Checkbox consent label={<ConsentLabel />} name="consent" required />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    await user.tab();
    expect(input).toHaveFocus();
    await user.keyboard(" ");
    expect(input.checked).toBe(true);
    await user.keyboard(" ");
    expect(input.checked).toBe(false);
    await user.tab();
    expect(screen.getByRole("link", { name: /pre-order terms/ })).toHaveFocus();
  });

  it("ties the hint to the input (`<id>-h`, inside the label text, as the DS does)", () => {
    render(<Checkbox id="news" label="Updates" name="news" hint="One message a month." />);
    const input = screen.getByRole("checkbox");
    const hint = screen.getByText("One message a month.");
    expect(hint).toHaveClass("kh-check__hint");
    expect(hint).toHaveAttribute("id", "news-h");
    expect(input).toHaveAttribute("aria-describedby", "news-h");
  });

  it("announces an error under the row, describes the input with it and marks it invalid", () => {
    render(<Checkbox id="accepted" label="I accept" name="accepted" error="Please tick the box to accept the pre-order terms." />);
    const input = screen.getByRole("checkbox");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("kh-field__error");
    expect(alert).toHaveTextContent("Please tick the box to accept the pre-order terms.");
    expect(alert).toHaveAttribute("id", "accepted-e");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Please tick the box to accept the pre-order terms.");
    // Outside the label, so the error is never read as part of the checkbox's name.
    expect(alert.closest("label")).toBeNull();
    expect(input).toHaveAccessibleName("I accept");
  });

  it("consent: links in the sentence take the link colour hook (`ks-consent`)", () => {
    const { container } = render(<Checkbox consent label={<ConsentLabel />} name="accepted" />);
    expect(container.firstElementChild).toHaveClass("kh-check", "ks-consent");
    expect(screen.getByRole("link", { name: /^pre-order terms/ })).toHaveAttribute("href", "terms.html");
  });

  it("matches the approved mockup's consent row", () => {
    const { container } = render(<Checkbox consent id="accepted" name="accepted" required label={<ConsentLabel />} />);
    const built = tidy(container.firstElementChild!.cloneNode(true) as Element);
    const mockup = mockupElement("store", ".kh-check:has(#accepted)");
    expect(built.isEqualNode(mockup), `built:\n${built.outerHTML}\nmockup:\n${mockup.outerHTML}`).toBe(true);
  });
});
