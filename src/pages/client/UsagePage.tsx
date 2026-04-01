import { useUsageStats } from "@/hooks/useLicense";
import { useMyLicense } from "@/hooks/useLicense";
import { UsageProgressBar } from "@/components/ui/UsageProgressBar";
import { AiInsightsPanel } from "@/components/ui/AiInsightsPanel";
import { buildAiInsights } from "@/hooks/useAiInsights";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BarChart2, Calendar, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function UsagePage() {
  const { data: usage, isLoading, error } = useUsageStats();
  const { data: license } = useMyLicense();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement de la consommation...
      </div>
    );
  }

  if (error || !usage) {
    return (
      <div>
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-4 w-4" />
          Impossible de charger les statistiques de consommation.
        </div>
      </div>
    );
  }

  const period = `${format(new Date(usage.period_start), "d MMM", {
    locale: fr,
  })} – ${format(new Date(usage.period_end), "d MMM yyyy", { locale: fr })}`;

  const statsCards = [
    {
      title: "Appels API",
      used: usage.api_calls_used,
      limit: usage.api_calls_limit,
      unit: "req",
      percent:
        usage.api_calls_limit > 0
          ? Math.round((usage.api_calls_used / usage.api_calls_limit) * 100)
          : 0,
    },
    {
      title: "Utilisateurs",
      used: usage.users_count,
      limit: usage.users_limit,
      unit: "users",
      percent:
        usage.users_limit > 0
          ? Math.round((usage.users_count / usage.users_limit) * 100)
          : 0,
    },
    {
      title: "Stockage",
      used: usage.storage_used_gb,
      limit: usage.storage_limit_gb,
      unit: "Go",
      percent:
        usage.storage_limit_gb > 0
          ? Math.round(
              (usage.storage_used_gb / usage.storage_limit_gb) * 100
            )
          : 0,
    },
  ];

  const insights = license ? buildAiInsights(license, usage) : null;

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-blue-600" />
          Consommation
        </h1>
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
          <Calendar className="h-3.5 w-3.5" />
          Période : {period}
        </div>
      </div>

      {/* Summary KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        {statsCards.map((s) => (
          <Card
            key={s.title}
            className={`border text-center ${
              s.percent >= 90
                ? "border-red-200 bg-red-50"
                : s.percent >= 70
                ? "border-orange-200 bg-orange-50"
                : "border-green-200 bg-green-50"
            }`}
          >
            <CardContent className="pt-4 pb-4">
              <p
                className={`text-2xl font-bold ${
                  s.percent >= 90
                    ? "text-red-700"
                    : s.percent >= 70
                    ? "text-orange-700"
                    : "text-green-700"
                }`}
              >
                {s.percent}%
              </p>
              <p className="text-xs text-slate-500 mt-1">{s.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed progress bars */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Détail de la consommation</CardTitle>
          <CardDescription>
            Utilisation en temps réel pour la période en cours
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5 space-y-6">
          <UsageProgressBar
            label="Appels API"
            used={usage.api_calls_used}
            limit={usage.api_calls_limit}
            unit="req/mois"
          />
          <UsageProgressBar
            label="Utilisateurs actifs"
            used={usage.users_count}
            limit={usage.users_limit}
            unit="utilisateurs"
          />
          <UsageProgressBar
            label="Stockage utilisé"
            used={usage.storage_used_gb}
            limit={usage.storage_limit_gb}
            unit="Go"
          />
        </CardContent>
      </Card>

      {/* Raw numbers table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Récapitulatif chiffré</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="divide-y divide-slate-100 text-sm">
            {statsCards.map((s) => (
              <div
                key={s.title}
                className="flex items-center justify-between py-3"
              >
                <span className="text-slate-600">{s.title}</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {s.used.toLocaleString("fr-FR")} /{" "}
                  {s.limit.toLocaleString("fr-FR")} {s.unit}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {insights && <AiInsightsPanel insights={insights} />}
    </div>
  );
}
