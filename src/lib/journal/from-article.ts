/** The export: a guide module as a dashboard post (ADR-014; journal-pipeline §9.3), the inverse of ./to-article.ts.
 *
 *  Task 8b.2e writes the 20 rewritten guides into the snapshot with it, and the backend imports that file after Gate B;
 *  then the modules and this file are deleted. It writes only what a post stores: the derivations the adapter makes at
 *  every build (the <title> when it is the h1 and the site's name, the card title when it is the h1, the summary when
 *  it is the lead, no-wrap spans, the read time, the close and the D025 line) are left out, so the round trip
 *  `postToArticle(articleToPost(m))` gives the module back (from-article.test.ts). What a post cannot say is refused,
 *  never dropped: `guide "<slug>": <where>: <what>`.
 *
 *  `src/lib` never imports content (structure §6): the guide's topic, the live post's pose and tint and the site's
 *  vocabulary come in as an `ExportContext`. */

import { JOURNAL_IMAGES } from "@/config/journal";
import type { Article, ArticlePart, FigureBlock, ImageRef, LeadText, ListBlock, ProseBlock, RichTextString } from "@/content/types";
import { parseRichText, type RichNode } from "@/lib/content/rich-text";
import type { Post, PostBlock, PostBlockquote, PostImage, PostInline, PostListItem, PostMark, PostParagraph, PostText } from "./post";
import { derivedMetaTitle, isWide, type JournalVocabulary } from "./to-article";

export interface ExportContext {
  /** The title of the topic the hub lists the guide under (topics.ts): the post's `theme`. */
  readonly theme: string;
  /** Copied from the live post of the same slug (main:src/lib/stories.data.json), so the post still passes main's
   *  validator (main:tools/blog/validate.mjs:48-51); the new design shows neither. */
  readonly pose: string;
  readonly tint: string;
  readonly vocabulary: JournalVocabulary;
}

/** A guide the export cannot write without losing something. */
export class JournalExportError extends Error {
  override name = "JournalExportError";
}

interface Walk {
  readonly slug: string;
  readonly vocabulary: JournalVocabulary;
}

const refuse = (walk: Walk, where: string, what: string): never => {
  throw new JournalExportError(`guide "${walk.slug}": ${where ? `${where}: ` : ""}${what}`);
};

/* ── Inline ───────────────────────────────────────────────────────────────────────────────────────── */

const BOLD: PostMark = { type: "bold" };

/** Rich text as post text nodes: a link a link mark, the tokens a post holds as text, a no-wrap span unwrapped (the
 *  adapter puts it back). An accent, a marked word or a placeholder has no post form. */
function inline(walk: Walk, text: RichTextString, where: string, bold = false): PostText[] {
  const out: PostText[] = [];
  const push = (value: string, href?: string) => {
    const marks: PostMark[] = [...(bold ? [BOLD] : []), ...(href === undefined ? [] : [{ type: "link" as const, attrs: { href } }])];
    const last = out[out.length - 1];
    const sameMarks = last !== undefined && JSON.stringify(last.marks ?? []) === JSON.stringify(marks);
    if (sameMarks) out[out.length - 1] = { ...last, text: last.text + value };
    else out.push(marks.length ? { type: "text", text: value, marks } : { type: "text", text: value });
  };
  const walkNodes = (nodes: readonly RichNode[], href?: string) => {
    for (const node of nodes) {
      switch (node.kind) {
        case "text":
          push(node.text, href);
          break;
        case "nowrap":
          walkNodes(node.children, href);
          break;
        case "link":
          walkNodes(node.children, node.href);
          break;
        case "source":
          push(`[^${node.n}]`, href);
          break;
        case "price":
          push(`{price:${node.key}}`, href);
          break;
        case "delivery":
          push("{delivery}", href);
          break;
        default:
          refuse(walk, where, `"{${node.kind}:…}" has no post form`);
      }
    }
  };
  walkNodes(parseRichText(text));
  return out.filter((node) => node.text !== "");
}

/** Plain text: the words of rich text with no-wrap spans unwrapped; anything else is refused. */
function plain(walk: Walk, text: RichTextString, where: string): string {
  const nodes = inline(walk, text, where);
  if (nodes.some((node) => node.marks !== undefined) || /\[\^\d+\]|\{price:|\{delivery\}/.test(nodes.map((n) => n.text).join(""))) {
    refuse(walk, where, "only plain words go here (no link, marker or amount)");
  }
  return nodes.map((node) => node.text).join("");
}

/** The answer's text: its tokens kept, no-wrap spans unwrapped; a post's answer is text, so a link cannot go in it. */
function answerText(walk: Walk, text: RichTextString, where: string): string {
  const nodes = inline(walk, text, where);
  if (nodes.some((node) => node.marks !== undefined)) refuse(walk, where, "a link has no post form in the answer");
  return nodes.map((node) => node.text).join("");
}

/** A line with an optional lead-in: the lead in bold, a space, the words. */
function leadLine(walk: Walk, line: LeadText, where: string): PostInline[] {
  const lead = line.lead === undefined ? [] : inline(walk, line.lead, where, true);
  const text = line.text === undefined ? [] : inline(walk, line.lead === undefined ? line.text : ` ${line.text}`, where);
  return [...lead, ...text];
}

const paragraph = (content: readonly PostInline[]): PostParagraph => (content.length ? { type: "paragraph", content } : { type: "paragraph" });

/* ── Blocks ───────────────────────────────────────────────────────────────────────────────────────── */

/** An image by its key in the photo table, or an upload at its own size. */
function image(walk: Walk, ref: ImageRef, caption: RichTextString | undefined, where: string): PostImage {
  const words = caption === undefined ? "" : plain(walk, caption, where);
  if (typeof ref.src === "string" && ref.src.startsWith(JOURNAL_IMAGES) && "width" in ref) {
    return { type: "image", attrs: { src: ref.src, alt: ref.alt, caption: words, width: ref.width, height: ref.height } };
  }
  const key = Object.keys(walk.vocabulary.photos).find((k) => walk.vocabulary.photos[k].image.src === ref.src);
  if (key === undefined) refuse(walk, where, "the photo is not in the photo table (src/content/en-IN/stories/photos.ts)");
  const entry = walk.vocabulary.photos[key!];
  if (entry.image.alt !== ref.alt) refuse(walk, where, `the photo "${key}" is worded otherwise than the photo table words it`);
  return { type: "image", attrs: { src: "", alt: entry.image.alt, caption: words, width: null, height: null, photo: key } };
}

function figure(walk: Walk, block: FigureBlock, where: string): PostImage {
  const node = image(walk, block.image, block.caption, where);
  const wide = node.attrs.photo ? walk.vocabulary.photos[node.attrs.photo].wide === true : isWide(node.attrs.width!, node.attrs.height!);
  if ((block.variant === "wide") !== wide || block.variant === "square") {
    refuse(walk, where, `the frame "${block.variant ?? "portrait"}" is not the photo's own shape, which the adapter derives`);
  }
  return node;
}

function listItem(walk: Walk, item: ListBlock["items"][number] | { icon: string; title?: string; body: string }, where: string): PostListItem {
  const line: LeadText & { icon?: string } =
    typeof item === "string" ? { text: item } : "body" in item ? { ...(item.title !== undefined && { lead: item.title }), text: item.body, icon: item.icon } : item;
  return { type: "listItem", ...(line.icon !== undefined && { attrs: { icon: line.icon } }), content: [paragraph(leadLine(walk, line, where))] };
}

function block(walk: Walk, b: ProseBlock, where: string): PostBlock[] {
  switch (b.kind) {
    case "p":
      return [paragraph(b.variant === "gut" ? inline(walk, b.text ?? b.lead ?? "", where, true) : leadLine(walk, b, where))];
    case "h3":
      return [{ type: "heading", attrs: { level: 3 }, content: inline(walk, b.text, where) }];
    case "list": {
      const content = b.items.map((item, i) => listItem(walk, item, `${where}.items[${i}]`));
      if (b.variant === "steps") return [{ type: "orderedList", content }];
      return [{ type: "bulletList", ...(b.variant !== undefined && b.variant !== "bullets" && { attrs: { style: b.variant } }), content }];
    }
    case "facts": {
      const list: PostBlock = { type: "bulletList", attrs: { style: "facts" }, content: b.items.map((item, i) => listItem(walk, item, `${where}.items[${i}]`)) };
      return b.figure === undefined ? [list] : [list, image(walk, b.figure, undefined, `${where}.figure`)];
    }
    case "callout": {
      if (b.tone !== undefined && b.tone !== "sun") refuse(walk, where, "a callout's tone has no post attribute");
      const quote: PostBlockquote = { type: "blockquote", attrs: { style: "callout", icon: b.icon }, content: [paragraph(leadLine(walk, b, where))] };
      return [quote];
    }
    case "questions": {
      const content = b.items.flatMap((item, i): (PostParagraph | Extract<PostBlock, { type: "heading" }>)[] => [
        { type: "heading", attrs: { level: 3 }, content: inline(walk, item.question, `${where}.items[${i}]`) },
        ...item.answer.map((answer) => paragraph(inline(walk, answer, `${where}.items[${i}]`))),
      ]);
      return [{ type: "blockquote", attrs: { style: "questions" }, content }];
    }
    case "figure":
      return [figure(walk, b, where)];
    case "video":
      return [{ type: "videoEmbed", attrs: { provider: b.provider, videoId: b.videoId, title: b.title, caption: b.caption === undefined ? "" : plain(walk, b.caption, where) } }];
    case "quote":
      return refuse(walk, where, "a quote has no post node");
    case "disclaimer":
      return refuse(walk, where, "a disclaimer has no post form here (only the topic's D025 line, or the age note at the end)");
  }
}

/* ── The body ─────────────────────────────────────────────────────────────────────────────────────── */

function body(walk: Walk, article: Article, detail: readonly ProseBlock[]): PostBlock[] {
  const out: PostBlock[] = detail.flatMap((b, i) => block(walk, b, `answer.detail[${i}]`));
  if (detail.length > 0) out.push({ type: "horizontalRule" });
  article.body.forEach((item, i) => {
    const where = `body[${i}]`;
    const next = article.body[i + 1];
    if (item.kind === "figure") {
      if (next?.kind !== "part" || next.title === undefined) refuse(walk, where, "a photo between parts needs an h2 after it");
      out.push(figure(walk, item, where));
      return;
    }
    out.push(...partNodes(walk, item, where, { first: i === 0 && detail.length === 0, nextIsTitled: next?.kind === "part" && next.title !== undefined }));
  });
  return out;
}

function partNodes(walk: Walk, part: ArticlePart, where: string, at: { first: boolean; nextIsTitled: boolean }): PostBlock[] {
  if (part.title === undefined && part.id !== undefined) refuse(walk, where, "only a titled part takes an anchor");
  const facts = part.blocks.some((b) => b.kind === "facts");
  if ((part.variant === "breakout") !== facts) refuse(walk, where, "a part breaks out only around a facts list, and always does");
  const last = part.blocks[part.blocks.length - 1];
  if (last?.kind === "figure" && at.nextIsTitled) {
    refuse(walk, `${where}.blocks[${part.blocks.length - 1}]`, "a photo that ends a part would show between the parts; put it between them");
  }
  const open: PostBlock[] =
    part.title !== undefined
      ? [{ type: "heading", attrs: { level: 2, ...(part.id !== undefined && { anchor: part.id }) }, content: inline(walk, part.title, where) }]
      : at.first
        ? []
        : [{ type: "horizontalRule" }];
  return [...open, ...part.blocks.flatMap((b, j) => block(walk, b, `${where}.blocks[${j}]`))];
}

/* ── One guide ────────────────────────────────────────────────────────────────────────────────────── */

/** The h1 as the post's title and accent: the words without tokens, and the one hand-lettered phrase. */
function headline(walk: Walk, title: RichTextString): { title: string; accent: string | null } {
  const nodes = parseRichText(title);
  const accents = nodes.filter((n) => n.kind === "hand");
  if (accents.length > 1) refuse(walk, "head.title", "one accent per headline (a DS rule)");
  const text = (list: readonly RichNode[]): string =>
    list
      .map((n) => {
        if (n.kind === "text") return n.text;
        if (n.kind === "hand" || n.kind === "nowrap") return text(n.children);
        return refuse(walk, "head.title", `"${n.kind}" has no place in a title`);
      })
      .join("");
  const accent = accents[0];
  return { title: text(nodes), accent: accent && "children" in accent ? text(accent.children) : null };
}

/** A guide module as a dashboard post (journal-pipeline §3, §9.3), or a throw naming what a post cannot say. */
export function articleToPost(article: Article, context: ExportContext): Post {
  const { vocabulary } = context;
  const walk: Walk = { slug: article.slug, vocabulary };
  const topic = vocabulary.topics.find((t) => t.title === context.theme) ?? refuse(walk, "", `the theme "${context.theme}" is not a topic title`);
  if (article.close !== topic.close) refuse(walk, "", `the close "${article.close}" is not its topic's ("${topic.close}"), which the adapter derives`);

  const { title, accent } = headline(walk, article.head.title);
  if (typeof article.meta.title !== "string" || typeof article.meta.description !== "string") refuse(walk, "meta", "a post's <title> and description do not change with the offer");
  const metaTitle = article.meta.title as string;
  const lead = article.head.lead === undefined ? null : plain(walk, article.head.lead, "head.lead");
  const cardTitle = plain(walk, article.card.title, "card.title");
  const summary = plain(walk, article.card.summary, "card.summary");

  const people = [vocabulary.team.byline, ...vocabulary.people];
  if (!people.includes(article.head.author)) refuse(walk, "head.author", `the byline "${article.head.author}" is not one the site lists (${people.join(", ")})`);
  const author = article.head.author === vocabulary.team.byline ? vocabulary.team.author : article.head.author;

  /* The head photo by key, its card the photo's (§6); an upload as the cover. */
  const head = article.head.image;
  let cover: Pick<Post, "photo" | "hero" | "heroAlt" | "heroWidth" | "heroHeight"> = { photo: null, hero: null, heroAlt: "", heroWidth: null, heroHeight: null };
  if (head !== undefined && typeof head.src === "string" && head.src.startsWith(JOURNAL_IMAGES) && "width" in head) {
    cover = { photo: null, hero: head.src, heroAlt: head.alt, heroWidth: head.width, heroHeight: head.height };
  } else if (head !== undefined) {
    const key = Object.keys(vocabulary.photos).find((k) => vocabulary.photos[k].image.src === head.src && vocabulary.photos[k].card !== undefined);
    if (key === undefined) refuse(walk, "head.image", "the head photo is not in the photo table with a share card (src/content/en-IN/stories/photos.ts)");
    const entry = vocabulary.photos[key!];
    if (article.meta.og.image !== entry.card || article.meta.og.alt !== entry.image.alt) refuse(walk, "meta.og", `the share card is not the photo "${key}"'s`);
    cover = { photo: key!, hero: null, heroAlt: entry.image.alt, heroWidth: null, heroHeight: null };
  }

  /* The answer, and its detail: the topic's D025 line is left out (the adapter adds it); the rest goes above a rule. */
  const detail = [...(article.answer?.detail ?? [])];
  if (topic.disclaimer !== undefined) {
    const last = detail.pop();
    if (last?.kind !== "disclaimer" || last.text !== topic.disclaimer) refuse(walk, "answer.detail", "a guide on the talking topic ends its answer with D025's line, as the topic words it");
  }
  const answer = article.answer && {
    question: answerText(walk, article.answer.question as string, "answer.question"),
    text: answerText(walk, article.answer.answer as string, "answer"),
  };

  /* The age note: a disclaimer line that ends the body (§5.4). */
  let parts = article.body;
  let ageNote: string | null = null;
  const lastPart = parts[parts.length - 1];
  const lastBlock = lastPart?.kind === "part" ? lastPart.blocks[lastPart.blocks.length - 1] : undefined;
  if (lastPart?.kind === "part" && lastBlock?.kind === "disclaimer") {
    ageNote = plain(walk, lastBlock.text, `body[${parts.length - 1}]`);
    const rest = lastPart.blocks.slice(0, -1);
    parts = rest.length === 0 && lastPart.title === undefined ? parts.slice(0, -1) : [...parts.slice(0, -1), { ...lastPart, blocks: rest }];
  }

  const { photo, ...hero } = cover;
  return {
    slug: article.slug,
    title,
    description: article.meta.description as string,
    theme: topic.title,
    author,
    published: article.published,
    updated: article.updated,
    pose: context.pose,
    tint: context.tint,
    ...hero,
    ageNote,
    sources: article.sources.map((s, i) => ({ label: plain(walk, s.citation, `sources[${i}]`), url: s.href })),
    body: { type: "doc", content: body(walk, { ...article, body: parts }, detail) },
    metaTitle: metaTitle === derivedMetaTitle(title) ? null : metaTitle,
    cardTitle: cardTitle === title ? null : cardTitle,
    accent,
    lead,
    summary: summary === (lead ?? (article.meta.description as string)) ? null : summary,
    answer: answer ?? null,
    photo,
    related: [...article.related],
  };
}
