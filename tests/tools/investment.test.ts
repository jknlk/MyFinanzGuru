import { describe, expect, it } from "vitest";
import { calculateInvestment } from "@/lib/tools/investment";

describe("calculateInvestment", () => {
  it("case 1: matches a known compound-interest case with no contributions", () => {
    // 10,000 at 7% annual for 10 years, monthly compounding, no contributions, no TER.
    const result = calculateInvestment({
      startingCapital: 10000,
      monthlyContribution: 0,
      contributionIncreasePct: 0,
      annualReturnPct: 7,
      years: 10,
      terPct: 0,
    });
    // 10000 * 1.07^10 = 19671.51
    expect(result.finalValue).toBeCloseTo(19671.51, 0);
    expect(result.totalContributions).toBe(10000);
  });

  it("case 2: accumulates contributions with no growth when return is 0%", () => {
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

  it("case 3: TER reduces final value versus the same run without TER", () => {
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

  it("case 4: escalates the monthly contribution annually", () => {
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

  it("case 5: €2,000 start + €150/mo at 5% return for 10 years, no TER", () => {
    const result = calculateInvestment({
      startingCapital: 2000,
      monthlyContribution: 150,
      contributionIncreasePct: 0,
      annualReturnPct: 5,
      years: 10,
      terPct: 0,
    });
    expect(result.finalValue).toBeCloseTo(26412.26, 1);
    expect(result.totalContributions).toBe(20000);
  });

  it("case 6: €0 start + €300/mo escalating 3%/yr at 6% return for 15 years", () => {
    const result = calculateInvestment({
      startingCapital: 0,
      monthlyContribution: 300,
      contributionIncreasePct: 3,
      annualReturnPct: 6,
      years: 15,
      terPct: 0,
    });
    expect(result.finalValue).toBeCloseTo(103369.13, 1);
    expect(result.totalContributions).toBeCloseTo(66956.09, 1);
  });

  it("case 7: TER above the gross return clamps the net return to zero, not negative", () => {
    const result = calculateInvestment({
      startingCapital: 1000,
      monthlyContribution: 0,
      contributionIncreasePct: 0,
      annualReturnPct: 2,
      years: 5,
      terPct: 5,
    });
    expect(result.finalValue).toBe(1000);
    expect(result.totalGains).toBe(0);
  });

  it("case 8: reports an inflation-adjusted real value when inflationPct is provided", () => {
    const result = calculateInvestment({
      startingCapital: 10000,
      monthlyContribution: 0,
      contributionIncreasePct: 0,
      annualReturnPct: 5,
      years: 1,
      terPct: 0,
      inflationPct: 2,
    });
    expect(result.series.at(-1)!.totalValue).toBeCloseTo(10500, 2);
    expect(result.series.at(-1)!.totalValueReal).toBeCloseTo(10294.12, 1);
  });

  it("case 9: omitting inflationPct leaves totalValueReal undefined", () => {
    const result = calculateInvestment({
      startingCapital: 10000,
      monthlyContribution: 0,
      contributionIncreasePct: 0,
      annualReturnPct: 5,
      years: 1,
      terPct: 0,
    });
    expect(result.series.at(-1)!.totalValueReal).toBeUndefined();
  });

  it("case 10: a higher contribution increase leads to a higher final value, all else equal", () => {
    const flat = calculateInvestment({
      startingCapital: 5000,
      monthlyContribution: 100,
      contributionIncreasePct: 0,
      annualReturnPct: 5,
      years: 10,
      terPct: 0,
    });
    const escalating = calculateInvestment({
      startingCapital: 5000,
      monthlyContribution: 100,
      contributionIncreasePct: 5,
      annualReturnPct: 5,
      years: 10,
      terPct: 0,
    });
    expect(escalating.finalValue).toBeGreaterThan(flat.finalValue);
  });
});
