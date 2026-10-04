import { fireEvent, render, screen } from "@testing-library/react";
import { Tabs } from "./Tabs";

const ITEMS = [
  { label: "Age 3", panel: <p>Asking why.</p> },
  { label: "Age 4", panel: <p>Playing with ideas.</p> },
  { label: "Age 5", panel: <p>Words and numbers.</p> },
];

describe("Tabs", () => {
  it("names the tablist and starts on the first tab", () => {
    render(<Tabs items={ITEMS} label="Ages" />);
    expect(screen.getByRole("tablist", { name: "Ages" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Age 3" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Asking why.");
  });

  it("keeps every panel in the DOM, so crawlers read all of them", () => {
    const { container } = render(<Tabs items={ITEMS} label="Ages" />);
    expect(container.textContent).toContain("Playing with ideas.");
    expect(container.textContent).toContain("Words and numbers.");
  });

  it("switches panels on click", () => {
    render(<Tabs items={ITEMS} label="Ages" />);
    fireEvent.click(screen.getByRole("tab", { name: "Age 4" }));
    expect(screen.getByRole("tab", { name: "Age 4" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Playing with ideas.");
  });

  it("moves with the arrow keys and Home/End, with one tab in the tab order", () => {
    render(<Tabs items={ITEMS} label="Ages" />);
    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Age 4" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Age 3" })).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(list, { key: "End" });
    expect(screen.getByRole("tab", { name: "Age 5" })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Age 3" })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(list, { key: "Home" });
    expect(screen.getByRole("tab", { name: "Age 3" })).toHaveAttribute("aria-selected", "true");
  });

  it("labels each panel by its tab", () => {
    render(<Tabs items={ITEMS} label="Ages" />);
    const tab = screen.getByRole("tab", { name: "Age 3" });
    expect(screen.getByRole("tabpanel", { name: "Age 3" })).toHaveAttribute(
      "aria-labelledby",
      tab.id,
    );
  });

  it("answers touch through the shared interaction contract", () => {
    render(<Tabs items={ITEMS} label="Ages" />);
    expect(screen.getByRole("tab", { name: "Age 3" }).className).toMatch(/active:scale/);
  });
});
