import { describe, expect, it } from "vitest";
import { calculateVat } from "@/lib/tools/vat";

describe("calculateVat", () => {
  it("case 1: adds 19% VAT on top of a net price", () => {
    const result = calculateVat({ amount: 100, vatRatePct: 19, direction: "fromNet" });
    expect(result.net).toBe(100);
    expect(result.vat).toBeCloseTo(19, 6);
    expect(result.gross).toBeCloseTo(119, 6);
  });

  it("case 2: isolates the net price from a gross price at 19%", () => {
    const result = calculateVat({ amount: 119, vatRatePct: 19, direction: "fromGross" });
    expect(result.net).toBeCloseTo(100, 6);
    expect(result.vat).toBeCloseTo(19, 6);
    expect(result.gross).toBe(119);
  });

  it("case 3: handles the reduced 7% rate from net", () => {
    const result = calculateVat({ amount: 100, vatRatePct: 7, direction: "fromNet" });
    expect(result.vat).toBeCloseTo(7, 6);
    expect(result.gross).toBeCloseTo(107, 6);
  });

  it("case 4: handles the reduced 7% rate from gross", () => {
    const result = calculateVat({ amount: 107, vatRatePct: 7, direction: "fromGross" });
    expect(result.net).toBeCloseTo(100, 6);
    expect(result.vat).toBeCloseTo(7, 6);
  });

  it("case 5: is a no-op at 0% from gross", () => {
    const result = calculateVat({ amount: 250, vatRatePct: 0, direction: "fromGross" });
    expect(result.net).toBe(250);
    expect(result.vat).toBe(0);
    expect(result.gross).toBe(250);
  });

  it("case 6: is a no-op at 0% from net", () => {
    const result = calculateVat({ amount: 250, vatRatePct: 0, direction: "fromNet" });
    expect(result.net).toBe(250);
    expect(result.vat).toBe(0);
    expect(result.gross).toBe(250);
  });

  it("case 7: scales linearly with amount at a fixed rate (€1,000 net at 19%)", () => {
    const result = calculateVat({ amount: 1000, vatRatePct: 19, direction: "fromNet" });
    expect(result.vat).toBeCloseTo(190, 6);
    expect(result.gross).toBeCloseTo(1190, 6);
  });

  it("case 8: recovers the same net/vat from the gross produced by case 7", () => {
    const result = calculateVat({ amount: 1190, vatRatePct: 19, direction: "fromGross" });
    expect(result.net).toBeCloseTo(1000, 6);
    expect(result.vat).toBeCloseTo(190, 6);
  });

  it("case 9: handles a non-standard rate (10.7%) from net", () => {
    const result = calculateVat({ amount: 50, vatRatePct: 10.7, direction: "fromNet" });
    expect(result.vat).toBeCloseTo(5.35, 6);
    expect(result.gross).toBeCloseTo(55.35, 6);
  });

  it("case 10: round-trips fromGross(fromNet(x)) back to the same net amount", () => {
    const net100 = calculateVat({ amount: 100, vatRatePct: 19, direction: "fromNet" });
    const backToNet = calculateVat({ amount: net100.gross, vatRatePct: 19, direction: "fromGross" });
    expect(backToNet.net).toBeCloseTo(100, 6);
  });
});
