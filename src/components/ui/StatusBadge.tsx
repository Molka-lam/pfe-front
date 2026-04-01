import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  status: "active" | "suspended" | "expired" | "PENDING" | "APPROVED" | "REJECTED";
  className?: string; // Add className prop for flexibility
}

export function StatusBadge({ status, className }: Props) {
  const getLabel = () => {
    switch (status) {
      case "active": return "Actif";
      case "suspended": return "Suspendu";
      case "expired": return "Expiré";
      case "PENDING": return "En attente";
      case "APPROVED": return "Approuvé";
      case "REJECTED": return "Refusé";
      default: return status;
    }
  };

  return (
    <Badge
      className={cn(
        "font-medium",
        status === "active" && "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
        status === "suspended" && "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200",
        status === "expired" && "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
        status === "PENDING" && "bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200",
        status === "APPROVED" && "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
        status === "REJECTED" && "bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200",
        className
      )}
    >
      {getLabel()}
    </Badge>
  );
}
