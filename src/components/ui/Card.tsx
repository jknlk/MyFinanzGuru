import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
  hover = false,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-200/60 bg-white/70 backdrop-blur-sm p-6 shadow-sm",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent-400/60",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
