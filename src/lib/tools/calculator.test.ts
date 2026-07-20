import { describe, expect, it } from "vitest";
import { applyBinaryOperator, applyPercent, applyUnaryFunction } from "./calculator";

describe("applyBinaryOperator", () => {
  it("performs the four basic operations", () => {
    expect(applyBinaryOperator(2, "+", 3)).toBe(5);
    expect(applyBinaryOperator(2, "-", 3)).toBe(-1);
    expect(applyBinaryOperator(2, "*", 3)).toBe(6);
    expect(applyBinaryOperator(6, "/", 3)).toBe(2);
  });

  it("returns NaN for division by zero instead of throwing", () => {
    expect(applyBinaryOperator(5, "/", 0)).toBeNaN();
  });
});

describe("applyUnaryFunction", () => {
  it("computes square, sqrt and reciprocal", () => {
    expect(applyUnaryFunction("square", 4)).toBe(16);
    expect(applyUnaryFunction("sqrt", 9)).toBe(3);
    expect(applyUnaryFunction("reciprocal", 4)).toBe(0.25);
  });

  it("computes factorial for non-negative integers and NaN otherwise", () => {
    expect(applyUnaryFunction("factorial", 5)).toBe(120);
    expect(applyUnaryFunction("factorial", 0)).toBe(1);
    expect(applyUnaryFunction("factorial", -1)).toBeNaN();
    expect(applyUnaryFunction("factorial", 2.5)).toBeNaN();
  });

  it("computes trig functions in degrees", () => {
    expect(applyUnaryFunction("sin", 90)).toBeCloseTo(1, 10);
    expect(applyUnaryFunction("cos", 0)).toBeCloseTo(1, 10);
  });

  it("returns NaN for sqrt/ln/log of invalid domains", () => {
    expect(applyUnaryFunction("sqrt", -1)).toBeNaN();
    expect(applyUnaryFunction("ln", 0)).toBeNaN();
    expect(applyUnaryFunction("log10", -5)).toBeNaN();
  });
});

describe("applyPercent", () => {
  it("divides the value by 100", () => {
    expect(applyPercent(50)).toBe(0.5);
  });
});
