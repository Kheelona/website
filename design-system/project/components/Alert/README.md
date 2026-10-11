# Alert

An inline notice inside the page, with an icon, a title, one or two sentences and an optional action.

**Use it for:** device status in the app ("Kheelu is updating"), form-level errors, and important notes in setup.

**Props:** `tone` (`"info"`, an ink icon (Kheelu Blue in Bedtime) | `"success"` | `"warning"` | `"danger"`), `title`, children (body), `action` (`{ label, onClick?, href? }`), `onClose` (adds a dismiss button), `icon` (override).

**Rules**
- Lead with what happened, then what to do: "Kheelu can't reach your Wi-Fi. Story mode still works."
- `danger` is announced to screen readers immediately (`role="alert"`). Use it only for problems that need action.
- Never use alerts for marketing. For offers, use `AnnouncementBar`.
