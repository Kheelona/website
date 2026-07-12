import { render, screen } from "@testing-library/react";
import { PageHero } from "./PageHero";

describe("PageHero", () => {
  it("renders the left copy column and the right media", () => {
    render(
      <PageHero media={<img src="/product/lumi-blue.png" alt="The Lumi plush" />}>
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
});
