import type { Metadata } from "next";
import { SERVICES } from "@/lib/services";
import CTABand from "@/components/ui/CTABand";
import Image from "next/image";
import ServicesCarousel from "@/components/services/ServicesCarousel";
import RevealScope from "@/components/animation/RevealScope";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Nine independent financial services — from private credits and real estate to tax, retirement, and insurance planning.",
};

export default function ServicesPage() {
  return (
    <RevealScope>
      <div className="relative overflow-hidden lg:min-h-[360px]">
        <Image
          src="/images/servicebg/screen.png"
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
          <p className="eyebrow mb-3">Our services</p>
          <h1 className="max-w-2xl font-serif text-4xl sm:text-5xl text-ink-900 leading-tight">
            Independent guidance across every part of your finances
          </h1>
          <p className="mt-5 max-w-2xl text-ink-600 leading-relaxed">
            Nine focused services, one coordinated plan. Explore each below, or start with our
            holistic All Finance Prime review.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <ServicesCarousel services={SERVICES} />

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
