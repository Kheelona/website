"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { KHEELU_LANGUAGES } from "@/config/site";

/* Each language in its own script, tagged so a screen reader switches voice.
   Keyed by the English name in KHEELU_LANGUAGES; a language added there
   without an entry here still renders, in English. */
const NATIVE: Record<string, { name: string; lang: string }> = {
  English: { name: "English", lang: "en" },
  Hindi: { name: "हिन्दी", lang: "hi" },
  Bengali: { name: "বাংলা", lang: "bn" },
  Telugu: { name: "తెలుగు", lang: "te" },
  Tamil: { name: "தமிழ்", lang: "ta" },
  Kannada: { name: "ಕನ್ನಡ", lang: "kn" },
  Spanish: { name: "Español", lang: "es" },
  French: { name: "Français", lang: "fr" },
};

const APP_SCREENS = ["Today", "Talk log", "Controls"] as const;

/** "Two more reasons" (the mockup's languages + parent-app pair, redesign
 *  2026-10). On phones a tab row picks one card; from 900px both sit side by
 *  side and the tabs disappear.
 *
 *  The mockup's language chips played a 20-second clip each. No clips exist
 *  (the audio demos were removed on 2026-09-19, §8.37-i), so the chips are a
 *  plain list here rather than buttons that do nothing. */
export function TwoReasons() {
  const [card, setCard] = useState(0);

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label="Reasons" className="kh-tabs grid-cols-2 min-[900px]:hidden">
        {["Home languages", "The parent app"].map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={card === i}
            onClick={() => setCard(i)}
            className="kh-tab aria-[pressed=true]:border-ink aria-[pressed=true]:bg-ink aria-[pressed=true]:text-bg"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 min-[900px]:grid-cols-2">
        <article
          className={cn(
            "flex-col gap-3.5 rounded-[26px] border border-line bg-surface p-[22px] min-[900px]:flex",
            card === 0 ? "flex" : "hidden",
          )}
        >
          <h3 className="kh-h3">Speaks the way your family speaks</h3>
          <p className="kh-body">
            Kheelu can switch mid-sentence, the way Indian families talk. Your child gets more
            chances to use the languages you speak at home, including your parents&apos;.
          </p>
          <ul aria-label="Languages" className="flex flex-wrap gap-1.5">
            {KHEELU_LANGUAGES.map((l) => {
              const n = NATIVE[l] ?? { name: l, lang: "en" };
              return (
                <li
                  key={l}
                  lang={n.lang}
                  className="flex min-h-11 items-center rounded-full border border-line bg-bg px-3.5 text-[15px] font-semibold text-ink-head"
                >
                  {n.name}
                </li>
              );
            })}
          </ul>
          <p className="kh-note">
            {KHEELU_LANGUAGES.length} at launch, up to 10.
          </p>
        </article>

        <article
          className={cn(
            "flex-col gap-3.5 rounded-[26px] border border-line bg-surface p-[22px] min-[900px]:flex",
            card === 1 ? "flex" : "hidden",
          )}
        >
          <h3 className="kh-h3">See the learning, not just the play</h3>
          <p className="kh-body">
            The parent app shows what your child talked about, every conversation word for word,
            and puts you in control.
          </p>
          <AppMock />
        </article>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-line bg-surface px-3.5 py-3 text-[15px] leading-[1.45] text-ink-head">
      <b className="mb-0.5 block text-[13px] text-label">{label}</b>
      {children}
    </div>
  );
}

function Switch({ label, initial }: { label: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex min-h-[52px] items-center justify-between gap-3 rounded-[14px] border border-line bg-surface px-3.5 py-1.5 text-[15px] font-semibold text-ink-head">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative h-8 w-[52px] shrink-0 rounded-full transition-colors",
          on ? "bg-green" : "bg-line",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform",
            on && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

/** Sample screens of the parent app, with sample data, labelled as such.
 *  Every feature shown is one the site already publishes: the daily summary,
 *  new words counted, one thing to do together, the word-for-word log with
 *  one-tap delete, quiet hours, languages and topic controls. */
function AppMock() {
  const [screen, setScreen] = useState(0);
  const [deleted, setDeleted] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-[22px] border border-line bg-bg p-3.5">
      <div role="group" aria-label="App screens" className="kh-seg self-start">
        {APP_SCREENS.map((s, i) => (
          <button key={s} type="button" aria-pressed={screen === i} onClick={() => setScreen(i)}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex min-h-[210px] flex-col gap-2.5">
        {screen === 0 ? (
          <>
            <Row label="Asked about today">The moon, monsoon clouds, why we sleep</Row>
            <Row label="New word tried">&ldquo;enormous&rdquo;, used 3 times</Row>
            <Row label="Try together tonight">Ask what the moon looks like from the balcony</Row>
          </>
        ) : null}
        {screen === 1 ? (
          deleted ? (
            <p className="kh-note" role="status">
              Deleted. In the app, this removes the conversation for good.
            </p>
          ) : (
            <>
              <Row label="4:12 pm · Your child">Why is the moon following us?</Row>
              <Row label="4:12 pm · Kheelu">
                It is so far away that it seems to follow us. Where are you going tonight?
              </Row>
              <button
                type="button"
                onClick={() => setDeleted(true)}
                className="inline-flex min-h-11 items-center self-start rounded-full border border-ink-head px-4 text-[14px] font-semibold text-ink-head"
              >
                Delete this conversation
              </button>
            </>
          )
        ) : null}
        {screen === 2 ? (
          <>
            <Switch label="Quiet hours (8 pm to 7 am)" initial />
            <Switch label="Hindi" initial />
            <Switch label="Tricky questions wait for me" initial={false} />
          </>
        ) : null}
      </div>
      <span className="kh-note">Sample screens with sample data.</span>
    </div>
  );
}
