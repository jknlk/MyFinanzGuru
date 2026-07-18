import { describe, expect, it } from "vitest";
import { calculateFinanceCheckScore, FINANCE_CHECK_QUESTIONS } from "./finance-check";

describe("calculateFinanceCheckScore", () => {
  it("scores 0 and status red when every answer is no", () => {
    const answers = Object.fromEntries(FINANCE_CHECK_QUESTIONS.map((q) => [q.id, false]));
    const result = calculateFinanceCheckScore(answers);
    expect(result.score).toBe(0);
    expect(result.status).toBe("red");
    expect(result.tips).toHaveLength(10);
  });

  it("scores 100 and status green when every answer is yes", () => {
    const answers = Object.fromEntries(FINANCE_CHECK_QUESTIONS.map((q) => [q.id, true]));
    const result = calculateFinanceCheckScore(answers);
    expect(result.score).toBe(100);
    expect(result.status).toBe("green");
    expect(result.tips).toHaveLength(0);
  });

  it("scores amber in the 50-70 band", () => {
    const answers = Object.fromEntries(
      FINANCE_CHECK_QUESTIONS.map((q, i) => [q.id, i < 6])
    );
    const result = calculateFinanceCheckScore(answers);
    expect(result.score).toBe(60);
    expect(result.status).toBe("amber");
  });
});
