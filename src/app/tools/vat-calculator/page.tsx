import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import VatTool from "@/components/tools/VatTool";

export const metadata: Metadata = {
  title: "VAT Calculator",
  description:
    "Convert between net and gross prices at 19%, 7% or a custom VAT rate — instantly, in your browser.",
};

export default function VatCalculatorPage() {
  return (
    <ToolShell
      icon="Percent"
      title="VAT Calculator"
      intro="Add or remove VAT from a price. Switch direction, pick a rate, and see the net, tax and gross amounts update instantly."
    >
      <VatTool />
    </ToolShell>
  );
}
