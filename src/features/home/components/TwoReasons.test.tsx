import { render, screen } from "@testing-library/react";
import { TwoReasons } from "./TwoReasons";
import { KHEELU_LANGUAGES } from "@/config/site";

describe("TwoReasons", () => {
  it("renders both cards, always (no hidden card behind a toggle)", () => {
    render(<TwoReasons />);
    expect(
      screen.getByRole("heading", { level: 3, name: "It talks in your family's languages" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "You see what your child talked about" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("names every configured language in its own script, tagged for screen readers", () => {
    render(<TwoReasons />);
    const list = screen.getByRole("list", { name: "Languages" });
    expect(list.querySelectorAll("li")).toHaveLength(KHEELU_LANGUAGES.length);
    expect(screen.getByText("हिन्दी")).toHaveAttribute("lang", "hi");
    expect(screen.getByText("ಕನ್ನಡ")).toHaveAttribute("lang", "kn");
  });

  /* Two jobs inherited from the old learning room, both load-bearing. */
  it("carries Home's footnote-1 marker and its link to the bilingual article", () => {
    const { container } = render(<TwoReasons />);
    expect(container.querySelector('a[href="#fn-languages"]')).not.toBeNull();
    expect(screen.getByRole("link", { name: "Raising a bilingual child in India" })).toHaveAttribute(
      "href",
      "/stories/raising-a-bilingual-child-in-india",
    );
  });

  it("shows the REAL parent-app screenshot, not sample screens with unconfirmed controls", () => {
    const { container } = render(<TwoReasons />);
    expect(screen.getByAltText(/parent app dashboard/)).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Sample screens|after 7 pm/);
  });

  it("points at the parent-app room on the Kheelu page", () => {
    render(<TwoReasons />);
    expect(screen.getByRole("link", { name: /See what the app shows you/ })).toHaveAttribute(
      "href",
      "/products/kheelu#parent-app",
    );
  });
});
