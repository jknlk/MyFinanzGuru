import { describe, expect, it } from "vitest";
import { calculateRealEstate } from "@/lib/tools/real-estate";

const baseInput = {
  netIncomeMonthly: 4000,
  equity: 50000,
  interestRatePct: 3.5,
  federalState: "Bayern",
  burdenRatioPct: 35,
  tilgungPct: 2,
  fixedInterestYears: 10,
  brokerageFeePct: 0,
  safetyBufferOn: false,
  modernizationPct: 0,
};

describe("calculateRealEstate", () => {
  it("case 1: computes a positive purchase price with sane loan-to-value", () => {
    const result = calculateRealEstate(baseInput);
    expect(result.maxPurchasePrice).toBeGreaterThan(0);
    expect(result.loanToValuePct).toBeGreaterThan(0);
    expect(result.loanToValuePct).toBeLessThan(100);
  });

  it("case 2: monthly rate equals income times burden ratio", () => {
    const result = calculateRealEstate(baseInput);
    expect(result.monthlyRate).toBeCloseTo(4000 * 0.35, 2);
  });

  it("case 3: higher equity increases the max purchase price", () => {
    const low = calculateRealEstate({ ...baseInput, equity: 20000 });
    const high = calculateRealEstate({ ...baseInput, equity: 100000 });
    expect(high.maxPurchasePrice).toBeGreaterThan(low.maxPurchasePrice);
  });

  it("case 4: higher Grunderwerbsteuer state reduces purchase price vs a lower-tax state", () => {
    const lowTaxState = calculateRealEstate({ ...baseInput, federalState: "Bayern" }); // 3.5%
    const highTaxState = calculateRealEstate({ ...baseInput, federalState: "Nordrhein-Westfalen" }); // 6.5%
    expect(highTaxState.maxPurchasePrice).toBeLessThan(lowTaxState.maxPurchasePrice);
  });

  it("case 5: flags low equity and high burden ratio with warnings", () => {
    const result = calculateRealEstate({
      ...baseInput,
      equity: 5000,
      burdenRatioPct: 45,
    });
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.feasibility).toBe("tight");
  });

  it("case 6: amortization schedule ends at zero remaining debt", () => {
    const result = calculateRealEstate(baseInput);
    const last = result.amortizationSchedule[result.amortizationSchedule.length - 1];
    expect(last.remainingDebt).toBeGreaterThanOrEqual(0);
    expect(last.remainingDebt).toBeLessThan(1);
  });

  it("case 7: matches exact incidental costs and purchase price for a fully specified input", () => {
    const result = calculateRealEstate({
      netIncomeMonthly: 5000,
      equity: 80000,
      interestRatePct: 3,
      federalState: "Berlin",
      burdenRatioPct: 30,
      tilgungPct: 2,
      fixedInterestYears: 10,
      brokerageFeePct: 3.57,
      safetyBufferOn: true,
      modernizationPct: 10,
    });
    expect(result.loanAmount).toBeCloseTo(360000, 0);
    expect(result.maxPurchasePrice).toBeCloseTo(385702.71, 1);
    expect(result.loanToValuePct).toBeCloseTo(93.34, 1);
    expect(result.incidentalCosts.total).toBeCloseTo(42697.29, 1);
  });

  it("case 8: a zero-equity buyer still gets a positive loan-based price, with the loan exceeding the price (incidental costs financed too)", () => {
    const result = calculateRealEstate({ ...baseInput, equity: 0 });
    expect(result.loanAmount).toBeGreaterThan(0);
    expect(result.maxPurchasePrice).toBeGreaterThan(0);
    expect(result.loanToValuePct).toBeCloseTo(105, 1);
  });

  it("case 9: enabling the safety buffer reduces usable equity and thus the purchase price", () => {
    const withoutBuffer = calculateRealEstate({ ...baseInput, safetyBufferOn: false });
    const withBuffer = calculateRealEstate({ ...baseInput, safetyBufferOn: true });
    expect(withBuffer.maxPurchasePrice).toBeLessThan(withoutBuffer.maxPurchasePrice);
  });

  it("case 10: a higher initial repayment rate (Tilgung) shortens years to debt-free", () => {
    const slow = calculateRealEstate({ ...baseInput, tilgungPct: 1 });
    const fast = calculateRealEstate({ ...baseInput, tilgungPct: 4 });
    expect(fast.yearsToDebtFree).not.toBeNull();
    expect(slow.yearsToDebtFree === null || fast.yearsToDebtFree! < slow.yearsToDebtFree!).toBe(true);
  });
});
