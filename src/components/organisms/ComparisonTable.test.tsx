import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComparisonTable } from "./ComparisonTable";
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from "@/lib/comparison";

describe("ComparisonTable", () => {
  it("compares product TYPES, and names no brand anywhere (content doc rule)", () => {
    const { container } = render(<ComparisonTable />);
    expect(container.textContent).not.toMatch(
      /alexa|echo|google home|nest|siri|homepod|ipad|kindle|samsung|miko|emo\b/i,
    );
    expect([...COMPARISON_COLUMNS]).toEqual([
      "Kheelu",
      "Smart speaker",
      "Tablet or phone",
      "Robot toy with a screen",
    ]);
  });

  it("carries the four ticks that left the hero", () => {
    const labels = COMPARISON_ROWS.map((r) => r.label);
    expect(labels).toContain("Screen");
    expect(labels).toContain("Can open videos, websites or shopping");
    expect(labels).toContain("You can read every conversation");
    expect(labels).toContain("Talks in Indian home languages");
  });

  it("publishes no age ceiling and no unchecked price row", () => {
    const { container } = render(<ComparisonTable />);
    expect(container.textContent).not.toMatch(/3 to 7|\[|₹/);
  });

  it("on a phone, the chips swap the right-hand column and keep Kheelu on the left", async () => {
    const user = userEvent.setup();
    render(<ComparisonTable />);
    const group = screen.getByRole("group", { name: "Compare Kheelu with" });
    const tablet = within(group).getByRole("button", { name: "Tablet or phone" });
    expect(within(group).getByRole("button", { name: "Smart speaker" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(tablet);
    expect(tablet).toHaveAttribute("aria-pressed", "true");
    const phoneTable = screen.getAllByRole("table")[0];
    expect(within(phoneTable).getByRole("columnheader", { name: "Tablet or phone" })).toBeInTheDocument();
    expect(within(phoneTable).getByRole("columnheader", { name: "Kheelu" })).toBeInTheDocument();
  });
});
