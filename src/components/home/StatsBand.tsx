import SectionHeading from "@/components/ui/SectionHeading";
import StatTile from "@/components/ui/StatTile";
import BlobShape from "@/components/ui/BlobShape";

export default function StatsBand() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-20">
      <BlobShape tone="dark-accent" size={420} className="-left-32 -top-32" />
      <BlobShape tone="dark-accent" size={340} className="-right-24 bottom-0" />
      <div className="relative mx-auto max-w-[100rem] px-6 lg:px-10">
        <SectionHeading heading="Numbers that speak for themselves" align="center" tone="dark" />
        {/* {{CLIENTS}}, {{YEARS}}, {{AUM}}, {{RATING}} — placeholder figures, replace with real numbers before launch */}
        <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <StatTile value={1200} suffix="+" label="Happy clients" tone="dark" />
          <StatTile value={12} label="Years combined experience" tone="dark" />
          <StatTile value={180} prefix="€" suffix="M+" label="Assets guided" tone="dark" />
          <StatTile value={4.9} decimals={1} suffix=" ★" label="Average rating" tone="dark" />
        </div>
      </div>
    </section>
  );
}
