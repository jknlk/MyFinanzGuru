export interface ToolMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  imageAlt?: string;
}

const TOOLS_IMG_DIR = "/images/tools%20img/stitch_horizontal_finance_visuals";

export const TOOLS: ToolMeta[] = [
  {
    slug: "finance-check",
    title: "Finance Check",
    description: "Answer 10 quick questions and get an instant score of your financial health.",
    icon: "ClipboardCheck",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_landscape_photography._two_business_professionals/screen.png`,
    imageAlt: "Two business professionals walking through a glass corridor overlooking a city skyline",
  },
  {
    slug: "real-estate",
    title: "Real Estate Calculator",
    description: "Find the maximum property price you can realistically afford.",
    icon: "Home",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_landscape_photography._a_top_down_view_of_a_small/screen.png`,
    imageAlt: "A top-down view of a miniature house model beside a calculator and house keys",
  },
  {
    slug: "health-insurance",
    title: "Health Insurance Calculator",
    description: "Compare statutory (GKV) and private (PKV) health insurance side by side.",
    icon: "HeartPulse",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_portrait_photography._a_confident_female_executive/screen.png`,
    imageAlt: "A confident executive looking out over a city skyline at dusk while holding a tablet",
  },
  {
    slug: "investment",
    title: "Investment Calculator",
    description: "Model how a monthly ETF savings plan could grow over time.",
    icon: "TrendingUp",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_banner_photography._a_panoramic_view_of_a_clean/screen.png`,
    imageAlt: "A tablet on a desk displaying a rising investment chart",
  },
  {
    slug: "brutto-netto",
    title: "Brutto-Netto Calculator",
    description: "See exactly what lands in your account after tax and social contributions.",
    icon: "Wallet",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_portrait_photography._a_sleek_modern_piggy_bank_made/screen.png`,
    imageAlt: "A marble piggy bank with a gold coin balanced on top",
  },
  {
    slug: "loan-payment",
    title: "Loan Payment Calculator",
    description: "Work out your monthly rate, interest and principal split for any loan.",
    icon: "Landmark",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_portrait_photography._a_person_s_hand_holding_a_high/screen.png`,
    imageAlt: "A hand holding a premium metal credit card in a boutique store",
  },
  {
    slug: "compound-interest",
    title: "Compound Interest Calculator",
    description: "See how a lump sum and regular deposits compound over the years.",
    icon: "TrendingUp",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_landscape_photography_for_a_financial_services_brand/screen.png`,
    imageAlt: "A trader working on a laptop with live market charts on nearby screens",
  },
  {
    slug: "emergency-fund",
    title: "Emergency Fund Calculator",
    description: "Find your ideal financial safety net based on your job and living costs.",
    icon: "ShieldCheck",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_portrait_photography._a_close_up_of_a_high_end/screen.png`,
    imageAlt: "A close-up of a hand holding a gold coin engraved with 'Asset Security'",
  },
  {
    slug: "vat-calculator",
    title: "VAT Calculator",
    description: "Convert between net and gross prices at 19%, 7% or a custom VAT rate.",
    icon: "Percent",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_wide_photography._an_abstract_composition_of_blue/screen.png`,
    imageAlt: "An abstract network of glowing blue lines connecting global currency symbols",
  },
  {
    slug: "calculator",
    title: "Calculator",
    description: "A fast everyday calculator with a scientific mode, right in your browser.",
    icon: "Calculator",
    image: `${TOOLS_IMG_DIR}/professional_high_quality_portrait_photography._a_modern_smartphone_displaying/screen.png`,
    imageAlt: "A smartphone on a desk showing a secure banking app login screen",
  },
];
