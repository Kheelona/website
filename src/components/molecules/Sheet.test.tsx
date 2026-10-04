import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sheet } from "./Sheet";

/** Sheet is a controlled Radix Dialog, so drive it through a stateful harness
 *  that mirrors how the navbar uses it. */
function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      title="Main menu"
      trigger={
        <button type="button" aria-label="Open menu">
          Menu
        </button>
      }
    >
      <a href="/safety">Safety</a>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("renders the trigger and keeps the drawer closed initially", () => {
    render(<Harness />);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens the accessible dialog and reveals its contents on trigger click", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    // sr-only title names the dialog for a11y
    expect(dialog).toHaveAccessibleName("Main menu");
    expect(screen.getByRole("link", { name: "Safety" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close menu" })).toBeInTheDocument();
  });

  it("closes when the close button is pressed", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
