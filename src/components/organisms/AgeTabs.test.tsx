import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AgeTabs } from "./AgeTabs";
import { GROWTH_ARC } from "@/lib/growth-arc";

describe("AgeTabs", () => {
  it("draws its tabs and words from the published growth arc", () => {
    render(<AgeTabs />);
    expect(screen.getAllByRole("tab").map((t) => t.textContent)).toEqual([
      "Age 3",
      "Age 4",
      "Age 5",
    ]);
    expect(screen.getByRole("tabpanel")).toHaveTextContent(GROWTH_ARC[0].title);
  });

  it("switches panels on click and with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<AgeTabs />);
    await user.click(screen.getByRole("tab", { name: "Age 4" }));
    expect(screen.getByRole("tab", { name: "Age 4" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent(GROWTH_ARC[1].title);

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Age 5" })).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveTextContent(GROWTH_ARC[2].title);
  });

  it("keeps every panel in the DOM for readers without JavaScript", () => {
    const { container } = render(<AgeTabs />);
    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(3);
  });
});
