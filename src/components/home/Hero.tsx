"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import Button from "@/components/ui/Button";
import BlobShape from "@/components/ui/BlobShape";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Clock,
  Lock,
  PieChart,
  PiggyBank,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Users,
} from "lucide-react";

const CARD_PILLS = [
  { icon: ShieldCheck, title: "100% Independent", sub: "No sales pressure" },
  { icon: SlidersHorizontal, title: "Tailored for You", sub: "Personal strategy" },
  { icon: PiggyBank, title: "More for Your Future", sub: "Keep more, stress less" },
];

const BARS = [
  { height: 28, color: "bg-accent-600" },
  { height: 46, color: "bg-accent-500" },
  { height: 68, color: "bg-accent-400" },
  { height: 92, color: "bg-accent-300" },
];

const TRUST_ITEMS = [
  { icon: Users, title: "Personal Advisor", sub: "in English & German" },
  { icon: Clock, title: "First Conversation", sub: "within 48h" },
  { icon: ShieldCheck, title: "100% Free", sub: "No hidden costs" },
  { icon: Lock, title: "Your Data is Safe", sub: "GDPR Compliant" },
];

const HEADLINE_LINES: { text: string; accent?: boolean; underline?: boolean }[][] = [
  [{ text: "Your money," }],
  [{ text: "finally", accent: true }],
  [{ text: "working" }],
  [{ text: "for", underline: true }, { text: " you." }],
];

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!rootRef.current) return;

    if (prefersReducedMotion) {
      gsap.set(rootRef.current.querySelectorAll("[data-hero-anim]"), { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      rootRef.current.querySelector("[data-hero-eyebrow]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5 }
    )
      .fromTo(
        rootRef.current.querySelectorAll("[data-hero-word]"),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 },
        "-=0.25"
      )
      .fromTo(
        rootRef.current.querySelector("[data-hero-sub]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        rootRef.current.querySelector("[data-hero-ctas]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        rootRef.current.querySelector("[data-hero-trust]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        visualRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.9 },
        "-=0.9"
      )
      .fromTo(
        rootRef.current.querySelector("[data-hero-advisor]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.7"
      )
      .fromTo(
        rootRef.current.querySelector("[data-hero-band]"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.2"
      );
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(visualRef.current, {
      rotateY: x * 6,
      rotateX: -y * 6,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 800,
    });
  }

  function handleMouseLeave() {
    if (!visualRef.current) return;
    gsap.to(visualRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
  }

  return (
    <section ref={rootRef} className="relative overflow-hidden">
      <BlobShape tone="accent" size={440} className="-left-40 -top-40" />
      <BlobShape tone="dark-accent" size={260} className="left-[28%] top-1/3 hidden lg:block" />

      <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-16 lg:px-10 lg:pt-20 lg:pb-20">
        <div className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="relative z-20">
            <p data-hero-anim data-hero-eyebrow className="eyebrow mb-5">
              Trusted by families across Germany
            </p>
            <h1 className="font-serif text-4xl leading-[1.05] text-ink-900 sm:text-5xl lg:text-6xl">
              {HEADLINE_LINES.map((line, li) => (
                <span key={li} className="block overflow-hidden pb-1">
                  <span data-hero-anim data-hero-word className="inline-block">
                    {line.map((word, wi) => (
                      <span
                        key={wi}
                        className={cn("relative", word.accent && "text-accent-600")}
                      >
                        {word.text}
                        {word.underline && (
                          <svg
                            className="absolute -bottom-1 left-0 w-full"
                            height="6"
                            viewBox="0 0 60 6"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M1 4.5C10 1 20 1 30 3C40 5 50 3 59 1.5"
                              stroke="var(--color-accent-600)"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </h1>
            <p data-hero-anim data-hero-sub className="mt-6 max-w-sm text-base text-ink-600 leading-relaxed">
              Independent financial guidance for people living in Germany — keep more of your
              salary, build your future, free and without sales pressure.
            </p>
            <div data-hero-anim data-hero-ctas className="mt-8 flex flex-wrap gap-4">
              <Button href="/book" size="lg">
                Start for free →
              </Button>
              <Button href="/tools" variant="outline" size="lg">
                Try our free tools
              </Button>
            </div>
            <div data-hero-anim data-hero-trust className="mt-9 flex items-center gap-3">
              <div className="flex -space-x-3">
                {["#93C1FD", "#5B9DF8", "#2563EB", "#1D4ED8"].map((color, i) => (
                  <span
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div>
                <div className="flex text-accent-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-ink-600">Trusted by 1,000+ families in Germany</p>
              </div>
            </div>
          </div>

          <div
            ref={visualRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative z-10 aspect-[4/5] w-full max-w-md justify-self-center rounded-[2rem] bg-gradient-to-br from-accent-500 to-accent-700 p-8 shadow-xl lg:justify-self-end"
            style={{ transformStyle: "preserve-3d" }}
          >
            <p
              className="text-2xl leading-snug text-white/95"
              style={{ fontFamily: "var(--font-hand)" }}
            >
              Independent.
              <br />
              Transparent.
              <br />
              <span className="relative inline-block">
                On your side.
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="8"
                  viewBox="0 0 120 8"
                  fill="none"
                >
                  <path
                    d="M2 5.5C20 1 40 1 60 4.5C80 8 100 5 118 2"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </p>

            <div className="mt-8 grid grid-cols-3 gap-2.5">
              {CARD_PILLS.map((pill) => (
                <div key={pill.title} className="rounded-xl bg-white/15 p-2.5 backdrop-blur-sm">
                  <pill.icon className="h-4 w-4 text-white" />
                  <p className="mt-2 text-[11px] font-semibold leading-tight text-white">
                    {pill.title}
                  </p>
                  <p className="text-[10px] leading-tight text-white/75">{pill.sub}</p>
                </div>
              ))}
            </div>

            <div className="absolute bottom-6 left-14 right-6 rounded-2xl bg-white p-5 pt-6 shadow-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-accent-600">
                <PieChart className="h-4.5 w-4.5" />
              </div>
              <p className="mt-3 font-serif text-base text-ink-900">See Your Financial Potential</p>
              <p className="mt-1 text-xs text-ink-500 leading-relaxed">
                Get a free plan that shows how you can save, invest and grow smarter.
              </p>
              <div className="relative mt-5 h-14">
                <div className="absolute inset-0 flex items-end gap-1.5">
                  {BARS.map((bar, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm ${bar.color}`}
                      style={{ height: `${bar.height}%` }}
                    />
                  ))}
                </div>
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 68 L38 48 L63 26 L86 6"
                    stroke="var(--color-accent-600)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <ArrowUpRight
                  className="pointer-events-none absolute -top-1.5 right-0 h-4 w-4 text-accent-600"
                  strokeWidth={3}
                />
              </div>

              <div className="pointer-events-none absolute -top-5 right-4 flex w-16 flex-col items-center rounded-2xl bg-accent-600 px-2 py-2 text-center leading-tight text-white shadow-md">
                <span className="text-sm font-bold">+28%</span>
                <span className="text-[9px] font-medium opacity-90">Potential Increase</span>
              </div>
            </div>
          </div>
        </div>

        <div
          data-hero-advisor
          className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden -translate-x-[46%] items-end lg:flex"
        >
          <Image
            src="/images/herosection/advisor.png"
            alt="Financial advisor smiling over her shoulder"
            width={484}
            height={938}
            className="h-[88%] w-auto object-contain"
            priority
          />

          <div className="pointer-events-none absolute left-1/2 top-[10%] flex h-14 w-14 -translate-x-[130%] items-center justify-center rounded-full border border-white/70 bg-white/85 shadow-lg backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full accent-gradient text-white">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-[48%] h-9 w-9 -translate-x-[175%] rounded-full border-2 border-dashed border-accent-300/70" />
        </div>
        </div>

        <div data-hero-band className="relative z-20 mt-14 lg:mt-20">
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-ink-200/60 sm:p-8">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex items-center gap-3 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 text-accent-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{item.title}</p>
                  <p className="text-xs text-ink-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
