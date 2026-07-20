export type JobSecurity = "secure" | "standard" | "precarious" | "selfEmployed";

export interface EmergencyFundInput {
  monthlyExpenses: number;
  jobSecurity: JobSecurity;
  hasDependents: boolean;
  existingSavings: number;
  monthlySavingsRate: number;
}

export interface EmergencyFundResult {
  recommendedMonths: number;
  targetAmount: number;
  savingsGap: number;
  monthsToGoal: number | null; // null if already reached or no positive savings rate
  progressPct: number; // 0-100, existing savings vs target
  milestones: { amount: number; reached: boolean }[];
}

const BASE_MONTHS: Record<JobSecurity, number> = {
  secure: 3,
  standard: 5,
  precarious: 6,
  selfEmployed: 9,
};

const MILESTONE_AMOUNTS = [1000, 2500, 5000, 10000];

/** German Notgroschen sizing: months of coverage scaled by job security and dependents. */
export function calculateEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const { monthlyExpenses, jobSecurity, hasDependents, existingSavings, monthlySavingsRate } = input;

  const recommendedMonths = BASE_MONTHS[jobSecurity] + (hasDependents ? 1 : 0);
  const targetAmount = monthlyExpenses * recommendedMonths;
  const savingsGap = Math.max(0, targetAmount - existingSavings);

  const monthsToGoal =
    savingsGap <= 0 ? 0 : monthlySavingsRate > 0 ? Math.ceil(savingsGap / monthlySavingsRate) : null;

  const progressPct = targetAmount > 0 ? Math.min(100, (existingSavings / targetAmount) * 100) : 100;

  const milestones = MILESTONE_AMOUNTS.map((amount) => ({
    amount,
    reached: existingSavings >= amount,
  }));

  return { recommendedMonths, targetAmount, savingsGap, monthsToGoal, progressPct, milestones };
}
