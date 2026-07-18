"use client";

import { useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { gsap } from "gsap";
import SliderField from "@/components/ui/SliderField";
import { ChipGroup } from "@/components/ui/ChipToggle";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ResultPanel, { ResultEmptyState } from "@/components/ui/ResultPanel";
import WarningCard from "@/components/ui/WarningCard";
import ToolCTA from "@/components/tools/ToolCTA";
import CountUp from "@/components/animation/CountUp";
import {
  calculateHealthInsurance,
  type EmploymentStatus,
  type HealthInsuranceResult,
  type MaritalStatus,
} from "@/lib/tools/health-insurance";
import { FEDERAL_STATES, GKV } from "@/lib/constants-2026";
import { formatEUR } from "@/lib/utils";

const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: "employee", label: "Employee" },
  { value: "self-employed", label: "Self-employed" },
  { value: "civil-servant", label: "Civil servant" },
];

const MARITAL_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "married-children", label: "Married + children" },
];

export default function HealthInsuranceTool() {
  const [age, setAge] = useState(30);
  const [income, setIncome] = useState(55000);
  const [employment, setEmployment] = useState<EmploymentStatus>("employee");
  const [marital, setMarital] = useState<MaritalStatus>("single");
  const [federalState, setFederalState] = useState("Bayern");
  const [zusatzbeitrag, setZusatzbeitrag] = useState(GKV.DEFAULT_ZUSATZBEITRAG);

  const [result, setResult] = useState<HealthInsuranceResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const contributionBase = Math.min(income / 12, GKV.BBG_HEALTH_MONTHLY);

  function handleCalculate() {
    const res = calculateHealthInsurance({
      age,
      grossAnnualIncome: income,
      employmentStatus: employment,
      maritalStatus: marital,
      federalState,
      zusatzbeitragPct: zusatzbeitrag,
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

  const chartData = result?.projection10y.map((p) => ({
    year: p.year,
    GKV: Math.round(p.gkvCumulative),
    PKV: Math.round(p.pkvCumulative),
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <p className="font-serif text-lg text-ink-900 mb-1">Your details</p>
        <p className="text-sm text-ink-500 mb-5">
          Public (GKV) or private (PKV) — enter your details for a direct 2026 comparison.
        </p>
        <div className="flex flex-col gap-6">
          <SliderField
            label="Age"
            value={age}
            min={18}
            max={67}
            step={1}
            onChange={setAge}
            formatValue={(v) => `${v} years`}
          />
          <SliderField
            label="Gross annual income"
            value={income}
            min={20000}
            max={150000}
            step={1000}
            onChange={setIncome}
            formatValue={(v) => formatEUR(v)}
            helper={`Contribution base used: ${formatEUR(contributionBase)}/month (capped at ${formatEUR(
              GKV.BBG_HEALTH_MONTHLY
            )})`}
          />
          <ChipGroup
            label="Employment status"
            options={EMPLOYMENT_OPTIONS}
            value={employment}
            onChange={setEmployment}
          />
          <ChipGroup
            label="Marital status"
            options={MARITAL_OPTIONS}
            value={marital}
            onChange={setMarital}
          />
          <Select
            label="Federal state"
            value={federalState}
            onChange={setFederalState}
            options={FEDERAL_STATES.map((s) => ({ value: s, label: s }))}
          />
          <SliderField
            label="Additional contribution rate (Zusatzbeitrag)"
            value={zusatzbeitrag}
            min={0}
            max={6}
            step={0.05}
            onChange={setZusatzbeitrag}
            formatValue={(v) => `${v.toFixed(2)}%`}
            helper="Market average as of 01/01/2026: 3.13%"
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
            {!result.canSwitchToPkv && employment === "employee" && (
              <WarningCard tone="warn" title="You currently can't switch" className="mb-5">
                Your income is below the Jahresarbeitsentgeltgrenze (JAEG), so GKV applies as an
                employee. The comparison below is still shown for reference.
              </WarningCard>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">GKV — statutory</p>
                <p className="mt-1 font-serif text-2xl text-ink-900">
                  <CountUp to={result.gkv.totalMonthly} prefix="€" decimals={0} />
                  <span className="text-sm text-ink-500">/mo</span>
                </p>
              </div>
              <div className="rounded-xl bg-sky-100 p-4">
                <p className="text-xs text-ink-500">PKV — modeled estimate</p>
                <p className="mt-1 font-serif text-2xl text-ink-900">
                  <CountUp to={result.pkv.estimateMonthly} prefix="€" decimals={0} />
                  <span className="text-sm text-ink-500">/mo</span>
                </p>
                <p className="text-xs text-ink-400 mt-0.5">
                  {formatEUR(result.pkv.lowMonthly)} – {formatEUR(result.pkv.highMonthly)} band
                </p>
              </div>
            </div>

            <p
              className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                result.differenceMonthly > 0
                  ? "bg-success-bg text-success"
                  : "bg-danger-bg text-danger"
              }`}
            >
              {result.differenceMonthly > 0
                ? `PKV is modeled ~${formatEUR(result.differenceMonthly)}/month cheaper than GKV.`
                : `GKV is modeled ~${formatEUR(Math.abs(result.differenceMonthly))}/month cheaper than PKV.`}
            </p>

            {chartData && (
              <div className="mt-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-ink-200)" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} tickFormatter={(v) => `Y${v}`} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `€${Math.round(v / 1000)}k`}
                      width={48}
                    />
                    <Tooltip formatter={(v) => formatEUR(Number(v))} />
                    <Line type="monotone" dataKey="GKV" stroke="var(--color-ink-600)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="PKV" stroke="var(--color-accent-500)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="mt-5 text-xs text-ink-500 leading-relaxed">
              This is a first estimate based on statutory figures and a modeled PKV bandwidth.
              Individual tariffs, a health check, and your insurance history will change real
              PKV results; switching also affects your pension expenses and wage tax.
            </p>

            <ToolCTA label="Get a personal GKV/PKV analysis" />
          </div>
        )}
      </ResultPanel>
    </div>
  );
}
