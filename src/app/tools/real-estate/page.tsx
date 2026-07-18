import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import RealEstateTool from "@/components/tools/RealEstateTool";

export const metadata: Metadata = {
  title: "Real Estate Calculator",
  description:
    "Find the maximum property price you can realistically afford, including incidental purchase costs by federal state.",
};

export default function RealEstatePage() {
  return (
    <ToolShell
      image="/images/tool-real-estate.png"
      imageAlt="A minimal 3D house icon with a percentage symbol, in glossy blue tones"
      title="Real Estate Calculator"
      intro="All parameters can be individually adjusted. Find a realistic maximum purchase price based on your income, equity and financing structure."
    >
      <RealEstateTool />
    </ToolShell>
  );
}
