import { render, screen } from "@testing-library/react";
import { PhoneFrame } from "./PhoneFrame";

describe("PhoneFrame", () => {
  it("renders the screenshot with its src and alt", () => {
    render(<PhoneFrame src="/app/dashboard.png" alt="Parent dashboard" />);
    const img = screen.getByRole("img", { name: "Parent dashboard" });
    expect(img).toHaveAttribute("src", "/app/dashboard.png");
  });

  it("applies an explicit frame width to the chrome", () => {
    const { container } = render(
      <PhoneFrame src="/app/dashboard.png" alt="App" width={320} />,
    );
    expect(container.firstElementChild as HTMLElement).toHaveStyle({
      width: "320px",
    });
  });

  it("defaults to a 280px frame", () => {
    const { container } = render(<PhoneFrame src="/app/x.png" alt="App" />);
    expect(container.firstElementChild as HTMLElement).toHaveStyle({
      width: "280px",
    });
  });
});
