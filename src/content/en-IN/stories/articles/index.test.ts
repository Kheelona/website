import { describe, expect, it } from "vitest";
import { toPlainText } from "@/lib/content/plain-text";
import { findBanned } from "../../../../../test/guards/banned-phrases.data";
import { navigation } from "../../navigation";
import { ARTICLE_SLUGS } from "../../routes";
import { TRUST_COMPACT } from "../../trust";
import * as journal from "../journal";
import { topics } from "../topics";
import { articlePageCopy, articles, getArticle, PLAIN_CLOSE_ART } from "./index";

/* The article registry (task 4.2; wave-3 close ruling; ADR-014, task 8b.2e): since 8b.2e the journal registry
 * (stories/journal.ts: the committed snapshot of the dashboard's posts, through the adapter), re-exported here beside the
 * words and the close every article page shares (story-*.html). The stories route, the hub and the sticky-bar paths read
 * this one list, so a new article is a published post, never a code edit. */

describe("the article registry", () => {
  it("lists every article of the URL plan once, under its own slug, and nothing else", () => {
    expect(Object.keys(articles).sort()).toEqual([...ARTICLE_SLUGS].sort());
    for (const slug of ARTICLE_SLUGS) expect(articles[slug].slug, slug).toBe(slug);
  });

  /* Until 8b.2e: "holds the very object each article module exports". The modules went once the snapshot was the source. */
  it("is the journal registry itself: the very articles and finder journal.ts adapts from the snapshot", () => {
    expect(articles).toBe(journal.articles);
    expect(getArticle).toBe(journal.getArticle);
  });

  it("finds an article by its URL slug, and nothing outside the registry", () => {
    expect(getArticle("talking-toys-and-late-talkers")).toBe(articles["talking-toys-and-late-talkers"]);
    /* The last: the 3-6-9-12 article, which left the journal (D053; its URL redirects to the hub's screen-time topic). */
    for (const slug of ["no-such-guide", "constructor", "__proto__", "toString", "", "screen-time-rules-parents-swear-by"]) {
      expect(getArticle(slug), slug).toBeUndefined();
    }
  });
});

describe("the words every article page shares (story-*.html)", () => {
  it("leads the crumbs with the hub, named and linked as the nav links it", () => {
    expect(articlePageCopy.crumbs.hub).toEqual({ name: "Stories", path: "/stories" });
    expect(navigation.main).toContainEqual({ label: articlePageCopy.crumbs.hub.name, href: articlePageCopy.crumbs.hub.path });
    expect(articlePageCopy.crumbs.label).toBe("Breadcrumb");
  });

  it("words the byline as the approved heads print it", () => {
    expect(articlePageCopy.byline.published).toBe("First published");
    expect(articlePageCopy.byline.readTime(4)).toBe("4 min read");
  });

  it("names the notes and their markers, and the related band, as the approved articles do", () => {
    expect(articlePageCopy.sources).toEqual({ title: "Sources", marker: "Source" });
    expect(articlePageCopy.related).toEqual({ title: "Related guides" });
  });

  /* Task Q2.15 (the consistency review's CON-6, CON-7): the close labelled as every selling close, "Pre-order", and its
     ghost link worded as /team's and /contact's, "See how Kheelu works", which reads clearly out of context. */
  it("closes with the journal close of the hub: heading, finale button, compact trust line, help line, the ghost link", () => {
    const { close } = articlePageCopy;
    expect(close.heading).toEqual({
      eyebrow: "Pre-order",
      title: "A toy that {hand:asks back.}",
      lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.",
    });
    expect(close.cta).toBe("finale");
    expect(close.trust).toBe(TRUST_COMPACT);
    expect(close.secondary).toEqual({ label: "See how Kheelu works", href: "/products/kheelu", variant: "ghost", iconEnd: "arrow-right" });
    expect(close.art.tone).toBe("sun");
    expect(close.art.layers.flatMap((layer) => ("doodle" in layer ? [layer.doodle.name] : []))).toEqual(["ink-heart"]);
  });

  /* The selling update (task Q2.12; the D2C plan v2 §7, the rebuild's topic rule): the close's heading by the article's
     topic. The learning topic and the hub keep the shared heading above (their guides cite adult-child talk research, so a
     close about more back-and-forth would make Kheelu the caring adult: source verification C08, the CMO's F1); the
     talking guides keep the keep-reading close, no button (D054 item 16; §13 item 5 (a)). */
  it("words the close by topic: screen time and AI toys and safety their own, the learning topic the shared one, the talking topic none", () => {
    const { topicHeadings } = articlePageCopy.close;
    expect(topicHeadings).toEqual({
      "screen-time": {
        eyebrow: "Pre-order",
        title: "A toy that talks, {hand:with no screen.}",
        lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back, and each Kheelu has a daily limit on how long it talks.",
      },
      "ai-and-safety": {
        eyebrow: "Pre-order",
        title: "A toy you can {hand:check.}",
        lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It has no camera and can’t browse the internet, and you can read every conversation in the parent app.",
      },
    });
    expect(Object.keys(topicHeadings).every((id) => topics.find((t) => t.id === id)?.close === "journal")).toBe(true);
    for (const { title, lead } of Object.values(topicHeadings)) {
      expect(findBanned(`${toPlainText(title)}\n${toPlainText(lead)}`)).toEqual([]);
      expect(title.match(/\{(?:hand|mark):/g)).toHaveLength(1);
    }
    /* The daily limit as the founder confirmed it (D065 item 5, G28): never one a parent sets. */
    expect(topicHeadings["screen-time"].lead).not.toMatch(/you set|parent sets|set a|set the/i);
  });

  it("keeps the safety and data guides' close art plain, no doodle (DS 02-imagery: no imagination layer on safety)", () => {
    expect(PLAIN_CLOSE_ART).toEqual([
      "what-to-look-for-in-a-safe-ai-toy",
      "questions-parents-ask-about-ai-toys",
      "should-kids-use-ai",
      "ai-toys-and-indias-data-law",
    ]);
  });

  it("ends the keep-reading close on the hub (B5)", () => {
    expect(articlePageCopy.keep).toEqual({
      title: "Keep reading",
      action: { label: "All guides for parents of 3 to 7 year olds", href: "/stories" },
    });
  });

  /* A journal post may embed a video (D057 item 1; journal-pipeline §7): its play button is named "Play video: <title>",
     the play word from here (stories.md, "Changes after approval (task 8b.2d)"). */
  it("words a video's play button with the play word before the video's own title", () => {
    expect(articlePageCopy.videoLabel).toBe("Play video:");
  });
});
