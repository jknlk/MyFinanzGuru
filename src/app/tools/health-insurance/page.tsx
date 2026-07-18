import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import HealthInsuranceTool from "@/components/tools/HealthInsuranceTool";

export const metadata: Metadata = {
  title: "Health Insurance Calculator — GKV vs. PKV",
  description:
    "Compare statutory (GKV) and private (PKV) health insurance side by side for your 2026 situation.",
};

export default function HealthInsurancePage() {
  return (
    <ToolShell
      image="/images/tool-health-insurance.png"
      imageAlt="A minimal 3D shield icon with a medical cross, in glossy blue tones"
      title="Health Insurance Calculator"
      intro="Public (GKV) or private (PKV) — which is worth it for you? Enter your details and get a direct comparison for 2026."
    >
      <HealthInsuranceTool />
    </ToolShell>
  );
}
