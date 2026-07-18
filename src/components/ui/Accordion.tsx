"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink-200/70 rounded-2xl border border-ink-200/60 bg-white/60">
      {items.map((item, i) => (
        <AccordionItem
          key={item.question}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="px-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-ink-900">{item.question}</span>
        <svg
          className={cn(
            "h-5 w-5 shrink-0 text-accent-600 transition-transform duration-300",
            isOpen && "rotate-45"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      {/* CSS-only expand animation via grid-template-rows — no ref measurement needed */}
      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <p className="pb-5 text-ink-600 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}
