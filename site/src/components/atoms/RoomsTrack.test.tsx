import { render, screen } from "@testing-library/react";
import { RoomsTrack } from "./RoomsTrack";

describe("RoomsTrack", () => {
  it("stacks children in the kit column", () => {
    render(
      <RoomsTrack>
        <section>one</section>
        <section>two</section>
      </RoomsTrack>,
    );
    const track = screen.getByText("one").parentElement!;
    expect(track.className).toContain("max-w-[1180px]");
    expect(track.className).toContain("flex-col");
    expect(track.className).toContain("gap-[34px]");
    expect(screen.getByText("two")).toBeInTheDocument();
  });
});
