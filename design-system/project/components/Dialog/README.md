# Dialog and BottomSheet

A modal window built on the native `<dialog>` element: focus moves inside, Escape and the close button close it, and the page behind is dimmed with the `scrim`.

**Use it for:** confirming destructive actions ("Delete today's conversation?"), short choices that need full attention. `BottomSheet` is the phone version that slides from the bottom, with stacked full-width buttons.

**Props:** `open`, `onClose`, `title`, children (body), `actions` (`{ label, variant?, onClick?, icon? }`; the last one is `primary` by default), `sheet` (bottom-sheet style), `inline` (render in the page, for docs and screenshots). `BottomSheet` takes the same props.

**Rules**
- The title is a question or a clear statement. The body says what will happen, including whether it can be undone.
- Two actions at most: the safe choice first ("Cancel"), the main action last. A destructive final action uses `variant: "danger"`, the only place danger becomes a red fill.
- Never open a dialog on page load or to sell something.
- On phones, use `BottomSheet` for choices and keep a visible close or cancel.
