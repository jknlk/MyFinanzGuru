import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import CalendlyEmbed from "@/components/book/CalendlyEmbed";
import BlobShape from "@/components/ui/BlobShape";
import GlassImageCard from "@/components/ui/GlassImageCard";
import RevealScope from "@/components/animation/RevealScope";
import { getCalendlySchedulingUrl } from "@/lib/calendly";

export const metadata: Metadata = {
  title: "Book a Meeting",
  description:
    "Book a free, no-obligation 30-minute call with an independent MyFinanzGuru consultant.",
};

const WHAT_TO_EXPECT = [
  "A 360° review of your savings, insurance, and pension outlook",
  "A conversation about your goals — not a sales pitch",
  "Clear, concrete next steps you can act on immediately",
];

const HOW_IT_WORKS = [
  { title: "Pick a time", copy: "Choose any slot that works for you — fully online, no travel." },
  { title: "We talk", copy: "30 minutes, video call, no obligation to continue afterward." },
  { title: "You get a plan", copy: "Leave with clear next steps, whether or not you work with us further." },
];

export default async function BookPage() {
  const calendlyUrl = await getCalendlySchedulingUrl();

  return (
    <RevealScope>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="relative overflow-hidden">
          <BlobShape tone="accent" size={300} className="-right-20 -top-20" />
          <div className="relative max-w-2xl" data-reveal>
            <p className="eyebrow mb-3">Book a meeting</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink-900 leading-tight">
              Let&apos;s talk about your money
            </h1>
            <p className="mt-5 text-ink-600 leading-relaxed">
              30 minutes, completely free, zero obligation. Pick a time that works for you.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div data-reveal>
            <GlassImageCard
              src="/images/book-meeting.png"
              alt="Two coffee cups on a table facing each other beside an open notebook, set for a meeting"
              aspect="3/2"
              hoverLift={false}
              sizes="(min-width: 1024px) 500px, 100vw"
              className="mb-8"
            />
            <p className="font-serif text-xl text-ink-900 mb-4">What to expect</p>
            <ul className="flex flex-col gap-3">
              {WHAT_TO_EXPECT.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="font-serif text-xl text-ink-900 mt-10 mb-4">How it works</p>
            <div className="flex flex-col gap-5">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full accent-gradient text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{step.title}</p>
                    <p className="text-sm text-ink-600 leading-relaxed">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-ink-200/60 bg-sky-100 p-6">
              <p className="text-sm font-medium text-ink-900 mb-4">Other ways to reach us</p>
              <div className="flex flex-col gap-3 text-sm">
                <a href="https://wa.me/00000000000" className="flex items-center gap-2.5 text-ink-700 hover:text-accent-600">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp {"{{WHATSAPP_NUMBER}}"}
                </a>
                <a href="mailto:hello@myfinanzguru.de" className="flex items-center gap-2.5 text-ink-700 hover:text-accent-600">
                  <Mail className="h-4 w-4" />
                  hello@myfinanzguru.de
                </a>
                <a href="tel:+490000000000" className="flex items-center gap-2.5 text-ink-700 hover:text-accent-600">
                  <Phone className="h-4 w-4" />
                  {"{{PHONE_NUMBER}}"}
                </a>
              </div>
            </div>
          </div>

          <div data-reveal>
            <CalendlyEmbed url={calendlyUrl} />
          </div>
        </div>
      </div>
    </RevealScope>
  );
}
