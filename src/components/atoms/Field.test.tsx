import { render, screen } from "@testing-library/react";
import { TextField, SelectField, ChoiceField } from "./Field";

/**
 * These atoms exist to make the store's form usable, and "usable" here has a
 * specific meaning the a11y gate can measure. Each test below is one way a form
 * commonly becomes unusable, closed.
 */
describe("TextField", () => {
  it("ties a real label to the control, rather than using a placeholder as one", () => {
    render(<TextField label="Your name" name="parentName" required />);
    // getByLabelText only passes when the association actually exists
    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
  });

  it("marks optional fields, so nothing else needs a required asterisk key", () => {
    render(<TextField label="Landmark" name="line2" />);
    expect(screen.getByText("(optional)")).toBeInTheDocument();
  });

  /* A hint the sighted reader gets and the screen-reader user does not is the
     quiet version of this bug, so both hint and error are described-by. */
  it("announces the hint AND the error together", () => {
    render(
      <TextField
        label="WhatsApp number"
        name="phone"
        required
        hint="Where we send your confirmation."
        error="We need a 10 digit number."
      />,
    );
    const input = screen.getByLabelText("WhatsApp number");
    const described = (input.getAttribute("aria-describedby") ?? "").split(" ");
    expect(described).toHaveLength(2);
    const text = described.map((id) => document.getElementById(id)?.textContent).join(" ");
    expect(text).toContain("Where we send your confirmation.");
    expect(text).toContain("We need a 10 digit number.");
  });

  it("says it is invalid in the accessibility tree, not only in colour", () => {
    render(<TextField label="Email" name="email" required error="We need an email address." />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });

  it("stays clean when there is nothing wrong", () => {
    render(<TextField label="Email" name="email" required />);
    const input = screen.getByLabelText("Email");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  /* iOS Safari zooms the viewport when a focused input's text is under 16px,
     which on a payment form reads as the page breaking mid-purchase. */
  it("keeps the control's text at 17px so iOS does not zoom the page", () => {
    render(<TextField label="Email" name="email" required />);
    expect(screen.getByLabelText("Email").className).toContain("text-[17px]");
  });
});

describe("SelectField", () => {
  it("offers every option plus a disabled prompt, so nothing is preselected", () => {
    render(
      <SelectField label="Your child's age" name="childAge" required options={["2", "3", "4"]} />,
    );
    const select = screen.getByLabelText("Your child's age") as HTMLSelectElement;
    expect(select.value).toBe("");
    expect(screen.getByRole("option", { name: "Choose one" })).toBeDisabled();
    for (const age of ["2", "3", "4"]) {
      expect(screen.getByRole("option", { name: age })).toBeInTheDocument();
    }
  });
});

describe("ChoiceField", () => {
  it("makes the whole sentence the label, so tapping the words ticks the box", () => {
    render(<ChoiceField name="accepted">I accept the pre-order terms.</ChoiceField>);
    expect(screen.getByLabelText("I accept the pre-order terms.")).toHaveAttribute(
      "type",
      "checkbox",
    );
  });

  it("carries its error accessibly too", () => {
    render(
      <ChoiceField name="accepted" error="Please tick the box.">
        I accept the pre-order terms.
      </ChoiceField>,
    );
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(document.getElementById(box.getAttribute("aria-describedby")!)?.textContent).toBe(
      "Please tick the box.",
    );
  });
});
