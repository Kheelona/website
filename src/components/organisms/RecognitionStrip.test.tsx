import { render, screen } from "@testing-library/react";
import { RecognitionStrip } from "./RecognitionStrip";

describe("RecognitionStrip", () => {
  it("renders the label and the recognition entries", () => {
    render(<RecognitionStrip />);
    expect(screen.getByText("Recognised by")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "NVIDIA Inception Program" })).toBeInTheDocument();
    expect(screen.getByText("Founders Inc")).toBeInTheDocument();
  });

  it("accepts a custom label", () => {
    render(<RecognitionStrip label="Backed by" />);
    expect(screen.getByText("Backed by")).toBeInTheDocument();
  });

  it("renders no safety proofs line (the dead safetyLine prop went in V6-12)", () => {
    render(<RecognitionStrip />);
    expect(screen.queryByText(/Wake-word mic/i)).toBeNull();
    expect(screen.queryByRole("link", { name: /See how we built safety in/i })).toBeNull();
  });
});
