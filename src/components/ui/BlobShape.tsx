import { cn } from "@/lib/utils";

type BlobTone = "accent" | "light" | "dark-accent";

const toneStyles: Record<BlobTone, string> = {
  accent: "bg-accent-400/25",
  light: "bg-white/40",
  "dark-accent": "bg-accent-500/25",
};

/**
 * Purely decorative, absolutely-positioned blurred blob. Wrap a `relative
 * overflow-hidden` container around it and any number of these to build the
 * organic background-shape look. Never intercepts pointer events.
 */
export default function BlobShape({
  tone = "accent",
  size = 320,
  className,
}: {
  tone?: BlobTone;
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-3xl", toneStyles[tone], className)}
      style={{ width: size, height: size }}
    />
  );
}
