import api from "@/api/axios";
import { User, AuthTokens, ApiEnvelope, RegisterPayload } from "@/types";

export const authApi = {
  login: async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const res = await api.post<ApiEnvelope<AuthTokens & { user: User }>>(
      "/auth/login",
      {
        email: normalizedEmail,
        password,
      }
    );
    return res.data.data;
  },

  register: async (payload: RegisterPayload) => {
    const normalizedPayload: RegisterPayload = {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    };
    const res = await api.post<ApiEnvelope<AuthTokens & { user: User }>>(
      "/auth/register",
      normalizedPayload
    );
    return res.data.data;
  },

  me: async () => {
    const res = await api.get<ApiEnvelope<User>>("/auth/me");
    return res.data.data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  refresh: async (refreshToken: string) => {
    const res = await api.post<ApiEnvelope<{ accessToken: string }>>(
      "/auth/refresh",
      { refreshToken }
    );
    return res.data.data;
  },
};
