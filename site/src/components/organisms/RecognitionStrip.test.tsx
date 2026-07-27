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

  it("omits the safety proofs line by default and shows it when enabled", () => {
    const { rerender } = render(<RecognitionStrip />);
    expect(screen.queryByRole("link", { name: /See how we built safety in/i })).toBeNull();

    rerender(<RecognitionStrip safetyLine />);
    expect(screen.getByText(/Wake-word mic/i)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /See how we built safety in/i });
    expect(link).toHaveAttribute("href", "/safety");
  });
});
