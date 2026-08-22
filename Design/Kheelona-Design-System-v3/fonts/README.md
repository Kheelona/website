# Fonts

Three families, all **SIL Open Font License 1.1**, downloaded from Google Fonts
(`github.com/google/fonts`). They are wired up in `../tokens/kheelona.css` via
`@font-face` — import that file and the families are available by name.

| Family | Files | Role |
|--------|-------|------|
| **Glory** | `Glory[wght].ttf`, `Glory-Italic[wght].ttf` | Primary — headings & display. Variable, weight 100–900. |
| **Instrument Sans** | `InstrumentSans[wdth,wght].ttf`, `InstrumentSans-Italic[wdth,wght].ttf` | Secondary — body, UI, captions. Variable, width + weight axes. |
| **Instrument Serif** | `InstrumentSerif-Regular.ttf`, `InstrumentSerif-Italic.ttf` | Editorial accent — italic section titles only. Static. |

## Licensing — read before redistributing

The OFL permits use, embedding, modification, and redistribution, including
commercially. Two conditions matter in practice:

1. **Keep the licence with the fonts.** `OFL-Glory.txt`,
   `OFL-InstrumentSans.txt`, and `OFL-InstrumentSerif.txt` must travel with the
   TTFs in any copy of this library you pass on.
2. **Never sell the fonts by themselves**, and if you modify a font, rename it —
   a modified font may not keep the original family name.

Embedding them in a website, app, PDF, or print artwork is fine and needs no
attribution in the artwork itself.

## Web use

The TTFs here are the full variable originals, chosen for fidelity over
file size. For production web delivery, subset and convert to WOFF2 first
(e.g. `fonttools`/`glyphhanger`) — expect roughly a 70–80% size reduction —
and point the `@font-face` `src` in your build at those instead. Keep these
originals as the archival copy.
