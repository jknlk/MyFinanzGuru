import Link from "next/link";
import { getAllGuides } from "@/lib/content";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function GuidesGrid() {
  const guides = getAllGuides().slice(0, 6);

  return (
    <section className="mx-auto max-w-[100rem] px-6 py-20 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Knowledge" heading="Guides to help you get started" />
        <Button href="/guide" variant="outline">
          All guides →
        </Button>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group="guides">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guide/${guide.slug}`} data-reveal className="block h-full">
            <Card hover className="flex h-full flex-col">
              <span className="eyebrow w-fit rounded-full bg-sky-100 px-3 py-1">
                {guide.category}
              </span>
              <p className="mt-4 font-serif text-lg text-ink-900 leading-snug">{guide.title}</p>
              <p className="mt-2 flex-1 text-sm text-ink-600 leading-relaxed">{guide.excerpt}</p>
              <p className="mt-4 text-xs text-ink-400">{guide.readTime} read</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
