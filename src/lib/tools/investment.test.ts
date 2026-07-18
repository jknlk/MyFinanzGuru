import { describe, expect, it } from "vitest";
import { calculateInvestment } from "./investment";

describe("calculateInvestment", () => {
  it("matches a known compound-interest case with no contributions", () => {
    // 10,000 at 7% annual for 10 years, monthly compounding, no contributions, no TER.
    const result = calculateInvestment({
      startingCapital: 10000,
      monthlyContribution: 0,
      contributionIncreasePct: 0,
      annualReturnPct: 7,
      years: 10,
      terPct: 0,
    });
    // 10000 * 1.07^10 ≈ 19671.51
    expect(result.finalValue).toBeCloseTo(19671.51, 0);
    expect(result.totalContributions).toBe(10000);
  });

  it("accumulates contributions with no growth when return is 0%", () => {
    const result = calculateInvestment({
      startingCapital: 0,
      monthlyContribution: 200,
      contributionIncreasePct: 0,
      annualReturnPct: 0,
      years: 5,
      terPct: 0,
    });
    expect(result.finalValue).toBeCloseTo(200 * 60, 2);
    expect(result.totalGains).toBeCloseTo(0, 2);
  });

  it("TER reduces final value versus the same run without TER", () => {
    const withTer = calculateInvestment({
      startingCapital: 5000,
      monthlyContribution: 200,
      contributionIncreasePct: 2,
      annualReturnPct: 7,
      years: 20,
      terPct: 0.2,
    });
    const withoutTer = calculateInvestment({
      startingCapital: 5000,
      monthlyContribution: 200,
      contributionIncreasePct: 2,
      annualReturnPct: 7,
      years: 20,
      terPct: 0,
    });
    expect(withTer.finalValue).toBeLessThan(withoutTer.finalValue);
  });

  it("escalates monthly contribution annually", () => {
    const result = calculateInvestment({
      startingCapital: 0,
      monthlyContribution: 100,
      contributionIncreasePct: 5,
      annualReturnPct: 0,
      years: 2,
      terPct: 0,
    });
    // Year 1: 12 * 100 = 1200. Year 2: 12 * 105 = 1260. Total = 2460.
    expect(result.finalValue).toBeCloseTo(2460, 2);
  });
});
