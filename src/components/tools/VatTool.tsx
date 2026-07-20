"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ChipGroup } from "@/components/ui/ChipToggle";
import Card from "@/components/ui/Card";
import ResultPanel from "@/components/ui/ResultPanel";
import ToolCTA from "@/components/tools/ToolCTA";
import CountUp from "@/components/animation/CountUp";
import { calculateVat, type VatDirection } from "@/lib/tools/vat";
import { formatEUR } from "@/lib/utils";

const RATE_OPTIONS = [
  { value: 19, label: "19% (standard)" },
  { value: 7, label: "7% (reduced)" },
  { value: 0, label: "0%" },
];

const DIRECTION_OPTIONS: { value: VatDirection; label: string }[] = [
  { value: "fromNet", label: "From net" },
  { value: "fromGross", label: "From gross" },
];

export default function VatTool() {
  const [amount, setAmount] = useState(100);
  const [vatRatePct, setVatRatePct] = useState(19);
  const [customRate, setCustomRate] = useState(false);
  const [direction, setDirection] = useState<VatDirection>("fromNet");
  const resultRef = useRef<HTMLDivElement>(null);

  const result = calculateVat({ amount, vatRatePct, direction });

  function handleAmountChange(v: string) {
    const parsed = Number(v.replace(",", "."));
    setAmount(Number.isFinite(parsed) ? Math.max(0, parsed) : 0);
    requestAnimationFrame(() => {
      if (resultRef.current) {
        gsap.fromTo(resultRef.current, { opacity: 0.5 }, { opacity: 1, duration: 0.3 });
      }
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <p className="font-serif text-lg text-ink-900 mb-5">Your price</p>
        <div className="flex flex-col gap-6">
          <ChipGroup
            label="Calculate"
            options={DIRECTION_OPTIONS}
            value={direction}
            onChange={setDirection}
          />

          <div>
            <label className="text-sm font-medium text-ink-800 mb-2 block">
              {direction === "fromNet" ? "Net price (EUR)" : "Gross price (EUR)"}
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-lg font-medium text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            />
          </div>

          <ChipGroup
            label="VAT rate"
            options={[...RATE_OPTIONS, { value: -1, label: "Custom" }]}
            value={customRate ? -1 : vatRatePct}
            onChange={(v) => {
              if (v === -1) {
                setCustomRate(true);
              } else {
                setCustomRate(false);
                setVatRatePct(v);
              }
            }}
          />
          {customRate && (
            <div>
              <label className="text-sm font-medium text-ink-800 mb-2 block">Custom rate (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={vatRatePct}
                onChange={(e) => setVatRatePct(Math.max(0, Number(e.target.value) || 0))}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-lg font-medium text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              />
            </div>
          )}
        </div>
      </Card>

      <ResultPanel>
        <div ref={resultRef}>
          <p className="text-sm text-ink-500">Gross price</p>
          <p className="font-serif text-4xl sm:text-5xl text-accent-600 mt-1">
            <CountUp to={result.gross} prefix="€" decimals={2} />
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-sky-100 p-4">
              <p className="text-xs text-ink-500">Net price</p>
              <p className="mt-1 font-semibold text-ink-900">{formatEUR(result.net, 2)}</p>
            </div>
            <div className="rounded-xl bg-sky-100 p-4">
              <p className="text-xs text-ink-500">VAT ({vatRatePct}%)</p>
              <p className="mt-1 font-semibold text-ink-900">{formatEUR(result.vat, 2)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-ink-200/60 px-4 py-3 text-sm text-ink-600">
            {formatEUR(result.net, 2)} net + {formatEUR(result.vat, 2)} VAT = {formatEUR(result.gross, 2)} gross
          </div>

          <ToolCTA label="Talk to us about your finances" />
        </div>
      </ResultPanel>
    </div>
  );
}
