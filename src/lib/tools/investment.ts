export type ContributionIncrease = 0 | 1 | 2 | 3 | 5;

export interface InvestmentInput {
  startingCapital: number;
  monthlyContribution: number;
  contributionIncreasePct: ContributionIncrease;
  annualReturnPct: number;
  years: number;
  terPct: number; // total expense ratio, deducted from return; 0 if disabled
  inflationPct?: number; // if provided, also compute inflation-adjusted series
}

export interface YearPoint {
  year: number;
  contributions: number;
  growth: number;
  totalValue: number;
  totalValueReal?: number;
}

export interface InvestmentResult {
  finalValue: number;
  totalContributions: number;
  totalGains: number;
  series: YearPoint[];
}

/**
 * Monthly-compounding investment projection with an annually escalating
 * contribution and an optional TER drag on the return rate.
 */
export function calculateInvestment(input: InvestmentInput): InvestmentResult {
  const {
    startingCapital,
    monthlyContribution,
    contributionIncreasePct,
    annualReturnPct,
    years,
    terPct,
    inflationPct,
  } = input;

  const netAnnualReturn = Math.max(0, annualReturnPct - terPct);
  const monthlyRate = Math.pow(1 + netAnnualReturn / 100, 1 / 12) - 1;

  let balance = startingCapital;
  let totalContributions = startingCapital;
  let currentMonthlyContribution = monthlyContribution;

  const series: YearPoint[] = [
    { year: 0, contributions: totalContributions, growth: 0, totalValue: balance },
  ];

  const months = Math.round(years * 12);

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate) + currentMonthlyContribution;
    totalContributions += currentMonthlyContribution;

    if (m % 12 === 0) {
      currentMonthlyContribution *= 1 + contributionIncreasePct / 100;
      const year = m / 12;
      const growth = balance - totalContributions;
      const point: YearPoint = { year, contributions: totalContributions, growth, totalValue: balance };
      if (inflationPct !== undefined) {
        point.totalValueReal = balance / Math.pow(1 + inflationPct / 100, year);
      }
      series.push(point);
    }
  }

  const finalValue = balance;
  const totalGains = finalValue - totalContributions;

  return { finalValue, totalContributions, totalGains, series };
}
