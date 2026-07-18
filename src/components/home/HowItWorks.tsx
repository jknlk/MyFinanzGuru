import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";

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
    <section className="bg-sky-100 py-20">
      <div className="mx-auto max-w-[100rem] px-6 lg:px-10">
        <SectionHeading eyebrow="Simple process" heading="How it works" align="center" />
        <div className="mt-12 grid gap-6 sm:grid-cols-3" data-reveal-group="how">
          {STEPS.map((step) => (
            <Card key={step.number} data-reveal className="text-center">
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full accent-gradient font-serif text-white">
                {step.number}
              </span>
              <p className="mt-4 font-serif text-lg text-ink-900">{step.title}</p>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">{step.copy}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
