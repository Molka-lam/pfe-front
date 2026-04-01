import api from "@/api/axios";
import { ApiEnvelope, Tenant } from "@/types";

export const tenantsApi = {
  getAll: async (): Promise<Tenant[]> => {
    return (await api.get<ApiEnvelope<Tenant[]>>("/tenants")).data.data;
  },

  getById: async (id: string): Promise<Tenant> => {
    return (await api.get<ApiEnvelope<Tenant>>(`/tenants/${id}`)).data.data;
  },

  create: async (data: Partial<Tenant>): Promise<Tenant> => {
    return (await api.post<ApiEnvelope<Tenant>>("/tenants", data)).data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/tenants/${id}`);
  },
};
