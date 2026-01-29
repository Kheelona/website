import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", overflowX: "hidden" }} id="main-content" tabIndex={-1}>
      <Header />
      <Footer />
    </div>
  );
}
