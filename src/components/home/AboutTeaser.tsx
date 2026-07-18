import { Award } from "lucide-react";
import Button from "@/components/ui/Button";
import BlobShape from "@/components/ui/BlobShape";

export default function AboutTeaser() {
  return (
    <section className="relative mx-auto max-w-[100rem] px-6 py-20 lg:px-10">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div data-reveal className="relative">
          <BlobShape tone="accent" size={260} className="-left-10 -top-10" />
          <div className="relative grid aspect-[4/3] grid-cols-2 gap-3 rounded-2xl bg-sky-100 p-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-xl border border-ink-200/60 bg-white/60 text-xs text-ink-400"
              >
                {"{{TEAM_PHOTO}}"}
              </div>
            ))}
          </div>
          <div className="absolute -bottom-6 -right-6 flex items-center gap-3 rounded-2xl border border-ink-200/60 bg-white px-5 py-4 shadow-lg">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-accent-600">
              <Award className="h-5 w-5" />
            </span>
            <div>
              {/* {{YEARS}} — placeholder, replace with real figure */}
              <p className="font-serif text-lg text-ink-900">12+ years</p>
              <p className="text-xs text-ink-500">Combined advisory experience</p>
            </div>
          </div>
        </div>
        <div data-reveal>
          <p className="eyebrow mb-3">About us</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink-900 leading-tight">
            This is MyFinanzGuru
          </h2>
          <p className="mt-5 text-ink-600 leading-relaxed">
            We started MyFinanzGuru because good financial guidance in Germany is too often
            locked behind sales targets, commission structures, and jargon most people were
            never taught to decode. We believe financial education is the key to a secure
            future — not a product to be sold, but a right everyone deserves access to.
          </p>
          <p className="mt-4 text-ink-600 leading-relaxed">
            Every recommendation we make starts with your actual situation, not a template.
            We build holistic concepts adapted to your income, your goals, and your comfort
            with risk — and we explain every step in plain language, in English or German.
          </p>
          <div className="mt-7">
            <Button href="/about" variant="outline">
              Meet the team →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
