import { render, screen } from "@testing-library/react";
import { StepList, type Step } from "./StepList";

const steps: Step[] = [
  { title: "Open the box", body: "Everything is inside." },
  { title: "Say hello", body: "Lumi wakes up." },
];

describe("StepList", () => {
  it("renders an ordered list with one row per step", () => {
    render(<StepList items={steps} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("auto-numbers rows as zero-padded numerals when n is omitted", () => {
    render(<StepList items={steps} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("honours an explicit numeral when provided", () => {
    render(<StepList items={[{ n: "A", title: "Alpha", body: "First." }]} />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders each step title as a heading of the requested level", () => {
    render(<StepList items={steps} as="h2" />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Open the box" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Lumi wakes up.")).toBeInTheDocument();
  });

  it("keeps body-less statements out of the heading outline", () => {
    render(<StepList items={[{ title: "Safety is a promise." }]} />);
    expect(screen.getByText("Safety is a promise.")).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
