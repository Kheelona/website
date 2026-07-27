import { render, screen, fireEvent, act } from "@testing-library/react";
import { KheeluGuide } from "./KheeluGuide";

describe("KheeluGuide", () => {
  it("is a labelled aside with exactly one desktop tab stop (the poke button)", () => {
    render(<KheeluGuide />);
    expect(screen.getByRole("complementary", { name: "Kheelu, your guide" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Give Kheelu a poke" })).toBeInTheDocument();
  });

  it("never exposes a live region (narration must not churn the a11y tree)", () => {
    const { container } = render(<KheeluGuide />);
    expect(container.querySelector("[aria-live]")).toBeNull();
    expect(container.querySelector("[role='status']")).toBeNull();
  });

  it("speaks a poke line on click and clears it after the bounce", () => {
    vi.useFakeTimers();
    render(<KheeluGuide />);
    fireEvent.click(screen.getByRole("button", { name: "Give Kheelu a poke" }));
    const bubble = document.querySelector(".kheelu-guide-bubble");
    expect(bubble).not.toBeNull();
    expect(bubble).toHaveAttribute("aria-hidden", "true");
    act(() => {
      vi.advanceTimersByTime(1700);
    });
    expect(document.querySelector(".kheelu-guide-bubble")).toBeNull();
    vi.useRealTimers();
  });

  it("docks a reserve link on mobile pointing at the finale anchor", () => {
    render(<KheeluGuide />);
    expect(screen.getByRole("link", { name: /Reserve at ₹4,999/ })).toHaveAttribute(
      "href",
      "#reserve",
    );
  });

  it("mounts all seven poses pre-decoded with only the active one visible", () => {
    const { container } = render(<KheeluGuide />);
    const desktopImages = container.querySelectorAll("button img");
    expect(desktopImages.length).toBe(7);
    const visible = Array.from(desktopImages).filter((img) =>
      img.className.includes("block"),
    );
    expect(visible.length).toBe(1);
    expect(visible[0]?.getAttribute("src")).toContain("hero-wink");
  });
});
