import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { TOOLS } from "@/lib/tools-meta";
import Button from "@/components/ui/Button";

const FEATURED_IMAGE_DIR =
  "/images/home%20page%202nd%20section/stitch_wealth_management_hub";

const FEATURED_SLUGS: { slug: string; image: string }[] = [
  {
    slug: "finance-check",
    image: `${FEATURED_IMAGE_DIR}/professional_clean_photography_of_a_modern_workspace_with_a_digital_tablet/screen.png`,
  },
  {
    slug: "real-estate",
    image: `${FEATURED_IMAGE_DIR}/close_up_shot_of_a_diverse_professional_team_collaborating_over_a_laptop/screen.png`,
  },
  {
    slug: "investment",
    image: `${FEATURED_IMAGE_DIR}/3d_illustration_of_a_glowing_blue_piggy_bank_with_digital_coins_floating_around/screen.png`,
  },
];

export default function ToolsStrip() {
  const tools = FEATURED_SLUGS.map(({ slug, image }) => {
    const tool = TOOLS.find((t) => t.slug === slug)!;
    return { ...tool, featuredImage: image };
  }).filter(Boolean);

  return (
    <section className="mx-auto max-w-[100rem] px-6 pt-16 pb-8 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6" data-reveal>
        <div>
          <p className="eyebrow mb-3">— Your financial start</p>
          <h2 className="text-3xl sm:text-4xl font-medium leading-tight text-ink-900">
            Our Free <span className="text-accent-600">Financial Tools</span>
          </h2>
        </div>
        <Button href="/tools" className="gap-3 pr-1.5">
          View Tools
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Button>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group="tools">
        {tools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`} data-reveal className="group block h-full">
            <article className="flex h-full flex-col rounded-2xl border border-ink-200/60 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={tool.featuredImage}
                  alt={tool.imageAlt ?? tool.title}
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 px-1 font-serif text-lg leading-snug text-ink-900">{tool.title}</p>
              <p className="mt-2 flex-1 px-1 text-sm text-ink-600 leading-relaxed">
                {tool.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 px-1 pb-1 text-sm font-medium text-accent-600">
                Open tool
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
