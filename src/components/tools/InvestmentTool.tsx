"use client";

import { useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { gsap } from "gsap";
import SliderField from "@/components/ui/SliderField";
import { ChipGroup } from "@/components/ui/ChipToggle";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ResultPanel, { ResultEmptyState } from "@/components/ui/ResultPanel";
import ToolCTA from "@/components/tools/ToolCTA";
import CountUp from "@/components/animation/CountUp";
import { calculateInvestment, type ContributionIncrease, type InvestmentResult } from "@/lib/tools/investment";
import { formatEUR } from "@/lib/utils";

const INCREASE_OPTIONS: { value: ContributionIncrease; label: string }[] = [
  { value: 0, label: "No increase" },
  { value: 1, label: "+1% p.a." },
  { value: 2, label: "+2% p.a." },
  { value: 3, label: "+3% p.a." },
  { value: 5, label: "+5% p.a." },
];

export default function InvestmentTool() {
  const [startingCapital, setStartingCapital] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
  const [increase, setIncrease] = useState<ContributionIncrease>(2);
  const [returnPct, setReturnPct] = useState(7);
  const [years, setYears] = useState(20);
  const [terOn, setTerOn] = useState(false);
  const [terPct, setTerPct] = useState(0.2);
  const [inflationOn, setInflationOn] = useState(false);

  const [result, setResult] = useState<InvestmentResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleCalculate() {
    const res = calculateInvestment({
      startingCapital,
      monthlyContribution,
      contributionIncreasePct: increase,
      annualReturnPct: returnPct,
      years,
      terPct: terOn ? terPct : 0,
      inflationPct: inflationOn ? 2 : undefined,
    });
    setResult(res);
    requestAnimationFrame(() => {
      if (resultRef.current) {
        gsap.fromTo(
          resultRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
        );
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <p className="font-serif text-lg text-ink-900 mb-5">Your plan</p>
        <div className="flex flex-col gap-6">
          <SliderField
            label="Starting capital"
            value={startingCapital}
            min={0}
            max={100000}
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
          <ChipGroup
            label="Increase contribution over time"
            options={INCREASE_OPTIONS}
            value={increase}
            onChange={setIncrease}
          />
          <SliderField
            label="Expected return p.a."
            value={returnPct}
            min={0}
            max={12}
            step={0.5}
            onChange={setReturnPct}
            formatValue={(v) => `${v}%`}
          />
          <SliderField
            label="Investment horizon"
            value={years}
            min={1}
            max={40}
            step={1}
            onChange={setYears}
            formatValue={(v) => `${v} years`}
          />

          <div className="rounded-xl border border-ink-200/60 p-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-ink-800">ETF costs (TER)</span>
              <input
                type="checkbox"
                checked={terOn}
                onChange={(e) => setTerOn(e.target.checked)}
                className="h-4 w-4 accent-accent-500"
              />
            </label>
            {terOn && (
              <div className="mt-4">
                <SliderField
                  label="Total Expense Ratio"
                  value={terPct}
                  min={0}
                  max={2}
                  step={0.05}
                  onChange={setTerPct}
                  formatValue={(v) => `${v.toFixed(2)}%`}
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
            <input
              type="checkbox"
              checked={inflationOn}
              onChange={(e) => setInflationOn(e.target.checked)}
              className="h-4 w-4 accent-accent-500"
            />
            Show inflation-adjusted value (2%/yr)
          </label>

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
            <p className="text-sm text-ink-500">Projected final wealth</p>
            <p className="font-serif text-4xl sm:text-5xl text-accent-600 mt-1">
              <CountUp to={result.finalValue} prefix="€" decimals={0} />
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">Total contributions</p>
                <p className="mt-1 font-semibold text-ink-900">
                  {formatEUR(result.totalContributions)}
                </p>
              </div>
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">Total gains</p>
                <p className="mt-1 font-semibold text-success">
                  {formatEUR(result.totalGains)}
                </p>
              </div>
            </div>

            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.series}>
                  <defs>
                    <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent-400)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-accent-400)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="contribFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-ink-400)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-ink-400)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-ink-200)" />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(v) => `Y${v}`} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `€${Math.round(v / 1000)}k`}
                    width={48}
                  />
                  <Tooltip
                    formatter={(value) => formatEUR(Number(value))}
                    labelFormatter={(v) => `Year ${v}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="contributions"
                    stackId="1"
                    stroke="var(--color-ink-400)"
                    fill="url(#contribFill)"
                    name="Contributions"
                  />
                  <Area
                    type="monotone"
                    dataKey="growth"
                    stackId="1"
                    stroke="var(--color-accent-500)"
                    fill="url(#growthFill)"
                    name="Growth"
                  />
                  {inflationOn && (
                    <Line
                      type="monotone"
                      dataKey="totalValueReal"
                      stroke="var(--color-danger)"
                      strokeDasharray="4 4"
                      dot={false}
                      name="Inflation-adjusted"
                    />
                  )}
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
