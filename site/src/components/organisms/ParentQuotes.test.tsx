import { render, screen } from "@testing-library/react";
import { ParentQuotes } from "./ParentQuotes";

describe("ParentQuotes", () => {
  it("renders the heading and all three pilot quotes by default", () => {
    render(<ParentQuotes />);
    expect(
      screen.getByRole("heading", { name: "Ten families test Lumi every day." }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Her face lit up in the first sixty seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/She asks for it before the TV now/i)).toBeInTheDocument();
    expect(screen.getByText(/first 'smart' thing in our house/i)).toBeInTheDocument();
  });

  it("count=2 shows only the first two quotes", () => {
    render(<ParentQuotes count={2} />);
    expect(screen.getByText(/Her face lit up/i)).toBeInTheDocument();
    expect(screen.queryByText(/first 'smart' thing in our house/i)).toBeNull();
  });

  it("accepts custom eyebrow and title copy", () => {
    render(<ParentQuotes eyebrow="Real families" title="Loved at home" />);
    expect(screen.getByText("Real families")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Loved at home" })).toBeInTheDocument();
  });
});
