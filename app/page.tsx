import type { Metadata } from "next";

import CasePreview from "@/components/CasePreview";
import ContactForm from "@/components/ContactForm";
import CTA from "@/components/CTA";
import Hero from "@/components/Hero";
import LayeredBackground from "@/components/LayeredBackground";
import Problems from "@/components/Problems";
import RoiCalculator from "@/components/RoiCalculator";
import SectionGlow from "@/components/SectionGlow";
import Services from "@/components/Services";
import Solutions from "@/components/Solutions";
import TechStack from "@/components/TechStack";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title:
    "AI Business Process Automation Consulting | Workflow & CRM Optimization | FlowOps",
  description:
    "FlowOps helps businesses eliminate manual operational chaos through AI-driven workflow automation, CRM integration, and system architecture consulting.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <LayeredBackground />
      <Hero />
      <SectionGlow intensity="strong" />
      <Problems />
      <SectionGlow />
      <Solutions />
      <SectionGlow />
      <Services />
      <SectionGlow intensity="strong" />
      <CasePreview />
      <SectionGlow />
      <TechStack />
      <SectionGlow intensity="strong" />
      <RoiCalculator />
      <SectionGlow />
      <CTA />
      <SectionGlow />
      <ContactForm />
      <SectionGlow intensity="soft" />
    </>
  );
}
