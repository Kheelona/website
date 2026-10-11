# Menu

A button that opens a short list of actions, with keyboard support: arrow keys, Home and End move through items, Escape closes and returns focus, and clicking outside closes it.

**Use it for:** settings shortcuts ("Tara's Kheelu"), "more" menus on list rows and story cards, and sort and filter choices.

**Props:** `label` (button text) or `icon` + `ariaLabel` (icon-only trigger), `variant` and `size` (button styles), `items` (`{ label, icon?, hint?, href?, onSelect?, danger?, disabled?, divider? }`), `align` (`"end"` to open from the right edge), `defaultOpen`.

**Rules**
- Up to 7 items. Group them with dividers, and put destructive items last in `danger` red.
- Items are actions or links, written as verbs ("Share today's summary"). For choosing a value, use `Select` or `RadioGroup`.
- Use `hint` for the current value ("8:30 pm") so parents don't have to open the setting.
- Never hide the only way to do something important inside a menu.
