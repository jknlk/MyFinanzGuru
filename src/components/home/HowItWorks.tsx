import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [
  {
    number: "1",
    title: "Sign up",
    copy: "Book a free, no-obligation first conversation — online, at a time that suits you.",
  },
  {
    number: "2",
    title: "Personal analysis",
    copy: "We review your income, insurance, and goals to build a clear picture of where you stand.",
  },
  {
    number: "3",
    title: "Keep more",
    copy: "Walk away with a concrete plan to keep more of what you earn and grow it with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-20">
      <Image
        src="/images/home%20page%202nd%20section/stitch_wealth_management_hub/close_up_shot_of_a_diverse_professional_team_collaborating_over_a_laptop/screen.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 bg-ink-900/75" aria-hidden />

      <div className="relative mx-auto max-w-[100rem] px-6 lg:px-10">
        <SectionHeading
          eyebrow="Simple process"
          heading="How it works"
          align="center"
          tone="dark"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3" data-reveal-group="how">
          {STEPS.map((step) => (
            <div
              key={step.number}
              data-reveal
              className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-md"
            >
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full accent-gradient font-serif text-white">
                {step.number}
              </span>
              <p className="mt-4 font-serif text-lg text-white">{step.title}</p>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{step.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
