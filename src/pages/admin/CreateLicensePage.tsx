import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateLicense } from "@/hooks/useLicense";
import { useTenants } from "@/hooks/useTenants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { License } from "@/types";

const PLANS: Array<"BASIC" | "PRO" | "ENTERPRISE"> = ["BASIC", "PRO", "ENTERPRISE"];

const PLAN_DEFAULTS: Record<
  "BASIC" | "PRO" | "ENTERPRISE",
  { max_users: number; api_calls_per_month: number; storage_gb: number }
> = {
  BASIC:      { max_users: 5,   api_calls_per_month: 10000,  storage_gb: 10 },
  PRO:        { max_users: 25,  api_calls_per_month: 100000, storage_gb: 50 },
  ENTERPRISE: { max_users: 200, api_calls_per_month: 1000000, storage_gb: 500 },
};

export default function CreateLicensePage() {
  const navigate = useNavigate();
  const createMutation = useCreateLicense();
  const { data: tenants, isLoading: loadingTenants } = useTenants();

  const [tenantId, setTenantId] = useState("");
  const [plan, setPlan] = useState<"BASIC" | "PRO" | "ENTERPRISE">("BASIC");
  const [expiresAt, setExpiresAt] = useState("");
  const [features, setFeatures] = useState({
    advanced_ai: false,
    export_pdf: true,
    multi_user: false,
    api_access: true,
  });
  const [limits, setLimits] = useState(PLAN_DEFAULTS["BASIC"]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePlanChange = (p: "BASIC" | "PRO" | "ENTERPRISE") => {
    setPlan(p);
    setLimits(PLAN_DEFAULTS[p]);
    // Set default features based on plan
    setFeatures({
      advanced_ai: p === "ENTERPRISE",
      export_pdf: p !== "BASIC",
      multi_user: p !== "BASIC",
      api_access: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!tenantId || !expiresAt) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const payload: Partial<License> = {
      tenant_id: tenantId,
      plan,
      status: "active",
      expires_at: new Date(expiresAt).toISOString(),
      features,
      limits,
    };

    try {
      await createMutation.mutateAsync(payload);
      setSuccess(true);
      setTimeout(() => navigate("/admin/licenses"), 1500);
    } catch {
      setError("Erreur lors de la création de la licence. Vérifiez les données.");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <p className="text-lg font-semibold text-slate-800">
          Licence créée avec succès !
        </p>
        <p className="text-slate-500 text-sm">Redirection vers la liste...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Nouvelle licence
          </h1>
          <p className="text-slate-500 mt-0.5">
            Créez une licence pour un nouveau tenant
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tenant */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Informations du tenant</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="tenantId" className="font-medium">
                Client (Tenant) <span className="text-red-500">*</span>
              </Label>
              {loadingTenants ? (
                <div className="flex items-center text-xs text-slate-500 gap-2 p-2 border rounded bg-slate-50">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Chargement des clients...
                </div>
              ) : (
                <select
                  id="tenantId"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Sélectionner un client --</option>
                  {tenants?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
              )}
              {!loadingTenants && tenants?.length === 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-100 italic">
                  Aucun client trouvé. Créez-en un d'abord dans la section Clients.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt" className="font-medium">
                Date d'expiration <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expiresAt"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
                min={new Date().toISOString().split("T")[0]}
                className="border-slate-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* Plan */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Plan</CardTitle>
            <CardDescription>
              Sélectionnez le plan pour cette licence
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-3">
              {PLANS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePlanChange(p)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-sm font-semibold transition-all ${
                    plan === p
                      ? p === "BASIC"
                        ? "border-slate-500 bg-slate-50 text-slate-700"
                        : p === "PRO"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {p}
                  <span className="text-xs font-normal">
                    {PLAN_DEFAULTS[p].max_users} users /{" "}
                    {PLAN_DEFAULTS[p].storage_gb}Go
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features */}
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
                  onCheckedChange={(v) =>
                    setFeatures((f) => ({ ...f, [key]: !!v }))
                  }
                />
                <Label htmlFor={key} className="cursor-pointer font-normal">
                  {label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Limits */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Limites</CardTitle>
            <CardDescription>
              Pré-remplies selon le plan. Modifiables si besoin.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsers" className="font-medium text-xs text-slate-500 uppercase tracking-wide">
                Utilisateurs max
              </Label>
              <Input
                id="maxUsers"
                type="number"
                min={1}
                value={limits.max_users}
                onChange={(e) =>
                  setLimits((l) => ({
                    ...l,
                    max_users: Number(e.target.value),
                  }))
                }
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiCalls" className="font-medium text-xs text-slate-500 uppercase tracking-wide">
                API calls / mois
              </Label>
              <Input
                id="apiCalls"
                type="number"
                min={0}
                value={limits.api_calls_per_month}
                onChange={(e) =>
                  setLimits((l) => ({
                    ...l,
                    api_calls_per_month: Number(e.target.value),
                  }))
                }
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage" className="font-medium text-xs text-slate-500 uppercase tracking-wide">
                Stockage (Go)
              </Label>
              <Input
                id="storage"
                type="number"
                min={1}
                value={limits.storage_gb}
                onChange={(e) =>
                  setLimits((l) => ({
                    ...l,
                    storage_gb: Number(e.target.value),
                  }))
                }
                className="border-slate-200"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              "Créer la licence"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
