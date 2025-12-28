import { Box } from "@chakra-ui/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { LimitedOfferSection } from "@/components/sections/LimitedOfferSection";
import { ProductsSection } from "@/components/sections/ProductsSection";
import { LifestyleGallerySection } from "@/components/sections/LifestyleGallerySection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FeaturesGridSection } from "@/components/sections/FeaturesGridSection";
import { ComparisonTableSection } from "@/components/sections/ComparisonTableSection";
import { BenchmarksSection } from "@/components/sections/BenchmarksSection";
import { WaitlistSection } from "@/components/sections/WaitlistSection";

export default function HomePage() {
  return (
    <Box as="main" id="main-content" minH="100vh" overflowX="hidden" tabIndex={-1}>
      <Header />
      <HeroSection />
      <LimitedOfferSection />
      <ProductsSection />
      <LifestyleGallerySection />
      <BeforeAfterSection />
      <TestimonialsSection />
      <FeaturesGridSection />
      <ComparisonTableSection />
      <BenchmarksSection />
      <WaitlistSection />
      <Footer />
    </Box>
  );
}
