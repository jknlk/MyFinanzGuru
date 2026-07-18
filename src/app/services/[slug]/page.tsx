import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Check, ArrowRight } from "lucide-react";
import { SERVICES, getServiceBySlug } from "@/lib/services";
import DynamicIcon from "@/components/ui/DynamicIcon";
import Card from "@/components/ui/Card";
import Accordion from "@/components/ui/Accordion";
import CTABand from "@/components/ui/CTABand";
import GlassImageCard from "@/components/ui/GlassImageCard";
import RevealScope from "@/components/animation/RevealScope";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <RevealScope>
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-accent-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to services
        </Link>

        <p className="eyebrow mb-3" data-reveal>
          Our services
        </p>
        <div className="flex items-center gap-4" data-reveal>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl accent-gradient text-white">
            <DynamicIcon name={service.icon} className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink-900">{service.title}</h1>
        </div>
        <p className="mt-5 max-w-2xl text-ink-600 leading-relaxed" data-reveal>
          {service.intro}
        </p>

        <div className="mt-8" data-reveal>
          <GlassImageCard
            src={service.image}
            alt={service.imageAlt}
            aspect="3/2"
            hoverLift={false}
            sizes="(min-width: 1024px) 768px, 100vw"
          />
        </div>

        <div className="mt-12" data-reveal>
          <h2 className="font-serif text-2xl text-ink-900 mb-5">What we do for you</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {service.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 rounded-xl bg-sky-100 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-400/20 text-accent-600">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm text-ink-700 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12" data-reveal>
          <h2 className="font-serif text-2xl text-ink-900 mb-5">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {service.steps.map((step, i) => (
              <Card key={step.title}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full accent-gradient font-serif text-white">
                  {i + 1}
                </span>
                <p className="mt-3 font-medium text-ink-900">{step.title}</p>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {service.relatedToolHref && (
          <div
            data-reveal
            className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-accent-400/40 bg-accent-300/10 px-6 py-5"
          >
            <p className="text-ink-800">
              Curious how this applies to your numbers? Try our related free tool.
            </p>
            <Link
              href={service.relatedToolHref}
              className="inline-flex items-center gap-1.5 font-medium text-accent-600 hover:underline"
            >
              {service.relatedToolLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <div className="mt-12" data-reveal>
          <h2 className="font-serif text-2xl text-ink-900 mb-5">Frequently asked questions</h2>
          <Accordion items={service.faqs} />
        </div>

        <div className="mt-16" data-reveal>
          <CTABand
            heading={`Ready to talk about ${service.title.toLowerCase()}?`}
            sub="Book a free, no-obligation 30-minute meeting."
          />
        </div>
      </div>
    </RevealScope>
  );
}
