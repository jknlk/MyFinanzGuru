"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { cn } from "@/lib/utils";
import GlassImageCard from "@/components/ui/GlassImageCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const STEP_IMAGE_DIR = "/images/3rd%20section/stitch_financial_visual_collection";

const STEPS = [
  {
    number: "01",
    title: "Understand your money",
    copy: "We start with a clear-eyed analysis of your current situation — income, costs, insurance, savings — with no judgement, just clarity on where you actually stand today.",
    chips: ["Budget overview", "Risk profile", "Full-picture review"],
    image: `${STEP_IMAGE_DIR}/global_markets_and_trading_a_wide_angle_shot_of_a_multi_monitor_trading_desk_in/screen.png`,
    alt: "A wide-angle shot of a multi-monitor trading desk showing market data",
  },
  {
    number: "02",
    title: "Keep your money",
    copy: "We look for legal ways to reduce your tax burden and optimise your insurance coverage, so more of what you earn actually stays in your account each month.",
    chips: ["Tax optimisation", "Insurance audit", "Fewer overlaps"],
    image: `${STEP_IMAGE_DIR}/modern_wealth_management_a_pair_of_professional_hands_holding_a_transparent/screen.png`,
    alt: "A pair of professional hands holding a transparent tablet showing portfolio performance",
  },
  {
    number: "03",
    title: "Grow your money",
    copy: "From ETF savings plans to real estate and government incentives, we build a strategy you actually understand and trust — not one you have to take on faith.",
    chips: ["ETF savings plans", "Real estate", "State incentives"],
    image: `${STEP_IMAGE_DIR}/professional_finance_photography_a_close_up_of_a_high_end_smartphone_displaying/screen.png`,
    alt: "A close-up of a smartphone displaying a finance app with portfolio growth",
  },
];

export default function StepPlan() {
  const [active, setActive] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        if (!isDesktop || prefersReducedMotion || !trackRef.current || !wrapperRef.current) {
          return;
        }

        const track = trackRef.current;

        const st = ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: () => "+=" + (track.scrollWidth - window.innerWidth),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          animation: gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: "none",
          }),
          onUpdate: (self) => {
            const idx = Math.min(
              STEPS.length - 1,
              Math.round(self.progress * (STEPS.length - 1))
            );
            setActive(idx);
          },
        });

        return () => st.kill();
      }
    );

    return () => mm.revert();
  }, []);

  function goTo(index: number) {
    const el = panelsRef.current[index];
    const st = ScrollTrigger.getAll().find((t) => t.trigger === wrapperRef.current);
    if (!el || !st) return;
    const total = STEPS.length - 1;
    const targetProgress = total === 0 ? 0 : index / total;
    const targetScroll = st.start + targetProgress * (st.end - st.start);
    gsap.to(window, { scrollTo: targetScroll, duration: 0.9, ease: "power2.inOut" });
  }

  return (
    <section className="relative">
      <div className="mx-auto max-w-[100rem] px-6 pt-8 lg:px-10">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow mb-3">The plan</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 leading-tight">
            Finance that finally feels right.
          </h2>
        </div>
      </div>

      {/* Desktop: pinned horizontal scroll track */}
      <div ref={wrapperRef} className="relative mt-2 hidden lg:block">
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex"
            style={{ width: "max-content", willChange: "transform" }}
          >
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => {
                  panelsRef.current[i] = el;
                }}
                className="flex"
                style={{ width: "100vw", minWidth: "100vw", flexShrink: 0 }}
              >
                <div className="mx-auto grid w-full max-w-[100rem] grid-cols-2 items-center gap-16 px-6 py-6 lg:px-10">
                  <GlassImageCard
                    src={step.image}
                    alt={step.alt}
                    aspect="3/2"
                    hoverLift={false}
                    sizes="40vw"
                  />
                  <div>
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side navigation */}
        <div className="pointer-events-none absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex">
          {STEPS.map((step, i) => (
            <button
              key={step.number}
              type="button"
              onClick={() => goTo(i)}
              className="pointer-events-auto flex items-center gap-3"
            >
              <span
                className={cn(
                  "font-serif text-sm transition-colors",
                  active === i ? "text-accent-600" : "text-ink-400"
                )}
              >
                {step.number}
              </span>
              <span className="relative h-6 w-[2px] overflow-hidden rounded-full bg-ink-200">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 rounded-full bg-accent-500 transition-all duration-300",
                    active === i ? "h-full" : "h-0"
                  )}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile / tablet: stacked vertical layout */}
      <div className="mx-auto max-w-[100rem] px-6 pb-4 pt-10 lg:hidden lg:px-10">
        <div className="flex flex-col gap-16">
          {STEPS.map((step) => (
            <div key={step.number}>
              <GlassImageCard
                src={step.image}
                alt={step.alt}
                aspect="3/2"
                hoverLift={false}
                sizes="90vw"
              />
              <div className="mt-6">
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
