import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import WhatsAppCommunity from "@/components/sections/WhatsAppCommunity2";
import Testimonials from "@/components/sections/Testimonials2";
import WhyJoinUs from "@/components/sections/WhyJoinUs";
import OnlineSession from "@/components/sections/OnlineSession";
import CommunityHeroSection from "@/components/sections/CommunityHeroSection";

export default async function HomePage() {
  return (
    <div id="main-content" tabIndex={-1}>
      <Header />
      <CommunityHeroSection />
      <OnlineSession />
      <WhyJoinUs />
      <Testimonials />
      <WhatsAppCommunity />
      <Footer />
    </div>
  );
}
