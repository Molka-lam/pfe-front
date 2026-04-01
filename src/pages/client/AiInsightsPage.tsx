import { useMyLicense, useUsageStats } from "@/hooks/useLicense";
import { buildAiInsights } from "@/hooks/useAiInsights";
import { AiInsightsPanel } from "@/components/ui/AiInsightsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2, AlertCircle } from "lucide-react";

export default function AiInsightsPage() {
  const { data: license, isLoading: loadingLicense, error: errorLicense } = useMyLicense();
  const { data: usage, isLoading: loadingUsage, error: errorUsage } = useUsageStats();

  const loading = loadingLicense || loadingUsage;
  const error = errorLicense || errorUsage;
  const insights = license && usage ? buildAiInsights(license, usage) : null;

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-blue-600" />
          IA et Recommandations
        </h1>
        <p className="text-slate-500 mt-1">Synthese intelligente de votre consommation et des risques.</p>
      </div>

      {loading && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6 flex items-center gap-2 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Chargement des insights IA...
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-base text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" /> Impossible de charger les insights IA.
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {insights && <AiInsightsPanel insights={insights} />}
    </div>
  );
}
