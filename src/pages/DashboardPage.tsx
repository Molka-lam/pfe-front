import { useAuth } from "@/context/AuthContext";
import { useMyLicense, useUsageStats } from "@/hooks/useLicense";
import { buildAiInsights } from "@/hooks/useAiInsights";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { UsageProgressBar } from "@/components/ui/UsageProgressBar";
import { AiInsightsPanel } from "@/components/ui/AiInsightsPanel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Key,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    data: license,
    isLoading: licLoading,
    error: licError,
  } = useMyLicense();
  const {
    data: usage,
    isLoading: usageLoading,
    error: usageError,
  } = useUsageStats();
  const insights = license && usage ? buildAiInsights(license, usage) : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {greeting()}, {user?.name} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Voici un aperçu de votre licence et de votre consommation.
        </p>
      </div>

      {/* License Summary Card */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          Votre Licence
        </h2>

        {licLoading && (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement...
          </div>
        )}

        {licError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="h-4 w-4" />
            Impossible de charger la licence.
          </div>
        )}

        {license && (
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-800">
                    Licence{" "}
                    <span className="font-mono text-sm text-slate-500">
                      #{license.id.slice(0, 8)}
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Expire le{" "}
                    {format(new Date(license.expires_at), "d MMMM yyyy", {
                      locale: fr,
                    })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <PlanBadge plan={license.plan} />
                  <StatusBadge status={license.status} />
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(
                  [
                    ["advanced_ai", "IA avancée"],
                    ["export_pdf", "Export PDF"],
                    ["multi_user", "Multi-utilisateurs"],
                    ["api_access", "Accès API"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    {license.features[key] ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-300 shrink-0" />
                    )}
                    <span
                      className={
                        license.features[key]
                          ? "text-slate-700"
                          : "text-slate-400"
                      }
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/license">
                    Voir le détail
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Usage Summary */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Consommation du mois
        </h2>

        {usageLoading && (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement...
          </div>
        )}

        {usageError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="h-4 w-4" />
            Impossible de charger les statistiques.
          </div>
        )}

        {usage && (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6 space-y-5">
              <UsageProgressBar
                label="Appels API"
                used={usage.api_calls_used}
                limit={usage.api_calls_limit}
                unit="req/mois"
              />
              <UsageProgressBar
                label="Utilisateurs"
                used={usage.users_count}
                limit={usage.users_limit}
                unit="utilisateurs"
              />
              <UsageProgressBar
                label="Stockage"
                used={usage.storage_used_gb}
                limit={usage.storage_limit_gb}
                unit="Go"
              />
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard/usage">
                    Voir la consommation complète
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* AI Insights */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Assistant IA</h2>
        {insights ? (
          <AiInsightsPanel insights={insights} />
        ) : (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6 text-sm text-slate-500">
              Les insights IA seront disponibles une fois les données de licence et de consommation chargées.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
