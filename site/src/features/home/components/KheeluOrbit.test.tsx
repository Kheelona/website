import { render, screen } from "@testing-library/react";
import { KheeluOrbit } from "./KheeluOrbit";

describe("KheeluOrbit", () => {
  it("renders all six day moments in reading order", () => {
    render(<KheeluOrbit />);
    const labels = ["Morning", "After school", "Homework hour", "Evening", "On the train", "Bedtime"];
    const rendered = screen.getAllByText(new RegExp(`^(${labels.join("|")})$`)).map((el) => el.textContent);
    expect(rendered).toEqual(labels);
  });

  it("keeps every card painted at rest (orbit motion is CSS-gated)", () => {
    const { container } = render(<KheeluOrbit />);
    const cards = container.querySelectorAll(".orbit-card");
    expect(cards.length).toBe(6);
    cards.forEach((c) => {
      expect((c as HTMLElement).style.opacity).toBe("");
    });
  });

  it("centres Kheelu as decoration (the copy carries the content)", () => {
    const { container } = render(<KheeluOrbit />);
    const img = container.querySelector("img.kheelu-orbit-center")!;
    expect(img).toHaveAttribute("alt", "");
  });
});
