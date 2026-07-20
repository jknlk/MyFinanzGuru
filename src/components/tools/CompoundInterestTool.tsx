"use client";

import { useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { gsap } from "gsap";
import SliderField from "@/components/ui/SliderField";
import { ChipGroup } from "@/components/ui/ChipToggle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ResultPanel, { ResultEmptyState } from "@/components/ui/ResultPanel";
import ToolCTA from "@/components/tools/ToolCTA";
import CountUp from "@/components/animation/CountUp";
import {
  calculateCompoundInterest,
  type CompoundingFrequency,
  type CompoundInterestResult,
} from "@/lib/tools/compound-interest";
import { formatEUR } from "@/lib/utils";

const COMPOUNDING_OPTIONS: { value: CompoundingFrequency; label: string }[] = [
  { value: "annually", label: "Annually" },
  { value: "monthly", label: "Monthly" },
];

export default function CompoundInterestTool() {
  const [startingCapital, setStartingCapital] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [annualRatePct, setAnnualRatePct] = useState(5);
  const [years, setYears] = useState(15);
  const [compounding, setCompounding] = useState<CompoundingFrequency>("annually");

  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    const res = calculateCompoundInterest({
      startingCapital,
      monthlyContribution,
      annualRatePct,
      years,
      compounding,
    });
    setResult(res);
    requestAnimationFrame(() => {
      if (resultRef.current) {
        gsap.fromTo(resultRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <p className="font-serif text-lg text-ink-900 mb-5">Your capital</p>
        <div className="flex flex-col gap-6">
          <SliderField
            label="Starting capital"
            value={startingCapital}
            min={0}
            max={200000}
            step={500}
            onChange={setStartingCapital}
            formatValue={(v) => formatEUR(v)}
          />
          <SliderField
            label="Monthly contribution"
            value={monthlyContribution}
            min={0}
            max={2000}
            step={10}
            onChange={setMonthlyContribution}
            formatValue={(v) => formatEUR(v)}
          />
          <SliderField
            label="Interest rate p.a."
            value={annualRatePct}
            min={0}
            max={12}
            step={0.25}
            onChange={setAnnualRatePct}
            formatValue={(v) => `${v}%`}
          />
          <SliderField
            label="Time horizon"
            value={years}
            min={1}
            max={40}
            step={1}
            onChange={setYears}
            formatValue={(v) => `${v} years`}
          />
          <ChipGroup
            label="Compounding frequency"
            options={COMPOUNDING_OPTIONS}
            value={compounding}
            onChange={setCompounding}
          />

          <Button onClick={handleCalculate} size="lg">
            Calculate now
          </Button>
        </div>
      </Card>

      <ResultPanel>
        {!result ? (
          <ResultEmptyState />
        ) : (
          <div ref={resultRef}>
            <p className="text-sm text-ink-500">Final capital</p>
            <p className="font-serif text-4xl sm:text-5xl text-accent-600 mt-1">
              <CountUp to={result.finalValue} prefix="€" decimals={0} />
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">Total contributions</p>
                <p className="mt-1 font-semibold text-ink-900">{formatEUR(result.totalContributions)}</p>
              </div>
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">Interest earned</p>
                <p className="mt-1 font-semibold text-success">{formatEUR(result.totalInterest)}</p>
              </div>
            </div>

            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.series}>
                  <defs>
                    <linearGradient id="ciGrowthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent-400)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-accent-400)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="ciContribFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-ink-400)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-ink-400)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-ink-200)" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(v) => `Y${v}`} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `€${Math.round(v / 1000)}k`} width={48} />
                  <Tooltip formatter={(value) => formatEUR(Number(value))} labelFormatter={(v) => `Year ${v}`} />
                  <Area
                    type="monotone"
                    dataKey="contributions"
                    stackId="1"
                    stroke="var(--color-ink-400)"
                    fill="url(#ciContribFill)"
                    name="Contributions"
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    stackId="1"
                    stroke="var(--color-accent-500)"
                    fill="url(#ciGrowthFill)"
                    name="Interest"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <ToolCTA />
          </div>
        )}
      </ResultPanel>
    </div>
  );
}
