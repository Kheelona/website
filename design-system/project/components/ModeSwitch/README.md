# ModeSwitch

A segmented control for Kheelu's three modes: AI mode, Story mode and Bluetooth.

**Use it for:** the parent app's device screen, and explaining the modes on the website.

**Props:** `modes` (`{ id, label, icon }`; defaults to AI mode, Story mode, Bluetooth), `value` / `defaultValue`, `onChange`, `label`.

**Rules**
- The selected mode is filled `primary`: Kheelu Blue with white text, in both themes. Each option is a radio button with an icon and a word.
- Keep labels to the official mode names.
