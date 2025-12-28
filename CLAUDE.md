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

| Color | Hex | Usage |
|-------|-----|-------|
| Tangerine | `#EF762F` | Primary brand color, CTAs, highlights, headings |
| Sky Blue | `#50B2D5` | Secondary color, Lumi branding, emphasis |
| Muted Tan Orange | `#F1A23B` | Accent, subtle harmony, containers |

**Secondary/Neutral Colors**:

| Color | Hex | Usage |
|-------|-----|-------|
| Pure Black | `#000000` | Text, strokes |
| Pure White | `#FFFFFF` | Backgrounds, text on colored backgrounds |

### Color Pairing Rules

| Pairing | When to Use |
|---------|-------------|
| Tangerine + Sky Blue | Maximum vibrancy and contrast to emphasize content (primary pairing for children's toys) |
| Tangerine + Muted Tan Orange | Blended, subtle visual harmony to guide user's eye (e.g., CTAs in containers) |
| Sky Blue + Muted Tan Orange | Substitute pairing only when ideal pairs clash in terms of contrast or visibility |

**Important:** Maximum 2-3 colors in the same canvas/section.

### Typography

| Element | Font | Usage |
|---------|------|-------|
| Main Headings | `Luckiest Guy` (Regular) | Hero titles, section headings, short headings |
| Body Text | `Jua` (Regular) | Body content, secondary text, subheadings |

**Typography Guidelines:**
- Use bright colored headings with thick neutral stroke (black/white) to make content pop while staying readable
- Leave negative space - fonts are already rounded and crowded, so space helps readability
- For lots of body content, use neutral colors (black/white) over muted color backgrounds

### Brand Taglines

- "Smartest playmates for brightest minds"
- "Magical Pets for Little Explorers"

### Tone of Voice

| Attribute | Description |
|-----------|-------------|
| **Playful** | Speak with enthusiastic spark of fun, curiosity and humor (invite adventure) |
| **Imaginative** | Use storytelling and vivid imagery, introduce characters and possibilities |
| **Warm** | Talk like a caring friend of the same age group - help them feel seen and loved |
| **Joyful** | Keep the mood light and happy |
| **Empowering** | Use uplifting and confident language to boost confidence and character building |
| **Trustworthy** | Communicate with clarity and honesty - show parents they can rely on the toys |

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
