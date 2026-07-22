import { describe, expect, it } from "vitest";
import { calculateEmergencyFund } from "@/lib/tools/emergency-fund";

describe("calculateEmergencyFund", () => {
  it("case 1: recommends 3 months for secure employment with no dependents", () => {
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

  it("case 2: adds a month of coverage when there are dependents", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "secure",
      hasDependents: true,
      existingSavings: 0,
      monthlySavingsRate: 200,
    });
    expect(result.recommendedMonths).toBe(4);
  });

  it("case 3: recommends 9 months for self-employed", () => {
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

  it("case 4: reports zero gap and zero months once the target is already met", () => {
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

  it("case 5: returns null months-to-goal when there is a gap but no savings rate", () => {
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

  it("case 6: marks milestones reached based on existing savings", () => {
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

  it("case 7: recommends 5 months for standard job security", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2500,
      jobSecurity: "standard",
      hasDependents: false,
      existingSavings: 0,
      monthlySavingsRate: 300,
    });
    expect(result.recommendedMonths).toBe(5);
    expect(result.targetAmount).toBe(12500);
  });

  it("case 8: recommends 6 months for precarious job security, 7 with dependents", () => {
    const withoutDependents = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "precarious",
      hasDependents: false,
      existingSavings: 0,
      monthlySavingsRate: 100,
    });
    const withDependents = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "precarious",
      hasDependents: true,
      existingSavings: 0,
      monthlySavingsRate: 100,
    });
    expect(withoutDependents.recommendedMonths).toBe(6);
    expect(withDependents.recommendedMonths).toBe(7);
  });

  it("case 9: progress percentage is proportional to existing savings versus target, capped at 100", () => {
    const halfway = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "secure",
      hasDependents: false,
      existingSavings: 3000,
      monthlySavingsRate: 100,
    });
    expect(halfway.progressPct).toBeCloseTo(50, 6);

    const overfunded = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "secure",
      hasDependents: false,
      existingSavings: 999999,
      monthlySavingsRate: 100,
    });
    expect(overfunded.progressPct).toBe(100);
  });

  it("case 10: months-to-goal rounds up to a whole month (ceiling), not down", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "secure",
      hasDependents: false,
      existingSavings: 0,
      monthlySavingsRate: 400,
    });
    // target 6000 / 400 = 15 exactly
    expect(result.monthsToGoal).toBe(15);

    const uneven = calculateEmergencyFund({
      monthlyExpenses: 2000,
      jobSecurity: "secure",
      hasDependents: false,
      existingSavings: 0,
      monthlySavingsRate: 350,
    });
    // 6000 / 350 = 17.14... -> ceil to 18
    expect(uneven.monthsToGoal).toBe(18);
  });
});
