export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  icon: string; // lucide icon name, resolved in ServiceIcon
  image: string;
  imageAlt: string;
  intro: string;
  benefits: string[];
  steps: { title: string; description: string }[];
  relatedToolHref?: string;
  relatedToolLabel?: string;
  faqs: ServiceFaq[];
}

export const SERVICES: Service[] = [
  {
    slug: "private-credits",
    title: "Private Credits",
    summary: "Independent comparison and structuring of personal and consumer loans.",
    icon: "HandCoins",
    image:
      "/images/service%20page/stitch_horizontal_finance_visuals/professional_high_quality_portrait_photography._a_close_up_of_a_high_end_credit/screen.png",
    imageAlt: "A house key, pen, and loan documents laid out on a white linen surface",
    intro:
      "Whether you're consolidating existing debt, financing a large purchase, or bridging a temporary gap, the terms of a private loan can vary enormously between providers. We compare offers across the market and help you structure a loan that fits your budget — not the other way around.",
    benefits: [
      "Independent comparison across banks and specialist lenders, not tied to a single provider",
      "Clear breakdown of effective interest rate (effektiver Jahreszins) versus nominal rate",
      "Guidance on debt consolidation to lower your total monthly burden",
      "Support with early repayment options and flexible terms",
      "A second opinion before you sign anything",
    ],
    steps: [
      { title: "Share your situation", description: "Tell us what you need the credit for and your current financial picture." },
      { title: "We compare the market", description: "We shortlist offers that genuinely fit your needs and budget." },
      { title: "You decide, informed", description: "We explain the fine print in plain language so you choose with confidence." },
    ],
    relatedToolHref: "/tools/brutto-netto",
    relatedToolLabel: "Check your net income first",
    faqs: [
      { question: "Do you charge for a loan comparison?", answer: "The initial comparison and consultation is free. Any provider-side fees are disclosed transparently before you commit to anything." },
      { question: "Will this affect my credit score?", answer: "We only run a non-binding comparison first — a formal credit check (Schufa-Anfrage) only happens once you actively choose to apply for a specific offer." },
      { question: "Can you help if I already have existing debt?", answer: "Yes — debt consolidation and restructuring is one of the most common reasons people come to us." },
    ],
  },
  {
    slug: "child-future-education",
    title: "Child Future & Educational Planning",
    summary: "Build a dedicated fund for your child's education and future independence.",
    icon: "Baby",
    image:
      "/images/service%20page/stitch_horizontal_finance_visuals/professional_high_quality_portrait_photography._a_minimalist_representation_of/screen.png",
    imageAlt: "A parent and child putting a coin into a clear glass savings jar",
    intro:
      "Education costs, a first car, a deposit for an apartment — the financial milestones of childhood add up. We help you build a long-term, low-effort savings plan for your child so those moments arrive with money already set aside, not scrambled together.",
    benefits: [
      "Long-horizon ETF savings plans designed around your child's age and goals",
      "Guidance on accounts held in the child's name versus the parents' name",
      "Overview of state support (Kindergeld, VL) that can be redirected into savings",
      "Flexible contribution plans that scale with your income",
      "A plan built to be adjusted as your child grows, not fixed in stone",
    ],
    steps: [
      { title: "Define the goal", description: "Education, a first home, general independence — we clarify what you're saving for." },
      { title: "Choose the vehicle", description: "We recommend the account structure and investment mix for the time horizon." },
      { title: "Automate it", description: "A monthly standing order does the rest — reviewed with you once a year." },
    ],
    relatedToolHref: "/tools/investment",
    relatedToolLabel: "Model a long-term savings plan",
    faqs: [
      { question: "At what age should we start?", answer: "The earlier the better — even small monthly amounts compound meaningfully over 15-18 years." },
      { question: "Who owns the investment account?", answer: "We'll walk you through the trade-offs of custodial accounts in the child's name versus keeping the assets in your own name." },
      { question: "What if our budget is tight some months?", answer: "Plans are built to be flexible — you can pause or reduce contributions without penalty in most structures we recommend." },
    ],
  },
  {
    slug: "private-health-insurance",
    title: "Private Health Insurance",
    summary: "An honest, side-by-side look at whether PKV makes sense for you.",
    icon: "HeartPulse",
    image:
      "/images/service%20page/stitch_horizontal_finance_visuals/professional_high_quality_portrait_photography._a_person_s_hands_signing_a/screen.png",
    imageAlt: "A stethoscope resting on a white folder beside a navy blue pen on a desk",
    intro:
      "Switching from statutory (GKV) to private health insurance (PKV) is one of the most consequential — and hardest to reverse — financial decisions you'll make in Germany. We walk through your eligibility, your health situation, and your long-term plans before recommending anything.",
    benefits: [
      "Eligibility check against the Jahresarbeitsentgeltgrenze and your employment status",
      "Transparent comparison of monthly premiums against your current GKV contribution",
      "Explanation of what changes with age, health events, and having children",
      "A realistic look at the return path — switching back to GKV gets harder over time",
      "No product placement — we're not paid more for recommending a switch",
    ],
    steps: [
      { title: "Run the numbers", description: "Use our Health Insurance calculator for a first, no-obligation estimate." },
      { title: "Discuss your situation", description: "Health history, career plans, and family plans all affect the right answer." },
      { title: "Decide with full information", description: "We only proceed with a provider once you're confident in the trade-offs." },
    ],
    relatedToolHref: "/tools/health-insurance",
    relatedToolLabel: "Compare GKV vs. PKV",
    faqs: [
      { question: "Is PKV always cheaper when you're young?", answer: "Often the monthly premium is lower, but premiums rise with age and the switch back to GKV is restricted — the full lifetime picture matters more than year one." },
      { question: "Can self-employed people always choose PKV?", answer: "Generally yes, self-employed people can choose between GKV and PKV regardless of income, unlike most employees." },
      { question: "What happens if I have children later?", answer: "In GKV, children are co-insured for free. In PKV, each family member needs their own separate, paid policy — a cost worth planning for in advance." },
    ],
  },
  {
    slug: "real-estate-investment",
    title: "Real Estate Investment",
    summary: "From your first owner-occupied home to a diversified property portfolio.",
    icon: "Home",
    image:
      "/images/service%20page/stitch_horizontal_finance_visuals/professional_high_quality_portrait_photography._an_abstract_minimalist/screen.png",
    imageAlt: "A modern German apartment building facade under a clear blue sky",
    intro:
      "Real estate remains one of the most trusted ways to build wealth in Germany — but the financing structure, the state you buy in, and the interest environment all change the calculation. We help you understand what you can realistically afford and how to structure the financing.",
    benefits: [
      "A realistic maximum purchase price based on your income and equity",
      "Explanation of incidental purchase costs (Grunderwerbsteuer, notary, broker) by federal state",
      "Guidance on fixed-interest periods (Zinsbindung) and repayment rates (Tilgung)",
      "A look at buy-to-let as a portfolio diversifier, not just owner-occupation",
      "Coordination with tax and insurance planning so the purchase fits your whole picture",
    ],
    steps: [
      { title: "Model your budget", description: "Use our Real Estate calculator to see a realistic price range in minutes." },
      { title: "Compare financing structures", description: "We review interest, repayment rate, and fixed-term options against your goals." },
      { title: "Plan the purchase", description: "We coordinate timing with your broader financial and tax situation." },
    ],
    relatedToolHref: "/tools/real-estate",
    relatedToolLabel: "Calculate your property budget",
    faqs: [
      { question: "How much equity do I really need?", answer: "20-30% equity typically gets you meaningfully better loan conditions, though it is possible to finance more." },
      { question: "Does the federal state really change the price I can afford?", answer: "Yes — Grunderwerbsteuer alone ranges from 3.5% to 6.5% of the purchase price depending on the state." },
      { question: "Is buy-to-let still worth it with current interest rates?", answer: "It depends heavily on location, rental yield, and your holding period — we look at the real numbers rather than general market sentiment." },
    ],
  },
  {
    slug: "gold-silver",
    title: "Physical Gold & Silver Investment",
    summary: "Diversify part of your portfolio into physical precious metals.",
    icon: "Coins",
    image:
      "/images/service%20page/stitch_horizontal_finance_visuals/professional_high_quality_portrait_photography_for_a_mobile_bank._a_person_in_a/screen.png",
    imageAlt: "A stack of gold bars and silver coins on a cool slate gray surface",
    intro:
      "Physical gold and silver can act as a hedge against inflation and market volatility when held as a modest part of a diversified portfolio. We explain the practical side — storage, purity, dealer selection, and tax treatment — so you avoid the common pitfalls.",
    benefits: [
      "Guidance on appropriate portfolio allocation — a complement, not a replacement, for other assets",
      "Explanation of tax-free holding periods for private sales in Germany",
      "Introductions to reputable, audited dealers and storage options",
      "Clarity on coins versus bars, and recognized versus unrecognized products",
      "Honest talk about liquidity — physical metals are not as liquid as ETFs",
    ],
    steps: [
      { title: "Define the allocation", description: "We help you decide what share of your portfolio, if any, makes sense in physical metals." },
      { title: "Choose the structure", description: "Coins, bars, home storage or vault storage — each has different trade-offs." },
      { title: "Execute with a trusted dealer", description: "We only work with dealers who meet strict provenance and audit standards." },
    ],
    relatedToolHref: "/tools/investment",
    relatedToolLabel: "See how this fits your total portfolio",
    faqs: [
      { question: "Is gold really tax-free in Germany?", answer: "Private sales of physical gold and silver coins/bars are generally tax-free after a one-year holding period — we confirm the current rules apply to your situation." },
      { question: "How much of my portfolio should be in metals?", answer: "Most balanced portfolios use a modest single-digit percentage allocation — we tailor this to your risk profile." },
      { question: "Bars or coins?", answer: "It depends on your goals around liquidity, storage, and resale — we walk through the trade-offs before you buy." },
    ],
  },
  {
    slug: "all-finance-prime",
    title: "All Finance Prime",
    summary: "Our holistic, 360° review across every area of your finances.",
    icon: "LayoutGrid",
    image:
      "/images/service%20page/stitch_horizontal_finance_visuals/professional_high_quality_portrait_photography_for_a_finance_app._a_confident/screen.png",
    imageAlt: "An overhead view of an organized desk with financial charts and a smartphone",
    intro:
      "All Finance Prime is our flagship offering: a complete review of your income, expenses, insurance, tax situation, pension outlook, and investments — brought together into a single, prioritized action plan instead of scattered advice.",
    benefits: [
      "One consolidated view instead of five different, disconnected conversations",
      "A prioritized action plan — what to fix first, what can wait",
      "Ongoing annual reviews as your income, family, and goals change",
      "Coordination across tax, insurance, and investment decisions so they don't conflict",
      "A single point of contact who knows your full picture",
    ],
    steps: [
      { title: "Full-picture intake", description: "We gather your income, costs, policies, and goals in one structured conversation." },
      { title: "Gap analysis", description: "We identify what's missing, overlapping, or underperforming." },
      { title: "Prioritized roadmap", description: "You leave with a clear, ordered list of next steps — not a sales pitch." },
    ],
    relatedToolHref: "/tools/finance-check",
    relatedToolLabel: "Start with the free Finance Check",
    faqs: [
      { question: "Who is All Finance Prime for?", answer: "Anyone who wants a single, coordinated plan rather than managing tax, insurance, and investments separately." },
      { question: "How long does the review take?", answer: "The initial review typically spans one to two sessions, followed by an annual check-in." },
      { question: "Does this replace my tax advisor?", answer: "No — we coordinate with your tax advisor and other professionals rather than replacing them." },
    ],
  },
  {
    slug: "tax-retirement",
    title: "Tax & Retirement Savings",
    summary: "Reduce your tax burden today while building your pension for tomorrow.",
    icon: "PiggyBank",
    image:
      "/images/service%20page/stitch_horizontal_finance_visuals/professional_high_quality_portrait_photography._a_top_down_view_of_a_clean/screen.png",
    imageAlt: "An hourglass with white sand beside a neat document stack and reading glasses",
    intro:
      "Germany's pension and tax systems reward those who plan ahead — Riester, Rürup, company pensions (bAV), and VL all offer incentives that are easy to leave on the table if nobody explains them clearly. We help you use what's available to you.",
    benefits: [
      "A clear read of your statutory pension outlook (Renteninformation)",
      "Guidance on company pension schemes (bAV) and employer matching",
      "Explanation of Riester and Rürup incentives and who they actually benefit",
      "Legal strategies to reduce your taxable income within the rules",
      "A retirement savings plan that complements, not duplicates, your other investments",
    ],
    steps: [
      { title: "Review your pension gap", description: "We estimate the gap between your statutory pension and your expected needs." },
      { title: "Match incentives to your situation", description: "Not every subsidy suits every income level — we filter out what doesn't apply." },
      { title: "Build the combined plan", description: "Tax efficiency and retirement savings are planned together, not separately." },
    ],
    relatedToolHref: "/tools/brutto-netto",
    relatedToolLabel: "See your current tax position",
    faqs: [
      { question: "Is Riester still worth it?", answer: "It depends heavily on your income, family status, and eligibility for the full subsidy — we check this case by case." },
      { question: "What is bAV and should I use it?", answer: "Betriebliche Altersvorsorge lets you build pension savings from gross salary, often with an employer top-up — usually worth exploring." },
      { question: "How do I find out what my state pension will be?", answer: "We help you request and interpret your official Renteninformation from Deutsche Rentenversicherung." },
    ],
  },
  {
    slug: "insurance-protection",
    title: "Insurance & Protection",
    summary: "The right coverage for the risks that could actually hurt you.",
    icon: "ShieldCheck",
    image:
      "/images/service%20page/stitch_horizontal_finance_visuals/professional_high_quality_portrait_photography._two_professionals_shaking_hands/screen.png",
    imageAlt: "A navy blue umbrella sheltering a small model house and family figurines",
    intro:
      "Most people are over-insured against small risks and under-insured against the ones that matter — like losing the ability to work. We review your existing policies and recommend coverage based on real risk, not sales quotas.",
    benefits: [
      "A review of income protection (Berufsunfähigkeitsversicherung) — often the most important, most overlooked policy",
      "An audit of existing policies to cut overlapping or unnecessary coverage",
      "Liability, household, and life insurance sized to your actual situation",
      "Plain-language explanations of exclusions and waiting periods before you sign",
      "A biennial review habit so your coverage keeps pace with your life",
    ],
    steps: [
      { title: "Audit what you have", description: "We review your existing policies for gaps, overlaps, and unnecessary cost." },
      { title: "Close the real gaps", description: "We prioritize the coverage that protects your income and dependents first." },
      { title: "Review every two years", description: "Life changes — job, marriage, children — and your coverage should too." },
    ],
    relatedToolHref: "/tools/finance-check",
    relatedToolLabel: "Check your coverage gaps",
    faqs: [
      { question: "Do I really need income protection (BU)?", answer: "For most employees, your ability to earn is your single biggest asset — BU is widely considered essential, yet it's one of the most under-purchased policies in Germany." },
      { question: "Am I over-insured?", answer: "Very possibly — many households carry redundant small policies that cost more over time than the risk they cover." },
      { question: "How often should I review my insurance?", answer: "We recommend at least every two years, and after any major life change." },
    ],
  },
  {
    slug: "fund-etf-strategy",
    title: "Fund & ETF Strategy",
    summary: "A disciplined, low-cost investment strategy built around your goals.",
    icon: "TrendingUp",
    image:
      "/images/service%20page/stitch_horizontal_finance_visuals/professional_high_quality_portrait_photography_for_a_mobile_financial_services/screen.png",
    imageAlt: "A minimal 3D illustration of a rising line chart with coins, in glossy blue tones",
    intro:
      "Building wealth through markets doesn't require picking stocks or timing the market — it requires a disciplined, diversified, low-cost strategy you can stick with for decades. We help you design and automate exactly that.",
    benefits: [
      "A diversified ETF portfolio matched to your risk tolerance and time horizon",
      "Cost-conscious fund selection — TER matters more than most people realize",
      "Automated monthly savings plans that remove emotion from investing",
      "Guidance through market downturns so you don't sell at the wrong moment",
      "Annual rebalancing reviews to keep your allocation on target",
    ],
    steps: [
      { title: "Define risk and horizon", description: "Your strategy starts with how much risk you can tolerate and how long you're investing for." },
      { title: "Build the portfolio", description: "We select a diversified, low-cost fund mix aligned to that profile." },
      { title: "Automate and review", description: "A standing order does the investing; we review and rebalance annually." },
    ],
    relatedToolHref: "/tools/investment",
    relatedToolLabel: "Model your investment growth",
    faqs: [
      { question: "How much do fees really matter?", answer: "A 1% difference in ongoing fees can cost tens of thousands of euros over a multi-decade investment horizon — it matters enormously." },
      { question: "Do I need to time the market?", answer: "No — a regular savings plan (Sparplan) is specifically designed to smooth out market timing risk through euro-cost averaging." },
      { question: "What if the market drops right after I invest?", answer: "This is normal and expected over a multi-decade horizon — we help you build a strategy designed to be held through downturns, not abandoned." },
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
