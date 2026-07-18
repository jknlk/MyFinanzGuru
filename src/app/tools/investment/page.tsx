import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import InvestmentTool from "@/components/tools/InvestmentTool";

export const metadata: Metadata = {
  title: "Investment Calculator",
  description:
    "Model how a monthly ETF savings plan could grow over time, with optional TER costs and inflation adjustment.",
};

export default function InvestmentPage() {
  return (
    <ToolShell
      image="/images/tool-investment.png"
      imageAlt="A minimal 3D rising line chart icon with coins, in glossy blue tones"
      title="Investment Calculator"
      intro="See how a monthly ETF savings plan could grow over time — adjust your contribution, return assumption, and horizon to explore different scenarios."
    >
      <InvestmentTool />
    </ToolShell>
  );
}
