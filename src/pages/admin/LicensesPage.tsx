import { useState } from "react";
import { Link } from "react-router-dom";
import { useAllLicenses, useDeleteLicense, useSuspendLicense } from "@/hooks/useLicense";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlanBadge } from "@/components/ui/PlanBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Loader2,
  AlertCircle,
  PauseCircle,
  Eye,
  Trash2,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { License } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getLicenseExpirationStatus } from "@/lib/license-utils";
import { AlertCircle as AlertIcon } from "lucide-react";

type ModalAction = "suspend" | "delete" | null;

export default function LicensesPage() {
  const { data: licenses, isLoading, error } = useAllLicenses();
  const suspendMutation = useSuspendLicense();
  const deleteLicenseMutation = useDeleteLicense();

  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [modal, setModal] = useState<{
    action: ModalAction;
    license: License | null;
  }>({ action: null, license: null });

  const openModal = (action: ModalAction, license: License) =>
    setModal({ action, license });
  const closeModal = () => setModal({ action: null, license: null });

  const handleConfirm = async () => {
    if (!modal.license || !modal.action) return;
    const id = modal.license.id;
    if (modal.action === "suspend") await suspendMutation.mutateAsync(id);
    if (modal.action === "delete") await deleteLicenseMutation.mutateAsync(id);
    closeModal();
  };

  const expiringSoonCount = licenses?.filter((l) => {
    if (l.status !== "active") return false;
    return getLicenseExpirationStatus(l.expires_at).isExpiringSoon;
  }).length ?? 0;

  const filtered = licenses?.filter((l) => {
    const matchSearch =
      search === "" ||
      l.tenant_id.toLowerCase().includes(search.toLowerCase()) ||
      l.license_key.toLowerCase().includes(search.toLowerCase());
    const matchPlan = filterPlan === "all" || l.plan === filterPlan;
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchPlan && matchStatus;
  });

  const modalConfigs = {
    suspend: { title: "Suspendre la licence", confirmLabel: "Suspendre", variant: "destructive" as const },
    delete: {
      title: "Supprimer la licence",
      confirmLabel: "Supprimer la licence",
      variant: "destructive" as const,
    },
  };

  const currentModal = modal.action ? modalConfigs[modal.action] : null;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Licences</h1>
            {expiringSoonCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold animate-pulse shadow-sm border border-orange-200">
                <AlertCircle className="h-3 w-3" />
                {expiringSoonCount} à renouveler bientôt
              </div>
            )}
          </div>
          <p className="text-slate-500">
            {licenses?.length ?? 0} licence(s) au total
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-lg transition-all hover:scale-105">
          <Link to="/admin/licenses/create">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle licence
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 flex-1 min-w-48">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <Input
                placeholder="Rechercher par tenant ou clé..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 border-slate-200"
              />
            </div>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les plans</option>
              <option value="BASIC">BASIC</option>
              <option value="PRO">PRO</option>
              <option value="ENTERPRISE">ENTERPRISE</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="expired">Expiré</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        {isLoading && (
          <div className="flex items-center gap-2 p-6 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement...
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 p-6 text-red-700 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            Erreur lors du chargement des licences.
          </div>
        )}
        {filtered && (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-700">Client / Tenant</TableHead>
                <TableHead className="font-semibold text-slate-700">Clé (aperçu)</TableHead>
                <TableHead className="font-semibold text-slate-700">Plan</TableHead>
                <TableHead className="font-semibold text-slate-700">Statut</TableHead>
                <TableHead className="font-semibold text-slate-700">Expiration</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                    Aucune licence trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((license) => (
                  <TableRow key={license.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-slate-900">{license.tenant?.name || "Sans nom"}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{license.tenant_id.slice(0, 8)}…</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-600">
                      {license.license_key.slice(0, 12)}…
                    </TableCell>
                    <TableCell>
                      <PlanBadge plan={license.plan} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={license.status} />
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        {format(new Date(license.expires_at), "dd/MM/yyyy", {locale: fr})}
                        {license.status === "active" && getLicenseExpirationStatus(license.expires_at).isExpiringSoon && (
                          <span title="Expire bientôt !">
                            <AlertIcon className="h-4 w-4 text-orange-500 animate-bounce" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            title="Actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/licenses/${license.id}`} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              View license
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/licenses/${license.id}`} className="flex items-center gap-2">
                              <Pencil className="h-4 w-4" />
                              Edit license
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("suspend", license)}
                            disabled={license.status !== "active"}
                            className="flex items-center gap-2"
                          >
                            <PauseCircle className="h-4 w-4" />
                            Pause license
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("delete", license)}
                            className="flex items-center gap-2 text-red-600 focus:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete license
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {currentModal && modal.license && (
        <ConfirmModal
          isOpen={true}
          title={currentModal.title}
          message={
            modal.action === "delete"
              ? `Vous êtes sur le point de supprimer la licence ${modal.license.license_key.slice(0, 12)}… du client ${modal.license.tenant?.name || modal.license.tenant_id.slice(0, 8)}. Seule cette licence sera supprimée.`
              : `Vous êtes sur le point de suspendre la licence du client ${modal.license.tenant?.name || modal.license.tenant_id.slice(0, 8)}.`
          }
          onConfirm={handleConfirm}
          onCancel={closeModal}
          isLoading={
            suspendMutation.isPending ||
            deleteLicenseMutation.isPending
          }
          confirmLabel={currentModal.confirmLabel}
          variant={currentModal.variant}
        />
      )}
    </div>
  );
}
