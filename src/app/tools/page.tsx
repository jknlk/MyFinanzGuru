import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { TOOLS } from "@/lib/tools-meta";
import CTABand from "@/components/ui/CTABand";
import DynamicIcon from "@/components/ui/DynamicIcon";
import RevealScope from "@/components/animation/RevealScope";

export const metadata: Metadata = {
  title: "Free Financial Tools",
  description:
    "Ten free, private financial calculators and tools — from Finance Check to VAT and loan calculators. Everything runs in your browser.",
};

export default function ToolsHubPage() {
  return (
    <RevealScope>
      <div className="relative overflow-hidden lg:min-h-[360px]">
        <Image
          src="/images/tools%20bg/screen.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none hidden object-cover lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-sky-50 via-sky-50/85 to-transparent lg:block"
        />
        <div
          className="relative mx-auto flex max-w-7xl flex-col justify-center px-6 py-10 lg:min-h-[360px] lg:px-10"
          data-reveal
        >
          <p className="eyebrow mb-3">Your financial start</p>
          <h1 className="max-w-2xl font-serif text-4xl sm:text-5xl text-ink-900 leading-tight">
            Free tools to take control of your finances
          </h1>
          <p className="mt-5 max-w-2xl text-ink-600 leading-relaxed">
            Get a clear, instant read on your finances before you ever talk to us.
          </p>

          <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-success/30 bg-success-bg px-4 py-2 text-sm text-success">
            <ShieldCheck className="h-4 w-4" />
            All tools run 100% in your browser — nothing is stored or sent to a server.
          </div>
        </div>
      </div>

      <div className="py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5" data-reveal-group="tools-hub">
          {TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              data-reveal
              className="group relative block aspect-[4/5] h-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {tool.image ? (
                <Image
                  src={tool.image}
                  alt={tool.imageAlt ?? tool.title}
                  fill
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 accent-gradient" />
              )}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/50 to-ink-900/10"
              />
              <div className="relative flex h-full flex-col justify-end p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl accent-gradient text-white">
                  <DynamicIcon name={tool.icon} className="h-4.5 w-4.5" />
                </div>
                <p className="mt-3 font-serif text-base text-white">{tool.title}</p>
                <p className="mt-1.5 text-xs text-white/80 leading-relaxed">{tool.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white">
                  Open tool
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <CTABand
          heading="Ready to go deeper?"
          sub="Book a free 30-minute call and turn these numbers into a concrete plan."
        />
      </div>
    </RevealScope>
  );
}
