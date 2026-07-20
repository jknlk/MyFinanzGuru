import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import EmergencyFundTool from "@/components/tools/EmergencyFundTool";

export const metadata: Metadata = {
  title: "Emergency Fund Calculator",
  description:
    "Find your ideal financial safety net based on your expenses, job security and dependents.",
};

export default function EmergencyFundPage() {
  return (
    <ToolShell
      icon="ShieldCheck"
      title="Emergency Fund Calculator"
      intro="Work out how big your emergency fund (Notgroschen) should be, based on your living costs, job security and family situation — and how long it'll take to get there."
    >
      <EmergencyFundTool />
    </ToolShell>
  );
}
