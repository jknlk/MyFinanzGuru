"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { CheckCircle2, Circle } from "lucide-react";
import SliderField from "@/components/ui/SliderField";
import { ChipGroup, YesNoToggle } from "@/components/ui/ChipToggle";
import Card from "@/components/ui/Card";
import ResultPanel from "@/components/ui/ResultPanel";
import ToolCTA from "@/components/tools/ToolCTA";
import CountUp from "@/components/animation/CountUp";
import { calculateEmergencyFund, type JobSecurity } from "@/lib/tools/emergency-fund";
import { cn, formatEUR } from "@/lib/utils";

const JOB_SECURITY_OPTIONS: { value: JobSecurity; label: string }[] = [
  { value: "secure", label: "Very secure (civil servant)" },
  { value: "standard", label: "Standard employee" },
  { value: "precarious", label: "Less secure" },
  { value: "selfEmployed", label: "Self-employed" },
];

export default function EmergencyFundTool() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(1800);
  const [jobSecurity, setJobSecurity] = useState<JobSecurity>("standard");
  const [hasDependents, setHasDependents] = useState<boolean | null>(false);
  const [existingSavings, setExistingSavings] = useState(2000);
  const [monthlySavingsRate, setMonthlySavingsRate] = useState(200);
  const resultRef = useRef<HTMLDivElement>(null);

  const result = calculateEmergencyFund({
    monthlyExpenses,
    jobSecurity,
    hasDependents: hasDependents ?? false,
    existingSavings,
    monthlySavingsRate,
  });

  function recalc() {
    requestAnimationFrame(() => {
      if (resultRef.current) {
        gsap.fromTo(resultRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <p className="font-serif text-lg text-ink-900 mb-5">Your situation</p>
        <div className="flex flex-col gap-6">
          <SliderField
            label="Monthly essential expenses"
            value={monthlyExpenses}
            min={500}
            max={6000}
            step={50}
            onChange={(v) => {
              setMonthlyExpenses(v);
              recalc();
            }}
            formatValue={(v) => formatEUR(v)}
            helper="Rent, insurance, groceries — not your salary"
          />
          <ChipGroup
            label="Job security"
            options={JOB_SECURITY_OPTIONS}
            value={jobSecurity}
            onChange={(v) => {
              setJobSecurity(v);
              recalc();
            }}
          />
          <div>
            <p className="text-sm font-medium text-ink-800 mb-2">Dependents to support</p>
            <YesNoToggle
              value={hasDependents}
              onChange={(v) => {
                setHasDependents(v);
                recalc();
              }}
            />
          </div>
          <SliderField
            label="Existing emergency savings"
            value={existingSavings}
            min={0}
            max={30000}
            step={250}
            onChange={(v) => {
              setExistingSavings(v);
              recalc();
            }}
            formatValue={(v) => formatEUR(v)}
          />
          <SliderField
            label="Monthly savings rate"
            value={monthlySavingsRate}
            min={0}
            max={2000}
            step={25}
            onChange={(v) => {
              setMonthlySavingsRate(v);
              recalc();
            }}
            formatValue={(v) => `${formatEUR(v)}/mo`}
          />
        </div>
      </Card>

      <ResultPanel>
        <div ref={resultRef}>
          <p className="text-sm text-ink-500">Your target emergency fund</p>
          <p className="font-serif text-4xl sm:text-5xl text-accent-600 mt-1">
            <CountUp to={result.targetAmount} prefix="€" decimals={0} />
          </p>
          <p className="mt-2 text-sm text-ink-600">
            {result.recommendedMonths} months of essential expenses covered
          </p>

          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-ink-200">
            <div
              className="h-full accent-gradient transition-all duration-700"
              style={{ width: `${result.progressPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-ink-500">{result.progressPct.toFixed(0)}% funded</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-sky-100 p-4">
              <p className="text-xs text-ink-500">Savings gap</p>
              <p className="mt-1 font-semibold text-ink-900">{formatEUR(result.savingsGap)}</p>
            </div>
            <div className="rounded-xl bg-sky-100 p-4">
              <p className="text-xs text-ink-500">Time to goal</p>
              <p className="mt-1 font-semibold text-ink-900">
                {result.monthsToGoal === null
                  ? "—"
                  : result.monthsToGoal === 0
                    ? "Reached"
                    : `${result.monthsToGoal} mo`}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-ink-800 mb-3">Milestones</p>
            <div className="flex flex-col gap-2">
              {result.milestones.map((m) => (
                <div key={m.amount} className="flex items-center gap-2 text-sm">
                  {m.reached ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-ink-300 shrink-0" />
                  )}
                  <span className={cn(m.reached ? "text-ink-900" : "text-ink-500")}>
                    {formatEUR(m.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ToolCTA />
        </div>
      </ResultPanel>
    </div>
  );
}
