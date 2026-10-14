/** A journal post's read time, derived and never stored (ADR-014; journal-pipeline §4, `head.readMinutes`).
 *
 *  Main's rule, kept (main:src/lib/stories.ts:88-120): the words a reader actually reads (headings, paragraphs, list
 *  items, what a blockquote holds; never an image's alt or caption, nor a video's words) at 200 a minute, the usual
 *  adult pace for plain prose, rounded, and never under a minute. The rebuild adds the answer card (its question and
 *  answer are read first) and drops source markers, which are numbers, not words. */

import type { Post, PostBlock, PostInline, PostListItem } from "./post";

const WORDS_PER_MINUTE = 200;
const MARKER = /\[\^\d+\]/g;

type Readable = Pick<Post, "body"> & { readonly answer?: Post["answer"] };

function inlineText(content: readonly PostInline[] | undefined): string {
  return (content ?? []).map((node) => (node.type === "text" ? node.text : " ")).join("");
}

function blockTexts(block: PostBlock | PostListItem): string[] {
  switch (block.type) {
    case "paragraph":
    case "heading":
      return [inlineText(block.content)];
    case "bulletList":
    case "orderedList":
    case "blockquote":
    case "listItem":
      return block.content.flatMap(blockTexts);
    default:
      return [];
  }
}

const count = (text: string): number => text.replace(MARKER, " ").split(/\s+/).filter(Boolean).length;

/** The words of the answer card and the body a reader reads. */
export function postWords(post: Readable): number {
  const answer = post.answer ? [post.answer.question, post.answer.text] : [];
  return [...answer, ...post.body.content.flatMap(blockTexts)].reduce((n, text) => n + count(text), 0);
}

/** The read time in whole minutes: the words at 200 a minute, rounded, at least 1. */
export function readMinutes(post: Readable): number {
  return Math.max(1, Math.round(postWords(post) / WORDS_PER_MINUTE));
}
