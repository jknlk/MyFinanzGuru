import { describe, expect, it } from "vitest";
import { calculateFinanceCheckScore, FINANCE_CHECK_QUESTIONS } from "@/lib/tools/finance-check";

function answersFor(yesIds: string[]): Record<string, boolean> {
  return Object.fromEntries(FINANCE_CHECK_QUESTIONS.map((q) => [q.id, yesIds.includes(q.id)]));
}

describe("calculateFinanceCheckScore", () => {
  it("case 1: scores 0 and status red when every answer is no", () => {
    const answers = Object.fromEntries(FINANCE_CHECK_QUESTIONS.map((q) => [q.id, false]));
    const result = calculateFinanceCheckScore(answers);
    expect(result.score).toBe(0);
    expect(result.status).toBe("red");
    expect(result.tips).toHaveLength(10);
  });

  it("case 2: scores 100 and status green when every answer is yes", () => {
    const answers = Object.fromEntries(FINANCE_CHECK_QUESTIONS.map((q) => [q.id, true]));
    const result = calculateFinanceCheckScore(answers);
    expect(result.score).toBe(100);
    expect(result.status).toBe("green");
    expect(result.tips).toHaveLength(0);
  });

  it("case 3: scores amber in the 50-70 band", () => {
    const answers = Object.fromEntries(FINANCE_CHECK_QUESTIONS.map((q, i) => [q.id, i < 6]));
    const result = calculateFinanceCheckScore(answers);
    expect(result.score).toBe(60);
    expect(result.status).toBe("amber");
  });

  it("case 4: each answered 'yes' question is worth exactly 10 points", () => {
    const result = calculateFinanceCheckScore(answersFor(["q1", "q2", "q3"]));
    expect(result.score).toBe(30);
  });

  it("case 5: missing keys in the answers map are treated as 'no'", () => {
    const result = calculateFinanceCheckScore({ q1: true });
    expect(result.score).toBe(10);
    expect(result.tips).toHaveLength(9);
  });

  it("case 6: exactly 50 points lands in the amber band (inclusive lower bound)", () => {
    const result = calculateFinanceCheckScore(answersFor(["q1", "q2", "q3", "q4", "q5"]));
    expect(result.score).toBe(50);
    expect(result.status).toBe("amber");
  });

  it("case 7: exactly 80 points lands in the green band (inclusive lower bound)", () => {
    const result = calculateFinanceCheckScore(
      answersFor(["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"])
    );
    expect(result.score).toBe(80);
    expect(result.status).toBe("green");
  });

  it("case 8: 40 points stays in the red band (just below the amber threshold)", () => {
    const result = calculateFinanceCheckScore(answersFor(["q1", "q2", "q3", "q4"]));
    expect(result.score).toBe(40);
    expect(result.status).toBe("red");
  });

  it("case 9: tips are only generated for unanswered ('no') questions and carry the right service link", () => {
    const result = calculateFinanceCheckScore(answersFor(["q1"]));
    expect(result.tips.some((t) => t.question === FINANCE_CHECK_QUESTIONS[0].text)).toBe(false);
    const q2Tip = result.tips.find((t) => t.question === FINANCE_CHECK_QUESTIONS[1].text);
    expect(q2Tip?.serviceHref).toBe(FINANCE_CHECK_QUESTIONS[1].serviceHref);
  });

  it("case 10: there are exactly 10 questions, each worth an equal share of the 100-point scale", () => {
    expect(FINANCE_CHECK_QUESTIONS).toHaveLength(10);
    const allYesResult = calculateFinanceCheckScore(
      answersFor(FINANCE_CHECK_QUESTIONS.map((q) => q.id))
    );
    expect(allYesResult.score).toBe(100);
  });
});
