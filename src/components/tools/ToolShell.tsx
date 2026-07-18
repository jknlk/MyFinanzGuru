import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import GlassImageCard from "@/components/ui/GlassImageCard";

export default function ToolShell({
  image,
  imageAlt,
  title,
  intro,
  children,
}: {
  image: string;
  imageAlt: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
      <Link
        href="/tools"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-accent-600"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to tools
      </Link>

      <p className="eyebrow mb-3">Your financial start · Tools</p>
      <div className="flex items-center gap-4">
        <GlassImageCard
          src={image}
          alt={imageAlt}
          aspect="square"
          hoverLift={false}
          sizes="96px"
          className="h-16 w-16 shrink-0"
        />
        <h1 className="font-serif text-3xl sm:text-4xl text-ink-900">{title}</h1>
      </div>
      <p className="mt-4 max-w-2xl text-ink-600 leading-relaxed">{intro}</p>

      <div className="mt-10">{children}</div>

      <p className="mt-10 rounded-xl border border-ink-200/60 bg-sky-100 px-4 py-3 text-xs text-ink-500 leading-relaxed">
        All calculations are simplified estimates for information and education only — not
        investment, tax, insurance or legal advice (§34f/§34h GewO). No guarantee of accuracy.
      </p>
    </div>
  );
}
