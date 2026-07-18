import { describe, expect, it } from "vitest";
import { calculateRealEstate } from "./real-estate";

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
  it("computes a positive purchase price with sane loan-to-value", () => {
    const result = calculateRealEstate(baseInput);
    expect(result.maxPurchasePrice).toBeGreaterThan(0);
    expect(result.loanToValuePct).toBeGreaterThan(0);
    expect(result.loanToValuePct).toBeLessThan(100);
  });

  it("monthly rate equals income times burden ratio", () => {
    const result = calculateRealEstate(baseInput);
    expect(result.monthlyRate).toBeCloseTo(4000 * 0.35, 2);
  });

  it("higher equity increases the max purchase price", () => {
    const low = calculateRealEstate({ ...baseInput, equity: 20000 });
    const high = calculateRealEstate({ ...baseInput, equity: 100000 });
    expect(high.maxPurchasePrice).toBeGreaterThan(low.maxPurchasePrice);
  });

  it("higher Grunderwerbsteuer state reduces purchase price vs a lower-tax state", () => {
    const lowTaxState = calculateRealEstate({ ...baseInput, federalState: "Bayern" }); // 3.5%
    const highTaxState = calculateRealEstate({ ...baseInput, federalState: "Nordrhein-Westfalen" }); // 6.5%
    expect(highTaxState.maxPurchasePrice).toBeLessThan(lowTaxState.maxPurchasePrice);
  });

  it("flags low equity and high burden ratio with warnings", () => {
    const result = calculateRealEstate({
      ...baseInput,
      equity: 5000,
      burdenRatioPct: 45,
    });
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.feasibility).toBe("tight");
  });

  it("amortization schedule ends at zero remaining debt", () => {
    const result = calculateRealEstate(baseInput);
    const last = result.amortizationSchedule[result.amortizationSchedule.length - 1];
    expect(last.remainingDebt).toBeGreaterThanOrEqual(0);
    expect(last.remainingDebt).toBeLessThan(1);
  });
});
