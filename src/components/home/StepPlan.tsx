"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import GlassImageCard from "@/components/ui/GlassImageCard";

const STEPS = [
  {
    number: "01",
    title: "Understand your money",
    copy: "We start with a clear-eyed analysis of your current situation — income, costs, insurance, savings — with no judgement, just clarity on where you actually stand today.",
    chips: ["Budget overview", "Risk profile", "Full-picture review"],
    image: "/images/home-step-1-understand.png",
    alt: "Hands organizing documents, a calculator, and insurance folders on a desk",
  },
  {
    number: "02",
    title: "Keep your money",
    copy: "We look for legal ways to reduce your tax burden and optimise your insurance coverage, so more of what you earn actually stays in your account each month.",
    chips: ["Tax optimisation", "Insurance audit", "Fewer overlaps"],
    image: "/images/home-step-2-keep.png",
    alt: "Financial advisor and client in a friendly online video consultation",
  },
  {
    number: "03",
    title: "Grow your money",
    copy: "From ETF savings plans to real estate and government incentives, we build a strategy you actually understand and trust — not one you have to take on faith.",
    chips: ["ETF savings plans", "Real estate", "State incentives"],
    image: "/images/home-step-3-grow.png",
    alt: "A family looking at a growth chart on a tablet, tracking their savings progress",
  },
];

export default function StepPlan() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-step-index"));
            setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-[100rem] px-6 py-20 lg:px-10">
      <div className="max-w-2xl" data-reveal>
        <p className="eyebrow mb-3">The plan</p>
        <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 leading-tight">
          Finance that finally feels right.
        </h2>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:h-[26rem]">
          <div className="relative h-[26rem]">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  active === i ? "opacity-100" : "opacity-0"
                )}
              >
                <GlassImageCard
                  src={step.image}
                  alt={step.alt}
                  aspect="4/5"
                  hoverLift={false}
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-step-index={i}
              className={cn(
                "transition-opacity duration-500",
                active === i ? "opacity-100" : "opacity-40"
              )}
            >
              <span className="font-serif text-4xl text-accent-500">{step.number}</span>
              <h3 className="mt-3 font-serif text-2xl text-ink-900">{step.title}</h3>
              <p className="mt-3 text-ink-600 leading-relaxed max-w-md">{step.copy}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {step.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-ink-200 px-3 py-1 text-xs text-ink-600"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
