# Next.js Project Structure — Standard Blueprint

> A reusable, project-agnostic structure for **Next.js (App Router, v15/16)** projects.
> Drop this file into any repo's root or `/docs` folder as the single source of truth for **where everything lives**.
> Verified against the official Next.js file conventions and modern feature-sliced / atomic-design practice.

---

## 1. Core principles

Before the folders, the rules that decide the folders:

1. **`app/` is for routing only.** Folders inside `app/` define URL segments. A folder becomes a public route only when it contains a `page.tsx` or `route.ts`. Keep pages thin — they wire data + layout, they don't hold business logic.
2. **Colocation over scattering.** Keep the things a route needs *near* the route (its private components, its data helpers) using private folders (`_components`, `_lib`). Only promote something to the global layer when a second place needs it. This is the single most useful habit in the App Router.
3. **Server-first.** Every file in `app/` is a **React Server Component** by default. Only add `"use client"` when a component needs browser APIs, state, effects, or event handlers. Ask *"does this need interactivity?"* — if no, keep it on the server.
4. **Client components as leaves.** Push `"use client"` as far down the tree as possible so interactive islands stay small and most of the tree stays server-rendered.
5. **Structure = architecture.** In the App Router the folder layout *is* the app's shape. Get it right and the project stays navigable at 50+ routes; get it wrong and you fight your own folders within a month.

---

## 2. Top-level layout

Use a `src/` directory to keep application code separate from config. Recommended top level:

```
my-app/
├── src/
│   ├── app/                  # Routing layer ONLY (pages, layouts, route handlers)
│   ├── components/           # Shared, reusable UI (atomic design — see §4)
│   ├── features/             # Self-contained feature modules (see §5)
│   ├── lib/                  # Framework-agnostic utilities & shared logic
│   ├── services/             # External I/O: API clients, data access (see §6)
│   ├── hooks/                # Shared custom React hooks (useXxx)
│   ├── stores/               # Global client state (Zustand/Jotai/Redux slices)
│   ├── types/                # Shared TypeScript types & interfaces
│   ├── config/               # App config, constants, env parsing, feature flags
│   ├── styles/               # Global CSS, design-token CSS variables, theme
│   └── providers/            # React context providers (theme, query client, auth)
├── public/                   # Static assets served as-is (images, fonts, icons)
├── tests/                    # (optional) e2e / integration tests
├── .env.local                # Local env vars (never committed)
├── next.config.ts
├── tsconfig.json             # Set up path aliases here (@/*)
└── package.json
```

> **Path aliases:** configure `@/*` → `src/*` in `tsconfig.json` so imports read
> `import { Button } from "@/components/atoms/Button"` instead of `../../../`.

---

## 3. The `app/` (routing) layer

`app/` holds only what maps to a URL plus the special route files. Everything reusable lives outside it.

### 3.1 Route file conventions

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI that wraps a segment and its children (header, nav, shell). Root `layout.tsx` wraps everything. |
| `page.tsx` | Makes the segment a public, routable page. |
| `loading.tsx` | Instant loading skeleton (Suspense boundary). |
| `error.tsx` | Error boundary for the segment (must be a client component). |
| `not-found.tsx` | 404 UI for the segment. |
| `route.ts` | An **API endpoint** (GET/POST/…) — this is how you build APIs in the App Router. |
| `template.tsx` | Like layout but re-mounts on navigation. |
| `default.tsx` | Fallback for parallel-route slots. |

### 3.2 Dynamic & organizational segments

```
app/
├── layout.tsx                     # Root layout (html, body, providers)
├── page.tsx                       # "/" home
├── globals.css
│
├── (marketing)/                   # Route GROUP — parentheses omit it from URL
│   ├── layout.tsx                 #   shared marketing shell
│   ├── page.tsx                   #   "/"
│   └── pricing/page.tsx           #   "/pricing"
│
├── (app)/                         # A second group with its own layout (e.g. authed area)
│   ├── layout.tsx
│   └── dashboard/
│       ├── page.tsx               #   "/dashboard"
│       ├── loading.tsx
│       ├── _components/           # PRIVATE folder — colocated, not routable
│       │   └── RevenueChart.tsx
│       └── _lib/
│           └── get-revenue.ts     #   data helper for this route only
│
├── blog/
│   └── [slug]/page.tsx            #   "/blog/:slug"  (dynamic segment)
│
├── shop/
│   └── [...slug]/page.tsx         #   catch-all  "/shop/a/b/c"
│
└── api/                           # API endpoints (Route Handlers)
    ├── health/route.ts            #   GET /api/health
    └── webhooks/stripe/route.ts   #   POST /api/webhooks/stripe
```

**Segment notation cheat-sheet**

| Notation | Meaning |
|----------|---------|
| `folder` | Normal URL segment |
| `[param]` | Dynamic segment (`/blog/[slug]`) |
| `[...param]` | Catch-all |
| `[[...param]]` | Optional catch-all |
| `(group)` | Route group — groups without adding to the URL |
| `_folder` | **Private** — colocate files, never routable |
| `@slot` | Named slot for parallel routes |
| `(.)folder` | Intercepted route (e.g. show a detail as a modal) |

---

## 4. Components layer — Atomic Design

`src/components/` holds **shared, reusable, presentation-focused** UI, organized by the atomic-design hierarchy (Brad Frost). This maps naturally onto React's component model.

```
components/
├── atoms/          # Smallest building blocks — can't break down further
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   └── Button.test.tsx
│   ├── Input/
│   ├── Label/
│   ├── Icon/
│   └── Typography/
│
├── molecules/      # A few atoms bonded into one functional unit
│   ├── SearchField/     # Input + Button + Label
│   ├── FormField/       # Label + Input + error text
│   └── Card/
│
├── organisms/      # Complex, self-contained sections
│   ├── Header/          # Logo + Nav + SearchField
│   ├── Footer/
│   ├── ProductList/
│   └── DataTable/
│
└── templates/      # Page-level layout skeletons (arrange organisms, no real data)
    ├── DashboardTemplate/
    └── MarketingTemplate/
```

### 4.1 What goes at each level

| Level | Definition | Examples | Rules |
|-------|------------|----------|-------|
| **Atom** | Smallest functional UI element | Button, Input, Label, Icon, Badge, Spinner | Stateless where possible. **No outer margins / positioning.** Style themselves only. Fully generic. |
| **Molecule** | 2+ atoms working as one unit | SearchField, FormField, Card, Pagination | May arrange the atoms inside them, but carry no page-specific logic. |
| **Organism** | Distinct section of an interface | Header, Footer, ProductGrid, CheckoutForm | May own local state and composition of molecules/atoms. |
| **Template** | Layout skeleton placing organisms | DashboardTemplate | Defines the grid/structure only. No real content, no business logic, no app-level state. |
| **Page** | Template + real data | Lives in `app/**/page.tsx` | Fetches data, passes it into a template/organisms. |

> **Key heuristic (the reuse test):** for every new component ask
> *"Is this generic enough to avoid specificity or repeated code in whatever context it's used?"*
> If yes → it belongs in `components/`. If it's tied to one feature → colocate it in that feature (see §5) or the route's `_components/`.

> **"Pages" in atomic design vs Next.js pages:** the atomic "page" is the real, data-filled screen — in Next.js that responsibility lives in `app/**/page.tsx`, which renders a template + organisms. Keep templates presentation-only so pages stay the single place data enters the UI.

### 4.2 Per-component folder convention

Each component gets its own folder so its concerns stay together:

```
Button/
├── Button.tsx          # Component
├── Button.types.ts     # Props / TS types
├── Button.module.css   # (if not using Tailwind/tokens inline)
├── Button.test.tsx     # Unit test
├── Button.stories.tsx  # Storybook story (living documentation)
└── index.ts            # Barrel re-export → clean imports
```

---

## 5. Feature modules (`src/features/`)

For anything beyond a small app, **feature-first** organization scales better than dumping everything in global folders. A feature folder contains *everything that feature needs*, so the codebase "reads like the product."

```
features/
└── checkout/
    ├── components/     # Feature-specific UI (not reused elsewhere)
    ├── hooks/          # useCheckout, useCart …
    ├── services/       # checkout API calls
    ├── stores/         # feature state
    ├── types/          # feature types
    ├── utils/          # feature helpers
    └── index.ts        # Public API of the feature (export only what's needed)
```

**Global vs feature — the promotion rule:**
- Used by **one** feature → keep it inside that feature.
- Needed by **two or more** places → promote to the global layer (`components/`, `hooks/`, `lib/`).
- Enforce **unidirectional dependencies**: features may import from global layers, never the reverse; features shouldn't import each other's internals — only their public `index.ts`.

---

## 6. Services & data layer

Keep all external I/O and data access out of components. Components render; services fetch.

```
services/
├── api/
│   ├── client.ts        # Configured fetch/axios instance, base URL, interceptors
│   └── endpoints/       # Typed functions per resource
│       ├── users.ts     #   getUser(), listUsers(), updateUser()
│       └── orders.ts
├── db/                  # (if full-stack) Prisma/Drizzle client singleton + queries
└── external/            # 3rd-party SDK wrappers (payments, email, storage, LLM)
```

### 6.1 Where to fetch data (App Router hierarchy)

Decide in this order:

1. **Server Component** — fetch directly, no API route needed. Best for **initial page data**. Zero JS shipped for the fetch.
2. **Client Component + TanStack Query / SWR** — for data that refreshes, depends on interaction, or needs optimistic updates.
3. **`useEffect` + fetch** — only for side-effect-driven loads *after* mount. **Never** for initial render data (causes empty-content flash + extra round trip).

### 6.2 APIs, mutations, and handlers

- **Route Handlers** (`app/api/**/route.ts`) — for webhooks, OAuth callbacks, third-party integrations, and public REST/JSON APIs.
- **Server Actions** — for form submissions and mutations from your own UI (no API route needed).
- Don't turn a frontend repo into a sprawling "API project." Reach for a Route Handler when something *external* needs an endpoint; reach for a Server Action when *your own form* needs to mutate.

---

## 7. Styling & design tokens

Global styling and the token system live in `src/styles/`:

```
styles/
├── globals.css         # Resets, base element styles, font-face
├── tokens.css          # Design tokens as CSS variables (3-tier — see below)
└── themes.css          # Light/dark theme overrides
```

Use the **three-tier token model** so visual decisions live in one place:

```css
:root {
  /* 1. Primitive (raw values — reference only, never used directly in components) */
  --color-blue-500: #3b82f6;
  --space-2: 0.5rem;

  /* 2. Semantic (meaning — what components actually use) */
  --color-bg-brand: var(--color-blue-500);
  --radius-md: var(--space-2);

  /* 3. Component (per-component, optional — for theming/consistency at scale) */
  --button-bg: var(--color-bg-brand);
  --button-radius: var(--radius-md);
}
```

(Component guidelines — how to *reuse* and *compose* these — are in the companion `COMPONENT_GUIDELINES.md`.)

---

## 8. Naming conventions

| Thing | Convention | Example |
|-------|------------|---------|
| Component files/folders | `PascalCase` | `SearchField.tsx` |
| Hooks | `camelCase` starting `use` | `useCart.ts` |
| Utilities / services | `camelCase` or `kebab-case` files | `format-date.ts` |
| Types/interfaces | `PascalCase` | `type OrderStatus` |
| Route folders | `kebab-case` | `app/order-history/` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES` |
| Barrel export | `index.ts` per component/feature | — |

---

## 9. Quick decision guide — "where does this go?"

| I'm creating… | Put it in… |
|---------------|-----------|
| A URL/page | `app/<segment>/page.tsx` |
| An API endpoint | `app/api/<name>/route.ts` |
| A generic reusable UI element | `components/atoms | molecules | organisms` |
| A page layout skeleton | `components/templates/` |
| UI used by only one route | that route's `_components/` |
| UI used by only one feature | `features/<feature>/components/` |
| A data fetch / API call | `services/` |
| A reusable hook | `hooks/` (global) or `features/<f>/hooks/` |
| Global client state | `stores/` |
| A shared type | `types/` |
| A pure helper function | `lib/` |
| A color / spacing / radius value | `styles/tokens.css` |

---

## 10. Checklist for a new project

- [ ] `src/` enabled, `@/*` path alias configured in `tsconfig.json`
- [ ] `app/` contains routing only; business logic lives elsewhere
- [ ] `components/` split into atoms / molecules / organisms / templates
- [ ] Design tokens defined in three tiers before building UI
- [ ] Server components are the default; `"use client"` only on interactive leaves
- [ ] Services layer isolates all data access and external I/O
- [ ] Features are self-contained with a public `index.ts`
- [ ] Storybook (or equivalent) set up as living component documentation
- [ ] Naming conventions agreed and documented
