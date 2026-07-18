import type { Metadata } from "next";
import GuideListing from "@/components/guide/GuideListing";
import { getAllGuides, getGuideCategories } from "@/lib/content";
import BlobShape from "@/components/ui/BlobShape";
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
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="relative overflow-hidden">
          <BlobShape tone="accent" size={300} className="-right-20 -top-20" />
          <div className="relative max-w-2xl" data-reveal>
            <p className="eyebrow mb-3">Knowledge</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-ink-900 leading-tight">
              Your guides to money
            </h1>
            <p className="mt-5 text-ink-600 leading-relaxed">
              Plain-language, practical articles — no sales pitch, just the context you need to
              make better decisions.
            </p>
          </div>
        </div>
        <GuideListing guides={guides} categories={categories} />
      </div>
    </RevealScope>
  );
}
