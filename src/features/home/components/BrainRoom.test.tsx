import { render, screen } from "@testing-library/react";
import { BrainRoom } from "./BrainRoom";

describe("BrainRoom", () => {
  it("explains serve and return in plain words", () => {
    render(<BrainRoom />);
    expect(
      screen.getByRole("heading", { name: "Back and forth is how a brain gets built." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Researchers call it serve and return/)).toBeInTheDocument();
  });

  it("quotes no statistics: the sourced numbers belong to the article", () => {
    const { container } = render(<BrainRoom />);
    expect(container.textContent).not.toMatch(/\d+\s?%|\d+ times|\d+ million/);
  });

  it("hands off to the journal article that carries the depth", () => {
    render(<BrainRoom />);
    expect(
      screen.getByRole("link", { name: "Read the science in the journal" }),
    ).toHaveAttribute("href", "/stories/how-children-learn-by-talking");
  });

  it("owns a visual anchor (no text-only room on a conversion page)", () => {
    render(<BrainRoom />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});
