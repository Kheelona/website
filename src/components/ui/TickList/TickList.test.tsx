import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TickList } from "./TickList";

const icon = (name: string) => <svg className="kh-icon" data-icon={name} aria-hidden="true" />;

describe("TickList", () => {
  it("renders the icon-per-line list as meet-kheelu.html's box panel does: ul.ks-ticks > li > icon + span", () => {
    const { container } = render(
      <TickList
        items={[
          { icon: icon("package"), text: "Kheelu plush toy" },
          { icon: icon("battery-charging"), text: "Charger" },
          { icon: icon("book-open"), text: "Quick-start card" },
        ]}
      />,
    );
    const list = container.firstElementChild as HTMLElement;
    expect(list.tagName).toBe("UL");
    expect(list.className).toBe("ks-ticks");
    const rows = [...list.querySelectorAll(":scope > li")];
    expect(rows.map((li) => li.textContent)).toEqual(["Kheelu plush toy", "Charger", "Quick-start card"]);
    // the icon is the row's first child, as .ks-ticks > li > .kh-icon expects, and the words sit in a span
    expect(rows.map((li) => li.firstElementChild?.getAttribute("data-icon"))).toEqual(["package", "battery-charging", "book-open"]);
    expect(rows.every((li) => li.lastElementChild?.tagName === "SPAN")).toBe(true);
  });

  it("takes the parent's composition class", () => {
    const { container } = render(<TickList className="ks-know__ticks" items={[{ icon: icon("info"), text: "x" }]} />);
    expect(container.firstElementChild?.className).toBe("ks-ticks ks-know__ticks");
  });
});
