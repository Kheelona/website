import { render } from "@testing-library/react";
import { StageGate } from "./StageGate";

// StageGate IS a normal client gate (not a Canvas child). Server + first client
// render return null (no hydration mismatch), and in jsdom the WebGL2 probe
// fails so detectTier() is "static" — the stage never arms. It must stay empty.
describe("StageGate", () => {
  it("renders nothing on first paint (ambient)", () => {
    const { container } = render(<StageGate stage="ambient" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing on first paint on the default journey stage", () => {
    const { container } = render(<StageGate />);
    expect(container).toBeEmptyDOMElement();
  });
});
