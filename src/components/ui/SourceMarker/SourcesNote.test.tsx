import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SourcesNote } from "./SourcesNote";

const SERVE_AND_RETURN = {
  citation: "Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts).",
  href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
} as const;

describe("SourcesNote", () => {
  it("renders one source as home.html fold 3 does, linked by the site's name", () => {
    expect(renderToStaticMarkup(<SourcesNote label="Sources" sources={[SERVE_AND_RETURN]} />)).toBe(
      '<p class="kh-caption" id="src-1"><strong>Sources</strong> [1] Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts). ' +
        '<a href="https://developingchild.harvard.edu/key-concept/serve-and-return/">developingchild.harvard.edu</a></p>',
    );
  });

  it("numbers each further source in its own caption, with the label on the first only (the guide's FAQ)", () => {
    const html = renderToStaticMarkup(
      <SourcesNote
        label="Sources"
        sources={[
          {
            citation:
              "World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8.",
            href: "https://iris.who.int/handle/10665/311664",
          },
          {
            citation:
              "American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families.",
            href: "https://doi.org/10.1542/peds.2016-2591",
          },
        ]}
      />,
    );
    expect(html).toBe(
      '<p class="kh-caption" id="src-1"><strong>Sources</strong> [1] World Health Organization, “Guidelines on physical activity, sedentary behaviour and sleep for children under 5 years of age”, 2019, Recommendations: sedentary time, p. 8. <a href="https://iris.who.int/handle/10665/311664">iris.who.int</a></p>' +
        '<p class="kh-caption" id="src-2">[2] American Academy of Pediatrics, Council on Communications and Media, “Media and Young Minds”, Pediatrics, 2016, Recommendations: Families. <a href="https://doi.org/10.1542/peds.2016-2591">doi.org</a></p>',
    );
  });

  it("takes a longer link label and a composition class (meet-kheelu.html, the FAQ's sources)", () => {
    render(
      <SourcesNote
        label="Sources"
        className="ks-faq-sources"
        sources={[{ ...SERVE_AND_RETURN, label: "developingchild.harvard.edu/key-concept/serve-and-return" }]}
      />,
    );
    const link = screen.getByRole("link", { name: "developingchild.harvard.edu/key-concept/serve-and-return" });
    expect(link.closest("p")!.className).toBe("kh-caption ks-faq-sources");
  });

  it("is the target of the markers: each caption carries the id a marker links to", () => {
    const { container } = render(<SourcesNote label="Sources" sources={[SERVE_AND_RETURN, SERVE_AND_RETURN, SERVE_AND_RETURN]} />);
    expect([...container.querySelectorAll("p")].map((p) => p.id)).toEqual(["src-1", "src-2", "src-3"]);
  });
});
