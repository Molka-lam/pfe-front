import { useState } from "react";
import { useValidateFeature } from "@/hooks/useLicense";
import { LicenseFeatureKey } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function ValidationApiPage() {
  const [feature, setFeature] = useState<LicenseFeatureKey>("advanced_ai");
  const validateMutation = useValidateFeature();

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          Validation Licence API
        </h1>
        <p className="text-slate-500 mt-1">Test de l'endpoint POST /licenses/validate.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Simuler une verification de feature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <select
            value={feature}
            onChange={(e) => setFeature(e.target.value as LicenseFeatureKey)}
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="advanced_ai">advanced_ai</option>
            <option value="export_pdf">export_pdf</option>
            <option value="multi_user">multi_user</option>
            <option value="api_access">api_access</option>
          </select>

          <Button onClick={() => validateMutation.mutate(feature)} disabled={validateMutation.isPending}>
            {validateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Validation...
              </>
            ) : (
              "Verifier"
            )}
          </Button>

          {validateMutation.data && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                validateMutation.data.allowed
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <p className="font-semibold">
                {validateMutation.data.allowed ? "Allowed" : "Denied"}
              </p>
              <p className="text-xs mt-0.5">{validateMutation.data.reason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
