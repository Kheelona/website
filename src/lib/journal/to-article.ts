/** The adapter: a dashboard post into the rebuild's `Article` (ADR-014; journal-pipeline §4, §5, §8.2).
 *
 *  One pure map, so the article template, the hub, the sitemap, the sticky bar and every article guard keep reading
 *  `Article`s and there is no second article renderer. What a post never stores is derived here: the <title> when the
 *  post names none, the h1's hand-lettered accent and no-wrap ages, the read time, the close and the D025 line (from the
 *  topic), the share card (from the photo), bold lead-ins and gut lines, breakout parts, and the related guides the
 *  post leaves out (the ring).
 *
 *  The adapter holds the site's vocabulary (§8.2's adapter rows): the topic (rule 10), the byline (11), photo keys and
 *  icon names (12), the talking topic's rules (18), the related ring (19) and a slug that is a redirect's source (17).
 *  A refusal throws `post "<slug>": <what> (rule <n>)`, so `next build` stops and names the post and the reason, as the
 *  article helpers already do (article-page.ts). The structure, the tokens, links, uploads and the banned list were
 *  checked before the build by the gate (./validate.ts), which this file trusts and does not repeat.
 *
 *  `src/lib` never imports content (structure §6): the topics, the photo table, the icon names and the bylines come in
 *  as a `JournalVocabulary` (task 8b.2e assembles it in `journal.ts`). */

import { HOSTS } from "@/config/env";
import { JOURNAL_IMAGES } from "@/config/journal";
import { REDIRECTS, type RedirectRule } from "@/config/redirects";
import type {
  Article,
  ArticlePart,
  FigureBlock,
  ImageRef,
  IsoDate,
  JournalImageUrl,
  ListItem,
  Meta,
  ProseBlock,
  QuestionsBlock,
  RichTextString,
  SitePath,
  TrustListItem,
} from "@/content/types";
import type { OgImage } from "@/lib/seo/metadata";
import { nowrapAges } from "./nowrap";
import type { Post, PostBlock, PostBlockquote, PostImage, PostInline, PostListItem, PostParagraph, PostText } from "./post";
import { readMinutes } from "./read-minutes";
import { fillRelated, readingOrder, ringOffers } from "./ring";

/* ── The vocabulary ───────────────────────────────────────────────────────────────────────────────── */

/** A design-system image a post may name by key (src/content/en-IN/stories/photos.ts): its one alt, the share card of
 *  a photo that may head a guide (`/og/<key>.jpg`, 1200 x 630), and `wide` on a photo 1.6 or more times as wide as tall. */
export interface JournalPhoto {
  readonly image: ImageRef;
  readonly card?: SitePath;
  readonly wide?: boolean;
}

/** A stories topic (src/content/en-IN/stories/topics.ts): a post names it by `title`; it decides the close and the
 *  line under the answer. */
export interface JournalTopic {
  readonly id: string;
  readonly title: string;
  readonly close: "journal" | "keep";
  readonly disclaimer?: string;
}

/** What the adapter needs from the site's content, passed in. */
export interface JournalVocabulary {
  readonly topics: readonly JournalTopic[];
  readonly photos: Readonly<Record<string, JournalPhoto>>;
  /** The design-system icon names (src/assets/icons.generated.ts). */
  readonly icons: readonly string[];
  /** The people a post may name as its author (the founders, organization.ts). */
  readonly people: readonly string[];
  /** The team's byline: the dashboard's company author ("Kheelona") and the words the page prints for it. */
  readonly team: { readonly author: string; readonly byline: string };
  /** The share card of a guide with neither a photo nor a cover. */
  readonly defaultOg: Meta["og"];
}

/** A refusal: the post, what is wrong and §8.2's rule. */
export class JournalAdapterError extends Error {
  override name = "JournalAdapterError";
}

const fail = (slug: string, what: string, rule: number): never => {
  throw new JournalAdapterError(`post "${slug}": ${what} (rule ${rule})`);
};

/* ── Derivations (the export of task 8b.2e shared them; it went with the 20 modules) ──────────────────────── */

const META_TITLE_MAX = 60;
/** The site's name after a derived <title>, as validate.ts's rule 23 derives it (the two are held equal by test). */
const SITE_SUFFIX = " · Kheelona";
/** A wide body photo takes the 16:9 frame (§5.1). */
const WIDE_RATIO = 1.6;
/** The share card of an uploaded cover: this site's optimiser at 1200 wide (Next's default `qualities` [75], which
 *  never enlarges), never the API's own address, which answers noindex (main:…/stories/[slug]/page.tsx:40-47). */
const CARD_WIDTH = 1200;

/** The <title> a post that names none gets: the h1 and the site's name when that fits in 60 characters, else the h1. */
export function derivedMetaTitle(title: string): string {
  const suffixed = `${title}${SITE_SUFFIX}`;
  return suffixed.length <= META_TITLE_MAX ? suffixed : title;
}

/** The address an uploaded image is shared at, on this site. */
export function uploadCardUrl(src: string): SitePath {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${CARD_WIDTH}&q=75`;
}

/** The size of that card: the optimiser serves 1200 wide, or the upload's own width if it is narrower. */
export function uploadCardSize(width: number, height: number): { width: number; height: number } {
  const served = Math.min(CARD_WIDTH, width);
  return { width: served, height: Math.round((served * height) / width) };
}

export const isWide = (width: number, height: number): boolean => width / height >= WIDE_RATIO;

const PITCH_PATH = /^\/(products|store)(\/|$|[?#])/;
const STORE_HOSTS: readonly string[] = [HOSTS.production.store, HOSTS.beta.store];
const MARKETING_HOSTS: readonly string[] = [HOSTS.production.marketing, `www.${HOSTS.production.marketing}`, HOSTS.beta.marketing];

/** A link a guide on a topic without a pitch never carries: a product page or the store, as a site path or as the full
 *  address a writer pastes from the browser, on either host and in any case (B5). */
export function isPitchLink(href: string): boolean {
  if (PITCH_PATH.test(href)) return true;
  if (!/^https:\/\//i.test(href)) return false;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  const host = url.hostname.toLowerCase();
  if (STORE_HOSTS.includes(host)) return true;
  return MARKETING_HOSTS.includes(host) && PITCH_PATH.test(url.pathname);
}

/** The slugs a plain `/stories/<slug>` redirect answers, on the apex (the `www` twins repeat them). */
export function redirectedSlugs(redirects: readonly RedirectRule[]): ReadonlySet<string> {
  const slugs = redirects.filter((r) => r.has === undefined).flatMap((r) => /^\/stories\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(r.source)?.[1] ?? []);
  return new Set(slugs);
}

/* ── Inline: post text into one rich-text string ──────────────────────────────────────────────────── */

const isBold = (node: PostInline): boolean => node.type === "text" && (node.marks ?? []).some((m) => m.type === "bold");
const linkOf = (node: PostText): string | undefined => {
  const mark = (node.marks ?? []).find((m) => m.type === "link");
  return mark?.type === "link" ? mark.attrs.href : undefined;
};

/** One post's walk: its slug, the vocabulary, and where warnings go. */
interface Walk {
  readonly slug: string;
  readonly vocabulary: JournalVocabulary;
  readonly icons: ReadonlySet<string>;
  readonly pitchFree: boolean;
  readonly warn: (where: string, what: string) => void;
}

/** Text nodes as the one inline syntax: a run under one link mark is `[label](href)`; the tokens the gate allowed
 *  (`[^n]`, `{price:…}`, `{delivery}`) pass through; ages and phone links get their no-wrap span. A hard break is a
 *  space here. */
function richText(walk: Walk, nodes: readonly PostInline[]): RichTextString {
  let out = "";
  for (let i = 0; i < nodes.length; ) {
    const node = nodes[i];
    if (node.type !== "text") {
      out += " ";
      i += 1;
      continue;
    }
    const href = linkOf(node);
    if (href === undefined) {
      out += nowrapAges(node.text);
      i += 1;
      continue;
    }
    if (walk.pitchFree && isPitchLink(href)) fail(walk.slug, `a guide on the talking topic never links "${href}" (no pitch, B5)`, 18);
    let label = "";
    while (i < nodes.length && nodes[i].type === "text" && linkOf(nodes[i] as PostText) === href) {
      label += nowrapAges((nodes[i] as PostText).text);
      i += 1;
    }
    /* A phone number never breaks across lines, as every page sets it (seller.ts: `{nowrap:[…](tel:…)}`, task 3.6). */
    out += href.startsWith("tel:") ? `{nowrap:[${label}](${href})}` : `[${label}](${href})`;
  }
  return out;
}

/** A run of inline nodes split at its hard breaks, empty runs dropped. */
function lines(content: readonly PostInline[]): PostInline[][] {
  const runs: PostInline[][] = [[]];
  for (const node of content) {
    if (node.type === "hardBreak") runs.push([]);
    else runs[runs.length - 1].push(node);
  }
  return runs.filter((run) => run.some((n) => n.type === "text" && n.text.trim() !== ""));
}

/** Punctuation a writer types right after a bold lead-in ("**Note**: the rest"): it belongs to the lead, since the page
 *  sets a space between the lead and the text. */
const LEAD_PUNCTUATION = /^[:;,.!?)]+/;

/** A line as a lead-in and the rest: the leading bold run is the lead, with the punctuation typed after it (§5.2); bold
 *  anywhere else is plain, with a warning. `all` when the whole line is bold. */
function leadOf(walk: Walk, run: readonly PostInline[], where: string): { lead?: RichTextString; text?: RichTextString; all: boolean } {
  const textNodes = run.filter((n) => n.type === "text");
  const all = textNodes.length > 0 && textNodes.every(isBold);
  if (all) return { text: richText(walk, run).trim(), all };
  let k = 0;
  while (k < run.length && isBold(run[k])) k += 1;
  if (run.slice(k).some(isBold)) walk.warn(where, "bold inside a line shows as plain text; only a lead-in or a whole line can be bold (§5.2)");
  let lead = k > 0 ? richText(walk, run.slice(0, k)).trimEnd() : undefined;
  let text = richText(walk, run.slice(k)).trimStart();
  const punctuation = lead === undefined ? undefined : LEAD_PUNCTUATION.exec(text)?.[0];
  if (punctuation !== undefined) {
    lead += punctuation;
    text = text.slice(punctuation.length).trimStart();
  }
  return { ...(lead !== undefined && { lead }), ...(text !== "" && { text }), all };
}

/** A heading's words, or a list item's when bold means nothing: bold is plain, with a warning. */
function plainLine(walk: Walk, content: readonly PostInline[] | undefined, where: string): RichTextString {
  const nodes = content ?? [];
  if (nodes.some(isBold)) walk.warn(where, "bold inside a heading shows as plain text (§5.2)");
  return richText(walk, nodes).trim();
}

/* ── Blocks ───────────────────────────────────────────────────────────────────────────────────────── */

function icon(walk: Walk, name: string | null | undefined, where: string): string | undefined {
  if (name === undefined || name === null) return undefined;
  if (!walk.icons.has(name)) fail(walk.slug, `${where}: icon "${name}" is not a DS icon`, 12);
  return name;
}

function paragraphs(walk: Walk, node: PostParagraph, where: string): ProseBlock[] {
  return lines(node.content ?? []).map((run) => {
    const { lead, text, all } = leadOf(walk, run, where);
    if (all) return { kind: "p", variant: "gut", text: text! };
    return lead === undefined ? { kind: "p", text: text ?? "" } : { kind: "p", lead, ...(text !== undefined && { text }) };
  });
}

/** One list item's paragraph: its lead-in and its words, a hard break a space. */
function itemLine(walk: Walk, item: PostListItem, where: string): { lead?: RichTextString; text?: RichTextString } {
  const content = (item.content[0].content ?? []).map((n): PostInline => (n.type === "hardBreak" ? { type: "text", text: " " } : n));
  const { lead, text, all } = leadOf(walk, content, where);
  return all ? { lead: text } : { ...(lead !== undefined && { lead }), ...(text !== undefined && { text }) };
}

function list(walk: Walk, node: Extract<PostBlock, { type: "bulletList" | "orderedList" }>, where: string): ProseBlock {
  const style = node.type === "orderedList" ? "steps" : (node.attrs?.style ?? "bullets");
  if (style === "facts") {
    const items = node.content.map((item, i): TrustListItem => {
      const at = `${where}.content[${i}]`;
      const { lead, text } = itemLine(walk, item, at);
      const name = icon(walk, item.attrs?.icon, at);
      if (name === undefined) fail(walk.slug, `${at}: a fact needs an icon`, 12);
      return lead !== undefined && text !== undefined ? { icon: name!, title: lead, body: text } : { icon: name!, body: (text ?? lead)! };
    });
    return { kind: "facts", items };
  }
  const items = node.content.map((item, i): ListItem => {
    const at = `${where}.content[${i}]`;
    const line = itemLine(walk, item, at);
    const name = icon(walk, item.attrs?.icon, at);
    if (style === "tips" && name === undefined) fail(walk.slug, `${at}: a tip needs an icon`, 12);
    if (line.lead === undefined && name === undefined) return line.text ?? "";
    return { ...line, ...(name !== undefined && { icon: name }) } as ListItem;
  });
  return { kind: "list", ...(style !== "bullets" && { variant: style }), items };
}

function quote(walk: Walk, node: PostBlockquote, where: string): ProseBlock {
  if ((node.attrs?.style ?? "callout") === "callout") {
    const name = icon(walk, node.attrs?.icon, where);
    if (name === undefined) fail(walk.slug, `${where}: a callout needs an icon`, 12);
    const para = node.content[0] as PostParagraph;
    const { lead, text, all } = leadOf(walk, (para.content ?? []).map((n): PostInline => (n.type === "hardBreak" ? { type: "text", text: " " } : n)), where);
    return all ? { kind: "callout", icon: name!, lead: text! } : ({ kind: "callout", icon: name!, ...(lead !== undefined && { lead }), text: text ?? "" } as ProseBlock);
  }
  icon(walk, node.attrs?.icon, where);
  const items: QuestionsBlock["items"][number][] = [];
  node.content.forEach((child, i) => {
    const at = `${where}.content[${i}]`;
    if (child.type === "heading") items.push({ question: plainLine(walk, child.content, at), answer: [] });
    else {
      const answers = lines(child.content ?? []).map((run) => {
        if (run.some(isBold)) walk.warn(at, "bold inside an answer shows as plain text (§5.2)");
        return richText(walk, run).trim();
      });
      const last = items[items.length - 1];
      items[items.length - 1] = { ...last, answer: [...last.answer, ...answers] };
    }
  });
  return { kind: "questions", items };
}

/** A DS photo by key (its src ignored), or an upload at its own size and words (§6). */
function figure(walk: Walk, node: PostImage, where: string): FigureBlock {
  const { photo: key, caption, src, width, height, alt } = node.attrs;
  const words = caption.trim() === "" ? {} : { caption: nowrapAges(caption.trim()) };
  if (key !== undefined && key !== null) {
    const entry = walk.vocabulary.photos[key] ?? fail(walk.slug, `${where}: photo "${key}" is not in the photo table (src/content/en-IN/stories/photos.ts)`, 12);
    return { kind: "figure", image: entry.image, ...(entry.wide && { variant: "wide" }), ...words };
  }
  if (!src.startsWith(JOURNAL_IMAGES) || width === null || height === null) {
    fail(walk.slug, `${where}: the image "${src}" is not an upload under ${JOURNAL_IMAGES} with its size`, 13);
  }
  const image: ImageRef = { src: src as JournalImageUrl, width: width!, height: height!, alt };
  return { kind: "figure", image, ...(isWide(width!, height!) && { variant: "wide" }), ...words };
}

function block(walk: Walk, node: PostBlock, where: string): ProseBlock[] {
  switch (node.type) {
    case "paragraph":
      return paragraphs(walk, node, where);
    case "heading":
      return [{ kind: "h3", text: plainLine(walk, node.content, where) }];
    case "bulletList":
    case "orderedList":
      return [list(walk, node, where)];
    case "blockquote":
      return [quote(walk, node, where)];
    case "image":
      return [figure(walk, node, where)];
    case "videoEmbed": {
      const { provider, videoId, title, caption } = node.attrs;
      return [{ kind: "video", provider, videoId, title, ...(caption.trim() !== "" && { caption: nowrapAges(caption.trim()) }) }];
    }
    case "horizontalRule":
      return [];
  }
}

/** A run of nodes as prose blocks: a DS photo right after a facts list is the list's figure (§5.1), which the facts card
 *  sets alone, so a caption typed on it is left out with a warning. */
function blocks(walk: Walk, nodes: readonly { node: PostBlock; where: string }[]): ProseBlock[] {
  const out: ProseBlock[] = [];
  nodes.forEach(({ node, where }) => {
    const previous = out[out.length - 1];
    if (node.type === "image" && node.attrs.photo && previous?.kind === "facts" && previous.figure === undefined) {
      const caption = node.attrs.caption.trim();
      if (caption !== "") {
        walk.warn(where, `a facts list's photo shows no caption, so "${caption}" is left out; remove it, or put a paragraph between the list and the photo (§5.1)`);
      }
      out[out.length - 1] = { ...previous, figure: figure(walk, node, where).image };
      return;
    }
    out.push(...block(walk, node, where));
  });
  return out;
}

const isH2 = (node: PostBlock | undefined) => node?.type === "heading" && node.attrs.level === 2;
const isFacts = (node: PostBlock | undefined) => node?.type === "bulletList" && node.attrs?.style === "facts";

/** The body (§5.1): the answer card's detail, then parts and the photos between them. Nodes above a rule that comes
 *  before the first h2 sit in the answer card, under the answer, when the post has one (the approved guides' fold 2);
 *  otherwise the nodes before the first h2 are an untitled part. Each h2 starts a part (its anchor the part's id); a
 *  rule ends one, and what follows is an untitled part; a DS photo or upload that is the last node before an h2 sits
 *  between the parts, unless it is a facts list's figure. A part holding facts breaks out of the column. */
function body(walk: Walk, post: Post): { detail: ProseBlock[]; body: (ArticlePart | FigureBlock)[] } {
  const nodes = post.body.content.map((node, i) => ({ node, where: `body[${i}]` }));
  const firstH2 = nodes.findIndex(({ node }) => isH2(node));
  const rule = nodes.findIndex(({ node }) => node.type === "horizontalRule");
  const split = post.answer && rule !== -1 && (firstH2 === -1 || rule < firstH2) ? rule : -1;
  const detailNodes = nodes.slice(0, split + 1).filter(({ node }) => node.type !== "horizontalRule");
  /* The approved answer card holds text only. */
  for (const { node, where } of detailNodes) {
    if (node.type === "videoEmbed") fail(walk.slug, `${where}: the answer card holds no video; put it after the rule`, 4);
    if (node.type === "image") fail(walk.slug, `${where}: the answer card holds no photo; put it after the rule`, 4);
  }
  const detail = blocks(walk, detailNodes);

  const out: (ArticlePart | FigureBlock)[] = [];
  let part: { title?: RichTextString; id?: string; nodes: { node: PostBlock; where: string }[] } | null = null;
  const close = () => {
    if (part === null) return;
    const prose = blocks(walk, part.nodes);
    if (part.title !== undefined || prose.length > 0) {
      out.push({
        kind: "part",
        ...(part.id !== undefined && { id: part.id }),
        ...(part.title !== undefined && { title: part.title }),
        ...(prose.some((b) => b.kind === "facts") && { variant: "breakout" }),
        blocks: prose,
      });
    }
    part = null;
  };
  const rest = nodes.slice(split + 1);
  rest.forEach((entry, i) => {
    const { node, where } = entry;
    /* A photo right before an h2 sits between the parts, unless it is the facts list's figure (§5.1). */
    const between = node.type === "image" && isH2(rest[i + 1]?.node) && !(node.attrs.photo && isFacts(rest[i - 1]?.node));
    if (node.type === "heading" && node.attrs.level === 2) {
      close();
      const anchor = node.attrs.anchor ?? undefined;
      part = { title: plainLine(walk, node.content, where), ...(anchor !== undefined && { id: anchor }), nodes: [] };
    } else if (node.type === "horizontalRule") {
      close();
      part = { nodes: [] };
    } else if (between) {
      close();
      out.push(figure(walk, node as PostImage, where));
    } else {
      part ??= { nodes: [] };
      part.nodes.push(entry);
    }
  });
  close();

  /* The age note (§5.4): a plain line at the end of the body. */
  if (post.ageNote) {
    const note: ProseBlock = { kind: "disclaimer", text: nowrapAges(post.ageNote) };
    const last = out[out.length - 1];
    if (last?.kind === "part") out[out.length - 1] = { ...last, blocks: [...last.blocks, note] };
    else out.push({ kind: "part", blocks: [note] });
  }
  return { detail, body: out };
}

/* ── One post ─────────────────────────────────────────────────────────────────────────────────────── */

export interface AdaptOptions {
  readonly vocabulary: JournalVocabulary;
  /** The journal's slugs (after any redirect drop): a related guide must be one of them. */
  readonly published: ReadonlySet<string>;
  /** The ring's offers for this post (./ring.ts), which fill what its own list leaves out. */
  readonly offers?: readonly string[];
  /** Where build warnings go (§8.2's warning column); the default prints them. */
  readonly warn?: (message: string) => void;
}

/** The h1: the accent in the hand face, once (a DS rule), and every age compound on one line. */
function headline(walk: Walk, title: string, accent: string | null | undefined): RichTextString {
  if (!accent) return nowrapAges(title);
  const at = title.indexOf(accent);
  if (at === -1 || title.indexOf(accent, at + 1) !== -1) {
    walk.warn("", `the accent "${accent}" is not in the title once; the h1 shows no accent (rule 23)`);
    return nowrapAges(title);
  }
  return `${nowrapAges(title.slice(0, at))}{hand:${nowrapAges(accent)}}${nowrapAges(title.slice(at + accent.length))}`;
}

/** A dashboard post as the rebuild's `Article` (§4), or a throw naming the post and the rule. */
export function postToArticle(post: Post, options: AdaptOptions): Article {
  const { vocabulary } = options;
  const print = options.warn ?? ((message: string) => console.warn(message));
  const slug = post.slug;
  const topic = vocabulary.topics.find((t) => t.title === post.theme) ?? fail(slug, `theme "${post.theme}" is not a topic title`, 10);
  const walk: Walk = {
    slug,
    vocabulary,
    icons: new Set(vocabulary.icons),
    pitchFree: topic.close === "keep",
    warn: (where, what) => print(`post "${slug}": ${where ? `${where}: ` : ""}${what}`),
  };

  const bylines = [vocabulary.team.author, ...vocabulary.people];
  if (!bylines.includes(post.author)) fail(slug, `the byline "${post.author}" is not one the site lists (${bylines.join(", ")})`, 11);
  const author = post.author === vocabulary.team.author ? vocabulary.team.byline : post.author;

  /* The head photo and its share card (§6): a DS photo by key, else the uploaded cover, else neither. */
  let image: ImageRef | undefined;
  let og: OgImage = vocabulary.defaultOg;
  if (post.photo) {
    const entry = vocabulary.photos[post.photo] ?? fail(slug, `photo "${post.photo}" is not in the photo table (src/content/en-IN/stories/photos.ts)`, 12);
    if (entry.card === undefined) fail(slug, `photo "${post.photo}" has no share card, so it cannot head a guide`, 12);
    image = entry.image;
    og = { image: entry.card!, alt: entry.image.alt };
  } else if (post.hero !== null) {
    if (!post.hero.startsWith(JOURNAL_IMAGES) || post.heroWidth === null || post.heroHeight === null) {
      fail(slug, `the cover "${post.hero}" is not under ${JOURNAL_IMAGES}`, 13);
    }
    image = { src: post.hero as JournalImageUrl, width: post.heroWidth!, height: post.heroHeight!, alt: post.heroAlt };
    og = { image: uploadCardUrl(post.hero), alt: post.heroAlt, ...uploadCardSize(post.heroWidth!, post.heroHeight!) };
  } else if (walk.pitchFree) {
    fail(slug, "a guide on the talking topic needs a head photo or a cover, or its share card would be the product shot (P19)", 18);
  }

  if (topic.disclaimer !== undefined && !post.answer) fail(slug, "a guide on the talking topic needs its answer card, under which D025's line prints", 18);
  const { detail, body: parts } = body(walk, post);
  const disclaimer: ProseBlock[] = topic.disclaimer === undefined ? [] : [{ kind: "disclaimer", text: topic.disclaimer }];
  const answerDetail = [...detail, ...disclaimer];

  const own = post.related ?? [];
  const { related, filled } = fillRelated(slug, own, options.published, options.offers ?? []);
  if (filled.length > 0) walk.warn("", `related filled from the ring: ${filled.join(", ")} (rule 19)`);

  return {
    slug,
    meta: { title: post.metaTitle ?? derivedMetaTitle(post.title), description: post.description, og },
    card: { title: post.cardTitle ?? post.title, summary: post.summary ?? post.lead ?? post.description },
    related,
    published: post.published as IsoDate,
    updated: post.updated as IsoDate,
    head: {
      title: headline(walk, post.title, post.accent),
      ...(post.lead && { lead: nowrapAges(post.lead) }),
      author,
      readMinutes: readMinutes(post),
      ...(image !== undefined && { image }),
    },
    ...(post.answer && {
      answer: {
        question: nowrapAges(post.answer.question),
        answer: nowrapAges(post.answer.text),
        ...(answerDetail.length > 0 && { detail: answerDetail }),
      },
    }),
    body: parts,
    sources: post.sources.map((source) => ({ citation: source.label, href: source.url as `https://${string}` })),
    close: topic.close,
  };
}

/* ── The journal ──────────────────────────────────────────────────────────────────────────────────── */

export interface AdaptedJournal {
  /** The articles, in the posts' order. */
  readonly articles: readonly Article[];
  /** Each article's topic id, for the hub. */
  readonly topicOf: ReadonlyMap<string, string>;
  /** Slugs left out because a redirect answers their address (rule 17). */
  readonly dropped: readonly string[];
  /** Build warnings (§8.2's warning column). */
  readonly warnings: readonly string[];
}

/** Every published post as an article: redirect sources dropped (the redirect wins, §10), the related guides filled
 *  from the ring over the journal sorted by topic. Every refusal is collected and thrown as one error, so the build
 *  log names each post and rule at once. */
export function journalToArticles(posts: readonly Post[], vocabulary: JournalVocabulary, options: { readonly redirects?: readonly RedirectRule[] } = {}): AdaptedJournal {
  const redirected = redirectedSlugs(options.redirects ?? REDIRECTS);
  const warnings: string[] = [];
  const dropped = posts.filter((p) => redirected.has(p.slug)).map((p) => p.slug);
  for (const slug of dropped) {
    warnings.push(`post "${slug}": its address is a redirect's source (src/config/redirects.ts), so the post is left out; unpublish it (rule 17)`);
  }
  const kept = posts.filter((p) => !redirected.has(p.slug));
  const published = new Set(kept.map((p) => p.slug));
  const offers = ringOffers(readingOrder(kept, vocabulary.topics.map((t) => t.title)));

  const articles: Article[] = [];
  const topicOf = new Map<string, string>();
  const refusals: string[] = [];
  for (const post of kept) {
    try {
      articles.push(postToArticle(post, { vocabulary, published, offers: offers.get(post.slug), warn: (m) => warnings.push(m) }));
      topicOf.set(post.slug, vocabulary.topics.find((t) => t.title === post.theme)!.id);
    } catch (error) {
      if (!(error instanceof JournalAdapterError)) throw error;
      refusals.push(error.message);
    }
  }
  if (refusals.length > 0) {
    throw new JournalAdapterError(`the journal is refused (journal-pipeline §8.2):\n${refusals.map((r) => `  ${r}`).join("\n")}`);
  }
  return { articles, topicOf, dropped, warnings };
}

/* ── The hub's groups (§4 "hub featured and order"; §8.2 row 25) ──────────────────────────────────── */

/** The hub's curation (src/content/en-IN/stories/hub.ts): per topic, the featured guide and the listed order. */
export interface HubOverride {
  readonly topic: string;
  readonly featured?: string;
  readonly slugs: readonly string[];
}

export interface HubGroup {
  readonly topic: string;
  readonly featured?: string;
  readonly slugs: readonly string[];
}

/** The hub's topics from the journal: the hub's own order and featured guide where the guide is still published under
 *  that topic (a featured one also needs its head photo), then every guide of the topic the hub does not list, newest
 *  first. A guide that left, one the dashboard moved to another theme (it joins its new topic), a featured guide without
 *  a photo and a topic with no guide are skipped with a warning (row 25). */
export function hubGroups(
  articles: readonly Article[],
  topicOf: ReadonlyMap<string, string>,
  topics: readonly JournalTopic[],
  overrides: readonly HubOverride[],
): { groups: HubGroup[]; warnings: string[] } {
  const warnings: string[] = [];
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  const groups = topics.map((topic): HubGroup => {
    const override = overrides.find((o) => o.topic === topic.id) ?? { topic: topic.id, slugs: [] };
    const moved = (slug: string) => `is under the topic "${topicOf.get(slug)}" now, not "${topic.id}"; skipped (rule 25)`;
    let featured = override.featured;
    if (featured !== undefined && !bySlug.has(featured)) {
      warnings.push(`hub: the featured "${featured}" left the journal; skipped (rule 25)`);
      featured = undefined;
    } else if (featured !== undefined && topicOf.get(featured) !== topic.id) {
      warnings.push(`hub: the featured "${featured}" ${moved(featured)}`);
      featured = undefined;
    } else if (featured !== undefined && bySlug.get(featured)!.head.image === undefined) {
      warnings.push(`hub: the featured "${featured}" has no head photo; skipped (rule 25)`);
      featured = undefined;
    }
    const listed = override.slugs.filter((slug) => {
      if (!bySlug.has(slug)) {
        warnings.push(`hub: "${slug}" left the journal; skipped (rule 25)`);
        return false;
      }
      if (topicOf.get(slug) !== topic.id) {
        warnings.push(`hub: "${slug}" ${moved(slug)}`);
        return false;
      }
      return true;
    });
    const named = new Set([...listed, ...(featured === undefined ? [] : [featured])]);
    const others = articles
      .filter((a) => topicOf.get(a.slug) === topic.id && !named.has(a.slug))
      .sort((a, b) => b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug))
      .map((a) => a.slug);
    const slugs = [...listed, ...others];
    if (featured === undefined && slugs.length === 0) warnings.push(`hub: the topic "${topic.id}" has no guide (rule 25)`);
    return { topic: topic.id, ...(featured !== undefined && { featured }), slugs };
  });
  return { groups, warnings };
}
