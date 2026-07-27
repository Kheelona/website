import { render, screen } from "@testing-library/react";
import { LegalDoc } from "./LegalDoc";

const SECTIONS = [
  {
    h: "What we collect",
    ps: ["A parent name and a way to reach you.", "Nothing here is sold."],
  },
  {
    h: "How to leave",
    ps: ["One message removes you from the list."],
  },
] as const;

describe("LegalDoc", () => {
  it("renders the title as an h1 with its lede", () => {
    render(<LegalDoc title="Privacy, in plain words" lede="The short version." sections={SECTIONS} />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy, in plain words" }),
    ).toBeInTheDocument();
    expect(screen.getByText("The short version.")).toBeInTheDocument();
  });

  it("renders each prose section heading and its paragraphs", () => {
    render(<LegalDoc title="Terms" lede="Read me." sections={SECTIONS} />);
    expect(screen.getByRole("heading", { level: 2, name: "What we collect" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "How to leave" })).toBeInTheDocument();
    expect(screen.getByText("A parent name and a way to reach you.")).toBeInTheDocument();
    expect(screen.getByText("Nothing here is sold.")).toBeInTheDocument();
    expect(screen.getByText("One message removes you from the list.")).toBeInTheDocument();
  });

  it("appends the mandatory reserve finale (#reserve on every page)", () => {
    const { container } = render(<LegalDoc title="Terms" lede="Read me." sections={SECTIONS} />);
    expect(
      screen.getByRole("heading", { name: /Reserve Lumi before the price goes up/i }),
    ).toBeInTheDocument();
    expect(container.querySelector("#reserve")).toBeInTheDocument();
  });

  it("rides the room grammar, not the retired full-bleed washes", () => {
    const { container } = render(<LegalDoc title="Terms" lede="Read me." sections={SECTIONS} />);
    expect(container.querySelector("[data-wash]")).toBeNull();
  });

  it("carries the page's one quiet Kheelu line", () => {
    const { container } = render(
      <LegalDoc
        title="Privacy"
        lede="Read me."
        sections={SECTIONS}
        guide="bliss"
        say="I'll wait here while you read the careful words."
      />,
    );
    const hero = container.querySelector("[data-guide='bliss']");
    expect(hero).toHaveAttribute(
      "data-say",
      "I'll wait here while you read the careful words.",
    );
  });
});
