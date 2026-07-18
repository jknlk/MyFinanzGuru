import { SearchX } from "lucide-react";
import Card from "./Card";

export function ResultEmptyState({
  message = "Enter your details and click “Calculate now”",
}: {
  message?: string;
}) {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center py-16">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-accent-500">
        <SearchX className="h-7 w-7" />
      </div>
      <p className="text-ink-500 max-w-xs">{message}</p>
    </div>
  );
}

export default function ResultPanel({ children }: { children: React.ReactNode }) {
  return (
    <Card className="sticky top-28 min-h-[420px] flex flex-col">{children}</Card>
  );
}
