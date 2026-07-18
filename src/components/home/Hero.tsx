"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import Button from "@/components/ui/Button";
import {
  PiggyBank,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  TrendingUp,
} from "lucide-react";

const CARD_PILLS = [
  { icon: ShieldCheck, title: "100% Independent", sub: "No sales pressure" },
  { icon: SlidersHorizontal, title: "Tailored for You", sub: "Personal strategy" },
  { icon: PiggyBank, title: "More for Your Future", sub: "Keep more, stress less" },
];

const BAR_HEIGHTS = [32, 52, 70, 92];

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

  const words: { text: string; accent?: boolean }[] = [
    { text: "Your" },
    { text: "money," },
    { text: "finally", accent: true },
    { text: "working" },
    { text: "for" },
    { text: "you." },
  ];

  return (
    <section ref={rootRef} className="pt-10 lg:pt-14">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl px-6 py-10 lg:px-10 lg:py-14">
      <Image
        src="/images/home-hero.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-white/88" />
      <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <p data-hero-anim data-hero-eyebrow className="eyebrow mb-5">
            Trusted by families across Germany
          </p>
          <h1 className="font-serif text-4xl leading-[1.1] text-ink-900 sm:text-5xl lg:text-6xl">
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 pr-2">
                <span
                  data-hero-anim
                  data-hero-word
                  className={`inline-block ${word.accent ? "text-accent-600" : ""}`}
                >
                  {word.text}
                </span>
              </span>
            ))}
          </h1>
          <p data-hero-anim data-hero-sub className="mt-6 max-w-lg text-lg text-ink-600 leading-relaxed">
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
          className="relative aspect-[4/5] w-full max-w-md justify-self-center rounded-[2rem] bg-gradient-to-br from-accent-500 to-accent-700 p-8 shadow-xl lg:justify-self-end"
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

          <div className="absolute -bottom-8 left-6 right-6 rounded-2xl bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-accent-600">
                <TrendingUp className="h-4.5 w-4.5" />
              </div>
              <span className="rounded-full bg-accent-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                +28% Potential Increase
              </span>
            </div>
            <p className="mt-3 font-serif text-base text-ink-900">See Your Financial Potential</p>
            <p className="mt-1 text-xs text-ink-500 leading-relaxed">
              Get a free plan that shows how you can save, invest and grow smarter.
            </p>
            <div className="mt-3 flex h-12 items-end gap-1.5">
              {BAR_HEIGHTS.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm ${i >= 2 ? "bg-accent-300" : "bg-accent-600"}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="mt-3 text-xs font-medium text-accent-600">Check your potential →</p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
