import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";

const ITEMS = [
  { label: "One", panel: <p>Panel one</p> },
  { label: "Two", panel: <p>Panel two</p> },
];

describe("Tabs", () => {
  it("wires each tab to its panel with ARIA, one tab in the tab order", () => {
    render(<Tabs label="Example" items={ITEMS} />);
    expect(screen.getByRole("tablist", { name: "Example" })).toBeInTheDocument();
    const [one, two] = screen.getAllByRole("tab");
    expect(one).toHaveAttribute("tabindex", "0");
    expect(two).toHaveAttribute("tabindex", "-1");
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("aria-labelledby", one.id);
    expect(one).toHaveAttribute("aria-controls", panel.id);
  });

  it("wraps with the arrow keys and jumps with Home and End", async () => {
    const user = userEvent.setup();
    render(<Tabs label="Example" items={ITEMS} />);
    await user.click(screen.getByRole("tab", { name: "One" }));
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel two");
  });
});
