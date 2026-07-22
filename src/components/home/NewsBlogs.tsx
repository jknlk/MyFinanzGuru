import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getAllGuides } from "@/lib/content";
import Button from "@/components/ui/Button";

const BADGE_TONES = [
  "bg-orange-100 text-orange-600",
  "bg-sky-100 text-accent-600",
  "bg-pink-100 text-pink-600",
  "bg-emerald-100 text-emerald-600",
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function NewsBlogs() {
  const guides = getAllGuides().slice(0, 4);
  if (guides.length === 0) return null;

  return (
    <section className="mx-auto max-w-[100rem] px-6 py-16 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
        <div>
          <p className="eyebrow mb-3">— News &amp; Blogs</p>
          <h2 className="text-3xl sm:text-4xl font-medium leading-tight text-ink-900">
            Our Latest <span className="text-accent-600">News &amp; Blogs</span>
          </h2>
        </div>
        <Button href="/guide" className="gap-3 pr-1.5">
          View all Blogs
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group="news-blogs">
        {guides.map((guide, i) => (
          <Link
            key={guide.slug}
            href={`/guide/${guide.slug}`}
            data-reveal
            className="group block h-full"
          >
            <article className="flex h-full flex-col rounded-2xl border border-ink-200/60 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sky-100">
                {guide.cover && (
                  <Image
                    src={guide.cover}
                    alt={guide.title}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${BADGE_TONES[i % BADGE_TONES.length]}`}
                >
                  {guide.category}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-600 backdrop-blur-sm">
                  {formatDate(guide.date)}
                </span>
              </div>
              <p className="mt-4 flex-1 px-1 font-serif text-lg leading-snug text-ink-900">
                {guide.title}
              </p>
              <p className="mt-2 px-1 text-sm text-ink-600 leading-relaxed line-clamp-2">
                {guide.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 px-1 pb-1 text-sm font-medium text-accent-600">
                Read More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
