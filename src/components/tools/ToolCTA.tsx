import Button from "@/components/ui/Button";

export default function ToolCTA({
  label = "Discuss your result in a free meeting",
}: {
  label?: string;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl accent-gradient px-6 py-6 text-center">
      <p className="font-serif text-lg text-ink-900">Want a second opinion on this?</p>
      <p className="text-sm text-ink-800/80 max-w-sm">
        A free 30-minute call turns this estimate into a concrete plan for your situation.
      </p>
      <Button href="/book" variant="outline" className="!border-ink-900 !bg-white/90 mt-1">
        {label} →
      </Button>
    </div>
  );
}
