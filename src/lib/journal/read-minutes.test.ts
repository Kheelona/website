import { describe, expect, it } from "vitest";
import type { PostBlock, PostParagraph } from "./post";
import { postWords, readMinutes } from "./read-minutes";

/* Read time, derived and never stored (journal-pipeline §4 `head.readMinutes`; main:src/lib/stories.ts:108-120): the
 * words a reader reads, the answer's and the body's, at 200 a minute, rounded, at least 1. */

const words = (n: number, word = "word") => Array.from({ length: n }, () => word).join(" ");
const para = (text: string): PostParagraph => ({ type: "paragraph", content: [{ type: "text", text }] });
const post = (content: PostBlock[], answer: { question: string; text: string } | null = null) => ({ body: { type: "doc" as const, content }, answer });

describe("postWords", () => {
  it("counts paragraphs and headings, with every text run of a block joined", () => {
    const body: PostBlock[] = [
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Two words" }] },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Read ", marks: [{ type: "bold" }] },
          { type: "text", text: "the guide", marks: [{ type: "link", attrs: { href: "/stories" } }] },
          { type: "hardBreak" },
          { type: "text", text: "today" },
        ],
      },
    ];
    expect(postWords(post(body))).toBe(6);
  });

  it("counts list items and what a blockquote holds (callouts, question groups)", () => {
    const body: PostBlock[] = [
      { type: "bulletList", attrs: { style: "tips" }, content: [{ type: "listItem", attrs: { icon: "check" }, content: [para("one two")] }] },
      { type: "orderedList", content: [{ type: "listItem", content: [para("three")] }] },
      {
        type: "blockquote",
        attrs: { style: "questions" },
        content: [{ type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "four five?" }] }, para("six")],
      },
    ];
    expect(postWords(post(body))).toBe(6);
  });

  it("counts the answer card's question and answer", () => {
    expect(postWords(post([para("one")], { question: "Two three?", text: "Four five six." }))).toBe(6);
  });

  it("never counts a source marker, an image's words or a video's", () => {
    const body: PostBlock[] = [
      para("A sentence.[^1] And [^2] more."),
      { type: "image", attrs: { src: "", alt: "alt words here", caption: "caption words", width: null, height: null, photo: "kheelu-belly-module" } },
      { type: "videoEmbed", attrs: { provider: "youtube", videoId: "dQw4w9WgXcQ", title: "A title", caption: "A caption" } },
      { type: "horizontalRule" },
    ];
    expect(postWords(post(body))).toBe(4);
  });

  it("counts an amount or the delivery line as one word", () => {
    expect(postWords(post([para("Costs {price:headline}, ships {delivery}")]))).toBe(4);
  });
});

describe("readMinutes", () => {
  it("is the words at 200 a minute, rounded", () => {
    expect(readMinutes(post([para(words(200))]))).toBe(1);
    expect(readMinutes(post([para(words(299))]))).toBe(1);
    expect(readMinutes(post([para(words(300))]))).toBe(2);
    expect(readMinutes(post([para(words(1000))]))).toBe(5);
  });

  it("is at least one minute", () => {
    expect(readMinutes(post([]))).toBe(1);
    expect(readMinutes(post([para("Short.")]))).toBe(1);
  });
});
