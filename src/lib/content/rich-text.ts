import type { Offer, Placeholder, PriceKey } from "@/content/types";
import { isSitePath } from "@/lib/links";
import { parsePlaceholderToken, PLACEHOLDER_TOKEN_HINT, placeholderText } from "./placeholder";

/**
 * The parser for the one inline syntax of content strings (ADR-004, architecture
 * §6.2). It turns a string into nodes that `ui/RichText` renders and that
 * src/lib/content/plain-text.ts turns into the exact visible text, so a page, its
 * JSON-LD, its meta description and llms.txt always say the same words.
 *
 *   {hand:…}      hand-lettered accent (one per headline, a DS rule)
 *   {mark:…}      marked word
 *   {nowrap:…}    a phrase that never breaks across lines
 *   [label](href) link: /path or #anchor (internal), https://, mailto:, tel:
 *   [^n]          source marker, linked to the section's source n
 *   {price:key}   an amount from the offer: token, balance, headline, full, mrp
 *   {delivery}    the delivery line
 *   the ph token  a placeholder (syntax and marker live in ./placeholder.ts)
 *
 * Accents, no-wrap phrases and link labels may hold other tokens; a link never
 * holds a link or a source marker (both are links). Anything else is refused with
 * a message that says what and where, so a typo fails the build instead of
 * reaching a parent.
 */

export const PRICE_KEYS = ["token", "balance", "headline", "full", "mrp"] as const satisfies readonly PriceKey[];

export interface TextNode {
  readonly kind: "text";
  readonly text: string;
}
export interface WrapNode {
  readonly kind: "hand" | "mark" | "nowrap";
  readonly children: readonly RichNode[];
}
export interface LinkNode {
  readonly kind: "link";
  readonly href: string;
  /** A site path or in-page anchor: render with next/link (or a plain anchor). */
  readonly internal: boolean;
  readonly children: readonly RichNode[];
}
export interface SourceNode {
  readonly kind: "source";
  readonly n: number;
}
export interface PriceNode {
  readonly kind: "price";
  readonly key: PriceKey;
}
export interface DeliveryNode {
  readonly kind: "delivery";
}

export type LeafNode = TextNode | SourceNode | PriceNode | DeliveryNode | Placeholder;
export type RichNode = LeafNode | WrapNode | LinkNode;

/** A content string that does not follow the syntax. */
export class RichTextError extends Error {
  override name = "RichTextError";
}

const WRAPS = ["hand", "mark", "nowrap"] as const;
type WrapKind = (typeof WRAPS)[number];
const PLACEHOLDER_NAME = "ph";

const KNOWN_TOKENS = [
  ...WRAPS.map((name) => `{${name}:…}`),
  "{price:…}",
  "{delivery}",
  PLACEHOLDER_TOKEN_HINT,
  "[label](href)",
  "[^n]",
].join(", ");

/** What a site path (`isSitePath`, src/lib/links.ts: one slash, never a second
 *  slash or a backslash after it) may hold in content: letters, digits and
 *  - . _ ~ / % ? = &, then an optional #anchor; never a quote or markup. */
const SITE_PATH_CHARS = /^\/[A-Za-z0-9._~/%?=&-]*(#[A-Za-z0-9_-]+)?$/;
/** An in-page anchor, as the pages' section ids are written. */
const ANCHOR = /^#[A-Za-z0-9_-]+$/;

function isWrap(name: string): name is WrapKind {
  return (WRAPS as readonly string[]).includes(name);
}

function isPriceKey(key: string): key is PriceKey {
  return (PRICE_KEYS as readonly string[]).includes(key);
}

class Parser {
  private i = 0;

  constructor(private readonly src: string) {}

  parse(): RichNode[] {
    return this.sequence(null, false);
  }

  private fail(message: string, at: number): never {
    throw new RichTextError(`${message} at ${at} in ${JSON.stringify(this.src)}`);
  }

  /** Reads until `stop` (left unread for the caller) or the end of the string. */
  private sequence(stop: "}" | "]" | null, inLink: boolean): RichNode[] {
    const nodes: RichNode[] = [];
    let text = "";
    const flush = () => {
      if (text !== "") nodes.push({ kind: "text", text });
      text = "";
    };
    while (this.i < this.src.length) {
      const c = this.src[this.i];
      if (c === stop) break;
      if (c === "{" || c === "[") {
        flush();
        nodes.push(c === "{" ? this.brace(inLink) : this.bracket(inLink));
      } else if (c === "}" || c === "]") {
        this.fail(`Unmatched ${c}`, this.i);
      } else {
        text += c;
        this.i += 1;
      }
    }
    flush();
    return nodes;
  }

  private brace(inLink: boolean): RichNode {
    const open = this.i;
    this.i += 1;
    const name = /^[a-z]+/.exec(this.src.slice(this.i))?.[0];
    if (name === undefined) this.fail(`Expected a token (${KNOWN_TOKENS}) after {`, open);
    this.i += name.length;
    const next = this.src[this.i];

    if (name === "delivery") {
      if (next !== "}") this.fail("The {delivery} token takes no body: write {delivery}", open);
      this.i += 1;
      return { kind: "delivery" };
    }
    if (!isWrap(name) && name !== "price" && name !== PLACEHOLDER_NAME) {
      this.fail(`Unknown token {${name}…}; the known tokens are ${KNOWN_TOKENS}`, open);
    }
    if (next !== ":") this.fail(`The ${name} token needs a body: {${name}:…}`, open);
    this.i += 1;

    if (isWrap(name)) {
      const children = this.sequence("}", inLink);
      if (this.src[this.i] !== "}") this.fail(`The {${name}:…} token is not closed`, open);
      this.i += 1;
      if (children.length === 0) this.fail(`The {${name}:…} token is empty`, open);
      return { kind: name, children };
    }

    const close = this.src.indexOf("}", this.i);
    if (close === -1) this.fail(`The {${name}:…} token is not closed`, open);
    const body = this.src.slice(this.i, close);
    if (body.includes("{")) this.fail(`The {${name}:…} token cannot hold another token`, open);
    this.i = close + 1;

    if (name === "price") {
      if (!isPriceKey(body)) {
        this.fail(`Unknown price {price:${body}}; use one of: ${PRICE_KEYS.join(", ")}`, open);
      }
      return { kind: "price", key: body };
    }
    try {
      return parsePlaceholderToken(body);
    } catch (error) {
      return this.fail((error as Error).message.replace(/\.$/, ""), open);
    }
  }

  private bracket(inLink: boolean): RichNode {
    const open = this.i;
    if (this.src[this.i + 1] === "^") {
      if (inLink) this.fail("A source marker cannot sit inside a link", open);
      const marker = /^\[\^([1-9]\d*)\]/.exec(this.src.slice(this.i));
      if (marker === null) this.fail("A source marker is [^n], with n counting from 1", open);
      this.i += marker[0].length;
      return { kind: "source", n: Number(marker[1]) };
    }
    if (inLink) this.fail("A link cannot sit inside a link", open);
    if (this.src.startsWith("PLACEHOLDER", this.i + 1)) {
      this.fail(`Write a placeholder as ${PLACEHOLDER_TOKEN_HINT}, not as typed marker text`, open);
    }
    this.i += 1;
    const children = this.sequence("]", true);
    if (this.src[this.i] !== "]") this.fail("A link label is not closed", open);
    this.i += 1;
    if (this.src[this.i] !== "(") {
      this.fail("A [ must start a link, [label](href), or a source marker, [^n]", open);
    }
    if (children.length === 0) this.fail("A link label is empty", open);
    const href = this.href(open);
    return { kind: "link", href, internal: isSitePath(href) || href.startsWith("#"), children };
  }

  /** Reads `(href)`, allowing balanced parentheses inside the address. */
  private href(open: number): string {
    this.i += 1;
    const start = this.i;
    let depth = 0;
    for (; this.i < this.src.length; this.i += 1) {
      const c = this.src[this.i];
      if (c === ")" && depth === 0) break;
      if (c === "(") depth += 1;
      if (c === ")") depth -= 1;
      if (/\s/.test(c)) this.fail("A link address cannot contain a space", this.i);
    }
    if (this.i >= this.src.length) this.fail("A link address is not closed", open);
    const href = this.src.slice(start, this.i);
    this.i += 1;
    this.checkHref(href, open);
    return href;
  }

  private checkHref(href: string, open: number): void {
    if (href === "") this.fail("A link address is empty", open);
    if (href.startsWith("/")) {
      const path = href.split(/[?#]/, 1)[0];
      if (isSitePath(href) && SITE_PATH_CHARS.test(href) && !/\.html$/i.test(path)) return;
      this.fail(`Link to a site path such as /refund, not "${href}"`, open);
    }
    if (href.startsWith("#")) {
      if (ANCHOR.test(href)) return;
      this.fail(`An in-page anchor is # then letters, digits, - or _, not "${href}"`, open);
    }
    if (/^https:\/\/[^/\s]/.test(href) || /^(mailto|tel):./.test(href)) return;
    if (/^http:/i.test(href)) this.fail(`Use https:// for the link to ${href}`, open);
    if (!/^[a-z][a-z0-9+.-]*:/i.test(href)) {
      this.fail(`Link to a site path such as /refund, not "${href}"`, open);
    }
    this.fail(`Unsupported link address "${href}"; use /path, #anchor, https://, mailto: or tel:`, open);
  }
}

/** Parses a content string into nodes. Throws a RichTextError on any syntax error. */
export function parseRichText(source: string): RichNode[] {
  return new Parser(source).parse();
}

function requireOffer(offer: Offer | undefined, token: string): Offer {
  if (offer === undefined) {
    throw new RichTextError(`${token} needs the offer to render; pass the page's offer`);
  }
  return offer;
}

/** The visible text of one leaf, the same for the renderer and the serialiser. */
export function leafText(node: LeafNode, offer: Offer | undefined): string {
  switch (node.kind) {
    case "text":
      return node.text;
    case "source":
      return `[${node.n}]`;
    case "placeholder":
      return placeholderText(node);
    case "price":
      return requireOffer(offer, `{price:${node.key}}`).prices[node.key];
    case "delivery":
      return requireOffer(offer, "{delivery}").delivery;
  }
}
