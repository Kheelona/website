import { render, screen } from "@testing-library/react";
import { Faq } from "./Faq";
import { LUMI_AGES } from "@/config/site";

const items = [
  { q: "Is Lumi screen-free?", a: "Yes. Lumi never shows a screen." },
  { q: "What ages is Lumi for?", a: `Lumi is built for children ages ${LUMI_AGES}.` },
  { q: "Can I read the conversations?", a: "Yes, every one of them." },
];

describe("Faq", () => {
  /* THE REGRESSION THIS COMPONENT EXISTS TO PREVENT (V6 handoff): the Radix
     accordion rendered only the open answer, so Home shipped eight questions
     and ONE answer to anyone without JavaScript — including AI crawlers that
     do not run it. Every answer must be in the markup, open or closed. */
  it("puts EVERY answer in the DOM, not just the open one", () => {
    render(<Faq items={items} />);
    for (const item of items) {
      expect(screen.getByText(item.a)).toBeInTheDocument();
    }
  });

  it("opens the first row and leaves the rest closed", () => {
    const { container } = render(<Faq items={items} />);
    const rows = container.querySelectorAll("details");
    expect(rows).toHaveLength(items.length);
    expect(rows[0]).toHaveAttribute("open");
    expect(rows[1]).not.toHaveAttribute("open");
    expect(rows[2]).not.toHaveAttribute("open");
  });

  it("stays exclusive natively: one shared name across the list", () => {
    const { container } = render(<Faq items={items} name="home-faq" />);
    const names = [...container.querySelectorAll("details")].map((d) =>
      d.getAttribute("name"),
    );
    expect(new Set(names)).toEqual(new Set(["home-faq"]));
  });

  it("keeps the question an h3 inside the summary (the AEO heading outline)", () => {
    const { container } = render(<Faq items={items} />);
    for (const item of items) {
      const heading = screen.getByRole("heading", { level: 3, name: item.q });
      expect(heading.closest("summary")).not.toBeNull();
    }
    expect(container.querySelectorAll("summary")).toHaveLength(items.length);
  });

  it("needs no client JavaScript: native disclosure, no buttons", () => {
    render(<Faq items={items} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});
