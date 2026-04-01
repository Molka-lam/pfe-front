import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "lucide-react";

export default function FeaturesLimitsPage() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Gauge className="h-6 w-6 text-blue-600" />
          Features et Limites
        </h1>
        <p className="text-slate-500 mt-1">Vue centralisee des fonctionnalites et quotas par plan.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Matrice fonctionnelle</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-700 space-y-2">
          <p>Features cibles: advanced_ai, export_pdf, dashboard_analytics, api_access.</p>
          <p>Limites cibles: max_users, api_calls_per_month, storage_gb.</p>
          <p>Cette page sert de reference metier pour aligner plans, licences et controles backend.</p>
        </CardContent>
      </Card>
    </div>
  );
}
