# LanguageChips

Each home language in its own script with its English name, plus a dashed "coming" chip.

**Use it for:** the languages section, the hero trust line, the language settings in the app.

**Props:** `languages` (an array of `{ native, english, lang?, soon? }`). It defaults to the eight announced languages plus "+2 more at launch". `Kheelona.LANGUAGES` holds the default list.

**Rules**
- Only list announced languages as available. Unannounced ones are `soon: true` or not shown at all.
- Native names use the Baloo sister families (Baloo Da 2, Baloo Tammudu 2, Baloo Thambi 2, Baloo Tamma 2 from Google Fonts). Load them on pages that show these scripts.
- Set `lang` on each chip (`hi`, `bn`, `te`, `ta`, `kn`, `es`, `fr`) so screen readers pronounce them.
