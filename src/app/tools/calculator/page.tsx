import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import CalculatorTool from "@/components/tools/CalculatorTool";

export const metadata: Metadata = {
  title: "Calculator",
  description: "A fast everyday calculator with a scientific mode — addition, subtraction, trig, logs and more.",
};

export default function CalculatorPage() {
  return (
    <ToolShell
      icon="Calculator"
      title="Calculator"
      intro="A quick everyday calculator for shopping budgets, invoice checks and estimates. Switch on scientific mode for trig, logs and more — full keyboard support included."
    >
      <CalculatorTool />
    </ToolShell>
  );
}
