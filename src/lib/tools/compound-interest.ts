export type CompoundingFrequency = "annually" | "monthly";

export interface CompoundInterestInput {
  startingCapital: number;
  monthlyContribution: number;
  annualRatePct: number;
  years: number;
  compounding: CompoundingFrequency;
}

export interface CompoundInterestYearPoint {
  year: number;
  contributions: number;
  interest: number;
  totalValue: number;
}

export interface CompoundInterestResult {
  finalValue: number;
  totalContributions: number;
  totalInterest: number;
  series: CompoundInterestYearPoint[];
}

/**
 * Classic Zinseszins projection: Endkapital = Startkapital * (1 + Zins)^Jahre
 * for a lump sum, extended with regular monthly contributions that each
 * compound for the remaining time until the horizon.
 */
export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { startingCapital, monthlyContribution, annualRatePct, years, compounding } = input;

  const periodsPerYear = compounding === "monthly" ? 12 : 1;
  const ratePerPeriod = annualRatePct / 100 / periodsPerYear;
  const contributionPerPeriod = compounding === "monthly" ? monthlyContribution : monthlyContribution * 12;

  let balance = startingCapital;
  let totalContributions = startingCapital;
  const series: CompoundInterestYearPoint[] = [
    { year: 0, contributions: totalContributions, interest: 0, totalValue: balance },
  ];

  const totalPeriods = Math.round(years * periodsPerYear);
  const periodsPerYearForSeries = periodsPerYear;

  for (let p = 1; p <= totalPeriods; p++) {
    balance = balance * (1 + ratePerPeriod) + contributionPerPeriod;
    totalContributions += contributionPerPeriod;

    if (p % periodsPerYearForSeries === 0) {
      const year = p / periodsPerYearForSeries;
      series.push({
        year,
        contributions: totalContributions,
        interest: balance - totalContributions,
        totalValue: balance,
      });
    }
  }

  const finalValue = balance;
  const totalInterest = finalValue - totalContributions;

  return { finalValue, totalContributions, totalInterest, series };
}
