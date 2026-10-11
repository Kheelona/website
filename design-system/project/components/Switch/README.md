# Switch

A labelled on/off row with the switch at the end. It changes a setting immediately (`role="switch"`).

**Use it for:** quiet hours, story-only mode, daily summaries: any setting that applies the moment it's flipped.

**Props:** `label`, `hint`, `checked` / `defaultChecked`, `disabled`, `onChange`, `id`.

**Rules**
- On is Kheelu Blue (`primary`), never green or chilli.
- The label names the setting, not the action ("Quiet hours", not "Turn on quiet hours"). The hint says exactly what happens.
- Settings that can't be changed (the wake word) show as disabled with a hint explaining why.
- For grouped settings with icons, use `ParentControl`.
