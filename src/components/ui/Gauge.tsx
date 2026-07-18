"use client";

import { useEffect, useRef, useState } from "react";

type Tone = "danger" | "warn" | "success";

export default function Gauge({
  value,
  max = 100,
  tone,
  label,
}: {
  value: number;
  max?: number;
  tone: Tone;
  label: string;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | null>(null);

  const toneColor: Record<Tone, string> = {
    danger: "var(--color-danger)",
    warn: "var(--color-warn)",
    success: "var(--color-success)",
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with a browser media-query, not derived render state
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value]);

  const radius = 80;
  const circumference = Math.PI * radius;
  const progress = (display / max) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="var(--color-ink-200)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={toneColor[tone]}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
      </svg>
      <p className="font-serif text-5xl -mt-4" style={{ color: toneColor[tone] }}>
        {display}
      </p>
      <p className="mt-1 text-sm font-medium text-ink-600 text-center max-w-[14rem]">{label}</p>
    </div>
  );
}
