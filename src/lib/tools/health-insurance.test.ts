import { describe, expect, it } from "vitest";
import { calculateHealthInsurance } from "./health-insurance";
import { GKV } from "@/lib/constants-2026";

describe("calculateHealthInsurance", () => {
  it("caps the GKV contribution base at the BBG for high earners", () => {
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

  it("does not cap the contribution base for income under the BBG", () => {
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

  it("employee below JAEG cannot switch to PKV", () => {
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

  it("self-employed can always consider PKV regardless of income", () => {
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

  it("childless members pay a higher care contribution than members with children", () => {
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

  it("PKV estimate increases with age", () => {
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
});
