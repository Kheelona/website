import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockupFold, skeleton } from "../ArticleBody/__fixtures__/approved-fold";
import { RecognitionStrip } from "./RecognitionStrip";
import { RECOGNITION_GATED, RECOGNITION_ONE_FILED } from "./RecognitionStrip.stories";

/* RecognitionStrip (task 3.4): team.html fold 5. Proof-gated (D038, F11): the whole fold renders nothing until at
   least one programme's proof is filed, and a gated name never renders, on any environment. Names are text only (no
   logos, B25). */

describe("RecognitionStrip", () => {
  it("renders nothing while every proof is outstanding", () => {
    const { container } = render(<RecognitionStrip {...RECOGNITION_GATED} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<RecognitionStrip {...RECOGNITION_GATED} items={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("once a proof is filed: the fold's markup as approved, the filed name as text and no gated one", () => {
    const { container } = render(<RecognitionStrip {...RECOGNITION_ONE_FILED} />);
    const mockup = mockupFold("team", "section[aria-labelledby='recognised-title']");
    /* The mockup holds the placeholder for the names inside the line. */
    expect(skeleton(container.firstElementChild!)).toBe(skeleton(mockup, { skip: ".mk-placeholder" }));
    const section = screen.getByRole("region", { name: "Recognised by." });
    expect(section.className).toBe("kh-section kh-section--tight");
    expect(section.querySelector("p.kh-body")!.textContent).toBe("Programme one");
    expect(section.textContent).not.toContain("Programme two");
    expect(section.querySelector("img, a")).toBeNull();
  });

  it("joins several filed names into one quiet line", () => {
    render(<RecognitionStrip title="Recognised by." items={[{ name: "Programme one" }, { name: "Programme two" }]} />);
    expect(screen.getByText("Programme one · Programme two").className).toBe("kh-body");
  });
});
