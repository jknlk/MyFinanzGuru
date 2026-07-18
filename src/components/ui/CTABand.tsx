import Button from "./Button";
import BlobShape from "./BlobShape";

export default function CTABand({
  heading,
  sub,
  ctaLabel = "Book your free meeting",
  ctaHref = "/book",
}: {
  heading: string;
  sub?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-14 text-center sm:px-16 sm:py-16"
      data-reveal
    >
      <BlobShape tone="dark-accent" size={340} className="-right-24 -top-24" />
      <BlobShape tone="accent" size={260} className="-bottom-20 -left-16" />
      <div className="relative">
        <h2 className="font-serif text-3xl text-white sm:text-4xl">{heading}</h2>
        {sub && <p className="mt-3 max-w-xl mx-auto text-white/70">{sub}</p>}
        <div className="mt-8">
          <Button href={ctaHref} variant="outline" size="lg" className="!bg-white">
            {ctaLabel} →
          </Button>
        </div>
      </div>
    </div>
  );
}
