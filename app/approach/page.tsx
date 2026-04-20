import type { Metadata } from "next";

import ApproachCTA from "@/components/approach/ApproachCTA";
import ApproachHero from "@/components/approach/ApproachHero";
import ArchitectureFramework from "@/components/approach/ArchitectureFramework";
import ImplementationPhases from "@/components/approach/ImplementationPhases";
import SystemMap from "@/components/approach/SystemMap";
import WhyFail from "@/components/approach/WhyFail";
import LayeredBackground from "@/components/LayeredBackground";
import SectionGlow from "@/components/SectionGlow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Automation Architecture Framework | FlowOps",
  description:
    "Explore FlowOps automation systems architecture framework for scalable business process automation, CRM automation, and AI workflow systems.",
  path: "/approach",
});

export default function ApproachPage() {
  return (
    <>
      <LayeredBackground />
      <ApproachHero />
      <SectionGlow intensity="strong" />
      <WhyFail />
      <SectionGlow />
      <ArchitectureFramework />
      <SectionGlow intensity="strong" />
      <ImplementationPhases />
      <SectionGlow />
      <SystemMap />
      <SectionGlow intensity="strong" />
      <ApproachCTA />
      <SectionGlow intensity="soft" />
    </>
  );
}
