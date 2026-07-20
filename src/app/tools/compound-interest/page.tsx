import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import CompoundInterestTool from "@/components/tools/CompoundInterestTool";

export const metadata: Metadata = {
  title: "Compound Interest Calculator",
  description:
    "See how a lump sum and optional monthly deposits compound over time, with annual or monthly compounding.",
};

export default function CompoundInterestPage() {
  return (
    <ToolShell
      icon="TrendingUp"
      title="Compound Interest Calculator"
      intro="Model the classic Zinseszins effect — enter a starting capital, an optional monthly deposit, a rate and a time horizon to see how it grows."
    >
      <CompoundInterestTool />
    </ToolShell>
  );
}
