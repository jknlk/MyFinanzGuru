"use client";

import { cn } from "@/lib/utils";

export function ChipGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <p className="text-sm font-medium text-ink-800 mb-2">{label}</p>}
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium border transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
              value === opt.value
                ? "accent-gradient border-transparent text-white shadow-sm"
                : "border-ink-200 text-ink-600 hover:border-accent-400 hover:text-ink-900"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function YesNoToggle({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex gap-2" role="group">
      <button
        type="button"
        onClick={() => onChange(true)}
        aria-pressed={value === true}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-semibold border transition-all active:scale-[0.98]",
          value === true
            ? "accent-gradient border-transparent text-white"
            : "border-ink-200 text-ink-600 hover:border-accent-400"
        )}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        aria-pressed={value === false}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-semibold border transition-all active:scale-[0.98]",
          value === false
            ? "bg-ink-800 border-transparent text-white"
            : "border-ink-200 text-ink-600 hover:border-ink-800"
        )}
      >
        No
      </button>
    </div>
  );
}
