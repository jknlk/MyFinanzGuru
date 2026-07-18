"use client";

import { useState } from "react";
import { InlineWidget } from "react-calendly";
import { CalendarClock } from "lucide-react";

const FALLBACK_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/your-handle/30min";

export default function CalendlyEmbed({ url }: { url?: string | null }) {
  const CALENDLY_URL = url ?? FALLBACK_URL;
  const [consented, setConsented] = useState(false);

  if (!consented) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-ink-200/60 bg-sky-100 px-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl accent-gradient text-white">
          <CalendarClock className="h-6 w-6" />
        </div>
        <p className="mt-4 font-serif text-xl text-ink-900">Booking calendar</p>
        <p className="mt-2 max-w-sm text-sm text-ink-600 leading-relaxed">
          We use Calendly to manage scheduling. Loading it connects to Calendly&apos;s servers, so
          we only do it once you say it&apos;s okay.
        </p>
        <button
          type="button"
          onClick={() => setConsented(true)}
          className="mt-6 accent-gradient rounded-full px-6 py-3 text-sm font-medium text-white"
        >
          Load booking calendar — this connects to Calendly
        </button>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm text-ink-500 underline hover:text-accent-600"
        >
          or open Calendly in a new tab
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-[700px] rounded-2xl border border-ink-200/60 overflow-hidden">
      <InlineWidget url={CALENDLY_URL} styles={{ height: "700px" }} />
    </div>
  );
}
