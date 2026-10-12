import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Chip, ChipList } from "./Chip";

describe("Chip", () => {
  it("renders a film chip as home.html fold 2 does", () => {
    expect(renderToStaticMarkup(<Chip label="Learning by asking" />)).toBe('<span class="kh-chip">Learning by asking</span>');
  });

  it("switches to the page cream on a band section (DS gap G-19) when asked", () => {
    expect(renderToStaticMarkup(<Chip label="Real families" onBand />)).toBe(
      '<span class="kh-chip ks-chip--on-band">Real families</span>',
    );
  });

  it("takes a tone", () => {
    render(<Chip label="Words" tone="sun" />);
    expect(screen.getByText("Words").className).toBe("kh-chip kh-tone-sun");
  });
});

describe("ChipList", () => {
  it("renders the product page's skills list as meet-kheelu.html does", () => {
    expect(
      renderToStaticMarkup(
        <ChipList label="The four thinking skills" tone="sun" items={["Words", "Reasons", "Stories", "Questions"]} className="ks-skills" />,
      ),
    ).toBe(
      '<ul class="kh-chips kh-tone-sun ks-list-reset ks-skills" aria-label="The four thinking skills">' +
        '<li class="kh-chip">Words</li><li class="kh-chip">Reasons</li><li class="kh-chip">Stories</li><li class="kh-chip">Questions</li></ul>',
    );
  });

  it("is a named list of its items", () => {
    render(<ChipList label="Languages" items={["English", "Hindi"]} />);
    const list = screen.getByRole("list", { name: "Languages" });
    expect(list.className).toBe("kh-chips ks-list-reset");
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["English", "Hindi"]);
  });
});
