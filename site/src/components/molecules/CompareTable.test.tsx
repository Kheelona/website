import { render, screen } from "@testing-library/react";
import { CompareTable } from "./CompareTable";

describe("CompareTable", () => {
  it("renders the comparison grid with the Lumi column", () => {
    render(<CompareTable />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Lumi" }),
    ).toBeInTheDocument();
  });

  it("labels each row in parent words via a row header", () => {
    render(<CompareTable />);
    expect(
      screen.getByRole("rowheader", { name: "No screen, ever" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", { name: "Talks with your child, not at them" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", { name: "Grows with them, ages 3 to 10" }),
    ).toBeInTheDocument();
  });

  it("keeps the category columns, renamed for humans", () => {
    render(<CompareTable />);
    expect(
      screen.getByRole("columnheader", { name: "Smart toys" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Phone or TV" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Ordinary toys" }),
    ).toBeInTheDocument();
  });

  it("answers the languages row with the published number", () => {
    render(<CompareTable />);
    expect(screen.getByText("Yes, up to 10")).toBeInTheDocument();
  });
});
