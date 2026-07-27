import { render, screen } from "@testing-library/react";
import { Statement } from "./Statement";

describe("Statement", () => {
  it("renders the brand statement and the argument", () => {
    render(<Statement />);
    expect(
      screen.getByRole("heading", { name: "We build companions, not gadgets." }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/That back and forth is how your child learns to think/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Your child feels known, not managed/i),
    ).toBeInTheDocument();
  });
});
