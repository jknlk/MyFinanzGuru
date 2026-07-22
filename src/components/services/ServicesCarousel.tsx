"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Service } from "@/lib/services";
import DynamicIcon from "@/components/ui/DynamicIcon";

const PAGE_SIZE = 3;

export default function ServicesCarousel({ services }: { services: Service[] }) {
  const pageCount = Math.ceil(services.length / PAGE_SIZE);
  const [page, setPage] = useState(0);

  const visible = services.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function goTo(next: number) {
    setPage((next + pageCount) % pageCount);
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group="services">
        {visible.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            data-reveal
            className="group relative block aspect-[4/5] h-full overflow-hidden rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/50 to-ink-900/10"
            />
            <div className="relative flex h-full flex-col justify-end p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl accent-gradient text-white">
                <DynamicIcon name={service.icon} />
              </div>
              <p className="mt-4 font-serif text-lg text-white">{service.title}</p>
              <p className="mt-2 text-sm text-white/80 leading-relaxed">{service.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white">
                Learn more
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(page - 1)}
            aria-label="Previous services"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200/60 bg-white text-ink-600 shadow-sm transition-colors hover:border-accent-400/60 hover:text-accent-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to page ${i + 1}`}
                aria-current={i === page}
                className={`h-2 rounded-full transition-all ${
                  i === page ? "w-6 bg-accent-600" : "w-2 bg-ink-200"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(page + 1)}
            aria-label="Next services"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200/60 bg-white text-ink-600 shadow-sm transition-colors hover:border-accent-400/60 hover:text-accent-600"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
