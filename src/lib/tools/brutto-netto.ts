import { CHURCH_TAX_RATE, EST_2026, GKV, KINDERFREIBETRAG_PER_CHILD_YEARLY, SOLI } from "@/lib/constants-2026";

export type TaxClass = 1 | 2 | 3 | 4 | 5 | 6;
export type Period = "month" | "year";

export interface BruttoNettoInput {
  grossSalary: number;
  period: Period;
  taxClass: TaxClass;
  federalState: string;
  isChurchMember: boolean;
  children: number; // Kinderfreibeträge, 0-3 in 0.5 steps
  zusatzbeitragPct: number;
  pensionInsuranceOn: boolean;
  unemploymentInsuranceOn: boolean;
}

export interface BruttoNettoResult {
  grossMonthly: number;
  grossYearly: number;
  netMonthly: number;
  netYearly: number;
  breakdown: {
    incomeTaxMonthly: number;
    soliMonthly: number;
    churchTaxMonthly: number;
    healthMonthly: number;
    careMonthly: number;
    pensionMonthly: number;
    unemploymentMonthly: number;
  };
  employerTotalCostMonthly: number;
}

/** §32a EStG piecewise progressive formula. Returns annual income tax in €. */
function incomeTaxZoneFormula(zvE: number): number {
  const z = Math.max(0, Math.floor(zvE));
  const c = EST_2026;

  if (z <= c.GRUNDFREIBETRAG) return 0;

  if (z <= c.ZONE2_END) {
    const y = (z - c.GRUNDFREIBETRAG) / 10000;
    return Math.max(0, (c.ZONE2_A * y + c.ZONE2_B) * y);
  }

  if (z <= c.ZONE3_END) {
    const yZone = (c.ZONE2_END - c.GRUNDFREIBETRAG) / 10000;
    const taxAtZone2End = (c.ZONE2_A * yZone + c.ZONE2_B) * yZone;
    const zz = (z - c.ZONE2_END) / 10000;
    return taxAtZone2End + (c.ZONE3_C * zz + c.ZONE3_D) * zz;
  }

  if (z <= c.ZONE4_END) {
    return c.ZONE4_RATE * z - c.ZONE4_SUBTRAHEND;
  }

  return c.ZONE5_RATE * z - c.ZONE5_SUBTRAHEND;
}

/** Splitting procedure for married classes: tax on half the income, doubled. */
function splittingTax(zvE: number): number {
  return 2 * incomeTaxZoneFormula(zvE / 2);
}

const ENTLASTUNGSBETRAG_ALLEINERZIEHENDE = 4260; // CLIENT MUST VERIFY, tax class 2 only

function annualIncomeTax(zvE: number, taxClass: TaxClass): number {
  switch (taxClass) {
    case 1:
    case 4:
      return incomeTaxZoneFormula(zvE);
    case 2:
      return incomeTaxZoneFormula(Math.max(0, zvE - ENTLASTUNGSBETRAG_ALLEINERZIEHENDE));
    case 3:
      return splittingTax(zvE);
    case 5:
    case 6:
      // Simplified approximation: classes 5/6 assume the tax-free allowance
      // is used by the higher-earning class-3 partner (or, for class 6, by
      // the primary job), so the curve is applied without the Grundfreibetrag
      // step. This is a directional approximation, not the official
      // Steuerklasse-5/6 procedure — flagged in the tool disclaimer.
      return incomeTaxZoneFormula(zvE + EST_2026.GRUNDFREIBETRAG);
    default:
      return incomeTaxZoneFormula(zvE);
  }
}

export function calculateBruttoNetto(input: BruttoNettoInput): BruttoNettoResult {
  const {
    grossSalary,
    period,
    taxClass,
    federalState,
    isChurchMember,
    children,
    zusatzbeitragPct,
    pensionInsuranceOn,
    unemploymentInsuranceOn,
  } = input;

  const grossYearly = period === "year" ? grossSalary : grossSalary * 12;
  const grossMonthly = grossYearly / 12;

  // --- Social contributions (employee share), each capped at its own BBG ---
  const healthBase = Math.min(grossMonthly, GKV.BBG_HEALTH_MONTHLY);
  const pensionUnemploymentBase = Math.min(grossMonthly, GKV.BBG_PENSION_UNEMPLOYMENT_MONTHLY);

  const healthMonthly = healthBase * ((GKV.GENERAL_RATE + zusatzbeitragPct) / 2 / 100);

  let careRatePct = GKV.CARE_RATE / 2;
  if (children === 0) {
    careRatePct += GKV.CARE_CHILDLESS_SURCHARGE;
  } else {
    careRatePct -= Math.min(children, 4) * GKV.CARE_CHILD_DISCOUNT_PER_CHILD;
  }
  const careMonthly = healthBase * (Math.max(0, careRatePct) / 100);

  const pensionMonthly = pensionInsuranceOn
    ? pensionUnemploymentBase * (GKV.PENSION_RATE / 2 / 100)
    : 0;
  const unemploymentMonthly = unemploymentInsuranceOn
    ? pensionUnemploymentBase * (GKV.UNEMPLOYMENT_RATE / 2 / 100)
    : 0;

  const socialContributionsMonthly = healthMonthly + careMonthly + pensionMonthly + unemploymentMonthly;
  const socialContributionsYearly = socialContributionsMonthly * 12;

  // --- Taxable income: gross minus social contributions (simplified
  // Vorsorgepauschale substitute) ---
  const zvE = Math.max(0, grossYearly - socialContributionsYearly);

  const incomeTaxYearly = annualIncomeTax(zvE, taxClass);
  const incomeTaxMonthly = incomeTaxYearly / 12;

  // --- Soli & church tax base: income tax after child allowance reduction ---
  const kinderfreibetragYearly = children * KINDERFREIBETRAG_PER_CHILD_YEARLY;
  const zvEForSoliChurch = Math.max(0, zvE - kinderfreibetragYearly);
  const taxForSoliChurch =
    taxClass === 3
      ? splittingTax(zvEForSoliChurch)
      : incomeTaxZoneFormula(zvEForSoliChurch);

  const soliExemptThreshold =
    taxClass === 3 ? SOLI.EXEMPT_TAX_THRESHOLD_MARRIED : SOLI.EXEMPT_TAX_THRESHOLD_SINGLE;
  const soliYearly = taxForSoliChurch > soliExemptThreshold ? taxForSoliChurch * (SOLI.RATE / 100) : 0;
  const soliMonthly = soliYearly / 12;

  const churchRatePct = isChurchMember ? CHURCH_TAX_RATE[federalState] ?? 9 : 0;
  const churchTaxYearly = taxForSoliChurch * (churchRatePct / 100);
  const churchTaxMonthly = churchTaxYearly / 12;

  const netMonthly =
    grossMonthly -
    incomeTaxMonthly -
    soliMonthly -
    churchTaxMonthly -
    healthMonthly -
    careMonthly -
    pensionMonthly -
    unemploymentMonthly;

  const employerTotalCostMonthly = grossMonthly + socialContributionsMonthly; // employer matches contributions ~1:1 (simplified)

  return {
    grossMonthly,
    grossYearly,
    netMonthly,
    netYearly: netMonthly * 12,
    breakdown: {
      incomeTaxMonthly,
      soliMonthly,
      churchTaxMonthly,
      healthMonthly,
      careMonthly,
      pensionMonthly,
      unemploymentMonthly,
    },
    employerTotalCostMonthly,
  };
}
