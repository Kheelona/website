import { render, screen } from "@testing-library/react";
import { Beat } from "./Beat";

describe("Beat", () => {
  it("renders its children inside the beat anchor", () => {
    render(
      <Beat id="hero">
        <p>Meet Lumi</p>
      </Beat>,
    );
    expect(screen.getByText("Meet Lumi")).toBeInTheDocument();
  });

  it("stamps the id onto the data-beat attribute the stage keys off", () => {
    render(
      <Beat id="hero">
        <p>content</p>
      </Beat>,
    );
    const beat = screen.getByText("content").closest("[data-beat]");
    expect(beat).toHaveAttribute("data-beat", "hero");
  });

  it("adds an id for chapter-nav targets when anchor is given", () => {
    render(
      <Beat id="hero" anchor="meet-lumi">
        <p>content</p>
      </Beat>,
    );
    const beat = screen.getByText("content").closest("[data-beat]");
    expect(beat).toHaveAttribute("id", "meet-lumi");
  });

  it("carries no id when anchor is omitted", () => {
    render(
      <Beat id="hero">
        <p>content</p>
      </Beat>,
    );
    const beat = screen.getByText("content").closest("[data-beat]");
    expect(beat).not.toHaveAttribute("id");
  });
});
