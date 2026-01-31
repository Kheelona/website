import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import ProductCards from "@/components/sections/ProductCards";
import TrustBadges from "@/components/sections/TrustBadges";
import Testimonials from "@/components/sections/Testimonials";
import ParentingGrowth from "@/components/sections/ParentingGrowth";
import InteractiveLearning from "@/components/sections/InteractiveLearning";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import UsageScenarios from "@/components/sections/UsageScenarios";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }} id="main-content" tabIndex={-1}>
      <Header />
      <HeroSection />
      <ProductCards />
      <TrustBadges />
      <Testimonials />
      <ParentingGrowth />
      <InteractiveLearning />
      <WhyChooseUs />
      <UsageScenarios />
      <Footer />
    </div>
  );
}
