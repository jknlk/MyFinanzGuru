import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { TOOLS } from "@/lib/tools-meta";
import Card from "@/components/ui/Card";
import CTABand from "@/components/ui/CTABand";
import BlobShape from "@/components/ui/BlobShape";
import GlassImageCard from "@/components/ui/GlassImageCard";
import RevealScope from "@/components/animation/RevealScope";

export const metadata: Metadata = {
  title: "Free Financial Tools",
  description:
    "Five free, private financial calculators — Finance Check, Real Estate, Health Insurance, Investment, and Brutto-Netto. Everything runs in your browser.",
};

export default function ToolsHubPage() {
  return (
    <RevealScope>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="relative overflow-hidden">
          <BlobShape tone="accent" size={300} className="-right-20 -top-20" />
          <div className="relative max-w-2xl" data-reveal>
            <p className="eyebrow mb-3">Your financial start</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink-900 leading-tight">
              Five free tools to take control of your finances
            </h1>
            <p className="mt-5 text-ink-600 leading-relaxed">
              Get a clear, instant read on your finances before you ever talk to us.
            </p>
          </div>
        </div>

        <div
          data-reveal
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-bg px-4 py-2 text-sm text-success"
        >
          <ShieldCheck className="h-4 w-4" />
          All tools run 100% in your browser — nothing is stored or sent to a server.
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2" data-reveal-group="tools-hub">
          {TOOLS.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} data-reveal className="group block h-full">
              <Card hover className="flex h-full flex-col p-8">
                <GlassImageCard
                  src={tool.image}
                  alt={tool.imageAlt}
                  aspect="square"
                  sizes="96px"
                  className="h-16 w-16"
                />
                <p className="mt-5 font-serif text-xl text-ink-900">{tool.title}</p>
                <p className="mt-2 flex-1 text-ink-600 leading-relaxed">{tool.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-600">
                  Open tool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <CTABand
            heading="Ready to go deeper?"
            sub="Book a free 30-minute call and turn these numbers into a concrete plan."
          />
        </div>
      </div>
    </RevealScope>
  );
}
