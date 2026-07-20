import { describe, expect, it } from "vitest";
import { calculateEmergencyFund } from "./emergency-fund";

describe("calculateEmergencyFund", () => {
  it("recommends 3 months for secure employment with no dependents", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "secure",
      hasDependents: false,
      existingSavings: 0,
      monthlySavingsRate: 200,
    });
    expect(result.recommendedMonths).toBe(3);
    expect(result.targetAmount).toBe(6000);
    expect(result.savingsGap).toBe(6000);
    expect(result.monthsToGoal).toBe(30);
  });

  it("adds a month of coverage when there are dependents", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "secure",
      hasDependents: true,
      existingSavings: 0,
      monthlySavingsRate: 200,
    });
    expect(result.recommendedMonths).toBe(4);
  });

  it("recommends 9 months for self-employed", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 3000,
      jobSecurity: "selfEmployed",
      hasDependents: false,
      existingSavings: 0,
      monthlySavingsRate: 500,
    });
    expect(result.recommendedMonths).toBe(9);
    expect(result.targetAmount).toBe(27000);
  });

  it("reports zero gap and zero months once the target is already met", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "secure",
      hasDependents: false,
      existingSavings: 10000,
      monthlySavingsRate: 200,
    });
    expect(result.savingsGap).toBe(0);
    expect(result.monthsToGoal).toBe(0);
    expect(result.progressPct).toBe(100);
  });

  it("returns null months-to-goal when there is a gap but no savings rate", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "standard",
      hasDependents: false,
      existingSavings: 0,
      monthlySavingsRate: 0,
    });
    expect(result.savingsGap).toBeGreaterThan(0);
    expect(result.monthsToGoal).toBeNull();
  });

  it("marks milestones reached based on existing savings", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "standard",
      hasDependents: false,
      existingSavings: 3000,
      monthlySavingsRate: 100,
    });
    expect(result.milestones.find((m) => m.amount === 1000)?.reached).toBe(true);
    expect(result.milestones.find((m) => m.amount === 2500)?.reached).toBe(true);
    expect(result.milestones.find((m) => m.amount === 5000)?.reached).toBe(false);
  });
});
