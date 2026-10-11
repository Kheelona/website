# Badge

A small pill that labels a status or a category, in soft (cream with a hairline) or solid style.

**Use it for:** "New", "3 new", language labels, "Coming soon", device status ("Connected", "Battery low", "Offline").

**Props:** `tone` (`"blue"` default | `"chilli"` | `"sun"` | `"success"` | `"warning"` | `"danger"` | `"neutral"`), `variant` (`"soft"` default | `"solid"`), `icon`, children (1–3 words).

**Rules**
- Status badges always have an icon and a word ("Battery low"), never colour alone.
- Warnings are always a Sunshine badge with ink text. Solid sun is also for "New" and small counts. Chilli badges belong to offers ("First 500"), never to errors.
- Badges are labels, not buttons. For clickable choices use `Tag`.
