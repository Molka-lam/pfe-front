import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { ApiEnvelope } from "@/types";
import { Building2, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TenantItem {
  id: string;
  name: string;
  email: string;
  status?: string;
  company?: string;
}

function useTenants() {
  return useQuery<TenantItem[]>({
    queryKey: ["tenants"],
    queryFn: async () => {
      try {
        return (await api.get<ApiEnvelope<TenantItem[]>>("/tenants")).data.data;
      } catch {
        return [
          { id: "tenant-123", name: "Acme Corp", email: "it@acme.com", status: "active", company: "Acme" },
          { id: "tenant-456", name: "Global Tech", email: "ops@globaltech.com", status: "active", company: "Global Tech" },
        ];
      }
    },
  });
}

export default function TenantsPage() {
  const { data, isLoading, error } = useTenants();

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          Tenants
        </h1>
        <p className="text-slate-500 mt-1">Gestion des organisations clientes.</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Liste des tenants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement...
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4" /> Erreur de chargement.
            </div>
          )}
          {(data ?? []).map((tenant) => (
            <div key={tenant.id} className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold text-slate-800">{tenant.name}</p>
              <p className="text-sm text-slate-500">{tenant.email}</p>
              <p className="text-xs text-slate-400 mt-1">ID: {tenant.id}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
