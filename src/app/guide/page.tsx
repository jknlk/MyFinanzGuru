import type { Metadata } from "next";
import Image from "next/image";
import GuideListing from "@/components/guide/GuideListing";
import { getAllGuides, getGuideCategories } from "@/lib/content";
import RevealScope from "@/components/animation/RevealScope";

export const metadata: Metadata = {
  title: "Guides",
  description: "Practical, plain-language guides to money, insurance, and investing in Germany.",
};

export default function GuidePage() {
  const guides = getAllGuides();
  const categories = getGuideCategories();

  return (
    <RevealScope>
      <div className="relative overflow-hidden lg:min-h-[240px]">
        <Image
          src="/images/guide%20bg/screen.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none hidden object-cover lg:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-sky-50 via-sky-50/85 to-transparent lg:block"
        />
        <div
          className="relative mx-auto flex max-w-7xl flex-col justify-center px-6 py-6 lg:min-h-[240px] lg:px-10"
          data-reveal
        >
          <p className="eyebrow mb-2">Knowledge</p>
          <h1 className="max-w-2xl font-serif text-4xl sm:text-5xl text-ink-900 leading-tight">
            Your guides to money
          </h1>
          <p className="mt-3 max-w-2xl text-ink-600 leading-relaxed">
            Plain-language, practical articles — no sales pitch, just the context you need to
            make better decisions.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <GuideListing guides={guides} categories={categories} />
      </div>
    </RevealScope>
  );
}
