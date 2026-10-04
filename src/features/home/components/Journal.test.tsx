import { render, screen } from "@testing-library/react";
import { Journal } from "./Journal";

describe("Journal", () => {
  it("renders the section heading", () => {
    render(<Journal />);
    expect(
      screen.getByRole("heading", { name: /Raising curious kids\./i }),
    ).toBeInTheDocument();
  });

  it("links each story card into /stories, retitled but on its original slug", () => {
    render(<Journal />);
    expect(
      screen.getByRole("link", { name: /Why the early years matter most/i }),
    ).toHaveAttribute(
      "href",
      "/stories/why-three-to-six-are-the-years-that-matter-most",
    );
  });

  it("offers a see-all-stories ghost link", () => {
    render(<Journal />);
    expect(
      screen.getByRole("link", { name: /See all stories/i }),
    ).toHaveAttribute("href", "/stories");
  });

  it("previews each article with its own photograph, not the mascot drawing", () => {
    const { container } = render(<Journal />);
    const srcs = Array.from(container.querySelectorAll("img")).map((i) => i.getAttribute("src"));
    expect(srcs.every((s) => s?.includes("stories"))).toBe(true);
    expect(srcs.some((s) => s?.includes("mascot"))).toBe(false);
  });
});
