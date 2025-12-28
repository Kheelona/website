# Kheelona Website - Project Documentation

## Overview

This is the official Kheelona website, built with Next.js 16 and Chakra UI v3. Kheelona creates AI-powered educational toys (Lumi) that help children learn through play.

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

## Brand Guidelines

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Tangerine | `#EF762F` | Primary brand color, CTAs, highlights |
| Sky Blue | `#50B2D5` | Secondary color, Lumi branding |
| Muted Orange | `#F1A23B` | Accent, warnings, Old Way section |
| Black | `#000000` | Text |
| White | `#FFFFFF` | Backgrounds, text on dark |

### Typography

- **Headings**: `Luckiest Guy` (playful, bold)
- **Body Text**: `Jua` (friendly, readable)

### Tone

Vibrant, Playful, Whimsical, Bold

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

The site can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting platform

Build command: `npm run build`
Output directory: `.next`
