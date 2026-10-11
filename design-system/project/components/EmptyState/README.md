# EmptyState

What a screen shows when there's nothing in it yet: an icon in a soft circle, a title, one helpful sentence and the next step.

**Use it for:** no conversations yet, no search results, no saved stories.

**Props:** `icon`, `tone` (`"sun"` default | `"blue"` | `"chilli"`), `title`, children (one sentence), `action` (`{ label, variant?, href?, onClick? }`; default `primary`).

**Rules**
- Say what will appear here and how to get it: "When Tara talks to Kheelu, you'll see every conversation here."
- Warm, never blaming ("No stories about 'dinos' yet", not "Invalid search").
- One action at most.
