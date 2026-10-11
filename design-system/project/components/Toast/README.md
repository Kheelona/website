# Toast

A short, inverted message that floats at the bottom of the screen after an action, with an optional Undo.

**Use it for:** confirmations ("Quiet hours saved"), reversible actions ("Conversation deleted. Undo"), and quick failures ("Couldn't save").

**Props:** `tone` (`"info"` | `"success"` | `"danger"`; sets the icon), `icon`, children (the message), `action` (`{ label, onClick }`), `onClose`. Put toasts inside a `kh-toast-region` element to pin them to the bottom centre.

**Rules**
- One line, under 50 characters. Show it for 4–6 seconds, or until dismissed if it has an action.
- One toast at a time. Never put critical information only in a toast.
- It's polite to screen readers (`aria-live="polite"`) and never steals focus.
