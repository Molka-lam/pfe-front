import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLicenseById, useUpdateLicense } from "@/hooks/useLicense";
import { License } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, ArrowLeft, Loader2, Save } from "lucide-react";

const PLAN_DEFAULTS: Record<
  "BASIC" | "PRO" | "ENTERPRISE",
  { max_users: number; api_calls_per_month: number; storage_gb: number }
> = {
  BASIC: { max_users: 5, api_calls_per_month: 10000, storage_gb: 10 },
  PRO: { max_users: 25, api_calls_per_month: 100000, storage_gb: 50 },
  ENTERPRISE: { max_users: 200, api_calls_per_month: 1000000, storage_gb: 500 },
};

export default function LicenseDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: license, isLoading, error } = useLicenseById(id);
  const updateMutation = useUpdateLicense();

  const [plan, setPlan] = useState<"BASIC" | "PRO" | "ENTERPRISE">("BASIC");
  const [status, setStatus] = useState<"active" | "suspended" | "expired">("active");
  const [expiresAt, setExpiresAt] = useState("");
  const [features, setFeatures] = useState<License["features"]>({
    advanced_ai: false,
    export_pdf: false,
    multi_user: false,
    api_access: true,
  });
  const [limits, setLimits] = useState<License["limits"]>(PLAN_DEFAULTS.BASIC);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!license) return;
    setPlan(license.plan);
    setStatus(license.status);
    setExpiresAt(new Date(license.expires_at).toISOString().split("T")[0]);
    setFeatures(license.features);
    setLimits(license.limits);
  }, [license]);

  const applyPlanDefaults = (nextPlan: "BASIC" | "PRO" | "ENTERPRISE") => {
    setPlan(nextPlan);
    setLimits(PLAN_DEFAULTS[nextPlan]);
    setFeatures({
      advanced_ai: nextPlan !== "BASIC",
      export_pdf: nextPlan !== "BASIC",
      multi_user: nextPlan !== "BASIC",
      api_access: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaved(false);

    if (!expiresAt) {
      setFormError("La date d'expiration est obligatoire.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id,
        payload: {
          plan,
          status,
          expires_at: new Date(expiresAt).toISOString(),
          features,
          limits,
        },
      });
      setSaved(true);
    } catch {
      setFormError("Mise à jour impossible. Vérifiez que l'API backend supporte PATCH /licenses/:id.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement de la licence...
      </div>
    );
  }

  if (error || !license) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-4 w-4" />
          Impossible de charger la licence.
        </div>
        <Button asChild variant="outline">
          <Link to="/admin/licenses">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Détail de la licence</h1>
          <p className="text-slate-500 mt-0.5 font-mono text-xs">{license.id}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Informations générales</CardTitle>
            <CardDescription>Tenant: {license.tenant_id}</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "suspended" | "expired")}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="expired">Expiré</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiration</Label>
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Plan</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 grid grid-cols-3 gap-3">
            {(["BASIC", "PRO", "ENTERPRISE"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => applyPlanDefaults(p)}
                className={`rounded-xl border-2 p-3 text-sm font-semibold transition-all ${
                  plan === p
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {p}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Fonctionnalités</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 grid grid-cols-2 gap-4">
            {(
              [
                ["advanced_ai", "IA avancée"],
                ["export_pdf", "Export PDF"],
                ["multi_user", "Multi-utilisateurs"],
                ["api_access", "Accès API"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={key}
                  checked={features[key]}
                  onCheckedChange={(value) => setFeatures((f) => ({ ...f, [key]: !!value }))}
                />
                <Label htmlFor={key}>{label}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Limites</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsers">Utilisateurs max</Label>
              <Input
                id="maxUsers"
                type="number"
                min={1}
                value={limits.max_users}
                onChange={(e) =>
                  setLimits((l) => ({ ...l, max_users: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiCalls">API calls / mois</Label>
              <Input
                id="apiCalls"
                type="number"
                min={0}
                value={limits.api_calls_per_month}
                onChange={(e) =>
                  setLimits((l) => ({ ...l, api_calls_per_month: Number(e.target.value) }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage">Stockage (Go)</Label>
              <Input
                id="storage"
                type="number"
                min={1}
                value={limits.storage_gb}
                onChange={(e) =>
                  setLimits((l) => ({ ...l, storage_gb: Number(e.target.value) }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {formError && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {formError}
          </p>
        )}

        {saved && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            Licence mise à jour avec succès.
          </p>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button type="submit" className="flex-1" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
