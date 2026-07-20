import { describe, expect, it } from "vitest";
import { calculateCompoundInterest } from "./compound-interest";

describe("calculateCompoundInterest", () => {
  it("matches the classic Endkapital = Startkapital * (1 + Zins)^Jahre formula with no contributions", () => {
    const result = calculateCompoundInterest({
      startingCapital: 10000,
      monthlyContribution: 0,
      annualRatePct: 5,
      years: 10,
      compounding: "annually",
    });
    // 10000 * 1.05^10 ≈ 16288.95
    expect(result.finalValue).toBeCloseTo(16288.95, 1);
    expect(result.totalContributions).toBe(10000);
  });

  it("accumulates monthly contributions with no growth when the rate is 0%", () => {
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

  it("produces a higher final value with monthly compounding than annual for the same nominal rate", () => {
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

  it("builds a yearly series ending at the final value", () => {
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
});
