import { render, screen, fireEvent } from "@testing-library/react";
import { FeelingsGallery } from "./FeelingsGallery";

describe("FeelingsGallery", () => {
  it("renders five feeling character cards as buttons", () => {
    render(<FeelingsGallery />);
    for (const name of ["Curious", "Grumpy", "Sad", "Silly", "Joy"]) {
      expect(screen.getByRole("button", { name: new RegExp(name) })).toBeInTheDocument();
    }
  });

  it("names Kheelu in every card image alt (mascot is never the product)", () => {
    render(<FeelingsGallery />);
    const images = screen.getAllByRole("img");
    images.forEach((img) => expect(img.getAttribute("alt")).toMatch(/Kheelu/));
  });

  it("opens an accessible detail dialog on click, with title and close", () => {
    render(<FeelingsGallery />);
    fireEvent.click(screen.getByRole("button", { name: /Curious/ }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/One why becomes three/i)).toBeInTheDocument();
    const close = screen.getByRole("button", { name: "Close Curious" });
    fireEvent.click(close);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape and restores focus to the card", () => {
    render(<FeelingsGallery />);
    const card = screen.getByRole("button", { name: /Joy/ });
    fireEvent.click(card);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
