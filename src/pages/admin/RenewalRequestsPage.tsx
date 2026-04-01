import { useMemo, useState } from "react";
import {
  useRenewalRequests,
  useUpdateRenewalStatus,
  useDeleteRenewalRequest,
  useBulkDeleteRenewalRequests,
  useDeleteAllRenewalRequests,
} from "@/hooks/useRenewal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle, XCircle, MessageSquare, ExternalLink, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/hooks/use-toast";

type DeleteMode = "single" | "selected" | "all" | null;

export default function RenewalRequestsPage() {
  const { data: requests, isLoading, error } = useRenewalRequests();
  const updateStatus = useUpdateRenewalStatus();
  const deleteOne = useDeleteRenewalRequest();
  const bulkDelete = useBulkDeleteRenewalRequests();
  const deleteAll = useDeleteAllRenewalRequests();
  const { toast } = useToast();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteMode, setDeleteMode] = useState<DeleteMode>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: "APPROVED" | "REJECTED") => {
    await updateStatus.mutateAsync({ id, status });
  };

  const requestIds = useMemo(() => (requests ?? []).map((r) => r.id), [requests]);
  const selectedCount = selectedIds.length;
  const isAllSelected = requestIds.length > 0 && selectedCount === requestIds.length;

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((v) => v !== id);
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? requestIds : []);
  };

  const openDeleteSingle = (id: string) => {
    setActiveRequestId(id);
    setDeleteMode("single");
  };

  const openDeleteSelected = () => {
    if (selectedCount === 0) return;
    setDeleteMode("selected");
  };

  const openDeleteAll = () => {
    if ((requests?.length ?? 0) === 0) return;
    setDeleteMode("all");
  };

  const closeDeleteModal = () => {
    setDeleteMode(null);
    setActiveRequestId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteMode) return;

    if (deleteMode === "single" && activeRequestId) {
      await deleteOne.mutateAsync(activeRequestId);
      setSelectedIds((prev) => prev.filter((id) => id !== activeRequestId));
      toast({ title: "Message supprimé", description: "La demande a été supprimée." });
      closeDeleteModal();
      return;
    }

    if (deleteMode === "selected") {
      const result = await bulkDelete.mutateAsync(selectedIds);
      setSelectedIds([]);
      toast({ title: "Messages supprimés", description: `${result.deletedCount} message(s) supprimé(s).` });
      closeDeleteModal();
      return;
    }

    if (deleteMode === "all") {
      const result = await deleteAll.mutateAsync();
      setSelectedIds([]);
      toast({ title: "Suppression totale", description: `${result.deletedCount} message(s) supprimé(s).` });
      closeDeleteModal();
    }
  };

  const isDeletePending = deleteOne.isPending || bulkDelete.isPending || deleteAll.isPending;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-4 w-4" />
          Impossible de charger les demandes de renouvellement.
        </div>
      </div>
    );
  }

  const pendingCount = requests?.filter(r => r.status === "PENDING").length ?? 0;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Demandes de Renouvellement</h1>
          {pendingCount > 0 && (
            <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
              {pendingCount} Nouvelle(s)
            </Badge>
          )}
        </div>
        <p className="text-slate-500">
          Gérez les demandes de renouvellement envoyées par vos clients.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm font-semibold">Toutes les demandes</CardTitle>
            <div className="flex items-center gap-2">
              {selectedCount > 0 && (
                <span className="text-xs text-slate-500">{selectedCount} sélectionné(s)</span>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={openDeleteSelected}
                disabled={selectedCount === 0 || isDeletePending}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={openDeleteAll}
                disabled={(requests?.length ?? 0) === 0 || isDeletePending}
              >
                Delete All Messages
              </Button>
            </div>
          </div>
          <CardDescription>Cliquez sur Approuver pour marquer une demande comme traitée.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/30">
                <TableHead className="w-[48px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(value) => toggleAll(Boolean(value))}
                    aria-label="Select all messages"
                  />
                </TableHead>
                <TableHead className="w-[200px]">Client</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead className="w-[120px]">Statut</TableHead>
                <TableHead className="w-[260px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                    Aucune demande de renouvellement pour le moment.
                  </TableCell>
                </TableRow>
              ) : (
                requests?.map((request) => (
                  <TableRow key={request.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(request.id)}
                        onCheckedChange={(value) => toggleOne(request.id, Boolean(value))}
                        aria-label={`Select message ${request.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-slate-900">{request.tenant?.name || "Sans nom"}</span>
                        <span className="text-xs text-slate-500">{request.tenant?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2 max-w-[400px]">
                        <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                        <p className="text-sm text-slate-600 italic line-clamp-2">
                          "{request.message || "Pas de message."}"
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {format(new Date(request.created_at), "dd/MM/yyyy HH:mm", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusChange(request.id, "REJECTED")}
                            disabled={updateStatus.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Refuser
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusChange(request.id, "APPROVED")}
                            disabled={updateStatus.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => openDeleteSingle(request.id)}
                            disabled={isDeletePending}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/admin/licenses`}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Voir Licence
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => openDeleteSingle(request.id)}
                            disabled={isDeletePending}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {deleteMode && (
        <ConfirmModal
          isOpen={true}
          title={
            deleteMode === "all"
              ? "Supprimer tous les messages"
              : deleteMode === "selected"
              ? "Supprimer les messages sélectionnés"
              : "Supprimer le message"
          }
          message={
            deleteMode === "all"
              ? "Cette action supprimera définitivement tous les messages de renouvellement."
              : deleteMode === "selected"
              ? `Cette action supprimera ${selectedCount} message(s) sélectionné(s).`
              : "Cette action supprimera définitivement ce message."
          }
          onConfirm={handleConfirmDelete}
          onCancel={closeDeleteModal}
          isLoading={isDeletePending}
          confirmLabel="Supprimer"
          variant="destructive"
        />
      )}
    </div>
  );
}
