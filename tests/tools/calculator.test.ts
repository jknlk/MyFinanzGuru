import { describe, expect, it } from "vitest";
import { applyBinaryOperator, applyPercent, applyUnaryFunction } from "@/lib/tools/calculator";

describe("calculator tool", () => {
  it("case 1: addition", () => {
    expect(applyBinaryOperator(2, "+", 3)).toBe(5);
    expect(applyBinaryOperator(-5, "+", 5)).toBe(0);
  });

  it("case 2: subtraction", () => {
    expect(applyBinaryOperator(2, "-", 3)).toBe(-1);
    expect(applyBinaryOperator(10, "-", 4)).toBe(6);
  });

  it("case 3: multiplication", () => {
    expect(applyBinaryOperator(6, "*", 7)).toBe(42);
    expect(applyBinaryOperator(-3, "*", 4)).toBe(-12);
  });

  it("case 4: division", () => {
    expect(applyBinaryOperator(10, "/", 4)).toBe(2.5);
    expect(applyBinaryOperator(9, "/", 3)).toBe(3);
  });

  it("case 5: division by zero returns NaN instead of throwing", () => {
    expect(applyBinaryOperator(5, "/", 0)).toBeNaN();
    expect(applyBinaryOperator(0, "/", 0)).toBeNaN();
  });

  it("case 6: square and square root", () => {
    expect(applyUnaryFunction("square", 4)).toBe(16);
    expect(applyUnaryFunction("square", -4)).toBe(16);
    expect(applyUnaryFunction("sqrt", 9)).toBe(3);
    expect(applyUnaryFunction("sqrt", -1)).toBeNaN();
  });

  it("case 7: reciprocal", () => {
    expect(applyUnaryFunction("reciprocal", 4)).toBe(0.25);
    expect(applyUnaryFunction("reciprocal", 0)).toBeNaN();
  });

  it("case 8: factorial for non-negative integers, NaN otherwise", () => {
    expect(applyUnaryFunction("factorial", 5)).toBe(120);
    expect(applyUnaryFunction("factorial", 0)).toBe(1);
    expect(applyUnaryFunction("factorial", -1)).toBeNaN();
    expect(applyUnaryFunction("factorial", 2.5)).toBeNaN();
  });

  it("case 9: trig functions operate in degrees", () => {
    expect(applyUnaryFunction("sin", 90)).toBeCloseTo(1, 10);
    expect(applyUnaryFunction("sin", 30)).toBeCloseTo(0.5, 10);
    expect(applyUnaryFunction("cos", 0)).toBeCloseTo(1, 10);
    expect(applyUnaryFunction("cos", 60)).toBeCloseTo(0.5, 10);
    expect(applyUnaryFunction("tan", 45)).toBeCloseTo(1, 10);
  });

  it("case 10: ln/log10 domain guards, negate, abs, and percent", () => {
    expect(applyUnaryFunction("ln", Math.E)).toBeCloseTo(1, 10);
    expect(applyUnaryFunction("ln", 0)).toBeNaN();
    expect(applyUnaryFunction("log10", 100)).toBeCloseTo(2, 10);
    expect(applyUnaryFunction("log10", -5)).toBeNaN();
    expect(applyUnaryFunction("negate", 7)).toBe(-7);
    expect(applyUnaryFunction("abs", -7)).toBe(7);
    expect(applyPercent(50)).toBe(0.5);
  });
});
