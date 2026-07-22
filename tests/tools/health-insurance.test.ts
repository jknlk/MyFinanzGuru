import { describe, expect, it } from "vitest";
import { calculateHealthInsurance } from "@/lib/tools/health-insurance";
import { GKV } from "@/lib/constants-2026";

describe("calculateHealthInsurance", () => {
  it("case 1: caps the GKV contribution base at the BBG for high earners", () => {
    const result = calculateHealthInsurance({
      age: 40,
      grossAnnualIncome: 150000,
      employmentStatus: "employee",
      maritalStatus: "married",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    expect(result.gkv.contributionBaseMonthly).toBeCloseTo(GKV.BBG_HEALTH_MONTHLY, 2);
  });

  it("case 2: does not cap the contribution base for income under the BBG", () => {
    const result = calculateHealthInsurance({
      age: 30,
      grossAnnualIncome: 36000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    expect(result.gkv.contributionBaseMonthly).toBeCloseTo(3000, 2);
  });

  it("case 3: employee below JAEG cannot switch to PKV", () => {
    const result = calculateHealthInsurance({
      age: 30,
      grossAnnualIncome: 40000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    expect(result.canSwitchToPkv).toBe(false);
  });

  it("case 4: self-employed can always consider PKV regardless of income", () => {
    const result = calculateHealthInsurance({
      age: 30,
      grossAnnualIncome: 30000,
      employmentStatus: "self-employed",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    expect(result.canSwitchToPkv).toBe(true);
  });

  it("case 5: childless members pay a higher care contribution than members with children", () => {
    const childless = calculateHealthInsurance({
      age: 35,
      grossAnnualIncome: 50000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    const withChildren = calculateHealthInsurance({
      age: 35,
      grossAnnualIncome: 50000,
      employmentStatus: "employee",
      maritalStatus: "married-children",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    expect(childless.gkv.careMonthly).toBeGreaterThan(withChildren.gkv.careMonthly);
  });

  it("case 6: PKV estimate increases with age", () => {
    const younger = calculateHealthInsurance({
      age: 25,
      grossAnnualIncome: 90000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    const older = calculateHealthInsurance({
      age: 55,
      grossAnnualIncome: 90000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    expect(older.pkv.estimateMonthly).toBeGreaterThan(younger.pkv.estimateMonthly);
  });

  it("case 7: self-employed pay the full contribution while employees split it with an employer", () => {
    const employee = calculateHealthInsurance({
      age: 35,
      grossAnnualIncome: 50000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    const selfEmployed = calculateHealthInsurance({
      age: 35,
      grossAnnualIncome: 50000,
      employmentStatus: "self-employed",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    expect(selfEmployed.gkv.totalMonthly).toBeCloseTo(employee.gkv.totalMonthly * 2, 2);
  });

  it("case 8: civil servants get a materially lower PKV estimate thanks to Beihilfe", () => {
    const employee = calculateHealthInsurance({
      age: 40,
      grossAnnualIncome: 90000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    const civilServant = calculateHealthInsurance({
      age: 40,
      grossAnnualIncome: 90000,
      employmentStatus: "civil-servant",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    expect(civilServant.pkv.estimateMonthly).toBeLessThan(employee.pkv.estimateMonthly);
  });

  it("case 9: a higher Zusatzbeitrag increases the GKV health contribution", () => {
    const lowAddon = calculateHealthInsurance({
      age: 35,
      grossAnnualIncome: 50000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 1.0,
    });
    const highAddon = calculateHealthInsurance({
      age: 35,
      grossAnnualIncome: 50000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 4.0,
    });
    expect(highAddon.gkv.healthMonthly).toBeGreaterThan(lowAddon.gkv.healthMonthly);
  });

  it("case 10: the 10-year projection accumulates linearly at 12x the monthly premium per year", () => {
    const result = calculateHealthInsurance({
      age: 40,
      grossAnnualIncome: 60000,
      employmentStatus: "employee",
      maritalStatus: "single",
      federalState: "Bayern",
      zusatzbeitragPct: 3.13,
    });
    expect(result.projection10y).toHaveLength(10);
    expect(result.projection10y[0].gkvCumulative).toBeCloseTo(result.gkv.totalMonthly * 12, 6);
    expect(result.projection10y[9].gkvCumulative).toBeCloseTo(result.gkv.totalMonthly * 12 * 10, 4);
  });
});
