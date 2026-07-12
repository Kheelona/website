import { render, screen } from "@testing-library/react";
import { HeroConversation } from "./HeroConversation";

describe("HeroConversation", () => {
  it("renders the child's opening question in a log landmark", () => {
    render(<HeroConversation />);
    const log = screen.getByRole("log", {
      name: /A sample conversation between a child and Lumi/i,
    });
    expect(log).toBeInTheDocument();
    expect(
      screen.getByText(/Lumi, why is the moon following us\?/i),
    ).toBeInTheDocument();
  });

  it("renders Lumi's reply", () => {
    render(<HeroConversation />);
    expect(
      screen.getByText(/The moon is very far away\./i),
    ).toBeInTheDocument();
  });

  it("forwards a className onto the log element", () => {
    render(<HeroConversation className="max-w-[420px]" />);
    expect(screen.getByRole("log").className).toContain("max-w-[420px]");
  });
});
