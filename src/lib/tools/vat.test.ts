import { describe, expect, it } from "vitest";
import { calculateVat } from "./vat";

describe("calculateVat", () => {
  it("adds 19% VAT on top of a net price", () => {
    const result = calculateVat({ amount: 100, vatRatePct: 19, direction: "fromNet" });
    expect(result.net).toBe(100);
    expect(result.vat).toBeCloseTo(19, 6);
    expect(result.gross).toBeCloseTo(119, 6);
  });

  it("isolates the net price from a gross price at 19%", () => {
    const result = calculateVat({ amount: 119, vatRatePct: 19, direction: "fromGross" });
    expect(result.net).toBeCloseTo(100, 6);
    expect(result.vat).toBeCloseTo(19, 6);
    expect(result.gross).toBe(119);
  });

  it("handles the reduced 7% rate", () => {
    const result = calculateVat({ amount: 100, vatRatePct: 7, direction: "fromNet" });
    expect(result.vat).toBeCloseTo(7, 6);
    expect(result.gross).toBeCloseTo(107, 6);
  });

  it("is a no-op at 0%", () => {
    const result = calculateVat({ amount: 250, vatRatePct: 0, direction: "fromGross" });
    expect(result.net).toBe(250);
    expect(result.vat).toBe(0);
    expect(result.gross).toBe(250);
  });

  it("round-trips fromGross(fromNet(x)) back to the same net amount", () => {
    const net100 = calculateVat({ amount: 100, vatRatePct: 19, direction: "fromNet" });
    const backToNet = calculateVat({ amount: net100.gross, vatRatePct: 19, direction: "fromGross" });
    expect(backToNet.net).toBeCloseTo(100, 6);
  });
});
