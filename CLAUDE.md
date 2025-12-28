# Kheelona Website - Project Documentation

## Overview

This is the official Kheelona website, built with Next.js 16 and Chakra UI v3. Kheelona creates AI-powered educational toys (Lumi) that help children learn through play.

**Live URL:** https://kheelona-website-react.vercel.app/

**Deployment:** Vercel

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Chakra UI v3
- **Language**: TypeScript
- **Styling**: Chakra UI + CSS Variables for fonts
- **Fonts**: Google Fonts (Luckiest Guy, Jua)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with fonts and SEO metadata
│   ├── page.tsx        # Main homepage
│   └── globals.css     # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx  # Fixed navigation header
│   │   └── Footer.tsx  # Site footer
│   ├── sections/       # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── FeaturePillsSection.tsx
│   │   ├── LimitedOfferSection.tsx
│   │   ├── ProductsSection.tsx
│   │   ├── BeforeAfterSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── FeaturesGridSection.tsx
│   │   ├── ComparisonTableSection.tsx
│   │   ├── BenchmarksSection.tsx
│   │   └── WaitlistSection.tsx
│   ├── ui/
│   │   └── LinkButton.tsx  # Reusable button-styled link
│   └── Provider.tsx    # Chakra provider wrapper
├── theme/
│   └── index.ts        # Custom Chakra UI theme
└── hooks/              # Custom React hooks (future use)
```

## Design System

### Brand Color Hierarchy

**Primary Brand Colors** (in order of usage frequency):

| Color            | Hex       | Usage                                           |
| ---------------- | --------- | ----------------------------------------------- |
| Tangerine        | `#EF762F` | Primary brand color, CTAs, highlights, headings |
| Sky Blue         | `#50B2D5` | Secondary color, Lumi branding, emphasis        |
| Muted Tan Orange | `#F1A23B` | Accent, subtle harmony, containers              |

**Secondary/Neutral Colors**:

| Color      | Hex       | Usage                                    |
| ---------- | --------- | ---------------------------------------- |
| Pure Black | `#000000` | Text, strokes                            |
| Pure White | `#FFFFFF` | Backgrounds, text on colored backgrounds |

### Color Pairing Rules

| Pairing                      | When to Use                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| Tangerine + Sky Blue         | Maximum vibrancy and contrast to emphasize content (primary pairing for children's toys) |
| Tangerine + Muted Tan Orange | Blended, subtle visual harmony to guide user's eye (e.g., CTAs in containers)            |
| Sky Blue + Muted Tan Orange  | Substitute pairing only when ideal pairs clash in terms of contrast or visibility        |

**Important:** Maximum 2-3 colors in the same canvas/section.

### Typography

| Element       | Font                     | Usage                                         |
| ------------- | ------------------------ | --------------------------------------------- |
| Main Headings | `Luckiest Guy` (Regular) | Hero titles, section headings, short headings |
| Body Text     | `Jua` (Regular)          | Body content, secondary text, subheadings     |

**Typography Guidelines:**

- Use bright colored headings with thick neutral stroke (black/white) to make content pop while staying readable
- Leave negative space - fonts are already rounded and crowded, so space helps readability
- For lots of body content, use neutral colors (black/white) over muted color backgrounds

### Brand Taglines

- "Smartest playmates for brightest minds"
- "Magical Pets for Little Explorers"

### Tone of Voice

| Attribute       | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| **Playful**     | Speak with enthusiastic spark of fun, curiosity and humor (invite adventure)    |
| **Imaginative** | Use storytelling and vivid imagery, introduce characters and possibilities      |
| **Warm**        | Talk like a caring friend of the same age group - help them feel seen and loved |
| **Joyful**      | Keep the mood light and happy                                                   |
| **Empowering**  | Use uplifting and confident language to boost confidence and character building |
| **Trustworthy** | Communicate with clarity and honesty - show parents they can rely on the toys   |

### Tone of Visuals

- **Vibrant** - Vivid colors
- **Playful** - Quirky fonts
- **Whimsical** - Magical feeling
- **Bold** - Thick fonts, thick strokes

### Communication Do's & Don'ts

**DO:**

- Use lighthearted, imaginative, encouraging words and adventurous tones
- Speak gently, empathically, hopeful and with confidence in the child
- Use regular affirmations and words of encouragement

**DON'T:**

- Force baby-ish words or over-coddle - don't seem overdramatic
- Be overly factual, harsh, dry, robotic, or emotionless
- Invalidate emotions - instead acknowledge and say "I know it's hard, but we can figure it out together"

### Visual Design Do's & Don'ts

**DO:**

- Use bright colored headings with thick neutral stroke (black/white) for pop + readability
- Leave negative space for content to breathe and be absorbed
- Use neutral colors for text-heavy sections over muted backgrounds

**DON'T:**

- Overuse bright colors in wrong context/background - avoid overcrowded look
- Mix too many colors - maximum 2-3 colors per canvas/section
- Imbalance Luckiest Guy and Jua fonts - use proper proportion as per design guidelines

## Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Key Components

### LinkButton

Custom component to handle Next.js Link with Chakra UI button styling:

```tsx
<LinkButton href="/product" size="lg">
  Pre-Order now
</LinkButton>
```

### Section Components

Each section is self-contained with its own data and styling. Import them in `page.tsx`:

```tsx
import { HeroSection } from "@/components/sections/HeroSection";
```

## Assets

Assets are stored in `/public/`:

- `/images/` - Product images, backgrounds, feature images
- `/videos/` - Hero background video

## SEO

SEO metadata is configured in `layout.tsx` with:

- Title and description
- OpenGraph tags
- Twitter card metadata
- Keywords

## Responsive Design

All components use Chakra UI's responsive syntax:

```tsx
fontSize={{ base: "2xl", md: "4xl", lg: "6xl" }}
```

Breakpoints:

- `base`: 0px (mobile)
- `md`: 768px (tablet)
- `lg`: 992px (desktop)

## Environment Variables

Currently no environment variables required. For future integrations:

```env
# .env.local
NEXT_PUBLIC_API_URL=your-api-url
```

## Deployment

**Currently deployed on Vercel**

- **Live URL:** https://kheelona-website-react.vercel.app/
- **Build command:** `npm run build`
- **Output directory:** `.next`
- **Framework preset:** Next.js

---

## Enterprise Readiness Implementation (v2.0)

### Overview

This section documents the enterprise-level improvements being implemented to bring the website to production-grade standards.

**Implementation Date:** December 2024

### Phases Implemented

| Phase | Focus                                             | Status      |
| ----- | ------------------------------------------------- | ----------- |
| 1     | Dev Infrastructure (Prettier, Husky, ESLint)      | ✅ Complete |
| 2     | SEO Infrastructure (robots.txt, sitemap, JSON-LD) | ✅ Complete |
| 3     | Security Headers (CSP, HSTS, X-Frame-Options)     | ✅ Complete |
| 4     | Error Handling (ErrorBoundary, error.tsx, 404)    | ✅ Complete |
| 5     | Form Validation (Zod, Field component)            | ✅ Complete |
| 6     | Accessibility Fixes (ARIA, keyboard nav, focus)   | ✅ Complete |
| 7     | Testing Framework (Vitest + Playwright E2E)       | ✅ Complete |

### New Project Structure (Post-Implementation)

```
src/
├── app/
│   ├── layout.tsx        # Root layout with ErrorBoundary, JSON-LD
│   ├── page.tsx          # Main homepage
│   ├── error.tsx         # Global error page
│   ├── not-found.tsx     # 404 page
│   ├── sitemap.ts        # Dynamic sitemap generation
│   └── globals.css       # Global styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx    # Fixed nav with skip link, ARIA
│   │   └── Footer.tsx    # Site footer
│   ├── sections/         # Page sections (with a11y fixes)
│   └── ui/
│       ├── LinkButton.tsx
│       ├── ErrorBoundary.tsx  # NEW: Error boundary component
│       └── provider.tsx
├── lib/
│   └── validation.ts     # NEW: Zod validation schemas
├── theme/
│   └── index.ts          # Custom Chakra UI theme
├── test/
│   └── setup.ts          # NEW: Vitest test setup
└── __tests__/            # NEW: Unit/integration tests

e2e/                      # NEW: Playwright E2E tests
├── homepage.spec.ts
├── navigation.spec.ts
├── form-submission.spec.ts
└── accessibility.spec.ts

public/
├── robots.txt            # NEW: Search engine directives
├── og-image.jpg          # NEW: OpenGraph image
└── images/               # Existing images
```

### Commands (Updated)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint

# Format code (NEW)
npm run format

# Run unit tests (NEW)
npm run test

# Run tests with coverage (NEW)
npm run test:coverage

# Run E2E tests (NEW)
npm run test:e2e

# Run E2E tests with UI (NEW)
npm run test:e2e:ui
```

### Code Quality Standards

#### Formatting (Prettier)

- 2-space indentation
- Single quotes for strings
- No trailing commas
- 100 character line width

#### Linting (ESLint)

- Next.js Core Web Vitals rules
- Accessibility rules (jsx-a11y)
- Import ordering rules

#### Pre-commit Hooks (Husky + lint-staged)

- Auto-format staged files
- Run lint on staged files
- Block commits with lint errors

### Accessibility Guidelines

#### Required for All Components

1. **Interactive Elements**
   - All buttons must have `aria-label` if icon-only
   - All form inputs must have associated labels via `Field.Label`
   - Focus states must be visible (use theme focus ring tokens)

2. **Navigation**
   - Skip navigation link in Header
   - Keyboard navigation support (arrow keys for carousels)
   - Proper heading hierarchy (h1 → h2 → h3)

3. **Decorative Elements**
   - Add `aria-hidden="true"` to decorative circles, quote marks, etc.

4. **Forms**
   - Use Chakra UI `Field.Root` + `Field.Label` for form fields
   - Show validation errors with `Field.ErrorText`
   - Associate error messages with inputs

#### Testing Accessibility

```bash
# Run Playwright accessibility tests
npm run test:e2e -- accessibility.spec.ts

# Manual testing
# 1. Use axe DevTools browser extension
# 2. Test with keyboard only (Tab, Enter, arrows)
# 3. Test with screen reader (VoiceOver/NVDA)
```

### Security Headers

The following headers are configured in `next.config.ts`:

| Header                  | Value                           | Purpose                   |
| ----------------------- | ------------------------------- | ------------------------- |
| X-Frame-Options         | DENY                            | Prevent clickjacking      |
| X-Content-Type-Options  | nosniff                         | Prevent MIME sniffing     |
| Referrer-Policy         | strict-origin-when-cross-origin | Control referrer info     |
| Permissions-Policy      | camera=(), microphone=()        | Restrict browser features |
| Content-Security-Policy | (configured)                    | Prevent XSS attacks       |

### Form Validation

Use Zod schemas from `src/lib/validation.ts`:

```tsx
import { WaitlistFormSchema } from "@/lib/validation";

// Validate form data
const result = WaitlistFormSchema.safeParse(formData);
if (!result.success) {
  // Handle validation errors
  setErrors(result.error.flatten().fieldErrors);
}
```

### Error Handling

1. **ErrorBoundary Component**
   - Wraps app in `layout.tsx`
   - Catches React errors
   - Shows user-friendly fallback UI

2. **error.tsx**
   - Next.js App Router error page
   - Handles runtime errors
   - Provides "Try Again" functionality

3. **not-found.tsx**
   - Custom 404 page
   - Matches design system
   - Links back to homepage

### Testing Strategy

#### Unit Tests (Vitest)

- Component rendering tests
- Hook tests
- Utility function tests

#### E2E Tests (Playwright)

- Homepage loads correctly
- Navigation works
- Form submission flow
- Accessibility checks

#### Running Tests

```bash
# Run all unit tests
npm run test

# Run specific test file
npm run test -- LinkButton.test.tsx

# Run E2E tests
npm run test:e2e

# Run E2E with browser UI
npm run test:e2e:ui
```

### Success Criteria Checklist

After implementation, verify:

- [x] `npm run lint` passes with no errors
- [x] `npm run build` succeeds
- [x] `npm run test:run` - All 15 unit tests pass
- [ ] `npm run test:e2e` - E2E tests ready (run with dev server)
- [x] Security headers configured in next.config.ts
- [x] JSON-LD structured data in layout.tsx
- [x] Accessibility improvements (ARIA, keyboard nav, skip link)
- [x] Site functionality unchanged (visual comparison)
