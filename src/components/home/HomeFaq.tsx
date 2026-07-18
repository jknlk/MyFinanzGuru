import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";

const FAQ_ITEMS = [
  {
    question: "Who are we?",
    answer:
      "MyFinanzGuru is a team of independent financial consultants working across Germany. We're not tied to a single bank or insurer — our job is to make your options clear, not to sell you a specific product.",
  },
  {
    question: "Where are we located?",
    answer:
      "MyFinanzGuru operates fully online — every consultation happens over video call, so you can speak to us from anywhere in Germany without needing to travel to an office.",
  },
  {
    question: "What services do we offer?",
    answer:
      "We cover private credits, child future & educational planning, private health insurance, real estate investment, physical gold & silver investment, our holistic All Finance Prime review, tax & retirement savings, insurance & protection, and fund & ETF strategy. See the full Services page for details on each.",
  },
  {
    question: "Why choose MyFinanzGuru?",
    answer:
      "We lead with education, not sales targets. Every recommendation starts from your actual numbers — which you can check yourself with our free tools — and every conversation is free, independent, and pressure-free.",
  },
  {
    question: "How can I get in touch?",
    answer:
      "The fastest way is to book a free 30-minute call directly through our Book a Meeting page. You can also reach us by email, and we aim to respond to every enquiry within 48 hours.",
  },
  {
    question: "Do I really need personal financial consulting?",
    answer:
      "If you've ever wondered whether you're paying too much for insurance, missing a state incentive, or unsure how to start investing, a single free conversation usually pays for itself many times over — even if you decide not to work with us further.",
  },
];

export default function HomeFaq() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
      <SectionHeading eyebrow="Questions" heading="Frequently asked questions" align="center" />
      <div className="mt-10">
        <Accordion items={FAQ_ITEMS} />
      </div>
      <div className="mt-8 text-center" data-reveal>
        <p className="text-ink-600 mb-4">More questions?</p>
        <Button href="/book">Start for free →</Button>
      </div>
    </section>
  );
}
