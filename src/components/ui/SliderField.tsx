"use client";

import { cn } from "@/lib/utils";

export default function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  formatValue,
  helper,
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  helper?: string;
  className?: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : String(value);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-ink-800">{label}</label>
        <span className="rounded-full accent-gradient px-3 py-1 text-xs font-semibold text-white">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-ink-200 accent-accent-500"
        style={{
          background: `linear-gradient(to right, var(--color-accent-500) ${percent}%, var(--color-ink-200) ${percent}%)`,
        }}
        aria-label={label}
      />
      {helper && <p className="mt-1.5 text-xs text-ink-400">{helper}</p>}
    </div>
  );
}
