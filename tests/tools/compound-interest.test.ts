import { describe, expect, it } from "vitest";
import { calculateCompoundInterest } from "@/lib/tools/compound-interest";

describe("calculateCompoundInterest", () => {
  it("case 1: matches Endkapital = Startkapital * (1 + Zins)^Jahre with no contributions", () => {
    const result = calculateCompoundInterest({
      startingCapital: 10000,
      monthlyContribution: 0,
      annualRatePct: 5,
      years: 10,
      compounding: "annually",
    });
    // 10000 * 1.05^10 = 16288.946...
    expect(result.finalValue).toBeCloseTo(16288.95, 1);
    expect(result.totalContributions).toBe(10000);
  });

  it("case 2: accumulates monthly contributions with no growth at 0% rate", () => {
    const result = calculateCompoundInterest({
      startingCapital: 0,
      monthlyContribution: 150,
      annualRatePct: 0,
      years: 4,
      compounding: "monthly",
    });
    expect(result.finalValue).toBeCloseTo(150 * 48, 2);
    expect(result.totalInterest).toBeCloseTo(0, 2);
  });

  it("case 3: monthly compounding beats annual compounding at the same nominal rate", () => {
    const monthly = calculateCompoundInterest({
      startingCapital: 10000,
      monthlyContribution: 0,
      annualRatePct: 6,
      years: 15,
      compounding: "monthly",
    });
    const annually = calculateCompoundInterest({
      startingCapital: 10000,
      monthlyContribution: 0,
      annualRatePct: 6,
      years: 15,
      compounding: "annually",
    });
    expect(monthly.finalValue).toBeGreaterThan(annually.finalValue);
  });

  it("case 4: builds a yearly series ending at the final value", () => {
    const result = calculateCompoundInterest({
      startingCapital: 1000,
      monthlyContribution: 50,
      annualRatePct: 4,
      years: 5,
      compounding: "monthly",
    });
    expect(result.series).toHaveLength(6); // year 0 through 5
    expect(result.series.at(-1)!.totalValue).toBeCloseTo(result.finalValue, 6);
  });

  it("case 5: €1,000 at 10% annually for 5 years, no contributions", () => {
    const result = calculateCompoundInterest({
      startingCapital: 1000,
      monthlyContribution: 0,
      annualRatePct: 10,
      years: 5,
      compounding: "annually",
    });
    // 1000 * 1.1^5 = 1610.51
    expect(result.finalValue).toBeCloseTo(1610.51, 1);
  });

  it("case 6: €500 start + €100/mo at 6% monthly compounding for 1 year", () => {
    const result = calculateCompoundInterest({
      startingCapital: 500,
      monthlyContribution: 100,
      annualRatePct: 6,
      years: 1,
      compounding: "monthly",
    });
    expect(result.finalValue).toBeCloseTo(1764.4, 1);
    expect(result.totalContributions).toBe(1700);
  });

  it("case 7: €2,000 start + €50/mo at 8% monthly compounding for 3 years", () => {
    const result = calculateCompoundInterest({
      startingCapital: 2000,
      monthlyContribution: 50,
      annualRatePct: 8,
      years: 3,
      compounding: "monthly",
    });
    expect(result.finalValue).toBeCloseTo(4567.25, 1);
    expect(result.totalContributions).toBe(3800);
  });

  it("case 8: €0 start + €100/mo at 5% annually for 3 years", () => {
    const result = calculateCompoundInterest({
      startingCapital: 0,
      monthlyContribution: 100,
      annualRatePct: 5,
      years: 3,
      compounding: "annually",
    });
    expect(result.finalValue).toBeCloseTo(3783, 0);
    expect(result.totalContributions).toBe(3600);
  });

  it("case 9: zero starting capital and zero contributions yields zero at any rate", () => {
    const result = calculateCompoundInterest({
      startingCapital: 0,
      monthlyContribution: 0,
      annualRatePct: 7,
      years: 20,
      compounding: "annually",
    });
    expect(result.finalValue).toBe(0);
    expect(result.totalInterest).toBe(0);
  });

  it("case 10: a higher rate always produces a higher final value, all else equal", () => {
    const lowerRate = calculateCompoundInterest({
      startingCapital: 5000,
      monthlyContribution: 100,
      annualRatePct: 3,
      years: 10,
      compounding: "monthly",
    });
    const higherRate = calculateCompoundInterest({
      startingCapital: 5000,
      monthlyContribution: 100,
      annualRatePct: 7,
      years: 10,
      compounding: "monthly",
    });
    expect(higherRate.finalValue).toBeGreaterThan(lowerRate.finalValue);
  });
});
