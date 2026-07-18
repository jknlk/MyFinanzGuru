import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TOOLS } from "@/lib/tools-meta";
import DynamicIcon from "@/components/ui/DynamicIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";

export default function ToolsStrip() {
  return (
    <section className="mx-auto max-w-[100rem] px-6 py-20 lg:px-10">
      <SectionHeading
        eyebrow="Your financial start"
        heading="Five free tools to take control of your finances"
        sub="No sign-up, no data collected — every tool runs entirely in your browser."
      />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5" data-reveal-group="tools">
        {TOOLS.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`} data-reveal className="group block h-full">
            <Card hover className="flex h-full flex-col">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl accent-gradient text-white">
                <DynamicIcon name={tool.icon} />
              </div>
              <p className="mt-4 font-serif text-lg text-ink-900">{tool.title}</p>
              <p className="mt-2 flex-1 text-sm text-ink-600 leading-relaxed">{tool.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-600">
                Open tool
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
