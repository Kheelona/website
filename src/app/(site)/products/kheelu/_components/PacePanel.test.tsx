import { render, screen } from "@testing-library/react";
import { PacePanel } from "./PacePanel";

describe("PacePanel", () => {
  it("frames the comparison as school plus Kheelu, not school versus Kheelu", () => {
    render(<PacePanel />);
    expect(
      screen.getByRole("heading", { name: "School teaches the class. Kheelu teaches your child." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nothing here is a criticism of teachers/)).toBeInTheDocument();
  });

  it("never claims Kheelu replaces a teacher or a tutor", () => {
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

  it("extends the pace argument to years and closes on Home's line verbatim (V6 D5, CMO merge)", () => {
    render(<PacePanel />);
    expect(
      screen.getByText(
        /The memory that picks up where your child stopped tomorrow keeps picking up for years\. First questions at 3 become stories, numbers, and bigger questions, one day at a time\./,
      ),
    ).toBeInTheDocument();
    /* Rendered from GROWTH_CLOSING, the same source Home's how-it-works room
       ends on, so the two pages say it identically by construction. The old
       hero promise is retired with the CMO merge. */
    expect(
      screen.getByText("A best friend the whole way. A tutor whenever they need one."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/A head start for school/)).toBeNull();
  });

  it("draws the seats with decorative brand shapes, not a stock classroom photo", () => {
    const { container } = render(<PacePanel />);
    expect(container.querySelectorAll("img").length).toBe(0);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(13); // twelve seats in the room, one child
    svgs.forEach((s) => expect(s).toHaveAttribute("aria-hidden", "true"));
  });
});
