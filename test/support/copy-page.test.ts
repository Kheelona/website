import { describe, expect, it } from "vitest";
import { copyFold, copyLines, copyPagePath, copyParagraphs, glanceRow, parseCopyPage, readCopyPage } from "./copy-page";

/* The one copy-page reader (task 6.3, from the 5.19 review). The article tests without a mockup (screen-time-articles,
 * talking-articles, ai-safety-and-learning) hold each module to its copy page's Copy blocks word for word; if this
 * reader dropped a line, took a note for copy or missed a fold, those tests would compare against the wrong words. So
 * this proves what it reads, and what it refuses to read, on a page written to exercise every shape the copy pages use. */

const PAGE = [
  "---",
  "title: A copy page",
  "---",
  "",
  "# Story: A guide",
  "",
  "> **INTERNAL page.** Only the text inside the **Copy** blocks is meant for the site.",
  "",
  "## At a glance",
  "",
  "| Field | Value |",
  "|---|---|",
  "| Title (21 characters) | A guide for a parent. |",
  "| Meta description (9 characters) | Some help |",
  "",
  "## Fold 1 · Article head",
  "",
  "**Copy**",
  "",
  "> **Breadcrumb:** Home › Stories",
  "> **H1:** A guide",
  "",
  "- **Image:** a photo (notes, not copy).",
  "",
  "## Fold 2 · The answer first",
  "",
  "**Copy:**",
  "> **H2:** What helps?",
  ">",
  "> Talk with them.¹",
  "> Every day.",
  ">",
  ">",
  "> - First item",
  "> - Second item",
  "",
  "> A quoted note after the Copy block, which is not copy.",
  "",
  "**Copy** again in a note is not a second block.",
  "",
  "## Fold 3 · Close (journal close block)",
  "",
  "**Copy (from the article template's",
  "`articlePageCopy.close`, never retyped):**",
  "",
  "> Keep reading.",
  "",
  "## Fold 4 · Sources (article foot)",
  "",
  "No Copy block here.",
  "",
  "## Changes after approval",
  "",
  "**Copy**",
  "",
  "> Not a fold, so never read.",
  "",
  "| Title (card title, from each module) | Real URL |",
  "",
].join("\n");

const page = parseCopyPage(PAGE, "story-a-guide.md");

describe("parseCopyPage", () => {
  it("reads the folds in order, each title without its number, and nothing that is not a fold", () => {
    expect(page.folds.map((f) => f.title)).toEqual(["Article head", "The answer first", "Close (journal close block)", "Sources (article foot)"]);
    expect(page.path).toBe("story-a-guide.md");
    expect(page.markdown).toBe(PAGE);
  });

  it("takes a fold's Copy block as the run of quoted lines after its Copy line, quote marks off, blank lines kept", () => {
    expect(page.folds[0].copy).toEqual(["**Breadcrumb:** Home › Stories", "**H1:** A guide"]);
    expect(page.folds[1].copy).toEqual(["**H2:** What helps?", "", "Talk with them.¹", "Every day.", "", "", "- First item", "- Second item"]);
  });

  it("skips the words of a Copy line that runs over two lines, and reads the quoted run after it", () => {
    expect(page.folds[2].copy).toEqual(["Keep reading."]);
  });

  it("never takes a quoted note after the run, a second Copy line or a section that is not a fold for copy", () => {
    const everything = page.folds.flatMap((f) => f.copy).join("\n");
    expect(everything).not.toMatch(/quoted note|not a second block|never read|INTERNAL/);
  });

  it("gives a fold without a Copy block no copy, and keeps its notes as written", () => {
    expect(page.folds[3].copy).toEqual([]);
    expect(page.folds[3].text).toBe("\nNo Copy block here.\n\n");
    expect(page.folds[0].text).toContain("- **Image:** a photo (notes, not copy).");
  });
});

describe("the readers of a fold", () => {
  it("copyLines drops the blank lines: each line left is one paragraph, item or heading", () => {
    expect(copyLines(page.folds[1])).toEqual(["**H2:** What helps?", "Talk with them.¹", "Every day.", "- First item", "- Second item"]);
  });

  it("copyParagraphs groups the lines by the blank lines between them", () => {
    expect(copyParagraphs(page.folds[1])).toEqual([["**H2:** What helps?"], ["Talk with them.¹", "Every day."], ["- First item", "- Second item"]]);
    expect(copyParagraphs(page.folds[3])).toEqual([]);
  });

  it("copyFold finds a fold by the start of its title or by a pattern, and names the page when there is none", () => {
    expect(copyFold(page, "Sources").title).toBe("Sources (article foot)");
    expect(copyFold(page, /^Close/).title).toBe("Close (journal close block)");
    expect(() => copyFold(page, "Related guides")).toThrow(/story-a-guide\.md has no fold "Related guides…"/);
    expect(() => copyFold(page, /^Related/)).toThrow(/story-a-guide\.md has no fold \/\^Related\//);
  });
});

describe("glanceRow", () => {
  it("reads a row of At a glance, the first whose label states a length, never a later table's", () => {
    expect(glanceRow(page, "Title")).toBe("A guide for a parent.");
    expect(glanceRow(page, "Meta description")).toBe("Some help");
  });

  it("refuses a row whose stated length is not the value's", () => {
    const wrong = parseCopyPage(PAGE.replace("Title (21 characters)", "Title (20 characters)"), "story-wrong.md");
    expect(() => glanceRow(wrong, "Title")).toThrow(/story-wrong\.md: the Title row says 20 characters; its value has 21/);
  });

  it("refuses a page with no such row", () => {
    const none = parseCopyPage(PAGE.replace(/^\| Meta description.*$/m, ""), "story-none.md");
    expect(() => glanceRow(none, "Meta description")).toThrow(/story-none\.md has no "Meta description \(n characters\)" row/);
  });
});

describe("readCopyPage", () => {
  it("reads an article's copy page from wiki/site/pages, once", () => {
    expect(copyPagePath("learning-toys-for-a-three-year-old")).toBe("wiki/site/pages/story-learning-toys-for-a-three-year-old.md");
    const real = readCopyPage("learning-toys-for-a-three-year-old");
    expect(real.path).toBe("wiki/site/pages/story-learning-toys-for-a-three-year-old.md");
    expect(real.folds.length).toBeGreaterThan(3);
    expect(copyFold(real, "Article head").copy.length).toBeGreaterThan(0);
    expect(glanceRow(real, "Title")).toMatch(/· Kheelona$/);
    expect(readCopyPage("learning-toys-for-a-three-year-old")).toBe(real);
  });
});
