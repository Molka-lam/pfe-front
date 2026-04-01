import { useAuth } from "@/context/AuthContext";
import { useUsageStats } from "@/hooks/useLicense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsageProgressBar } from "@/components/ui/UsageProgressBar";
import { BarChart3, Loader2, AlertCircle } from "lucide-react";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { data: usage, isLoading, error } = useUsageStats();

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          Usage et Analytics
        </h1>
        <p className="text-slate-500 mt-1">Indicateurs de consommation du tenant {user?.tenant_id || "courant"}.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">KPI d'usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement...
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4" /> Impossible de charger les analytics.
            </div>
          )}
          {usage && (
            <>
              <UsageProgressBar label="API" used={usage.api_calls_used} limit={usage.api_calls_limit} unit="req/mois" />
              <UsageProgressBar label="Utilisateurs" used={usage.users_count} limit={usage.users_limit} unit="users" />
              <UsageProgressBar label="Stockage" used={usage.storage_used_gb} limit={usage.storage_limit_gb} unit="Go" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
