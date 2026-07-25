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

  /* M4 mobile pass: phones get a stack instead of a 640px sideways scroll. */
  it("also stacks one card per claim for phones", () => {
    const { container } = render(<CompareTable />);
    const stack = container.querySelector("ul.sm\\:hidden");
    expect(stack).not.toBeNull();
    expect(stack!.querySelectorAll("li").length).toBe(6);
    // each card names every column, so nothing compared against is off-screen
    const first = stack!.querySelector("li")!;
    for (const col of ["Lumi", "Smart toys", "Phone or TV", "Ordinary toys"]) {
      expect(first.textContent).toContain(col);
    }
  });

  it("hides exactly one view at each size, so the a11y tree never doubles", () => {
    const { container } = render(<CompareTable />);
    expect(container.querySelector("ul")!.className).toContain("sm:hidden");
    expect(
      container.querySelector("div.overflow-x-auto")!.className,
    ).toContain("hidden");
  });

  it("answers the languages row with the published number in both views", () => {
    render(<CompareTable />);
    expect(screen.getAllByText("Yes, up to 10").length).toBe(2);
  });

  it("cannot let the two views disagree (both read one ROWS source)", () => {
    const { container } = render(<CompareTable />);
    const cardValues = Array.from(
      container.querySelectorAll("ul.sm\\:hidden li"),
    ).map((li) => li.querySelectorAll("dd")[0]!.textContent);
    const tableValues = Array.from(
      container.querySelectorAll("tbody tr"),
    ).map((tr) => tr.querySelectorAll("td")[0]!.textContent);
    expect(cardValues).toEqual(tableValues);
  });
});
