import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";
import DynamicIcon from "@/components/ui/DynamicIcon";
import Card from "@/components/ui/Card";
import CTABand from "@/components/ui/CTABand";
import BlobShape from "@/components/ui/BlobShape";
import GlassImageCard from "@/components/ui/GlassImageCard";
import RevealScope from "@/components/animation/RevealScope";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Nine independent financial services — from private credits and real estate to tax, retirement, and insurance planning.",
};

export default function ServicesPage() {
  return (
    <RevealScope>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="relative overflow-hidden">
          <BlobShape tone="accent" size={300} className="-right-20 -top-20" />
          <div className="relative max-w-2xl" data-reveal>
            <p className="eyebrow mb-3">Our services</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink-900 leading-tight">
              Independent guidance across every part of your finances
            </h1>
            <p className="mt-5 text-ink-600 leading-relaxed">
              Nine focused services, one coordinated plan. Explore each below, or start with our
              holistic All Finance Prime review.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group="services">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              data-reveal
              className="group block h-full"
            >
              <Card hover className="flex h-full flex-col">
                <GlassImageCard
                  src={service.image}
                  alt={service.imageAlt}
                  aspect="3/2"
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  className="mb-4"
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl accent-gradient text-white">
                  <DynamicIcon name={service.icon} />
                </div>
                <p className="mt-4 font-serif text-lg text-ink-900">{service.title}</p>
                <p className="mt-2 flex-1 text-sm text-ink-600 leading-relaxed">
                  {service.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-600">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16">
          <CTABand
            heading="Not sure where to start?"
            sub="Book a free meeting and we'll help you prioritize."
          />
        </div>
      </div>
    </RevealScope>
  );
}
