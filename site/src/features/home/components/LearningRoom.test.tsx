import { render, screen } from "@testing-library/react";
import { LearningRoom } from "./LearningRoom";

describe("LearningRoom", () => {
  it("leads with the story-then-question mechanism, not an adjective", () => {
    render(<LearningRoom />);
    expect(
      screen.getByRole("heading", { name: /Your child hears a story/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/That is Kheelu mode/)).toBeInTheDocument();
  });

  it("shows the quiz loop as a real exchange (the proof, not the claim)", () => {
    const { container } = render(<LearningRoom />);
    const bubbles = Array.from(container.querySelectorAll(".chat-demo-bubble"));
    expect(bubbles.length).toBe(3);
    expect(bubbles[0].textContent).toContain("Why do you think the hare lost?");
    expect(bubbles[2].textContent).toContain("what would you do?");
  });

  it("names what gets learned in three chips", () => {
    render(<LearningRoom />);
    expect(screen.getByText("New words, counted in the app")).toBeInTheDocument();
    expect(screen.getByText("Numbers and rhymes")).toBeInTheDocument();
    expect(screen.getByText("Feelings, named")).toBeInTheDocument();
  });

  it("carries a buy path, because this is the strongest new argument", () => {
    render(<LearningRoom />);
    expect(screen.getByRole("link", { name: /Reserve Lumi at ₹4,999/ })).toHaveAttribute(
      "href",
      "#reserve",
    );
  });

  it("states the age arc from the shared constants", () => {
    render(<LearningRoom />);
    expect(screen.getByText(/from 2 to 5 today/)).toBeInTheDocument();
    expect(screen.getByText(/to 14\./)).toBeInTheDocument();
  });
});
