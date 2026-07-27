import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Faq } from "./Faq";

const items = [
  { q: "Is Lumi screen-free?", a: "Yes. Lumi never shows a screen." },
  { q: "What ages is Lumi for?", a: "Lumi is built for children ages 3 to 6." },
];

describe("Faq", () => {
  it("renders a trigger per question with the first item open by default", () => {
    render(<Faq items={items} />);
    expect(screen.getAllByRole("button")).toHaveLength(items.length);
    expect(
      screen.getByRole("button", { name: /Is Lumi screen-free/ }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText("Yes. Lumi never shows a screen."),
    ).toBeInTheDocument();
  });

  it("expands and collapses answers on click", async () => {
    const user = userEvent.setup();
    render(<Faq items={items} />);
    const first = screen.getByRole("button", { name: /Is Lumi screen-free/ });
    const second = screen.getByRole("button", { name: /What ages is Lumi/ });
    expect(second).toHaveAttribute("aria-expanded", "false");

    // type="single": opening the second collapses the first
    await user.click(second);
    expect(second).toHaveAttribute("aria-expanded", "true");
    expect(first).toHaveAttribute("aria-expanded", "false");

    // collapsible: clicking the open trigger closes it again
    await user.click(second);
    expect(second).toHaveAttribute("aria-expanded", "false");
  });
});
