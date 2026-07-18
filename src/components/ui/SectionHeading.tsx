import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  heading,
  sub,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  heading: string;
  sub?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
      data-reveal
    >
      {eyebrow && (
        <p className={cn("eyebrow mb-3", tone === "dark" && "!text-accent-400")}>{eyebrow}</p>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl font-medium leading-tight",
          tone === "dark" ? "text-white" : "text-ink-900"
        )}
      >
        {heading}
      </h2>
      {sub && (
        <p className={cn("mt-4 leading-relaxed", tone === "dark" ? "text-white/70" : "text-ink-600")}>
          {sub}
        </p>
      )}
    </div>
  );
}
