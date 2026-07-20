import { describe, expect, it } from "vitest";
import { calculateLoan } from "./loan";

describe("calculateLoan", () => {
  it("splits an interest-free loan evenly across the term with zero interest", () => {
    const result = calculateLoan({
      loanAmount: 12000,
      interestRatePct: 0,
      years: 1,
      fixedInterestYears: 10,
      specialRepaymentYearly: 0,
    });
    expect(result.monthlyPayment).toBeCloseTo(1000, 6);
    expect(result.totalInterest).toBeCloseTo(0, 6);
    expect(result.schedule.at(-1)!.endBalance).toBeCloseTo(0, 6);
  });

  it("fully amortizes an interest-bearing loan by the end of the term", () => {
    const result = calculateLoan({
      loanAmount: 200000,
      interestRatePct: 4,
      years: 25,
      fixedInterestYears: 10,
      specialRepaymentYearly: 0,
    });
    expect(result.schedule.at(-1)!.endBalance).toBeCloseTo(0, 2);
    const totalPrincipal = result.schedule.reduce((sum, y) => sum + y.principalPaid, 0);
    expect(totalPrincipal).toBeCloseTo(200000, 1);
    expect(result.totalRepayment).toBeCloseTo(200000 + result.totalInterest, 1);
  });

  it("computes initial amortization as annuity rate minus interest rate", () => {
    const result = calculateLoan({
      loanAmount: 100000,
      interestRatePct: 4,
      years: 30,
      fixedInterestYears: 10,
      specialRepaymentYearly: 0,
    });
    const annuityPct = (result.monthlyPayment * 12 * 100) / 100000;
    expect(result.initialAmortizationPct).toBeCloseTo(annuityPct - 4, 6);
  });

  it("reduces total interest when a yearly special repayment is made", () => {
    const withoutExtra = calculateLoan({
      loanAmount: 150000,
      interestRatePct: 3.5,
      years: 20,
      fixedInterestYears: 10,
      specialRepaymentYearly: 0,
    });
    const withExtra = calculateLoan({
      loanAmount: 150000,
      interestRatePct: 3.5,
      years: 20,
      fixedInterestYears: 10,
      specialRepaymentYearly: 5000,
    });
    expect(withExtra.totalInterest).toBeLessThan(withoutExtra.totalInterest);
  });

  it("reports the remaining debt at the fixed-interest-period milestone", () => {
    const result = calculateLoan({
      loanAmount: 100000,
      interestRatePct: 3,
      years: 30,
      fixedInterestYears: 10,
      specialRepaymentYearly: 0,
    });
    expect(result.remainingDebtAtFixedPeriod).toBeCloseTo(result.schedule[9].endBalance, 6);
    expect(result.remainingDebtAtFixedPeriod).toBeLessThan(100000);
    expect(result.remainingDebtAtFixedPeriod).toBeGreaterThan(0);
  });
});
