/** The gate a journal must pass before a build may ship it (ADR-014; journal-pipeline §2.3, §3, §8.2).
 *
 *  Main's validator (main:tools/blog/validate.mjs) ported and widened to the post contract (§3): what would break
 *  rendering, the law or the count is an ERROR and stops the build in every mode (§8.2's prebuild rows 1-6, 8, 10,
 *  13-15); an editorial fault is a WARNING the build prints and goes on (rows 7, 16, 19, 22, 23), which `npm run
 *  verify` turns into an error on the committed snapshot. The adapter in `next build` checks the site's vocabulary
 *  (bylines, photo keys, icon names, the talking rules) in `to-article.ts`, not here.
 *
 *  Every message names the post and the rule: `post "<slug>": <what> (rule <n>)`, n being §8.2's row.
 *
 *  Also here, because the sync, the export and the tests all need the same answer: the snapshot's order (posts by
 *  slug, keys in the contract's order, so the committed file diffs cleanly whatever order the API returns), the data
 *  compare (Postgres jsonb reorders keys, so text is never compared) and the per-post, per-field diff of `--check`.
 *
 *  🔴 NO IMPORTS, AND NOTHING BUT ERASABLE TYPESCRIPT (as `src/config/env.ts`): `scripts/journal/sync-posts.mjs`
 *  imports this file with Node's type stripping, and Vitest and the adapter import the same file. What it needs from
 *  elsewhere (the topic titles, the image folder, the banned list) comes in through `JournalRules`. The post's types
 *  are in `./post.ts`. */

export type BannedKind = "claim" | "offer" | "spelling";

/** What the gate needs from the rest of the repo, passed in so this file imports nothing. */
export interface JournalRules {
  /** The topic titles (src/content/en-IN/stories/topics.ts): a post's theme is one of them (rule 10). */
  readonly themes: readonly string[];
  /** The one place an uploaded image may live (`JOURNAL_IMAGES`, src/config/journal.ts; rule 13). */
  readonly imagesBase: string;
  /** `findBanned` of test/guards/banned-phrases.data.ts (rules 15 and 16). */
  readonly findBanned: (text: string, kinds: readonly BannedKind[]) => readonly { readonly id: string; readonly match: string }[];
}

/** Every guide offers three others, so a journal needs at least four (§2.3). */
export const MIN_POSTS = 4;

/** Main's mascot poses and card tints: the new design shows neither, but the backend still sets them and a post keeps
 *  passing main's validator (main:tools/blog/validate.mjs:11-12). */
export const POSES = ["curious", "silly", "joy", "bliss", "grumpy", "sad"] as const;
export const TINTS = ["bg-blue/15", "bg-yellow/15", "bg-orange/15"] as const;

/** A post's keys in the contract's order (§3): main's sixteen, then the backend's additions (B1). */
export const POST_KEYS = [
  "slug", "title", "description", "theme", "author", "published", "updated", "pose", "tint",
  "hero", "heroAlt", "heroWidth", "heroHeight", "ageNote", "sources", "body",
  "metaTitle", "cardTitle", "accent", "lead", "summary", "answer", "photo", "related",
] as const;

const NODE_KEYS = ["type", "attrs", "text", "marks", "content"];
/** Each node's attributes in the contract's order (§3). */
const ATTR_KEYS: Readonly<Record<string, readonly string[]>> = {
  heading: ["level", "anchor"],
  bulletList: ["style"],
  listItem: ["icon"],
  blockquote: ["style", "icon"],
  image: ["src", "alt", "caption", "width", "height", "photo"],
  videoEmbed: ["provider", "videoId", "title", "caption"],
  link: ["href"],
};
const SOURCE_KEYS = ["label", "url"];
const ANSWER_KEYS = ["question", "text"];

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ISO_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const BLOCKS = ["paragraph", "heading", "bulletList", "orderedList", "blockquote", "horizontalRule", "image", "videoEmbed"];
const LIST_STYLES = ["bullets", "checks", "tips", "facts"];
const QUOTE_STYLES = ["callout", "questions"];
const PRICE_KEYS = ["token", "balance", "headline", "full", "mrp", "launch"];
/** The only tokens post text may carry (§3): a source marker, an amount from the live offer, the delivery line. */
const TOKEN = new RegExp(`\\{price:(?:${PRICE_KEYS.join("|")})\\}|\\{delivery\\}|\\[\\^([1-9]\\d*)\\]`, "y");
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^\d+$/;
/** A site path as the rich-text parser accepts it (src/lib/content/rich-text.ts, `SITE_PATH_CHARS`, `isSitePath`). */
const SITE_PATH = /^\/(?![/\\])[A-Za-z0-9._~/%?=&-]*(#[A-Za-z0-9_-]+)?$/;
const ANCHOR_LINK = /^#[A-Za-z0-9_-]+$/;
const META_TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;
const ANSWER_MIN = 40;
const ANSWER_MAX = 60;
const META_SUFFIX = " · Kheelona";

type Obj = Record<string, unknown>;

const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const isSize = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v > 0;

/** One post's walk: where it is, the problems found so far, and the markers its rich text holds. */
interface Walk {
  readonly rules: JournalRules;
  readonly problems: string[];
  readonly markers: { readonly n: number; readonly where: string }[];
  /** Every text field and block text, for the banned list (rule 15) and the spelling warning (rule 16). */
  readonly texts: { readonly where: string; readonly text: string }[];
  readonly add: (where: string, what: string, rule: number) => void;
}

function isRealDay(day: unknown): day is string {
  if (typeof day !== "string") return false;
  const m = ISO_DAY.exec(day);
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toISOString().slice(0, 10) === day;
}

/* ── text: tokens, plain text, links, uploads ─────────────────────────────────────────────────────── */

/** Rich text (a body text node, the answer): only `[^n]`, `{price:…}` and `{delivery}`; no other brace or bracket,
 *  no typed ₹ (rule 5); a marker never inside a link label, as the rich-text parser refuses it. */
function checkRichText(walk: Walk, where: string, text: string, inLink: boolean): void {
  for (let i = 0; i < text.length; ) {
    const c = text[i];
    if (c === "{" || c === "[") {
      TOKEN.lastIndex = i;
      const m = TOKEN.exec(text);
      if (m === null) {
        const close = text.indexOf(c === "{" ? "}" : "]", i);
        const token = close === -1 ? text.slice(i, i + 12) : text.slice(i, close + 1);
        walk.add(where, `"${token}" is not a token a post may hold (only [^n], {price:…} and {delivery})`, 5);
        i = close === -1 ? text.length : close + 1;
        continue;
      }
      if (m[1] !== undefined) {
        if (inLink) walk.add(where, "a source marker cannot sit inside a link", 5);
        else walk.markers.push({ n: Number(m[1]), where });
      }
      i += m[0].length;
      continue;
    }
    if (c === "}" || c === "]") walk.add(where, `a "${c}" with no opening`, 5);
    if (c === "₹") walk.add(where, "a typed ₹; write {price:…} (prices follow the live offer)", 5);
    i += 1;
  }
}

/** Plain text (titles, the lead, labels, alt text, captions): no brace or bracket at all, no typed ₹ (rule 5). */
function checkPlain(walk: Walk, where: string, text: string): void {
  if (/[{}[\]]/.test(text)) walk.add("", `${where} is plain text: no {, }, [ or ]`, 5);
  if (text.includes("₹")) walk.add("", `${where}: a typed ₹; write {price:…} (prices follow the live offer)`, 5);
  walk.texts.push({ where, text });
}

/** A link address the rich-text parser accepts: a site path, an in-page anchor, https, mailto or tel (rule 8). */
function isLinkAddress(href: string): boolean {
  if (/\s/.test(href)) return false;
  if (href.startsWith("/")) return SITE_PATH.test(href) && !/\.html$/i.test(href.split(/[?#]/, 1)[0]);
  if (href.startsWith("#")) return ANCHOR_LINK.test(href);
  return /^https:\/\/[^/\s]/.test(href) || /^(mailto|tel):./.test(href);
}

/** An upload: an address under the image folder, already normalised, with no query string or fragment (rule 13). */
function isUpload(src: string, base: string): boolean {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  return url.href === src && src.startsWith(base) && src.length > base.length && url.search === "" && url.hash === "";
}

function uploadProblem(src: string, base: string, field: string): string | null {
  if (src.startsWith("/")) return `${field} "${src}" is a site path; an uploaded cover lives under ${base}`;
  if (!isUpload(src, base)) return `${field} "${src}" is not under ${base} (an address there, with no query string or fragment)`;
  return null;
}

/* ── the body ─────────────────────────────────────────────────────────────────────────────────────── */

function unknownKeys(walk: Walk, node: Obj, where: string, label: string, allowed: readonly string[]): void {
  for (const key of Object.keys(node)) {
    if (!allowed.includes(key)) walk.add(where, `${label}unknown key "${key}"`, 4);
  }
}

/** The node's attributes, refusing any the contract does not give it. `null` when it has none. */
function attrsOf(walk: Walk, node: Obj, where: string, allowed: readonly string[]): Obj | null {
  if (node.attrs === undefined) return null;
  if (!isObj(node.attrs)) {
    walk.add(where, "attrs is not an object", 4);
    return null;
  }
  for (const key of Object.keys(node.attrs)) {
    if (!allowed.includes(key)) walk.add(where, `unknown attribute "${key}"`, 4);
  }
  return node.attrs;
}

/** Inline content: text with bold and link marks, and hard breaks. Returns the block's text (a break is a space). */
function checkInline(walk: Walk, content: unknown, where: string): string {
  if (content === undefined) return "";
  if (!Array.isArray(content)) {
    walk.add(where, "content is not a list", 4);
    return "";
  }
  let text = "";
  content.forEach((node, i) => {
    const at = `${where}.content[${i}]`;
    if (!isObj(node)) return walk.add(at, "not a node", 4);
    if (node.type === "hardBreak") {
      unknownKeys(walk, node, at, "", ["type"]);
      text += " ";
      return;
    }
    if (node.type !== "text") return walk.add(at, `unknown inline node "${String(node.type)}"`, 4);
    unknownKeys(walk, node, at, "", ["type", "text", "marks"]);
    let inLink = false;
    if (node.marks !== undefined) {
      if (!Array.isArray(node.marks)) walk.add(at, "marks is not a list", 4);
      else {
        for (const mark of node.marks) {
          if (!isObj(mark)) {
            walk.add(at, "a mark is not an object", 4);
          } else if (mark.type === "bold") {
            unknownKeys(walk, mark, at, "bold: ", ["type", "attrs"]);
            if (mark.attrs !== undefined && !(isObj(mark.attrs) && Object.keys(mark.attrs).length === 0)) {
              walk.add(at, "a bold mark takes no attributes", 4);
            }
          } else if (mark.type === "link") {
            inLink = true;
            unknownKeys(walk, mark, at, "link: ", ["type", "attrs"]);
            const attrs = isObj(mark.attrs) ? mark.attrs : {};
            for (const key of Object.keys(attrs)) if (key !== "href") walk.add(at, `link: unknown attribute "${key}"`, 4);
            if (!isText(attrs.href)) walk.add(at, "a link needs an href", 4);
            else if (!isLinkAddress(attrs.href)) {
              walk.add(at, `link "${attrs.href}": use /path, #anchor, https://, mailto: or tel:`, 8);
            }
          } else {
            walk.add(at, `unknown mark "${String(mark.type)}"`, 4);
          }
        }
      }
    }
    if (typeof node.text !== "string" || node.text === "") return walk.add(at, "a text node needs text", 4);
    checkRichText(walk, at, node.text, inLink);
    text += node.text;
  });
  return text;
}

/** A paragraph's checks; its text joins the banned-list scan under `where`. */
function checkParagraph(walk: Walk, node: Obj, where: string): void {
  unknownKeys(walk, node, `${where} (paragraph)`, "", ["type", "attrs", "content"]);
  attrsOf(walk, node, `${where} (paragraph)`, []);
  walk.texts.push({ where, text: checkInline(walk, node.content, where) });
}

function checkHeading(walk: Walk, node: Obj, where: string): void {
  const label = `${where} (heading)`;
  unknownKeys(walk, node, label, "", ["type", "attrs", "content"]);
  const attrs = attrsOf(walk, node, label, ["level", "anchor"]);
  const level = attrs?.level;
  if (level !== 2 && level !== 3) walk.add(label, `level ${String(level)}; a heading is level 2 or 3`, 4);
  const anchor = attrs?.anchor;
  if (anchor !== undefined && anchor !== null) {
    if (level === 3) walk.add(label, "only a level-2 heading takes an anchor", 4);
    else if (typeof anchor !== "string" || !SLUG.test(anchor)) walk.add(label, `anchor "${String(anchor)}" is not kebab-case`, 4);
  }
  const text = checkInline(walk, node.content, where);
  if (text.trim() === "") walk.add(label, "a heading needs words", 4);
  walk.texts.push({ where, text });
}

function checkList(walk: Walk, node: Obj, where: string): void {
  const label = `${where} (${String(node.type)})`;
  unknownKeys(walk, node, label, "", ["type", "attrs", "content"]);
  const attrs = attrsOf(walk, node, label, node.type === "bulletList" ? ["style"] : []);
  const style = attrs?.style ?? "bullets";
  if (!LIST_STYLES.includes(style as string)) walk.add(label, `unknown style "${String(style)}"`, 4);
  if (!Array.isArray(node.content) || node.content.length === 0) {
    walk.add(label, "a list needs at least one item", 4);
    return;
  }
  node.content.forEach((item, i) => {
    const at = `${where}.content[${i}]`;
    const itemLabel = `${at} (listItem)`;
    if (!isObj(item) || item.type !== "listItem") return walk.add(at, "a list holds list items only", 4);
    unknownKeys(walk, item, itemLabel, "", ["type", "attrs", "content"]);
    const itemAttrs = attrsOf(walk, item, itemLabel, ["icon"]);
    const icon = itemAttrs?.icon;
    if (icon !== undefined && icon !== null && !isText(icon)) walk.add(itemLabel, "icon is not text or null", 4);
    if ((style === "tips" || style === "facts") && !isText(icon)) walk.add(itemLabel, `a ${style} item needs an icon`, 4);
    const content = item.content;
    if (!Array.isArray(content) || content.length !== 1 || !isObj(content[0]) || content[0].type !== "paragraph") {
      return walk.add(itemLabel, "a list item holds exactly one paragraph", 4);
    }
    checkParagraph(walk, content[0], `${at}.content[0]`);
  });
}

function checkQuote(walk: Walk, node: Obj, where: string): void {
  const label = `${where} (blockquote)`;
  unknownKeys(walk, node, label, "", ["type", "attrs", "content"]);
  const attrs = attrsOf(walk, node, label, ["style", "icon"]);
  const style = attrs?.style ?? "callout";
  if (!QUOTE_STYLES.includes(style as string)) return walk.add(label, `unknown style "${String(style)}"`, 4);
  const icon = attrs?.icon;
  const content = Array.isArray(node.content) ? node.content : [];
  if (!Array.isArray(node.content)) walk.add(label, "content is not a list", 4);
  const isPara = (b: unknown) => isObj(b) && b.type === "paragraph";
  const isQuestion = (b: unknown) => isObj(b) && b.type === "heading" && isObj(b.attrs) && b.attrs.level === 3;
  if (style === "callout") {
    if (!isText(icon)) walk.add(label, "a callout needs an icon", 4);
    if (content.length !== 1 || !isPara(content[0])) return walk.add(label, "a callout holds exactly one paragraph", 4);
  } else {
    if (icon !== undefined && icon !== null && !isText(icon)) walk.add(label, "icon is not text or null", 4);
    if (!content.every((b) => isPara(b) || isQuestion(b))) {
      return walk.add(label, "a questions block holds level-3 headings and paragraphs only", 4);
    }
    if (!isQuestion(content[0])) return walk.add(label, "a questions block starts with a level-3 heading", 4);
    if (content.some((b, i) => isQuestion(b) && !isPara(content[i + 1]))) {
      return walk.add(label, "every question needs a paragraph after it", 4);
    }
  }
  content.forEach((b, i) => checkBlock(walk, b, `${where}.content[${i}]`));
}

function checkImage(walk: Walk, node: Obj, where: string): void {
  const label = `${where} (image)`;
  unknownKeys(walk, node, label, "", ["type", "attrs"]);
  const attrs = attrsOf(walk, node, label, ["src", "alt", "caption", "width", "height", "photo"]) ?? {};
  for (const key of ["src", "alt", "caption"]) if (typeof attrs[key] !== "string") walk.add(label, `${key} is not text`, 4);
  for (const key of ["width", "height"]) {
    if (attrs[key] !== null && !isSize(attrs[key])) walk.add(label, `${key} is not a positive whole number or null`, 4);
  }
  for (const key of ["alt", "caption"]) if (typeof attrs[key] === "string") checkPlain(walk, `${where}.${key}`, attrs[key]);
  const photo = attrs.photo;
  if (photo !== undefined && photo !== null) {
    if (!isText(photo)) walk.add(label, photo === "" ? "photo is empty" : "photo is not text or null", 4);
    return; // a DS photo: the site shows it, with the photo table's alt, and ignores src
  }
  if (typeof attrs.src !== "string") return;
  const problem = uploadProblem(attrs.src, walk.rules.imagesBase, "src");
  if (problem) return walk.add(label, problem, 13);
  if (!isSize(attrs.width) || !isSize(attrs.height) || !isText(attrs.alt)) {
    walk.add(label, "an uploaded image needs width, height and alt", 13);
  }
}

function checkVideo(walk: Walk, node: Obj, where: string): void {
  const label = `${where} (videoEmbed)`;
  unknownKeys(walk, node, label, "", ["type", "attrs"]);
  const attrs = attrsOf(walk, node, label, ["provider", "videoId", "title", "caption"]) ?? {};
  const { provider, videoId } = attrs;
  if (provider !== "youtube" && provider !== "vimeo") walk.add(label, `provider "${String(provider)}" is not youtube or vimeo`, 14);
  else if (provider === "youtube" && !(typeof videoId === "string" && YOUTUBE_ID.test(videoId))) {
    walk.add(label, `"${String(videoId)}" is not a YouTube video id`, 14);
  } else if (provider === "vimeo" && !(typeof videoId === "string" && VIMEO_ID.test(videoId))) {
    walk.add(label, `"${String(videoId)}" is not a Vimeo video id`, 14);
  }
  if (!isText(attrs.title)) walk.add(label, "a video needs a title", 14);
  else checkPlain(walk, `${where}.title`, attrs.title);
  if (typeof attrs.caption !== "string") walk.add(label, "caption is not text", 4);
  else checkPlain(walk, `${where}.caption`, attrs.caption);
}

function checkBlock(walk: Walk, node: unknown, where: string): void {
  if (!isObj(node)) return walk.add(where, "not a node", 4);
  if (!BLOCKS.includes(node.type as string)) return walk.add(where, `unknown block "${String(node.type)}"`, 4);
  switch (node.type) {
    case "paragraph":
      return checkParagraph(walk, node, where);
    case "heading":
      return checkHeading(walk, node, where);
    case "bulletList":
    case "orderedList":
      return checkList(walk, node, where);
    case "blockquote":
      return checkQuote(walk, node, where);
    case "horizontalRule":
      unknownKeys(walk, node, `${where} (horizontalRule)`, "", ["type"]);
      return;
    case "image":
      return checkImage(walk, node, where);
    case "videoEmbed":
      return checkVideo(walk, node, where);
  }
}

/* ── one post ─────────────────────────────────────────────────────────────────────────────────────── */

function checkPost(post: Obj, rules: JournalRules, problems: string[]): void {
  const slug = typeof post.slug === "string" ? post.slug : "?";
  const walk: Walk = {
    rules,
    problems,
    markers: [],
    texts: [],
    add: (where, what, rule) => problems.push(`post "${slug}": ${where ? `${where}: ` : ""}${what} (rule ${rule})`),
  };
  const add = (what: string, rule: number) => walk.add("", what, rule);

  if (typeof post.slug !== "string" || !SLUG.test(post.slug)) add(`bad slug "${String(post.slug)}" (lowercase words joined by hyphens)`, 2);

  for (const key of ["title", "description", "theme", "author"]) if (!isText(post[key])) add(`missing ${key}`, 3);
  if (!isRealDay(post.published) || !isRealDay(post.updated)) {
    add(`bad dates (published "${String(post.published)}", updated "${String(post.updated)}"; YYYY-MM-DD)`, 3);
  } else if (post.updated < post.published) {
    add("updated before published", 3);
  }
  if (isText(post.theme) && !rules.themes.includes(post.theme)) {
    add(`theme "${post.theme}" is not a topic title (${rules.themes.join(", ")})`, 10);
  }

  if (!(POSES as readonly unknown[]).includes(post.pose)) add(`unknown pose "${String(post.pose)}"`, 4);
  if (!(TINTS as readonly unknown[]).includes(post.tint)) add(`unknown tint "${String(post.tint)}"`, 4);

  /* The cover: an upload under the image folder, with its size and alt, or null (rule 13). */
  if (post.hero !== null && typeof post.hero !== "string") add("bad hero (an address or null)", 4);
  if (typeof post.heroAlt !== "string") add("heroAlt is not text", 4);
  for (const key of ["heroWidth", "heroHeight"]) {
    if (post[key] !== null && !isSize(post[key])) add(`${key} is not a positive whole number or null`, 4);
  }
  if (typeof post.hero === "string") {
    const problem = uploadProblem(post.hero, rules.imagesBase, "hero");
    if (problem) add(problem, 13);
    else if (!isSize(post.heroWidth) || !isSize(post.heroHeight) || !isText(post.heroAlt)) {
      add("an uploaded cover needs heroWidth, heroHeight and heroAlt", 13);
    }
  }

  if (post.ageNote !== null && !isText(post.ageNote)) add(post.ageNote === "" ? "ageNote is empty: write it or leave it null" : "ageNote is not text or null", 4);

  /* The plain fields (rule 5) and the banned list over each (rule 15, below). */
  for (const key of ["title", "description", "heroAlt", "ageNote", "metaTitle", "cardTitle", "accent", "lead", "summary"]) {
    if (typeof post[key] === "string") checkPlain(walk, key, post[key]);
  }

  /* The additions (B1): absent or null, or well formed. */
  for (const key of ["metaTitle", "cardTitle", "accent", "lead", "summary", "photo"]) {
    const v = post[key];
    if (v === undefined || v === null) continue;
    if (v === "") add(`${key} is empty: write it or leave it null`, 4);
    else if (!isText(v)) add(`${key} is not text or null`, 4);
  }
  const answer = post.answer;
  if (answer !== undefined && answer !== null) {
    if (!isObj(answer) || !isText(answer.question) || !isText(answer.text)) add("answer needs a question and a text", 4);
    else {
      unknownKeys(walk, answer, "answer", "", ANSWER_KEYS);
      for (const key of ANSWER_KEYS) {
        checkRichText(walk, `answer.${key}`, answer[key] as string, false);
        walk.texts.push({ where: `answer.${key}`, text: answer[key] as string });
      }
    }
  }
  if (post.related !== undefined && !(Array.isArray(post.related) && post.related.every((s) => typeof s === "string"))) {
    add("related is not a list of slugs", 4);
  }

  /* Sources: a label and an https address each (rules 4, 8). */
  let sourceCount: number | null = null;
  if (!Array.isArray(post.sources)) add("sources is not a list", 4);
  else {
    sourceCount = post.sources.length;
    post.sources.forEach((source, i) => {
      if (!isObj(source) || !isText(source.label) || typeof source.url !== "string") return add(`sources[${i}] needs a label and a url`, 4);
      unknownKeys(walk, source, `sources[${i}]`, "", SOURCE_KEYS);
      checkPlain(walk, `sources[${i}].label`, source.label);
      if (!/^https:\/\/[^/\s]+\S*$/.test(source.url)) add(`sources[${i}].url "${source.url}" is not an https:// address`, 8);
    });
  }

  /* The body: a document of the contract's blocks (rule 4 and the rest, node by node). */
  const body = post.body;
  if (!isObj(body) || body.type !== "doc" || !Array.isArray(body.content)) add("body is not a document", 4);
  else {
    unknownKeys(walk, body, "body", "", ["type", "content"]);
    body.content.forEach((b, i) => checkBlock(walk, b, `body[${i}]`));
  }

  /* Markers point at a source (rule 6). */
  for (const { n, where } of walk.markers) {
    if (sourceCount !== null && n > sourceCount) walk.add(where, `marker [^${n}] but the post lists ${sourceCount} source${sourceCount === 1 ? "" : "s"}`, 6);
  }

  /* Banned claims and retired offer terms, over every text field (rule 15). */
  for (const { where, text } of walk.texts) {
    const hits = rules.findBanned(text, ["claim", "offer"]);
    if (hits.length) walk.add(where, `banned ${hits.map((h) => `${h.id} "${h.match}"`).join(", ")}`, 15);
  }
}

/* ── the journal ──────────────────────────────────────────────────────────────────────────────────── */

/** Every problem that must stop the build, each naming its post and rule; `[]` when the posts may ship. */
export function validatePosts(posts: unknown, rules: JournalRules): string[] {
  if (!Array.isArray(posts)) return ["the posts are not a list (rule 1)"];
  const problems: string[] = [];
  const seen = new Set<unknown>();
  posts.forEach((post, i) => {
    if (!isObj(post)) {
      problems.push(`post #${i + 1} is not an object (rule 4)`);
      return;
    }
    if (seen.has(post.slug)) problems.push(`post "${String(post.slug)}": duplicate slug (rule 2)`);
    else checkPost(post, rules, problems);
    seen.add(post.slug);
  });
  return problems;
}

/** Fewer than four posts always fails, `BLOG_ALLOW_SHRINK` or not: every guide offers three others (§2.3). */
export function countProblem(count: number): string | null {
  if (count >= MIN_POSTS) return null;
  return `the journal has ${count} post${count === 1 ? "" : "s"}; it needs at least ${MIN_POSTS}, so every guide can offer three others (rule 1)`;
}

/** A fall this steep is far more likely a broken database or API than an editorial decision, and shipping it would
 *  turn indexed articles into 404s overnight (main:tools/blog/validate.mjs:68-78, unchanged). */
export function shrinkProblem(previousCount: number, nextCount: number): string | null {
  if (previousCount >= 4 && nextCount < Math.ceil(previousCount / 2)) {
    return (
      `the blog API returned ${nextCount} posts where the last build had ${previousCount}. ` +
      `If that is intended (posts were unpublished), set BLOG_ALLOW_SHRINK=1 for one build. (rule 1)`
    );
  }
  return null;
}

/** The snapshot file, `{ generated, posts }` (journal-pipeline §2.4): its shape, every post and the count. */
export function snapshotProblems(value: unknown, rules: JournalRules): string[] {
  if (!isObj(value) || !("posts" in value)) return ["the snapshot is not { generated, posts } (rule 1)"];
  if (typeof value.generated !== "string") return ['the snapshot\'s "generated" note is not text (rule 1)'];
  const problems = validatePosts(value.posts, rules);
  if (problems.length) return problems;
  const count = countProblem((value.posts as unknown[]).length);
  return count ? [count] : [];
}

/* ── the editorial rules: warnings at build, errors in verify ─────────────────────────────────────── */

/** Words as the copy pages count them: markers dropped, an amount or the delivery line one word. */
function countWords(text: string): number {
  return text
    .replace(/\[\^\d+\]/g, " ")
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}{]/u.test(w)).length;
}

const occurrences = (text: string, phrase: string): number => (phrase === "" ? 0 : text.split(phrase).length - 1);

/** The editorial faults of valid posts, each naming its post and rule (§8.2 rows 7, 16, 19, 22, 23). The build prints
 *  them and goes on; `npm run verify` on the committed snapshot fails on any. Run `validatePosts` first. */
export function editorialWarnings(posts: readonly unknown[], rules: JournalRules): string[] {
  const list = posts.filter(isObj);
  const slugs = new Set(list.map((p) => p.slug));
  /* The <title> as the adapter derives it (journal-pipeline §4): the post's own, else the h1 and the site's name when
     that fits, else the h1 alone. */
  const metaTitleOf = (p: Obj) => {
    if (typeof p.metaTitle === "string") return p.metaTitle;
    const suffixed = `${String(p.title)}${META_SUFFIX}`;
    return suffixed.length <= META_TITLE_MAX ? suffixed : String(p.title);
  };
  const warnings: string[] = [];
  for (const post of list) {
    const warn = (what: string, rule: number) => warnings.push(`post "${String(post.slug)}": ${what} (rule ${rule})`);

    /* Rule 7: every source cited by a marker (D026). */
    const walk: Walk = { rules, problems: [], markers: [], texts: [], add: () => {} };
    const answer = isObj(post.answer) ? post.answer : null;
    if (answer) for (const key of ANSWER_KEYS) checkRichText(walk, `answer.${key}`, String(answer[key]), false);
    if (isObj(post.body) && Array.isArray(post.body.content)) post.body.content.forEach((b, i) => checkBlock(walk, b, `body[${i}]`));
    const cited = new Set(walk.markers.map((m) => m.n));
    const sources = Array.isArray(post.sources) ? post.sources : [];
    sources.forEach((_, i) => {
      if (!cited.has(i + 1)) warn(`source ${i + 1} is never cited by a [^${i + 1}] marker`, 7);
    });

    /* Rule 16: en-IN spelling, over every text field. */
    for (const key of ["title", "description", "heroAlt", "ageNote", "metaTitle", "cardTitle", "accent", "lead", "summary"]) {
      if (typeof post[key] === "string") walk.texts.push({ where: key, text: post[key] });
    }
    if (answer) for (const key of ANSWER_KEYS) walk.texts.push({ where: `answer.${key}`, text: String(answer[key]) });
    sources.forEach((s, i) => isObj(s) && walk.texts.push({ where: `sources[${i}].label`, text: String(s.label) }));
    for (const { where, text } of walk.texts) {
      const hits = rules.findBanned(text, ["spelling"]);
      if (hits.length) warn(`${where}: spelling ${hits.map((h) => `${h.id} "${h.match}"`).join(", ")}`, 16);
    }

    /* Rule 19: related is [] or three distinct published slugs, not its own; the ring fills the rest. */
    const related = Array.isArray(post.related) ? (post.related as string[]) : [];
    if (related.length !== 0 && related.length !== 3) {
      warn(`related lists ${related.length} guide${related.length === 1 ? "" : "s"}; it lists none or three, and the ring fills the rest`, 19);
    }
    related.forEach((slug, i) => {
      if (slug === post.slug) warn("related lists the post itself", 19);
      else if (related.indexOf(slug) !== i) warn(`related lists "${slug}" twice`, 19);
      else if (!slugs.has(slug)) warn(`related "${slug}" is not a published post`, 19);
    });

    /* Rule 22: the answer card, a question and a 40-60 word answer (architecture §9.5). */
    if (!answer) warn("no answer card (a question and a 40-60 word answer)", 22);
    else {
      if (!String(answer.question).trim().endsWith("?")) warn('the answer\'s question does not end with "?"', 22);
      const words = countWords(String(answer.text));
      if (words < ANSWER_MIN || words > ANSWER_MAX) warn(`the answer is ${words} words; it is ${ANSWER_MIN} to ${ANSWER_MAX}`, 22);
    }

    /* Rule 23: meta title and description lengths and uniqueness; the accent once in the title. */
    const metaTitle = metaTitleOf(post);
    if (metaTitle.length > META_TITLE_MAX) warn(`the meta title is ${metaTitle.length} characters; at most ${META_TITLE_MAX}`, 23);
    const description = String(post.description);
    if (description.length > DESCRIPTION_MAX) warn(`the description is ${description.length} characters; at most ${DESCRIPTION_MAX}`, 23);
    for (const other of list) {
      if (other === post) continue;
      if (metaTitleOf(other) === metaTitle) warn(`the meta title is also "${String(other.slug)}"'s`, 23);
      if (other.description === description) warn(`the description is also "${String(other.slug)}"'s`, 23);
    }
    if (typeof post.accent === "string" && occurrences(String(post.title), post.accent) !== 1) {
      warn(`the accent "${post.accent}" is not in the title once; the h1 shows no accent`, 23);
    }
  }
  return warnings;
}

/* ── order, compare, diff, write ──────────────────────────────────────────────────────────────────── */

/** The object with its keys in `rank` order, then any other key alphabetically; values mapped by `inner`. */
function ordered(value: Obj, rank: readonly string[], inner: (key: string, v: unknown) => unknown): Obj {
  const keys = Object.keys(value).sort((a, b) => {
    const ra = rank.indexOf(a);
    const rb = rank.indexOf(b);
    if (ra !== -1 || rb !== -1) return (ra === -1 ? Infinity : ra) - (rb === -1 ? Infinity : rb);
    return a < b ? -1 : a > b ? 1 : 0;
  });
  return Object.fromEntries(keys.map((k) => [k, inner(k, value[k])]));
}

/** Any value with every object's keys sorted, at every depth. */
function sortedDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedDeep);
  if (isObj(value)) return ordered(value, [], (_, v) => sortedDeep(v));
  return value;
}

function orderNode(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(orderNode);
  if (!isObj(value)) return value;
  const node = value;
  return ordered(node, NODE_KEYS, (key, v) => {
    if (key === "attrs" && isObj(v)) return ordered(v, ATTR_KEYS[String(node.type)] ?? [], (_, a) => sortedDeep(a));
    if (key === "content" || key === "marks") return orderNode(v);
    return sortedDeep(v);
  });
}

function orderPost(post: unknown): unknown {
  if (!isObj(post)) return post;
  return ordered(post, POST_KEYS, (key, v) => {
    if (key === "body") return orderNode(v);
    if (key === "sources" && Array.isArray(v)) return v.map((s) => (isObj(s) ? ordered(s, SOURCE_KEYS, (_, x) => sortedDeep(x)) : s));
    if (key === "answer" && isObj(v)) return ordered(v, ANSWER_KEYS, (_, x) => sortedDeep(x));
    return sortedDeep(v);
  });
}

const slugOf = (post: unknown): string => (isObj(post) ? String(post.slug) : "");

/** The posts as the snapshot holds them: sorted by slug, every key in the contract's order. Adds and drops nothing. */
export function normalisePosts(posts: readonly unknown[]): unknown[] {
  return [...posts].sort((a, b) => (slugOf(a) < slugOf(b) ? -1 : slugOf(a) > slugOf(b) ? 1 : 0)).map(orderPost);
}

/** A text that is equal for equal data, whatever the key order (main:tools/blog/sync.mjs:76-87). */
export function canonical(value: unknown): string {
  return JSON.stringify(sortedDeep(value));
}

export interface PostsDiff {
  /** Slugs in `after` only. */
  readonly added: string[];
  /** Slugs in `before` only. */
  readonly removed: string[];
  /** Posts in both whose data differs, with the top-level fields that differ. */
  readonly changed: { readonly slug: string; readonly fields: string[] }[];
}

/** Every difference between two journals, by post and field, data compared (the `--check` report). */
export function diffPosts(before: readonly unknown[], after: readonly unknown[]): PostsDiff {
  const index = (list: readonly unknown[]) => new Map(list.filter(isObj).map((p) => [String(p.slug), p]));
  const a = index(before);
  const b = index(after);
  const sorted = (keys: Iterable<string>) => [...keys].sort();
  const changed: { slug: string; fields: string[] }[] = [];
  for (const slug of sorted(a.keys())) {
    const x = a.get(slug)!;
    const y = b.get(slug);
    if (!y) continue;
    const keys = sorted(new Set([...Object.keys(x), ...Object.keys(y)]));
    const fields = keys.filter((k) => canonical(x[k]) !== canonical(y[k]));
    if (fields.length) changed.push({ slug, fields: normaliseFieldOrder(fields) });
  }
  return {
    added: sorted([...b.keys()].filter((s) => !a.has(s))),
    removed: sorted([...a.keys()].filter((s) => !b.has(s))),
    changed,
  };
}

function normaliseFieldOrder(fields: string[]): string[] {
  return Object.keys(ordered(Object.fromEntries(fields.map((f) => [f, 0])), POST_KEYS, (_, v) => v));
}

/** The snapshot file's text: `{ generated, posts }`, two-space JSON, a final newline, no timestamp (§2.4). */
export function serialiseSnapshot(posts: readonly unknown[], generated: string): string {
  return `${JSON.stringify({ generated, posts: normalisePosts(posts) }, null, 2)}\n`;
}
