"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import SliderField from "@/components/ui/SliderField";
import Select from "@/components/ui/Select";
import { ChipGroup } from "@/components/ui/ChipToggle";
import Card from "@/components/ui/Card";
import ResultPanel from "@/components/ui/ResultPanel";
import ToolCTA from "@/components/tools/ToolCTA";
import CountUp from "@/components/animation/CountUp";
import { calculateBruttoNetto, type Period, type TaxClass } from "@/lib/tools/brutto-netto";
import { FEDERAL_STATES } from "@/lib/constants-2026";
import { formatEUR } from "@/lib/utils";

const TAX_CLASSES: TaxClass[] = [1, 2, 3, 4, 5, 6];

const BAR_SEGMENTS = [
  { key: "net", label: "Net", color: "var(--color-success)" },
  { key: "incomeTaxMonthly", label: "Income tax", color: "var(--color-accent-500)" },
  { key: "soliMonthly", label: "Soli", color: "var(--color-accent-300)" },
  { key: "churchTaxMonthly", label: "Church tax", color: "var(--color-ink-400)" },
  { key: "healthMonthly", label: "Health", color: "var(--color-danger)" },
  { key: "careMonthly", label: "Care", color: "#d98f8c" },
  { key: "pensionMonthly", label: "Pension", color: "var(--color-ink-600)" },
  { key: "unemploymentMonthly", label: "Unemployment", color: "var(--color-ink-800)" },
] as const;

export default function BruttoNettoTool() {
  const [grossSalary, setGrossSalary] = useState(60000);
  const [period, setPeriod] = useState<Period>("year");
  const [taxClass, setTaxClass] = useState<TaxClass>(1);
  const [federalState, setFederalState] = useState("Bayern");
  const [isChurchMember, setIsChurchMember] = useState(false);
  const [children, setChildren] = useState(0);
  const [zusatzbeitrag, setZusatzbeitrag] = useState(3.13);
  const [pensionOn, setPensionOn] = useState(true);
  const [unemploymentOn, setUnemploymentOn] = useState(true);

  const resultRef = useRef<HTMLDivElement>(null);

  const result = calculateBruttoNetto({
    grossSalary,
    period,
    taxClass,
    federalState,
    isChurchMember,
    children,
    zusatzbeitragPct: zusatzbeitrag,
    pensionInsuranceOn: pensionOn,
    unemploymentInsuranceOn: unemploymentOn,
  });

  useEffect(() => {
    if (resultRef.current) {
      gsap.fromTo(
        resultRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [result.netMonthly]);

  const segmentValues: Record<string, number> = {
    net: result.netMonthly,
    ...result.breakdown,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <p className="font-serif text-lg text-ink-900 mb-5">Your salary</p>
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-ink-800">Gross salary</label>
              <div className="inline-flex rounded-full border border-ink-200 p-0.5 text-xs">
                {(["month", "year"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`rounded-full px-3 py-1 capitalize ${
                      period === p ? "accent-gradient text-white" : "text-ink-500"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              value={grossSalary}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              className="w-full rounded-full border border-ink-200 px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            />
          </div>

          <ChipGroup
            label="Tax class"
            options={TAX_CLASSES.map((c) => ({ value: String(c), label: `Class ${c}` }))}
            value={String(taxClass)}
            onChange={(v) => setTaxClass(Number(v) as TaxClass)}
          />
          <Select
            label="Federal state"
            value={federalState}
            onChange={setFederalState}
            options={FEDERAL_STATES.map((s) => ({ value: s, label: s }))}
          />
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-ink-800">Church member</span>
            <input
              type="checkbox"
              checked={isChurchMember}
              onChange={(e) => setIsChurchMember(e.target.checked)}
              className="h-4 w-4 accent-accent-500"
            />
          </label>
          <SliderField
            label="Children (Kinderfreibeträge)"
            value={children}
            min={0}
            max={3}
            step={0.5}
            onChange={setChildren}
          />
          <SliderField
            label="Health insurance additional contribution"
            value={zusatzbeitrag}
            min={0}
            max={6}
            step={0.05}
            onChange={setZusatzbeitrag}
            formatValue={(v) => `${v.toFixed(2)}%`}
          />
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-ink-800">Pension insurance</span>
            <input
              type="checkbox"
              checked={pensionOn}
              onChange={(e) => setPensionOn(e.target.checked)}
              className="h-4 w-4 accent-accent-500"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-ink-800">Unemployment insurance</span>
            <input
              type="checkbox"
              checked={unemploymentOn}
              onChange={(e) => setUnemploymentOn(e.target.checked)}
              className="h-4 w-4 accent-accent-500"
            />
          </label>
        </div>
      </Card>

      <ResultPanel>
        <div ref={resultRef}>
          <p className="text-sm text-ink-500">Your net salary</p>
          <p className="font-serif text-4xl sm:text-5xl text-success mt-1">
            <CountUp to={result.netMonthly} prefix="€" decimals={0} suffix=" / month" />
          </p>

          <div className="mt-6 flex h-8 w-full overflow-hidden rounded-full">
            {BAR_SEGMENTS.map((seg) => {
              const value = segmentValues[seg.key];
              const pct = (value / result.grossMonthly) * 100;
              if (pct <= 0) return null;
              return (
                <div
                  key={seg.key}
                  style={{ width: `${pct}%`, backgroundColor: seg.color }}
                  title={`${seg.label}: ${formatEUR(value)}`}
                />
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {BAR_SEGMENTS.map((seg) => (
              <span key={seg.key} className="flex items-center gap-1.5 text-xs text-ink-500">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: seg.color }} />
                {seg.label}
              </span>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink-500">
                  <th className="pb-2 font-medium">Item</th>
                  <th className="pb-2 font-medium text-right">Monthly</th>
                  <th className="pb-2 font-medium text-right">Yearly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/60">
                {BAR_SEGMENTS.map((seg) => (
                  <tr key={seg.key}>
                    <td className="py-2 text-ink-700">{seg.label}</td>
                    <td className="py-2 text-right text-ink-900">{formatEUR(segmentValues[seg.key])}</td>
                    <td className="py-2 text-right text-ink-900">{formatEUR(segmentValues[seg.key] * 12)}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-2 text-ink-900">Gross</td>
                  <td className="py-2 text-right text-ink-900">{formatEUR(result.grossMonthly)}</td>
                  <td className="py-2 text-right text-ink-900">{formatEUR(result.grossYearly)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-ink-700">Employer total cost</td>
                  <td className="py-2 text-right text-ink-900">{formatEUR(result.employerTotalCostMonthly)}</td>
                  <td className="py-2 text-right text-ink-900">{formatEUR(result.employerTotalCostMonthly * 12)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-xs text-ink-500 leading-relaxed">
            This is a standard employee calculation. Special cases — mini/midi-jobs, civil
            servants, PKV members, and the Gleitzone — are not covered by this simplified tool.
          </p>

          <ToolCTA />
        </div>
      </ResultPanel>
    </div>
  );
}
