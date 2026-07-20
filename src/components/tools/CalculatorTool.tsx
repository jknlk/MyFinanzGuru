"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { cn, formatNumber } from "@/lib/utils";
import {
  applyBinaryOperator,
  applyPercent,
  applyUnaryFunction,
  type BinaryOperator,
  type UnaryFunction,
} from "@/lib/tools/calculator";

const MAX_DIGITS = 15;

function formatDisplay(value: number): string {
  if (Number.isNaN(value)) return "Error";
  if (!Number.isFinite(value)) return value > 0 ? "∞" : "-∞";
  const str = value.toString();
  return str.length > MAX_DIGITS ? value.toPrecision(10).replace(/\.?0+$/, "").replace(/\.?0+e/, "e") : str;
}

const SCIENTIFIC_BUTTONS: { label: string; fn: UnaryFunction }[] = [
  { label: "x²", fn: "square" },
  { label: "√x", fn: "sqrt" },
  { label: "1/x", fn: "reciprocal" },
  { label: "|x|", fn: "abs" },
  { label: "n!", fn: "factorial" },
  { label: "sin", fn: "sin" },
  { label: "cos", fn: "cos" },
  { label: "tan", fn: "tan" },
  { label: "ln", fn: "ln" },
  { label: "log", fn: "log10" },
];

export default function CalculatorTool() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [pendingOperator, setPendingOperator] = useState<BinaryOperator | null>(null);
  const [awaitingNewValue, setAwaitingNewValue] = useState(false);
  const [scientific, setScientific] = useState(false);

  const currentValue = Number(display);

  function inputDigit(digit: string) {
    if (awaitingNewValue) {
      setDisplay(digit === "." ? "0." : digit);
      setAwaitingNewValue(false);
      return;
    }
    if (digit === "." && display.includes(".")) return;
    if (display === "0" && digit !== ".") {
      setDisplay(digit);
      return;
    }
    if (display.replace(/[-.]/g, "").length >= MAX_DIGITS) return;
    setDisplay(display + digit);
  }

  function clearAll() {
    setDisplay("0");
    setStoredValue(null);
    setPendingOperator(null);
    setAwaitingNewValue(false);
  }

  function backspace() {
    if (awaitingNewValue) return;
    setDisplay((d) => (d.length > 1 ? d.slice(0, -1) : "0"));
  }

  function chooseOperator(operator: BinaryOperator) {
    if (pendingOperator !== null && !awaitingNewValue) {
      const result = applyBinaryOperator(storedValue ?? 0, pendingOperator, currentValue);
      setStoredValue(result);
      setDisplay(formatDisplay(result));
    } else {
      setStoredValue(currentValue);
    }
    setPendingOperator(operator);
    setAwaitingNewValue(true);
  }

  function equals() {
    if (pendingOperator === null || storedValue === null) return;
    const result = applyBinaryOperator(storedValue, pendingOperator, currentValue);
    setDisplay(formatDisplay(result));
    setStoredValue(null);
    setPendingOperator(null);
    setAwaitingNewValue(true);
  }

  function unary(fn: UnaryFunction) {
    const result = applyUnaryFunction(fn, currentValue);
    setDisplay(formatDisplay(result));
    setAwaitingNewValue(true);
  }

  function percent() {
    setDisplay(formatDisplay(applyPercent(currentValue)));
    setAwaitingNewValue(true);
  }

  function insertConstant(value: number) {
    setDisplay(formatDisplay(value));
    setAwaitingNewValue(true);
  }

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (/^[0-9]$/.test(e.key)) {
        inputDigit(e.key);
      } else if (e.key === ".") {
        inputDigit(".");
      } else if (["+", "-", "*", "/"].includes(e.key)) {
        chooseOperator(e.key as BinaryOperator);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        equals();
      } else if (e.key === "Backspace") {
        backspace();
      } else if (e.key === "Escape") {
        clearAll();
      } else if (e.key === "%") {
        percent();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  const opButtonClass = (active: boolean) =>
    cn(
      "rounded-xl py-3 text-lg font-semibold transition-all active:scale-[0.97]",
      active ? "accent-gradient text-white" : "bg-sky-100 text-accent-600 hover:bg-sky-200"
    );

  return (
    <div className="mx-auto max-w-md">
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setScientific((s) => !s)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
              scientific ? "accent-gradient border-transparent text-white" : "border-ink-200 text-ink-600"
            )}
          >
            Scientific
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-ink-500 hover:text-danger"
          >
            Clear
          </button>
        </div>

        <div className="mb-5 rounded-2xl bg-ink-900 px-5 py-6 text-right">
          {pendingOperator && (
            <p className="text-xs text-white/40">
              {formatNumber(storedValue ?? 0, 4)} {pendingOperator}
            </p>
          )}
          <p className="mt-1 truncate font-serif text-4xl text-white">{display}</p>
        </div>

        {scientific && (
          <div className="mb-3 grid grid-cols-5 gap-2">
            {SCIENTIFIC_BUTTONS.map((b) => (
              <button
                key={b.fn}
                type="button"
                onClick={() => unary(b.fn)}
                className="rounded-lg bg-sky-100 py-2 text-sm font-medium text-ink-700 hover:bg-sky-200 active:scale-[0.97]"
              >
                {b.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => insertConstant(Math.PI)}
              className="rounded-lg bg-sky-100 py-2 text-sm font-medium text-ink-700 hover:bg-sky-200 active:scale-[0.97]"
            >
              π
            </button>
            <button
              type="button"
              onClick={() => insertConstant(Math.E)}
              className="rounded-lg bg-sky-100 py-2 text-sm font-medium text-ink-700 hover:bg-sky-200 active:scale-[0.97]"
            >
              e
            </button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">
          <button type="button" onClick={clearAll} className={opButtonClass(false)}>
            AC
          </button>
          <button type="button" onClick={() => unary("negate")} className={opButtonClass(false)}>
            +/-
          </button>
          <button type="button" onClick={percent} className={opButtonClass(false)}>
            %
          </button>
          <button type="button" onClick={() => chooseOperator("/")} className={opButtonClass(pendingOperator === "/")}>
            ÷
          </button>

          {["7", "8", "9"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => inputDigit(d)}
              className="rounded-xl bg-white py-3 text-lg font-medium text-ink-900 border border-ink-200/60 hover:bg-sky-50 active:scale-[0.97]"
            >
              {d}
            </button>
          ))}
          <button type="button" onClick={() => chooseOperator("*")} className={opButtonClass(pendingOperator === "*")}>
            ×
          </button>

          {["4", "5", "6"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => inputDigit(d)}
              className="rounded-xl bg-white py-3 text-lg font-medium text-ink-900 border border-ink-200/60 hover:bg-sky-50 active:scale-[0.97]"
            >
              {d}
            </button>
          ))}
          <button type="button" onClick={() => chooseOperator("-")} className={opButtonClass(pendingOperator === "-")}>
            −
          </button>

          {["1", "2", "3"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => inputDigit(d)}
              className="rounded-xl bg-white py-3 text-lg font-medium text-ink-900 border border-ink-200/60 hover:bg-sky-50 active:scale-[0.97]"
            >
              {d}
            </button>
          ))}
          <button type="button" onClick={() => chooseOperator("+")} className={opButtonClass(pendingOperator === "+")}>
            +
          </button>

          <button
            type="button"
            onClick={backspace}
            className="rounded-xl bg-white py-3 text-lg font-medium text-ink-900 border border-ink-200/60 hover:bg-sky-50 active:scale-[0.97]"
          >
            ⌫
          </button>
          <button
            type="button"
            onClick={() => inputDigit("0")}
            className="rounded-xl bg-white py-3 text-lg font-medium text-ink-900 border border-ink-200/60 hover:bg-sky-50 active:scale-[0.97]"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => inputDigit(".")}
            className="rounded-xl bg-white py-3 text-lg font-medium text-ink-900 border border-ink-200/60 hover:bg-sky-50 active:scale-[0.97]"
          >
            .
          </button>
          <button type="button" onClick={equals} className="rounded-xl accent-gradient py-3 text-lg font-semibold text-white active:scale-[0.97]">
            =
          </button>
        </div>
      </Card>

      <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/tools/vat-calculator" className="text-accent-600 hover:underline">
          VAT calculator
        </Link>
        <span className="text-ink-300">·</span>
        <Link href="/tools/compound-interest" className="text-accent-600 hover:underline">
          Compound interest calculator
        </Link>
        <span className="text-ink-300">·</span>
        <Link href="/tools/loan-payment" className="text-accent-600 hover:underline">
          Loan payment calculator
        </Link>
      </div>
    </div>
  );
}
