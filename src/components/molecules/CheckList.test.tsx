import { render, screen } from "@testing-library/react";
import { CheckList } from "./CheckList";

const items = [
  "Screen-free by design",
  "Speaks 10 Indian languages",
  "No open internet access",
];

describe("CheckList", () => {
  it("renders every item as a list item", () => {
    render(<CheckList items={items} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(items.length);
    items.forEach((t) => expect(screen.getByText(t)).toBeInTheDocument());
  });

  it("renders a decorative check bullet per item (aria-hidden)", () => {
    const { container } = render(<CheckList items={items} />);
    expect(
      container.querySelectorAll('[aria-hidden="true"]').length,
    ).toBeGreaterThanOrEqual(items.length);
  });

  it("merges className onto the list", () => {
    render(<CheckList items={["One"]} className="mt-8" />);
    expect(screen.getByRole("list").className).toContain("mt-8");
  });
});
