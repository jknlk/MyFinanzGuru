import { describe, expect, it } from "vitest";
import { calculateBruttoNetto } from "./brutto-netto";

const base = {
  period: "year" as const,
  taxClass: 1 as const,
  federalState: "Bayern",
  isChurchMember: false,
  children: 0,
  zusatzbeitragPct: 3.13,
  pensionInsuranceOn: true,
  unemploymentInsuranceOn: true,
};

describe("calculateBruttoNetto", () => {
  it("case A: €45,000/yr, tax class 1, no church, no children — net is positive and less than gross", () => {
    const result = calculateBruttoNetto({ ...base, grossSalary: 45000 });
    expect(result.grossYearly).toBe(45000);
    expect(result.netYearly).toBeGreaterThan(0);
    expect(result.netYearly).toBeLessThan(result.grossYearly);
    // Sanity band for a single-earner class 1 salary in this range (CLIENT MUST VERIFY exact figure).
    expect(result.netMonthly).toBeGreaterThan(2000);
    expect(result.netMonthly).toBeLessThan(2800);
  });

  it("case B: €80,000/yr, tax class 1, church member — church tax is deducted and reduces net", () => {
    const withChurch = calculateBruttoNetto({ ...base, grossSalary: 80000, isChurchMember: true });
    const withoutChurch = calculateBruttoNetto({ ...base, grossSalary: 80000, isChurchMember: false });
    expect(withChurch.breakdown.churchTaxMonthly).toBeGreaterThan(0);
    expect(withChurch.netMonthly).toBeLessThan(withoutChurch.netMonthly);
  });

  it("case C: €120,000/yr, tax class 3 (splitting) yields higher net than class 1 at the same gross", () => {
    const class1 = calculateBruttoNetto({ ...base, grossSalary: 120000, taxClass: 1 });
    const class3 = calculateBruttoNetto({ ...base, grossSalary: 120000, taxClass: 3 });
    expect(class3.netMonthly).toBeGreaterThan(class1.netMonthly);
  });

  it("all deduction line items plus net sum back to gross", () => {
    const result = calculateBruttoNetto({ ...base, grossSalary: 60000 });
    const sum =
      result.netMonthly +
      result.breakdown.incomeTaxMonthly +
      result.breakdown.soliMonthly +
      result.breakdown.churchTaxMonthly +
      result.breakdown.healthMonthly +
      result.breakdown.careMonthly +
      result.breakdown.pensionMonthly +
      result.breakdown.unemploymentMonthly;
    expect(sum).toBeCloseTo(result.grossMonthly, 6);
  });

  it("income below the Grundfreibetrag pays zero income tax", () => {
    const result = calculateBruttoNetto({ ...base, grossSalary: 11000 });
    expect(result.breakdown.incomeTaxMonthly).toBeCloseTo(0, 2);
  });

  it("disabling pension and unemployment insurance increases net pay", () => {
    const withInsurance = calculateBruttoNetto({ ...base, grossSalary: 50000 });
    const withoutInsurance = calculateBruttoNetto({
      ...base,
      grossSalary: 50000,
      pensionInsuranceOn: false,
      unemploymentInsuranceOn: false,
    });
    expect(withoutInsurance.netMonthly).toBeGreaterThan(withInsurance.netMonthly);
  });
});
