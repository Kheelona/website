import { render, screen } from "@testing-library/react";
import { ChatDemo } from "./ChatDemo";

describe("ChatDemo", () => {
  it("renders the full moon exchange as an accessible log", () => {
    render(<ChatDemo />);
    const log = screen.getByRole("log", {
      name: /A sample conversation between a child and Lumi/i,
    });
    expect(log).toBeInTheDocument();
    expect(screen.getByText(/why is the moon following us/i)).toBeInTheDocument();
    expect(screen.getByText(/Then the moon gets to meet her too/i)).toBeInTheDocument();
  });

  it("labels both speakers", () => {
    render(<ChatDemo />);
    expect(screen.getAllByText("Your child").length).toBe(2);
    expect(screen.getAllByText("Lumi").length).toBe(2);
  });

  it("keeps every bubble painted in the SSR base state (no opacity hiding)", () => {
    render(<ChatDemo />);
    // the entrance is applied via a motion + min-width gated CSS class,
    // never inline styles that could hide content at rest
    const bubbles = document.querySelectorAll(".chat-demo-bubble");
    expect(bubbles.length).toBe(4);
    bubbles.forEach((b) => {
      expect((b as HTMLElement).style.opacity).toBe("");
    });
  });

  it("renders a custom exchange in order (the V3 Kheelu-mode demo)", () => {
    const script = [
      { who: "lumi" as const, text: "Why do you think the hare lost?" },
      { who: "child" as const, text: "He went to sleep!" },
      { who: "lumi" as const, text: "If you were the hare, what would you do?" },
    ];
    const { container } = render(<ChatDemo turns={script} />);
    const bubbles = Array.from(container.querySelectorAll(".chat-demo-bubble"));
    expect(bubbles.length).toBe(3);
    expect(bubbles[0].textContent).toContain("Why do you think the hare lost?");
    expect(bubbles[1].textContent).toContain("He went to sleep!");
    expect(bubbles[2].textContent).toContain("what would you do?");
  });
});
