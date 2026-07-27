import { render, screen } from "@testing-library/react";
import { PacePanel } from "./PacePanel";

describe("PacePanel", () => {
  it("frames the comparison as school plus Lumi, not school versus Lumi", () => {
    render(<PacePanel />);
    expect(
      screen.getByRole("heading", { name: "School teaches the class. Lumi teaches your child." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nothing here is a criticism of teachers/)).toBeInTheDocument();
  });

  it("never claims Lumi replaces a teacher or a tutor", () => {
    const { container } = render(<PacePanel />);
    expect(container.textContent).not.toMatch(/replaces? (a )?(teacher|tutor|school)/i);
    expect(container.textContent).not.toMatch(/better than (a )?(teacher|school)/i);
  });

  it("contrasts the two paces in parent words", () => {
    render(<PacePanel />);
    expect(screen.getByRole("heading", { name: "One lesson, thirty children." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "One lesson, one child." })).toBeInTheDocument();
    expect(
      screen.getByText("Every answer. Every day. At exactly the pace they set."),
    ).toBeInTheDocument();
  });

  it("draws the seats with decorative brand shapes, not a stock classroom photo", () => {
    const { container } = render(<PacePanel />);
    expect(container.querySelectorAll("img").length).toBe(0);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(13); // twelve seats in the room, one child
    svgs.forEach((s) => expect(s).toHaveAttribute("aria-hidden", "true"));
  });
});
