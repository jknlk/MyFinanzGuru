import type { Metadata } from "next";
import Image from "next/image";
import { Compass, Handshake, LineChart, MessageCircle } from "lucide-react";
import { TEAM } from "@/lib/team";
import Card from "@/components/ui/Card";
import CTABand from "@/components/ui/CTABand";
import BlobShape from "@/components/ui/BlobShape";
import RevealScope from "@/components/animation/RevealScope";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the independent consultants behind MyFinanzGuru — bringing clarity to the German financial world.",
};

const VALUES = [
  { icon: Compass, title: "Independent & Unbiased", copy: "We're not tied to any single bank or insurer — our only obligation is to you." },
  { icon: Handshake, title: "Tailored to you", copy: "No templates. Every plan starts from your actual income, goals, and comfort with risk." },
  { icon: LineChart, title: "Long-term growth", copy: "We build strategies meant to be held for decades, not chased for a quick win." },
  { icon: MessageCircle, title: "Clear communication", copy: "Plain language, in English or German — no jargon left unexplained." },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AboutPage() {
  return (
    <RevealScope>
      <div className="relative overflow-hidden">
        <Image
          src="/images/about-team.png"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/85" />
        <BlobShape tone="accent" size={300} className="-right-20 -top-20" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:py-20 lg:px-10">
          <div className="relative max-w-2xl" data-reveal>
            <p className="eyebrow mb-3">About us</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink-900 leading-tight">
              A team on your side.
            </h1>
            <p className="mt-5 text-ink-600 leading-relaxed">
              MyFinanzGuru is a collective of independent consultants bringing clarity to the
              German financial world. We started this because good financial guidance is too
              often locked behind sales targets and jargon — we think everyone deserves a clear,
              honest picture of their own money.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 lg:px-10">
        <h2 className="font-serif text-2xl text-ink-900 mb-6" data-reveal>
          Founder &amp; Management
        </h2>
        <div className="grid gap-6 sm:grid-cols-2" data-reveal-group="team">
          {TEAM.map((member) => (
            <Card key={member.name + member.role} data-reveal className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full accent-gradient font-serif text-lg text-white">
                {initials(member.name.replace(/[{}]/g, "N"))}
              </div>
              <div>
                <p className="font-medium text-ink-900">{member.name}</p>
                <p className="text-sm text-accent-600">{member.role}</p>
                <p className="mt-2 text-sm text-ink-600 leading-relaxed">{member.bio}</p>
                <p className="mt-2 text-xs text-ink-400">{member.languages}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-serif text-2xl text-ink-900 mb-6" data-reveal>
            What we stand for
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group="values">
            {VALUES.map((v) => (
              <Card key={v.title} data-reveal>
                <v.icon className="h-6 w-6 text-accent-600" />
                <p className="mt-3 font-medium text-ink-900">{v.title}</p>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{v.copy}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12" data-reveal>
          <div className="rounded-3xl border border-ink-200/60 bg-sky-100 px-8 py-12 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-900">Want to join us?</h2>
            <p className="mt-3 max-w-lg mx-auto text-ink-600 leading-relaxed">
              We&apos;re always open to hearing from independent, client-first consultants who share
              our approach to financial guidance.
            </p>
            <a
              href="mailto:careers@myfinanzguru.de"
              className="mt-6 inline-block font-medium text-accent-600 hover:underline"
            >
              careers@myfinanzguru.de →
            </a>
          </div>
        </div>

        <div className="mt-12">
          <CTABand heading="Ready to talk?" sub="Book a free 30-minute meeting with our team." />
        </div>
      </div>
    </RevealScope>
  );
}
