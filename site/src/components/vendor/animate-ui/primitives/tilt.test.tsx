import { render, screen, fireEvent } from "@testing-library/react";
import { Tilt, TiltContent } from "./tilt";

describe("Tilt", () => {
  it("renders its tilt content children", () => {
    render(
      <Tilt>
        <TiltContent>Tilt surface</TiltContent>
      </Tilt>,
    );
    expect(screen.getByText("Tilt surface")).toBeInTheDocument();
  });

  it("runs its own tilt tracking and still calls a caller-supplied onMouseMove", () => {
    const onMouseMove = vi.fn();
    render(
      <Tilt onMouseMove={onMouseMove} data-testid="tilt">
        <TiltContent>Surface</TiltContent>
      </Tilt>,
    );
    const surface = screen.getByTestId("tilt");
    fireEvent.mouseMove(surface, { clientX: 20, clientY: 12 });
    fireEvent.mouseLeave(surface);
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    // pointer math runs against a zero-size jsdom rect without throwing
    expect(screen.getByText("Surface")).toBeInTheDocument();
  });
});
