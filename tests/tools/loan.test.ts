import { describe, expect, it } from "vitest";
import { calculateLoan } from "@/lib/tools/loan";

describe("calculateLoan", () => {
  it("case 1: splits an interest-free loan evenly across the term", () => {
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

  it("case 2: fully amortizes an interest-bearing loan by the end of the term", () => {
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

  it("case 3: computes initial amortization as annuity rate minus interest rate", () => {
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

  it("case 4: a yearly special repayment reduces total interest", () => {
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

  it("case 5: reports the remaining debt at the fixed-interest-period milestone", () => {
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

  it("case 6: €300,000 at 3.5% over 20 years matches the exact annuity and 5-year balance", () => {
    const result = calculateLoan({
      loanAmount: 300000,
      interestRatePct: 3.5,
      years: 20,
      fixedInterestYears: 5,
      specialRepaymentYearly: 0,
    });
    expect(result.monthlyPayment).toBeCloseTo(1739.88, 1);
    expect(result.remainingDebtAtFixedPeriod).toBeCloseTo(243379.72, 1);
    expect(result.totalInterest).toBeCloseTo(117571, 0);
  });

  it("case 7: zero-interest loan with an annual special repayment finishes early", () => {
    const result = calculateLoan({
      loanAmount: 24000,
      interestRatePct: 0,
      years: 2,
      fixedInterestYears: 1,
      specialRepaymentYearly: 2000,
    });
    expect(result.monthlyPayment).toBeCloseTo(1000, 6);
    expect(result.totalInterest).toBeCloseTo(0, 6);
    expect(result.remainingDebtAtFixedPeriod).toBeCloseTo(10000, 6);
    expect(result.schedule.at(-1)!.endBalance).toBeCloseTo(0, 6);
  });

  it("case 8: €50,000 at 5% over 10 years pays off exactly at term end", () => {
    const result = calculateLoan({
      loanAmount: 50000,
      interestRatePct: 5,
      years: 10,
      fixedInterestYears: 10,
      specialRepaymentYearly: 0,
    });
    expect(result.monthlyPayment).toBeCloseTo(530.33, 1);
    expect(result.totalInterest).toBeCloseTo(13639.31, 1);
    expect(result.remainingDebtAtFixedPeriod).toBeCloseTo(0, 2);
  });

  it("case 9: a higher interest rate always increases total interest paid, all else equal", () => {
    const lowerRate = calculateLoan({
      loanAmount: 200000,
      interestRatePct: 2,
      years: 25,
      fixedInterestYears: 10,
      specialRepaymentYearly: 0,
    });
    const higherRate = calculateLoan({
      loanAmount: 200000,
      interestRatePct: 5,
      years: 25,
      fixedInterestYears: 10,
      specialRepaymentYearly: 0,
    });
    expect(higherRate.totalInterest).toBeGreaterThan(lowerRate.totalInterest);
  });

  it("case 10: the schedule's remaining debt never goes negative", () => {
    const result = calculateLoan({
      loanAmount: 80000,
      interestRatePct: 6,
      years: 5,
      fixedInterestYears: 5,
      specialRepaymentYearly: 10000,
    });
    result.schedule.forEach((point) => {
      expect(point.endBalance).toBeGreaterThanOrEqual(0);
    });
  });
});
