import { GRUNDERWERBSTEUER } from "@/lib/constants-2026";

export interface RealEstateInput {
  netIncomeMonthly: number;
  equity: number;
  interestRatePct: number;
  federalState: string;
  burdenRatioPct: number; // % of net income usable as monthly installment
  tilgungPct: number; // initial repayment rate, %
  fixedInterestYears: number;
  brokerageFeePct: number; // Maklerprovision, 0 = no broker
  safetyBufferOn: boolean; // keep 5% of equity as a cash buffer
  modernizationPct: number; // % of budget reserved for modernization
}

export interface AmortizationPoint {
  year: number;
  remainingDebt: number;
  equityBuilt: number;
}

export interface RealEstateResult {
  maxPurchasePrice: number;
  monthlyRate: number;
  burdenOfIncomePct: number;
  loanAmount: number;
  loanToValuePct: number;
  yearsToDebtFree: number | null; // null = beyond 40y cap
  remainingDebtAtFixedPeriodEnd: number;
  incidentalCosts: {
    grunderwerbsteuerPct: number;
    grunderwerbsteuer: number;
    notaryRegistry: number;
    brokerage: number;
    total: number;
  };
  amortizationSchedule: AmortizationPoint[];
  feasibility: "comfortable" | "feasible" | "tight";
  warnings: { title: string; message: string }[];
}

const NOTARY_REGISTRY_PCT = 1.5;
const MAX_YEARS = 40;

export function calculateRealEstate(input: RealEstateInput): RealEstateResult {
  const {
    netIncomeMonthly,
    equity,
    interestRatePct,
    federalState,
    burdenRatioPct,
    tilgungPct,
    fixedInterestYears,
    brokerageFeePct,
    safetyBufferOn,
    modernizationPct,
  } = input;

  const grunderwerbsteuerPct = GRUNDERWERBSTEUER[federalState] ?? 5.0;
  const incidentalRatePct = grunderwerbsteuerPct + NOTARY_REGISTRY_PCT + brokerageFeePct;

  const monthlyRate = netIncomeMonthly * (burdenRatioPct / 100);
  const annualRate = monthlyRate * 12;
  const debtServiceRatePct = interestRatePct + tilgungPct;
  const loanAmount = debtServiceRatePct > 0 ? annualRate / (debtServiceRatePct / 100) : 0;

  const usableEquity = equity * (safetyBufferOn ? 0.95 : 1) * (1 - modernizationPct / 100);

  const price = (loanAmount + usableEquity) / (1 + incidentalRatePct / 100);

  const grunderwerbsteuer = price * (grunderwerbsteuerPct / 100);
  const notaryRegistry = price * (NOTARY_REGISTRY_PCT / 100);
  const brokerage = price * (brokerageFeePct / 100);
  const incidentalTotal = grunderwerbsteuer + notaryRegistry + brokerage;

  const loanToValuePct = price > 0 ? (loanAmount / price) * 100 : 0;
  const burdenOfIncomePct = burdenRatioPct;

  // Amortization schedule: monthly compounding, fixed monthly installment.
  const monthlyInterestRate = interestRatePct / 100 / 12;
  let remaining = loanAmount;
  const schedule: AmortizationPoint[] = [{ year: 0, remainingDebt: remaining, equityBuilt: 0 }];
  let monthsElapsed = 0;
  let yearsToDebtFree: number | null = null;

  for (let year = 1; year <= MAX_YEARS; year++) {
    for (let m = 0; m < 12 && remaining > 0; m++) {
      const interest = remaining * monthlyInterestRate;
      const principal = Math.min(monthlyRate - interest, remaining);
      remaining = Math.max(0, remaining - principal);
      monthsElapsed++;
    }
    schedule.push({
      year,
      remainingDebt: remaining,
      equityBuilt: loanAmount - remaining,
    });
    if (remaining <= 0 && yearsToDebtFree === null) {
      yearsToDebtFree = Math.round((monthsElapsed / 12) * 10) / 10;
    }
    if (remaining <= 0) break;
  }

  const remainingDebtAtFixedPeriodEnd =
    schedule.find((p) => p.year === fixedInterestYears)?.remainingDebt ??
    schedule[schedule.length - 1].remainingDebt;

  const equityPct = price > 0 ? (usableEquity / price) * 100 : 0;

  let feasibility: RealEstateResult["feasibility"] = "comfortable";
  if (burdenOfIncomePct > 40 || loanToValuePct > 90) feasibility = "tight";
  else if (burdenOfIncomePct > 35 || loanToValuePct > 80) feasibility = "feasible";

  const warnings: { title: string; message: string }[] = [];
  if (equityPct < 20) {
    warnings.push({
      title: "Little equity",
      message: "Your equity share is below 20% — 20–30% would give you noticeably better loan terms.",
    });
  }
  if (loanToValuePct > 90) {
    warnings.push({
      title: "High loan-to-value ratio",
      message: "Your loan covers more than 90% of the property value. Below 80% you typically get meaningfully better conditions.",
    });
  }
  if (burdenOfIncomePct > 40) {
    warnings.push({
      title: "High burden ratio",
      message: "More than 40% of your net income would go toward the mortgage — this leaves little room for unexpected costs.",
    });
  }
  if (yearsToDebtFree === null) {
    warnings.push({
      title: "Very long repayment horizon",
      message: "At this repayment rate, the loan would not be fully repaid within 40 years. Consider a higher initial repayment (Tilgung).",
    });
  }

  return {
    maxPurchasePrice: Math.max(0, price),
    monthlyRate,
    burdenOfIncomePct,
    loanAmount,
    loanToValuePct,
    yearsToDebtFree,
    remainingDebtAtFixedPeriodEnd,
    incidentalCosts: {
      grunderwerbsteuerPct,
      grunderwerbsteuer,
      notaryRegistry,
      brokerage,
      total: incidentalTotal,
    },
    amortizationSchedule: schedule,
    feasibility,
    warnings,
  };
}
