"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { YesNoToggle } from "@/components/ui/ChipToggle";
import Gauge from "@/components/ui/Gauge";
import ToolCTA from "@/components/tools/ToolCTA";
import { FINANCE_CHECK_QUESTIONS, calculateFinanceCheckScore } from "@/lib/tools/finance-check";

export default function FinanceCheckTool() {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(
    Object.fromEntries(FINANCE_CHECK_QUESTIONS.map((q) => [q.id, null]))
  );
  const [showResult, setShowResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const allAnswered = FINANCE_CHECK_QUESTIONS.every((q) => answers[q.id] !== null);
  const boolAnswers = Object.fromEntries(
    Object.entries(answers).map(([k, v]) => [k, Boolean(v)])
  );
  const result = showResult ? calculateFinanceCheckScore(boolAnswers) : null;

  function handleShowResult() {
    setShowResult(true);
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (resultRef.current) {
        gsap.fromTo(
          resultRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
        );
      }
    });
  }

  const toneMap = { red: "danger", amber: "warn", green: "success" } as const;

  return (
    <div>
      <Card className="divide-y divide-ink-200/70 p-0">
        {FINANCE_CHECK_QUESTIONS.map((q, i) => (
          <div key={q.id} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-ink-900">
              <span className="mr-2 text-ink-400">{i + 1}.</span>
              {q.text}
            </p>
            <YesNoToggle
              value={answers[q.id]}
              onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
            />
          </div>
        ))}
      </Card>

      <div className="mt-8 flex justify-center">
        <Button onClick={handleShowResult} disabled={!allAnswered} size="lg">
          Show my result
        </Button>
      </div>

      {result && (
        <div ref={resultRef} className="mt-12">
          <Card className="flex flex-col items-center text-center">
            <Gauge
              value={result.score}
              tone={toneMap[result.status]}
              label={result.statusLabel}
            />
          </Card>

          {result.tips.length > 0 && (
            <div className="mt-8">
              <p className="font-serif text-xl text-ink-900 mb-4">Where to focus first</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {result.tips.map((tip) => (
                  <Card key={tip.question}>
                    <p className="text-sm font-medium text-ink-900">{tip.question}</p>
                    <p className="mt-2 text-sm text-ink-600 leading-relaxed">{tip.tip}</p>
                    <Link
                      href={tip.serviceHref}
                      className="mt-3 inline-block text-sm font-medium text-accent-600 hover:underline"
                    >
                      Related service →
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <ToolCTA label="Get your free personal analysis" />
        </div>
      )}
    </div>
  );
}
