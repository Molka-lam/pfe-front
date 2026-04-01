export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client";
  tenant_id: string;
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  error?: string;
}

export type LicenseFeatureKey =
  | "advanced_ai"
  | "export_pdf"
  | "multi_user"
  | "api_access";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  name: string;
  companyName?: string;
  email: string;
  password: string;
}

export interface License {
  id: string;
  tenant_id: string;
  license_key: string;
  plan: "BASIC" | "PRO" | "ENTERPRISE";
  status: "active" | "suspended" | "expired";
  expires_at: string;
  features: Record<LicenseFeatureKey, boolean>;
  limits: {
    max_users: number;
    api_calls_per_month: number;
    storage_gb: number;
  };
  created_at: string;
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UsageStats {
  tenant_id: string;
  api_calls_used: number;
  api_calls_limit: number;
  users_count: number;
  users_limit: number;
  storage_used_gb: number;
  storage_limit_gb: number;
  period_start: string;
  period_end: string;
}

export interface Plan {
  name: "BASIC" | "PRO" | "ENTERPRISE";
  price_monthly: number;
  features: string[];
  limits: {
    max_users: number;
    api_calls_per_month: number;
    storage_gb: number;
  };
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface RenewalRequest {
  id: string;
  license_id: string;
  tenant_id: string;
  message?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: string;
  updated_at: string;
  tenant?: Tenant;
  license?: License;
}
