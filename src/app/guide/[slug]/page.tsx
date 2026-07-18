import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllGuides, getGuideBySlug } from "@/lib/content";
import { mdxComponents } from "@/components/guide/MdxComponents";
import CTABand from "@/components/ui/CTABand";
import GlassImageCard from "@/components/ui/GlassImageCard";
import RevealScope from "@/components/animation/RevealScope";

export function generateStaticParams() {
  return getAllGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.excerpt,
  };
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <RevealScope>
      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <Link
          href="/guide"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-accent-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to guides
        </Link>

        <span className="eyebrow rounded-full bg-sky-100 px-3 py-1">{guide.category}</span>
        <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-ink-900 leading-tight">
          {guide.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-ink-500">
          <span>MyFinanzGuru Team</span>
          <span>·</span>
          <span>
            {new Date(guide.date).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span>·</span>
          <span>{guide.readTime} read</span>
        </div>

        {guide.cover && (
          <div className="mt-8">
            <GlassImageCard
              src={guide.cover}
              alt={`Cover image for the guide "${guide.title}"`}
              aspect="3/2"
              hoverLift={false}
              sizes="(min-width: 1024px) 768px, 100vw"
            />
          </div>
        )}

        {guide.pdf && (
          <a
            href={guide.pdf}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-700 hover:border-accent-500"
          >
            <Download className="h-4 w-4" />
            Download as PDF
          </a>
        )}

        <div className="mt-10">
          <MDXRemote source={guide.content} components={mdxComponents} />
        </div>

        <div className="mt-16">
          <CTABand
            heading="Want this explained for your situation?"
            sub="Join a free webinar or book a 1:1 meeting — whichever fits you better."
            ctaLabel="See free webinars"
            ctaHref="/webinar"
          />
        </div>
      </article>
    </RevealScope>
  );
}
