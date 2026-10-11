# ProgressBar and Spinner

`ProgressBar` shows how far a known task has got. `Spinner` shows that something is happening when you can't say how long it will take.

**Use it for:** setup steps ("Step 3 of 4"), downloads (Story mode), the offer counter; spinners for loading lists and inside buttons (`Button loading`).

**Props:**
- `ProgressBar`: `value`, `max` (default 100), `label`, `showValue`, `valueText` ("Step 3 of 4"), `tone` (kept for compatibility; it no longer changes the bar).
- `Spinner`: `size` (px, default 24), `label` (announced to screen readers).

**Rules**
- Prefer a progress bar whenever you know the total. Never fake progress.
- Bars are always `primary` (Kheelu Blue). It is light against the track (2.4:1), so always write the value out too: a `label` with `showValue`, or `valueText`.
- The offer counter only uses live inventory numbers.
- With reduced motion the spinner slows down instead of stopping, so it still shows activity.
