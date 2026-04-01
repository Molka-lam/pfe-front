import { useState } from "react";
import { useMyLicense, useValidateFeature } from "@/hooks/useLicense";
import { useCreateRenewalRequest, useRenewalRequests } from "@/hooks/useRenewal";
import { LicenseFeatureKey } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Key,
  Shield,
  Users,
  Database,
  Cpu,
  Clock,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Zap,
  HardDrive,
  Loader2,
  Calendar,
  CheckCircle,
  XCircle,
  RotateCcw,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function MyLicensePage() {
  const { data: license, isLoading, error } = useMyLicense();
  const { data: requests } = useRenewalRequests();
  const validateFeature = useValidateFeature();
  const createRenewal = useCreateRenewalRequest();
  const { toast } = useToast();
  
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [renewModal, setRenewModal] = useState(false);
  const [renewMessage, setRenewMessage] = useState("Bonjour, je souhaite renouveler ma licence pour une nouvelle période.");
  const [featureToValidate, setFeatureToValidate] = useState<LicenseFeatureKey>("advanced_ai");

  const activeRequest = requests?.find(r => r.license_id === license?.id && r.status === "PENDING");
  const lastRequest = requests?.find(r => r.license_id === license?.id && r.status !== "PENDING");

  const handleCopy = () => {
    if (license?.license_key) {
      navigator.clipboard.writeText(license.license_key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRenew = async () => {
    if (!license) return;
    try {
      await createRenewal.mutateAsync({
        license_id: license.id,
        message: renewMessage
      });
      setRenewModal(false);
      toast({
        title: "Demande envoyée",
        description: "Votre demande de renouvellement a été transmise à l'administrateur.",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la demande. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleValidateFeature = async () => {
    await validateFeature.mutateAsync(featureToValidate);
  };

  const maskedKey = license?.license_key
    ? license.license_key.slice(0, 8) +
    "••••••••••••••••" +
    license.license_key.slice(-4)
    : "";

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Chargement de votre licence...
      </div>
    );
  }

  if (error || !license) {
    return (
      <div>
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-4 w-4" />
          Impossible de charger votre licence.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ma Licence</h1>
          <p className="text-slate-500">Détails de votre licence active</p>
        </div>
        <Button 
          onClick={() => setRenewModal(true)} 
          disabled={!!activeRequest}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {activeRequest ? "Demande en cours..." : "Renouveler"}
        </Button>
      </div>

      {activeRequest && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-orange-900 uppercase tracking-wider">Demande de renouvellement en attente</h3>
            <p className="text-sm text-orange-700">Votre demande a été envoyée. L'administrateur l'étudiera prochainement.</p>
          </div>
          <Badge variant="outline" className="bg-white border-orange-200 text-orange-600">
            En attente
          </Badge>
        </div>
      )}

      {lastRequest && !activeRequest && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-4 animate-in fade-in ${
          lastRequest.status === "APPROVED" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
            lastRequest.status === "APPROVED" ? "bg-green-100" : "bg-red-100"
          }`}>
            {lastRequest.status === "APPROVED" ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${
              lastRequest.status === "APPROVED" ? "text-green-900" : "text-red-900"
            }`}>
              {lastRequest.status === "APPROVED" ? "Renouvellement Approuvé" : "Renouvellement Refusé"}
            </h3>
            <p className={`text-sm ${
              lastRequest.status === "APPROVED" ? "text-green-700" : "text-red-700"
            }`}>
              {lastRequest.status === "APPROVED" 
                ? "Votre demande a été validée. Votre licence a été mise à jour." 
                : "Votre demande n'a pas pu être acceptée. Veuillez contacter le support."}
            </p>
          </div>
          <Badge variant="outline" className={`bg-white ${
            lastRequest.status === "APPROVED" 
              ? "border-green-200 text-green-600" 
              : "border-red-200 text-red-600"
          }`}>
            {lastRequest.status === "APPROVED" ? "Validé" : "Refusé"}
          </Badge>
        </div>
      )}

      {/* Status & Plan */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Informations générales</CardTitle>
              <CardDescription>Plan et statut de votre abonnement</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <PlanBadge plan={license.plan} />
              <StatusBadge status={license.status} />
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Créée le</p>
              <p className="text-sm font-medium text-slate-800">
                {format(new Date(license.created_at), "d MMMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Expire le</p>
              <p className="text-sm font-medium text-slate-800">
                {format(new Date(license.expires_at), "d MMMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Key */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Clé de licence</CardTitle>
          <CardDescription>
            Utilisez cette clé pour authentifier votre application
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
            <code className="flex-1 font-mono text-sm text-slate-700 break-all">
              {showKey ? license.license_key : maskedKey}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleCopy}
            >
              <Copy
                className={`h-4 w-4 ${copied ? "text-green-600" : ""}`}
              />
            </Button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-2">✓ Clé copiée !</p>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Fonctionnalités</CardTitle>
          <CardDescription>Activées selon votre plan {license.plan}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(
            [
              ["advanced_ai", "Intelligence Artificielle avancée"],
              ["export_pdf", "Export PDF"],
              ["multi_user", "Multi-utilisateurs"],
              ["api_access", "Accès API programmatique"],
            ] as const
          ).map(([key, label]) => (
            <div
              key={key}
              className={`flex items-center gap-3 rounded-lg p-3 border ${license.features[key as keyof typeof license.features]
                ? "border-green-200 bg-green-50"
                : "border-slate-100 bg-slate-50 opacity-60"
                }`}
            >
              {license.features[key as keyof typeof license.features] ? (
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-slate-400 shrink-0" />
              )}
              <span
                className={`text-sm font-medium ${license.features[key as keyof typeof license.features] ? "text-green-800" : "text-slate-400"
                  }`}
              >
                {label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Feature Validation */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Validation d'accès aux fonctionnalités</CardTitle>
          <CardDescription>
            Test direct de l'endpoint de validation pour ce tenant.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={featureToValidate}
              onChange={(e) => setFeatureToValidate(e.target.value as LicenseFeatureKey)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700"
            >
              <option value="advanced_ai">advanced_ai</option>
              <option value="export_pdf">export_pdf</option>
              <option value="multi_user">multi_user</option>
              <option value="api_access">api_access</option>
            </select>
            <Button
              onClick={handleValidateFeature}
              disabled={validateFeature.isPending}
              className="sm:w-auto"
            >
              {validateFeature.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Valider l'accès"
              )}
            </Button>
          </div>
          {validateFeature.data && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${validateFeature.data.allowed
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
                }`}
            >
              <p className="font-semibold">
                {validateFeature.data.allowed ? "Accès autorisé" : "Accès refusé"}
              </p>
              <p className="text-xs mt-0.5">{validateFeature.data.reason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Limits */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Limites d'utilisation</CardTitle>
          <CardDescription>Quota maximum de votre plan</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-slate-400" />
                Utilisateurs maximum
              </div>
              <span className="font-semibold text-slate-800">
                {license.limits.max_users.toLocaleString("fr-FR")}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Zap className="h-4 w-4 text-slate-400" />
                Appels API / mois
              </div>
              <span className="font-semibold text-slate-800">
                {license.limits.api_calls_per_month.toLocaleString("fr-FR")}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <HardDrive className="h-4 w-4 text-slate-400" />
                Stockage
              </div>
              <span className="font-semibold text-slate-800">
                {license.limits.storage_gb} Go
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={renewModal}
        title="Renouveler la licence"
        message={
          <div className="space-y-4">
            <p>Voulez-vous envoyer une demande de renouvellement à l'administrateur ?</p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Message (optionnel)</label>
              <textarea
                value={renewMessage}
                onChange={(e) => setRenewMessage(e.target.value)}
                placeholder="Écrivez votre message ici..."
                className="w-full min-h-[100px] p-3 text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>
        }
        onConfirm={handleRenew}
        onCancel={() => setRenewModal(false)}
        isLoading={createRenewal.isPending}
        confirmLabel="Envoyer la demande"
        variant="default"
      />
    </div>
  );
}
