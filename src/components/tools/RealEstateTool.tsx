"use client";

import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import SliderField from "@/components/ui/SliderField";
import Select from "@/components/ui/Select";
import { ChipGroup } from "@/components/ui/ChipToggle";
import Card from "@/components/ui/Card";
import ResultPanel from "@/components/ui/ResultPanel";
import WarningCard from "@/components/ui/WarningCard";
import ToolCTA from "@/components/tools/ToolCTA";
import CountUp from "@/components/animation/CountUp";
import { calculateRealEstate } from "@/lib/tools/real-estate";
import { FEDERAL_STATES } from "@/lib/constants-2026";
import { cn, formatEUR, formatPercent } from "@/lib/utils";

const FEASIBILITY_LABEL = {
  comfortable: { label: "Comfortable", tone: "success" as const },
  feasible: { label: "Feasible, but little room for manoeuvre", tone: "warn" as const },
  tight: { label: "Tight", tone: "danger" as const },
};

export default function RealEstateTool() {
  const [mode, setMode] = useState<"simple" | "advanced">("simple");

  const [netIncomeMonthly, setNetIncomeMonthly] = useState(4000);
  const [equity, setEquity] = useState(50000);
  const [interestRatePct, setInterestRatePct] = useState(3.5);
  const [federalState, setFederalState] = useState("Bayern");

  const [burdenRatioPct, setBurdenRatioPct] = useState(35);
  const [tilgungPct, setTilgungPct] = useState(2.0);
  const [fixedInterestYears, setFixedInterestYears] = useState(10);
  const [brokerageFeePct, setBrokerageFeePct] = useState(3.57);
  const [safetyBufferOn, setSafetyBufferOn] = useState(false);
  const [modernizationPct, setModernizationPct] = useState(0);

  const [showIncidentals, setShowIncidentals] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const result = calculateRealEstate({
    netIncomeMonthly,
    equity,
    interestRatePct,
    federalState,
    burdenRatioPct,
    tilgungPct,
    fixedInterestYears,
    brokerageFeePct: mode === "advanced" ? brokerageFeePct : 3.57,
    safetyBufferOn: mode === "advanced" ? safetyBufferOn : false,
    modernizationPct: mode === "advanced" ? modernizationPct : 0,
  });

  useEffect(() => {
    if (resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [result.maxPurchasePrice]);

  const feasibility = FEASIBILITY_LABEL[result.feasibility];

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full border border-ink-200 bg-white p-1">
          {(["simple", "advanced"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium capitalize transition-all",
                mode === m ? "accent-gradient text-white" : "text-ink-600"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Card>
            <p className="font-serif text-lg text-ink-900 mb-5">Your finances</p>
            <div className="flex flex-col gap-6">
              <SliderField
                label="Net household income"
                value={netIncomeMonthly}
                min={1000}
                max={15000}
                step={100}
                onChange={setNetIncomeMonthly}
                formatValue={(v) => `${formatEUR(v)}/mo`}
              />
              <SliderField
                label="Equity"
                value={equity}
                min={0}
                max={500000}
                step={5000}
                onChange={setEquity}
                formatValue={(v) => formatEUR(v)}
              />
              <SliderField
                label="Debt interest rate"
                value={interestRatePct}
                min={1}
                max={7}
                step={0.1}
                onChange={setInterestRatePct}
                formatValue={(v) => formatPercent(v)}
                helper="Currently approx. 3–4%"
              />
              <Select
                label="Federal state"
                value={federalState}
                onChange={setFederalState}
                options={FEDERAL_STATES.map((s) => ({ value: s, label: s }))}
              />
            </div>
          </Card>

          {mode === "advanced" && (
            <Card>
              <p className="font-serif text-lg text-ink-900 mb-5">Advanced parameters</p>
              <div className="flex flex-col gap-6">
                <SliderField
                  label="Burden ratio (% of income)"
                  value={burdenRatioPct}
                  min={15}
                  max={50}
                  step={1}
                  onChange={setBurdenRatioPct}
                  formatValue={(v) => formatPercent(v)}
                  helper={`= max ${formatEUR(netIncomeMonthly * (burdenRatioPct / 100))} installment/month`}
                />
                <SliderField
                  label="Initial repayment (Tilgung)"
                  value={tilgungPct}
                  min={1}
                  max={5}
                  step={0.1}
                  onChange={setTilgungPct}
                  formatValue={(v) => formatPercent(v)}
                />
                <ChipGroup
                  label="Fixed interest period"
                  options={[5, 10, 15, 20].map((y) => ({ value: String(y), label: `${y}y` }))}
                  value={String(fixedInterestYears)}
                  onChange={(v) => setFixedInterestYears(Number(v))}
                />
                <SliderField
                  label="Brokerage fee"
                  value={brokerageFeePct}
                  min={0}
                  max={7.14}
                  step={0.01}
                  onChange={setBrokerageFeePct}
                  formatValue={(v) => formatPercent(v, 2)}
                  helper="0% = without broker"
                />
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-ink-800">5% safety buffer</span>
                  <input
                    type="checkbox"
                    checked={safetyBufferOn}
                    onChange={(e) => setSafetyBufferOn(e.target.checked)}
                    className="h-4 w-4 accent-accent-500"
                  />
                </label>
                <SliderField
                  label="Modernization"
                  value={modernizationPct}
                  min={0}
                  max={40}
                  step={1}
                  onChange={setModernizationPct}
                  formatValue={(v) => formatPercent(v)}
                  helper="Old building: 15–25%, renovation: 40%"
                />
              </div>
            </Card>
          )}
        </div>

        <ResultPanel>
          <div ref={resultRef}>
            <p className="text-sm text-ink-500">Maximum purchase price of your property</p>
            <p className="font-serif text-4xl sm:text-5xl text-success mt-1">
              <CountUp to={result.maxPurchasePrice} prefix="€" decimals={0} />
            </p>
            <span
              className={cn(
                "mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium",
                feasibility.tone === "success" && "bg-success-bg text-success",
                feasibility.tone === "warn" && "bg-warn-bg text-warn",
                feasibility.tone === "danger" && "bg-danger-bg text-danger"
              )}
            >
              {feasibility.label}
            </span>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">Monthly rate</p>
                <p className="mt-1 font-semibold text-ink-900">{formatEUR(result.monthlyRate)}</p>
              </div>
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">% of income</p>
                <p className="mt-1 font-semibold text-ink-900">{formatPercent(result.burdenOfIncomePct)}</p>
              </div>
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">Loan amount</p>
                <p className="mt-1 font-semibold text-ink-900">{formatEUR(result.loanAmount)}</p>
              </div>
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">Years to debt-free</p>
                <p className="mt-1 font-semibold text-ink-900">
                  {result.yearsToDebtFree === null ? "> 40 y" : `${result.yearsToDebtFree} y`}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-ink-200/60">
              <button
                type="button"
                onClick={() => setShowIncidentals((s) => !s)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-ink-900"
              >
                Incidental purchase costs {formatEUR(result.incidentalCosts.total)}
                <ChevronDown className={cn("h-4 w-4 transition-transform", showIncidentals && "rotate-180")} />
              </button>
              {showIncidentals && (
                <div className="space-y-1.5 px-4 pb-4 text-sm text-ink-600">
                  <div className="flex justify-between">
                    <span>Grunderwerbsteuer ({formatPercent(result.incidentalCosts.grunderwerbsteuerPct)})</span>
                    <span>{formatEUR(result.incidentalCosts.grunderwerbsteuer)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Notary & registry (1.5%)</span>
                    <span>{formatEUR(result.incidentalCosts.notaryRegistry)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Brokerage</span>
                    <span>{formatEUR(result.incidentalCosts.brokerage)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 rounded-xl border border-ink-200/60">
              <button
                type="button"
                onClick={() => setShowSchedule((s) => !s)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-ink-900"
              >
                Repayment schedule
                <ChevronDown className={cn("h-4 w-4 transition-transform", showSchedule && "rotate-180")} />
              </button>
              {showSchedule && (
                <div className="h-56 px-2 pb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.amortizationSchedule}>
                      <defs>
                        <linearGradient id="debtFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-danger)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="var(--color-danger)" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-ink-200)" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} tickFormatter={(v) => `Y${v}`} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `€${Math.round(v / 1000)}k`} width={44} />
                      <Tooltip formatter={(v) => formatEUR(Number(v))} />
                      <Area type="monotone" dataKey="remainingDebt" stroke="var(--color-danger)" fill="url(#debtFill)" name="Remaining debt" />
                      <Area type="monotone" dataKey="equityBuilt" stroke="var(--color-success)" fill="url(#equityFill)" name="Equity built" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {result.warnings.length > 0 && (
              <div className="mt-5 flex flex-col gap-3">
                {result.warnings.map((w) => (
                  <WarningCard key={w.title} tone="warn" title={w.title}>
                    {w.message}
                  </WarningCard>
                ))}
              </div>
            )}

            <ToolCTA />
          </div>
        </ResultPanel>
      </div>
    </div>
  );
}
