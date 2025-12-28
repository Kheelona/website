import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Primary Brand Colors
        tangerine: {
          50: { value: "#FFF3EC" },
          100: { value: "#FFE1D0" },
          200: { value: "#FFC4A1" },
          300: { value: "#FFA672" },
          400: { value: "#FF8943" },
          500: { value: "#EF762F" }, // Main Tangerine
          600: { value: "#D65D1A" },
          700: { value: "#B24812" },
          800: { value: "#8E370D" },
          900: { value: "#6A2809" },
        },
        skyBlue: {
          50: { value: "#E8F7FB" },
          100: { value: "#C5ECF5" },
          200: { value: "#9DDEED" },
          300: { value: "#75D0E5" },
          400: { value: "#50B2D5" }, // Main Sky Blue
          500: { value: "#3A9DC0" },
          600: { value: "#2D7A96" },
          700: { value: "#21586C" },
          800: { value: "#163742" },
          900: { value: "#0B1B21" },
        },
        mutedOrange: {
          50: { value: "#FEF7EC" },
          100: { value: "#FDECD0" },
          200: { value: "#FBD9A1" },
          300: { value: "#F8C672" },
          400: { value: "#F1A23B" }, // Muted Tan Orange
          500: { value: "#D88A2A" },
          600: { value: "#B0701E" },
          700: { value: "#885616" },
          800: { value: "#603D0F" },
          900: { value: "#382308" },
        },
        // Brand color aliases
        brand: {
          primary: { value: "#EF762F" },
          secondary: { value: "#50B2D5" },
          accent: { value: "#F1A23B" },
        },
      },
      fonts: {
        heading: { value: `var(--font-luckiest-guy), 'Luckiest Guy', cursive` },
        body: { value: `var(--font-jua), 'Jua', sans-serif` },
      },
      fontSizes: {
        "2xs": { value: "0.625rem" },
        xs: { value: "0.75rem" },
        sm: { value: "0.875rem" },
        md: { value: "1rem" },
        lg: { value: "1.125rem" },
        xl: { value: "1.25rem" },
        "2xl": { value: "1.5rem" },
        "3xl": { value: "1.875rem" },
        "4xl": { value: "2.25rem" },
        "5xl": { value: "3rem" },
        "6xl": { value: "3.75rem" },
        "7xl": { value: "4.5rem" },
        "8xl": { value: "6rem" },
      },
      radii: {
        none: { value: "0" },
        sm: { value: "0.25rem" },
        md: { value: "0.5rem" },
        lg: { value: "1rem" },
        xl: { value: "1.5rem" },
        "2xl": { value: "2rem" },
        "3xl": { value: "2.5rem" },
        full: { value: "9999px" },
      },
      shadows: {
        card: { value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
        cardHover: {
          value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        button: { value: "0 4px 14px rgba(239, 118, 47, 0.4)" },
      },
    },
    semanticTokens: {
      colors: {
        // Background colors
        "bg.primary": { value: "#FFFFFF" },
        "bg.secondary": { value: "#F5F9FB" },
        "bg.muted": { value: "#F8FBFC" },
        "bg.accent": { value: "{colors.tangerine.500}" },
        "bg.hero": { value: "{colors.skyBlue.400}" },
        // Text colors
        "text.primary": { value: "{colors.gray.800}" },
        "text.secondary": { value: "{colors.gray.600}" },
        "text.muted": { value: "{colors.gray.500}" },
        "text.accent": { value: "{colors.tangerine.500}" },
        "text.highlight": { value: "{colors.skyBlue.400}" },
        "text.onDark": { value: "#FFFFFF" },
        // Border colors
        "border.default": { value: "{colors.gray.200}" },
        "border.accent": { value: "{colors.tangerine.500}" },
        // Tangerine color palette semantic tokens
        tangerine: {
          solid: { value: "{colors.tangerine.500}" },
          contrast: { value: "#FFFFFF" },
          fg: { value: "{colors.tangerine.700}" },
          muted: { value: "{colors.tangerine.100}" },
          subtle: { value: "{colors.tangerine.50}" },
          emphasized: { value: "{colors.tangerine.300}" },
          focusRing: { value: "{colors.tangerine.500}" },
        },
        // Sky Blue color palette semantic tokens
        skyBlue: {
          solid: { value: "{colors.skyBlue.400}" },
          contrast: { value: "#FFFFFF" },
          fg: { value: "{colors.skyBlue.700}" },
          muted: { value: "{colors.skyBlue.100}" },
          subtle: { value: "{colors.skyBlue.50}" },
          emphasized: { value: "{colors.skyBlue.300}" },
          focusRing: { value: "{colors.skyBlue.400}" },
        },
        // Muted Orange color palette semantic tokens
        mutedOrange: {
          solid: { value: "{colors.mutedOrange.400}" },
          contrast: { value: "#FFFFFF" },
          fg: { value: "{colors.mutedOrange.700}" },
          muted: { value: "{colors.mutedOrange.100}" },
          subtle: { value: "{colors.mutedOrange.50}" },
          emphasized: { value: "{colors.mutedOrange.300}" },
          focusRing: { value: "{colors.mutedOrange.400}" },
        },
      },
    },
    textStyles: {
      // Section label (e.g., "Shop Now", "The Features")
      "section.label": {
        value: {
          fontFamily: "body",
          fontSize: { base: "md", md: "lg" },
          fontWeight: "normal",
          textTransform: "uppercase",
          letterSpacing: "wider",
          color: "tangerine.500",
        },
      },
      // Section heading
      "section.heading": {
        value: {
          fontFamily: "heading",
          fontSize: { base: "2xl", md: "4xl", lg: "5xl" },
          fontWeight: "normal",
          lineHeight: "1.2",
          color: "gray.800",
        },
      },
      // Section description
      "section.description": {
        value: {
          fontFamily: "body",
          fontSize: { base: "md", md: "lg" },
          color: "gray.500",
        },
      },
      // Hero heading
      "hero.heading": {
        value: {
          fontFamily: "heading",
          fontSize: { base: "3xl", md: "5xl", lg: "6xl" },
          fontWeight: "normal",
          lineHeight: "1.1",
          color: "white",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        },
      },
      // Card title
      "card.title": {
        value: {
          fontFamily: "heading",
          fontSize: { base: "xl", md: "2xl" },
          fontWeight: "normal",
          color: "gray.800",
        },
      },
      // Card description
      "card.description": {
        value: {
          fontFamily: "body",
          fontSize: { base: "sm", md: "md" },
          color: "gray.600",
        },
      },
      // Price display
      "price.sale": {
        value: {
          fontFamily: "heading",
          fontSize: { base: "2xl", md: "3xl" },
          color: "tangerine.500",
        },
      },
      "price.original": {
        value: {
          fontFamily: "body",
          fontSize: { base: "sm", md: "md" },
          color: "gray.400",
          textDecoration: "line-through",
        },
      },
    },
    layerStyles: {
      // Gradient backgrounds
      "gradient.hero": {
        value: {
          background: "linear-gradient(135deg, #50B2D5 0%, #3A9DC0 50%, #2A7D9E 100%)",
        },
      },
      "gradient.heroOverlay": {
        value: {
          background:
            "linear-gradient(135deg, rgba(80, 178, 213, 0.85) 0%, rgba(42, 125, 158, 0.9) 100%)",
        },
      },
      "gradient.lumiWay": {
        value: {
          background: "linear-gradient(135deg, #50B2D5 0%, #3A9DC0 100%)",
        },
      },
      "gradient.oldWay": {
        value: {
          background: "linear-gradient(135deg, #F1A23B 0%, #E8923A 100%)",
        },
      },
      "gradient.benchmarks": {
        value: {
          background: "linear-gradient(135deg, #50B2D5 0%, #3A9DC0 50%, #2A7D9E 100%)",
        },
      },
      "gradient.card": {
        value: {
          background: "linear-gradient(135deg, #F8FBFC 0%, #EEF6F9 100%)",
        },
      },
      "gradient.waitlist": {
        value: {
          background: "linear-gradient(180deg, #FFF9F5 0%, #FFF5EE 100%)",
        },
      },
      "gradient.testimonials": {
        value: {
          background: "linear-gradient(180deg, #FFFBF5 0%, #FFF5E6 100%)",
        },
      },
      // Card styles
      "card.default": {
        value: {
          background: "white",
          borderRadius: "2xl",
          boxShadow: "lg",
          overflow: "hidden",
          transition: "all 0.3s",
          _hover: {
            transform: "translateY(-5px)",
            boxShadow: "xl",
          },
        },
      },
      "card.feature": {
        value: {
          background: "linear-gradient(135deg, #F8FBFC 0%, #EEF6F9 100%)",
          borderRadius: "2xl",
          overflow: "hidden",
          transition: "all 0.3s",
          cursor: "pointer",
          _hover: {
            transform: "translateY(-8px)",
            boxShadow: "xl",
          },
        },
      },
      "card.testimonial": {
        value: {
          background: "white",
          borderRadius: "3xl",
          padding: { base: "8", md: "12" },
          boxShadow: "xl",
          position: "relative",
        },
      },
      // Decorative elements
      "decorative.circle": {
        value: {
          position: "absolute",
          borderRadius: "full",
        },
      },
      "decorative.circleSkyBlue": {
        value: {
          position: "absolute",
          borderRadius: "full",
          background: "rgba(80, 178, 213, 0.08)",
        },
      },
      "decorative.circleTangerine": {
        value: {
          position: "absolute",
          borderRadius: "full",
          background: "rgba(239, 118, 47, 0.08)",
        },
      },
      // Badge/Pill styles
      "badge.feature": {
        value: {
          background: "white",
          color: "gray.800",
          paddingX: "4",
          paddingY: "2",
          borderRadius: "full",
          fontFamily: "body",
          fontSize: { base: "sm", md: "md" },
          boxShadow: "md",
          display: "flex",
          alignItems: "center",
          gap: "2",
        },
      },
      "badge.accent": {
        value: {
          background: "tangerine.500",
          color: "white",
          paddingX: "4",
          paddingY: "2",
          borderRadius: "full",
          fontFamily: "body",
          fontSize: "sm",
          boxShadow: "md",
        },
      },
      // Section container
      "section.container": {
        value: {
          paddingY: { base: "16", md: "24" },
          paddingX: { base: "4", md: "6" },
          position: "relative",
          overflow: "hidden",
        },
      },
    },
  },
  globalCss: {
    "html, body": {
      fontFamily: "var(--font-jua), 'Jua', sans-serif",
      color: "text.primary",
      bg: "bg.primary",
      lineHeight: 1.6,
    },
    "h1, h2, h3, h4, h5, h6": {
      fontFamily: "var(--font-luckiest-guy), 'Luckiest Guy', cursive",
      fontWeight: "normal",
      lineHeight: 1.2,
    },
    // Ensure Chakra Heading component uses the heading font
    ".chakra-heading": {
      fontFamily: "var(--font-luckiest-guy), 'Luckiest Guy', cursive !important",
    },
  },
});

export const system = createSystem(defaultConfig, config);
