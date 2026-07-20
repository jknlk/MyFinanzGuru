"use client";

import { useEffect, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import SliderField from "@/components/ui/SliderField";
import { ChipGroup } from "@/components/ui/ChipToggle";
import Card from "@/components/ui/Card";
import ResultPanel from "@/components/ui/ResultPanel";
import ToolCTA from "@/components/tools/ToolCTA";
import CountUp from "@/components/animation/CountUp";
import { calculateLoan } from "@/lib/tools/loan";
import { cn, formatEUR, formatPercent } from "@/lib/utils";

export default function LoanPaymentTool() {
  const [loanAmount, setLoanAmount] = useState(200000);
  const [interestRatePct, setInterestRatePct] = useState(3.5);
  const [years, setYears] = useState(25);
  const [fixedInterestYears, setFixedInterestYears] = useState(10);
  const [specialRepaymentOn, setSpecialRepaymentOn] = useState(false);
  const [specialRepaymentYearly, setSpecialRepaymentYearly] = useState(2000);
  const [showSchedule, setShowSchedule] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const result = calculateLoan({
    loanAmount,
    interestRatePct,
    years,
    fixedInterestYears,
    specialRepaymentYearly: specialRepaymentOn ? specialRepaymentYearly : 0,
  });

  useEffect(() => {
    if (resultRef.current) {
      gsap.fromTo(resultRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
    }
  }, [result.monthlyPayment]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <p className="font-serif text-lg text-ink-900 mb-5">Your loan</p>
        <div className="flex flex-col gap-6">
          <SliderField
            label="Loan amount"
            value={loanAmount}
            min={10000}
            max={800000}
            step={5000}
            onChange={setLoanAmount}
            formatValue={(v) => formatEUR(v)}
          />
          <SliderField
            label="Interest rate p.a."
            value={interestRatePct}
            min={0}
            max={8}
            step={0.05}
            onChange={setInterestRatePct}
            formatValue={(v) => formatPercent(v, 2)}
          />
          <SliderField
            label="Loan term"
            value={years}
            min={5}
            max={40}
            step={1}
            onChange={setYears}
            formatValue={(v) => `${v} years`}
          />
          <ChipGroup
            label="Fixed interest period (Zinsbindung)"
            options={[5, 10, 15, 20].map((y) => ({ value: y, label: `${y}y` }))}
            value={fixedInterestYears}
            onChange={setFixedInterestYears}
          />

          <div className="rounded-xl border border-ink-200/60 p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-ink-800">Yearly special repayment (Sondertilgung)</span>
              <input
                type="checkbox"
                checked={specialRepaymentOn}
                onChange={(e) => setSpecialRepaymentOn(e.target.checked)}
                className="h-4 w-4 accent-accent-500"
              />
            </label>
            {specialRepaymentOn && (
              <div className="mt-4">
                <SliderField
                  label="Extra repayment per year"
                  value={specialRepaymentYearly}
                  min={0}
                  max={20000}
                  step={500}
                  onChange={setSpecialRepaymentYearly}
                  formatValue={(v) => formatEUR(v)}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <ResultPanel>
        <div ref={resultRef}>
          <p className="text-sm text-ink-500">Monthly payment</p>
          <p className="font-serif text-4xl sm:text-5xl text-accent-600 mt-1">
            <CountUp to={result.monthlyPayment} prefix="€" decimals={0} />
          </p>
          <p className="mt-2 text-sm text-ink-600">
            Initial amortization: {formatPercent(result.initialAmortizationPct, 2)}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-sky-100 p-4">
              <p className="text-xs text-ink-500">Total interest</p>
              <p className="mt-1 font-semibold text-ink-900">{formatEUR(result.totalInterest)}</p>
            </div>
            <div className="rounded-xl bg-sky-100 p-4">
              <p className="text-xs text-ink-500">Total repayment</p>
              <p className="mt-1 font-semibold text-ink-900">{formatEUR(result.totalRepayment)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-ink-200/60 px-4 py-3">
            <p className="text-xs font-medium text-ink-500">
              Remaining debt after {fixedInterestYears}-year fixed period
            </p>
            <p className="mt-1 font-semibold text-ink-900">{formatEUR(result.remainingDebtAtFixedPeriod)}</p>
            <div className="mt-2 flex justify-between text-xs text-ink-500">
              <span>Principal paid: {formatEUR(result.principalPaidAtFixedPeriod)}</span>
              <span>Interest paid: {formatEUR(result.interestPaidAtFixedPeriod)}</span>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-ink-200/60">
            <button
              type="button"
              onClick={() => setShowSchedule((s) => !s)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-ink-900"
            >
              Yearly amortization schedule
              <ChevronDown className={cn("h-4 w-4 transition-transform", showSchedule && "rotate-180")} />
            </button>
            {showSchedule && (
              <div className="h-56 px-2 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.schedule}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-ink-200)" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Y${v}`} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `€${Math.round(v / 1000)}k`} width={44} />
                    <Tooltip formatter={(v) => formatEUR(Number(v))} />
                    <Bar dataKey="interestPaid" stackId="a" fill="var(--color-danger)" name="Interest" />
                    <Bar dataKey="principalPaid" stackId="a" fill="var(--color-success)" name="Principal" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <ToolCTA />
        </div>
      </ResultPanel>
    </div>
  );
}
