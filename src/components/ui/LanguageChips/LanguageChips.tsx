import { clsx } from "clsx";
import type { ReactNode } from "react";

/**
 * The DS LanguageChips (`kh-langs`, `kh-lang`): each language in its own script with its English name, and a note
 * under them (home.html fold 4, meet-kheelu.html fold 4). Each native name carries its `lang` so screen readers
 * pronounce it (DS rule; G-13); English, the page's own language, carries none. The list reset is the shared
 * composition class (`ks-list-reset`, the mockup's inline reset on Home and `mk-list-reset` on the product page).
 */
export interface LanguageChip {
  /** The name in its own script: "हिन्दी". */
  native: string;
  /** The English name under it: "Hindi"; omitted for English. */
  english?: string;
  /** BCP 47 code: "hi", "bn", "te", "ta", "kn", "es", "fr". */
  lang?: string;
  /** Announced for later: a dashed chip (DS `kh-lang--soon`). */
  soon?: boolean;
}

export interface LanguageChipsProps {
  languages: readonly LanguageChip[];
  /** "It can switch between them mid-sentence." */
  note?: ReactNode;
  /** The parent's composition class on the list, added after the DS classes. */
  className?: string;
}

export function LanguageChips({ languages, note, className }: LanguageChipsProps) {
  return (
    <>
      <ul className={clsx("kh-langs", "ks-list-reset", className)}>
        {languages.map((language) => (
          <li key={language.native} className={clsx("kh-lang", language.soon && "kh-lang--soon")}>
            <span className="kh-lang__native" lang={language.lang}>
              {language.native}
            </span>
            {language.english !== undefined && <span className="kh-lang__en">{language.english}</span>}
          </li>
        ))}
      </ul>
      {note !== undefined && <p className="kh-body-s">{note}</p>}
    </>
  );
}
