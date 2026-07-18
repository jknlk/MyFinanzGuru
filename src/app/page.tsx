import RevealScope from "@/components/animation/RevealScope";
import Hero from "@/components/home/Hero";
import LogoMarquee from "@/components/home/LogoMarquee";
import ToolsStrip from "@/components/home/ToolsStrip";
import AboutTeaser from "@/components/home/AboutTeaser";
import StatsBand from "@/components/home/StatsBand";
import GuidesGrid from "@/components/home/GuidesGrid";
import StepPlan from "@/components/home/StepPlan";
import HowItWorks from "@/components/home/HowItWorks";
import HomeFaq from "@/components/home/HomeFaq";
import CTABand from "@/components/ui/CTABand";

export default function Home() {
  return (
    <RevealScope>
      <Hero />
      <LogoMarquee />
      <ToolsStrip />
      <AboutTeaser />
      <StatsBand />
      <GuidesGrid />
      <StepPlan />
      <HowItWorks />
      <HomeFaq />
      <div className="mx-auto max-w-[100rem] px-6 pb-24 lg:px-10">
        <CTABand
          heading="Book your free meeting today"
          sub="30 minutes, zero obligation, and a clear next step for your finances."
        />
      </div>
    </RevealScope>
  );
}
