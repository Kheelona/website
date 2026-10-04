import { fireEvent, render, screen } from "@testing-library/react";
import { AgeTabs } from "./AgeTabs";
import { GROWTH_ARC } from "@/lib/growth-arc";

describe("AgeTabs", () => {
  it("labels the three named ages from the published arc", () => {
    render(<AgeTabs />);
    for (const t of ["Age 3", "Age 4", "Age 5"]) {
      expect(screen.getByRole("tab", { name: t })).toBeInTheDocument();
    }
    expect(screen.queryByRole("tab", { name: /Every year after/ })).toBeNull();
  });

  it("renders the arc's own words, not a draft", () => {
    const { container } = render(<AgeTabs />);
    for (const s of GROWTH_ARC.slice(0, 3)) {
      expect(container.textContent).toContain(s.title);
      expect(container.textContent).toContain(s.body);
    }
  });

  it("switches age on tap", () => {
    render(<AgeTabs />);
    fireEvent.click(screen.getByRole("tab", { name: "Age 5" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent(GROWTH_ARC[2].title);
  });
});
