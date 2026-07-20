export interface LoanInput {
  loanAmount: number;
  interestRatePct: number; // nominal annual rate
  years: number; // loan term used to compute the annuity
  fixedInterestYears: number; // Zinsbindung — when the rate is up for renewal
  specialRepaymentYearly: number; // Sondertilgung, applied once per year
}

export interface LoanYearPoint {
  year: number;
  startBalance: number;
  interestPaid: number;
  principalPaid: number;
  endBalance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  initialAmortizationPct: number;
  totalInterest: number;
  totalRepayment: number;
  remainingDebtAtFixedPeriod: number;
  principalPaidAtFixedPeriod: number;
  interestPaidAtFixedPeriod: number;
  schedule: LoanYearPoint[];
}

/**
 * Annuity loan: a constant monthly payment split between interest and
 * principal, with principal share growing over time as the balance shrinks.
 * An optional annual special repayment (Sondertilgung) reduces the balance
 * once a year, ahead of the following year's interest calculation.
 */
export function calculateLoan(input: LoanInput): LoanResult {
  const { loanAmount, interestRatePct, years, fixedInterestYears, specialRepaymentYearly } = input;

  const monthlyRate = interestRatePct / 100 / 12;
  const months = Math.round(years * 12);

  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  const initialAmortizationPct =
    ((monthlyPayment * 12 - loanAmount * (interestRatePct / 100)) / loanAmount) * 100;

  let balance = loanAmount;
  let totalInterest = 0;
  let totalPrincipal = 0;
  const schedule: LoanYearPoint[] = [];

  let remainingDebtAtFixedPeriod = loanAmount;
  let principalPaidAtFixedPeriod = 0;
  let interestPaidAtFixedPeriod = 0;

  const maxYears = Math.ceil(months / 12);

  for (let y = 1; y <= maxYears && balance > 0.005; y++) {
    const startBalance = balance;
    let yearInterest = 0;
    let yearPrincipal = 0;

    const monthsThisYear = Math.min(12, months - (y - 1) * 12);
    for (let m = 0; m < monthsThisYear && balance > 0.005; m++) {
      const interest = balance * monthlyRate;
      let principal = monthlyPayment - interest;
      if (principal > balance) principal = balance;
      balance -= principal;
      yearInterest += interest;
      yearPrincipal += principal;
    }

    if (specialRepaymentYearly > 0 && balance > 0.005) {
      const extra = Math.min(specialRepaymentYearly, balance);
      balance -= extra;
      yearPrincipal += extra;
    }

    totalInterest += yearInterest;
    totalPrincipal += yearPrincipal;

    schedule.push({
      year: y,
      startBalance,
      interestPaid: yearInterest,
      principalPaid: yearPrincipal,
      endBalance: balance,
    });

    if (y === fixedInterestYears) {
      remainingDebtAtFixedPeriod = balance;
      principalPaidAtFixedPeriod = totalPrincipal;
      interestPaidAtFixedPeriod = totalInterest;
    }
  }

  if (fixedInterestYears >= maxYears) {
    remainingDebtAtFixedPeriod = balance;
    principalPaidAtFixedPeriod = totalPrincipal;
    interestPaidAtFixedPeriod = totalInterest;
  }

  return {
    monthlyPayment,
    initialAmortizationPct,
    totalInterest,
    totalRepayment: totalInterest + totalPrincipal,
    remainingDebtAtFixedPeriod,
    principalPaidAtFixedPeriod,
    interestPaidAtFixedPeriod,
    schedule,
  };
}
