import HeroSection from "@/components/sections/HeroSection";
import PainSection from "@/components/sections/PainSection";
import BeforeAfterSection from "@/components/sections/BeforeAfterSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CasesSection from "@/components/sections/CasesSection";
import ROICalculator from "@/components/sections/ROICalculator";
import MethodSection from "@/components/sections/MethodSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <main style={{ background: "#000000" }}>
      <HeroSection />
      <PainSection />
      <BeforeAfterSection />
      <ServicesSection />
      <CasesSection />
      <ROICalculator />
      <MethodSection />
      <AboutSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
