import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Users } from "lucide-react";
import { getSeminars } from "@/lib/content";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CTABand from "@/components/ui/CTABand";
import RevealScope from "@/components/animation/RevealScope";

export const metadata: Metadata = {
  title: "Free Webinars",
  description: "Join a free, live financial webinar — 100% free, no product selling, online.",
};

const PILLS = ["100% free", "Live Q&A", "No product selling", "Online"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function WebinarPage() {
  const seminars = getSeminars();
  const upcoming = seminars.filter((s) => !s.isPast);
  const past = seminars.filter((s) => s.isPast);

  return (
    <RevealScope>
      <div className="relative h-[380px] w-full sm:h-[440px]" data-reveal>
        <Image
          src="/images/webinar-hero.png"
          alt="A laptop on a tidy desk in the evening, showing a blurred video presentation"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-8 lg:px-10">
          <p className="eyebrow !text-accent-400 mb-3">Free Webinars</p>
          <h1 className="font-serif text-4xl text-white sm:text-5xl leading-tight">
            Free Financial Webinars
          </h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {PILLS.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-sm text-white backdrop-blur-xl"
              >
                ✓ {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10">
        <div>
          <h2 className="font-serif text-2xl text-ink-900 mb-6" data-reveal>
            Upcoming sessions
          </h2>
          {upcoming.length === 0 ? (
            <Card data-reveal className="text-center py-12">
              <p className="text-ink-600">
                New dates coming soon — book a 1:1 meeting instead in the meantime.
              </p>
              <div className="mt-5">
                <Button href="/book">Book a meeting →</Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2" data-reveal-group="upcoming">
              {upcoming.map((seminar) => (
                <Card key={seminar.id} data-reveal className="flex flex-col">
                  <p className="font-serif text-lg text-ink-900">{seminar.title}</p>
                  <p className="mt-2 flex-1 text-sm text-ink-600 leading-relaxed">
                    {seminar.description}
                  </p>
                  <div className="mt-4 flex flex-col gap-1.5 text-sm text-ink-500">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(seminar.date)} · {formatTime(seminar.date)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {seminar.durationMin} minutes · hosted by {seminar.host}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Limited seats — register to secure your spot
                    </span>
                  </div>
                  <div className="mt-5">
                    <Link
                      href={seminar.registrationUrl}
                      className="inline-flex items-center justify-center gap-2 rounded-full accent-gradient px-5 py-2.5 text-sm font-medium text-white"
                    >
                      Register free
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl text-ink-900 mb-6" data-reveal>
              Past topics
            </h2>
            <div className="grid gap-4 sm:grid-cols-2" data-reveal-group="past">
              {past.map((seminar) => (
                <div
                  key={seminar.id}
                  data-reveal
                  className="rounded-xl border border-ink-200/60 bg-sky-100 px-5 py-4 opacity-70"
                >
                  <p className="font-medium text-ink-800">{seminar.title}</p>
                  <p className="mt-1 text-xs text-ink-500">{formatDate(seminar.date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <CTABand
            heading="Prefer a 1:1 conversation?"
            sub="Book a free 30-minute call whenever suits you."
          />
        </div>
      </div>
    </RevealScope>
  );
}
