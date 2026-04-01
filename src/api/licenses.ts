import api from "@/api/axios";
import { ApiEnvelope, License, LicenseFeatureKey, UsageStats } from "@/types";

interface ValidateLicenseResponse {
  allowed: boolean;
  reason: string;
}

const mockLicenses: License[] = [
  {
    id: "lic-1",
    tenant_id: "Acme Corp",
    license_key: "XXXX-XXXX-XXXX-XXXX-1111",
    plan: "PRO",
    status: "active",
    expires_at: new Date(Date.now() + 86400000 * 30).toISOString(),
    features: {
      advanced_ai: true,
      export_pdf: true,
      multi_user: true,
      api_access: true,
    },
    limits: { max_users: 25, api_calls_per_month: 100000, storage_gb: 50 },
    created_at: new Date().toISOString(),
  },
  {
    id: "lic-2",
    tenant_id: "Global Tech",
    license_key: "XXXX-XXXX-XXXX-XXXX-2222",
    plan: "BASIC",
    status: "suspended",
    expires_at: new Date(Date.now() - 86400000).toISOString(),
    features: {
      advanced_ai: false,
      export_pdf: true,
      multi_user: false,
      api_access: true,
    },
    limits: { max_users: 5, api_calls_per_month: 10000, storage_gb: 10 },
    created_at: new Date().toISOString(),
  },
];

export const licensesApi = {
  // Admin
  getAll: async (): Promise<License[]> => {
    return (await api.get<ApiEnvelope<License[]>>("/licenses")).data.data;
  },

  getById: async (id: string): Promise<License> => {
    return (await api.get<ApiEnvelope<License>>(`/licenses/${id}`)).data.data;
  },

  create: async (data: Partial<License>): Promise<License> => {
    return (await api.post<ApiEnvelope<License>>("/licenses", data)).data.data;
  },

  update: async (
    id: string,
    data: Partial<Pick<License, "plan" | "expires_at" | "features" | "limits" | "status">>
  ): Promise<License> => {
    return (await api.patch<ApiEnvelope<License>>(`/licenses/${id}`, data)).data.data;
  },

  revoke: async (id: string): Promise<void> => {
    await api.patch(`/licenses/${id}/revoke`);
  },

  suspend: async (id: string): Promise<void> => {
    await api.patch(`/licenses/${id}/suspend`);
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/licenses/${id}`);
  },

  // Client
  getMine: async (): Promise<License> => {
    return (await api.get<ApiEnvelope<License>>("/licenses/me")).data.data;
  },

  validate: async (
    feature: LicenseFeatureKey
  ): Promise<ValidateLicenseResponse> => {
    const response = await api.post<ApiEnvelope<ValidateLicenseResponse>>(
      "/licenses/validate",
      { feature }
    );
    return response.data.data;
  },

  // Usage
  getUsage: async (tenantId: string): Promise<UsageStats> => {
    return (await api.get<ApiEnvelope<UsageStats>>(`/usage/${tenantId}`)).data.data;
  },
};
