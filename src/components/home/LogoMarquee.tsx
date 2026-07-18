import { AtSign, Share2, Star } from "lucide-react";

const ITEMS = [
  { icon: Star, label: "Trustpilot", sub: "5.0 rating" },
  { icon: Star, label: "Google Reviews", sub: "5.0 rating" },
  { icon: AtSign, label: "@myfinanzguru", sub: "Follow us" },
  { icon: Share2, label: "MyFinanzGuru", sub: "Connect on LinkedIn" },
  // {{RATING}} — placeholder, replace with real figure
  { icon: Star, label: "4.9/5", sub: "Average client rating" },
];

export default function LogoMarquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="border-y border-ink-200/60 bg-sky-100 py-6">
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-4">
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-ink-200/60 bg-white px-4 py-2"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-accent-600">
                <item.icon className="h-3.5 w-3.5 fill-current" />
              </span>
              <span className="text-sm font-semibold text-ink-900">{item.label}</span>
              <span className="text-xs text-ink-500">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
