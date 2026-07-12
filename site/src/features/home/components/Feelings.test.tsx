import { render, screen } from "@testing-library/react";
import { Feelings } from "./Feelings";

describe("Feelings", () => {
  it("renders the section heading", () => {
    render(<Feelings />);
    expect(
      screen.getByRole("heading", {
        name: /Learning starts with feeling understood\./i,
      }),
    ).toBeInTheDocument();
  });

  it("names all five feelings as card headings", () => {
    render(<Feelings />);
    for (const name of ["Curious", "Grumpy", "Sad", "Silly", "Joy"]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("carries the Kheelu narrator line above the grid", () => {
    render(<Feelings />);
    expect(
      screen.getByText(/These are the five feelings Lumi understands/i),
    ).toBeInTheDocument();
  });
});
