import CountUp from "@/components/animation/CountUp";
import { cn } from "@/lib/utils";

export default function StatTile({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  tone = "light",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="text-center" data-reveal>
      <p
        className={cn(
          "font-serif text-4xl sm:text-5xl",
          tone === "dark" ? "text-accent-400" : "text-accent-600"
        )}
      >
        <CountUp to={value} decimals={decimals} prefix={prefix} suffix={suffix} />
      </p>
      <p className={cn("mt-2 text-sm", tone === "dark" ? "text-white/60" : "text-ink-600")}>
        {label}
      </p>
    </div>
  );
}
