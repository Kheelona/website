import { render, screen } from "@testing-library/react";
import { PageHero } from "./PageHero";

describe("PageHero", () => {
  it("renders the left copy column and the right media", () => {
    render(
      <PageHero media={<img src="/product/lumi.png" alt="The Lumi plush" />}>
        <h1>Meet Lumi</h1>
        <p>A screen-free friend.</p>
      </PageHero>,
    );
    expect(screen.getByRole("heading", { name: "Meet Lumi" })).toBeInTheDocument();
    expect(screen.getByText("A screen-free friend.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "The Lumi plush" })).toBeInTheDocument();
  });

  it("renders copy-only when no media is supplied", () => {
    render(
      <PageHero>
        <h1>Just words</h1>
      </PageHero>,
    );
    expect(screen.getByRole("heading", { name: "Just words" })).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("feeds the guide through data attributes, like Room", () => {
    const { container } = render(
      <PageHero guide="curious" say="Come on in.">
        <h1>Narrated</h1>
      </PageHero>,
    );
    const section = container.querySelector("section");
    expect(section).toHaveAttribute("data-guide", "curious");
    expect(section).toHaveAttribute("data-say", "Come on in.");
  });

  it("keeps the hero out of the opacity-hidden reveal variants (LCP law)", () => {
    const { container } = render(
      <PageHero media={<img src="/product/lumi.png" alt="The Lumi plush" />}>
        <h1>Fast paint</h1>
      </PageHero>,
    );
    container.querySelectorAll("[data-reveal]").forEach((el) => {
      expect(el.getAttribute("data-reveal")).toBe("rise");
    });
  });
});
