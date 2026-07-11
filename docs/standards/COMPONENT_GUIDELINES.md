# Component Creation Guidelines — Reuse, Compose, Systematize

> A reusable, project-agnostic playbook for **what to do before and while building a new component.**
> Core idea: **never build in isolation.** Before writing a new component, check what already exists,
> decide whether to reuse / extend / compose, and always build on the design system — so any project
> using this guide produces consistent, non-duplicated UI.
> Use alongside the companion `PROJECT_STRUCTURE.md`.

---

## 1. The golden rule

> **Search before you build. Compose before you create. Extend before you fork.**

Most "new" components aren't new. They're a variant, a combination, or a slight extension of something already in the codebase. Duplicating UI is the fastest way to a divergent, unmaintainable interface. Every new component you *avoid* creating is one you never have to maintain, test, document, or keep in visual sync.

The atomic-design test to internalize:

> *"Is this component generic enough to avoid specificity and/or repeated code in whatever context it's used?"*

If a variation of it could plausibly appear elsewhere, it should be reused — not re-invented.

---

## 2. The pre-build workflow (do this every time)

Follow these steps **in order** before writing a single line of a new component.

### Step 1 — Search the existing component library
Look for anything that already does part of the job. Search by:
- **Name & synonyms** — `Modal` / `Dialog` / `Overlay`; `Dropdown` / `Menu` / `Select`.
- **Role** — search atoms, molecules, organisms folders for the *function* you need.
- **The design system / UI kit** — `shadcn/ui`, MUI, Chakra, Radix, your internal kit. Check its catalog first.
- **Storybook** — the living catalog. Browse it; the component you need is often already documented there.

> Tip: keep a component index (Storybook or a `COMPONENTS.md`) so discovery is fast. A component nobody can find gets rebuilt.

### Step 2 — Classify what you found
For each candidate, decide which bucket it lands in:

| Situation | Action |
|-----------|--------|
| An existing component does the job as-is | **Reuse it.** Stop here. |
| It does the job but needs a new visual/behavioral variation | **Extend via props** (add a `variant`, `size`, etc.) |
| Several existing components together do the job | **Compose them** into a new molecule/organism |
| Nothing fits, but atoms exist to build from | **Build new**, but only from existing atoms/tokens |
| Truly nothing exists at any level | **Build a new atom**, token-driven, then compose upward |

### Step 3 — Decide the atomic level
Where does the new thing belong? (See `PROJECT_STRUCTURE.md §4`.)
- Indivisible UI primitive → **atom**
- A few atoms as one unit → **molecule**
- A whole interface section → **organism**
- Tied to exactly one feature/route → colocate it (`features/x/components` or route `_components/`), don't pollute the global library.

### Step 4 — Confirm it's token-driven
Never hard-code colors, spacing, radius, typography. Use design tokens (semantic tier) so the component inherits theming automatically. If you find yourself typing a hex code or a pixel value, stop — reference a token instead, or add one.

### Step 5 — Only now, build.

---

## 3. Reuse vs. Extend vs. Compose vs. Create — the decision tree

```
Need a component
      │
      ▼
Does one already exist that does this?  ──Yes──► Use it as-is. ✅ DONE
      │ No
      ▼
Is it basically an existing component with a
different look/behavior?                ──Yes──► Add a prop/variant to the
      │ No                                       existing component. ✅
      ▼
Can I assemble it from existing
components?                             ──Yes──► COMPOSE a new molecule/organism
      │ No                                       from existing parts. ✅
      ▼
Do the needed atoms exist?              ──Yes──► Build new, using those atoms
      │ No                                       + tokens only. ✅
      ▼
Build a new atom (token-driven),
then compose upward. ✅
```

---

## 4. How to combine components (composition patterns)

Composition is how you build complex UI *without* new low-level code. Prefer these patterns over inventing bespoke components.

### 4.1 Composition by nesting (atomic build-up)
Assemble bigger components from smaller ones. This is the default.

```
Atoms:      Input   Label   Button   Icon
              │       │        │       │
Molecule:   FormField ( Label + Input + error )     SearchField ( Input + Button )
              │                                         │
Organism:   SignupForm ( multiple FormFields + Button )
              │
Template:   AuthTemplate ( arranges SignupForm in a layout )
```

Rule of thumb: **atoms don't set their own outer margins/positioning** — the parent (molecule/organism) owns layout. This keeps atoms reusable in any context.

### 4.2 Children / slot composition
Make containers agnostic about their contents by passing `children` (or named slots). One `Card` serves infinite use cases:

```tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>{anything}</Card.Body>
  <Card.Footer><Button>Action</Button></Card.Footer>
</Card>
```

Prefer this over a `Card` with 20 props trying to anticipate every layout.

### 4.3 Compound components
Related pieces that share implicit state (e.g. `Tabs` + `Tab` + `TabPanel`). Expose them together so consumers compose freely while state stays coordinated internally.

### 4.4 Variant-driven components
Instead of `PrimaryButton`, `SecondaryButton`, `DangerButton` (three components), build **one** `Button` with a `variant` prop mapped to tokens:

```tsx
type ButtonProps = {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
};
```

One component, many looks — all driven by design tokens.

### 4.5 Wrapper / extension (don't fork)
Need a small behavioral add-on? Wrap the existing component rather than copy-pasting its code:

```tsx
// ✅ Extend by wrapping
const SubmitButton = (props) => <Button variant="primary" type="submit" {...props} />;

// ❌ Don't duplicate Button's internals into a new file
```

---

## 5. Build on the design system, always

A component is only reusable if it's consistent. Consistency comes from the design system, not from each developer's judgment.

### 5.1 The three-tier token model
Every visual value flows through tokens so one change ripples everywhere:

| Tier | Role | Used directly? | Example |
|------|------|----------------|---------|
| **Primitive** | Raw values (the full palette/scale) | ❌ reference only | `--blue-500: #3b82f6` |
| **Semantic** | Meaning / intent | ✅ this is what components use | `--color-bg-brand: var(--blue-500)` |
| **Component** | Per-component overrides (optional, for scale/theming) | ✅ inside that component | `--button-bg: var(--color-bg-brand)` |

Guidance:
- Components consume **semantic** tokens by default.
- Introduce **component tokens** only when a component repeats enough that centralizing its values prevents drift (e.g. 10 dialog variants sharing one `--dialog-radius`).
- Don't over-engineer: a single-theme app may need only primitive + semantic tiers.

### 5.2 When to create a new token vs reuse one
- Reuse an existing semantic token whenever the *intent* matches (`text-default`, `bg-surface`).
- Create a new token only for a decision you'll repeat across the system — not for a one-off.
- Never inline a raw value in a component "just this once." That's how drift starts.

### 5.3 Accessibility & states are part of the system
A reusable component isn't done until it handles: hover, focus (visible focus ring), active, disabled, loading, error, and empty states — and meets contrast/keyboard/ARIA requirements. Bake these into the base component so every reuse inherits them.

---

## 6. Contract for every new component

When you *do* build something new, it must ship with:

- [ ] **Single responsibility** — it does one thing; presentation and logic are separated.
- [ ] **Props, not forks** — variations handled by props (`variant`, `size`, `state`), not copies.
- [ ] **Token-driven styling** — zero hard-coded colors/spacing/radii/fonts.
- [ ] **Composition-friendly** — accepts `children`/slots; atoms leave layout to parents.
- [ ] **Typed** — explicit `Props` type/interface; sensible defaults.
- [ ] **All states covered** — hover/focus/active/disabled/loading/error/empty + a11y.
- [ ] **Documented** — a Storybook story (or catalog entry) with each variant.
- [ ] **Tested** — at least a render + key-interaction test.
- [ ] **Correctly placed** — right atomic level; global only if reused, else colocated.
- [ ] **Exported cleanly** — via the folder's `index.ts` barrel.

---

## 7. Anti-patterns to avoid

| ❌ Anti-pattern | ✅ Do instead |
|----------------|--------------|
| Copy-pasting a component and tweaking it | Add a `variant` prop, or wrap it |
| `PrimaryButton`, `SecondaryButton`, `DangerButton` | One `Button` with a `variant` prop |
| Hard-coding `#3b82f6` / `16px` in a component | Reference a semantic design token |
| A 25-prop "god component" | Compose with `children`/slots; split responsibilities |
| Building without searching the library first | Run the §2 pre-build workflow |
| Atoms with baked-in outer margins | Let parent molecules/organisms own layout |
| Putting one-feature UI in the global `components/` | Colocate it in the feature/route |
| Business logic inside presentational components | Keep logic in hooks/services; components render |
| Rebuilding a component that exists but is undiscoverable | Maintain Storybook / a component index |

---

## 8. TL;DR — the loop for every component

1. **Search** the library, design system, and Storybook.
2. **Reuse** if it exists → **Extend** with a prop if it's close → **Compose** from existing parts if assemblable → **Create** only as a last resort.
3. Build it **token-driven**, at the **right atomic level**, **composition-friendly**.
4. Cover **all states + accessibility**.
5. **Document** (Storybook) and **test** it.
6. Feed reusable results **back into the shared library** so the next person reuses instead of rebuilds.
