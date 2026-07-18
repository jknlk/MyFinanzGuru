export interface FinanceCheckQuestion {
  id: string;
  text: string;
  tip: string;
  serviceHref: string;
}

export const FINANCE_CHECK_QUESTIONS: FinanceCheckQuestion[] = [
  {
    id: "q1",
    text: "Do you have an overview of your monthly fixed costs?",
    tip: "Start with a simple budget — knowing your fixed costs is the foundation of every financial decision.",
    serviceHref: "/services/all-finance-prime",
  },
  {
    id: "q2",
    text: "Do you have an emergency fund worth 3 net salaries?",
    tip: "Build a liquid buffer of 3 net salaries before investing further — it protects you from unplanned debt.",
    serviceHref: "/services/all-finance-prime",
  },
  {
    id: "q3",
    text: "Do you invest regularly via an ETF savings plan?",
    tip: "A regular ETF savings plan is one of the simplest ways to build long-term wealth with compound growth.",
    serviceHref: "/services/fund-etf-strategy",
  },
  {
    id: "q4",
    text: "Do you know your current tax rate?",
    tip: "Understanding your marginal tax rate helps you spot legal ways to reduce your tax burden.",
    serviceHref: "/services/tax-retirement",
  },
  {
    id: "q5",
    text: "Have you reviewed an income protection (BU) policy?",
    tip: "Your ability to earn an income is your biggest asset — an income protection policy (BU) protects it.",
    serviceHref: "/services/insurance-protection",
  },
  {
    id: "q6",
    text: "Do you know what your statutory pension will be later?",
    tip: "Request your Renteninformation from Deutsche Rentenversicherung to see your projected statutory pension.",
    serviceHref: "/services/tax-retirement",
  },
  {
    id: "q7",
    text: "Do you use government incentives (e.g. Riester, VL)?",
    tip: "Government incentives like VL (vermögenswirksame Leistungen) are essentially free money many people leave unused.",
    serviceHref: "/services/tax-retirement",
  },
  {
    id: "q8",
    text: "Have you considered real estate as an investment?",
    tip: "Real estate can diversify your portfolio and hedge against inflation — worth exploring even as a renter.",
    serviceHref: "/services/real-estate-investment",
  },
  {
    id: "q9",
    text: "Do you have a written financial plan?",
    tip: "A written plan turns vague goals into concrete, trackable steps — and keeps you consistent when markets are volatile.",
    serviceHref: "/services/all-finance-prime",
  },
  {
    id: "q10",
    text: "Do you compare your insurance policies at least every 2 years?",
    tip: "Insurance markets shift — a regular review often uncovers better coverage for a lower premium.",
    serviceHref: "/services/insurance-protection",
  },
];

export interface FinanceCheckResult {
  score: number;
  status: "red" | "amber" | "green";
  statusLabel: string;
  tips: { question: string; tip: string; serviceHref: string }[];
}

export function calculateFinanceCheckScore(
  answers: Record<string, boolean>
): FinanceCheckResult {
  const score = FINANCE_CHECK_QUESTIONS.reduce(
    (sum, q) => sum + (answers[q.id] ? 10 : 0),
    0
  );

  let status: FinanceCheckResult["status"] = "red";
  let statusLabel = "Time to take control";
  if (score >= 80) {
    status = "green";
    statusLabel = "Strong! Let's optimise the details";
  } else if (score >= 50) {
    status = "amber";
    statusLabel = "Good base — real potential left";
  }

  const tips = FINANCE_CHECK_QUESTIONS.filter((q) => !answers[q.id]).map((q) => ({
    question: q.text,
    tip: q.tip,
    serviceHref: q.serviceHref,
  }));

  return { score, status, statusLabel, tips };
}
