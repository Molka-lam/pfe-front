import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  used: number;
  limit: number;
  unit: string;
}

export function UsageProgressBar({ label, used, limit, unit }: Props) {
  const percent = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-semibold tabular-nums">
          {used.toLocaleString("fr-FR")} / {limit.toLocaleString("fr-FR")}{" "}
          {unit}
        </span>
      </div>
      <Progress
        value={percent}
        className={cn(
          "h-2",
          percent < 70 && "[&>div]:bg-green-500",
          percent >= 70 && percent < 90 && "[&>div]:bg-orange-500",
          percent >= 90 && "[&>div]:bg-red-500"
        )}
      />
      <p className="text-xs text-muted-foreground text-right">
        {percent.toFixed(0)}% utilisé
      </p>
    </div>
  );
}
