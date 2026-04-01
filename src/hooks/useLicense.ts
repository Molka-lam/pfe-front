import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { licensesApi } from "@/api/licenses";
import { useAuth } from "@/context/AuthContext";
import { LicenseFeatureKey } from "@/types";

export function useMyLicense() {
  return useQuery({
    queryKey: ["license-me"],
    queryFn: licensesApi.getMine,
  });
}

export function useAllLicenses() {
  return useQuery({
    queryKey: ["licenses"],
    queryFn: licensesApi.getAll,
  });
}

export function useLicenseById(id: string) {
  return useQuery({
    queryKey: ["licenses", id],
    queryFn: () => licensesApi.getById(id),
    enabled: !!id,
  });
}

export function useRevokeLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: licensesApi.revoke,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["licenses"] }),
  });
}

export function useSuspendLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: licensesApi.suspend,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["licenses"] }),
  });
}

export function useDeleteLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: licensesApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["licenses"] });
      qc.invalidateQueries({ queryKey: ["license-me"] });
    },
  });
}

export function useUpdateLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof licensesApi.update>[1];
    }) => licensesApi.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["licenses"] });
      qc.invalidateQueries({ queryKey: ["licenses", id] });
      qc.invalidateQueries({ queryKey: ["license-me"] });
    },
  });
}

export function useCreateLicense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: licensesApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["licenses"] }),
  });
}

export function useUsageStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["usage", user?.tenant_id],
    queryFn: () => licensesApi.getUsage(user!.tenant_id),
    enabled: !!user?.tenant_id,
  });
}

export function useValidateFeature() {
  return useMutation({
    mutationFn: (feature: LicenseFeatureKey) => licensesApi.validate(feature),
  });
}
