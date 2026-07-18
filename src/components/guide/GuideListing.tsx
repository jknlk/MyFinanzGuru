"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import GlassImageCard from "@/components/ui/GlassImageCard";
import { cn } from "@/lib/utils";
import type { Guide } from "@/lib/content";

export default function GuideListing({
  guides,
  categories,
}: {
  guides: Guide[];
  categories: string[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory ? guides.filter((g) => g.category === activeCategory) : guides;

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium border transition-all",
            activeCategory === null
              ? "accent-gradient border-transparent text-white"
              : "border-ink-200 text-ink-600 hover:border-accent-400"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium border transition-all",
              activeCategory === cat
                ? "accent-gradient border-transparent text-white"
                : "border-ink-200 text-ink-600 hover:border-accent-400"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((guide) => (
          <Link key={guide.slug} href={`/guide/${guide.slug}`} className="block h-full">
            <Card hover className="flex h-full flex-col">
              {guide.cover && (
                <GlassImageCard
                  src={guide.cover}
                  alt={`Cover image for the guide "${guide.title}"`}
                  aspect="3/2"
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  className="mb-4"
                />
              )}
              <span className="eyebrow w-fit rounded-full bg-sky-100 px-3 py-1">
                {guide.category}
              </span>
              <p className="mt-4 font-serif text-lg text-ink-900 leading-snug">{guide.title}</p>
              <p className="mt-2 flex-1 text-sm text-ink-600 leading-relaxed">{guide.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
                <span>{guide.readTime} read</span>
                <span>{new Date(guide.date).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
