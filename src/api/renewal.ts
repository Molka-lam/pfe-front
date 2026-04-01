import api from "@/api/axios";
import { ApiEnvelope, License } from "@/types";

export interface RenewalRequest {
  id: string;
  license_id: string;
  tenant_id: string;
  message: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  updated_at: string;
  license?: License;
  tenant?: {
    name: string;
    email?: string;
  };
}

export const renewalApi = {
  create: async (license_id: string, message: string): Promise<RenewalRequest> => {
    return (await api.post<ApiEnvelope<RenewalRequest>>("/licenses/renewal-requests", {
      license_id,
      message,
    })).data.data;
  },

  getAll: async (): Promise<RenewalRequest[]> => {
    return (await api.get<ApiEnvelope<RenewalRequest[]>>("/licenses/renewal-requests")).data.data;
  },

  updateStatus: async (id: string, status: RenewalRequest["status"]): Promise<RenewalRequest> => {
    return (await api.patch<ApiEnvelope<RenewalRequest>>(`/licenses/renewal-requests/${id}`, {
      status,
    })).data.data;
  },

  deleteOne: async (id: string): Promise<void> => {
    await api.delete(`/licenses/renewal-requests/${id}`);
  },

  bulkDelete: async (ids: string[]): Promise<{ deletedCount: number }> => {
    return (await api.post<ApiEnvelope<{ deletedCount: number }>>(`/licenses/renewal-requests/bulk-delete`, {
      ids,
    })).data.data;
  },

  deleteAll: async (): Promise<{ deletedCount: number }> => {
    return (await api.delete<ApiEnvelope<{ deletedCount: number }>>(`/licenses/renewal-requests`)).data.data;
  },
};
