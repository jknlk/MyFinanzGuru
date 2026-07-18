import { GKV, PKV_MODEL } from "@/lib/constants-2026";

export type EmploymentStatus = "employee" | "self-employed" | "civil-servant";
export type MaritalStatus = "single" | "married" | "married-children";

export interface HealthInsuranceInput {
  age: number;
  grossAnnualIncome: number;
  employmentStatus: EmploymentStatus;
  maritalStatus: MaritalStatus;
  federalState: string;
  zusatzbeitragPct: number;
}

export interface HealthInsuranceResult {
  canSwitchToPkv: boolean;
  gkv: {
    contributionBaseMonthly: number;
    healthMonthly: number;
    careMonthly: number;
    totalMonthly: number;
  };
  pkv: {
    estimateMonthly: number;
    lowMonthly: number;
    highMonthly: number;
  };
  differenceMonthly: number; // positive = PKV cheaper
  projection10y: { year: number; gkvCumulative: number; pkvCumulative: number }[];
}

export function calculateHealthInsurance(input: HealthInsuranceInput): HealthInsuranceResult {
  const { age, grossAnnualIncome, employmentStatus, maritalStatus, zusatzbeitragPct } = input;

  const grossMonthly = grossAnnualIncome / 12;
  const contributionBaseMonthly = Math.min(grossMonthly, GKV.BBG_HEALTH_MONTHLY);

  const totalHealthRatePct = GKV.GENERAL_RATE + zusatzbeitragPct;
  let careRatePct = GKV.CARE_RATE;
  if (maritalStatus === "single") careRatePct += GKV.CARE_CHILDLESS_SURCHARGE;

  // Employee: pays half of GKV + half of Zusatzbeitrag, plus half of care
  // (employer covers the other half). Self-employed pay the full amount.
  const employeeShare = employmentStatus === "self-employed" ? 1 : 0.5;

  const healthMonthly = contributionBaseMonthly * (totalHealthRatePct / 100) * employeeShare;
  const careMonthly = contributionBaseMonthly * (careRatePct / 100) * employeeShare;
  const gkvTotalMonthly = healthMonthly + careMonthly;

  const canSwitchToPkv =
    employmentStatus !== "employee" || grossAnnualIncome >= GKV.JAEG_YEARLY;

  // PKV illustrative model
  const ageFactor = Math.max(0, age - 30) * PKV_MODEL.AGE_FACTOR_PER_YEAR;
  let base = PKV_MODEL.BASE_PREMIUM + ageFactor;
  if (employmentStatus === "self-employed") base *= PKV_MODEL.SELF_EMPLOYED_MULTIPLIER;
  if (employmentStatus === "civil-servant") base *= PKV_MODEL.CIVIL_SERVANT_MULTIPLIER;

  const pkvEstimate = base;
  const pkvLow = base * (1 - PKV_MODEL.BAND);
  const pkvHigh = base * (1 + PKV_MODEL.BAND);

  const differenceMonthly = pkvEstimate === 0 ? 0 : gkvTotalMonthly - pkvEstimate;

  const projection10y = Array.from({ length: 10 }, (_, i) => {
    const year = i + 1;
    return {
      year,
      gkvCumulative: gkvTotalMonthly * 12 * year,
      pkvCumulative: pkvEstimate * 12 * year,
    };
  });

  return {
    canSwitchToPkv,
    gkv: {
      contributionBaseMonthly,
      healthMonthly,
      careMonthly,
      totalMonthly: gkvTotalMonthly,
    },
    pkv: {
      estimateMonthly: pkvEstimate,
      lowMonthly: pkvLow,
      highMonthly: pkvHigh,
    },
    differenceMonthly,
    projection10y,
  };
}
