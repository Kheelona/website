import { render, screen } from "@testing-library/react";
import { RoomsTrack } from "./RoomsTrack";

describe("RoomsTrack", () => {
  it("stacks full-bleed rooms and hands their alternation to .kh-track", () => {
    render(
      <RoomsTrack>
        <section>one</section>
        <section>two</section>
      </RoomsTrack>,
    );
    const track = screen.getByText("one").parentElement!;
    expect(track.className).toContain("kh-track");
    // no column of its own: each Room owns its content width now
    expect(track.className).not.toContain("max-w-");
    expect(screen.getByText("two")).toBeInTheDocument();
  });
});
