import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import Testimonials from "@/components/sections/Testimonials";
import ParentingGrowth from "@/components/sections/ParentingGrowth";
import InteractiveLearning from "@/components/sections/InteractiveLearning";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import UsageScenarios from "@/components/sections/UsageScenarios";
import WhatsAppCommunity from "@/components/sections/WhatsAppCommunity";
import ProductHero from "@/components/sections/ProductHeroSection";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/wix/services/productById";

type WixImage = {
  image?: {
    url?: string;
  };
};

type WixProduct = {
  name: string;
  description?: string;
  media?: {
    items?: WixImage[];
  };
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = (await getProductById(id)) as WixProduct;

  if (!product) notFound();

  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }} id="main-content" tabIndex={-1}>
      <Header />
      <ProductHero product={product} />
      <UsageScenarios />
      <Testimonials />
      <ParentingGrowth />
      <InteractiveLearning />
      <WhyChooseUs />
      <WhatsAppCommunity />
      <Footer />
    </div>
  );
}
