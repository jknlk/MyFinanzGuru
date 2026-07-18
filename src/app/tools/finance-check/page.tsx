import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import FinanceCheckTool from "@/components/tools/FinanceCheckTool";

export const metadata: Metadata = {
  title: "Finance Check",
  description: "Answer 10 quick questions and get an instant score of your financial health.",
};

export default function FinanceCheckPage() {
  return (
    <ToolShell
      image="/images/tool-finance-check.png"
      imageAlt="A minimal 3D clipboard icon with checkmarks, in glossy blue tones"
      title="Finance Check"
      intro="Answer 10 quick yes/no questions and get an instant, honest read on your financial health — plus a tip for every area you can improve."
    >
      <FinanceCheckTool />
    </ToolShell>
  );
}
