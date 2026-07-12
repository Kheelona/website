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

  it("labels each honest-comparison row via a row header", () => {
    render(<CompareTable />);
    expect(
      screen.getByRole("rowheader", { name: "Screen-free" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", { name: "Holds a conversation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("rowheader", { name: "Made for ages 3 to 6" }),
    ).toBeInTheDocument();
  });

  it("keeps the category columns", () => {
    render(<CompareTable />);
    expect(
      screen.getByRole("columnheader", { name: "Smart toys" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Phone / TV" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Static toys" }),
    ).toBeInTheDocument();
  });
});
