import Image from "next/image";
import { cn } from "@/lib/utils";
import blurMap from "@/lib/image-blur-map.json";

type Aspect = "video" | "4/5" | "3/2" | "square";
type Variant = "light" | "dark";

const ASPECT_CLASSES: Record<Aspect, string> = {
  video: "aspect-video",
  "4/5": "aspect-[4/5]",
  "3/2": "aspect-[3/2]",
  square: "aspect-square",
};

// Base color is the no-backdrop-filter fallback; the supports-[...] variant
// upgrades to the true glass look only where backdrop-filter is supported.
const VARIANT_CLASSES: Record<Variant, string> = {
  light:
    "bg-white/60 border-white/25 supports-[backdrop-filter]:bg-white/10 supports-[backdrop-filter]:backdrop-blur-xl",
  dark: "bg-white/20 border-white/15 supports-[backdrop-filter]:bg-white/5 supports-[backdrop-filter]:backdrop-blur-xl",
};

export default function GlassImageCard({
  src,
  alt,
  aspect,
  variant = "light",
  priority = false,
  hoverLift = true,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  aspect: Aspect;
  variant?: Variant;
  priority?: boolean;
  hoverLift?: boolean;
  sizes: string;
  className?: string;
}) {
  const blurDataURL = (blurMap as Record<string, string>)[src.replace(/^\/images\//, "")];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-2 shadow-[0_8px_32px_rgba(15,36,56,0.12)] md:p-3",
        VARIANT_CLASSES[variant],
        ASPECT_CLASSES[aspect],
        hoverLift && "glass-hover-lift",
        className
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL}
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3 rounded-t-xl bg-gradient-to-br from-white/20 to-transparent"
        />
      </div>
    </div>
  );
}
