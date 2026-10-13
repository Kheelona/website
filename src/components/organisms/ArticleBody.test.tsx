import { render, screen } from "@testing-library/react";
import { ArticleBody } from "./ArticleBody";
import type { StoryDoc } from "@/lib/stories";

const text = (t: string, marks?: never) => ({ type: "text" as const, text: t, ...(marks ? { marks } : {}) });
const doc = (...content: StoryDoc["content"]): StoryDoc => ({ type: "doc", content });

describe("ArticleBody", () => {
  it("renders headings as real h2/h3 under the page's single h1", () => {
    render(
      <ArticleBody
        doc={doc(
          { type: "heading", attrs: { level: 2 }, content: [text("Big idea")] },
          { type: "heading", attrs: { level: 3 }, content: [text("Small idea")] },
        )}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Big idea" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Small idea" })).toBeTruthy();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
  });

  it("links our own pages in the app and opens sources in a new tab without an opener", () => {
    render(
      <ArticleBody
        doc={doc({
          type: "paragraph",
          content: [
            { type: "text", text: "Safety", marks: [{ type: "link", attrs: { href: "/safety" } }] },
            { type: "text", text: " and " },
            { type: "text", text: "WHO", marks: [{ type: "link", attrs: { href: "https://www.who.int/x" } }] },
          ],
        })}
      />,
    );
    expect(screen.getByRole("link", { name: "Safety" })).toHaveAttribute("href", "/safety");
    const who = screen.getByRole("link", { name: "WHO" });
    expect(who).toHaveAttribute("target", "_blank");
    expect(who.getAttribute("rel")).toContain("noopener");
  });

  it("renders lists, quotes and bold as the semantic elements a crawler reads", () => {
    const { container } = render(
      <ArticleBody
        doc={doc(
          { type: "orderedList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [text("one")] }] }] },
          { type: "blockquote", content: [{ type: "paragraph", content: [text("quoted")] }] },
          { type: "paragraph", content: [{ type: "text", text: "loud", marks: [{ type: "bold" }] }] },
        )}
      />,
    );
    expect(container.querySelector("ol > li")?.textContent).toBe("one");
    expect(container.querySelector("blockquote")?.textContent).toBe("quoted");
    expect(container.querySelector("strong")?.textContent).toBe("loud");
  });

  it("gives every image its alt text and caption", () => {
    render(
      <ArticleBody
        doc={doc({
          type: "image",
          attrs: { src: "/stories/how-children-learn-by-talking.jpg", alt: "A veranda at night", caption: "Serve and return", width: 1440, height: 803 },
        })}
      />,
    );
    expect(screen.getByRole("img", { name: "A veranda at night" })).toBeTruthy();
    expect(screen.getByText("Serve and return").tagName).toBe("FIGCAPTION");
  });

  it("drops empty paragraphs and anything it does not know, instead of rendering it wrong", () => {
    const { container } = render(
      <ArticleBody doc={doc({ type: "paragraph" }, { type: "iframe" } as never, { type: "paragraph", content: [text("kept")] })} />,
    );
    expect(container.querySelectorAll("p")).toHaveLength(1);
    expect(container.querySelector("iframe")).toBeNull();
  });
});
