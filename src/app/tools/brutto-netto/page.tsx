import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import BruttoNettoTool from "@/components/tools/BruttoNettoTool";

export const metadata: Metadata = {
  title: "Brutto-Netto Calculator",
  description: "See exactly what lands in your account after tax and social contributions — 2026 rates.",
};

export default function BruttoNettoPage() {
  return (
    <ToolShell
      image="/images/tool-brutto-netto.png"
      imageAlt="A minimal 3D wallet icon with a calculator, in glossy blue tones"
      title="Brutto-Netto Calculator"
      intro="See exactly what lands in your account after income tax, Soli, church tax, and social insurance — for a standard 2026 employee salary."
    >
      <BruttoNettoTool />
    </ToolShell>
  );
}
