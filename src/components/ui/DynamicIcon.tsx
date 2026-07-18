import * as icons from "lucide-react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const IconComponent = (icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
    name
  ] ?? HelpCircle;

  return <IconComponent className={cn("h-5 w-5", className)} />;
}
