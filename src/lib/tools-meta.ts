export interface ToolMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  imageAlt: string;
}

export const TOOLS: ToolMeta[] = [
  {
    slug: "finance-check",
    title: "Finance Check",
    description: "Answer 10 quick questions and get an instant score of your financial health.",
    icon: "ClipboardCheck",
    image: "/images/tool-finance-check.png",
    imageAlt: "A minimal 3D clipboard icon with checkmarks, in glossy blue tones",
  },
  {
    slug: "real-estate",
    title: "Real Estate Calculator",
    description: "Find the maximum property price you can realistically afford.",
    icon: "Home",
    image: "/images/tool-real-estate.png",
    imageAlt: "A minimal 3D house icon with a percentage symbol, in glossy blue tones",
  },
  {
    slug: "health-insurance",
    title: "Health Insurance Calculator",
    description: "Compare statutory (GKV) and private (PKV) health insurance side by side.",
    icon: "HeartPulse",
    image: "/images/tool-health-insurance.png",
    imageAlt: "A minimal 3D shield icon with a medical cross, in glossy blue tones",
  },
  {
    slug: "investment",
    title: "Investment Calculator",
    description: "Model how a monthly ETF savings plan could grow over time.",
    icon: "TrendingUp",
    image: "/images/tool-investment.png",
    imageAlt: "A minimal 3D rising line chart icon with coins, in glossy blue tones",
  },
  {
    slug: "brutto-netto",
    title: "Brutto-Netto Calculator",
    description: "See exactly what lands in your account after tax and social contributions.",
    icon: "Wallet",
    image: "/images/tool-brutto-netto.png",
    imageAlt: "A minimal 3D wallet icon with a calculator, in glossy blue tones",
  },
];
