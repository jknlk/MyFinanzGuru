import type { Metadata } from "next";
import ToolShell from "@/components/tools/ToolShell";
import LoanPaymentTool from "@/components/tools/LoanPaymentTool";

export const metadata: Metadata = {
  title: "Loan Payment Calculator",
  description:
    "Work out your monthly loan rate, the interest and principal split, and your remaining debt at the end of the fixed-interest period.",
};

export default function LoanPaymentPage() {
  return (
    <ToolShell
      icon="Landmark"
      title="Loan Payment Calculator"
      intro="Enter your loan amount, interest rate and term to see your monthly annuity payment, how it splits between interest and principal, and your remaining debt at the end of the fixed-rate period."
    >
      <LoanPaymentTool />
    </ToolShell>
  );
}
