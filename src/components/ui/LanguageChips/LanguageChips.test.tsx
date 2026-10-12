import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LanguageChips } from "./LanguageChips";

const LANGUAGES = [
  { native: "English" },
  { native: "हिन्दी", english: "Hindi", lang: "hi" },
  { native: "தமிழ்", english: "Tamil", lang: "ta" },
];

describe("LanguageChips", () => {
  it("renders the chips as home.html fold 4 does: ul.kh-langs.ks-list-reset > li.kh-lang > native, English name", () => {
    const { container } = render(<LanguageChips languages={LANGUAGES} />);
    const ul = container.firstElementChild as HTMLElement;
    expect(ul.tagName).toBe("UL");
    expect(ul.className).toBe("kh-langs ks-list-reset");
    expect(ul.innerHTML).toBe(
      '<li class="kh-lang"><span class="kh-lang__native">English</span></li>' +
        '<li class="kh-lang"><span class="kh-lang__native" lang="hi">हिन्दी</span><span class="kh-lang__en">Hindi</span></li>' +
        '<li class="kh-lang"><span class="kh-lang__native" lang="ta">தமிழ்</span><span class="kh-lang__en">Tamil</span></li>',
    );
  });

  it("sets lang on each native name so screen readers pronounce it (DS LanguageChips rule; G-13)", () => {
    const { container } = render(<LanguageChips languages={LANGUAGES} />);
    expect([...container.querySelectorAll(".kh-lang__native")].map((s) => s.getAttribute("lang"))).toEqual([null, "hi", "ta"]);
  });

  it("marks an announced-later language as a dashed chip", () => {
    const { container } = render(<LanguageChips languages={[{ native: "മലയാളം", english: "Malayalam", lang: "ml", soon: true }]} />);
    expect(container.querySelector("li")?.className).toBe("kh-lang kh-lang--soon");
  });

  it("prints the note under the chips when given (home.html and meet-kheelu.html)", () => {
    const { container } = render(<LanguageChips languages={LANGUAGES} note="It can switch between them mid-sentence." />);
    const note = container.querySelector("ul + p") as HTMLElement;
    expect(note.className).toBe("kh-body-s");
    expect(note.textContent).toBe("It can switch between them mid-sentence.");
  });

  it("prints no note when none is given", () => {
    const { container } = render(<LanguageChips languages={LANGUAGES} />);
    expect(container.querySelector("p")).toBeNull();
  });
});
