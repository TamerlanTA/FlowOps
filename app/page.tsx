import NavBar from "@/components/sections/NavBar";
import HeroSection from "@/components/sections/HeroSection";
import PainSection from "@/components/sections/PainSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CasesSection from "@/components/sections/CasesSection";
import ROICalculator from "@/components/sections/ROICalculator";
import MethodSection from "@/components/sections/MethodSection";
import AboutSection from "@/components/sections/AboutSection";
import PortalPreviewSection from "@/components/sections/PortalPreviewSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main style={{ background: "#000000" }}>
      <NavBar />
      <HeroSection />
      <PainSection />
      <MethodSection />
      <ServicesSection />
      <ROICalculator />
      <AboutSection />
      <PortalPreviewSection />
      <CasesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
