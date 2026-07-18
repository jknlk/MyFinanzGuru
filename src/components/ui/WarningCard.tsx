import { cn } from "@/lib/utils";

type Tone = "success" | "warn" | "danger";

const toneStyles: Record<Tone, string> = {
  success: "bg-success-bg text-success border-success/20",
  warn: "bg-warn-bg text-warn border-warn/20",
  danger: "bg-danger-bg text-danger border-danger/20",
};

export default function WarningCard({
  tone = "warn",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", toneStyles[tone], className)}>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 opacity-90 leading-relaxed">{children}</p>
    </div>
  );
}
