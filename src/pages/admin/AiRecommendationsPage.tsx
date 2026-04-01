import { useAllLicenses } from "@/hooks/useLicense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit } from "lucide-react";

export default function AiRecommendationsPage() {
  const { data: licenses } = useAllLicenses();

  const summary = {
    total: licenses?.length ?? 0,
    basic: licenses?.filter((l) => l.plan === "BASIC").length ?? 0,
    highRisk: licenses?.filter((l) => l.status !== "active").length ?? 0,
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-blue-600" />
          IA et Recommandations
        </h1>
        <p className="text-slate-500 mt-1">Aide a la decision pour upgrades, risques et actions prioritaires.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-base">Licences analysees</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-slate-900">{summary.total}</p></CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-base">Candidates upgrade</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-orange-600">{summary.basic}</p></CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-base">Risques detectes</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-600">{summary.highRisk}</p></CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recommandations automatiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <p><Badge variant="outline">Upgrade</Badge> Proposer un passage BASIC vers PRO pour les tenants a forte croissance.</p>
          <p><Badge variant="outline">Anomalie</Badge> Surveiller les licences suspendues ou proches d'expiration.</p>
          <p><Badge variant="outline">Prediction</Badge> Anticiper depassement de quotas API avant blocage metier.</p>
        </CardContent>
      </Card>
    </div>
  );
}
