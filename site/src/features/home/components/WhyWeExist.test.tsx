import { render, screen } from "@testing-library/react";
import { WhyWeExist } from "./WhyWeExist";

describe("WhyWeExist", () => {
  it("renders the manifesto heading", () => {
    render(<WhyWeExist />);
    expect(
      screen.getByRole("heading", {
        name: /Your child's best years deserve more than a screen\./i,
      }),
    ).toBeInTheDocument();
  });

  it("carries the Kheelu narrator line", () => {
    render(<WhyWeExist />);
    expect(
      screen.getByText(/Let me tell you why we made Lumi\./i),
    ).toBeInTheDocument();
  });

  it("closes with the ten-languages emphasis", () => {
    render(<WhyWeExist />);
    expect(
      screen.getByText(/In all 10 languages you speak at home\./i),
    ).toBeInTheDocument();
  });
});
