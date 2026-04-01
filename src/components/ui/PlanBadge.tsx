import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  plan: "BASIC" | "PRO" | "ENTERPRISE";
}

export function PlanBadge({ plan }: Props) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold",
        plan === "BASIC" && "border-slate-400 text-slate-600 bg-slate-50",
        plan === "PRO" && "border-blue-500 text-blue-700 bg-blue-50",
        plan === "ENTERPRISE" &&
          "border-purple-500 text-purple-700 bg-purple-50"
      )}
    >
      {plan}
    </Badge>
  );
}
