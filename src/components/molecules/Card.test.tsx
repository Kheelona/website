import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders its title as a heading and its children", () => {
    render(<Card title="In the box">One Kheelu plush.</Card>);
    expect(
      screen.getByRole("heading", { name: "In the box" }),
    ).toBeInTheDocument();
    expect(screen.getByText("One Kheelu plush.")).toBeInTheDocument();
  });

  it("omits the heading when no title is given", () => {
    render(<Card>Just body copy.</Card>);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("Just body copy.")).toBeInTheDocument();
  });

  it("carries the token card shell (radius + white wash)", () => {
    const { container } = render(<Card tilt={false}>Body</Card>);
    const shell = container.firstElementChild as HTMLElement;
    expect(shell.className).toContain("rounded-(--radius-card)");
    expect(shell.className).toContain("bg-white");
  });

  it("merges className overrides onto the shell", () => {
    const { container } = render(
      <Card tilt={false} className="bg-cream">
        Body
      </Card>,
    );
    const shell = container.firstElementChild as HTMLElement;
    expect(shell.className).toContain("bg-cream");
  });
});
